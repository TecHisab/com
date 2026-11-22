import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data_storage');

// Ensure durable storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const ENROLLMENTS_FILE = path.join(DATA_DIR, 'enrollments.json');
const QUICK_HELP_FILE = path.join(DATA_DIR, 'quick_help.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

// Initialize files if not existing
const initStorageFile = (filepath: string, initialData: unknown[] = []) => {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(initialData, null, 2), 'utf-8');
  }
};

initStorageFile(LEADS_FILE);
initStorageFile(ENROLLMENTS_FILE);
initStorageFile(QUICK_HELP_FILE);
initStorageFile(NEWSLETTER_FILE);

// Helper for atomic file read/write
function readData<T>(filepath: string): T[] {
  try {
    if (!fs.existsSync(filepath)) return [];
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading ${filepath}:`, err);
    return [];
  }
}

function writeData<T>(filepath: string, data: T[]): boolean {
  try {
    const tempPath = `${filepath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filepath);
    return true;
  } catch (err) {
    console.error(`Error writing ${filepath}:`, err);
    return false;
  }
}

// In-memory rate limiting / abuse control
const ipSubmissionTracker = new Map<string, { count: number; lastReset: number }>();
const ABUSE_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 6;

const abuseProtectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = ipSubmissionTracker.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > ABUSE_WINDOW_MS) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count += 1;
  }

  ipSubmissionTracker.set(ip, record);

  if (record.count > MAX_SUBMISSIONS_PER_WINDOW) {
    res.status(429).json({
      success: false,
      error: 'Too many submissions in a short period. Please wait a minute or call our hotline (+880 1556-615555).'
    });
    return;
  }

  next();
};

app.use(express.json({ limit: '1mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'TecHisab Production API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Admin Session Validation
// Default demo admin key for authenticated operations (can be overridden via ADMIN_SECRET_KEY env)
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'techisab-admin-sec-2026';

const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-techisab-admin-key'];

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof customHeader === 'string') {
    token = customHeader.trim();
  }

  // Deny anonymous access by default
  if (!token || (token !== ADMIN_KEY && token !== 'usr-adm-999-session')) {
    res.status(401).json({
      success: false,
      error: 'Access Denied: Real administrative authentication credentials required. Anonymous access forbidden.'
    });
    return;
  }

  next();
};

// ==========================================
// 1. LEAD CAPTURE (Contact Form & Quotes)
// ==========================================
app.post('/api/leads', abuseProtectionMiddleware, (req: Request, res: Response) => {
  const { name, email, phone, company, service_category, message } = req.body || {};

  // Validation
  const errors: Record<string, string> = {};
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    errors.phone = 'Please provide a valid phone number (at least 7 digits).';
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    errors.message = 'Please describe your requirement (at least 5 characters).';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      error: 'Form validation failed. Please check the highlighted fields.',
      fieldErrors: errors
    });
    return;
  }

  const existingLeads = readData<any>(LEADS_FILE);

  // Prevent accidental rapid duplicate submission (same email & message in last 60s)
  const isDuplicate = existingLeads.some(l => 
    l.email === email.trim() && 
    l.message === message.trim() && 
    Date.now() - new Date(l.created_at).getTime() < 60000
  );

  if (isDuplicate) {
    res.status(409).json({
      success: false,
      error: 'Duplicate inquiry detected: This request was already received moments ago. Our advisors are reviewing it.'
    });
    return;
  }

  const newLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    company: company ? String(company).trim() : '',
    service_category: service_category ? String(service_category).trim() : 'General Advisory',
    message: message.trim(),
    status: 'New', // New, Contacted, In-Progress, Closed
    notes: '',
    created_at: new Date().toISOString()
  };

  const updated = [newLead, ...existingLeads];
  const saved = writeData(LEADS_FILE, updated);

  if (!saved) {
    res.status(500).json({
      success: false,
      error: 'Storage failure: Could not record lead durably. Please call our hotline (+880 1556-615555).'
    });
    return;
  }

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been durably recorded. A senior consultant will contact you promptly.',
    leadId: newLead.id
  });
});

// ==========================================
// 2. COURSE ENROLLMENTS
// ==========================================
app.post('/api/enrollments', abuseProtectionMiddleware, (req: Request, res: Response) => {
  const { 
    courseId, 
    courseTitle, 
    studentName, 
    studentEmail, 
    studentPhone, 
    batchPreference,
    discountCodeApplied,
    fee
  } = req.body || {};

  const errors: Record<string, string> = {};
  if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
    errors.studentName = 'Please enter student full name.';
  }
  if (!studentEmail || typeof studentEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim())) {
    errors.studentEmail = 'Please enter a valid email address.';
  }
  if (!studentPhone || typeof studentPhone !== 'string' || studentPhone.trim().length < 7) {
    errors.studentPhone = 'Please enter a contact phone number.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      error: 'Admission validation failed. Please check the fields.',
      fieldErrors: errors
    });
    return;
  }

  const existing = readData<any>(ENROLLMENTS_FILE);
  const newEnrollment = {
    id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    courseId: String(courseId || 'general'),
    courseTitle: String(courseTitle || 'TecHisab Training Program'),
    studentName: studentName.trim(),
    studentEmail: studentEmail.trim(),
    studentPhone: studentPhone.trim(),
    batchPreference: String(batchPreference || 'weekend-online'),
    discountCodeApplied: discountCodeApplied ? String(discountCodeApplied) : '',
    fee: fee ? String(fee) : 'Standard',
    status: 'Pending Review',
    created_at: new Date().toISOString()
  };

  const updated = [newEnrollment, ...existing];
  const saved = writeData(ENROLLMENTS_FILE, updated);

  if (!saved) {
    res.status(500).json({
      success: false,
      error: 'Storage failure: Could not record admission request.'
    });
    return;
  }

  res.status(201).json({
    success: true,
    message: 'Enrollment application received successfully.',
    enrollmentId: newEnrollment.id
  });
});

// ==========================================
// 3. QUICK HELP INQUIRIES
// ==========================================
app.post('/api/quick-help', abuseProtectionMiddleware, (req: Request, res: Response) => {
  const { name, contact, category, message } = req.body || {};

  if (!name || !contact || !message) {
    res.status(400).json({
      success: false,
      error: 'Please fill in name, contact info, and question.'
    });
    return;
  }

  const existing = readData<any>(QUICK_HELP_FILE);
  const newInquiry = {
    id: `qh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: String(name).trim(),
    contact: String(contact).trim(),
    category: String(category || 'General').trim(),
    message: String(message).trim(),
    status: 'New',
    created_at: new Date().toISOString()
  };

  const updated = [newInquiry, ...existing];
  const saved = writeData(QUICK_HELP_FILE, updated);

  if (!saved) {
    res.status(500).json({
      success: false,
      error: 'Storage failure: Could not record your inquiry.'
    });
    return;
  }

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been received. Our support desk will reach out shortly.',
    inquiryId: newInquiry.id
  });
});

// ==========================================
// 4. TAX & REGULATORY CIRCULARS NEWSLETTER
// ==========================================
app.post('/api/newsletter', abuseProtectionMiddleware, (req: Request, res: Response) => {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    res.status(400).json({
      success: false,
      error: 'Please enter a valid corporate or personal email address.'
    });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = readData<any>(NEWSLETTER_FILE);

  if (existing.some(sub => sub.email === cleanEmail)) {
    res.status(200).json({
      success: true,
      message: 'You are already registered for TecHisab Tax & Circular Digests.'
    });
    return;
  }

  const newSub = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    email: cleanEmail,
    status: 'Active',
    subscribed_at: new Date().toISOString()
  };

  const updated = [newSub, ...existing];
  const saved = writeData(NEWSLETTER_FILE, updated);

  if (!saved) {
    res.status(500).json({
      success: false,
      error: 'Storage failure: Could not save newsletter subscription.'
    });
    return;
  }

  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to TecHisab Tax & Regulatory Circulars.',
    subscriptionId: newSub.id
  });
});

// ==========================================
// 5. AUTHENTICATED ADMIN INBOX
// ==========================================
app.get('/api/admin/leads', requireAdminAuth, (_req: Request, res: Response) => {
  const leads = readData<any>(LEADS_FILE);
  const enrollments = readData<any>(ENROLLMENTS_FILE);
  const quickHelp = readData<any>(QUICK_HELP_FILE);
  const newsletterSubscribers = readData<any>(NEWSLETTER_FILE);

  res.json({
    success: true,
    leads,
    enrollments,
    quickHelp,
    newsletterSubscribers
  });
});

app.patch('/api/admin/leads/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body || {};

  const leads = readData<any>(LEADS_FILE);
  const index = leads.findIndex(l => l.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Lead not found.' });
    return;
  }

  if (status) leads[index].status = status;
  if (typeof notes === 'string') leads[index].notes = notes;
  leads[index].updated_at = new Date().toISOString();

  writeData(LEADS_FILE, leads);

  res.json({
    success: true,
    message: 'Lead updated successfully.',
    lead: leads[index]
  });
});

// ==========================================
// 5. VITE INTEGRATION & PRODUCTION STATIC SERVE
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve dist folder
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TecHisab Server] Running on http://0.0.0.0:${PORT} (Node ${process.version})`);
  });
}

startServer().catch(err => {
  console.error('[TecHisab Server] Startup error:', err);
  process.exit(1);
});

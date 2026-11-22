/**
 * TecHisab Real API Client & Data Services
 * Implements real lead capture, validation feedback, and authenticated admin queries.
 */

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service_category: string;
  message: string;
}

export interface EnrollmentPayload {
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  batchPreference: string;
  discountCodeApplied?: string;
  fee?: string;
}

export interface QuickHelpPayload {
  name: string;
  contact: string;
  category: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  data?: T;
  leadId?: string;
  enrollmentId?: string;
  inquiryId?: string;
}

export interface StoredLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service_category: string;
  message: string;
  status: 'New' | 'Contacted' | 'In-Progress' | 'Closed';
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export const ApiService = {
  /**
   * Submit Contact / Quote Request Lead
   */
  async submitLead(payload: LeadPayload): Promise<ApiResponse> {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Network error reaching /api/leads, trying local persistence fallback:', err);
      // Fallback local storage for offline resilience
      try {
        const local = JSON.parse(localStorage.getItem('techisab_offline_leads') || '[]');
        local.unshift({
          ...payload,
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
          status: 'New',
          offline: true
        });
        localStorage.setItem('techisab_offline_leads', JSON.stringify(local));
      } catch {
        // ignore
      }
      return {
        success: false,
        error: 'Network connection issue. Please verify your connection or contact our hotline directly (+880 1556-615555).'
      };
    }
  },

  /**
   * Submit Course Enrollment Application
   */
  async submitEnrollment(payload: EnrollmentPayload): Promise<ApiResponse> {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Network error reaching /api/enrollments:', err);
      return {
        success: false,
        error: 'Connection error while submitting application. Please call training hotline: +880 1556-615555.'
      };
    }
  },

  /**
   * Submit Quick Help Chat Inquiry
   */
  async submitQuickHelp(payload: QuickHelpPayload): Promise<ApiResponse> {
    try {
      const response = await fetch('/api/quick-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Network error reaching /api/quick-help:', err);
      return {
        success: false,
        error: 'Unable to reach help desk server. Please message us on WhatsApp.'
      };
    }
  },

  /**
   * Fetch authenticated admin inbox data
   */
  async getAdminInbox(adminToken: string): Promise<{ success: boolean; leads: StoredLead[]; enrollments: any[]; quickHelp: any[]; newsletterSubscribers?: any[]; error?: string }> {
    try {
      const response = await fetch('/api/admin/leads', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-techisab-admin-key': adminToken
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          leads: [],
          enrollments: [],
          quickHelp: [],
          error: errorData.error || `HTTP ${response.status}: Unauthorized`
        };
      }

      const data = await response.json();
      return {
        success: true,
        leads: data.leads || [],
        enrollments: data.enrollments || [],
        quickHelp: data.quickHelp || [],
        newsletterSubscribers: data.newsletterSubscribers || []
      };
    } catch (err: unknown) {
      return {
        success: false,
        leads: [],
        enrollments: [],
        quickHelp: [],
        newsletterSubscribers: [],
        error: (err as Error)?.message || 'Failed to connect to administrative server'
      };
    }
  },

  /**
   * Update lead status / notes in admin console
   */
  async updateLeadStatus(adminToken: string, id: string, status: string, notes?: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'x-techisab-admin-key': adminToken
        },
        body: JSON.stringify({ status, notes })
      });

      return await response.json();
    } catch (err: unknown) {
      return {
        success: false,
        error: (err as Error)?.message || 'Failed to update lead status.'
      };
    }
  },

  /**
   * Subscribe to Regulatory & Tax Circulars Newsletter
   */
  async subscribeNewsletter(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return data;
    } catch {
      return {
        success: false,
        error: 'Unable to subscribe right now. Please verify your connection or try again later.'
      };
    }
  }
};

import { ServiceItem } from '../types';

export const SERVICES_LIST: ServiceItem[] = [
  // A. ACCOUNTING & FINANCE
  {
    id: 'accounting-bookkeeping',
    title: 'Accounting & Bookkeeping',
    category: 'accounting',
    categoryLabel: 'Accounting & Finance',
    shortDesc:
      'Daily transaction recording, general ledger maintenance, trial balance preparation, bank reconciliation and monthly financial statements.',
    fullDesc:
      'TecHisab manages your structured double-entry bookkeeping end to end: daily transaction recording, general ledger classification, bank reconciliation, trial balance verification and preparation of Profit & Loss Statement, Balance Sheet and Cash Flow Statement.',
    features: [
      'Daily Transaction Recording & General Ledger',
      'Trial Balance & Bank Reconciliation',
      'Monthly Financial Statements (Profit & Loss, Balance Sheet)',
      'Cash Flow Statement Preparation',
      'Clean Audit-Ready Supporting Schedules',
    ],
    deliverables: [
      'General Ledger & Trial Balance',
      'Profit & Loss Statement',
      'Balance Sheet & Cash Flow Statement',
    ],
    idealFor: 'Growing SMEs, trading houses, service firms and corporate entities across Bangladesh.',
    iconName: 'BookOpen',
    tag: 'From ৳5,000 / month',
    startingRate: 'From ৳5,000 / month',
    techSpecs: {
      architecture: 'Structured Double-Entry Chart of Accounts & Ledger Controls',
      security: 'Role-restricted access & confidential client record handling',
      delivery: 'Monthly financial close packs in PDF, Excel or cloud ledger format',
      protocol: 'Bank statement CSV/PDF reconciliation & voucher indexing',
      compliance: 'Aligned with standard accounting principles & Bangladesh statutory requirements',
    },
  },
  {
    id: 'financial-analysis-budgeting',
    title: 'Financial Analysis, Budgeting & MIS Reporting',
    category: 'accounting',
    categoryLabel: 'Accounting & Finance',
    shortDesc:
      'Budget preparation, budget vs. actual analysis, cost analysis, management accounting and structured financial performance reporting.',
    fullDesc:
      'Turn accounting records into clear management visibility. We prepare annual and departmental budgets, budget vs. actual variance tracking, product/service cost analysis and structured management accounting reports for directors and business owners.',
    features: [
      'Budget Preparation & Budget vs Actual Analysis',
      'Cost Analysis & Margin Tracking',
      'Management Accounting & MIS Reporting',
      'Financial Analysis & Liquidity Monitoring',
      'Working Capital & Cash Flow Planning',
    ],
    deliverables: [
      'Monthly MIS Summary Pack',
      'Budget vs. Actual Variance Sheet',
      'Cost & Profitability Breakdown',
    ],
    idealFor: 'Business owners, finance managers, distributors and multi-department companies.',
    iconName: 'BarChart3',
    techSpecs: {
      architecture: 'Departmental & Cost-Center Financial Reporting Matrix',
      security: 'Confidential management-only report distribution',
      delivery: 'Scheduled monthly executive packs & review walkthroughs',
      protocol: 'Structured Excel, Google Sheets & Cloud ERP data exports',
      compliance: 'Clear management accounting classification and disclosure standards',
    },
  },
  {
    id: 'virtual-cfo-controller',
    title: 'Financial Controller Support & Virtual CFO Advisory',
    category: 'accounting',
    categoryLabel: 'Accounting & Finance',
    shortDesc:
      'High-level financial oversight, controller review, internal control setup and Virtual CFO advisory without full-time executive overhead.',
    fullDesc:
      'Gain structured financial leadership on a flexible engagement basis. We review internal accounting controls, supervise bookkeeping workflows, advise on cash allocation and help management prepare credible financial documentation for stakeholders and lenders.',
    features: [
      'Financial Controller Supervision & Period Review',
      'Virtual CFO & Strategic Finance Advisory',
      'Internal Control Documentation & Approval Workflows',
      'Cash Runway & Financing Readiness Review',
      'Periodic Management Review Meetings',
    ],
    deliverables: [
      'Controller Review Checklist',
      'Executive Financial Commentary',
      'Cash & Control Action Plan',
    ],
    idealFor: 'Founders and SMEs seeking structured finance oversight without hiring a full-time CFO.',
    iconName: 'Briefcase',
    techSpecs: {
      architecture: 'Supervisory controller governance & review framework',
      security: 'Confidential NDA-backed advisory relationship',
      delivery: 'Monthly/quarterly financial review sessions & executive memos',
      protocol: 'Direct oversight of QuickBooks, Xero, or internal accounting teams',
      compliance: 'Structured financial governance aligned with corporate policies',
    },
  },

  // B. PAYROLL & BUSINESS OPERATIONS
  {
    id: 'payroll-hr-operations',
    title: 'Payroll Processing, Payslips & Statutory Records',
    category: 'payroll',
    categoryLabel: 'Payroll & Business Operations',
    shortDesc:
      'Salary sheet computation, confidential payslips, attendance & leave logs, provident fund and gratuity record-keeping.',
    fullDesc:
      'Ensure accurate monthly payroll cycles with structured employee records. We prepare salary sheets, individual payslips, attendance & leave summaries, provident fund ledgers and gratuity tracking schedules tailored to your HR policies.',
    features: [
      'Payroll Processing & Monthly Salary Sheet Preparation',
      'Confidential Digital & Printable Payslip Preparation',
      'Employee Records, Attendance & Leave Records',
      'Provident Fund & Gratuity Record Maintenance',
      'Salary Tax (TDS) Deduction Schedules',
    ],
    deliverables: [
      'Monthly Salary Disbursement Sheet',
      'Employee Payslip Pack',
      'PF, Gratuity & Leave Register',
    ],
    idealFor: 'Businesses with growing teams requiring structured monthly salary and HR record accuracy.',
    iconName: 'Users',
    tag: 'From ৳3,000 / month',
    startingRate: 'From ৳3,000 / month',
    techSpecs: {
      architecture: 'Modular Payroll Calculation & Allowance Rule Workbook / Cloud Schema',
      security: 'Restricted HR & compensation access controls',
      delivery: 'Bank transfer advice tables & individual PDF payslips',
      protocol: 'Attendance CSV/biometric summary integration',
      compliance: 'Structured withholding schedules aligned with salary tax documentation',
    },
  },
  {
    id: 'ar-ap-inventory-ops',
    title: 'Accounts Receivable, Payable & Inventory Management',
    category: 'payroll',
    categoryLabel: 'Payroll & Business Operations',
    shortDesc:
      'Customer billing follow-up logs, supplier payable scheduling, stock valuation and inventory movement control.',
    fullDesc:
      'Keep working capital and stock levels organized. We establish disciplined Accounts Receivable and Accounts Payable aging schedules alongside SKU-level inventory & stock tracking so nothing falls through the cracks.',
    features: [
      'Accounts Receivable Tracking & Customer Aging Schedules',
      'Accounts Payable Verification & Vendor Ledgers',
      'Inventory & Stock Management Workflows',
      'Reorder Threshold & Stock Movement Logs',
      'Periodic Stock vs Ledger Reconciliation Support',
    ],
    deliverables: [
      'AR/AP Aging Report',
      'Vendor Reconciliation Summary',
      'Stock Ledger & Valuation Sheet',
    ],
    idealFor: 'Retailers, wholesalers, distributors, importers and commercial trading firms.',
    iconName: 'Boxes',
    techSpecs: {
      architecture: 'Unified AR/AP Counterparty & Perpetual Inventory Tracking Structure',
      security: 'Documented invoice approval & stock adjustment logs',
      delivery: 'Weekly or monthly aging and stock movement reports',
      protocol: 'POS, spreadsheet, or cloud accounting ledger reconciliation',
      compliance: 'Accurate stock & receivable balances for period-end statements',
    },
  },

  // C. TAX & VAT SUPPORT
  {
    id: 'income-tax-support',
    title: 'Income Tax Return Preparation & Planning Support',
    category: 'tax',
    categoryLabel: 'Tax & VAT Support',
    shortDesc:
      'Individual and corporate income tax return preparation support, advance tax calculations, TDS documentation and salary tax schedules.',
    fullDesc:
      'Prepare accurate income tax documentation under applicable Bangladesh tax legislation. We assist individuals and companies with return preparation support, advance tax computations, Tax Deduction at Source (TDS) schedules, salary tax documentation and allowable investment rebate reviews.',
    features: [
      'Individual Income Tax Return Preparation Support',
      'Corporate Income Tax Documentation Support',
      'Tax Planning Assistance & Advance Tax Calculation Support',
      'Tax Deduction at Source (TDS) Tracking',
      'Salary Tax Documentation & Supporting Schedules',
    ],
    deliverables: [
      'Tax Computation Worksheet',
      'Supporting Income & Asset Schedules',
      'TDS & Chalan Summary Dossier',
    ],
    idealFor: 'Salaried professionals, sole proprietors, partnerships and private limited companies.',
    iconName: 'FileSpreadsheet',
    tag: 'From ৳2,500 / task',
    startingRate: 'From ৳2,500 / task',
    techSpecs: {
      architecture: 'Deterministic tax computation schedules verified against Bangladesh ITA 2023 rules',
      security: 'Confidential handling of e-TIN, NID, bank statements and salary certificates',
      delivery: 'Filing-ready computation worksheets and organized document dossiers',
      protocol: 'Prepared for review and submission via official NBR e-Return / circle channels',
      compliance: 'Reviewed against applicable Income Tax Act provisions and Finance Acts',
    },
  },
  {
    id: 'vat-mushak-support',
    title: 'VAT Documentation, Mushak & Return Preparation Support',
    category: 'tax',
    categoryLabel: 'Tax & VAT Support',
    shortDesc:
      'VAT documentation organization, Mushak register preparation support, monthly VAT return assistance and regulatory update guidance.',
    fullDesc:
      'Keep your commercial VAT records organized throughout the monthly cycle. We assist with purchase and sales VAT documentation, Mushak register formatting (such as Mushak 6.1, 6.2, 6.3 and 9.1 worksheets), withholding VAT documentation and ongoing regulatory update assistance under applicable Bangladesh VAT legislation.',
    features: [
      'VAT Documentation & Register Organization',
      'Mushak Documentation Assistance (6.1, 6.2, 6.3 schedules)',
      'Monthly VAT Return (Mushak 9.1) Preparation Support',
      'Withholding VAT (VDS) Chalan Tracking',
      'Regulatory Update Assistance under Bangladesh VAT Act',
    ],
    deliverables: [
      'Monthly VAT Input/Output Schedule',
      'Mushak Register Working Files',
      'Draft VAT Return Summary',
    ],
    idealFor: 'Registered trading companies, manufacturers, importers and VAT-registered service providers.',
    iconName: 'Receipt',
    startingRate: 'From ৳2,500 / task',
    techSpecs: {
      architecture: 'Monthly Input-Output VAT & VDS Reconciliation Workbook',
      security: 'Confidential invoice and BIN documentation storage',
      delivery: 'Pre-deadline monthly VAT summary schedules ahead of the 15th',
      protocol: 'Structured reconciliation aligned with NBR VAT Act 2012 formats',
      compliance: 'Subject to final taxpayer verification prior to official submission',
    },
  },

  // D. SOFTWARE & TECHNOLOGY
  {
    id: 'cloud-accounting-automation',
    title: 'QuickBooks, Xero & Spreadsheet Business Automation',
    category: 'technology',
    categoryLabel: 'Software & Technology',
    shortDesc:
      'QuickBooks Online and Xero setup, chart of accounts configuration, Excel automation and Google Sheets collaborative workflows.',
    fullDesc:
      'Modernize your daily financial and operational workflows without costly complexity. TecHisab configures QuickBooks Online, Xero, and custom Microsoft Excel or Google Sheets automation pipelines so your sales, expenses and reporting run cleanly.',
    features: [
      'QuickBooks Online & Xero Accounting Setup',
      'Accounting Software Data Migration & Opening Balances',
      'Microsoft Excel Automation (Formulas, Power Query, Dashboards)',
      'Google Sheets Collaborative Automation & Forms Pipelines',
      'Team Handover & Standard Operating Procedures',
    ],
    deliverables: [
      'Configured Cloud Accounting Company File',
      'Automated Excel / Google Sheets Workbook',
      'Walkthrough Guide for Staff',
    ],
    idealFor: 'SMEs migrating from manual books and teams wanting automated spreadsheets.',
    iconName: 'Laptop',
    tag: 'Automation From ৳2,500',
    startingRate: 'From ৳2,500 / project',
    techSpecs: {
      architecture: 'Cloud Accounting Tenant Configuration & Formula/Script Automation',
      security: 'Permission-scoped workbook & cloud accounting user roles',
      delivery: 'Live configured workspace plus handover documentation',
      protocol: 'CSV/Excel opening balance import & bank feed structure setup',
      compliance: 'Clean chart of accounts mapped to business reporting categories',
    },
  },
  {
    id: 'web-custom-software-dev',
    title: 'Website Development & Custom Business Software',
    category: 'technology',
    categoryLabel: 'Software & Technology',
    shortDesc:
      'Corporate website development, custom billing/inventory software, POS systems, database design and digital process automation.',
    fullDesc:
      'Build reliable websites and business software designed around how your company actually works. From clean corporate websites starting at ৳10,000 to custom web applications, POS modules and database systems starting from ৳45,000+, TecHisab develops practical, maintainable technology.',
    features: [
      'Responsive Corporate Website Development',
      'Custom Business Software & Web Portals',
      'POS Systems, Billing & Inventory Databases',
      'Digital Automation & Workflow Integrations',
      'Deployment & Technical Support Planning',
    ],
    deliverables: [
      'Production Website or Web Application',
      'Database & Admin Workflow Setup',
      'Technical Documentation & Training',
    ],
    idealFor: 'Businesses needing a credible web presence or tailored software beyond off-the-shelf tools.',
    iconName: 'Code2',
    tag: 'Websites From ৳10,000',
    startingRate: 'Websites from ৳10,000 • Software from ৳45,000+',
    techSpecs: {
      architecture: 'Modern TypeScript / React web frontends & structured relational backends',
      security: 'HTTPS, input validation & role-based access design',
      delivery: 'Staging review, deployment setup & handover documentation',
      protocol: 'REST APIs, CSV/Excel export/import & responsive mobile UI',
      compliance: 'Clean web accessibility & SEO-friendly markup',
    },
  },

  // E. BPO & BACK-OFFICE SERVICES
  {
    id: 'bpo-backoffice-services',
    title: 'BPO & Back-Office Support Operations',
    category: 'bpo',
    categoryLabel: 'BPO & Back-Office',
    shortDesc:
      'Back-office accounting operations, daily data processing, transaction documentation, remote bookkeeping and ongoing reporting support.',
    fullDesc:
      'Extend your finance and administration capacity without expanding fixed office headcount. Our BPO & Back-Office team handles daily data processing, transaction documentation organization, remote bookkeeping support and ongoing operational reporting.',
    features: [
      'Back-Office Accounting Operations',
      'Structured Data Processing & Entry Verification',
      'Transaction Documentation & Digital Indexing',
      'Remote Bookkeeping Support for Local & Global Clients',
      'Ongoing Operational & MIS Reporting Support',
    ],
    deliverables: [
      'Organized Digital Transaction Archive',
      'Updated Remote Ledgers',
      'Scheduled Operational Summaries',
    ],
    idealFor: 'Growing companies, e-commerce sellers and international clients outsourcing routine finance admin.',
    iconName: 'Headset',
    techSpecs: {
      architecture: 'Structured Cloud Document Intake & Verification Workflow',
      security: 'Strict client data confidentiality & scoped team permissions',
      delivery: 'Daily/weekly processing cadence tailored to transaction volume',
      protocol: 'Secure cloud folder sharing, QuickBooks/Xero remote access & CSV logs',
      compliance: 'Consistent voucher trail and documentation hygiene',
    },
  },

  // F. PROFESSIONAL TRAINING
  {
    id: 'professional-training-services',
    title: 'Practical Accounting, Software & Technology Training',
    category: 'training',
    categoryLabel: 'Professional Training',
    shortDesc:
      'Hands-on training in Practical Accounting, Computer Skills, MS Excel, Google Sheets, QuickBooks Online, Xero, Tax & VAT and MIS.',
    fullDesc:
      'Empower individuals, students and corporate finance teams with job-ready practical skills. Training tracks cover Practical Accounting, Computer Training, Microsoft Excel, Google Sheets, QuickBooks Online, Xero, Tax & VAT Fundamentals, and Practical Finance & MIS Reporting.',
    features: [
      'Practical Accounting & Real Voucher Exercises (৳9,000)',
      'Computer, Microsoft Excel (৳3,000) & Google Sheets (৳4,000)',
      'QuickBooks Online (৳9,000) & Xero Accounting Labs',
      'All 5 Core Courses Bundle Package (৳20,000)',
      'Corporate Group Training & Practical Finance / MIS Workshops',
    ],
    deliverables: [
      'Hands-On Practice Workbooks',
      'Practical Case Exercises',
      'Certificate of Completion',
    ],
    idealFor: 'Students, fresh graduates, accounting professionals and corporate teams in Bangladesh.',
    iconName: 'GraduationCap',
    tag: 'Courses From ৳3,000',
    startingRate: 'Individual courses from ৳3,000 • Bundle ৳20,000',
    techSpecs: {
      architecture: 'Live instructor-led online sessions & Chittagong in-person labs',
      security: 'Verified course enrollment & attendance records',
      delivery: 'Structured multi-week modules with practice datasets',
      protocol: 'MS Excel, Google Sheets, QuickBooks Online & Xero sandboxes',
      compliance: 'Aligned with practical corporate accounting & Bangladesh tax workflows',
    },
  },
];

export const SERVICES_DATA = SERVICES_LIST;

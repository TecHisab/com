import { BlogPost } from '../types';

export const BLOG_CATEGORIES = [
  'All',
  'Accounting & Finance',
  'Bangladesh Tax',
  'VAT & Mushak',
  'Excel & Google Sheets',
  'QuickBooks & Xero',
  'Business Technology',
  'Software Tutorials',
  'Professional Training',
  'Business Management',
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'double-entry-bookkeeping-checklist',
    title: 'Monthly Bookkeeping Close Checklist for Growing SMEs in Bangladesh',
    slug: 'monthly-bookkeeping-close-checklist-bangladesh',
    category: 'Accounting & Finance',
    author: {
      name: 'TecHisab Editorial Team',
      role: 'Accounting & Advisory Practice',
    },
    date: '2026-09-14',
    updatedAt: '2026-10-10',
    readTime: '6 min read',
    summary:
      'A practical step-by-step routine covering bank reconciliation, petty cash verification, AR/AP aging and trial balance checks before monthly financial statements.',
    keyTakeaways: [
      'Reconcile every bank and mobile-wallet ledger before reviewing monthly profit.',
      'Separate owner personal drawings from business operational expenses.',
      'Review customer receivable and supplier payable aging every month.',
      'Verify trial balance debits and credits prior to producing the Profit & Loss statement.',
    ],
    tags: ['Bookkeeping', 'Bank Reconciliation', 'MIS Reporting', 'SME Finance'],
    content: [
      'Many growing businesses review profitability only at year-end, when missing vouchers and unreconciled bank differences take weeks to untangle. A disciplined 5-step monthly close prevents errors from compounding.',
      'Step 1 — Collect & Classify Primary Documents: Gather all sales invoices, supplier bills, utility receipts and petty cash vouchers for the month into dated digital or physical folders.',
      'Step 2 — Bank & Cash Reconciliation: Match every line of your corporate bank statements against your accounting ledger. Identify unpresented cheques, bank charges and deposits in transit immediately.',
      'Step 3 — Verify Receivables & Payables: Review unpaid customer invoices and vendor balances so collections follow-ups and supplier settlements stay predictable.',
      'Step 4 — Check Depreciation, Accruals & Payroll Entries: Post monthly salary expense, statutory tax deductions and recurring expenses in the correct accounting period.',
      'Step 5 — Review Trial Balance, Profit & Loss and Balance Sheet: Compare gross margin and major overhead lines against prior months to catch misclassifications early.',
    ],
  },
  {
    id: 'bangladesh-tax-slabs-guide',
    title: 'Understanding Income Tax Slabs & Investment Rebates Under ITA 2023',
    slug: 'bangladesh-income-tax-slabs-investment-rebates-ita-2023',
    category: 'Bangladesh Tax',
    author: {
      name: 'M. M. Alam, ITP',
      role: 'Founder & CEO, TecHisab',
    },
    date: '2026-08-22',
    updatedAt: '2026-10-15',
    readTime: '7 min read',
    summary:
      'An educational guide to individual exemption thresholds, progressive slabs, Section 32 salary deductions, Section 78 rebate limits and minimum tax rules.',
    keyTakeaways: [
      'Exemptions vary by taxpayer category under applicable Bangladesh Income Tax provisions.',
      'Salaried taxpayers apply Section 32 statutory deductions before computing taxable income.',
      'Section 78 investment tax rebate is bounded by statutory percentage and ceiling limits.',
      'Always verify latest Finance Act / SRO amendments prior to official e-Return submission.',
    ],
    tags: ['Income Tax Act 2023', 'Section 78', 'e-Return', 'Bangladesh Tax'],
    content: [
      'Navigating personal income tax in Bangladesh becomes much clearer when calculations are broken down into sequential steps under the Income Tax Act 2023 and applicable Finance Act rules.',
      'First, aggregate taxable income across applicable heads—Employment Income (Salary), Income from Rent/House Property, Business/Profession, Capital Gains and Other Sources—after deducting statutory exemptions.',
      'Next, apply progressive tax slabs above the taxpayer’s exemption threshold. Separate thresholds apply for general taxpayers, female taxpayers and senior citizens (65+), persons with disabilities and gazetted war-wounded freedom fighters.',
      'Investment Tax Rebate (Section 78): Eligible investments such as Government Treasury Bonds, approved Provident Funds, DPS up to statutory ceilings and approved life insurance policies generate a tax rebate subject to the lowest applicable cap.',
      'Important Notice: Statutory rates, slab limits and minimum tax rules may be modified by annual Finance Acts and NBR SROs. Use our illustrative worksheets for planning awareness only and consult an Income Tax Practitioner (ITP) before filing via etaxnbr.gov.bd.',
    ],
  },
  {
    id: 'vat-mushak-documentation-guide',
    title: 'Organizing VAT Registers & Mushak 9.1 Working Schedules Properly',
    slug: 'vat-registers-mushak-9-1-working-schedules',
    category: 'VAT & Mushak',
    author: {
      name: 'TecHisab Editorial Team',
      role: 'Tax & VAT Practice',
    },
    date: '2026-07-18',
    updatedAt: '2026-09-30',
    readTime: '6 min read',
    summary:
      'How to maintain purchase and sales VAT records, track withholding VAT (VDS) chalans and prepare reconciled Mushak 9.1 working papers ahead of the monthly deadline.',
    keyTakeaways: [
      'Maintain chronological purchase and sales VAT registers throughout the month.',
      'Verify compliant Mushak 6.3 tax invoices and banking payment proof before claiming input VAT credit.',
      'Track withholding VAT (VDS) deductions and treasury chalans systematically.',
      'Prepare working reconciliations early before the 15th monthly filing window.',
    ],
    tags: ['VAT Act 2012', 'Mushak 9.1', 'Mushak 6.3', 'VDS'],
    content: [
      'Monthly VAT compliance under the Value Added Tax and Supplementary Duty Act 2012 depends on daily documentation habits rather than last-minute spreadsheet assembly on the 14th of the month.',
      'Keep compliant Mushak 6.3 tax invoices organized sequentially alongside Purchase (Mushak 6.1) and Sales (Mushak 6.2) registers so input and output VAT totals tie cleanly to your accounting ledger.',
      'When your business procures services subject to VAT Deduction at Source (VDS), log each deducted amount, treasury deposit chalan and Mushak 6.6 certificate in a dedicated monthly tracker.',
      'TecHisab’s VAT support desk helps commercial enterprises maintain clean monthly registers and organized working papers for timely review and submission.',
    ],
  },
  {
    id: 'excel-google-sheets-reporting',
    title: 'Using Microsoft Excel & Google Sheets Effectively for SME Financial Tracking',
    slug: 'excel-and-google-sheets-for-sme-financial-tracking',
    category: 'Excel & Google Sheets',
    author: {
      name: 'TecHisab Editorial Team',
      role: 'Training & Automation Team',
    },
    date: '2026-06-25',
    readTime: '5 min read',
    summary:
      'Practical formulas—XLOOKUP, SUMIFS, Pivot Tables and Google Sheets QUERY—that replace fragile manual copy-paste reporting.',
    keyTakeaways: [
      'Use SUMIFS and Pivot Tables instead of manual subtotaling across transaction tabs.',
      'Structure data in clean flat tables with one header row and consistent date formats.',
      'Google Sheets IMPORTRANGE and QUERY enable multi-branch team collaboration.',
    ],
    tags: ['Microsoft Excel', 'Google Sheets', 'QUERY', 'XLOOKUP'],
    content: [
      'Spreadsheets remain one of the most versatile tools for business reporting—but broken cell links and mixed formatting quickly erode trust in numbers.',
      'Design every data tab like a database table: dedicated columns for Date, Voucher No, Party Name, Category and Amount, with zero merged cells inside the transaction list.',
      'From a clean flat table, SUMIFS, XLOOKUP and Pivot Tables automatically refresh monthly summaries, branch comparisons and expense breakdowns in seconds.',
      'For teams working across multiple counters or locations, Google Sheets combines real-time permissions, Google Forms data entry and QUERY summaries without version conflicts.',
    ],
  },
  {
    id: 'quickbooks-vs-xero-selection',
    title: 'QuickBooks Online vs. Xero: Choosing Cloud Accounting Software for Your Team',
    slug: 'quickbooks-online-vs-xero-choosing-cloud-accounting',
    category: 'QuickBooks & Xero',
    author: {
      name: 'M. M. Alam, ITP',
      role: 'QuickBooks Online Certified Accountant',
    },
    date: '2026-06-08',
    readTime: '6 min read',
    summary:
      'Key operational differences between QuickBooks Online and Xero across inventory tracking, user access, bank feeds and reporting workflows.',
    keyTakeaways: [
      'QuickBooks Online fits product-based SMEs and teams familiar with intuitive class/location tracking.',
      'Xero offers clean bank reconciliation workflows and flexible team collaboration.',
      'Chart of Accounts mapping during setup determines report usefulness for years.',
    ],
    tags: ['QuickBooks Online', 'Xero', 'Cloud Accounting', 'Setup'],
    content: [
      'Adopting international cloud accounting software gives management anytime visibility over receivables, cash balances and expenses from anywhere.',
      'QuickBooks Online stands out for flexible invoicing, project/location tracking and broad global bookkeeper familiarity. Xero excels with clean daily bank statement matching and multi-user permissions.',
      'Whichever platform you select, successful adoption depends on clean Chart of Accounts design, accurate opening balances and clear staff workflows—areas where TecHisab provides full setup and team training.',
    ],
  },
  {
    id: 'business-technology-website-software-readiness',
    title: 'When Should a Growing Business Move from Spreadsheets to Dedicated Software?',
    slug: 'moving-from-spreadsheets-to-business-software',
    category: 'Business Technology',
    author: {
      name: 'TecHisab Editorial Team',
      role: 'Software & Automation Practice',
    },
    date: '2026-05-19',
    readTime: '5 min read',
    summary:
      'Practical signs that inventory mismatches, duplicate billing or multi-user file overwrites mean your business is ready for POS, ERP or custom web software.',
    keyTakeaways: [
      'Frequent stock count discrepancies and slow billing queues signal spreadsheet limits.',
      'Role-based access permissions protect sensitive pricing, margins and payroll data.',
      'Start with modular tools that match your real workflow rather than over-engineered systems.',
    ],
    tags: ['Business Software', 'Digital Automation', 'POS', 'ERP'],
    content: [
      'Every company starts cleanly in spreadsheets—but once daily invoices, warehouse transfers and multi-branch staff exceed a few dozen transactions a day, manual files create blind spots.',
      'Signs it is time to upgrade include inventory showing on paper that is missing on the shelf, slow customer counter checkouts, or multiple staff editing copies of the same workbook.',
      'TecHisab offers modular business software—from POS Pro and Inventory Pro to Cloud Accounting and full ERP—so you only adopt what fits your stage of growth.',
    ],
  },
  {
    id: 'using-techisab-tax-and-books-sandbox',
    title: 'Tutorial: Testing Income Tax Scenarios & Double-Entry Vouchers in TecHisab Demos',
    slug: 'tutorial-testing-techisab-interactive-sandboxes',
    category: 'Software Tutorials',
    author: {
      name: 'TecHisab Editorial Team',
      role: 'Product Documentation',
    },
    date: '2026-05-04',
    readTime: '4 min read',
    summary:
      'A quick walkthrough of how to use TecHisab interactive browser sandboxes to test trial balances, payroll TDS estimates and personal tax slab calculations.',
    keyTakeaways: [
      'Experiment safely with sample income, investment rebates and invoice entries in your browser.',
      'See how debit and credit entries update financial statements immediately.',
      'Use payroll and stock calculators to evaluate operational workflows before requesting onboarding.',
    ],
    tags: ['Tutorial', 'TecHisab Software', 'Sandbox', 'Walkthrough'],
    content: [
      'On our Software page, you can explore nine interactive live software previews alongside eight business and personal finance calculators directly in your browser.',
      'In TecHisab Cloud Accounting, post a balanced journal voucher or invoice and watch the General Ledger, Trial Balance, Income Statement and Balance Sheet update automatically. In our Calculators workspace, evaluate VAT exclusive/inclusive splits, FIFO vs. Weighted Average stock valuation, payroll net pay and break-even units.',
      'When you are ready to implement a live workspace for your organization, contact us to schedule configuration and data migration.',
    ],
  },
  {
    id: 'building-practical-finance-skills',
    title: 'How Practical Software & Excel Skills Accelerate Early-Career Accounting Roles',
    slug: 'practical-skills-for-early-career-accountants',
    category: 'Professional Training',
    author: {
      name: 'TecHisab Editorial Team',
      role: 'Training Academy',
    },
    date: '2026-04-17',
    readTime: '5 min read',
    summary:
      'Why employers expect new accounts officers to combine voucher fundamentals with Excel, Google Sheets, QuickBooks and statutory tax awareness.',
    keyTakeaways: [
      'Conceptual accounting must pair with hands-on voucher entry and reconciliation speed.',
      'Clean Excel and cloud accounting fluency significantly improves interview readiness.',
      'Understanding TDS and VAT documentation sets candidates apart in SME finance teams.',
    ],
    tags: ['Training', 'Accounting Career', 'QuickBooks', 'Excel'],
    content: [
      'Fresh commerce and finance graduates frequently discover that university exams do not cover bank statement CSV cleaning, QuickBooks reconciliation or preparing a monthly Mushak working file.',
      'Our Practical Accounting, Excel, Google Sheets and QuickBooks courses are structured around actual office documents so learners graduate able to contribute on day one.',
    ],
  },
  {
    id: 'separating-personal-and-business-finances',
    title: 'Why Business Owners Should Strictly Separate Personal & Company Cash Flows',
    slug: 'separating-personal-and-business-cash-flows',
    category: 'Business Management',
    author: {
      name: 'TecHisab Editorial Team',
      role: 'Business Advisory',
    },
    date: '2026-04-02',
    readTime: '4 min read',
    summary:
      'Blending household spending with business cash makes profit impossible to measure and complicates tax compliance—here is how to fix it.',
    keyTakeaways: [
      'Use separate bank and MFS accounts for business receipts vs. personal spending.',
      'Pay yourself a structured owner drawing or fixed monthly salary.',
      'Track personal and household expenses separately in tools like Jibon.',
    ],
    tags: ['Cash Flow', 'Owner Drawings', 'Business Management', 'Jibon App'],
    content: [
      'When business revenue and family groceries flow out of the same wallet, profitable enterprises often feel short on cash while struggling businesses overlook true losses.',
      'Keeping business books cleanly inside QuickBooks or TecHisab Business—while tracking personal and household spending separately inside Jibon—creates clarity on both fronts.',
    ],
  },
];

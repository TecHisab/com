import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  ListTree,
  FilePlus2,
  BookOpen,
  Scale,
  FileText,
  Receipt,
  Users,
  Truck,
  Landmark,
  CheckSquare,
  FileSpreadsheet,
  Plus,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { DemoWorkspace, DemoModuleTab } from '../workspace/DemoWorkspace';
import { DashboardCards } from '../workspace/DashboardCards';
import { InteractiveDataTable } from '../workspace/InteractiveDataTable';
import { CategoryBreakdownChart } from '../workspace/FinancialChart';
import { DetailModal } from '../workspace/DetailModal';
import {
  formatBDT,
  getTodayISO,
  generateDemoId,
  parseSafeNumber,
  triggerPrintableReport,
} from '../../../utils/demoFormatters';
import { useLanguage } from '../../../context/LanguageContext';

interface CloudAccProps {
  onRequestOnboarding?: () => void;
}

type AccountCategory = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

interface LedgerAccount {
  code: string;
  name: string;
  category: AccountCategory;
  normalBalance: 'Debit' | 'Credit';
}

interface JournalLine {
  accountCode: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  date: string;
  voucherNo: string;
  description: string;
  sourceType: 'Journal' | 'Invoice' | 'Bill';
  partyName?: string;
  lines: JournalLine[];
}

interface BankStatementRow {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Deposit' | 'Withdrawal';
  reconciled: boolean;
}

const CHART_OF_ACCOUNTS: LedgerAccount[] = [
  { code: '1010', name: 'Cash in Hand', category: 'Asset', normalBalance: 'Debit' },
  { code: '1020', name: 'Bank Current Account', category: 'Asset', normalBalance: 'Debit' },
  { code: '1100', name: 'Accounts Receivable', category: 'Asset', normalBalance: 'Debit' },
  { code: '1200', name: 'Inventory Asset', category: 'Asset', normalBalance: 'Debit' },
  { code: '2010', name: 'Accounts Payable', category: 'Liability', normalBalance: 'Credit' },
  { code: '2050', name: 'VAT Output Payable', category: 'Liability', normalBalance: 'Credit' },
  { code: '3010', name: 'Owner Capital', category: 'Equity', normalBalance: 'Credit' },
  { code: '4010', name: 'Sales & Service Revenue', category: 'Income', normalBalance: 'Credit' },
  { code: '5010', name: 'Cost of Goods Sold', category: 'Expense', normalBalance: 'Debit' },
  { code: '5020', name: 'Office Rent & Utilities', category: 'Expense', normalBalance: 'Debit' },
  { code: '5030', name: 'Salaries & Conveyance', category: 'Expense', normalBalance: 'Debit' },
];

const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'je-1',
    date: '2026-04-01',
    voucherNo: 'JV-0001',
    description: 'Opening capital & initial cash/bank deposit',
    sourceType: 'Journal',
    lines: [
      { accountCode: '1010', debit: 50000, credit: 0 },
      { accountCode: '1020', debit: 250000, credit: 0 },
      { accountCode: '1200', debit: 100000, credit: 0 },
      { accountCode: '3010', debit: 0, credit: 400000 },
    ],
  },
  {
    id: 'je-2',
    date: '2026-04-04',
    voucherNo: 'INV-201',
    description: 'Credit sales invoice to Meghna Solutions',
    sourceType: 'Invoice',
    partyName: 'Meghna Solutions Ltd.',
    lines: [
      { accountCode: '1100', debit: 115000, credit: 0 },
      { accountCode: '4010', debit: 0, credit: 100000 },
      { accountCode: '2050', debit: 0, credit: 15000 },
    ],
  },
  {
    id: 'je-3',
    date: '2026-04-06',
    voucherNo: 'BILL-501',
    description: 'Inventory credit purchase from Karnaphuli Imports',
    sourceType: 'Bill',
    partyName: 'Karnaphuli Imports',
    lines: [
      { accountCode: '1200', debit: 65000, credit: 0 },
      { accountCode: '2010', debit: 0, credit: 65000 },
    ],
  },
  {
    id: 'je-4',
    date: '2026-04-08',
    voucherNo: 'JV-0002',
    description: 'Bank collection from Meghna Solutions',
    sourceType: 'Journal',
    partyName: 'Meghna Solutions Ltd.',
    lines: [
      { accountCode: '1020', debit: 60000, credit: 0 },
      { accountCode: '1100', debit: 0, credit: 60000 },
    ],
  },
  {
    id: 'je-5',
    date: '2026-04-10',
    voucherNo: 'JV-0003',
    description: 'Monthly office rent & salary payment via Bank',
    sourceType: 'Journal',
    lines: [
      { accountCode: '5020', debit: 24000, credit: 0 },
      { accountCode: '5030', debit: 38000, credit: 0 },
      { accountCode: '1020', debit: 0, credit: 62000 },
    ],
  },
];

const INITIAL_BANK_STATEMENTS: BankStatementRow[] = [
  { id: 'bs-1', date: '2026-04-01', description: 'Opening Capital Bank Deposit', amount: 250000, type: 'Deposit', reconciled: true },
  { id: 'bs-2', date: '2026-04-08', description: 'FT Deposit - Meghna Solutions', amount: 60000, type: 'Deposit', reconciled: false },
  { id: 'bs-3', date: '2026-04-10', description: 'Cheque Clearing - Rent & Payroll', amount: 62000, type: 'Withdrawal', reconciled: false },
];

const CLOUD_MODULES: DemoModuleTab[] = [
  { id: 'dashboard', label: 'Accounting Dashboard', icon: LayoutDashboard },
  { id: 'coa', label: 'Chart of Accounts', icon: ListTree },
  { id: 'journals', label: 'Journal Entries', icon: FilePlus2 },
  { id: 'ledger', label: 'General Ledger', icon: BookOpen },
  { id: 'trial-balance', label: 'Trial Balance', icon: Scale },
  { id: 'invoices', label: 'Sales Invoices', icon: FileText },
  { id: 'bills', label: 'Purchase Bills', icon: Receipt },
  { id: 'receivable', label: 'Accounts Receivable', icon: Users },
  { id: 'payable', label: 'Accounts Payable', icon: Truck },
  { id: 'cash-bank', label: 'Cash & Bank', icon: Landmark },
  { id: 'reconciliation', label: 'Bank Reconciliation', icon: CheckSquare },
  { id: 'statements', label: 'Financial Statements', icon: FileSpreadsheet },
];

export const DemoCloudAccounting: React.FC<CloudAccProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNALS);
  const [bankRows, setBankRows] = useState<BankStatementRow[]>(INITIAL_BANK_STATEMENTS);
  const [selectedLedgerCode, setSelectedLedgerCode] = useState('1020');
  const [banner, setBanner] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [detailEntry, setDetailEntry] = useState<JournalEntry | null>(null);

  const cloudModules: DemoModuleTab[] = [
    { id: 'dashboard', label: pick('Accounting Dashboard', 'অ্যাকাউন্টিং ড্যাশবোর্ড'), icon: LayoutDashboard },
    { id: 'coa', label: pick('Chart of Accounts', 'চার্ট অব অ্যাকাউন্টস'), icon: ListTree },
    { id: 'journals', label: pick('Journal Entries', 'জার্নাল এন্ট্রি'), icon: FilePlus2 },
    { id: 'ledger', label: pick('General Ledger', 'জেনারেল লেজার'), icon: BookOpen },
    { id: 'trial-balance', label: pick('Trial Balance', 'ট্রায়াল ব্যালেন্স'), icon: Scale },
    { id: 'invoices', label: pick('Sales Invoices', 'বিক্রয় ইনভয়েস'), icon: FileText },
    { id: 'bills', label: pick('Purchase Bills', 'ক্রয় বিল'), icon: Receipt },
    { id: 'receivable', label: pick('Accounts Receivable', 'প্রাপ্য হিসাব (A/R)'), icon: Users },
    { id: 'payable', label: pick('Accounts Payable', 'প্রদেয় হিসাব (A/P)'), icon: Truck },
    { id: 'cash-bank', label: pick('Cash & Bank', 'ক্যাশ ও ব্যাংক'), icon: Landmark },
    { id: 'reconciliation', label: pick('Bank Reconciliation', 'ব্যাংক সমন্বয়'), icon: CheckSquare },
    { id: 'statements', label: pick('Financial Statements', 'আর্থিক বিবরণী'), icon: FileSpreadsheet },
  ];

  const categoryLabel = (cat: AccountCategory) => {
    if (cat === 'Asset') return pick('Asset', 'সম্পদ');
    if (cat === 'Liability') return pick('Liability', 'দায়');
    if (cat === 'Equity') return pick('Equity', 'মালিকানা স্বত্ব');
    if (cat === 'Income') return pick('Income', 'আয়');
    return pick('Expense', 'ব্যয়');
  };

  const normalBalanceLabel = (nb: 'Debit' | 'Credit') =>
    nb === 'Debit' ? pick('Debit', 'ডেবিট') : pick('Credit', 'ক্রেডিট');

  const sourceTypeLabel = (st: JournalEntry['sourceType']) => {
    if (st === 'Invoice') return pick('Invoice', 'ইনভয়েস');
    if (st === 'Bill') return pick('Bill', 'বিল');
    return pick('Journal', 'জার্নাল');
  };

  // Double-entry Journal Form
  const [jeDate, setJeDate] = useState(getTodayISO());
  const [jeVoucherNo, setJeVoucherNo] = useState('JV-0004');
  const [jeDescription, setJeDescription] = useState('');
  const [jeLines, setJeLines] = useState<{ accountCode: string; debit: string; credit: string }[]>([
    { accountCode: '5020', debit: '5000', credit: '' },
    { accountCode: '1010', debit: '', credit: '5000' },
  ]);

  // Invoice / Bill Quick Form
  const [docParty, setDocParty] = useState('');
  const [docAmount, setDocAmount] = useState('');
  const [docSettleMode, setDocSettleMode] = useState<'Credit' | 'Bank' | 'Cash'>('Credit');

  const handleResetDemo = () => {
    setJournals(INITIAL_JOURNALS);
    setBankRows(INITIAL_BANK_STATEMENTS);
    setVoucherError(null);
    setBanner(pick('Double-entry ledger & bank reconciliation restored to initial sample state.', 'ডাবল-এন্ট্রি লেজার এবং ব্যাংক সমন্বয় প্রাথমিক নমুনা অবস্থায় ফিরিয়ে আনা হয়েছে।'));
  };

  // Core Double-Entry Accounting Aggregation
  const accounting = useMemo(() => {
    const debitMap: Record<string, number> = {};
    const creditMap: Record<string, number> = {};
    CHART_OF_ACCOUNTS.forEach((a) => {
      debitMap[a.code] = 0;
      creditMap[a.code] = 0;
    });

    journals.forEach((je) => {
      je.lines.forEach((line) => {
        debitMap[line.accountCode] = (debitMap[line.accountCode] || 0) + line.debit;
        creditMap[line.accountCode] = (creditMap[line.accountCode] || 0) + line.credit;
      });
    });

    const trialRows = CHART_OF_ACCOUNTS.map((acct) => {
      const dr = debitMap[acct.code] || 0;
      const cr = creditMap[acct.code] || 0;
      const net = dr - cr;
      const debitBalance = net > 0 ? net : 0;
      const creditBalance = net < 0 ? Math.abs(net) : 0;
      return {
        id: acct.code,
        ...acct,
        totalDebits: dr,
        totalCredits: cr,
        debitBalance,
        creditBalance,
        naturalBalance: acct.normalBalance === 'Debit' ? dr - cr : cr - dr,
      };
    });

    const totalTrialDebits = trialRows.reduce((s, r) => s + r.debitBalance, 0);
    const totalTrialCredits = trialRows.reduce((s, r) => s + r.creditBalance, 0);

    const totalRevenue = trialRows
      .filter((r) => r.category === 'Income')
      .reduce((s, r) => s + r.naturalBalance, 0);
    const totalExpenses = trialRows
      .filter((r) => r.category === 'Expense')
      .reduce((s, r) => s + r.naturalBalance, 0);
    const netProfit = totalRevenue - totalExpenses;

    const totalAssets = trialRows
      .filter((r) => r.category === 'Asset')
      .reduce((s, r) => s + r.naturalBalance, 0);
    const totalLiabilities = trialRows
      .filter((r) => r.category === 'Liability')
      .reduce((s, r) => s + r.naturalBalance, 0);
    const baseEquity = trialRows
      .filter((r) => r.category === 'Equity')
      .reduce((s, r) => s + r.naturalBalance, 0);
    const totalEquity = baseEquity + netProfit;

    const cashBalance = trialRows.find((r) => r.code === '1010')?.naturalBalance || 0;
    const bankBalance = trialRows.find((r) => r.code === '1020')?.naturalBalance || 0;
    const receivables = trialRows.find((r) => r.code === '1100')?.naturalBalance || 0;
    const payables = trialRows.find((r) => r.code === '2010')?.naturalBalance || 0;

    return {
      trialRows,
      totalTrialDebits,
      totalTrialCredits,
      isTrialBalanced: Math.abs(totalTrialDebits - totalTrialCredits) < 0.01,
      totalRevenue,
      totalExpenses,
      netProfit,
      totalAssets,
      totalLiabilities,
      baseEquity,
      totalEquity,
      isBalanceSheetBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
      cashBalance,
      bankBalance,
      receivables,
      payables,
    };
  }, [journals]);

  // Customer & Supplier Derived Balances
  const partyBalances = useMemo(() => {
    const custMap: Record<string, number> = {};
    const supMap: Record<string, number> = {};
    journals.forEach((je) => {
      if (!je.partyName) return;
      je.lines.forEach((line) => {
        if (line.accountCode === '1100') {
          custMap[je.partyName!] = (custMap[je.partyName!] || 0) + line.debit - line.credit;
        }
        if (line.accountCode === '2010') {
          supMap[je.partyName!] = (supMap[je.partyName!] || 0) + line.credit - line.debit;
        }
      });
    });
    return {
      customers: Object.entries(custMap).map(([name, balance], i) => ({ id: `cb-${i}`, name, balance })),
      suppliers: Object.entries(supMap).map(([name, balance], i) => ({ id: `sb-${i}`, name, balance })),
    };
  }, [journals]);

  const draftDebitSum = jeLines.reduce((s, l) => s + Math.max(0, parseSafeNumber(l.debit)), 0);
  const draftCreditSum = jeLines.reduce((s, l) => s + Math.max(0, parseSafeNumber(l.credit)), 0);
  const draftDiff = Math.abs(draftDebitSum - draftCreditSum);

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError(null);
    if (!jeDescription.trim()) {
      setVoucherError(pick('Enter a description / narration for the journal voucher.', 'জার্নাল ভাউচারের জন্য একটি বিবরণ লিখুন।'));
      return;
    }
    if (draftDebitSum <= 0 || draftCreditSum <= 0) {
      setVoucherError(pick('Journal entry must have positive debit and credit amounts.', 'জার্নাল এন্ট্রিতে অবশ্যই ধনাত্মক ডেবিট ও ক্রেডিট পরিমাণ থাকতে হবে।'));
      return;
    }
    if (draftDiff > 0.001) {
      setVoucherError(
        pick(
          `Unbalanced Journal Blocked: Total Debit (${formatBDT(draftDebitSum)}) must equal Total Credit (${formatBDT(draftCreditSum)}). Difference: ${formatBDT(draftDiff)}.`,
          `অসমান জার্নাল বাতিল: মোট ডেবিট (${formatBDT(draftDebitSum)}) ও মোট ক্রেডিট (${formatBDT(draftCreditSum)}) সমান হতে হবে। পার্থক্য: ${formatBDT(draftDiff)}।`
        )
      );
      return;
    }

    const parsedLines: JournalLine[] = jeLines
      .map((l) => ({
        accountCode: l.accountCode,
        debit: Math.max(0, parseSafeNumber(l.debit)),
        credit: Math.max(0, parseSafeNumber(l.credit)),
      }))
      .filter((l) => l.debit > 0 || l.credit > 0);

    const entry: JournalEntry = {
      id: generateDemoId('je'),
      date: jeDate || getTodayISO(),
      voucherNo: jeVoucherNo.trim() || generateDemoId('JV'),
      description: jeDescription.trim(),
      sourceType: 'Journal',
      lines: parsedLines,
    };
    setJournals((prev) => [entry, ...prev]);
    setJeVoucherNo(generateDemoId('JV'));
    setJeDescription('');
    setBanner(
      pick(
        `Posted balanced voucher ${entry.voucherNo} (${formatBDT(draftDebitSum)}) — Trial Balance & Financial Statements updated.`,
        `সুষম ভাউচার ${entry.voucherNo} (${formatBDT(draftDebitSum)}) পোস্ট হয়েছে — ট্রায়াল ব্যালেন্স ও আর্থিক বিবরণী আপডেট হয়েছে।`
      )
    );
  };

  const handlePostDoc = (docType: 'Invoice' | 'Bill', e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseSafeNumber(docAmount);
    if (!docParty.trim() || amt <= 0) {
      setVoucherError(
        pick(
          `Enter valid party name and positive amount for ${docType}.`,
          `${sourceTypeLabel(docType)}-এর জন্য সঠিক পার্টির নাম ও ধনাত্মক পরিমাণ দিন।`
        )
      );
      return;
    }
    setVoucherError(null);

    const settlementAcct =
      docSettleMode === 'Cash'
        ? '1010'
        : docSettleMode === 'Bank'
        ? '1020'
        : docType === 'Invoice'
        ? '1100'
        : '2010';

    const lines: JournalLine[] =
      docType === 'Invoice'
        ? [
            { accountCode: settlementAcct, debit: amt, credit: 0 },
            { accountCode: '4010', debit: 0, credit: amt },
          ]
        : [
            { accountCode: '1200', debit: amt, credit: 0 },
            { accountCode: settlementAcct, debit: 0, credit: amt },
          ];

    const entry: JournalEntry = {
      id: generateDemoId('je'),
      date: getTodayISO(),
      voucherNo: generateDemoId(docType === 'Invoice' ? 'INV' : 'BILL'),
      description: `${docType === 'Invoice' ? 'Sales invoice to' : 'Purchase bill from'} ${docParty.trim()} (${docSettleMode})`,
      sourceType: docType,
      partyName: docParty.trim(),
      lines,
    };
    setJournals((prev) => [entry, ...prev]);
    setDocParty('');
    setDocAmount('');
    setBanner(
      pick(
        `Posted ${docType} ${entry.voucherNo} with paired double-entry ledger lines.`,
        `ডাবল-এন্ট্রি লেজার লাইনসহ ${sourceTypeLabel(docType)} ${entry.voucherNo} পোস্ট হয়েছে।`
      )
    );
  };

  const ledgerMovements = useMemo(() => {
    let running = 0;
    const acct = CHART_OF_ACCOUNTS.find((a) => a.code === selectedLedgerCode);
    const items: { id: string; date: string; voucherNo: string; desc: string; debit: number; credit: number; balance: number }[] = [];
    [...journals]
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((je) => {
        je.lines
          .filter((l) => l.accountCode === selectedLedgerCode)
          .forEach((line, idx) => {
            running += acct?.normalBalance === 'Debit' ? line.debit - line.credit : line.credit - line.debit;
            items.push({
              id: `${je.id}-${idx}`,
              date: je.date,
              voucherNo: je.voucherNo,
              desc: je.description,
              debit: line.debit,
              credit: line.credit,
              balance: running,
            });
          });
      });
    return items;
  }, [journals, selectedLedgerCode]);

  const reconciledBankBalance =
    bankRows
      .filter((b) => b.reconciled)
      .reduce((s, b) => s + (b.type === 'Deposit' ? b.amount : -b.amount), 0);

  const handlePrint = () => {
    triggerPrintableReport(
      pick('TecHisab Cloud Accounting — Trial Balance & Statements', 'TecHisab ক্লাউড অ্যাকাউন্টিং — ট্রায়াল ব্যালেন্স ও বিবরণী'),
      `
      <p style="font-size:12px;">${pick('Double-Entry Verification', 'ডাবল-এন্ট্রি যাচাই')}: <strong>${accounting.isTrialBalanced ? pick('BALANCED', 'সুষম (Balanced)') : pick('UNBALANCED', 'অসমান')}</strong> | ${pick('Assets = Liabilities + Equity', 'সম্পদ = দায় + মালিকানা স্বত্ব')}: <strong>${formatBDT(accounting.totalAssets)} = ${formatBDT(accounting.totalLiabilities + accounting.totalEquity)}</strong></p>
      <table style="width:100%; border-collapse: collapse; font-size: 12px;">
        <tr style="background:#F4F8FF;"><th style="text-align:left; padding:6px;">${pick('Account', 'অ্যাকাউন্ট')}</th><th style="text-align:right; padding:6px;">${pick('Debit Balance', 'ডেবিট ব্যালেন্স')}</th><th style="text-align:right; padding:6px;">${pick('Credit Balance', 'ক্রেডিট ব্যালেন্স')}</th></tr>
        ${accounting.trialRows
          .map(
            (r) =>
              `<tr><td style="padding:6px; border-bottom:1px solid #D7E2F3;">${r.code} — ${r.name}</td><td style="padding:6px; text-align:right; border-bottom:1px solid #D7E2F3;">${r.debitBalance ? formatBDT(r.debitBalance) : '—'}</td><td style="padding:6px; text-align:right; border-bottom:1px solid #D7E2F3;">${r.creditBalance ? formatBDT(r.creditBalance) : '—'}</td></tr>`
          )
          .join('')}
        <tr style="font-weight:800;"><td style="padding:8px;">${pick('TOTAL', 'সর্বমোট')}</td><td style="padding:8px; text-align:right;">${formatBDT(accounting.totalTrialDebits)}</td><td style="padding:8px; text-align:right;">${formatBDT(accounting.totalTrialCredits)}</td></tr>
      </table>`
    );
  };

  return (
    <DemoWorkspace
      productName="TecHisab Cloud Accounting"
      productSubtitle={pick(
        'Double-Entry General Ledger, Balanced Vouchers, Bank Reconciliation & Financial Statements',
        'ডাবল-এন্ট্রি জেনারেল লেজার, ব্যালেন্সড ভাউচার, ব্যাংক সমন্বয় এবং আর্থিক বিবরণী'
      )}
      modules={cloudModules}
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      onResetDemo={handleResetDemo}
      onPrintReport={handlePrint}
      onRequestOnboarding={onRequestOnboarding}
      bannerMessage={banner}
      onClearBanner={() => setBanner(null)}
    >
      {activeModule === 'dashboard' && (
        <div className="space-y-5">
          <DashboardCards
            columns={4}
            metrics={[
              { id: 'ca-rev', label: pick('Total Revenue', 'মোট আয়'), value: formatBDT(accounting.totalRevenue), tone: 'primary' },
              { id: 'ca-exp', label: pick('Total Expenses', 'মোট ব্যয়'), value: formatBDT(accounting.totalExpenses), tone: 'warning' },
              { id: 'ca-np', label: pick('Net Profit', 'নিট মুনাফা'), value: formatBDT(accounting.netProfit), tone: accounting.netProfit >= 0 ? 'positive' : 'danger' },
              { id: 'ca-bal', label: pick('Trial Balance', 'ট্রায়াল ব্যালেন্স'), value: accounting.isTrialBalanced ? pick('Balanced', 'সুষম') : pick('Mismatch', 'অমিল'), subtext: `${formatBDT(accounting.totalTrialDebits)} Dr = Cr`, tone: accounting.isTrialBalanced ? 'positive' : 'danger' },
              { id: 'ca-ast', label: pick('Total Assets', 'মোট সম্পদ'), value: formatBDT(accounting.totalAssets) },
              { id: 'ca-lia', label: pick('Total Liabilities', 'মোট দায়'), value: formatBDT(accounting.totalLiabilities) },
              { id: 'ca-bank', label: pick('Cash & Bank', 'নগদ ও ব্যাংক'), value: formatBDT(accounting.cashBalance + accounting.bankBalance), tone: 'primary' },
              { id: 'ca-rec', label: pick('A/R vs A/P', 'প্রাপ্য বনাম প্রদেয়'), value: `${formatBDT(accounting.receivables)}`, subtext: `${pick('Payables:', 'প্রদেয়:')} ${formatBDT(accounting.payables)}` },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryBreakdownChart
              title={pick('Assets Composition', 'সম্পদের গঠন')}
              items={accounting.trialRows
                .filter((r) => r.category === 'Asset' && r.naturalBalance > 0)
                .map((r) => ({ label: r.name, value: r.naturalBalance }))}
            />
            <CategoryBreakdownChart
              title={pick('Income vs Expense Distribution', 'আয় বনাম ব্যয় বণ্টন')}
              items={[
                { label: pick('Sales & Service Revenue', 'বিক্রয় ও সেবা আয়'), value: Math.max(0, accounting.totalRevenue) },
                { label: pick('Total Operating Expenses', 'মোট পরিচালন ব্যয়'), value: Math.max(0, accounting.totalExpenses) },
                { label: pick('Net Profit Retained', 'সংরক্ষিত নিট মুনাফা'), value: Math.max(0, accounting.netProfit) },
              ]}
            />
          </div>

          <InteractiveDataTable
            title={pick('Posted Accounting Vouchers', 'পোস্টকৃত অ্যাকাউন্টিং ভাউচার')}
            rows={journals}
            columns={[
              { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
              { key: 'v', header: pick('Voucher #', 'ভাউচার #'), render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.voucherNo}</span> },
              { key: 'src', header: pick('Source', 'উৎস'), render: (r) => sourceTypeLabel(r.sourceType) },
              { key: 'desc', header: pick('Description', 'বিবরণ'), render: (r) => r.description },
              {
                key: 'amt',
                header: pick('Voucher Total', 'মোট ভাউচার'),
                align: 'right',
                render: (r) => formatBDT(r.lines.reduce((s, l) => s + l.debit, 0)),
              },
            ]}
            getSearchText={(r) => `${r.voucherNo} ${r.description} ${r.partyName || ''}`}
            getDateValue={(r) => r.date}
            onView={(r) => setDetailEntry(r)}
            onDelete={(id) => {
              setJournals((prev) => prev.filter((j) => j.id !== id));
              setBanner(pick('Deleted voucher and updated Trial Balance & Statements.', 'ভাউচার মুছে ফেলা হয়েছে এবং ট্রায়াল ব্যালেন্স ও বিবরণী আপডেট হয়েছে।'));
            }}
          />
        </div>
      )}

      {activeModule === 'coa' && (
        <InteractiveDataTable
          title={pick('Chart of Accounts', 'চার্ট অব অ্যাকাউন্টস')}
          rows={accounting.trialRows}
          columns={[
            { key: 'code', header: pick('Code', 'কোড'), render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.code}</span> },
            { key: 'name', header: pick('Account Name', 'অ্যাকাউন্টের নাম'), render: (r) => <span className="font-semibold">{r.name}</span> },
            { key: 'cat', header: pick('Category', 'শ্রেণি'), render: (r) => categoryLabel(r.category) },
            { key: 'norm', header: pick('Normal Balance', 'স্বাভাবিক ব্যালেন্স'), render: (r) => normalBalanceLabel(r.normalBalance) },
            { key: 'bal', header: pick('Current Balance', 'বর্তমান ব্যালেন্স'), align: 'right', render: (r) => formatBDT(r.naturalBalance) },
          ]}
          getSearchText={(r) => `${r.code} ${r.name} ${r.category}`}
        />
      )}

      {activeModule === 'journals' && (
        <div className="space-y-5">
          <form
            onSubmit={handlePostJournal}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
                  {pick('Double-Entry Journal Voucher', 'ডাবল-এন্ট্রি জার্নাল ভাউচার')}
                </h4>
                <p className="text-[11px] text-[#5F6D82]">
                  {pick('Total Debits must equal Total Credits before posting to the ledger', 'লেজারে পোস্ট করার আগে মোট ডেবিট ও মোট ক্রেডিট সমান হতে হবে')}
                </p>
              </div>
              <div
                className={`text-xs font-mono font-bold px-3 py-1 rounded-lg ${
                  draftDiff < 0.01 && draftDebitSum > 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                }`}
              >
                Dr {formatBDT(draftDebitSum)} | Cr {formatBDT(draftCreditSum)}
              </div>
            </div>

            {voucherError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{voucherError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="date"
                value={jeDate}
                onChange={(e) => setJeDate(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              />
              <input
                type="text"
                value={jeVoucherNo}
                onChange={(e) => setJeVoucherNo(e.target.value)}
                placeholder={pick('Voucher #', 'ভাউচার #')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
              <input
                type="text"
                value={jeDescription}
                onChange={(e) => setJeDescription(e.target.value)}
                placeholder={pick('Journal narration / memo', 'জার্নাল বিবরণ / মেমো')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              />
            </div>

            <div className="space-y-2">
              {jeLines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <select
                    value={line.accountCode}
                    onChange={(e) =>
                      setJeLines((prev) =>
                        prev.map((l, i) => (i === idx ? { ...l, accountCode: e.target.value } : l))
                      )
                    }
                    className="col-span-6 sm:col-span-5 px-2.5 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
                  >
                    {CHART_OF_ACCOUNTS.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.code} — {a.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={line.debit}
                    onChange={(e) =>
                      setJeLines((prev) =>
                        prev.map((l, i) =>
                          i === idx ? { ...l, debit: e.target.value, credit: e.target.value ? '' : l.credit } : l
                        )
                      )
                    }
                    placeholder={pick('Debit', 'ডেবিট')}
                    className="col-span-3 px-2.5 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono text-right"
                  />
                  <input
                    type="number"
                    min="0"
                    value={line.credit}
                    onChange={(e) =>
                      setJeLines((prev) =>
                        prev.map((l, i) =>
                          i === idx ? { ...l, credit: e.target.value, debit: e.target.value ? '' : l.debit } : l
                        )
                      )
                    }
                    placeholder={pick('Credit', 'ক্রেডিট')}
                    className="col-span-3 px-2.5 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono text-right"
                  />
                  {jeLines.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setJeLines((prev) => prev.filter((_, i) => i !== idx))}
                      className="col-span-12 sm:col-span-1 text-rose-600 hover:text-rose-700 cursor-pointer flex justify-center"
                      title={pick('Remove line', 'লাইন মুছুন')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setJeLines((prev) => [...prev, { accountCode: '1010', debit: '', credit: '' }])
                }
                className="text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{pick('Add Voucher Line', 'ভাউচার লাইন যোগ করুন')}</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
              >
                {pick('Post Balanced Journal Entry', 'ব্যালেন্সড জার্নাল পোস্ট করুন')}
              </button>
            </div>
          </form>

          <InteractiveDataTable
            title={pick('Journal Register', 'জার্নাল রেজিস্টার')}
            rows={journals}
            columns={[
              { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
              { key: 'v', header: pick('Voucher #', 'ভাউচার #'), render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.voucherNo}</span> },
              { key: 'desc', header: pick('Narration', 'বিবরণ'), render: (r) => r.description },
              { key: 'amt', header: pick('Dr / Cr Total', 'ডেবিট / ক্রেডিট মোট'), align: 'right', render: (r) => formatBDT(r.lines.reduce((s, l) => s + l.debit, 0)) },
            ]}
            getSearchText={(r) => `${r.voucherNo} ${r.description}`}
            getDateValue={(r) => r.date}
            onView={(r) => setDetailEntry(r)}
            onDelete={(id) => {
              setJournals((prev) => prev.filter((j) => j.id !== id));
              setBanner(pick('Deleted journal voucher.', 'জার্নাল ভাউচার মুছে ফেলা হয়েছে।'));
            }}
          />
        </div>
      )}

      {activeModule === 'ledger' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
                {pick('General Ledger Account Filter', 'জেনারেল লেজার অ্যাকাউন্ট ফিল্টার')}
              </h4>
              <p className="text-[11px] text-[#5F6D82]">
                {pick(
                  'Select any account to inspect chronological debit/credit postings and running balance',
                  'ক্রমানুযায়ী ডেবিট/ক্রেডিট পোস্টিং ও চলমান ব্যালেন্স দেখতে যেকোনো অ্যাকাউন্ট নির্বাচন করুন'
                )}
              </p>
            </div>
            <select
              value={selectedLedgerCode}
              onChange={(e) => setSelectedLedgerCode(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-semibold"
            >
              {CHART_OF_ACCOUNTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} — {a.name} ({categoryLabel(a.category)})
                </option>
              ))}
            </select>
          </div>

          <InteractiveDataTable
            title={`${pick('Account Movements:', 'অ্যাকাউন্ট লেনদেন:')} ${CHART_OF_ACCOUNTS.find((a) => a.code === selectedLedgerCode)?.name || ''}`}
            rows={ledgerMovements}
            columns={[
              { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
              { key: 'v', header: pick('Voucher', 'ভাউচার'), render: (r) => <span className="font-mono font-bold">{r.voucherNo}</span> },
              { key: 'desc', header: pick('Particulars', 'বিবরণ'), render: (r) => r.desc },
              { key: 'dr', header: pick('Debit', 'ডেবিট'), align: 'right', render: (r) => (r.debit ? formatBDT(r.debit) : '—') },
              { key: 'cr', header: pick('Credit', 'ক্রেডিট'), align: 'right', render: (r) => (r.credit ? formatBDT(r.credit) : '—') },
              { key: 'bal', header: pick('Running Balance', 'চলমান ব্যালেন্স'), align: 'right', render: (r) => <span className="font-bold">{formatBDT(r.balance)}</span> },
            ]}
            getSearchText={(r) => `${r.voucherNo} ${r.desc}`}
            getDateValue={(r) => r.date}
          />
        </div>
      )}

      {activeModule === 'trial-balance' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
                {pick('Unadjusted Trial Balance (Live)', 'সমন্বয়পূর্ব ট্রায়াল ব্যালেন্স (লাইভ)')}
              </h4>
              <p className="text-xs text-[#5F6D82]">
                {pick('Sum of Debit Balances equals Sum of Credit Balances', 'মোট ডেবিট ব্যালেন্স = মোট ক্রেডিট ব্যালেন্স')}
              </p>
            </div>
            <div className="text-right font-mono tabular-nums text-xs">
              <div className="font-extrabold text-emerald-700 dark:text-emerald-400">
                Dr: {formatBDT(accounting.totalTrialDebits)} = Cr: {formatBDT(accounting.totalTrialCredits)}
              </div>
            </div>
          </div>

          <InteractiveDataTable
            title={pick('Account Balances', 'অ্যাকাউন্ট ব্যালেন্স')}
            rows={accounting.trialRows}
            columns={[
              { key: 'code', header: pick('Code', 'কোড'), render: (r) => <span className="font-mono font-bold">{r.code}</span> },
              { key: 'name', header: pick('Account Title', 'অ্যাকাউন্টের শিরোনাম'), render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: 'cat', header: pick('Type', 'ধরন'), render: (r) => categoryLabel(r.category) },
              { key: 'dr', header: pick('Debit Balance', 'ডেবিট ব্যালেন্স'), align: 'right', render: (r) => (r.debitBalance ? formatBDT(r.debitBalance) : '—') },
              { key: 'cr', header: pick('Credit Balance', 'ক্রেডিট ব্যালেন্স'), align: 'right', render: (r) => (r.creditBalance ? formatBDT(r.creditBalance) : '—') },
            ]}
            getSearchText={(r) => `${r.code} ${r.name} ${r.category}`}
          />
        </div>
      )}

      {(activeModule === 'invoices' || activeModule === 'bills') && (
        <div className="space-y-5">
          <form
            onSubmit={(e) =>
              handlePostDoc(activeModule === 'invoices' ? 'Invoice' : 'Bill', e)
            }
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {activeModule === 'invoices'
                ? pick('Create Sales Invoice (Posts Double-Entry)', 'বিক্রয় ইনভয়েস তৈরি করুন (ডাবল-এন্ট্রি পোস্ট)')
                : pick('Create Purchase Bill (Posts Double-Entry)', 'ক্রয় বিল তৈরি করুন (ডাবল-এন্ট্রি পোস্ট)')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={docParty}
                onChange={(e) => setDocParty(e.target.value)}
                placeholder={activeModule === 'invoices' ? pick('Customer Name', 'গ্রাহকের নাম') : pick('Supplier Name', 'সরবরাহকারীর নাম')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              />
              <select
                value={docSettleMode}
                onChange={(e) => setDocSettleMode(e.target.value as 'Credit' | 'Bank' | 'Cash')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              >
                <option value="Credit">
                  {pick('On Credit', 'বাকিতে')} ({activeModule === 'invoices' ? 'A/R' : 'A/P'})
                </option>
                <option value="Bank">{pick('Bank Account', 'ব্যাংক অ্যাকাউন্ট')}</option>
                <option value="Cash">{pick('Cash', 'নগদ')}</option>
              </select>
              <input
                type="number"
                min="1"
                value={docAmount}
                onChange={(e) => setDocAmount(e.target.value)}
                placeholder={pick('Amount (BDT)', 'পরিমাণ (BDT)')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
              >
                {activeModule === 'invoices' ? pick('Post Invoice', 'ইনভয়েস পোস্ট') : pick('Post Bill', 'বিল পোস্ট')}
              </button>
            </div>
          </form>

          <InteractiveDataTable
            title={activeModule === 'invoices' ? pick('Sales Invoices Ledger', 'বিক্রয় ইনভয়েস লেজার') : pick('Purchase Bills Ledger', 'ক্রয় বিল লেজার')}
            rows={journals.filter((j) =>
              j.sourceType === (activeModule === 'invoices' ? 'Invoice' : 'Bill')
            )}
            columns={[
              { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
              { key: 'no', header: pick('Ref #', 'রেফারেন্স #'), render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.voucherNo}</span> },
              { key: 'party', header: pick('Party', 'পার্টি'), render: (r) => r.partyName || '—' },
              { key: 'desc', header: pick('Details', 'বিস্তারিত'), render: (r) => r.description },
              { key: 'amt', header: pick('Total', 'মোট'), align: 'right', render: (r) => formatBDT(r.lines.reduce((s, l) => s + l.debit, 0)) },
            ]}
            getSearchText={(r) => `${r.voucherNo} ${r.partyName || ''} ${r.description}`}
            getDateValue={(r) => r.date}
            onView={(r) => setDetailEntry(r)}
            onDelete={(id) => {
              setJournals((prev) => prev.filter((j) => j.id !== id));
              setBanner(pick('Voucher deleted.', 'ভাউচার মুছে ফেলা হয়েছে।'));
            }}
          />
        </div>
      )}

      {(activeModule === 'receivable' || activeModule === 'payable') && (
        <InteractiveDataTable
          title={activeModule === 'receivable' ? pick('Customer Receivable Balances', 'গ্রাহকের প্রাপ্য ব্যালেন্স') : pick('Supplier Payable Balances', 'সরবরাহকারীর প্রদেয় ব্যালেন্স')}
          rows={activeModule === 'receivable' ? partyBalances.customers : partyBalances.suppliers}
          columns={[
            { key: 'name', header: pick('Party Name', 'পার্টির নাম'), render: (r) => <span className="font-bold">{r.name}</span> },
            { key: 'bal', header: pick('Net Outstanding Balance', 'নিট বকেয়া ব্যালেন্স'), align: 'right', render: (r) => formatBDT(r.balance) },
          ]}
          getSearchText={(r) => r.name}
        />
      )}

      {(activeModule === 'cash-bank' || activeModule === 'reconciliation') && (
        <div className="space-y-5">
          <DashboardCards
            columns={3}
            metrics={[
              { id: 'rec-1', label: pick('Cash Book Balance', 'ক্যাশ বুক ব্যালেন্স'), value: formatBDT(accounting.cashBalance) },
              { id: 'rec-2', label: pick('Bank Ledger Balance', 'ব্যাংক লেজার ব্যালেন্স'), value: formatBDT(accounting.bankBalance), tone: 'primary' },
              { id: 'rec-3', label: pick('Reconciled Statement Total', 'সমন্বিত স্টেটমেন্ট মোট'), value: formatBDT(reconciledBankBalance), tone: reconciledBankBalance === accounting.bankBalance ? 'positive' : 'warning' },
            ]}
          />

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-[#D7E2F3] dark:border-slate-800">
              <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
                {pick('Bank Statement Matching (Click Match / Unmatch to Reconcile)', 'ব্যাংক স্টেটমেন্ট ম্যাচিং (সমন্বয় করতে ম্যাচ / আনম্যাচ ক্লিক করুন)')}
              </h4>
            </div>
            <div className="divide-y divide-[#D7E2F3]/70 dark:divide-slate-800">
              {bankRows.map((row) => (
                <div
                  key={row.id}
                  className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[#0B1730] dark:text-white">
                      {row.description}
                    </div>
                    <div className="text-[11px] text-[#5F6D82] font-mono">
                      {row.date} &middot; {row.type === 'Deposit' ? pick('Deposit', 'জমা') : pick('Withdrawal', 'উত্তোলন')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold tabular-nums">
                      {row.type === 'Deposit' ? '+' : '-'}
                      {formatBDT(row.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setBankRows((prev) =>
                          prev.map((b) =>
                            b.id === row.id ? { ...b, reconciled: !b.reconciled } : b
                          )
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        row.reconciled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700'
                      }`}
                    >
                      {row.reconciled ? pick('Matched ✓', 'সমন্বিত ✓') : pick('Match Statement', 'স্টেটমেন্ট ম্যাচ')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModule === 'statements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Profit & Loss */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-5 space-y-3">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white border-b border-[#D7E2F3] dark:border-slate-800 pb-2">
              {pick('Income Statement (Profit & Loss)', 'আয় বিবরণী (লাভ ও ক্ষতি)')}
            </h4>
            <div className="divide-y divide-[#D7E2F3]/60 dark:divide-slate-800 text-xs">
              {accounting.trialRows
                .filter((r) => r.category === 'Income' || r.category === 'Expense')
                .map((r) => (
                  <div key={r.code} className="py-2 flex justify-between">
                    <span>
                      {r.name} ({categoryLabel(r.category)})
                    </span>
                    <span className="font-mono tabular-nums">
                      {r.category === 'Expense' ? `(${formatBDT(r.naturalBalance)})` : formatBDT(r.naturalBalance)}
                    </span>
                  </div>
                ))}
              <div className="py-3 flex justify-between font-extrabold text-sm text-[#0345A4] dark:text-sky-400">
                <span>{pick('Net Profit', 'নিট মুনাফা')}</span>
                <span className="font-mono tabular-nums">{formatBDT(accounting.netProfit)}</span>
              </div>
            </div>
          </div>

          {/* Balance Sheet */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#D7E2F3] dark:border-slate-800 pb-2">
              <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
                {pick('Balance Sheet (Assets = Liabilities + Equity)', 'ব্যালেন্স শিট (সম্পদ = দায় + মূলধন)')}
              </h4>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {accounting.isBalanceSheetBalanced ? pick('Balanced', 'সুষম') : pick('Check Entries', 'এন্ট্রি পরীক্ষা করুন')}
              </span>
            </div>
            <div className="divide-y divide-[#D7E2F3]/60 dark:divide-slate-800 text-xs">
              {accounting.trialRows
                .filter((r) => r.category === 'Asset')
                .map((r) => (
                  <div key={r.code} className="py-2 flex justify-between">
                    <span>{r.name}</span>
                    <span className="font-mono tabular-nums">{formatBDT(r.naturalBalance)}</span>
                  </div>
                ))}
              <div className="py-2.5 flex justify-between font-extrabold text-[#0B1730] dark:text-white bg-[#F4F8FF]/70 dark:bg-slate-800/50 px-2 rounded">
                <span>{pick('Total Assets', 'মোট সম্পদ')}</span>
                <span className="font-mono tabular-nums">{formatBDT(accounting.totalAssets)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>{pick('Total Liabilities', 'মোট দায়')}</span>
                <span className="font-mono tabular-nums">{formatBDT(accounting.totalLiabilities)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>{pick('Owner Capital + Retained Net Profit', 'মালিকানা মূলধন + সংরক্ষিত নিট মুনাফা')}</span>
                <span className="font-mono tabular-nums">{formatBDT(accounting.totalEquity)}</span>
              </div>
              <div className="py-2.5 flex justify-between font-extrabold text-[#0345A4] dark:text-sky-400 bg-[#F4F8FF]/70 dark:bg-slate-800/50 px-2 rounded">
                <span>{pick('Total Liabilities & Equity', 'মোট দায় ও মালিকানা স্বত্ব')}</span>
                <span className="font-mono tabular-nums">
                  {formatBDT(accounting.totalLiabilities + accounting.totalEquity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <DetailModal
        isOpen={Boolean(detailEntry)}
        title={detailEntry ? `${detailEntry.voucherNo} — ${sourceTypeLabel(detailEntry.sourceType)}` : ''}
        subtitle={detailEntry?.description}
        rows={
          detailEntry
            ? [
                { label: pick('Date', 'তারিখ'), value: detailEntry.date, mono: true },
                ...detailEntry.lines.map((l) => {
                  const name =
                    CHART_OF_ACCOUNTS.find((a) => a.code === l.accountCode)?.name || l.accountCode;
                  return {
                    label: `${l.accountCode} ${name}`,
                    value: l.debit > 0 ? `Dr ${formatBDT(l.debit)}` : `Cr ${formatBDT(l.credit)}`,
                    mono: true,
                  };
                }),
              ]
            : []
        }
        onClose={() => setDetailEntry(null)}
        onPrint={handlePrint}
      />
    </DemoWorkspace>
  );
};

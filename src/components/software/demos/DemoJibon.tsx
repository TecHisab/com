import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  Smartphone,
  Users,
  PieChart,
  Target,
  Receipt,
  CheckSquare,
  FileBarChart,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { DemoWorkspace, DemoModuleTab, DemoNotification } from '../workspace/DemoWorkspace';
import { DashboardCards } from '../workspace/DashboardCards';
import { InteractiveDataTable } from '../workspace/InteractiveDataTable';
import { FinancialBarChart, CategoryBreakdownChart } from '../workspace/FinancialChart';
import {
  formatBDT,
  getTodayISO,
  generateDemoId,
  parseSafeNumber,
  triggerPrintableReport,
} from '../../../utils/demoFormatters';
import { useLanguage } from '../../../context/LanguageContext';

interface JibonProps {
  onRequestOnboarding?: () => void;
}

type WalletSource = 'Cash' | 'Bank' | 'bKash (Manual)' | 'Nagad (Manual)' | 'Rocket (Manual)';

interface PersonalTxn {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  source: WalletSource;
  amount: number;
  isFamilyShared?: boolean;
  memberName?: string;
  note: string;
}

interface BudgetLimit {
  id: string;
  category: string;
  monthlyLimit: number;
}

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
}

interface PersonalBill {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  paid: boolean;
}

interface HabitItem {
  id: string;
  title: string;
  streakDays: number;
  doneToday: boolean;
}

const EXPENSE_CATEGORIES = ['Housing & Rent', 'Groceries & Food', 'Transport', 'Utilities & Internet', 'Education & Family', 'Health & Personal'];

const INITIAL_TXNS: PersonalTxn[] = [
  { id: 'jt-1', date: '2026-04-01', type: 'income', category: 'Monthly Salary', source: 'Bank', amount: 65000, note: 'April salary credit' },
  { id: 'jt-2', date: '2026-04-03', type: 'income', category: 'Freelance Consulting', source: 'bKash (Manual)', amount: 12000, note: 'Spreadsheet automation task' },
  { id: 'jt-3', date: '2026-04-04', type: 'expense', category: 'Housing & Rent', source: 'Bank', amount: 18000, isFamilyShared: true, memberName: 'Household', note: 'Apartment rent' },
  { id: 'jt-4', date: '2026-04-06', type: 'expense', category: 'Groceries & Food', source: 'Cash', amount: 8400, isFamilyShared: true, memberName: 'Family Kitchen', note: 'Monthly bazar & staples' },
  { id: 'jt-5', date: '2026-04-08', type: 'expense', category: 'Utilities & Internet', source: 'Nagad (Manual)', amount: 3400, isFamilyShared: true, memberName: 'Home Bills', note: 'Electricity + broadband' },
  { id: 'jt-6', date: '2026-04-10', type: 'expense', category: 'Transport', source: 'Cash', amount: 4600, note: 'Daily commute & fuel' },
];

const INITIAL_BUDGETS: BudgetLimit[] = [
  { id: 'jb-1', category: 'Housing & Rent', monthlyLimit: 18000 },
  { id: 'jb-2', category: 'Groceries & Food', monthlyLimit: 10000 },
  { id: 'jb-3', category: 'Transport', monthlyLimit: 4000 },
  { id: 'jb-4', category: 'Utilities & Internet', monthlyLimit: 4500 },
  { id: 'jb-5', category: 'Education & Family', monthlyLimit: 5000 },
];

const INITIAL_GOALS: SavingsGoal[] = [
  { id: 'jg-1', title: 'Emergency Reserve Fund', targetAmount: 200000, savedAmount: 85000 },
  { id: 'jg-2', title: 'Family Annual Travel', targetAmount: 60000, savedAmount: 24000 },
];

const INITIAL_BILLS: PersonalBill[] = [
  { id: 'jbill-1', title: 'Home Fiber Internet', dueDate: '2026-04-18', amount: 1200, paid: false },
  { id: 'jbill-2', title: 'Mobile Postpaid Plan', dueDate: '2026-04-20', amount: 650, paid: false },
  { id: 'jbill-3', title: 'Gas & Water Utility', dueDate: '2026-04-12', amount: 1450, paid: true },
];

const INITIAL_HABITS: HabitItem[] = [
  { id: 'jh-1', title: 'Log daily expenses before sleep', streakDays: 9, doneToday: true },
  { id: 'jh-2', title: 'Morning Fajr & 20-min walk', streakDays: 14, doneToday: false },
  { id: 'jh-3', title: 'Zero impulse food delivery', streakDays: 5, doneToday: true },
];

export const DemoJibon: React.FC<JibonProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [txns, setTxns] = useState<PersonalTxn[]>(INITIAL_TXNS);
  const [budgets, setBudgets] = useState<BudgetLimit[]>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);
  const [bills, setBills] = useState<PersonalBill[]>(INITIAL_BILLS);
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [banner, setBanner] = useState<string | null>(null);

  const jibonModules: DemoModuleTab[] = [
    { id: 'dashboard', label: pick('Personal Dashboard', 'ব্যক্তিগত ড্যাশবোর্ড'), icon: LayoutDashboard },
    { id: 'income', label: pick('Income', 'আয়'), icon: TrendingUp },
    { id: 'expenses', label: pick('Expenses', 'খরচ'), icon: TrendingDown },
    { id: 'cash', label: pick('Cash', 'নগদ'), icon: Wallet },
    { id: 'bank', label: pick('Bank Accounts', 'ব্যাংক হিসাব'), icon: Landmark },
    { id: 'mobile-wallet', label: pick('Mobile Wallet Records', 'মোবাইল ওয়ালেট রেকর্ড'), icon: Smartphone },
    { id: 'family', label: pick('Family Budget', 'পারিবারিক বাজেট'), icon: Users },
    { id: 'monthly-budget', label: pick('Monthly Budget', 'মাসিক বাজেট'), icon: PieChart },
    { id: 'savings', label: pick('Savings Goals', 'সঞ্চয় লক্ষ্য'), icon: Target },
    { id: 'bills', label: pick('Bills', 'বিলসমূহ'), icon: Receipt },
    { id: 'habits', label: pick('Habit Tracker', 'অভ্যাস ট্র্যাকার'), icon: CheckSquare },
    { id: 'reports', label: pick('Personal Reports', 'ব্যক্তিগত রিপোর্ট'), icon: FileBarChart },
  ];

  const catLabel = (cat: string) => {
    switch (cat) {
      case 'Housing & Rent':
        return pick('Housing & Rent', 'বাসা ও ভাড়া');
      case 'Groceries & Food':
        return pick('Groceries & Food', 'বাজার ও খাবার');
      case 'Transport':
        return pick('Transport', 'যাতায়াত');
      case 'Utilities & Internet':
        return pick('Utilities & Internet', 'বিল ও ইন্টারনেট');
      case 'Education & Family':
        return pick('Education & Family', 'শিক্ষা ও পরিবার');
      case 'Health & Personal':
        return pick('Health & Personal', 'স্বাস্থ্য ও ব্যক্তিগত');
      case 'Monthly Salary':
        return pick('Monthly Salary', 'মাসিক বেতন');
      case 'Freelance Consulting':
        return pick('Freelance Consulting', 'ফ্রিল্যান্স পরামর্শ');
      case 'Family Allowance':
        return pick('Family Allowance', 'পারিবারিক ভাতা');
      case 'Other Income':
        return pick('Other Income', 'অন্যান্য আয়');
      case 'Personal Income':
        return pick('Personal Income', 'ব্যক্তিগত আয়');
      default:
        return cat;
    }
  };

  const sourceLabel = (src: WalletSource) => {
    switch (src) {
      case 'Cash':
        return pick('Cash', 'নগদ');
      case 'Bank':
        return pick('Bank Account', 'ব্যাংক হিসাব');
      case 'bKash (Manual)':
        return pick('bKash (Manual)', 'বিকাশ (ম্যানুয়াল)');
      case 'Nagad (Manual)':
        return pick('Nagad (Manual)', 'নগদ (ম্যানুয়াল)');
      case 'Rocket (Manual)':
        return pick('Rocket (Manual)', 'রকেট (ম্যানুয়াল)');
    }
  };

  // Entry Form State
  const [entryType, setEntryType] = useState<'income' | 'expense'>('expense');
  const [entryCategory, setEntryCategory] = useState('Groceries & Food');
  const [entrySource, setEntrySource] = useState<WalletSource>('Cash');
  const [entryAmount, setEntryAmount] = useState('');
  const [entryNote, setEntryNote] = useState('');
  const [entryFamily, setEntryFamily] = useState(false);

  // Savings / Bill / Habit inputs
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDue, setBillDue] = useState(getTodayISO());

  const handleResetDemo = () => {
    setTxns(INITIAL_TXNS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setBills(INITIAL_BILLS);
    setHabits(INITIAL_HABITS);
    setBanner(
      pick(
        'Jibon (জীবন) sample personal & family workspace restored.',
        'Jibon (জীবন) নমুনা ব্যক্তিগত ও পারিবারিক ওয়ার্কস্পেস পুনরুদ্ধার করা হয়েছে।'
      )
    );
  };

  const summary = useMemo(() => {
    const monthlyIncome = txns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const monthlyExpenses = txns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalBudgetCap = budgets.reduce((s, b) => s + b.monthlyLimit, 0);
    const remainingBudget = totalBudgetCap - monthlyExpenses;
    const totalSavings = goals.reduce((s, g) => s + g.savedAmount, 0);

    const calcBalance = (src: WalletSource, opening: number) =>
      opening +
      txns
        .filter((t) => t.source === src)
        .reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);

    const cashBalance = calcBalance('Cash', 15000);
    const bankBalance = calcBalance('Bank', 35000);
    const bkashBalance = calcBalance('bKash (Manual)', 4000);
    const nagadBalance = calcBalance('Nagad (Manual)', 6500);
    const rocketBalance = calcBalance('Rocket (Manual)', 2500);

    const categorySpend: Record<string, number> = {};
    txns
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
      });

    const overspentBudgets = budgets.filter(
      (b) => (categorySpend[b.category] || 0) > b.monthlyLimit
    );

    return {
      monthlyIncome,
      monthlyExpenses,
      totalBudgetCap,
      remainingBudget,
      totalSavings,
      cashBalance,
      bankBalance,
      bkashBalance,
      nagadBalance,
      rocketBalance,
      categorySpend,
      overspentBudgets,
    };
  }, [txns, budgets, goals]);

  const handleAddTransaction = (forcedType?: 'income' | 'expense', e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amt = parseSafeNumber(entryAmount);
    if (amt <= 0) {
      setBanner(pick('Please enter a positive BDT amount.', 'দয়া করে একটি ধনাত্মক টাকা পরিমাণ লিখুন।'));
      return;
    }
    const kind = forcedType || entryType;
    const item: PersonalTxn = {
      id: generateDemoId('jt'),
      date: getTodayISO(),
      type: kind,
      category: kind === 'income' ? (entryCategory === 'Groceries & Food' ? 'Personal Income' : entryCategory) : entryCategory,
      source: entrySource,
      amount: amt,
      isFamilyShared: entryFamily,
      memberName: entryFamily ? 'Household Shared' : undefined,
      note: entryNote.trim() || (kind === 'income' ? pick('Manual income entry', 'ম্যানুয়াল আয় এন্ট্রি') : pick('Manual expense entry', 'ম্যানুয়াল খরচ এন্ট্রি')),
    };
    setTxns((prev) => [item, ...prev]);
    setEntryAmount('');
    setEntryNote('');
    setBanner(
      pick(
        `Logged manual ${kind} of ${formatBDT(amt)} under ${entrySource}.`,
        `${sourceLabel(entrySource)}-এর অধীনে ${formatBDT(amt)} ম্যানুয়াল ${kind === 'income' ? 'আয়' : 'খরচ'} সংরক্ষণ করা হয়েছে।`
      )
    );
  };

  const notifications: DemoNotification[] = [
    ...summary.overspentBudgets.map((b) => ({
      id: `over-${b.id}`,
      title: `${pick('Budget Alert:', 'বাজেট সতর্কতা:')} ${catLabel(b.category)}`,
      detail: pick(
        `Spent ${formatBDT(summary.categorySpend[b.category] || 0)} vs ${formatBDT(b.monthlyLimit)} cap.`,
        `খরচ ${formatBDT(summary.categorySpend[b.category] || 0)} (সীমা ${formatBDT(b.monthlyLimit)})।`
      ),
      type: 'warning' as const,
    })),
    ...bills
      .filter((b) => !b.paid)
      .map((b) => ({
        id: `bill-${b.id}`,
        title: `${pick('Upcoming Bill:', 'আসন্ন বিল:')} ${b.title}`,
        detail: `${formatBDT(b.amount)} ${pick('due', 'শেষ তারিখ')} ${b.dueDate}`,
        type: 'info' as const,
      })),
  ];

  const handlePrint = () => {
    triggerPrintableReport(
      pick(
        'Jibon (জীবন) — Personal Monthly Spending & Budget Summary',
        'Jibon (জীবন) — ব্যক্তিগত মাসিক ব্যয় ও বাজেট সারসংক্ষেপ'
      ),
      `<table style="width:100%; border-collapse: collapse; font-size:13px;">
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Monthly Income', 'মাসিক আয়')}</td><td style="padding:8px; text-align:right; font-weight:700;">${formatBDT(summary.monthlyIncome)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Monthly Expenses', 'মাসিক খরচ')}</td><td style="padding:8px; text-align:right;">${formatBDT(summary.monthlyExpenses)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Remaining Monthly Budget', 'অবশিষ্ট মাসিক বাজেট')}</td><td style="padding:8px; text-align:right;">${formatBDT(summary.remainingBudget)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Total Savings Accumulated', 'মোট সঞ্চয়')}</td><td style="padding:8px; text-align:right; font-weight:700;">${formatBDT(summary.totalSavings)}</td></tr>
      </table>`
    );
  };

  return (
    <DemoWorkspace
      productName="Jibon (জীবন)"
      productSubtitle={pick(
        'Personal Finance, Manual Wallet Tracking, Family Budgets & Daily Habits',
        'ব্যক্তিগত অর্থব্যবস্থা, ম্যানুয়াল ওয়ালেট ট্র্যাকিং, পারিবারিক বাজেট ও দৈনন্দিন অভ্যাস'
      )}
      modules={jibonModules}
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      onResetDemo={handleResetDemo}
      onPrintReport={handlePrint}
      onRequestOnboarding={onRequestOnboarding}
      notifications={notifications}
      bannerMessage={banner}
      onClearBanner={() => setBanner(null)}
    >
      {/* Explicit Manual Entry Disclaimer */}
      <div className="px-3.5 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-[#D7E2F3] dark:border-sky-900 text-xs text-[#02377F] dark:text-sky-200 flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0345A4] dark:text-sky-400" />
        <span>
          <strong>{pick('Privacy Notice:', 'গোপনীয়তা বিজ্ঞপ্তি:')}</strong>{' '}
          {pick(
            'Jibon logs Cash, Bank, bKash, Nagad and Rocket records through ',
            'জীবন নগদ, ব্যাংক, বিকাশ, নগদ ও রকেট হিসাব '
          )}
          <strong>{pick('manual entry only', 'শুধুমাত্র ম্যানুয়াল এন্ট্রির মাধ্যমে')}</strong>
          {pick(
            '. There is no automatic bank or mobile wallet API synchronization and no PINs are requested.',
            ' সংরক্ষণ করে। এখানে কোনো স্বয়ংক্রিয় ব্যাংক বা মোবাইল ওয়ালেট এপিআই সংযোগ নেই এবং কোনো পিন চাওয়া হয় না।'
          )}
        </span>
      </div>

      {activeModule === 'dashboard' && (
        <div className="space-y-5">
          <DashboardCards
            columns={3}
            metrics={[
              { id: 'jb-inc', label: pick('Monthly Income', 'মাসিক আয়'), value: formatBDT(summary.monthlyIncome), tone: 'positive' },
              { id: 'jb-exp', label: pick('Monthly Expenses', 'মাসিক খরচ'), value: formatBDT(summary.monthlyExpenses), tone: 'warning' },
              { id: 'jb-rem', label: pick('Remaining Budget', 'অবশিষ্ট বাজেট'), value: formatBDT(summary.remainingBudget), tone: summary.remainingBudget >= 0 ? 'primary' : 'danger' },
              { id: 'jb-sav', label: pick('Savings Accumulated', 'সঞ্চিত অর্থ'), value: formatBDT(summary.totalSavings), tone: 'positive' },
              { id: 'jb-csh', label: pick('Current Cash', 'বর্তমান নগদ'), value: formatBDT(summary.cashBalance) },
              { id: 'jb-bnk', label: pick('Bank Balance', 'ব্যাংক ব্যালেন্স'), value: formatBDT(summary.bankBalance), subtext: `${pick('Manual MFS:', 'ম্যানুয়াল এমএফএস:')} ${formatBDT(summary.bkashBalance + summary.nagadBalance + summary.rocketBalance)}` },
            ]}
          />

          {/* Quick Personal Log Form */}
          <form
            onSubmit={(e) => handleAddTransaction(undefined, e)}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {pick('Quick Manual Income / Expense Log', 'দ্রুত ম্যানুয়াল আয় / খরচ লগ')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              <select value={entryType} onChange={(e) => setEntryType(e.target.value as 'income' | 'expense')} className="px-3 py-2.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-bold">
                <option value="expense">{pick('Expense (-)', 'খরচ (-)')}</option>
                <option value="income">{pick('Income (+)', 'আয় (+)')}</option>
              </select>
              <select value={entryCategory} onChange={(e) => setEntryCategory(e.target.value)} className="px-3 py-2.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs">
                {(entryType === 'income' ? ['Monthly Salary', 'Freelance Consulting', 'Family Allowance', 'Other Income'] : EXPENSE_CATEGORIES).map((c) => (
                  <option key={c} value={c}>{catLabel(c)}</option>
                ))}
              </select>
              <select value={entrySource} onChange={(e) => setEntrySource(e.target.value as WalletSource)} className="px-3 py-2.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs">
                <option value="Cash">{sourceLabel('Cash')}</option>
                <option value="Bank">{sourceLabel('Bank')}</option>
                <option value="bKash (Manual)">{pick('bKash (Manual Entry)', 'বিকাশ (ম্যানুয়াল এন্ট্রি)')}</option>
                <option value="Nagad (Manual)">{pick('Nagad (Manual Entry)', 'নগদ (ম্যানুয়াল এন্ট্রি)')}</option>
                <option value="Rocket (Manual)">{pick('Rocket (Manual Entry)', 'রকেট (ম্যানুয়াল এন্ট্রি)')}</option>
              </select>
              <input type="number" min="1" value={entryAmount} onChange={(e) => setEntryAmount(e.target.value)} placeholder={pick('Amount (BDT)', 'পরিমাণ (টাকা)')} className="px-3 py-2.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>{pick('Add Entry', 'এন্ট্রি যোগ করুন')}</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <input type="text" value={entryNote} onChange={(e) => setEntryNote(e.target.value)} placeholder={pick('Short note (e.g., Weekly groceries)', 'সংক্ষিপ্ত নোট (যেমন: সাপ্তাহিক বাজার)')} className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700" />
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input type="checkbox" checked={entryFamily} onChange={(e) => setEntryFamily(e.target.checked)} />
                <span>{pick('Mark as Shared Family Expense', 'যৌথ পারিবারিক খরচ হিসেবে চিহ্নিত করুন')}</span>
              </label>
            </div>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryBreakdownChart
              title={pick('Expense Categories Distribution', 'খরচের খাতভিত্তিক বণ্টন')}
              items={Object.entries(summary.categorySpend).map(([label, value]) => ({ label: catLabel(label), value }))}
            />
            <FinancialBarChart
              title={pick('Income vs Expenses & Savings Overview', 'আয় বনাম খরচ ও সঞ্চয় সারসংক্ষেপ')}
              data={[
                { label: pick('Income', 'আয়'), value: summary.monthlyIncome },
                { label: pick('Expenses', 'খরচ'), value: summary.monthlyExpenses },
                { label: pick('Budget Cap', 'বাজেট সীমা'), value: summary.totalBudgetCap },
                { label: pick('Total Saved', 'মোট সঞ্চয়'), value: summary.totalSavings },
              ]}
              primaryLabel={pick('Amount (BDT)', 'পরিমাণ (টাকা)')}
            />
          </div>
        </div>
      )}

      {(activeModule === 'income' || activeModule === 'expenses' || activeModule === 'cash' || activeModule === 'bank' || activeModule === 'mobile-wallet' || activeModule === 'family') && (
        <div className="space-y-5">
          {activeModule === 'mobile-wallet' && (
            <DashboardCards
              columns={3}
              metrics={[
                { id: 'mw-1', label: pick('bKash (Manual Log)', 'বিকাশ (ম্যানুয়াল লগ)'), value: formatBDT(summary.bkashBalance), subtext: pick('User-entered ledger balance', 'ব্যবহারকারী-প্রদত্ত লেজার ব্যালেন্স') },
                { id: 'mw-2', label: pick('Nagad (Manual Log)', 'নগদ (ম্যানুয়াল লগ)'), value: formatBDT(summary.nagadBalance), subtext: pick('User-entered ledger balance', 'ব্যবহারকারী-প্রদত্ত লেজার ব্যালেন্স') },
                { id: 'mw-3', label: pick('Rocket (Manual Log)', 'রকেট (ম্যানুয়াল লগ)'), value: formatBDT(summary.rocketBalance), subtext: pick('User-entered ledger balance', 'ব্যবহারকারী-প্রদত্ত লেজার ব্যালেন্স') },
              ]}
            />
          )}

          <InteractiveDataTable
            title={
              activeModule === 'income'
                ? pick('Monthly Income Records', 'মাসিক আয়ের রেকর্ড')
                : activeModule === 'expenses'
                ? pick('Expense Records', 'খরচের রেকর্ড')
                : activeModule === 'cash'
                ? pick('Cash Wallet Ledger', 'নগদ ওয়ালেট লেজার')
                : activeModule === 'bank'
                ? pick('Bank Account Manual Ledger', 'ব্যাংক হিসাবের ম্যানুয়াল লেজার')
                : activeModule === 'mobile-wallet'
                ? pick('Manual Mobile Wallet Entries (bKash / Nagad / Rocket)', 'ম্যানুয়াল মোবাইল ওয়ালেট এন্ট্রি (বিকাশ / নগদ / রকেট)')
                : pick('Shared Family Budget Expenses', 'যৌথ পারিবারিক বাজেট খরচ')
            }
            rows={txns.filter((t) => {
              if (activeModule === 'income') return t.type === 'income';
              if (activeModule === 'expenses') return t.type === 'expense';
              if (activeModule === 'cash') return t.source === 'Cash';
              if (activeModule === 'bank') return t.source === 'Bank';
              if (activeModule === 'mobile-wallet') return t.source.includes('Manual');
              if (activeModule === 'family') return Boolean(t.isFamilyShared);
              return true;
            })}
            columns={[
              { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
              { key: 'cat', header: pick('Category', 'খাত'), render: (r) => <span className="font-semibold">{catLabel(r.category)}</span> },
              { key: 'src', header: pick('Wallet', 'ওয়ালেট'), render: (r) => sourceLabel(r.source) },
              { key: 'note', header: pick('Note', 'নোট'), render: (r) => r.note },
              {
                key: 'amt',
                header: pick('Amount', 'পরিমাণ'),
                align: 'right',
                render: (r) => (
                  <span className={r.type === 'income' ? 'font-bold text-emerald-700' : 'font-bold'}>
                    {r.type === 'income' ? '+' : '-'}{formatBDT(r.amount)}
                  </span>
                ),
              },
            ]}
            getSearchText={(r) => `${r.category} ${catLabel(r.category)} ${r.source} ${r.note}`}
            getDateValue={(r) => r.date}
            onDelete={(id) => {
              setTxns((prev) => prev.filter((t) => t.id !== id));
              setBanner(pick('Entry deleted — wallet & budget balances updated.', 'এন্ট্রি মুছে ফেলা হয়েছে — ওয়ালেট ও বাজেট ব্যালেন্স আপডেট হয়েছে।'));
            }}
          />
        </div>
      )}

      {activeModule === 'monthly-budget' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-5 space-y-4">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('Category Monthly Budget Utilization & Overspending Alerts', 'খাতভিত্তিক মাসিক বাজেট ব্যবহার ও অতিরিক্ত ব্যয় সতর্কতা')}
            </h4>
            <div className="space-y-4">
              {budgets.map((b) => {
                const spent = summary.categorySpend[b.category] || 0;
                const pct = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
                const isOver = spent > b.monthlyLimit;
                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#0B1730] dark:text-white flex items-center gap-1.5">
                        {isOver && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                        <span>{catLabel(b.category)}</span>
                      </span>
                      <div className="flex items-center gap-3 font-mono tabular-nums">
                        <span className={isOver ? 'text-rose-600 font-bold' : 'text-[#5F6D82]'}>
                          {pick('Spent:', 'খরচ:')} {formatBDT(spent)} / {pick('Cap:', 'সীমা:')}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={b.monthlyLimit}
                          onChange={(e) => {
                            const val = Math.max(0, parseSafeNumber(e.target.value));
                            setBudgets((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, monthlyLimit: val } : item))
                            );
                          }}
                          className="w-24 px-2 py-1 rounded bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-right font-bold"
                        />
                        <span className="w-12 text-right font-bold">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F4F8FF] dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver ? 'bg-rose-600' : pct >= 85 ? 'bg-amber-500' : 'bg-[#0345A4]'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeModule === 'savings' && (
        <div className="space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = parseSafeNumber(goalTarget);
              if (!goalTitle.trim() || target <= 0) return;
              setGoals((prev) => [
                { id: generateDemoId('jg'), title: goalTitle.trim(), targetAmount: target, savedAmount: 0 },
                ...prev,
              ]);
              setGoalTitle('');
              setGoalTarget('');
              setBanner(pick('Added personal savings target.', 'ব্যক্তিগত সঞ্চয় লক্ষ্য যোগ করা হয়েছে।'));
            }}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 flex flex-wrap gap-2.5"
          >
            <input type="text" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder={pick('New Savings Goal Title', 'নতুন সঞ্চয় লক্ষ্যের শিরোনাম')} className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
            <input type="number" min="1" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} placeholder={pick('Target (BDT)', 'লক্ষ্য (টাকা)')} className="w-36 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer">
              {pick('Add Goal', 'লক্ষ্য যোগ করুন')}
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.savedAmount / Math.max(1, g.targetAmount)) * 100));
              return (
                <div key={g.id} className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <h5 className="font-bold text-sm text-[#0B1730] dark:text-white">{g.title}</h5>
                      <span className="font-mono text-[#5F6D82]">
                        {formatBDT(g.savedAmount)} {pick('of', 'এর')} {formatBDT(g.targetAmount)} ({pct}%)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setGoals((prev) =>
                          prev.map((item) =>
                            item.id === g.id ? { ...item, savedAmount: item.savedAmount + 5000 } : item
                          )
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[11px] font-bold text-[#0345A4] cursor-pointer"
                    >
                      {pick('+ ৳5,000 Deposit', '+ ৳৫,০০০ জমা')}
                    </button>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#F4F8FF] dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeModule === 'bills' && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const amt = parseSafeNumber(billAmount);
              if (!billTitle.trim() || amt <= 0) return;
              setBills((prev) => [
                { id: generateDemoId('jbill'), title: billTitle.trim(), amount: amt, dueDate: billDue, paid: false },
                ...prev,
              ]);
              setBillTitle('');
              setBillAmount('');
            }}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 flex flex-wrap gap-2.5"
          >
            <input type="text" value={billTitle} onChange={(e) => setBillTitle(e.target.value)} placeholder={pick('Bill Name', 'বিলের নাম')} className="flex-1 min-w-[160px] px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
            <input type="date" value={billDue} onChange={(e) => setBillDue(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
            <input type="number" min="1" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} placeholder={pick('Amount', 'পরিমাণ')} className="w-32 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#0345A4] text-white text-xs font-bold cursor-pointer">
              {pick('Add Bill Reminder', 'বিল রিমাইন্ডার যোগ করুন')}
            </button>
          </form>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 divide-y divide-[#D7E2F3]/70 dark:divide-slate-800">
            {bills.map((b) => (
              <div key={b.id} className="px-4 py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className={`font-bold ${b.paid ? 'line-through text-[#5F6D82]' : ''}`}>{b.title}</div>
                  <div className="text-[11px] text-[#5F6D82] font-mono">{pick('Due:', 'শেষ তারিখ:')} {b.dueDate}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">{formatBDT(b.amount)}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setBills((prev) =>
                        prev.map((item) => (item.id === b.id ? { ...item, paid: !item.paid } : item))
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      b.paid ? 'bg-emerald-600 text-white' : 'bg-[#F4F8FF] text-[#0345A4] border border-[#D7E2F3]'
                    }`}
                  >
                    {b.paid ? pick('Paid ✓', 'পরিশোধিত ✓') : pick('Mark Paid', 'পরিশোধিত চিহ্নিত করুন')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeModule === 'habits' && (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 divide-y divide-[#D7E2F3]/70 dark:divide-slate-800">
          {habits.map((h) => (
            <div key={h.id} className="px-4 py-3.5 flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-sm text-[#0B1730] dark:text-white">{h.title}</div>
                <div className="text-[11px] text-[#0A63D8] font-semibold">
                  {pick('Active Streak:', 'সক্রিয় ধারা:')} {h.streakDays} {pick('days', 'দিন')}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setHabits((prev) =>
                    prev.map((item) =>
                      item.id === h.id
                        ? {
                            ...item,
                            doneToday: !item.doneToday,
                            streakDays: !item.doneToday ? item.streakDays + 1 : Math.max(0, item.streakDays - 1),
                          }
                        : item
                    )
                  )
                }
                className={`px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                  h.doneToday
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] border border-[#D7E2F3]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{h.doneToday ? pick('Completed Today', 'আজ সম্পন্ন হয়েছে') : pick('Check Off Today', 'আজকের কাজ সম্পন্ন করুন')}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {activeModule === 'reports' && (
        <div className="space-y-4">
          <CategoryBreakdownChart
            title={pick('Monthly Personal Spending by Category', 'খাতভিত্তিক মাসিক ব্যক্তিগত ব্যয়')}
            items={Object.entries(summary.categorySpend).map(([label, value]) => ({ label: catLabel(label), value }))}
          />
        </div>
      )}
    </DemoWorkspace>
  );
};

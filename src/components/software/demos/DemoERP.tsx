import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Warehouse,
  Users,
  Wallet,
  Building,
  Truck,
  GitBranch,
  FileBarChart,
  ArrowLeftRight,
  Plus,
} from 'lucide-react';
import { DemoWorkspace, DemoModuleTab } from '../workspace/DemoWorkspace';
import { DashboardCards, DashboardMetricCard } from '../workspace/DashboardCards';
import { InteractiveDataTable } from '../workspace/InteractiveDataTable';
import { FinancialBarChart, CategoryBreakdownChart } from '../workspace/FinancialChart';
import { DetailModal } from '../workspace/DetailModal';
import {
  formatBDT,
  getTodayISO,
  generateDemoId,
  parseSafeNumber,
  triggerPrintableReport,
} from '../../../utils/demoFormatters';
import { useLanguage } from '../../../context/LanguageContext';

interface ErpProps {
  onRequestOnboarding?: () => void;
}

type BranchId = 'all' | 'br-dhk' | 'br-ctg' | 'br-syl';

interface ErpOrder {
  id: string;
  date: string;
  orderNo: string;
  kind: 'Sales Order' | 'Purchase Order';
  branchId: Exclude<BranchId, 'all'>;
  party: string;
  amount: number;
  status: 'Confirmed' | 'Dispatched' | 'Received';
}

interface WarehouseStock {
  id: string;
  sku: string;
  itemName: string;
  unitCost: number;
  dhakaQty: number;
  chattogramQty: number;
  sylhetQty: number;
}

interface ErpEmployee {
  id: string;
  empId: string;
  name: string;
  department: string;
  branchId: Exclude<BranchId, 'all'>;
  basicSalary: number;
  allowances: number;
  deductions: number;
}

interface ErpExpense {
  id: string;
  date: string;
  branchId: Exclude<BranchId, 'all'>;
  category: string;
  amount: number;
}

const BRANCH_NAMES: Record<BranchId, string> = {
  all: 'All Branches (Consolidated)',
  'br-dhk': 'Dhaka Corporate Hub',
  'br-ctg': 'Chattogram Operations Zone',
  'br-syl': 'Sylhet Regional Depot',
};

const INITIAL_ORDERS: ErpOrder[] = [
  { id: 'ord-1', date: '2026-04-01', orderNo: 'SO-3011', kind: 'Sales Order', branchId: 'br-dhk', party: 'Metro Logistics BD', amount: 420000, status: 'Dispatched' },
  { id: 'ord-2', date: '2026-04-03', orderNo: 'SO-3012', kind: 'Sales Order', branchId: 'br-ctg', party: 'Port City Distributors', amount: 365000, status: 'Confirmed' },
  { id: 'ord-3', date: '2026-04-05', orderNo: 'SO-3013', kind: 'Sales Order', branchId: 'br-syl', party: 'Surma Retail Group', amount: 185000, status: 'Dispatched' },
  { id: 'ord-4', date: '2026-04-06', orderNo: 'PO-7101', kind: 'Purchase Order', branchId: 'br-dhk', party: 'Apex Manufacturing', amount: 245000, status: 'Received' },
  { id: 'ord-5', date: '2026-04-08', orderNo: 'PO-7102', kind: 'Purchase Order', branchId: 'br-ctg', party: 'Bay Import Supply', amount: 190000, status: 'Received' },
];

const INITIAL_STOCK: WarehouseStock[] = [
  { id: 'st-1', sku: 'ERP-101', itemName: 'Enterprise Barcode Terminal', unitCost: 14500, dhakaQty: 24, chattogramQty: 18, sylhetQty: 8 },
  { id: 'st-2', sku: 'ERP-102', itemName: 'Commercial Receipt Printer', unitCost: 6800, dhakaQty: 32, chattogramQty: 22, sylhetQty: 10 },
  { id: 'st-3', sku: 'ERP-103', itemName: 'Warehouse Label Roll Pack', unitCost: 1200, dhakaQty: 85, chattogramQty: 60, sylhetQty: 35 },
];

const INITIAL_EMPLOYEES: ErpEmployee[] = [
  { id: 'emp-1', empId: 'TH-011', name: 'Nafis Chowdhury', department: 'Finance & Accounts', branchId: 'br-ctg', basicSalary: 48000, allowances: 14000, deductions: 2500 },
  { id: 'emp-2', empId: 'TH-012', name: 'Tanjila Akter', department: 'Enterprise Sales', branchId: 'br-dhk', basicSalary: 52000, allowances: 16000, deductions: 3000 },
  { id: 'emp-3', empId: 'TH-013', name: 'Mahmudul Hasan', department: 'Warehouse Ops', branchId: 'br-syl', basicSalary: 34000, allowances: 9500, deductions: 1200 },
];

const INITIAL_EXPENSES: ErpExpense[] = [
  { id: 'ex-1', date: '2026-04-02', branchId: 'br-dhk', category: 'Office Lease & Utilities', amount: 68000 },
  { id: 'ex-2', date: '2026-04-04', branchId: 'br-ctg', category: 'Fleet & Port Logistics', amount: 44000 },
  { id: 'ex-3', date: '2026-04-07', branchId: 'br-syl', category: 'Depot Operations', amount: 26000 },
];

const ERP_MODULES: DemoModuleTab[] = [
  { id: 'executive', label: 'Executive Dashboard', icon: LayoutDashboard },
  { id: 'accounting', label: 'Financial Accounting', icon: BookOpen },
  { id: 'sales', label: 'Sales Management', icon: TrendingUp },
  { id: 'purchase', label: 'Purchase Management', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory Management', icon: Boxes },
  { id: 'warehouse', label: 'Warehouse Management', icon: Warehouse },
  { id: 'hr', label: 'Human Resources', icon: Users },
  { id: 'payroll', label: 'Payroll', icon: Wallet },
  { id: 'customers', label: 'Customer Management', icon: Building },
  { id: 'suppliers', label: 'Supplier Management', icon: Truck },
  { id: 'branches', label: 'Branch Management', icon: GitBranch },
  { id: 'reports', label: 'Management Reports', icon: FileBarChart },
];

export const DemoERP: React.FC<ErpProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();
  const [activeModule, setActiveModule] = useState('executive');
  const [selectedBranch, setSelectedBranch] = useState<BranchId>('all');
  const [orders, setOrders] = useState<ErpOrder[]>(INITIAL_ORDERS);
  const [stocks, setStocks] = useState<WarehouseStock[]>(INITIAL_STOCK);
  const [employees] = useState<ErpEmployee[]>(INITIAL_EMPLOYEES);
  const [expenses, setExpenses] = useState<ErpExpense[]>(INITIAL_EXPENSES);
  const [banner, setBanner] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<ErpOrder | null>(null);

  const branchNames: Record<BranchId, string> = {
    all: pick('All Branches (Consolidated)', 'সকল শাখা (সমন্বিত)'),
    'br-dhk': pick('Dhaka Corporate Hub', 'ঢাকা কর্পোরেট হাব'),
    'br-ctg': pick('Chattogram Operations Zone', 'চট্টগ্রাম অপারেশনস জোন'),
    'br-syl': pick('Sylhet Regional Depot', 'সিলেট আঞ্চলিক ডিপো'),
  };

  const erpModules: DemoModuleTab[] = [
    { id: 'executive', label: pick('Executive Dashboard', 'এক্সিকিউটিভ ড্যাশবোর্ড'), icon: LayoutDashboard },
    { id: 'accounting', label: pick('Financial Accounting', 'আর্থিক হিসাবরক্ষণ'), icon: BookOpen },
    { id: 'sales', label: pick('Sales Management', 'বিক্রয় ব্যবস্থাপনা'), icon: TrendingUp },
    { id: 'purchase', label: pick('Purchase Management', 'ক্রয় ব্যবস্থাপনা'), icon: ShoppingCart },
    { id: 'inventory', label: pick('Inventory Management', 'ইনভেন্টরি ব্যবস্থাপনা'), icon: Boxes },
    { id: 'warehouse', label: pick('Warehouse Management', 'গুদাম ব্যবস্থাপনা'), icon: Warehouse },
    { id: 'hr', label: pick('Human Resources', 'মানবসম্পদ (HR)'), icon: Users },
    { id: 'payroll', label: pick('Payroll', 'বেতন ও পে-রোল'), icon: Wallet },
    { id: 'customers', label: pick('Customer Management', 'গ্রাহক ব্যবস্থাপনা'), icon: Building },
    { id: 'suppliers', label: pick('Supplier Management', 'সরবরাহকারী ব্যবস্থাপনা'), icon: Truck },
    { id: 'branches', label: pick('Branch Management', 'শাখা ব্যবস্থাপনা'), icon: GitBranch },
    { id: 'reports', label: pick('Management Reports', 'ম্যানেজমেন্ট রিপোর্ট'), icon: FileBarChart },
  ];

  const orderKindLabel = (kind: ErpOrder['kind']) =>
    kind === 'Sales Order' ? pick('Sales Order', 'সেলস অর্ডার') : pick('Purchase Order', 'পারচেজ অর্ডার');

  const statusLabel = (st: ErpOrder['status']) => {
    if (st === 'Confirmed') return pick('Confirmed', 'নিশ্চিত');
    if (st === 'Dispatched') return pick('Dispatched', 'প্রেরিত');
    return pick('Received', 'গৃহীত');
  };

  // Order creation form state
  const [orderBranch, setOrderBranch] = useState<Exclude<BranchId, 'all'>>('br-dhk');
  const [orderParty, setOrderParty] = useState('');
  const [orderAmount, setOrderAmount] = useState('');

  // Expense form state
  const [expBranch, setExpBranch] = useState<Exclude<BranchId, 'all'>>('br-dhk');
  const [expCategory, setExpCategory] = useState('');
  const [expAmount, setExpAmount] = useState('');

  // Warehouse transfer state
  const [transferItemId, setTransferItemId] = useState('st-1');
  const [fromWh, setFromWh] = useState<'dhakaQty' | 'chattogramQty' | 'sylhetQty'>('dhakaQty');
  const [toWh, setToWh] = useState<'dhakaQty' | 'chattogramQty' | 'sylhetQty'>('chattogramQty');
  const [transferQty, setTransferQty] = useState('3');

  const handleResetDemo = () => {
    setOrders(INITIAL_ORDERS);
    setStocks(INITIAL_STOCK);
    setExpenses(INITIAL_EXPENSES);
    setSelectedBranch('all');
    setBanner(pick('TecHisab ERP enterprise simulation data restored to defaults.', 'TecHisab ERP এন্টারপ্রাইজ সিমুলেশন ডেটা ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে।'));
  };

  const branchSummary = useMemo(() => {
    const computeBranch = (b: BranchId) => {
      const fOrders = b === 'all' ? orders : orders.filter((o) => o.branchId === b);
      const fExpenses = b === 'all' ? expenses : expenses.filter((e) => e.branchId === b);
      const fEmps = b === 'all' ? employees : employees.filter((em) => em.branchId === b);

      const revenue = fOrders
        .filter((o) => o.kind === 'Sales Order')
        .reduce((s, o) => s + o.amount, 0);
      const purchases = fOrders
        .filter((o) => o.kind === 'Purchase Order')
        .reduce((s, o) => s + o.amount, 0);
      const payrollCost = fEmps.reduce(
        (s, e) => s + e.basicSalary + e.allowances,
        0
      );
      const directCogs = Math.round(revenue * 0.58);
      const opExpenses = fExpenses.reduce((s, e) => s + e.amount, 0) + payrollCost;
      const grossProfit = revenue - directCogs;
      const netProfit = grossProfit - opExpenses;

      const invValue = stocks.reduce((s, item) => {
        const qty =
          b === 'all'
            ? item.dhakaQty + item.chattogramQty + item.sylhetQty
            : b === 'br-dhk'
            ? item.dhakaQty
            : b === 'br-ctg'
            ? item.chattogramQty
            : item.sylhetQty;
        return s + qty * item.unitCost;
      }, 0);

      const receivables = Math.round(revenue * 0.28);
      const payables = Math.round(purchases * 0.32);
      const currentAssets = invValue + receivables + 380000;
      const currentLiabilities = payables + 95000;

      return {
        revenue,
        purchases,
        opExpenses,
        grossProfit,
        netProfit,
        invValue,
        receivables,
        payables,
        currentAssets,
        currentLiabilities,
        payrollCost,
      };
    };

    return {
      active: computeBranch(selectedBranch),
      dhaka: computeBranch('br-dhk'),
      chattogram: computeBranch('br-ctg'),
      sylhet: computeBranch('br-syl'),
    };
  }, [orders, expenses, employees, stocks, selectedBranch]);

  const activeData = branchSummary.active;

  const kpiCards: DashboardMetricCard[] = [
    { id: 'e-rev', label: pick('Total Revenue', 'মোট রাজস্ব'), value: formatBDT(activeData.revenue), subtext: branchNames[selectedBranch], tone: 'primary' },
    { id: 'e-exp', label: pick('Total Expenses', 'মোট ব্যয়'), value: formatBDT(activeData.opExpenses), subtext: pick('Incl. branch payroll', 'শাখার বেতনসহ'), tone: 'warning' },
    { id: 'e-gp', label: pick('Gross Profit', 'মোট মুনাফা'), value: formatBDT(activeData.grossProfit), subtext: pick('Est. direct margin 42%', 'আনুমানিক প্রত্যক্ষ মার্জিন ৪২%'), tone: 'positive' },
    { id: 'e-np', label: pick('Net Profit', 'নিট মুনাফা'), value: formatBDT(activeData.netProfit), tone: activeData.netProfit >= 0 ? 'positive' : 'danger' },
    { id: 'e-ca', label: pick('Current Assets', 'চলতি সম্পদ'), value: formatBDT(activeData.currentAssets), subtext: pick('Cash + Stock + A/R', 'নগদ + মজুত + প্রাপ্য') },
    { id: 'e-cl', label: pick('Current Liabilities', 'চলতি দায়'), value: formatBDT(activeData.currentLiabilities), subtext: pick('Payables + Accruals', 'প্রদেয় + বকেয়া') },
    { id: 'e-inv', label: pick('Total Inventory Value', 'মোট ইনভেন্টরি মূল্য'), value: formatBDT(activeData.invValue), subtext: pick(`${stocks.length} active SKUs`, `${stocks.length}টি সক্রিয় SKU`) },
    { id: 'e-rec', label: pick('Outstanding Receivables', 'বকেয়া প্রাপ্য'), value: formatBDT(activeData.receivables) },
    { id: 'e-pay', label: pick('Outstanding Payables', 'বকেয়া প্রদেয়'), value: formatBDT(activeData.payables) },
  ];

  const handleCreateOrder = (kind: 'Sales Order' | 'Purchase Order', e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseSafeNumber(orderAmount);
    if (!orderParty.trim() || amt <= 0) {
      setBanner(pick('Enter valid party name and positive order amount.', 'সঠিক পার্টি নাম এবং ধনাত্মক অর্ডার পরিমাণ দিন।'));
      return;
    }
    const newOrder: ErpOrder = {
      id: generateDemoId('ord'),
      date: getTodayISO(),
      orderNo: generateDemoId(kind === 'Sales Order' ? 'SO' : 'PO'),
      kind,
      branchId: selectedBranch === 'all' ? orderBranch : selectedBranch,
      party: orderParty.trim(),
      amount: amt,
      status: kind === 'Sales Order' ? 'Confirmed' : 'Received',
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderParty('');
    setOrderAmount('');
    setBanner(
      pick(
        `Created ${kind} (${newOrder.orderNo}) for ${branchNames[newOrder.branchId]}.`,
        `${branchNames[newOrder.branchId]}-এর জন্য ${orderKindLabel(kind)} (${newOrder.orderNo}) তৈরি করা হয়েছে।`
      )
    );
  };

  const handleTransferStock = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.round(parseSafeNumber(transferQty));
    if (fromWh === toWh) {
      setBanner(pick('Source and destination warehouses must be different.', 'উৎস এবং গন্তব্য গুদাম ভিন্ন হতে হবে।'));
      return;
    }
    if (qty <= 0) {
      setBanner(pick('Transfer quantity must be at least 1.', 'স্থানান্তর পরিমাণ কমপক্ষে ১ হতে হবে।'));
      return;
    }
    const target = stocks.find((s) => s.id === transferItemId);
    if (!target || target[fromWh] < qty) {
      setBanner(pick('Insufficient warehouse stock for requested transfer.', 'অনুরোধকৃত স্থানান্তরের জন্য গুদামে পর্যাপ্ত মজুত নেই।'));
      return;
    }
    setStocks((prev) =>
      prev.map((item) =>
        item.id === transferItemId
          ? {
              ...item,
              [fromWh]: item[fromWh] - qty,
              [toWh]: item[toWh] + qty,
            }
          : item
      )
    );
    setBanner(pick(`Transferred ${qty} units of ${target.itemName} successfully.`, `${target.itemName}-এর ${qty}টি ইউনিট সফলভাবে স্থানান্তর করা হয়েছে।`));
  };

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseSafeNumber(expAmount);
    if (!expCategory.trim() || amt <= 0) {
      setBanner(pick('Enter valid expense description and positive amount.', 'সঠিক ব্যয়ের বিবরণ এবং ধনাত্মক পরিমাণ দিন।'));
      return;
    }
    const item: ErpExpense = {
      id: generateDemoId('ex'),
      date: getTodayISO(),
      branchId: selectedBranch === 'all' ? expBranch : selectedBranch,
      category: expCategory.trim(),
      amount: amt,
    };
    setExpenses((prev) => [item, ...prev]);
    setExpCategory('');
    setExpAmount('');
    setBanner(pick(`Recorded enterprise expense of ${formatBDT(amt)}.`, `${formatBDT(amt)} টাকার এন্টারপ্রাইজ ব্যয় সংরক্ষণ করা হয়েছে।`));
  };

  const filteredOrders =
    selectedBranch === 'all' ? orders : orders.filter((o) => o.branchId === selectedBranch);

  const handlePrint = () => {
    triggerPrintableReport(
      `${pick('TecHisab ERP', 'TecHisab ERP')} — ${branchNames[selectedBranch]}`,
      `
      <p style="font-size:12px; color:#5F6D82;">${pick('All enterprise ERP figures below are simulated demonstration totals.', 'নিচের সকল এন্টারপ্রাইজ ERP হিসাব ডেমো প্রদর্শনের জন্য নমুনা তথ্য।')}</p>
      <table style="width:100%; border-collapse: collapse; font-size: 13px;">
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Revenue', 'রাজস্ব')}</td><td style="padding:8px; text-align:right; font-weight:700;">${formatBDT(activeData.revenue)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Operating & Payroll Expenses', 'পরিচালন ও পে-রোল ব্যয়')}</td><td style="padding:8px; text-align:right;">${formatBDT(activeData.opExpenses)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Gross Profit', 'মোট মুনাফা')}</td><td style="padding:8px; text-align:right;">${formatBDT(activeData.grossProfit)}</td></tr>
        <tr><td style="padding:8px; border-bottom:2px solid #0345A4;">${pick('Net Profit', 'নিট মুনাফা')}</td><td style="padding:8px; text-align:right; font-weight:800; color:#0345A4;">${formatBDT(activeData.netProfit)}</td></tr>
      </table>`
    );
  };

  return (
    <DemoWorkspace
      productName="TecHisab ERP"
      productSubtitle={pick(
        'Multi-Branch Accounting, Warehouse Transfers, Payroll & Consolidated MIS (Simulated Enterprise Data)',
        'মাল্টি-ব্রাঞ্চ অ্যাকাউন্টিং, গুদাম ট্রান্সফার, পে-রোল ও সমন্বিত MIS (নমুনা এন্টারপ্রাইজ ডেটা)'
      )}
      modules={erpModules}
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      onResetDemo={handleResetDemo}
      onPrintReport={handlePrint}
      onRequestOnboarding={onRequestOnboarding}
      bannerMessage={banner}
      onClearBanner={() => setBanner(null)}
      headerExtras={
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value as BranchId)}
          aria-label={pick('Switch branch', 'শাখা পরিবর্তন করুন')}
          className="px-2.5 py-1.5 rounded-lg bg-white/15 text-white border border-white/25 text-xs font-semibold cursor-pointer focus:outline-none"
        >
          <option value="all" className="text-[#0B1730]">{branchNames.all}</option>
          <option value="br-dhk" className="text-[#0B1730]">{branchNames['br-dhk']}</option>
          <option value="br-ctg" className="text-[#0B1730]">{branchNames['br-ctg']}</option>
          <option value="br-syl" className="text-[#0B1730]">{branchNames['br-syl']}</option>
        </select>
      }
    >
      {activeModule === 'executive' && (
        <div className="space-y-5">
          <DashboardCards metrics={kpiCards} columns={3} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FinancialBarChart
              title={pick('Branch Performance Comparison (Simulated)', 'শাখাভিত্তিক পারফরম্যান্স তুলনা (নমুনা)')}
              subtitle={pick('Revenue vs Net Profit across 3 regional branches', '৩টি আঞ্চলিক শাখায় রাজস্ব বনাম নিট মুনাফা')}
              data={[
                { label: pick('Dhaka Hub', 'ঢাকা হাব'), value: branchSummary.dhaka.revenue, secondaryValue: Math.max(0, branchSummary.dhaka.netProfit) },
                { label: pick('Chattogram Zone', 'চট্টগ্রাম জোন'), value: branchSummary.chattogram.revenue, secondaryValue: Math.max(0, branchSummary.chattogram.netProfit) },
                { label: pick('Sylhet Depot', 'সিলেট ডিপো'), value: branchSummary.sylhet.revenue, secondaryValue: Math.max(0, branchSummary.sylhet.netProfit) },
              ]}
              primaryLabel={pick('Branch Revenue', 'শাখার রাজস্ব')}
              secondaryLabel={pick('Net Profit', 'নিট মুনাফা')}
            />
            <CategoryBreakdownChart
              title={pick('Enterprise Expense & Cost Breakdown', 'এন্টারপ্রাইজ ব্যয় ও খরচের বিভাজন')}
              subtitle={pick('Simulated cost structure across selected scope', 'নির্বাচিত শাখা অনুযায়ী নমুনা খরচের কাঠামো')}
              items={[
                { label: pick('Direct Cost of Goods (Est.)', 'প্রত্যক্ষ পণ্য ব্যয় (আনুমানিক)'), value: Math.max(0, activeData.revenue - activeData.grossProfit) },
                { label: pick('Departmental Payroll', 'বিভাগীয় বেতন ও পে-রোল'), value: activeData.payrollCost },
                { label: pick('Branch Operations & Overhead', 'শাখা পরিচালন ও ওভারহেড'), value: Math.max(0, activeData.opExpenses - activeData.payrollCost) },
                { label: pick('Inventory Asset Held', 'মজুতকৃত ইনভেন্টরি সম্পদ'), value: activeData.invValue },
              ]}
            />
          </div>
        </div>
      )}

      {(activeModule === 'sales' || activeModule === 'purchase') && (
        <div className="space-y-5">
          <form
            onSubmit={(e) =>
              handleCreateOrder(
                activeModule === 'sales' ? 'Sales Order' : 'Purchase Order',
                e
              )
            }
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {activeModule === 'sales'
                ? pick('Create Simulated Sales Order', 'নমুনা সেলস অর্ডার তৈরি করুন')
                : pick('Create Simulated Purchase Order', 'নমুনা পারচেজ অর্ডার তৈরি করুন')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {selectedBranch === 'all' && (
                <select
                  value={orderBranch}
                  onChange={(e) => setOrderBranch(e.target.value as Exclude<BranchId, 'all'>)}
                  className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
                >
                  <option value="br-dhk">{pick('Dhaka Hub', 'ঢাকা হাব')}</option>
                  <option value="br-ctg">{pick('Chattogram Zone', 'চট্টগ্রাম জোন')}</option>
                  <option value="br-syl">{pick('Sylhet Depot', 'সিলেট ডিপো')}</option>
                </select>
              )}
              <input
                type="text"
                value={orderParty}
                onChange={(e) => setOrderParty(e.target.value)}
                placeholder={activeModule === 'sales' ? pick('Enterprise Customer', 'এন্টারপ্রাইজ গ্রাহক') : pick('Approved Vendor', 'অনুমোদিত সরবরাহকারী')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              />
              <input
                type="number"
                min="1"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder={pick('Order Amount (BDT)', 'অর্ডার পরিমাণ (BDT)')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{pick('Create Order', 'অর্ডার তৈরি করুন')}</span>
              </button>
            </div>
          </form>

          <InteractiveDataTable
            title={activeModule === 'sales' ? pick('Enterprise Sales Orders', 'এন্টারপ্রাইজ সেলস অর্ডার') : pick('Procurement Purchase Orders', 'সংগ্রহ পারচেজ অর্ডার')}
            rows={filteredOrders.filter((o) =>
              o.kind === (activeModule === 'sales' ? 'Sales Order' : 'Purchase Order')
            )}
            columns={[
              { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
              { key: 'no', header: pick('Order #', 'অর্ডার #'), render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.orderNo}</span> },
              { key: 'br', header: pick('Branch', 'শাখা'), render: (r) => branchNames[r.branchId] },
              { key: 'party', header: pick('Party', 'পার্টি'), render: (r) => <span className="font-semibold">{r.party}</span> },
              { key: 'st', header: pick('Status', 'অবস্থা'), render: (r) => statusLabel(r.status) },
              { key: 'amt', header: pick('Value', 'মূল্য'), align: 'right', render: (r) => formatBDT(r.amount) },
            ]}
            getSearchText={(r) => `${r.orderNo} ${r.party} ${branchNames[r.branchId]}`}
            getDateValue={(r) => r.date}
            onView={(r) => setDetailOrder(r)}
            onDelete={(id) => {
              setOrders((prev) => prev.filter((o) => o.id !== id));
              setBanner(pick('Simulated order removed.', 'নমুনা অর্ডার মুছে ফেলা হয়েছে।'));
            }}
          />
        </div>
      )}

      {(activeModule === 'inventory' || activeModule === 'warehouse') && (
        <div className="space-y-5">
          <form
            onSubmit={handleTransferStock}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-[#0345A4]" />
              <span>{pick('Inter-Warehouse Stock Transfer', 'আন্তঃ-গুদাম স্টক স্থানান্তর')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <select
                value={transferItemId}
                onChange={(e) => setTransferItemId(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              >
                {stocks.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sku} — {s.itemName}
                  </option>
                ))}
              </select>
              <select
                value={fromWh}
                onChange={(e) => setFromWh(e.target.value as 'dhakaQty' | 'chattogramQty' | 'sylhetQty')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              >
                <option value="dhakaQty">{pick('From: Dhaka Warehouse', 'হতে: ঢাকা গুদাম')}</option>
                <option value="chattogramQty">{pick('From: Chattogram Central', 'হতে: চট্টগ্রাম সেন্ট্রাল')}</option>
                <option value="sylhetQty">{pick('From: Sylhet Depot', 'হতে: সিলেট ডিপো')}</option>
              </select>
              <select
                value={toWh}
                onChange={(e) => setToWh(e.target.value as 'dhakaQty' | 'chattogramQty' | 'sylhetQty')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              >
                <option value="chattogramQty">{pick('To: Chattogram Central', 'প্রতি: চট্টগ্রাম সেন্ট্রাল')}</option>
                <option value="dhakaQty">{pick('To: Dhaka Warehouse', 'প্রতি: ঢাকা গুদাম')}</option>
                <option value="sylhetQty">{pick('To: Sylhet Depot', 'প্রতি: সিলেট ডিপো')}</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={transferQty}
                  onChange={(e) => setTransferQty(e.target.value)}
                  className="w-20 px-2.5 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
                />
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
                >
                  {pick('Transfer', 'স্থানান্তর')}
                </button>
              </div>
            </div>
          </form>

          <InteractiveDataTable
            title={pick('Multi-Warehouse Stock & Valuation Ledger', 'বহু-গুদাম স্টক ও মূল্যায়ন লেজার')}
            rows={stocks}
            columns={[
              { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.sku}</span> },
              { key: 'name', header: pick('Item', 'পণ্য'), render: (r) => <span className="font-semibold">{r.itemName}</span> },
              { key: 'dhk', header: pick('Dhaka', 'ঢাকা'), align: 'right', render: (r) => r.dhakaQty },
              { key: 'ctg', header: pick('Chattogram', 'চট্টগ্রাম'), align: 'right', render: (r) => r.chattogramQty },
              { key: 'syl', header: pick('Sylhet', 'সিলেট'), align: 'right', render: (r) => r.sylhetQty },
              { key: 'val', header: pick('Total Value', 'মোট মূল্য'), align: 'right', render: (r) => formatBDT((r.dhakaQty + r.chattogramQty + r.sylhetQty) * r.unitCost) },
            ]}
            getSearchText={(r) => `${r.sku} ${r.itemName}`}
          />
        </div>
      )}

      {(activeModule === 'hr' || activeModule === 'payroll') && (
        <div className="space-y-5">
          <DashboardCards
            columns={3}
            metrics={[
              { id: 'hr-1', label: pick('Staff in Scope', 'নির্বাচিত কর্মীসংখ্যা'), value: String(selectedBranch === 'all' ? employees.length : employees.filter((e) => e.branchId === selectedBranch).length) },
              { id: 'hr-2', label: pick('Gross Payroll', 'মোট বেতন বিল'), value: formatBDT(activeData.payrollCost), tone: 'primary' },
              {
                id: 'hr-3',
                label: pick('Net Disbursement', 'নিট বেতন প্রদান'),
                value: formatBDT(
                  (selectedBranch === 'all' ? employees : employees.filter((e) => e.branchId === selectedBranch)).reduce(
                    (s, e) => s + e.basicSalary + e.allowances - e.deductions,
                    0
                  )
                ),
                tone: 'positive',
              },
            ]}
          />
          <InteractiveDataTable
            title={pick('Departmental HR & Sample Payroll Sheet', 'বিভাগীয় HR এবং নমুনা বেতন শীট')}
            rows={selectedBranch === 'all' ? employees : employees.filter((e) => e.branchId === selectedBranch)}
            columns={[
              { key: 'id', header: pick('Emp ID', 'কর্মী আইডি'), render: (r) => <span className="font-mono font-bold">{r.empId}</span> },
              { key: 'name', header: pick('Employee', 'কর্মচারী'), render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: 'dept', header: pick('Department', 'বিভাগ'), render: (r) => r.department },
              { key: 'basic', header: pick('Basic + Allow.', 'মূল + ভাতা'), align: 'right', render: (r) => formatBDT(r.basicSalary + r.allowances) },
              { key: 'ded', header: pick('Deductions', 'কর্তন'), align: 'right', render: (r) => formatBDT(r.deductions) },
              { key: 'net', header: pick('Net Salary', 'নিট বেতন'), align: 'right', render: (r) => <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatBDT(r.basicSalary + r.allowances - r.deductions)}</span> },
            ]}
            getSearchText={(r) => `${r.empId} ${r.name} ${r.department}`}
          />
        </div>
      )}

      {(activeModule === 'accounting' || activeModule === 'branches' || activeModule === 'reports') && (
        <div className="space-y-5">
          <form
            onSubmit={handleRecordExpense}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {pick('Record Branch Operating Expense (Simulated)', 'শাখার পরিচালন ব্যয় যোগ করুন (নমুনা)')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={expBranch}
                onChange={(e) => setExpBranch(e.target.value as Exclude<BranchId, 'all'>)}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              >
                <option value="br-dhk">{branchNames['br-dhk']}</option>
                <option value="br-ctg">{branchNames['br-ctg']}</option>
                <option value="br-syl">{branchNames['br-syl']}</option>
              </select>
              <input
                type="text"
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                placeholder={pick('Expense Head', 'ব্যয়ের খাত')}
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder={pick('Amount', 'পরিমাণ')}
                  className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer shrink-0"
                >
                  {pick('Post', 'পোস্ট')}
                </button>
              </div>
            </div>
          </form>

          <InteractiveDataTable
            title={pick('Branch-Wise Consolidated Profitability Summary (Simulated)', 'শাখাভিত্তিক সমন্বিত লাভজনকতা সারসংক্ষেপ (নমুনা)')}
            rows={[
              { id: 'br-dhk', branch: branchNames['br-dhk'], ...branchSummary.dhaka },
              { id: 'br-ctg', branch: branchNames['br-ctg'], ...branchSummary.chattogram },
              { id: 'br-syl', branch: branchNames['br-syl'], ...branchSummary.sylhet },
            ]}
            columns={[
              { key: 'br', header: pick('Branch', 'শাখা'), render: (r) => <span className="font-bold">{r.branch}</span> },
              { key: 'rev', header: pick('Revenue', 'রাজস্ব'), align: 'right', render: (r) => formatBDT(r.revenue) },
              { key: 'exp', header: pick('Op. & Payroll Exp', 'পরিচালন ও পে-রোল ব্যয়'), align: 'right', render: (r) => formatBDT(r.opExpenses) },
              { key: 'inv', header: pick('Inventory Value', 'ইনভেন্টরি মূল্য'), align: 'right', render: (r) => formatBDT(r.invValue) },
              {
                key: 'np',
                header: pick('Net Profit', 'নিট মুনাফা'),
                align: 'right',
                render: (r) => (
                  <span className={r.netProfit >= 0 ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-rose-600'}>
                    {formatBDT(r.netProfit)}
                  </span>
                ),
              },
            ]}
            getSearchText={(r) => r.branch}
          />
        </div>
      )}

      {(activeModule === 'customers' || activeModule === 'suppliers') && (
        <InteractiveDataTable
          title={activeModule === 'customers' ? pick('Enterprise Customer Accounts', 'এন্টারপ্রাইজ গ্রাহক অ্যাকাউন্ট') : pick('Approved Enterprise Suppliers', 'অনুমোদিত এন্টারপ্রাইজ সরবরাহকারী')}
          rows={filteredOrders.filter((o) =>
            o.kind === (activeModule === 'customers' ? 'Sales Order' : 'Purchase Order')
          )}
          columns={[
            { key: 'party', header: pick('Organization', 'প্রতিষ্ঠান'), render: (r) => <span className="font-bold">{r.party}</span> },
            { key: 'br', header: pick('Servicing Branch', 'সেবাদানকারী শাখা'), render: (r) => branchNames[r.branchId] },
            { key: 'order', header: pick('Latest Ref', 'সর্বশেষ রেফারেন্স'), render: (r) => <span className="font-mono">{r.orderNo}</span> },
            { key: 'amt', header: pick('Order Volume', 'অর্ডার পরিমাণ'), align: 'right', render: (r) => formatBDT(r.amount) },
          ]}
          getSearchText={(r) => `${r.party} ${r.orderNo}`}
          onView={(r) => setDetailOrder(r)}
        />
      )}

      <DetailModal
        isOpen={Boolean(detailOrder)}
        title={detailOrder ? `${detailOrder.orderNo} — ${detailOrder.party}` : ''}
        subtitle={detailOrder ? `${orderKindLabel(detailOrder.kind)} (${branchNames[detailOrder.branchId]})` : ''}
        rows={
          detailOrder
            ? [
                { label: pick('Order Date', 'অর্ডারের তারিখ'), value: detailOrder.date, mono: true },
                { label: pick('Branch', 'শাখা'), value: branchNames[detailOrder.branchId] },
                { label: pick('Party', 'পার্টি'), value: detailOrder.party },
                { label: pick('Status', 'অবস্থা'), value: statusLabel(detailOrder.status) },
                { label: pick('Order Total', 'মোট অর্ডার'), value: formatBDT(detailOrder.amount), mono: true },
              ]
            : []
        }
        onClose={() => setDetailOrder(null)}
        onPrint={handlePrint}
      />
    </DemoWorkspace>
  );
};

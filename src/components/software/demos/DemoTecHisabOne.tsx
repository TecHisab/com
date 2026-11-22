import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  ShoppingCart,
  Boxes,
  ScanBarcode,
  Users,
  Truck,
  Wallet,
  FileBarChart,
  GitBranch,
  BarChart3,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { DemoWorkspace, DemoModuleTab } from '../workspace/DemoWorkspace';
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

interface OneProps {
  onRequestOnboarding?: () => void;
}

interface OneInventoryItem {
  id: string;
  sku: string;
  name: string;
  cost: number;
  price: number;
  stock: number;
}

interface OneLedgerVoucher {
  id: string;
  date: string;
  ref: string;
  source: 'Sales' | 'POS' | 'Purchase' | 'Payroll';
  debitAccount: string;
  creditAccount: string;
  amount: number;
}

interface OneOrder {
  id: string;
  date: string;
  ref: string;
  channel: 'Sales' | 'POS' | 'Purchase';
  party: string;
  itemName: string;
  qty: number;
  total: number;
  isCredit: boolean;
}

const INITIAL_ONE_STOCK: OneInventoryItem[] = [
  { id: 'one-s1', sku: 'ONE-101', name: 'Enterprise Cloud Terminal Kit', cost: 11000, price: 16500, stock: 22 },
  { id: 'one-s2', sku: 'ONE-102', name: 'Biometric Staff Attendance Unit', cost: 6400, price: 9800, stock: 16 },
  { id: 'one-s3', sku: 'ONE-103', name: 'Thermal Receipt Paper Box', cost: 1600, price: 2450, stock: 45 },
];

const INITIAL_ONE_ORDERS: OneOrder[] = [
  { id: 'oo-1', date: '2026-04-02', ref: 'SO-9001', channel: 'Sales', party: 'Padma Trade Corporation', itemName: 'Enterprise Cloud Terminal Kit', qty: 4, total: 66000, isCredit: true },
  { id: 'oo-2', date: '2026-04-04', ref: 'POS-511', channel: 'POS', party: 'Walk-in Counter Client', itemName: 'Biometric Staff Attendance Unit', qty: 2, total: 19600, isCredit: false },
  { id: 'oo-3', date: '2026-04-06', ref: 'PO-2201', channel: 'Purchase', party: 'Bay Tech Wholesale', itemName: 'Thermal Receipt Paper Box', qty: 20, total: 32000, isCredit: true },
];

const INITIAL_ONE_LEDGER: OneLedgerVoucher[] = [
  { id: 'ol-1', date: '2026-04-02', ref: 'SO-9001', source: 'Sales', debitAccount: 'Accounts Receivable', creditAccount: 'Sales Revenue', amount: 66000 },
  { id: 'ol-2', date: '2026-04-04', ref: 'POS-511', source: 'POS', debitAccount: 'Cash & Bank', creditAccount: 'Sales Revenue', amount: 19600 },
  { id: 'ol-3', date: '2026-04-06', ref: 'PO-2201', source: 'Purchase', debitAccount: 'Inventory Asset', creditAccount: 'Accounts Payable', amount: 32000 },
  { id: 'ol-4', date: '2026-04-08', ref: 'PAY-04', source: 'Payroll', debitAccount: 'Payroll Expense', creditAccount: 'Cash & Bank', amount: 38000 },
];

export const DemoTecHisabOne: React.FC<OneProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [inventory, setInventory] = useState<OneInventoryItem[]>(INITIAL_ONE_STOCK);
  const [orders, setOrders] = useState<OneOrder[]>(INITIAL_ONE_ORDERS);
  const [ledger, setLedger] = useState<OneLedgerVoucher[]>(INITIAL_ONE_LEDGER);
  const [banner, setBanner] = useState<string | null>(null);

  const oneModules: DemoModuleTab[] = [
    { id: 'dashboard', label: pick('Executive Dashboard', 'এক্সিকিউটিভ ড্যাশবোর্ড'), icon: LayoutDashboard },
    { id: 'accounting', label: pick('Accounting', 'হিসাবরক্ষণ'), icon: BookOpen },
    { id: 'sales', label: pick('Sales', 'বিক্রয়'), icon: TrendingUp },
    { id: 'purchase', label: pick('Purchase', 'ক্রয়'), icon: ShoppingCart },
    { id: 'inventory', label: pick('Inventory', 'ইনভেন্টরি'), icon: Boxes },
    { id: 'pos', label: pick('POS', 'পিওএস'), icon: ScanBarcode },
    { id: 'customers', label: pick('Customer Management', 'গ্রাহক ব্যবস্থাপনা'), icon: Users },
    { id: 'suppliers', label: pick('Supplier Management', 'সরবরাহকারী ব্যবস্থাপনা'), icon: Truck },
    { id: 'hr-payroll', label: pick('HR & Payroll', 'এইচআর ও বেতন'), icon: Wallet },
    { id: 'mis', label: pick('MIS Reporting', 'এমআইএস রিপোর্টিং'), icon: FileBarChart },
    { id: 'branches', label: pick('Branch Management', 'শাখা ব্যবস্থাপনা'), icon: GitBranch },
    { id: 'analytics', label: pick('Business Analytics', 'ব্যবসায়িক বিশ্লেষণ'), icon: BarChart3 },
  ];

  const channelLabel = (ch: 'Sales' | 'POS' | 'Purchase' | 'Payroll') => {
    if (ch === 'Sales') return pick('Sales', 'বিক্রয়');
    if (ch === 'POS') return pick('POS', 'পিওএস');
    if (ch === 'Purchase') return pick('Purchase', 'ক্রয়');
    return pick('Payroll', 'বেতন');
  };

  // Unified Sale / POS / Purchase Form Controls
  const [selectedItemId, setSelectedItemId] = useState('one-s1');
  const [partyInput, setPartyInput] = useState('Meghna Logistics Group');
  const [qtyInput, setQtyInput] = useState('2');
  const [creditToggle, setCreditToggle] = useState(false);

  const handleResetDemo = () => {
    setInventory(INITIAL_ONE_STOCK);
    setOrders(INITIAL_ONE_ORDERS);
    setLedger(INITIAL_ONE_LEDGER);
    setBanner(
      pick(
        'TecHisab One interconnected sandbox state restored.',
        'TecHisab One আন্তঃসংযুক্ত স্যান্ডবক্স অবস্থা পুনরুদ্ধার করা হয়েছে।'
      )
    );
  };

  // Single Unified Interconnected Calculation Engine
  const unified = useMemo(() => {
    const salesOrders = orders.filter((o) => o.channel === 'Sales' || o.channel === 'POS');
    const purchaseOrders = orders.filter((o) => o.channel === 'Purchase');

    const revenue = salesOrders.reduce((s, o) => s + o.total, 0);
    const cogs = salesOrders.reduce((s, o) => {
      const prod = inventory.find((p) => p.name === o.itemName);
      return s + (prod ? prod.cost * o.qty : Math.round(o.total * 0.65));
    }, 0);
    const payrollExpenses = ledger
      .filter((l) => l.source === 'Payroll')
      .reduce((s, l) => s + l.amount, 0);
    const expenses = cogs + payrollExpenses;
    const netProfit = revenue - expenses;

    const receivables = salesOrders
      .filter((o) => o.isCredit)
      .reduce((s, o) => s + o.total, 0);
    const payables = purchaseOrders
      .filter((o) => o.isCredit)
      .reduce((s, o) => s + o.total, 0);
    const cashReceipts = salesOrders
      .filter((o) => !o.isCredit)
      .reduce((s, o) => s + o.total, 0);
    const cashPosition = 220000 + cashReceipts - payrollExpenses;
    const inventoryValue = inventory.reduce((s, i) => s + i.cost * i.stock, 0);

    return {
      revenue,
      expenses,
      netProfit,
      cashPosition,
      receivables,
      payables,
      inventoryValue,
      growthPct: revenue > 0 ? Math.round(((revenue - 60000) / 60000) * 100) : 0,
    };
  }, [orders, inventory, ledger]);

  const executeInterconnectedTransaction = (
    channel: 'Sales' | 'POS' | 'Purchase',
    e?: React.FormEvent
  ) => {
    if (e) e.preventDefault();
    const qty = Math.max(1, Math.round(parseSafeNumber(qtyInput)));
    const prod = inventory.find((p) => p.id === selectedItemId);
    if (!prod) return;

    if ((channel === 'Sales' || channel === 'POS') && prod.stock < qty) {
      setBanner(
        pick(
          `Insufficient stock for ${prod.name} (Available: ${prod.stock}).`,
          `${prod.name}-এর জন্য পর্যাপ্ত স্টক নেই (উপলব্ধ: ${prod.stock})।`
        )
      );
      return;
    }

    const total = (channel === 'Purchase' ? prod.cost : prod.price) * qty;
    const ref = generateDemoId(channel === 'POS' ? 'POS' : channel === 'Sales' ? 'SO' : 'PO');
    const isCredit = channel === 'POS' ? false : creditToggle;
    const party =
      channel === 'POS'
        ? 'Counter POS Walk-in'
        : partyInput.trim() || (channel === 'Sales' ? 'Standard Client' : 'Trade Vendor');

    // 1. Update Sales/Purchase Orders
    const newOrder: OneOrder = {
      id: generateDemoId('oo'),
      date: getTodayISO(),
      ref,
      channel,
      party,
      itemName: prod.name,
      qty,
      total,
      isCredit,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Cascade directly to Inventory Stock
    setInventory((prev) =>
      prev.map((item) =>
        item.id === prod.id
          ? {
              ...item,
              stock: channel === 'Purchase' ? item.stock + qty : item.stock - qty,
            }
          : item
      )
    );

    // 3. Cascade directly to Double-Entry Accounting Ledger
    const newVoucher: OneLedgerVoucher = {
      id: generateDemoId('ol'),
      date: getTodayISO(),
      ref,
      source: channel,
      debitAccount:
        channel === 'Purchase'
          ? 'Inventory Asset'
          : isCredit
          ? 'Accounts Receivable'
          : 'Cash & Bank',
      creditAccount:
        channel === 'Purchase'
          ? isCredit
            ? 'Accounts Payable'
            : 'Cash & Bank'
          : 'Sales Revenue',
      amount: total,
    };
    setLedger((prev) => [newVoucher, ...prev]);

    setBanner(
      pick(
        `${channel} ${ref} (${formatBDT(total)}) cascaded across Inventory (${
          channel === 'Purchase' ? '+' : '-'
        }${qty} units), Accounting Ledger, and Dashboard Profit!`,
        `${channelLabel(channel)} ${ref} (${formatBDT(total)}) স্বয়ংক্রিয়ভাবে ইনভেন্টরি (${
          channel === 'Purchase' ? '+' : '-'
        }${qty} ইউনিট), হিসাবরক্ষণ লেজার ও ড্যাশবোর্ড মুনাফায় আপডেট হয়েছে!`
      )
    );
  };

  const handlePrint = () => {
    triggerPrintableReport(
      pick(
        'TecHisab One — Consolidated Interconnected MIS Pack',
        'TecHisab One — সমন্বিত আন্তঃসংযুক্ত এমআইএস প্যাক'
      ),
      `<table style="width:100%; border-collapse: collapse; font-size:13px;">
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Total Sales & POS Revenue', 'মোট বিক্রয় ও পিওএস আয়')}</td><td style="padding:8px; text-align:right; font-weight:700;">${formatBDT(unified.revenue)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('COGS & Payroll Expenses', 'পণ্য ব্যয় ও বেতন খরচ')}</td><td style="padding:8px; text-align:right;">${formatBDT(unified.expenses)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Net Profit', 'নিট মুনাফা')}</td><td style="padding:8px; text-align:right; font-weight:800; color:#0345A4;">${formatBDT(unified.netProfit)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Cash Position', 'নগদ অবস্থান')}</td><td style="padding:8px; text-align:right;">${formatBDT(unified.cashPosition)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Inventory Valuation', 'ইনভেন্টরি মূল্যায়ন')}</td><td style="padding:8px; text-align:right;">${formatBDT(unified.inventoryValue)}</td></tr>
      </table>`
    );
  };

  return (
    <DemoWorkspace
      productName="TecHisab One"
      productSubtitle={pick(
        'Unified Business Platform — Connected Sales, POS, Inventory, Accounting & MIS Sandbox',
        'একীভূত ব্যবসায়িক প্ল্যাটফর্ম — সংযুক্ত বিক্রয়, পিওএস, ইনভেন্টরি, হিসাবরক্ষণ ও এমআইএস স্যান্ডবক্স'
      )}
      modules={oneModules}
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      onResetDemo={handleResetDemo}
      onPrintReport={handlePrint}
      onRequestOnboarding={onRequestOnboarding}
      bannerMessage={banner}
      onClearBanner={() => setBanner(null)}
    >
      <div className="px-3.5 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-[#D7E2F3] dark:border-sky-900 text-xs text-[#02377F] dark:text-sky-200 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#0345A4] dark:text-sky-400" />
        <span>
          <strong>{pick('Unified Simulation Note:', 'একীভূত সিমুলেশন নোট:')}</strong>{' '}
          {pick(
            'Posting a Sale or POS checkout below cascades automatically across Sales, Inventory Stock, Accounting Ledger, Customer Balances, and MIS Reports inside this local sandbox. Integration demonstrated here is simulated and does not establish that all modules are connected in a live production environment.',
            'নিচে বিক্রয় বা পিওএস চেকআউট পোস্ট করলে তা স্বয়ংক্রিয়ভাবে এই স্থানীয় স্যান্ডবক্সের বিক্রয়, ইনভেন্টরি স্টক, হিসাবরক্ষণ লেজার, গ্রাহক ব্যালেন্স এবং এমআইএস রিপোর্টে আপডেট হয়। এখানে প্রদর্শিত ইন্টিগ্রেশনটি সিমুলেটেড এবং লাইভ প্রোডাকশন পরিবেশের সংযোগ বোঝায় না।'
          )}
        </span>
      </div>

      {/* Persistent Quick Interconnected Trigger */}
      <form
        onSubmit={(e) => executeInterconnectedTransaction('Sales', e)}
        className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[#0B1730] dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0345A4]" />
            <span>
              {pick(
                'Trigger Unified Cross-Module Transaction (Watch All Modules Update)',
                'একীভূত ক্রস-মডিউল লেনদেন চালান (সব মডিউল একসাথে আপডেট দেখুন)'
              )}
            </span>
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center">
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="sm:col-span-2 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
          >
            {inventory.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} — {formatBDT(i.price)} ({i.stock} {pick('in stock', 'স্টকে')})
              </option>
            ))}
          </select>
          <input
            type="text"
            value={partyInput}
            onChange={(e) => setPartyInput(e.target.value)}
            placeholder={pick('Party Name', 'পার্টির নাম')}
            className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
          />
          <input
            type="number"
            min="1"
            value={qtyInput}
            onChange={(e) => setQtyInput(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
          />
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={creditToggle}
              onChange={(e) => setCreditToggle(e.target.checked)}
              className="rounded border-[#D7E2F3]"
            />
            <span>{pick('Credit Terms', 'বাকির শর্ত')}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
          >
            {pick('+ Record Unified Sale', '+ একীভূত বিক্রয় যুক্ত করুন')}
          </button>
          <button
            type="button"
            onClick={() => executeInterconnectedTransaction('POS')}
            className="px-3.5 py-2 rounded-lg bg-[#0A63D8] hover:bg-[#0345A4] text-white text-xs font-bold cursor-pointer"
          >
            {pick('+ Complete POS Cash Order', '+ পিওএস নগদ অর্ডার সম্পন্ন করুন')}
          </button>
          <button
            type="button"
            onClick={() => executeInterconnectedTransaction('Purchase')}
            className="px-3.5 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[#0345A4] dark:text-sky-400 text-xs font-bold cursor-pointer"
          >
            {pick('+ Restock Purchase', '+ স্টক ক্রয় যুক্ত করুন')}
          </button>
        </div>
      </form>

      {(activeModule === 'dashboard' || activeModule === 'analytics' || activeModule === 'mis') && (
        <div className="space-y-5">
          <DashboardCards
            columns={4}
            metrics={[
              { id: 'one-1', label: pick('Revenue', 'আয়'), value: formatBDT(unified.revenue), tone: 'primary' },
              { id: 'one-2', label: pick('Expenses', 'খরচ'), value: formatBDT(unified.expenses), tone: 'warning' },
              { id: 'one-3', label: pick('Net Profit', 'নিট মুনাফা'), value: formatBDT(unified.netProfit), tone: unified.netProfit >= 0 ? 'positive' : 'danger' },
              { id: 'one-4', label: pick('Cash Position', 'নগদ অবস্থান'), value: formatBDT(unified.cashPosition) },
              { id: 'one-5', label: pick('Receivables', 'পাওনা'), value: formatBDT(unified.receivables) },
              { id: 'one-6', label: pick('Payables', 'দেনা'), value: formatBDT(unified.payables) },
              { id: 'one-7', label: pick('Inventory Value', 'ইনভেন্টরি মূল্য'), value: formatBDT(unified.inventoryValue) },
              { id: 'one-8', label: pick('Business Growth', 'ব্যবসায়িক প্রবৃদ্ধি'), value: `+${unified.growthPct}%`, subtext: pick('Vs baseline sample', 'মূল নমুনার তুলনায়'), tone: 'positive' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FinancialBarChart
              title={pick('Unified Financial & Working Capital Analytics', 'একীভূত আর্থিক ও চলতি মূলধন বিশ্লেষণ')}
              data={[
                { label: pick('Revenue', 'আয়'), value: unified.revenue },
                { label: pick('Expenses', 'খরচ'), value: unified.expenses },
                { label: pick('Net Profit', 'নিট মুনাফা'), value: Math.max(0, unified.netProfit) },
                { label: pick('Cash', 'নগদ'), value: Math.max(0, unified.cashPosition) },
                { label: pick('Inventory', 'ইনভেন্টরি'), value: unified.inventoryValue },
              ]}
              primaryLabel={pick('Simulated BDT', 'সিমুলেটেড টাকা')}
            />
            <CategoryBreakdownChart
              title={pick('Sales Revenue by Product SKU', 'পণ্য এসকেইউ অনুযায়ী বিক্রয় আয়')}
              items={inventory.map((i) => ({
                label: i.name,
                value: orders
                  .filter((o) => o.itemName === i.name && o.channel !== 'Purchase')
                  .reduce((s, o) => s + o.total, 0),
              }))}
            />
          </div>
        </div>
      )}

      {activeModule === 'accounting' && (
        <InteractiveDataTable
          title={pick('Auto-Posted Double-Entry Ledger Vouchers', 'স্বয়ংক্রিয় ডাবল-এন্ট্রি লেজার ভাউচার')}
          rows={ledger}
          columns={[
            { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
            { key: 'ref', header: pick('Ref #', 'রেফ #'), render: (r) => <span className="font-mono font-bold text-[#0345A4]">{r.ref}</span> },
            { key: 'src', header: pick('Origin Module', 'উৎস মডিউল'), render: (r) => channelLabel(r.source) },
            { key: 'dr', header: pick('Debit Account', 'ডেবিট হিসাব'), render: (r) => r.debitAccount },
            { key: 'cr', header: pick('Credit Account', 'ক্রেডিট হিসাব'), render: (r) => r.creditAccount },
            { key: 'amt', header: pick('Amount', 'পরিমাণ'), align: 'right', render: (r) => formatBDT(r.amount) },
          ]}
          getSearchText={(r) => `${r.ref} ${r.debitAccount} ${r.creditAccount} ${r.source}`}
        />
      )}

      {(activeModule === 'sales' || activeModule === 'purchase' || activeModule === 'pos') && (
        <InteractiveDataTable
          title={
            activeModule === 'sales'
              ? pick('Sales Synchronized Orders', 'বিক্রয় সমন্বিত অর্ডার')
              : activeModule === 'pos'
              ? pick('POS Synchronized Orders', 'পিওএস সমন্বিত অর্ডার')
              : pick('Purchase Synchronized Orders', 'ক্রয় সমন্বিত অর্ডার')
          }
          rows={orders.filter((o) =>
            activeModule === 'sales'
              ? o.channel === 'Sales'
              : activeModule === 'pos'
              ? o.channel === 'POS'
              : o.channel === 'Purchase'
          )}
          columns={[
            { key: 'ref', header: pick('Ref #', 'রেফ #'), render: (r) => <span className="font-mono font-bold text-[#0345A4]">{r.ref}</span> },
            { key: 'party', header: pick('Party', 'পার্টি'), render: (r) => r.party },
            { key: 'item', header: pick('Item (Qty)', 'পণ্য (পরিমাণ)'), render: (r) => `${r.itemName} (×${r.qty})` },
            { key: 'term', header: pick('Settlement', 'নিষ্পত্তি'), render: (r) => (r.isCredit ? pick('Credit', 'বাকি') : pick('Cash/Bank', 'নগদ/ব্যাংক')) },
            { key: 'tot', header: pick('Total', 'মোট'), align: 'right', render: (r) => formatBDT(r.total) },
          ]}
          getSearchText={(r) => `${r.ref} ${r.party} ${r.itemName}`}
        />
      )}

      {activeModule === 'inventory' && (
        <InteractiveDataTable
          title={pick('Live Synchronized Inventory Balances', 'লাইভ সমন্বিত ইনভেন্টরি ব্যালেন্স')}
          rows={inventory}
          columns={[
            { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono font-bold">{r.sku}</span> },
            { key: 'name', header: pick('Product', 'পণ্য'), render: (r) => <span className="font-semibold">{r.name}</span> },
            { key: 'cost', header: pick('Unit Cost', 'একক ব্যয়'), align: 'right', render: (r) => formatBDT(r.cost) },
            { key: 'price', header: pick('Unit Price', 'একক মূল্য'), align: 'right', render: (r) => formatBDT(r.price) },
            { key: 'qty', header: pick('Remaining Stock', 'অবশিষ্ট স্টক'), align: 'right', render: (r) => <span className="font-bold">{r.stock} {pick('units', 'ইউনিট')}</span> },
            { key: 'val', header: pick('Stock Value', 'স্টক মূল্য'), align: 'right', render: (r) => formatBDT(r.cost * r.stock) },
          ]}
          getSearchText={(r) => `${r.sku} ${r.name}`}
        />
      )}

      {(activeModule === 'customers' || activeModule === 'suppliers' || activeModule === 'hr-payroll' || activeModule === 'branches') && (
        <InteractiveDataTable
          title={pick('Connected Party & Operational Directory', 'সংযুক্ত পার্টি ও অপারেশনাল ডিরেক্টরি')}
          rows={orders}
          columns={[
            { key: 'party', header: pick('Party / Account', 'পার্টি / হিসাব'), render: (r) => <span className="font-bold">{r.party}</span> },
            { key: 'ch', header: pick('Module Channel', 'মডিউল চ্যানেল'), render: (r) => channelLabel(r.channel) },
            { key: 'ref', header: pick('Latest Doc', 'সর্বশেষ ডক'), render: (r) => <span className="font-mono">{r.ref}</span> },
            { key: 'tot', header: pick('Volume', 'পরিমাণ'), align: 'right', render: (r) => formatBDT(r.total) },
          ]}
          getSearchText={(r) => `${r.party} ${r.ref}`}
        />
      )}
    </DemoWorkspace>
  );
};

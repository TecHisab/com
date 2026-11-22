import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Users,
  Truck,
  Package,
  Boxes,
  Receipt,
  Landmark,
  FileBarChart,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DemoWorkspace, DemoModuleTab, DemoNotification } from '../workspace/DemoWorkspace';
import { DashboardCards, DashboardMetricCard } from '../workspace/DashboardCards';
import { InteractiveDataTable } from '../workspace/InteractiveDataTable';
import { FinancialBarChart, CategoryBreakdownChart } from '../workspace/FinancialChart';
import { DetailModal } from '../workspace/DetailModal';
import { useLanguage } from '../../../context/LanguageContext';
import {
  formatBDT,
  getTodayISO,
  generateDemoId,
  parseSafeNumber,
  triggerPrintableReport,
} from '../../../utils/demoFormatters';

interface BizProps {
  onRequestOnboarding?: () => void;
}

interface BizTransaction {
  id: string;
  date: string;
  type: 'sale' | 'purchase' | 'expense';
  ref: string;
  partyOrCategory: string;
  account: 'Cash' | 'Bank' | 'Credit';
  amount: number;
  costOfGoods?: number;
  notes: string;
}

interface PartyRecord {
  id: string;
  name: string;
  phone: string;
  city: string;
  openingDue: number;
}

interface ProductItem {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  costPrice: number;
  stockQty: number;
}

const INITIAL_TXNS: BizTransaction[] = [
  { id: 'tx-1', date: '2026-04-02', type: 'sale', ref: 'INV-1041', partyOrCategory: 'Karnafuli Traders', account: 'Bank', amount: 85000, costOfGoods: 56000, notes: 'Office IT supplies delivery' },
  { id: 'tx-2', date: '2026-04-04', type: 'sale', ref: 'INV-1042', partyOrCategory: 'Bengal Hardware Co.', account: 'Credit', amount: 42000, costOfGoods: 27500, notes: 'Credit term 15 days' },
  { id: 'tx-3', date: '2026-04-05', type: 'purchase', ref: 'PUR-401', partyOrCategory: 'Padma Wholesale Ltd.', account: 'Bank', amount: 48000, notes: 'Restock networking routers' },
  { id: 'tx-4', date: '2026-04-06', type: 'purchase', ref: 'PUR-402', partyOrCategory: 'Eastern Packaging', account: 'Credit', amount: 18500, notes: 'Packaging cartons credit bill' },
  { id: 'tx-5', date: '2026-04-07', type: 'expense', ref: 'EXP-209', partyOrCategory: 'Office Rent & Utilities', account: 'Bank', amount: 22000, notes: 'Monthly workspace rent' },
  { id: 'tx-6', date: '2026-04-09', type: 'sale', ref: 'INV-1043', partyOrCategory: 'Chattogram Mart', account: 'Cash', amount: 31500, costOfGoods: 20500, notes: 'Counter cash invoice' },
  { id: 'tx-7', date: '2026-04-11', type: 'expense', ref: 'EXP-210', partyOrCategory: 'Staff Conveyance & Fuel', account: 'Cash', amount: 6500, notes: 'Local delivery transport' },
];

const INITIAL_CUSTOMERS: PartyRecord[] = [
  { id: 'cust-1', name: 'Karnafuli Traders', phone: '+8801711-000111', city: 'Chattogram', openingDue: 15000 },
  { id: 'cust-2', name: 'Bengal Hardware Co.', phone: '+8801811-000222', city: 'Dhaka', openingDue: 8000 },
  { id: 'cust-3', name: 'Chattogram Mart', phone: '+8801911-000333', city: 'Chattogram', openingDue: 0 },
];

const INITIAL_SUPPLIERS: PartyRecord[] = [
  { id: 'sup-1', name: 'Padma Wholesale Ltd.', phone: '+8801611-000444', city: 'Dhaka', openingDue: 12000 },
  { id: 'sup-2', name: 'Eastern Packaging', phone: '+8801511-000555', city: 'Chattogram', openingDue: 4000 },
];

const INITIAL_PRODUCTS: ProductItem[] = [
  { id: 'prd-1', sku: 'TB-101', name: 'POS Thermal Printer 80mm', unitPrice: 8500, costPrice: 5600, stockQty: 18 },
  { id: 'prd-2', sku: 'TB-102', name: 'Wireless Barcode Scanner', unitPrice: 4200, costPrice: 2700, stockQty: 26 },
  { id: 'prd-3', sku: 'TB-103', name: 'Dual-Band Office Router', unitPrice: 3600, costPrice: 2400, stockQty: 9 },
  { id: 'prd-4', sku: 'TB-104', name: 'A4 Thermal Paper Carton', unitPrice: 2200, costPrice: 1450, stockQty: 4 },
];

export const DemoBusiness: React.FC<BizProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();

  const modules: DemoModuleTab[] = [
    { id: 'dashboard', label: pick('Dashboard', 'ড্যাশবোর্ড'), icon: LayoutDashboard },
    { id: 'sales', label: pick('Sales', 'বিক্রয়'), icon: TrendingUp },
    { id: 'purchases', label: pick('Purchases', 'ক্রয়'), icon: ShoppingCart },
    { id: 'customers', label: pick('Customers', 'ক্রেতা'), icon: Users },
    { id: 'suppliers', label: pick('Suppliers', 'সরবরাহকারী'), icon: Truck },
    { id: 'products', label: pick('Products', 'পণ্য'), icon: Package },
    { id: 'inventory', label: pick('Inventory', 'ইনভেন্টরি'), icon: Boxes },
    { id: 'expenses', label: pick('Expenses', 'খরচ'), icon: Receipt },
    { id: 'cash-bank', label: pick('Cash & Bank', 'নগদ ও ব্যাংক'), icon: Landmark },
    { id: 'reports', label: pick('Reports', 'প্রতিবেদন'), icon: FileBarChart },
  ];

  const [activeModule, setActiveModule] = useState('dashboard');
  const [txns, setTxns] = useState<BizTransaction[]>(INITIAL_TXNS);
  const [customers, setCustomers] = useState<PartyRecord[]>(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<PartyRecord[]>(INITIAL_SUPPLIERS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);

  const [openingCash] = useState(45000);
  const [openingBank] = useState(195000);
  const [banner, setBanner] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [detailTx, setDetailTx] = useState<BizTransaction | null>(null);

  // Edit transaction state
  const [editingTxId, setEditingTxId] = useState<string | null>(null);

  // Unified transaction form state
  const [txDate, setTxDate] = useState(getTodayISO());
  const [txParty, setTxParty] = useState('');
  const [txAccount, setTxAccount] = useState<'Cash' | 'Bank' | 'Credit'>('Cash');
  const [txAmount, setTxAmount] = useState('');
  const [txCogs, setTxCogs] = useState('');
  const [txNotes, setTxNotes] = useState('');

  // Party form state
  const [partyName, setPartyName] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyCity, setPartyCity] = useState('Chattogram');
  const [partyDue, setPartyDue] = useState('0');

  // Product form state
  const [prodSku, setProdSku] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCost, setProdCost] = useState('');
  const [prodQty, setProdQty] = useState('');

  const resetForm = () => {
    setEditingTxId(null);
    setTxDate(getTodayISO());
    setTxParty('');
    setTxAccount('Cash');
    setTxAmount('');
    setTxCogs('');
    setTxNotes('');
    setFormError(null);
  };

  const handleResetDemo = () => {
    setTxns(INITIAL_TXNS);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setProducts(INITIAL_PRODUCTS);
    resetForm();
    setBanner(
      pick(
        'TecHisab Business sample dataset restored to initial defaults.',
        'টেকহিসাব বিজনেস-এর নমুনা ডেটা প্রাথমিক অবস্থায় রিসেট করা হয়েছে।'
      )
    );
  };

  // Dynamic Real-Time Totals
  const summary = useMemo(() => {
    const salesTx = txns.filter((t) => t.type === 'sale');
    const purchaseTx = txns.filter((t) => t.type === 'purchase');
    const expenseTx = txns.filter((t) => t.type === 'expense');

    const totalSales = salesTx.reduce((s, t) => s + t.amount, 0);
    const totalPurchases = purchaseTx.reduce((s, t) => s + t.amount, 0);
    const totalExpenses = expenseTx.reduce((s, t) => s + t.amount, 0);
    const totalCogs = salesTx.reduce(
      (s, t) => s + (t.costOfGoods ?? Math.round(t.amount * 0.65)),
      0
    );

    const grossProfit = totalSales - totalCogs;
    const netProfit = grossProfit - totalExpenses;

    const cashDelta = txns
      .filter((t) => t.account === 'Cash')
      .reduce((s, t) => s + (t.type === 'sale' ? t.amount : -t.amount), 0);
    const bankDelta = txns
      .filter((t) => t.account === 'Bank')
      .reduce((s, t) => s + (t.type === 'sale' ? t.amount : -t.amount), 0);

    const cashBalance = openingCash + cashDelta;
    const bankBalance = openingBank + bankDelta;

    const creditSales = salesTx
      .filter((t) => t.account === 'Credit')
      .reduce((s, t) => s + t.amount, 0);
    const customerOpenings = customers.reduce((s, c) => s + c.openingDue, 0);
    const receivables = customerOpenings + creditSales;

    const creditPurchases = purchaseTx
      .filter((t) => t.account === 'Credit')
      .reduce((s, t) => s + t.amount, 0);
    const supplierOpenings = suppliers.reduce((s, sp) => s + sp.openingDue, 0);
    const payables = supplierOpenings + creditPurchases;

    const inventoryValue = products.reduce((s, p) => s + p.costPrice * p.stockQty, 0);

    return {
      totalSales,
      totalPurchases,
      totalExpenses,
      totalCogs,
      grossProfit,
      netProfit,
      cashBalance,
      bankBalance,
      receivables,
      payables,
      inventoryValue,
    };
  }, [txns, customers, suppliers, products, openingCash, openingBank]);

  const metrics: DashboardMetricCard[] = [
    { id: 'm-sales', label: pick('Total Sales', 'মোট বিক্রয়'), value: formatBDT(summary.totalSales), subtext: pick(`${txns.filter((t) => t.type === 'sale').length} invoices`, `${txns.filter((t) => t.type === 'sale').length}টি ইনভয়েস`), tone: 'primary', icon: TrendingUp },
    { id: 'm-pur', label: pick('Total Purchases', 'মোট ক্রয়'), value: formatBDT(summary.totalPurchases), subtext: pick(`${txns.filter((t) => t.type === 'purchase').length} bills`, `${txns.filter((t) => t.type === 'purchase').length}টি বিল`), icon: ShoppingCart },
    { id: 'm-exp', label: pick('Total Expenses', 'মোট ব্যয়'), value: formatBDT(summary.totalExpenses), subtext: pick('Operating overheads', 'পরিচালন খরচ'), tone: 'warning', icon: Receipt },
    { id: 'm-net', label: pick('Net Profit', 'নিট মুনাফা'), value: formatBDT(summary.netProfit), subtext: pick(`Gross Profit: ${formatBDT(summary.grossProfit)}`, `মোট মুনাফা: ${formatBDT(summary.grossProfit)}`), tone: summary.netProfit >= 0 ? 'positive' : 'danger', icon: FileBarChart },
    { id: 'm-cash', label: pick('Cash Balance', 'নগদ স্থিতি'), value: formatBDT(summary.cashBalance), subtext: pick('In-hand drawer', 'হাতে নগদ'), icon: Landmark },
    { id: 'm-bank', label: pick('Bank Balance', 'ব্যাংক স্থিতি'), value: formatBDT(summary.bankBalance), subtext: pick('Corporate bank A/C', 'কর্পোরেট ব্যাংক হিসাব'), tone: 'primary', icon: Landmark },
    { id: 'm-rec', label: pick('Receivables', 'পাওনা (প্রাপ্য)'), value: formatBDT(summary.receivables), subtext: pick('Customer dues', 'ক্রেতার বকেয়া'), icon: Users },
    { id: 'm-pay', label: pick('Payables', 'দেনা (প্রদেয়)'), value: formatBDT(summary.payables), subtext: pick('Supplier dues', 'সরবরাহকারীর বকেয়া'), icon: Truck },
  ];

  const txTypeLabel = (type: 'sale' | 'purchase' | 'expense') =>
    type === 'sale' ? pick('Sale', 'বিক্রয়') : type === 'purchase' ? pick('Purchase', 'ক্রয়') : pick('Expense', 'খরচ');

  const accountLabel = (acct: 'Cash' | 'Bank' | 'Credit') =>
    acct === 'Cash' ? pick('Cash', 'নগদ') : acct === 'Bank' ? pick('Bank', 'ব্যাংক') : pick('Credit', 'বাকি');

  const handleSaveTransaction = (type: 'sale' | 'purchase' | 'expense', e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseSafeNumber(txAmount);
    const cogsNum = type === 'sale' ? parseSafeNumber(txCogs) || Math.round(amountNum * 0.65) : undefined;

    if (!txParty.trim()) {
      setFormError(pick('Please enter a party name or expense category.', 'অনুগ্রহ করে পক্ষের নাম বা খরচের খাত লিখুন।'));
      return;
    }
    if (amountNum <= 0) {
      setFormError(pick('Transaction amount must be greater than zero.', 'লেনদেনের পরিমাণ শূন্যের চেয়ে বেশি হতে হবে।'));
      return;
    }

    if (editingTxId) {
      setTxns((prev) =>
        prev.map((item) =>
          item.id === editingTxId
            ? {
                ...item,
                date: txDate || getTodayISO(),
                partyOrCategory: txParty.trim(),
                account: txAccount,
                amount: amountNum,
                costOfGoods: cogsNum,
                notes: txNotes.trim() || pick('Updated demo entry', 'আপডেটকৃত ডেমো এন্ট্রি'),
              }
            : item
        )
      );
      setBanner(
        pick(
          `Updated demo ${type} transaction and recalculated all totals.`,
          `ডেমো ${txTypeLabel(type)} লেনদেন হালনাগাদ হয়েছে এবং সব হিসাব পুনর্গণনা করা হয়েছে।`
        )
      );
    } else {
      const prefix = type === 'sale' ? 'INV' : type === 'purchase' ? 'PUR' : 'EXP';
      const newEntry: BizTransaction = {
        id: generateDemoId('tx'),
        date: txDate || getTodayISO(),
        type,
        ref: generateDemoId(prefix),
        partyOrCategory: txParty.trim(),
        account: txAccount,
        amount: amountNum,
        costOfGoods: cogsNum,
        notes: txNotes.trim() || pick(`Sample ${type} entry`, `নমুনা ${txTypeLabel(type)} এন্ট্রি`),
      };
      setTxns((prev) => [newEntry, ...prev]);
      setBanner(
        pick(
          `Recorded sample ${type} (${formatBDT(amountNum)}) — KPIs updated.`,
          `নমুনা ${txTypeLabel(type)} (${formatBDT(amountNum)}) লিপিবদ্ধ হয়েছে — সূচক হালনাগাদ হয়েছে।`
        )
      );
    }
    resetForm();
  };

  const handleEditTx = (row: BizTransaction) => {
    setEditingTxId(row.id);
    setTxDate(row.date);
    setTxParty(row.partyOrCategory);
    setTxAccount(row.account);
    setTxAmount(String(row.amount));
    setTxCogs(row.costOfGoods ? String(row.costOfGoods) : '');
    setTxNotes(row.notes);
    setFormError(null);
  };

  const handleDeleteTx = (id: string) => {
    setTxns((prev) => prev.filter((t) => t.id !== id));
    setBanner(pick('Removed demo transaction — balances updated immediately.', 'ডেমো লেনদেন মুছে ফেলা হয়েছে — ব্যালেন্স তাৎক্ষণিকভাবে হালনাগাদ হয়েছে।'));
  };

  const handleAddParty = (kind: 'customer' | 'supplier', e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim()) {
      setFormError(pick('Party name is required.', 'পক্ষের নাম আবশ্যক।'));
      return;
    }
    const due = Math.max(0, parseSafeNumber(partyDue));
    const item: PartyRecord = {
      id: generateDemoId(kind === 'customer' ? 'cust' : 'sup'),
      name: partyName.trim(),
      phone: partyPhone.trim() || '+8801700-000000',
      city: partyCity.trim() || 'Chattogram',
      openingDue: due,
    };
    if (kind === 'customer') {
      setCustomers((prev) => [item, ...prev]);
      setBanner(pick(`Added sample customer "${item.name}".`, `নমুনা ক্রেতা "${item.name}" যোগ করা হয়েছে।`));
    } else {
      setSuppliers((prev) => [item, ...prev]);
      setBanner(pick(`Added sample supplier "${item.name}".`, `নমুনা সরবরাহকারী "${item.name}" যোগ করা হয়েছে।`));
    }
    setPartyName('');
    setPartyPhone('');
    setPartyDue('0');
    setFormError(null);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseSafeNumber(prodPrice);
    const cost = parseSafeNumber(prodCost);
    const qty = Math.max(0, Math.round(parseSafeNumber(prodQty)));
    if (!prodName.trim() || price <= 0) {
      setFormError(pick('Enter valid product name and unit selling price.', 'সঠিক পণ্যের নাম ও একক বিক্রয়মূল্য লিখুন।'));
      return;
    }
    const newProd: ProductItem = {
      id: generateDemoId('prd'),
      sku: prodSku.trim() || generateDemoId('TB'),
      name: prodName.trim(),
      unitPrice: price,
      costPrice: cost > 0 ? cost : Math.round(price * 0.65),
      stockQty: qty,
    };
    setProducts((prev) => [newProd, ...prev]);
    setBanner(pick(`Added product "${newProd.name}" to catalog & inventory.`, `ক্যাটালগ ও ইনভেন্টরিতে "${newProd.name}" যোগ করা হয়েছে।`));
    setProdSku('');
    setProdName('');
    setProdPrice('');
    setProdCost('');
    setProdQty('');
    setFormError(null);
  };

  const lowStockCount = products.filter((p) => p.stockQty <= 5).length;

  const notifications: DemoNotification[] = [
    ...(lowStockCount > 0
      ? [
          {
            id: 'n-low',
            title: pick(`${lowStockCount} low-stock SKU alert`, `${lowStockCount}টি পণ্যের স্টক কম সতর্কতা`),
            detail: pick('Review Inventory module for items at 5 units or fewer.', '৫ ইউনিট বা তার কম স্টক থাকা পণ্য দেখতে ইনভেন্টরি মডিউল দেখুন।'),
            type: 'warning' as const,
          },
        ]
      : []),
    {
      id: 'n-rec',
      title: pick('Outstanding Receivables', 'বকেয়া পাওনা'),
      detail: pick(`Sample customer balances stand at ${formatBDT(summary.receivables)}.`, `নমুনা ক্রেতাদের মোট বকেয়া ${formatBDT(summary.receivables)}।`),
      type: 'info',
    },
  ];

  const handlePrint = () => {
    triggerPrintableReport(
      pick('TecHisab Business — Sample Operational Summary', 'টেকহিসাব বিজনেস — নমুনা পরিচালন সারসংক্ষেপ'),
      `
      <table style="width:100%; border-collapse: collapse; font-size: 13px; margin-bottom: 18px;">
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Total Sales', 'মোট বিক্রয়')}</td><td style="padding:8px; border-bottom:1px solid #D7E2F3; text-align:right; font-weight:700;">${formatBDT(summary.totalSales)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Cost of Goods Sold (Estimated/Entered)', 'বিক্রিত পণ্যের ব্যয় (COGS)')}</td><td style="padding:8px; border-bottom:1px solid #D7E2F3; text-align:right;">${formatBDT(summary.totalCogs)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Gross Profit', 'মোট মুনাফা')}</td><td style="padding:8px; border-bottom:1px solid #D7E2F3; text-align:right; font-weight:700;">${formatBDT(summary.grossProfit)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Operating Expenses', 'পরিচালন ব্যয়')}</td><td style="padding:8px; border-bottom:1px solid #D7E2F3; text-align:right;">${formatBDT(summary.totalExpenses)}</td></tr>
        <tr><td style="padding:8px; border-bottom:2px solid #0345A4; font-weight:800;">${pick('Net Profit', 'নিট মুনাফা')}</td><td style="padding:8px; border-bottom:2px solid #0345A4; text-align:right; font-weight:800; color:#0345A4;">${formatBDT(summary.netProfit)}</td></tr>
      </table>
      <p style="font-size:12px;">${pick('Cash Balance', 'নগদ স্থিতি')}: <strong>${formatBDT(summary.cashBalance)}</strong> | ${pick('Bank Balance', 'ব্যাংক স্থিতি')}: <strong>${formatBDT(summary.bankBalance)}</strong></p>
      `
    );
  };

  const renderTransactionForm = (type: 'sale' | 'purchase' | 'expense', heading: string) => (
    <form
      onSubmit={(e) => handleSaveTransaction(type, e)}
      className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
          {editingTxId ? pick(`Edit Sample ${txTypeLabel(type)}`, `নমুনা ${txTypeLabel(type)} সম্পাদনা করুন`) : heading}
        </h4>
        {editingTxId && (
          <button
            type="button"
            onClick={resetForm}
            className="text-xs font-semibold text-[#5F6D82] hover:text-[#0B1730] cursor-pointer"
          >
            {pick('Cancel Edit', 'সম্পাদনা বাতিল')}
          </button>
        )}
      </div>

      {formError && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#5F6D82] mb-1">
            {pick('Date', 'তারিখ')}
          </label>
          <input
            type="date"
            value={txDate}
            onChange={(e) => setTxDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-semibold text-[#5F6D82] mb-1">
            {type === 'sale'
              ? pick('Customer Name', 'ক্রেতার নাম')
              : type === 'purchase'
              ? pick('Supplier Name', 'সরবরাহকারীর নাম')
              : pick('Expense Category', 'খরচের খাত')}
          </label>
          <input
            type="text"
            value={txParty}
            onChange={(e) => setTxParty(e.target.value)}
            placeholder={
              type === 'sale'
                ? pick('e.g., Karnafuli Traders', 'যেমন: কর্ণফুলী ট্রেডার্স')
                : type === 'purchase'
                ? pick('e.g., Padma Wholesale', 'যেমন: পদ্মা হোলসেল')
                : pick('e.g., Internet & Utilities', 'যেমন: ইন্টারনেট ও ইউটিলিটি')
            }
            className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#5F6D82] mb-1">
            {pick('Payment Mode', 'পরিশোধের মাধ্যম')}
          </label>
          <select
            value={txAccount}
            onChange={(e) => setTxAccount(e.target.value as 'Cash' | 'Bank' | 'Credit')}
            className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
          >
            <option value="Cash">{pick('Cash', 'নগদ')}</option>
            <option value="Bank">{pick('Bank', 'ব্যাংক')}</option>
            {type !== 'expense' && <option value="Credit">{pick('Credit (Due)', 'বাকি')}</option>}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#5F6D82] mb-1">
            {pick('Amount (BDT)', 'পরিমাণ (টাকা)')}
          </label>
          <input
            type="number"
            min="1"
            value={txAmount}
            onChange={(e) => setTxAmount(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        {type === 'sale' && (
          <div>
            <label className="block text-[11px] font-semibold text-[#5F6D82] mb-1">
              {pick('Cost of Goods (Optional)', 'পণ্যের ক্রয়মূল্য (ঐচ্ছিক)')}
            </label>
            <input
              type="number"
              min="0"
              value={txCogs}
              onChange={(e) => setTxCogs(e.target.value)}
              placeholder={pick('Auto 65% if blank', 'খালি রাখলে স্বয়ংক্রিয় ৬৫%')}
              className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
            />
          </div>
        )}
        <div className={type === 'sale' ? 'sm:col-span-1' : 'sm:col-span-2'}>
          <label className="block text-[11px] font-semibold text-[#5F6D82] mb-1">
            {pick('Notes', 'নোট')}
          </label>
          <input
            type="text"
            value={txNotes}
            onChange={(e) => setTxNotes(e.target.value)}
            placeholder={pick('Short reference note', 'সংক্ষিপ্ত রেফারেন্স নোট')}
            className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {editingTxId
                ? pick('Save Changes', 'পরিবর্তন সংরক্ষণ')
                : pick(`Record ${txTypeLabel(type)}`, `${txTypeLabel(type)} লিপিবদ্ধ করুন`)}
            </span>
          </button>
        </div>
      </div>
    </form>
  );

  const txColumns = [
    { key: 'date', header: pick('Date', 'তারিখ'), render: (r: BizTransaction) => <span className="font-mono text-[11px]">{r.date}</span> },
    { key: 'ref', header: pick('Ref #', 'রেফারেন্স'), render: (r: BizTransaction) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.ref}</span> },
    { key: 'party', header: pick('Party / Category', 'পক্ষ / খাত'), render: (r: BizTransaction) => <span className="font-semibold">{r.partyOrCategory}</span> },
    { key: 'account', header: pick('Mode', 'মাধ্যম'), render: (r: BizTransaction) => accountLabel(r.account) },
    {
      key: 'amount',
      header: pick('Amount', 'পরিমাণ'),
      align: 'right' as const,
      render: (r: BizTransaction) => (
        <span className={r.type === 'sale' ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold'}>
          {formatBDT(r.amount)}
        </span>
      ),
    },
  ];

  const performanceChartData = [
    { label: pick('Sales', 'বিক্রয়'), value: summary.totalSales, secondaryValue: summary.totalCogs },
    { label: pick('Purchases', 'ক্রয়'), value: summary.totalPurchases, secondaryValue: summary.payables },
    { label: pick('Expenses', 'খরচ'), value: summary.totalExpenses },
    { label: pick('Gross Profit', 'মোট মুনাফা'), value: Math.max(0, summary.grossProfit) },
    { label: pick('Net Profit', 'নিট মুনাফা'), value: Math.max(0, summary.netProfit) },
  ];

  return (
    <DemoWorkspace
      productName={pick('TecHisab Business', 'টেকহিসাব বিজনেস')}
      productSubtitle={pick(
        'Small Business Management, Daily Operations & Cash/Profit Tracking',
        'ছোট ব্যবসা ব্যবস্থাপনা, দৈনন্দিন কার্যক্রম ও নগদ/মুনাফা ট্র্যাকিং'
      )}
      modules={modules}
      activeModule={activeModule}
      onSelectModule={(m) => {
        setActiveModule(m);
        setFormError(null);
      }}
      onResetDemo={handleResetDemo}
      onPrintReport={handlePrint}
      onRequestOnboarding={onRequestOnboarding}
      notifications={notifications}
      bannerMessage={banner}
      onClearBanner={() => setBanner(null)}
    >
      {activeModule === 'dashboard' && (
        <div className="space-y-5">
          <DashboardCards metrics={metrics} columns={4} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FinancialBarChart
              title={pick('Business Financial Performance (Sample)', 'ব্যবসায়িক আর্থিক পারফরম্যান্স (নমুনা)')}
              subtitle={pick(
                'Totals update immediately when sales, purchases or expenses change',
                'বিক্রয়, ক্রয় বা খরচ পরিবর্তন করলে মোট হিসাব সাথে সাথেই হালনাগাদ হয়'
              )}
              data={performanceChartData}
              primaryLabel={pick('Amount (BDT)', 'পরিমাণ (টাকা)')}
              secondaryLabel={pick('Cost / Payable', 'ব্যয় / দেনা')}
            />
            <CategoryBreakdownChart
              title={pick('Liquidity & Working Capital Snapshot', 'তারল্য ও কার্যকরী মূলধনের চিত্র')}
              subtitle={pick(
                'Simulated cash, bank, inventory and receivables allocation',
                'সিমুলেটেড নগদ, ব্যাংক, ইনভেন্টরি ও পাওনার বিন্যাস'
              )}
              items={[
                { label: pick('Bank Balance', 'ব্যাংক স্থিতি'), value: Math.max(0, summary.bankBalance) },
                { label: pick('Cash in Hand', 'হাতে নগদ'), value: Math.max(0, summary.cashBalance) },
                { label: pick('Customer Receivables', 'ক্রেতার বকেয়া'), value: Math.max(0, summary.receivables) },
                { label: pick('Inventory Stock Cost', 'ইনভেন্টরি স্টক মূল্য'), value: Math.max(0, summary.inventoryValue) },
              ]}
            />
          </div>

          <InteractiveDataTable
            title={pick('Recent Business Transactions', 'সাম্প্রতিক ব্যবসায়িক লেনদেন')}
            rows={txns}
            columns={[
              ...txColumns.slice(0, 2),
              {
                key: 'type',
                header: pick('Type', 'ধরন'),
                render: (r) => <span className="uppercase text-[10px] font-bold">{txTypeLabel(r.type)}</span>,
              },
              ...txColumns.slice(2),
            ]}
            searchPlaceholder={pick('Search invoices, bills, parties...', 'ইনভয়েস, বিল বা পক্ষ খুঁজুন...')}
            getSearchText={(r) => `${r.ref} ${r.partyOrCategory} ${r.type} ${r.notes}`}
            getDateValue={(r) => r.date}
            onView={(r) => setDetailTx(r)}
            onDelete={handleDeleteTx}
          />
        </div>
      )}

      {(activeModule === 'sales' || activeModule === 'purchases' || activeModule === 'expenses') && (
        <div className="space-y-5">
          <DashboardCards
            columns={3}
            metrics={[
              { id: 's-1', label: pick('Total Sales', 'মোট বিক্রয়'), value: formatBDT(summary.totalSales), tone: 'primary' },
              { id: 's-2', label: pick('Gross Profit', 'মোট মুনাফা'), value: formatBDT(summary.grossProfit), tone: 'positive' },
              { id: 's-3', label: pick('Net Profit', 'নিট মুনাফা'), value: formatBDT(summary.netProfit), tone: summary.netProfit >= 0 ? 'positive' : 'danger' },
            ]}
          />
          {renderTransactionForm(
            activeModule === 'sales' ? 'sale' : activeModule === 'purchases' ? 'purchase' : 'expense',
            activeModule === 'sales'
              ? pick('Add Sample Sales Transaction', 'নমুনা বিক্রয় লেনদেন যোগ করুন')
              : activeModule === 'purchases'
              ? pick('Add Sample Purchase Bill', 'নমুনা ক্রয় বিল যোগ করুন')
              : pick('Record Operating Expense', 'পরিচালন ব্যয় লিপিবদ্ধ করুন')
          )}
          <InteractiveDataTable
            title={
              activeModule === 'sales'
                ? pick('Sales Ledger', 'বিক্রয় লেজার')
                : activeModule === 'purchases'
                ? pick('Purchase Register', 'ক্রয় রেজিস্টার')
                : pick('Expense Register', 'ব্যয় রেজিস্টার')
            }
            rows={txns.filter(
              (t) =>
                t.type ===
                (activeModule === 'sales' ? 'sale' : activeModule === 'purchases' ? 'purchase' : 'expense')
            )}
            columns={txColumns}
            getSearchText={(r) => `${r.ref} ${r.partyOrCategory} ${r.notes}`}
            getDateValue={(r) => r.date}
            onView={(r) => setDetailTx(r)}
            onEdit={handleEditTx}
            onDelete={handleDeleteTx}
          />
        </div>
      )}

      {(activeModule === 'customers' || activeModule === 'suppliers') && (
        <div className="space-y-5">
          <form
            onSubmit={(e) =>
              handleAddParty(activeModule === 'customers' ? 'customer' : 'supplier', e)
            }
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {activeModule === 'customers'
                ? pick('Add Sample Customer', 'নমুনা ক্রেতা যোগ করুন')
                : pick('Add Sample Supplier', 'নমুনা সরবরাহকারী যোগ করুন')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                placeholder={pick('Company / Contact Name', 'প্রতিষ্ঠান / ব্যক্তির নাম')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              />
              <input
                type="text"
                value={partyPhone}
                onChange={(e) => setPartyPhone(e.target.value)}
                placeholder={pick('Phone (+8801...)', 'ফোন (+8801...)')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              />
              <input
                type="number"
                min="0"
                value={partyDue}
                onChange={(e) => setPartyDue(e.target.value)}
                placeholder={pick('Opening Balance (BDT)', 'প্রারম্ভিক বকেয়া (টাকা)')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
              >
                {activeModule === 'customers'
                  ? pick('Add Customer', 'ক্রেতা যোগ করুন')
                  : pick('Add Supplier', 'সরবরাহকারী যোগ করুন')}
              </button>
            </div>
          </form>

          <InteractiveDataTable
            title={
              activeModule === 'customers'
                ? pick('Customers Directory', 'ক্রেতা তালিকা')
                : pick('Suppliers Directory', 'সরবরাহকারী তালিকা')
            }
            rows={activeModule === 'customers' ? customers : suppliers}
            columns={[
              { key: 'name', header: pick('Name', 'নাম'), render: (r) => <span className="font-bold">{r.name}</span> },
              { key: 'phone', header: pick('Phone', 'ফোন'), render: (r) => <span className="font-mono text-[11px]">{r.phone}</span> },
              { key: 'city', header: pick('Location', 'অবস্থান'), render: (r) => r.city },
              { key: 'due', header: pick('Opening Balance', 'প্রারম্ভিক বকেয়া'), align: 'right', render: (r) => formatBDT(r.openingDue) },
            ]}
            getSearchText={(r) => `${r.name} ${r.city} ${r.phone}`}
            onDelete={(id) => {
              if (activeModule === 'customers') {
                setCustomers((prev) => prev.filter((c) => c.id !== id));
              } else {
                setSuppliers((prev) => prev.filter((s) => s.id !== id));
              }
              setBanner(pick('Party removed from sample directory.', 'নমুনা তালিকা থেকে পক্ষটি মুছে ফেলা হয়েছে।'));
            }}
          />
        </div>
      )}

      {(activeModule === 'products' || activeModule === 'inventory') && (
        <div className="space-y-5">
          {activeModule === 'products' && (
            <form
              onSubmit={handleAddProduct}
              className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
            >
              <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
                {pick('Add Sample Product', 'নমুনা পণ্য যোগ করুন')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <input
                  type="text"
                  value={prodSku}
                  onChange={(e) => setProdSku(e.target.value)}
                  placeholder={pick('SKU (e.g., TB-105)', 'SKU (যেমন: TB-105)')}
                  className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
                />
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder={pick('Product Name', 'পণ্যের নাম')}
                  className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs sm:col-span-2"
                />
                <input
                  type="number"
                  min="1"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  placeholder={pick('Sell Price (BDT)', 'বিক্রয়মূল্য (টাকা)')}
                  className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
                />
                <input
                  type="number"
                  min="0"
                  value={prodQty}
                  onChange={(e) => setProdQty(e.target.value)}
                  placeholder={pick('Initial Qty', 'প্রাথমিক পরিমাণ')}
                  className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  min="0"
                  value={prodCost}
                  onChange={(e) => setProdCost(e.target.value)}
                  placeholder={pick('Unit Cost (Optional)', 'ক্রয়মূল্য (ঐচ্ছিক)')}
                  className="w-48 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
                >
                  {pick('Save Product', 'পণ্য সংরক্ষণ করুন')}
                </button>
              </div>
            </form>
          )}

          <InteractiveDataTable
            title={
              activeModule === 'products'
                ? pick('Product Catalog', 'পণ্য ক্যাটালগ')
                : pick('Current Inventory Valuation', 'বর্তমান ইনভেন্টরি মূল্যায়ন')
            }
            rows={products}
            columns={[
              { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.sku}</span> },
              { key: 'name', header: pick('Product Name', 'পণ্যের নাম'), render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: 'cost', header: pick('Unit Cost', 'একক ক্রয়মূল্য'), align: 'right', render: (r) => formatBDT(r.costPrice) },
              { key: 'price', header: pick('Selling Price', 'বিক্রয়মূল্য'), align: 'right', render: (r) => formatBDT(r.unitPrice) },
              {
                key: 'qty',
                header: pick('Stock Qty', 'স্টক পরিমাণ'),
                align: 'right',
                render: (r) => (
                  <span className={r.stockQty <= 5 ? 'font-bold text-amber-600' : 'font-bold'}>
                    {r.stockQty} {r.stockQty <= 5 ? pick('(Low)', '(কম)') : ''}
                  </span>
                ),
              },
              { key: 'val', header: pick('Stock Value', 'স্টক মূল্য'), align: 'right', render: (r) => formatBDT(r.costPrice * r.stockQty) },
            ]}
            getSearchText={(r) => `${r.sku} ${r.name}`}
            onDelete={(id) => {
              setProducts((prev) => prev.filter((p) => p.id !== id));
              setBanner(pick('Product deleted from sample catalog.', 'নমুনা ক্যাটালগ থেকে পণ্য মুছে ফেলা হয়েছে।'));
            }}
          />
        </div>
      )}

      {activeModule === 'cash-bank' && (
        <div className="space-y-5">
          <DashboardCards
            columns={3}
            metrics={[
              { id: 'cb-1', label: pick('Cash in Hand', 'হাতে নগদ'), value: formatBDT(summary.cashBalance), subtext: pick(`Opening: ${formatBDT(openingCash)}`, `প্রারম্ভিক: ${formatBDT(openingCash)}`) },
              { id: 'cb-2', label: pick('Bank Account Balance', 'ব্যাংক অ্যাকাউন্ট ব্যালেন্স'), value: formatBDT(summary.bankBalance), subtext: pick(`Opening: ${formatBDT(openingBank)}`, `প্রারম্ভিক: ${formatBDT(openingBank)}`), tone: 'primary' },
              { id: 'cb-3', label: pick('Total Liquid Funds', 'মোট তরল তহবিল'), value: formatBDT(summary.cashBalance + summary.bankBalance), tone: 'positive' },
            ]}
          />
          <InteractiveDataTable
            title={pick('Cash & Bank Settled Transactions', 'নগদ ও ব্যাংকে নিষ্পত্তিকৃত লেনদেন')}
            rows={txns.filter((t) => t.account === 'Cash' || t.account === 'Bank')}
            columns={txColumns}
            getSearchText={(r) => `${r.ref} ${r.partyOrCategory} ${r.account}`}
            getDateValue={(r) => r.date}
            onView={(r) => setDetailTx(r)}
          />
        </div>
      )}

      {activeModule === 'reports' && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D7E2F3] dark:border-slate-800">
              <div>
                <h4 className="text-base font-extrabold text-[#0B1730] dark:text-white">
                  {pick('Profit & Loss Statement (Simulated Business Period)', 'লাভ-ক্ষতি বিবরণী (সিমুলেটেড ব্যবসায়িক সময়কাল)')}
                </h4>
                <p className="text-xs text-[#5F6D82]">
                  {pick(
                    'Live calculation across all entered sample sales, COGS, purchases and expenses',
                    'এন্ট্রি করা সকল নমুনা বিক্রয়, COGS, ক্রয় ও খরচের ওপর তাৎক্ষণিক হিসাব'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
              >
                {pick('Print Sample Statement', 'নমুনা বিবরণী প্রিন্ট করুন')}
              </button>
            </div>

            <div className="divide-y divide-[#D7E2F3]/70 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between font-semibold">
                <span>{pick('Total Sales Revenue', 'মোট বিক্রয় আয়')}</span>
                <span className="font-mono tabular-nums">{formatBDT(summary.totalSales)}</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#5F6D82]">
                <span>{pick('Less: Cost of Goods Sold (COGS)', 'বাদ: বিক্রিত পণ্যের ব্যয় (COGS)')}</span>
                <span className="font-mono tabular-nums">({formatBDT(summary.totalCogs)})</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold text-[#0345A4] dark:text-sky-400">
                <span>{pick('Gross Profit', 'মোট মুনাফা')}</span>
                <span className="font-mono tabular-nums">{formatBDT(summary.grossProfit)}</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#5F6D82]">
                <span>{pick('Less: Operating Expenses', 'বাদ: পরিচালন ব্যয়')}</span>
                <span className="font-mono tabular-nums">({formatBDT(summary.totalExpenses)})</span>
              </div>
              <div className="py-3 flex justify-between text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                <span>{pick('Net Profit', 'নিট মুনাফা')}</span>
                <span className="font-mono tabular-nums flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {formatBDT(summary.netProfit)}
                </span>
              </div>
            </div>
          </div>

          <FinancialBarChart
            title={pick('Revenue vs Cost & Profit Comparison', 'আয় বনাম ব্যয় ও মুনাফার তুলনা')}
            data={performanceChartData}
            primaryLabel={pick('BDT Total', 'মোট টাকা')}
          />
        </div>
      )}

      <DetailModal
        isOpen={Boolean(detailTx)}
        title={detailTx ? `${detailTx.ref} — ${detailTx.partyOrCategory}` : ''}
        subtitle={detailTx ? `${txTypeLabel(detailTx.type)} ${pick('Record', 'রেকর্ড')}` : ''}
        rows={
          detailTx
            ? [
                { label: pick('Date', 'তারিখ'), value: detailTx.date, mono: true },
                { label: pick('Reference', 'রেফারেন্স'), value: detailTx.ref, mono: true },
                { label: pick('Party / Category', 'পক্ষ / খাত'), value: detailTx.partyOrCategory },
                { label: pick('Settlement Mode', 'পরিশোধের মাধ্যম'), value: accountLabel(detailTx.account) },
                { label: pick('Amount', 'পরিমাণ'), value: formatBDT(detailTx.amount), mono: true },
                ...(detailTx.costOfGoods !== undefined
                  ? [{ label: pick('COGS', 'পণ্যের ক্রয়মূল্য'), value: formatBDT(detailTx.costOfGoods), mono: true }]
                  : []),
                { label: pick('Notes', 'নোট'), value: detailTx.notes },
              ]
            : []
        }
        onClose={() => setDetailTx(null)}
        onPrint={handlePrint}
      />
    </DemoWorkspace>
  );
};

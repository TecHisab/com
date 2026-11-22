import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  ShoppingCart,
  Users,
  Truck,
  Boxes,
  Percent,
  RotateCcw,
  Wallet,
  Lock,
  FileBarChart,
  Plus,
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

interface RetailProps {
  onRequestOnboarding?: () => void;
}

interface RetailProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stockQty: number;
  reorderLevel: number;
}

interface RetailSale {
  id: string;
  date: string;
  invoiceNo: string;
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
  discount: number;
  costTotal: number;
  netTotal: number;
  customer: string;
  returned?: boolean;
}

interface RetailPurchase {
  id: string;
  date: string;
  supplier: string;
  productName: string;
  qty: number;
  totalCost: number;
}

const INITIAL_PRODUCTS: RetailProduct[] = [
  { id: 'rp-1', sku: 'RT-101', name: 'Organic Green Tea 250g', category: 'Grocery', costPrice: 280, sellPrice: 420, stockQty: 34, reorderLevel: 10 },
  { id: 'rp-2', sku: 'RT-102', name: 'Stainless Flask 1L', category: 'Homeware', costPrice: 620, sellPrice: 950, stockQty: 7, reorderLevel: 8 },
  { id: 'rp-3', sku: 'RT-103', name: 'Premium Olive Oil 500ml', category: 'Grocery', costPrice: 780, sellPrice: 1150, stockQty: 19, reorderLevel: 6 },
  { id: 'rp-4', sku: 'RT-104', name: 'Cotton Polo Shirt (M)', category: 'Apparel', costPrice: 450, sellPrice: 790, stockQty: 4, reorderLevel: 6 },
];

const INITIAL_SALES: RetailSale[] = [
  { id: 'rs-1', date: getTodayISO(), invoiceNo: 'RT-901', productId: 'rp-1', productName: 'Organic Green Tea 250g', qty: 4, unitPrice: 420, discount: 80, costTotal: 1120, netTotal: 1600, customer: 'Walk-in Customer' },
  { id: 'rs-2', date: getTodayISO(), invoiceNo: 'RT-902', productId: 'rp-2', productName: 'Stainless Flask 1L', qty: 2, unitPrice: 950, discount: 0, costTotal: 1240, netTotal: 1900, customer: 'Farhana Rahman' },
  { id: 'rs-3', date: getTodayISO(), invoiceNo: 'RT-903', productId: 'rp-3', productName: 'Premium Olive Oil 500ml', qty: 3, unitPrice: 1150, discount: 150, costTotal: 2340, netTotal: 3300, customer: 'Sabbir Ahmed' },
];

const INITIAL_PURCHASES: RetailPurchase[] = [
  { id: 'rpur-1', date: '2026-04-05', supplier: 'Chattogram Consumer Imports', productName: 'Premium Olive Oil 500ml', qty: 20, totalCost: 15600 },
  { id: 'rpur-2', date: '2026-04-08', supplier: 'Sylhet Agro Supply', productName: 'Organic Green Tea 250g', qty: 30, totalCost: 8400 },
];

const RETAIL_MODULES: DemoModuleTab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sales', label: 'Retail Sales', icon: ShoppingBag },
  { id: 'catalog', label: 'Product Catalog', icon: Tag },
  { id: 'purchases', label: 'Purchase Management', icon: ShoppingCart },
  { id: 'customers', label: 'Customer Management', icon: Users },
  { id: 'suppliers', label: 'Supplier Management', icon: Truck },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'discounts', label: 'Discounts', icon: Percent },
  { id: 'returns', label: 'Returns', icon: RotateCcw },
  { id: 'cash', label: 'Cash Management', icon: Wallet },
  { id: 'closing', label: 'Daily Closing', icon: Lock },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
];

export const DemoRetailManager: React.FC<RetailProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [products, setProducts] = useState<RetailProduct[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<RetailSale[]>(INITIAL_SALES);
  const [purchases, setPurchases] = useState<RetailPurchase[]>(INITIAL_PURCHASES);
  const [openingDrawerCash] = useState(5000);
  const [countedCashInput, setCountedCashInput] = useState('11800');
  const [defaultPromoDiscountPct, setDefaultPromoDiscountPct] = useState(5);
  const [banner, setBanner] = useState<string | null>(null);

  const retailModules: DemoModuleTab[] = [
    { id: 'dashboard', label: pick('Dashboard', 'ড্যাশবোর্ড'), icon: LayoutDashboard },
    { id: 'sales', label: pick('Retail Sales', 'খুচরা বিক্রয়'), icon: ShoppingBag },
    { id: 'catalog', label: pick('Product Catalog', 'পণ্য ক্যাটালগ'), icon: Tag },
    { id: 'purchases', label: pick('Purchase Management', 'ক্রয় ব্যবস্থাপনা'), icon: ShoppingCart },
    { id: 'customers', label: pick('Customer Management', 'গ্রাহক ব্যবস্থাপনা'), icon: Users },
    { id: 'suppliers', label: pick('Supplier Management', 'সরবরাহকারী ব্যবস্থাপনা'), icon: Truck },
    { id: 'inventory', label: pick('Inventory', 'ইনভেন্টরি'), icon: Boxes },
    { id: 'discounts', label: pick('Discounts', 'ডিসকাউন্ট'), icon: Percent },
    { id: 'returns', label: pick('Returns', 'রিটার্ন'), icon: RotateCcw },
    { id: 'cash', label: pick('Cash Management', 'ক্যাশ ব্যবস্থাপনা'), icon: Wallet },
    { id: 'closing', label: pick('Daily Closing', 'দৈনিক ক্লোজিং'), icon: Lock },
    { id: 'reports', label: pick('Reports', 'রিপোর্টসমূহ'), icon: FileBarChart },
  ];

  // Sale entry state
  const [saleProductId, setSaleProductId] = useState('rp-1');
  const [saleQty, setSaleQty] = useState('2');
  const [saleDiscount, setSaleDiscount] = useState('0');
  const [saleCustomer, setSaleCustomer] = useState('Walk-in Customer');

  // Product entry state
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Grocery');
  const [newCost, setNewCost] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newQty, setNewQty] = useState('');

  // Purchase entry state
  const [purSupplier, setPurSupplier] = useState('');
  const [purProductId, setPurProductId] = useState('rp-2');
  const [purQty, setPurQty] = useState('10');

  const handleResetDemo = () => {
    setProducts(INITIAL_PRODUCTS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASES);
    setBanner(pick('TecHisab Retail Manager demo state restored.', 'TecHisab রিটেইল ম্যানেজার ডেমো অবস্থা পূর্বাবস্থায় ফিরিয়ে আনা হয়েছে।'));
  };

  const stats = useMemo(() => {
    const activeSales = sales.filter((s) => !s.returned);
    const totalSales = activeSales.reduce((sum, s) => sum + s.netTotal, 0);
    const totalCost = activeSales.reduce((sum, s) => sum + s.costTotal, 0);
    const totalDiscounts = activeSales.reduce((sum, s) => sum + s.discount, 0);
    const grossProfit = totalSales - totalCost;
    const totalOrders = activeSales.length;
    const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;
    const stockValue = products.reduce((sum, p) => sum + p.costPrice * p.stockQty, 0);
    const lowStockItems = products.filter((p) => p.stockQty <= p.reorderLevel);

    const productMap: Record<string, number> = {};
    activeSales.forEach((s) => {
      productMap[s.productName] = (productMap[s.productName] || 0) + s.netTotal;
    });

    return {
      totalSales,
      totalCost,
      totalDiscounts,
      grossProfit,
      totalOrders,
      avgOrder,
      stockValue,
      lowStockItems,
      productBreakdown: Object.entries(productMap).map(([label, value]) => ({ label, value })),
    };
  }, [sales, products]);

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === saleProductId);
    const qty = Math.max(1, Math.round(parseSafeNumber(saleQty)));
    const discount = Math.max(0, parseSafeNumber(saleDiscount));
    if (!product) return;
    if (product.stockQty < qty) {
      setBanner(
        pick(
          `Insufficient stock for "${product.name}" (Available: ${product.stockQty}).`,
          `"${product.name}" পণ্যের পর্যাপ্ত স্টক নেই (মজুত আছে: ${product.stockQty}টি)।`
        )
      );
      return;
    }

    const gross = product.sellPrice * qty;
    const net = Math.max(0, gross - discount);
    const saleItem: RetailSale = {
      id: generateDemoId('rs'),
      date: getTodayISO(),
      invoiceNo: generateDemoId('RT'),
      productId: product.id,
      productName: product.name,
      qty,
      unitPrice: product.sellPrice,
      discount,
      costTotal: product.costPrice * qty,
      netTotal: net,
      customer: saleCustomer.trim() || 'Walk-in Customer',
    };

    setSales((prev) => [saleItem, ...prev]);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stockQty: p.stockQty - qty } : p))
    );
    setBanner(
      pick(
        `Recorded retail sale ${saleItem.invoiceNo} (${formatBDT(net)}) & deducted ${qty} units.`,
        `খুচরা বিক্রয় ${saleItem.invoiceNo} (${formatBDT(net)}) সংরক্ষিত হয়েছে এবং ${qty}টি ইউনিট স্টক থেকে বাদ গেছে।`
      )
    );
  };

  const handleProcessReturn = (saleId: string) => {
    const target = sales.find((s) => s.id === saleId);
    if (!target || target.returned) return;
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, returned: true } : s))
    );
    setProducts((prev) =>
      prev.map((p) =>
        p.id === target.productId ? { ...p, stockQty: p.stockQty + target.qty } : p
      )
    );
    setBanner(
      pick(
        `Processed return for ${target.invoiceNo} — restored ${target.qty} units to inventory.`,
        `${target.invoiceNo}-এর রিটার্ন সম্পন্ন — ${target.qty}টি ইউনিট ইনভেন্টরিতে ফেরত যোগ হয়েছে।`
      )
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sellPrice = parseSafeNumber(newPrice);
    const costPrice = parseSafeNumber(newCost) || Math.round(sellPrice * 0.65);
    const qty = Math.max(0, Math.round(parseSafeNumber(newQty)));
    if (!newName.trim() || sellPrice <= 0) {
      setBanner(pick('Enter valid product name and positive retail price.', 'সঠিক পণ্যের নাম এবং ধনাত্মক খুচরা মূল্য দিন।'));
      return;
    }
    const created: RetailProduct = {
      id: generateDemoId('rp'),
      sku: newSku.trim() || generateDemoId('RT'),
      name: newName.trim(),
      category: newCat.trim() || 'General',
      costPrice,
      sellPrice,
      stockQty: qty,
      reorderLevel: 5,
    };
    setProducts((prev) => [created, ...prev]);
    setNewSku('');
    setNewName('');
    setNewCost('');
    setNewPrice('');
    setNewQty('');
    setBanner(pick(`Added retail SKU "${created.name}".`, `খুচরা SKU "${created.name}" যোগ করা হয়েছে।`));
  };

  const handleRecordPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === purProductId);
    const qty = Math.max(1, Math.round(parseSafeNumber(purQty)));
    if (!product || !purSupplier.trim()) {
      setBanner(pick('Enter supplier name and valid restock quantity.', 'সরবরাহকারীর নাম ও সঠিক পুনঃমজুত পরিমাণ দিন।'));
      return;
    }
    const totalCost = product.costPrice * qty;
    setPurchases((prev) => [
      {
        id: generateDemoId('rpur'),
        date: getTodayISO(),
        supplier: purSupplier.trim(),
        productName: product.name,
        qty,
        totalCost,
      },
      ...prev,
    ]);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stockQty: p.stockQty + qty } : p))
    );
    setPurSupplier('');
    setBanner(
      pick(
        `Restocked ${qty} units of ${product.name} (${formatBDT(totalCost)}).`,
        `${product.name}-এর ${qty}টি ইউনিট পুনঃমজুত করা হয়েছে (${formatBDT(totalCost)})।`
      )
    );
  };

  const expectedCashInDrawer = openingDrawerCash + stats.totalSales;
  const variance = parseSafeNumber(countedCashInput) - expectedCashInDrawer;

  const notifications: DemoNotification[] = stats.lowStockItems.map((item) => ({
    id: `low-${item.id}`,
    title: pick(`Low Stock: ${item.name}`, `স্বল্প মজুত: ${item.name}`),
    detail: pick(
      `Only ${item.stockQty} left (reorder level: ${item.reorderLevel}).`,
      `মাত্র ${item.stockQty}টি বাকি আছে (রি-অর্ডার স্তর: ${item.reorderLevel})।`
    ),
    type: 'warning',
  }));

  const handlePrint = () => {
    triggerPrintableReport(
      pick('TecHisab Retail Manager — Daily Store Closing Report', 'TecHisab রিটেইল ম্যানেজার — দৈনিক স্টোর ক্লোজিং রিপোর্ট'),
      `<table style="width:100%; border-collapse: collapse; font-size:13px;">
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Active Orders Today', 'আজকের সক্রিয় অর্ডার')}</td><td style="padding:8px; text-align:right;">${stats.totalOrders}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Net Retail Sales', 'নিট খুচরা বিক্রয়')}</td><td style="padding:8px; text-align:right; font-weight:700;">${formatBDT(stats.totalSales)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Gross Margin Profit', 'মোট মার্জিন মুনাফা')}</td><td style="padding:8px; text-align:right; font-weight:700;">${formatBDT(stats.grossProfit)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Expected Register Cash', 'প্রত্যাশিত ক্যাশ ড্রয়ার')}</td><td style="padding:8px; text-align:right;">${formatBDT(expectedCashInDrawer)}</td></tr>
      </table>`
    );
  };

  return (
    <DemoWorkspace
      productName="TecHisab Retail Manager"
      productSubtitle={pick(
        'Storefront Sales, Discounts, Returns, Stock Alerts & Daily Cash Closing',
        'স্টোরফ্রন্ট বিক্রয়, ডিসকাউন্ট, রিটার্ন, স্টক সতর্কতা এবং দৈনিক ক্যাশ ক্লোজিং'
      )}
      modules={retailModules}
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      onResetDemo={handleResetDemo}
      onPrintReport={handlePrint}
      onRequestOnboarding={onRequestOnboarding}
      notifications={notifications}
      bannerMessage={banner}
      onClearBanner={() => setBanner(null)}
    >
      {activeModule === 'dashboard' && (
        <div className="space-y-5">
          <DashboardCards
            columns={3}
            metrics={[
              { id: 'rm-1', label: pick("Today's Sales", 'আজকের বিক্রয়'), value: formatBDT(stats.totalSales), subtext: `${pick('Discounts given:', 'প্রদত্ত ডিসকাউন্ট:')} ${formatBDT(stats.totalDiscounts)}`, tone: 'primary' },
              { id: 'rm-2', label: pick('Total Orders', 'মোট অর্ডার'), value: String(stats.totalOrders), subtext: pick('Completed invoices', 'সম্পন্ন ইনভয়েস') },
              { id: 'rm-3', label: pick('Average Order Value', 'গড় অর্ডার মূল্য'), value: formatBDT(Math.round(stats.avgOrder)) },
              { id: 'rm-4', label: pick('Gross Profit', 'মোট মুনাফা'), value: formatBDT(stats.grossProfit), tone: 'positive' },
              { id: 'rm-5', label: pick('Current Stock Value', 'বর্তমান স্টক মূল্য'), value: formatBDT(stats.stockValue) },
              { id: 'rm-6', label: pick('Low Stock Items', 'স্বল্প মজুত পণ্য'), value: String(stats.lowStockItems.length), tone: stats.lowStockItems.length > 0 ? 'warning' : 'positive' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryBreakdownChart
              title={pick('Product-Wise Sales Breakdown', 'পণ্যভিত্তিক বিক্রয় বিভাজন')}
              items={stats.productBreakdown}
            />
            <FinancialBarChart
              title={pick('Retail Stock On Hand vs Reorder Threshold', 'বর্তমান রিটেইল স্টক বনাম রি-অর্ডার সীমা')}
              data={products.map((p) => ({
                label: p.sku,
                value: p.stockQty,
                secondaryValue: p.reorderLevel,
              }))}
              primaryLabel={pick('Current Units', 'বর্তমান ইউনিট')}
              secondaryLabel={pick('Reorder Alert', 'রি-অর্ডার সতর্কতা')}
              valueFormatter={(v) => `${v} ${pick('units', 'ইউনিট')}`}
            />
          </div>
        </div>
      )}

      {activeModule === 'sales' && (
        <div className="space-y-5">
          <form
            onSubmit={handleRecordSale}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {pick('Record Retail Counter Sale (Auto-Deducts Inventory)', 'কাউন্টার বিক্রয় লিপিবদ্ধ করুন (স্বয়ংক্রিয়ভাবে স্টক কমবে)')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <select
                value={saleProductId}
                onChange={(e) => setSaleProductId(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatBDT(p.sellPrice)} ({p.stockQty} {pick('left', 'বাকি')})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={saleQty}
                onChange={(e) => setSaleQty(e.target.value)}
                placeholder={pick('Qty', 'পরিমাণ')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
              <input
                type="number"
                min="0"
                value={saleDiscount}
                onChange={(e) => setSaleDiscount(e.target.value)}
                placeholder={pick('Discount (BDT)', 'ডিসকাউন্ট (BDT)')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{pick('Complete Sale', 'বিক্রয় সম্পন্ন করুন')}</span>
              </button>
            </div>
            <input
              type="text"
              value={saleCustomer}
              onChange={(e) => setSaleCustomer(e.target.value)}
              placeholder={pick('Customer Name', 'গ্রাহকের নাম')}
              className="w-full sm:w-72 px-3 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
            />
          </form>

          <InteractiveDataTable
            title={pick('Store Retail Sales Log', 'স্টোর খুচরা বিক্রয় লগ')}
            rows={sales}
            columns={[
              { key: 'inv', header: pick('Invoice #', 'ইনভয়েস #'), render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.invoiceNo}</span> },
              { key: 'item', header: pick('Product', 'পণ্য'), render: (r) => <span className={r.returned ? 'line-through text-[#5F6D82]' : 'font-semibold'}>{r.productName} (×{r.qty})</span> },
              { key: 'cust', header: pick('Customer', 'গ্রাহক'), render: (r) => r.customer },
              { key: 'disc', header: pick('Discount', 'ডিসকাউন্ট'), align: 'right', render: (r) => formatBDT(r.discount) },
              { key: 'net', header: pick('Net Sale', 'নিট বিক্রয়'), align: 'right', render: (r) => r.returned ? pick('Returned', 'ফেরত') : formatBDT(r.netTotal) },
            ]}
            getSearchText={(r) => `${r.invoiceNo} ${r.productName} ${r.customer}`}
            getDateValue={(r) => r.date}
          />
        </div>
      )}

      {(activeModule === 'catalog' || activeModule === 'inventory') && (
        <div className="space-y-5">
          {activeModule === 'catalog' && (
            <form
              onSubmit={handleAddProduct}
              className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
            >
              <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
                {pick('Add New Retail Product', 'নতুন খুচরা পণ্য যোগ করুন')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
                <input type="text" value={newSku} onChange={(e) => setNewSku(e.target.value)} placeholder="SKU" className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={pick('Product Name', 'পণ্যের নাম')} className="sm:col-span-2 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
                <input type="number" min="1" value={newCost} onChange={(e) => setNewCost(e.target.value)} placeholder={pick('Cost', 'ক্রয়মূল্য')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
                <input type="number" min="1" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder={pick('Sell Price', 'বিক্রয়মূল্য')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
                <input type="number" min="0" value={newQty} onChange={(e) => setNewQty(e.target.value)} placeholder={pick('Qty', 'পরিমাণ')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
              </div>
              <div className="flex justify-between items-center">
                <input type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder={pick('Category', 'ক্যাটাগরি')} className="w-40 px-3 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer">
                  {pick('Save Retail SKU', 'রিটেইল SKU সংরক্ষণ')}
                </button>
              </div>
            </form>
          )}

          <InteractiveDataTable
            title={activeModule === 'catalog' ? pick('Retail Store Catalog', 'রিটেইল স্টোর ক্যাটালগ') : pick('Inventory & Low-Stock Monitor', 'ইনভেন্টরি ও স্বল্প-স্টক মনিটর')}
            rows={products}
            columns={[
              { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.sku}</span> },
              { key: 'name', header: pick('Product', 'পণ্য'), render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: 'cat', header: pick('Category', 'ক্যাটাগরি'), render: (r) => r.category },
              { key: 'sell', header: pick('Retail Price', 'খুচরা মূল্য'), align: 'right', render: (r) => formatBDT(r.sellPrice) },
              {
                key: 'qty',
                header: pick('On Hand', 'হাতে মজুত'),
                align: 'right',
                render: (r) => (
                  <span className={r.stockQty <= r.reorderLevel ? 'font-bold text-amber-600' : 'font-bold'}>
                    {r.stockQty} {r.stockQty <= r.reorderLevel ? pick('(Low Stock)', '(স্বল্প মজুত)') : ''}
                  </span>
                ),
              },
              { key: 'val', header: pick('Cost Value', 'ক্রয় মূল্য'), align: 'right', render: (r) => formatBDT(r.costPrice * r.stockQty) },
            ]}
            getSearchText={(r) => `${r.sku} ${r.name} ${r.category}`}
          />
        </div>
      )}

      {(activeModule === 'purchases' || activeModule === 'suppliers') && (
        <div className="space-y-5">
          <form
            onSubmit={handleRecordPurchase}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {pick('Receive Supplier Stock Purchase (Increases Inventory)', 'সরবরাহকারীর কাছ থেকে স্টক গ্রহণ করুন (ইনভেন্টরি বাড়বে)')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input type="text" value={purSupplier} onChange={(e) => setPurSupplier(e.target.value)} placeholder={pick('Supplier Name', 'সরবরাহকারীর নাম')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
              <select value={purProductId} onChange={(e) => setPurProductId(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input type="number" min="1" value={purQty} onChange={(e) => setPurQty(e.target.value)} placeholder={pick('Qty', 'পরিমাণ')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer">
                {pick('Receive Stock', 'স্টক গ্রহণ করুন')}
              </button>
            </div>
          </form>

          <InteractiveDataTable
            title={pick('Supplier Restock History', 'সরবরাহকারী পুনঃমজুত ইতিহাস')}
            rows={purchases}
            columns={[
              { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
              { key: 'sup', header: pick('Supplier', 'সরবরাহকারী'), render: (r) => <span className="font-bold">{r.supplier}</span> },
              { key: 'item', header: pick('Product', 'পণ্য'), render: (r) => r.productName },
              { key: 'qty', header: pick('Units', 'ইউনিট'), align: 'right', render: (r) => r.qty },
              { key: 'cost', header: pick('Purchase Cost', 'ক্রয় খরচ'), align: 'right', render: (r) => formatBDT(r.totalCost) },
            ]}
            getSearchText={(r) => `${r.supplier} ${r.productName}`}
          />
        </div>
      )}

      {activeModule === 'returns' && (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-[#D7E2F3] dark:border-slate-800">
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {pick('Process Demo Customer Returns (Restores Stock & Reverses Net Sale)', 'নমুনা গ্রাহক রিটার্ন প্রক্রিয়া করুন (স্টক ফেরত ও নিট বিক্রয় সমন্বয় হবে)')}
            </h4>
          </div>
          <div className="divide-y divide-[#D7E2F3]/70 dark:divide-slate-800">
            {sales.map((s) => (
              <div key={s.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-[#0345A4] mr-2">{s.invoiceNo}</span>
                  <span className="font-semibold">{s.productName} (×{s.qty})</span>
                  <span className="text-[#5F6D82] ml-2">— {s.customer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">{formatBDT(s.netTotal)}</span>
                  <button
                    type="button"
                    disabled={s.returned}
                    onClick={() => handleProcessReturn(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      s.returned
                        ? 'bg-slate-100 dark:bg-slate-800 text-[#5F6D82] cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {s.returned ? pick('Returned ✓', 'ফেরত সম্পন্ন ✓') : pick('Process Return', 'রিটার্ন প্রক্রিয়া')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeModule === 'discounts' && (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-5 space-y-4">
          <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
            {pick('Storewide Promotional Discount Simulation', 'স্টোরব্যাপী প্রোমোশনাল ডিসকাউন্ট সিমুলেশন')}
          </h4>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="font-semibold text-[#5F6D82]">{pick('Store Discount Rate (%):', 'স্টোর ডিসকাউন্ট হার (%):')}</label>
            <input
              type="number"
              min="0"
              max="50"
              value={defaultPromoDiscountPct}
              onChange={(e) => setDefaultPromoDiscountPct(Math.min(50, Math.max(0, parseSafeNumber(e.target.value))))}
              className="w-24 px-3 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono font-bold"
            />
            <span className="text-[#0345A4] dark:text-sky-400 font-semibold">
              {pick('Total Discounts Granted Today:', 'আজকের মোট প্রদত্ত ডিসকাউন্ট:')} {formatBDT(stats.totalDiscounts)}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {products.map((p) => {
              const discPrice = Math.round(p.sellPrice * (1 - defaultPromoDiscountPct / 100));
              return (
                <div key={p.id} className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/70 border border-[#D7E2F3] dark:border-slate-700 flex justify-between text-xs">
                  <span className="font-semibold">{p.name}</span>
                  <span className="font-mono">
                    <span className="line-through text-[#5F6D82] mr-2">{formatBDT(p.sellPrice)}</span>
                    <span className="font-bold text-[#0345A4] dark:text-sky-400">{formatBDT(discPrice)}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(activeModule === 'cash' || activeModule === 'closing' || activeModule === 'reports') && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-5 space-y-4">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('Daily Cash Register Closing Reconciliation', 'দৈনিক ক্যাশ রেজিস্টার ক্লোজিং সমন্বয়')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F4F8FF] dark:bg-slate-800">
                <span className="text-[#5F6D82] block">{pick('Opening Float', 'প্রারম্ভিক ক্যাশ')}</span>
                <span className="font-mono font-bold text-sm">{formatBDT(openingDrawerCash)}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F4F8FF] dark:bg-slate-800">
                <span className="text-[#5F6D82] block">{pick('Net Counter Sales', 'নিট কাউন্টার বিক্রয়')}</span>
                <span className="font-mono font-bold text-sm text-emerald-700">{formatBDT(stats.totalSales)}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F4F8FF] dark:bg-slate-800">
                <span className="text-[#5F6D82] block">{pick('Expected Drawer Cash', 'প্রত্যাশিত ড্রয়ার ক্যাশ')}</span>
                <span className="font-mono font-bold text-sm text-[#0345A4]">{formatBDT(expectedCashInDrawer)}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F4F8FF] dark:bg-slate-800">
                <label className="text-[#5F6D82] block mb-1">{pick('Counted Cash (BDT)', 'গণনাকৃত ক্যাশ (BDT)')}</label>
                <input
                  type="number"
                  value={countedCashInput}
                  onChange={(e) => setCountedCashInput(e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 font-mono font-bold"
                />
              </div>
            </div>
            <div className="text-xs font-bold">
              {pick('Cash Over / Short Variance:', 'ক্যাশ বেশি / কম পার্থক্য:')}{' '}
              <span className={variance === 0 ? 'text-emerald-700' : 'text-amber-600'}>
                {formatBDT(variance)} ({variance === 0 ? pick('Exact Match', 'সঠিক মিল') : variance > 0 ? pick('Over', 'বেশি') : pick('Short', 'কম')})
              </span>
            </div>
          </div>

          <CategoryBreakdownChart title={pick('Sales Revenue by Product', 'পণ্য অনুযায়ী বিক্রয় আয়')} items={stats.productBreakdown} />
        </div>
      )}

      {activeModule === 'customers' && (
        <InteractiveDataTable
          title={pick('Store Customers & Purchase Totals', 'স্টোর গ্রাহক ও মোট ক্রয় হিসাব')}
          rows={sales.filter((s) => !s.returned)}
          columns={[
            { key: 'cust', header: pick('Customer', 'গ্রাহক'), render: (r) => <span className="font-bold">{r.customer}</span> },
            { key: 'inv', header: pick('Receipt #', 'রসিদ #'), render: (r) => <span className="font-mono">{r.invoiceNo}</span> },
            { key: 'prod', header: pick('Item Purchased', 'ক্রয়কৃত পণ্য'), render: (r) => r.productName },
            { key: 'amt', header: pick('Spend', 'খরচ'), align: 'right', render: (r) => formatBDT(r.netTotal) },
          ]}
          getSearchText={(r) => `${r.customer} ${r.invoiceNo}`}
        />
      )}
    </DemoWorkspace>
  );
};

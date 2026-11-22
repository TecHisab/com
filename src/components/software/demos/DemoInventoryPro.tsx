import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Warehouse,
  SlidersHorizontal,
  Calculator,
  Layers,
  Clock,
  FileBarChart,
  AlertCircle,
} from 'lucide-react';
import { DemoWorkspace, DemoModuleTab, DemoNotification } from '../workspace/DemoWorkspace';
import { DashboardCards } from '../workspace/DashboardCards';
import { InteractiveDataTable } from '../workspace/InteractiveDataTable';
import { FinancialBarChart } from '../workspace/FinancialChart';
import {
  formatBDT,
  getTodayISO,
  generateDemoId,
  parseSafeNumber,
  triggerPrintableReport,
} from '../../../utils/demoFormatters';
import { useLanguage } from '../../../context/LanguageContext';

interface InvProps {
  onRequestOnboarding?: () => void;
}

interface InvProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  reorderLevel: number;
  centralWh: number;
  chattogramWh: number;
  dhakaWh: number;
  batchNo: string;
  expiryDate: string;
}

interface StockMovement {
  id: string;
  date: string;
  sku: string;
  productName: string;
  type: 'Stock In' | 'Stock Out' | 'Transfer' | 'Adjustment';
  qty: number;
  warehouseNote: string;
}

const INITIAL_INV_PRODUCTS: InvProduct[] = [
  { id: 'inv-1', sku: 'IN-201', name: 'Sanitary Hand Gel 500ml', category: 'Health & Care', unitCost: 185, reorderLevel: 25, centralWh: 80, chattogramWh: 40, dhakaWh: 35, batchNo: 'B-2409', expiryDate: '2026-06-15' },
  { id: 'inv-2', sku: 'IN-202', name: 'Medical Grade Face Masks (50s)', category: 'Health & Care', unitCost: 260, reorderLevel: 20, centralWh: 12, chattogramWh: 4, dhakaWh: 2, batchNo: 'B-2402', expiryDate: '2026-03-10' },
  { id: 'inv-3', sku: 'IN-203', name: 'POS Thermal Paper Roll 80mm', category: 'Office Supplies', unitCost: 95, reorderLevel: 40, centralWh: 140, chattogramWh: 60, dhakaWh: 70, batchNo: 'B-2501', expiryDate: '2028-12-31' },
  { id: 'inv-4', sku: 'IN-204', name: 'Barcode Ribbon Wax 110x300m', category: 'Office Supplies', unitCost: 420, reorderLevel: 10, centralWh: 0, chattogramWh: 0, dhakaWh: 0, batchNo: 'B-2411', expiryDate: '2027-09-01' },
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  { id: 'mv-1', date: '2026-04-03', sku: 'IN-201', productName: 'Sanitary Hand Gel 500ml', type: 'Stock In', qty: 60, warehouseNote: 'Received into Central WH' },
  { id: 'mv-2', date: '2026-04-06', sku: 'IN-203', productName: 'POS Thermal Paper Roll 80mm', type: 'Stock Out', qty: 35, warehouseNote: 'Dispatched from Dhaka WH' },
  { id: 'mv-3', date: '2026-04-08', sku: 'IN-201', productName: 'Sanitary Hand Gel 500ml', type: 'Transfer', qty: 20, warehouseNote: 'Central WH → Chattogram WH' },
];

const INV_MODULES: DemoModuleTab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Product Management', icon: Package },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'stock-in', label: 'Stock In', icon: ArrowDownToLine },
  { id: 'stock-out', label: 'Stock Out', icon: ArrowUpFromLine },
  { id: 'transfers', label: 'Stock Transfers', icon: ArrowLeftRight },
  { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
  { id: 'adjustment', label: 'Stock Adjustment', icon: SlidersHorizontal },
  { id: 'valuation', label: 'Stock Valuation', icon: Calculator },
  { id: 'batches', label: 'Batch Management', icon: Layers },
  { id: 'expiry', label: 'Expiry Tracking', icon: Clock },
  { id: 'reports', label: 'Inventory Reports', icon: FileBarChart },
];

export const DemoInventoryPro: React.FC<InvProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [products, setProducts] = useState<InvProduct[]>(INITIAL_INV_PRODUCTS);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [banner, setBanner] = useState<string | null>(null);

  const invModules: DemoModuleTab[] = [
    { id: 'dashboard', label: pick('Dashboard', 'ড্যাশবোর্ড'), icon: LayoutDashboard },
    { id: 'products', label: pick('Product Management', 'পণ্য ব্যবস্থাপনা'), icon: Package },
    { id: 'categories', label: pick('Categories', 'ক্যাটাগরি'), icon: FolderTree },
    { id: 'stock-in', label: pick('Stock In', 'স্টক ইন'), icon: ArrowDownToLine },
    { id: 'stock-out', label: pick('Stock Out', 'স্টক আউট'), icon: ArrowUpFromLine },
    { id: 'transfers', label: pick('Stock Transfers', 'স্টক স্থানান্তর'), icon: ArrowLeftRight },
    { id: 'warehouses', label: pick('Warehouses', 'গুদামসমূহ'), icon: Warehouse },
    { id: 'adjustment', label: pick('Stock Adjustment', 'স্টক সমন্বয়'), icon: SlidersHorizontal },
    { id: 'valuation', label: pick('Stock Valuation', 'স্টক মূল্যায়ন'), icon: Calculator },
    { id: 'batches', label: pick('Batch Management', 'ব্যাচ ব্যবস্থাপনা'), icon: Layers },
    { id: 'expiry', label: pick('Expiry Tracking', 'মেয়াদ পর্যবেক্ষণ'), icon: Clock },
    { id: 'reports', label: pick('Inventory Reports', 'ইনভেন্টরি রিপোর্ট'), icon: FileBarChart },
  ];

  const movementTypeLabel = (t: StockMovement['type']) => {
    if (t === 'Stock In') return pick('Stock In', 'স্টক ইন');
    if (t === 'Stock Out') return pick('Stock Out', 'স্টক আউট');
    if (t === 'Transfer') return pick('Transfer', 'স্থানান্তর');
    return pick('Adjustment', 'সমন্বয়');
  };

  // Stock action form state
  const [targetProdId, setTargetProdId] = useState('inv-1');
  const [targetWh, setTargetWh] = useState<'centralWh' | 'chattogramWh' | 'dhakaWh'>('centralWh');
  const [destWh, setDestWh] = useState<'centralWh' | 'chattogramWh' | 'dhakaWh'>('dhakaWh');
  const [actionQty, setActionQty] = useState('15');
  const [adjNote, setAdjNote] = useState('Physical cycle count variance');

  // New Product form state
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Office Supplies');
  const [newCost, setNewCost] = useState('');
  const [newQty, setNewQty] = useState('');

  // Valuation interactive comparison inputs
  const [valOpeningQty, setValOpeningQty] = useState('100');
  const [valOpeningCost, setValOpeningCost] = useState('150');
  const [valPurchaseQty, setValPurchaseQty] = useState('80');
  const [valPurchaseCost, setValPurchaseCost] = useState('180');
  const [valIssuedQty, setValIssuedQty] = useState('120');

  const handleResetDemo = () => {
    setProducts(INITIAL_INV_PRODUCTS);
    setMovements(INITIAL_MOVEMENTS);
    setBanner(pick('TecHisab Inventory Pro sample warehouse data reset.', 'TecHisab ইনভেন্টরি প্রো নমুনা গুদাম ডেটা রিসেট হয়েছে।'));
  };

  const todayStr = getTodayISO();

  const summary = useMemo(() => {
    const totalQty = products.reduce(
      (s, p) => s + p.centralWh + p.chattogramWh + p.dhakaWh,
      0
    );
    const totalValue = products.reduce(
      (s, p) => s + (p.centralWh + p.chattogramWh + p.dhakaWh) * p.unitCost,
      0
    );
    const outOfStock = products.filter(
      (p) => p.centralWh + p.chattogramWh + p.dhakaWh === 0
    );
    const lowStock = products.filter((p) => {
      const q = p.centralWh + p.chattogramWh + p.dhakaWh;
      return q > 0 && q <= p.reorderLevel;
    });

    return {
      totalProducts: products.length,
      totalQty,
      totalValue,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      warehouseCount: 3,
      movementCount: movements.length,
      lowStock,
      outOfStock,
    };
  }, [products, movements]);

  // Interactive FIFO vs Weighted Average demo computation
  const valuationResult = useMemo(() => {
    const opQ = Math.max(0, Math.round(parseSafeNumber(valOpeningQty)));
    const opC = Math.max(0, parseSafeNumber(valOpeningCost));
    const purQ = Math.max(0, Math.round(parseSafeNumber(valPurchaseQty)));
    const purC = Math.max(0, parseSafeNumber(valPurchaseCost));
    const totalAvail = opQ + purQ;
    const issQ = Math.min(totalAvail, Math.max(0, Math.round(parseSafeNumber(valIssuedQty))));
    const remQ = Math.max(0, totalAvail - issQ);

    // FIFO remaining comes from latest layers (Purchase first, then Opening remainder)
    const remFromPur = Math.min(remQ, purQ);
    const remFromOp = Math.max(0, remQ - remFromPur);
    const fifoEndingValue = remFromPur * purC + remFromOp * opC;

    const totalCostPool = opQ * opC + purQ * purC;
    const avgUnitCost = totalAvail > 0 ? totalCostPool / totalAvail : 0;
    const weightedAvgEndingValue = remQ * avgUnitCost;

    return {
      totalAvail,
      issQ,
      remQ,
      avgUnitCost,
      fifoEndingValue,
      weightedAvgEndingValue,
      exceeds: Math.round(parseSafeNumber(valIssuedQty)) > totalAvail,
    };
  }, [valOpeningQty, valOpeningCost, valPurchaseQty, valPurchaseCost, valIssuedQty]);

  const handleStockMovement = (kind: StockMovement['type'], e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.round(parseSafeNumber(actionQty));
    const prod = products.find((p) => p.id === targetProdId);
    if (!prod) return;

    if (kind === 'Stock Out' || kind === 'Transfer') {
      if (qty <= 0 || prod[targetWh] < qty) {
        setBanner(
          pick(
            `Insufficient units in selected warehouse for ${prod.name}.`,
            `${prod.name}-এর জন্য নির্বাচিত গুদামে পর্যাপ্ত ইউনিট নেই।`
          )
        );
        return;
      }
      if (kind === 'Transfer' && targetWh === destWh) {
        setBanner(pick('Choose a different destination warehouse.', 'অন্য একটি গন্তব্য গুদাম নির্বাচন করুন।'));
        return;
      }
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== prod.id) return p;
        if (kind === 'Stock In') return { ...p, [targetWh]: p[targetWh] + Math.max(1, qty) };
        if (kind === 'Stock Out') return { ...p, [targetWh]: Math.max(0, p[targetWh] - qty) };
        if (kind === 'Transfer') {
          return { ...p, [targetWh]: p[targetWh] - qty, [destWh]: p[destWh] + qty };
        }
        return { ...p, [targetWh]: Math.max(0, qty) };
      })
    );

    const log: StockMovement = {
      id: generateDemoId('mv'),
      date: getTodayISO(),
      sku: prod.sku,
      productName: prod.name,
      type: kind,
      qty: Math.max(0, qty),
      warehouseNote:
        kind === 'Adjustment'
          ? `${adjNote} (${targetWh})`
          : kind === 'Transfer'
          ? `${targetWh} → ${destWh}`
          : `${targetWh}`,
    };
    setMovements((prev) => [log, ...prev]);
    setBanner(
      pick(
        `Recorded ${kind} for ${prod.sku} (${qty} units).`,
        `${prod.sku}-এর জন্য ${movementTypeLabel(kind)} (${qty}টি ইউনিট) সংরক্ষণ করা হয়েছে।`
      )
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseSafeNumber(newCost);
    const qty = Math.max(0, Math.round(parseSafeNumber(newQty)));
    if (!newName.trim() || cost <= 0) {
      setBanner(pick('Enter valid product name and positive unit cost.', 'সঠিক পণ্যের নাম ও ধনাত্মক একক খরচ দিন।'));
      return;
    }
    const created: InvProduct = {
      id: generateDemoId('inv'),
      sku: newSku.trim() || generateDemoId('IN'),
      name: newName.trim(),
      category: newCat.trim() || 'General',
      unitCost: cost,
      reorderLevel: 10,
      centralWh: qty,
      chattogramWh: 0,
      dhakaWh: 0,
      batchNo: generateDemoId('B'),
      expiryDate: '2027-12-31',
    };
    setProducts((prev) => [created, ...prev]);
    setNewSku('');
    setNewName('');
    setNewCost('');
    setNewQty('');
    setBanner(pick(`Added SKU ${created.sku} to Central Warehouse.`, `কেন্দ্রীয় গুদামে SKU ${created.sku} যোগ করা হয়েছে।`));
  };

  const notifications: DemoNotification[] = [
    ...summary.outOfStock.map((p) => ({
      id: `oos-${p.id}`,
      title: pick(`Out of Stock: ${p.sku}`, `স্টক শেষ: ${p.sku}`),
      detail: pick(`${p.name} has 0 units across all warehouses.`, `সকল গুদামে ${p.name}-এর মজুত ০ ইউনিট।`),
      type: 'warning' as const,
    })),
    ...summary.lowStock.map((p) => ({
      id: `low-${p.id}`,
      title: pick(`Reorder Alert: ${p.sku}`, `রি-অর্ডার সতর্কতা: ${p.sku}`),
      detail: pick(`${p.name} is at or below reorder threshold.`, `${p.name} রি-অর্ডার সীমায় বা তার নিচে নেমে গেছে।`),
      type: 'warning' as const,
    })),
  ];

  const handlePrint = () => {
    triggerPrintableReport(
      pick('TecHisab Inventory Pro — Multi-Warehouse Stock Valuation', 'TecHisab ইনভেন্টরি প্রো — বহু-গুদাম স্টক মূল্যায়ন'),
      `<table style="width:100%; border-collapse: collapse; font-size:12px;">
        <tr><th style="text-align:left; padding:6px;">SKU</th><th style="text-align:left; padding:6px;">${pick('Product', 'পণ্য')}</th><th style="text-align:right; padding:6px;">${pick('Total Qty', 'মোট পরিমাণ')}</th><th style="text-align:right; padding:6px;">${pick('Inventory Value', 'ইনভেন্টরি মূল্য')}</th></tr>
        ${products
          .map((p) => {
            const q = p.centralWh + p.chattogramWh + p.dhakaWh;
            return `<tr><td style="padding:6px; border-bottom:1px solid #D7E2F3;">${p.sku}</td><td style="padding:6px; border-bottom:1px solid #D7E2F3;">${p.name}</td><td style="padding:6px; text-align:right; border-bottom:1px solid #D7E2F3;">${q}</td><td style="padding:6px; text-align:right; border-bottom:1px solid #D7E2F3;">${formatBDT(q * p.unitCost)}</td></tr>`;
          })
          .join('')}
      </table>`
    );
  };

  return (
    <DemoWorkspace
      productName="TecHisab Inventory Pro"
      productSubtitle={pick(
        'Multi-Warehouse Stock Control, Batch Expiry & Valuation Sandbox',
        'বহু-গুদাম স্টক নিয়ন্ত্রণ, ব্যাচ মেয়াদ এবং মূল্যায়ন স্যান্ডবক্স'
      )}
      modules={invModules}
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
            columns={4}
            metrics={[
              { id: 'iv-1', label: pick('Total Products', 'মোট পণ্য'), value: String(summary.totalProducts) },
              { id: 'iv-2', label: pick('Total Stock Qty', 'মোট স্টক পরিমাণ'), value: `${summary.totalQty} ${pick('units', 'ইউনিট')}`, tone: 'primary' },
              { id: 'iv-3', label: pick('Total Inventory Value', 'মোট ইনভেন্টরি মূল্য'), value: formatBDT(summary.totalValue), tone: 'positive' },
              { id: 'iv-4', label: pick('Low Stock Items', 'স্বল্প মজুত পণ্য'), value: String(summary.lowStockCount), tone: summary.lowStockCount > 0 ? 'warning' : 'positive' },
              { id: 'iv-5', label: pick('Out of Stock Items', 'স্টক শেষ পণ্য'), value: String(summary.outOfStockCount), tone: summary.outOfStockCount > 0 ? 'danger' : 'positive' },
              { id: 'iv-6', label: pick('Warehouse Count', 'গুদামের সংখ্যা'), value: String(summary.warehouseCount) },
              { id: 'iv-7', label: pick('Stock Movements', 'স্টক লেনদেন'), value: String(summary.movementCount), subtext: pick('Logged receipts & transfers', 'সংরক্ষিত গ্রহণ ও স্থানান্তর') },
            ]}
          />

          <FinancialBarChart
            title={pick('Warehouse Stock Allocation by SKU', 'SKU অনুযায়ী গুদামে স্টক বণ্টন')}
            data={products.map((p) => ({
              label: p.sku,
              value: p.centralWh + p.chattogramWh + p.dhakaWh,
              secondaryValue: p.reorderLevel,
            }))}
            primaryLabel={pick('Total Units', 'মোট ইউনিট')}
            secondaryLabel={pick('Reorder Level', 'রি-অর্ডার সীমা')}
            valueFormatter={(v) => `${v} ${pick('units', 'ইউনিট')}`}
          />
        </div>
      )}

      {(activeModule === 'products' || activeModule === 'categories' || activeModule === 'warehouses' || activeModule === 'reports') && (
        <div className="space-y-5">
          {activeModule === 'products' && (
            <form onSubmit={handleAddProduct} className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3">
              <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">{pick('Add Sample Inventory SKU', 'নমুনা ইনভেন্টরি SKU যোগ করুন')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                <input type="text" value={newSku} onChange={(e) => setNewSku(e.target.value)} placeholder="SKU" className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={pick('Item Name', 'পণ্যের নাম')} className="sm:col-span-2 px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
                <input type="number" min="1" value={newCost} onChange={(e) => setNewCost(e.target.value)} placeholder={pick('Unit Cost', 'একক খরচ')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
                <input type="number" min="0" value={newQty} onChange={(e) => setNewQty(e.target.value)} placeholder={pick('Initial Qty', 'প্রাথমিক পরিমাণ')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
              </div>
              <div className="flex justify-between items-center">
                <input type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder={pick('Category', 'ক্যাটাগরি')} className="w-44 px-3 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer">
                  {pick('Save SKU', 'SKU সংরক্ষণ')}
                </button>
              </div>
            </form>
          )}

          <InteractiveDataTable
            title={pick('Perpetual Multi-Warehouse Stock Ledger', 'অবিচ্ছিন্ন বহু-গুদাম স্টক লেজার')}
            rows={products}
            columns={[
              { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono font-bold text-[#0345A4] dark:text-sky-400">{r.sku}</span> },
              { key: 'name', header: pick('Product', 'পণ্য'), render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: 'cen', header: pick('Central', 'কেন্দ্রীয়'), align: 'right', render: (r) => r.centralWh },
              { key: 'ctg', header: pick('Chattogram', 'চট্টগ্রাম'), align: 'right', render: (r) => r.chattogramWh },
              { key: 'dhk', header: pick('Dhaka', 'ঢাকা'), align: 'right', render: (r) => r.dhakaWh },
              {
                key: 'tot',
                header: pick('Total Qty', 'মোট পরিমাণ'),
                align: 'right',
                render: (r) => {
                  const tot = r.centralWh + r.chattogramWh + r.dhakaWh;
                  return (
                    <span className={tot === 0 ? 'font-bold text-rose-600' : tot <= r.reorderLevel ? 'font-bold text-amber-600' : 'font-bold'}>
                      {tot} {tot === 0 ? pick('(Out)', '(শেষ)') : tot <= r.reorderLevel ? pick('(Low)', '(স্বল্প)') : ''}
                    </span>
                  );
                },
              },
              { key: 'val', header: pick('Value', 'মূল্য'), align: 'right', render: (r) => formatBDT((r.centralWh + r.chattogramWh + r.dhakaWh) * r.unitCost) },
            ]}
            getSearchText={(r) => `${r.sku} ${r.name} ${r.category}`}
          />
        </div>
      )}

      {(activeModule === 'stock-in' || activeModule === 'stock-out' || activeModule === 'transfers' || activeModule === 'adjustment') && (
        <div className="space-y-5">
          <form
            onSubmit={(e) =>
              handleStockMovement(
                activeModule === 'stock-in'
                  ? 'Stock In'
                  : activeModule === 'stock-out'
                  ? 'Stock Out'
                  : activeModule === 'transfers'
                  ? 'Transfer'
                  : 'Adjustment',
                e
              )
            }
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {activeModule === 'stock-in'
                ? pick('Record Stock In (Purchase Receipt)', 'স্টক ইন রেকর্ড করুন (ক্রয় রসিদ)')
                : activeModule === 'stock-out'
                ? pick('Record Stock Out (Dispatch)', 'স্টক আউট রেকর্ড করুন (ডিসপ্যাচ)')
                : activeModule === 'transfers'
                ? pick('Transfer Stock Between Warehouses', 'গুদামগুলোর মধ্যে স্টক স্থানান্তর')
                : pick('Stock Count Adjustment (Set Exact Warehouse Count)', 'স্টক গণনা সমন্বয় (সঠিক গুদাম সংখ্যা নির্ধারণ)')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <select value={targetProdId} onChange={(e) => setTargetProdId(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
                ))}
              </select>
              <select value={targetWh} onChange={(e) => setTargetWh(e.target.value as 'centralWh' | 'chattogramWh' | 'dhakaWh')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs">
                <option value="centralWh">{pick('Central Warehouse', 'কেন্দ্রীয় গুদাম')}</option>
                <option value="chattogramWh">{pick('Chattogram Godown', 'চট্টগ্রাম গোডাউন')}</option>
                <option value="dhakaWh">{pick('Dhaka Depot', 'ঢাকা ডিপো')}</option>
              </select>
              {activeModule === 'transfers' ? (
                <select value={destWh} onChange={(e) => setDestWh(e.target.value as 'centralWh' | 'chattogramWh' | 'dhakaWh')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs">
                  <option value="dhakaWh">{pick('To: Dhaka Depot', 'প্রতি: ঢাকা ডিপো')}</option>
                  <option value="chattogramWh">{pick('To: Chattogram Godown', 'প্রতি: চট্টগ্রাম গোডাউন')}</option>
                  <option value="centralWh">{pick('To: Central Warehouse', 'প্রতি: কেন্দ্রীয় গুদাম')}</option>
                </select>
              ) : (
                <input type="text" value={adjNote} onChange={(e) => setAdjNote(e.target.value)} placeholder={pick('Reason / Note', 'কারণ / নোট')} className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs" />
              )}
              <div className="flex gap-2">
                <input type="number" min="0" value={actionQty} onChange={(e) => setActionQty(e.target.value)} className="w-24 px-2.5 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono" />
                <button type="submit" className="flex-1 px-3 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer">
                  {pick('Apply', 'প্রয়োগ করুন')}
                </button>
              </div>
            </div>
          </form>

          <InteractiveDataTable
            title={pick('Stock Movement Audit Log', 'স্টক মুভমেন্ট অডিট লগ')}
            rows={movements}
            columns={[
              { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
              { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono font-bold text-[#0345A4]">{r.sku}</span> },
              { key: 'name', header: pick('Item', 'পণ্য'), render: (r) => r.productName },
              { key: 'type', header: pick('Movement', 'ধরন'), render: (r) => <span className="font-bold">{movementTypeLabel(r.type)}</span> },
              { key: 'qty', header: pick('Qty', 'পরিমাণ'), align: 'right', render: (r) => r.qty },
              { key: 'note', header: pick('Warehouse Details', 'গুদামের বিবরণ'), render: (r) => r.warehouseNote },
            ]}
            getSearchText={(r) => `${r.sku} ${r.productName} ${r.type} ${r.warehouseNote}`}
          />
        </div>
      )}

      {activeModule === 'valuation' && (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-5 space-y-4">
          <div className="px-3.5 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {pick(
                'Interactive Valuation Sandbox Disclaimer: FIFO & Weighted Average figures below are illustrative demo calculations only and do not represent verified statutory accounting or IAS 2 audit outputs.',
                'ইন্টারঅ্যাক্টিভ মূল্যায়ন স্যান্ডবক্স সতর্কবার্তা: নিচের FIFO এবং ওয়েটেড অ্যাভারেজ হিসাবগুলো শুধুমাত্র ডেমো প্রদর্শনের জন্য এবং এগুলো বিধিবদ্ধ অ্যাকাউন্টিং বা IAS 2 অডিট রিপোর্ট নয়।'
              )}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
            {pick('FIFO vs Weighted Average Ending Stock Valuation Comparison', 'FIFO বনাম ওয়েটেড অ্যাভারেজ সমাপনী স্টক মূল্যায়ন তুলনা')}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-[#5F6D82] block mb-1">{pick('Opening Qty', 'প্রারম্ভিক পরিমাণ')}</label>
              <input type="number" min="0" value={valOpeningQty} onChange={(e) => setValOpeningQty(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono" />
            </div>
            <div>
              <label className="text-[11px] text-[#5F6D82] block mb-1">{pick('Opening Unit Cost', 'প্রারম্ভিক একক মূল্য')}</label>
              <input type="number" min="0" value={valOpeningCost} onChange={(e) => setValOpeningCost(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono" />
            </div>
            <div>
              <label className="text-[11px] text-[#5F6D82] block mb-1">{pick('Purchase Qty', 'ক্রয় পরিমাণ')}</label>
              <input type="number" min="0" value={valPurchaseQty} onChange={(e) => setValPurchaseQty(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono" />
            </div>
            <div>
              <label className="text-[11px] text-[#5F6D82] block mb-1">{pick('Purchase Unit Cost', 'ক্রয় একক মূল্য')}</label>
              <input type="number" min="0" value={valPurchaseCost} onChange={(e) => setValPurchaseCost(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono" />
            </div>
            <div>
              <label className="text-[11px] text-[#5F6D82] block mb-1">{pick(`Issued Qty (Max ${valuationResult.totalAvail})`, `ইস্যুকৃত পরিমাণ (সর্বোচ্চ ${valuationResult.totalAvail})`)}</label>
              <input type="number" min="0" value={valIssuedQty} onChange={(e) => setValIssuedQty(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono" />
            </div>
          </div>

          {valuationResult.exceeds && (
            <div className="text-xs font-semibold text-rose-600">
              {pick(
                `Notice: Issued quantity capped at total available units (${valuationResult.totalAvail}).`,
                `বিজ্ঞপ্তি: ইস্যুকৃত পরিমাণ মোট উপলব্ধ ইউনিট (${valuationResult.totalAvail})-তে সীমিত রাখা হয়েছে।`
              )}
            </div>
          )}

          <DashboardCards
            columns={3}
            metrics={[
              { id: 'v-rem', label: pick('Remaining Quantity', 'অবশিষ্ট পরিমাণ'), value: `${valuationResult.remQ} ${pick('units', 'ইউনিট')}` },
              { id: 'v-fifo', label: pick('FIFO Ending Value', 'FIFO সমাপনী মূল্য'), value: formatBDT(Math.round(valuationResult.fifoEndingValue)), tone: 'primary' },
              { id: 'v-wavg', label: pick('Weighted Avg Value', 'ওয়েটেড গড় মূল্য'), value: formatBDT(Math.round(valuationResult.weightedAvgEndingValue)), subtext: `${pick('Avg Cost:', 'গড় ব্যয়:')} ${formatBDT(valuationResult.avgUnitCost, 2)}/${pick('unit', 'একক')}`, tone: 'positive' },
            ]}
          />
        </div>
      )}

      {(activeModule === 'batches' || activeModule === 'expiry') && (
        <InteractiveDataTable
          title={pick('Batch Lot & Expiry Date Status Monitor', 'ব্যাচ লট ও মেয়াদোত্তীর্ণ অবস্থা মনিটর')}
          rows={products}
          columns={[
            { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono font-bold">{r.sku}</span> },
            { key: 'name', header: pick('Product', 'পণ্য'), render: (r) => r.name },
            { key: 'batch', header: pick('Batch Lot #', 'ব্যাচ লট #'), render: (r) => <span className="font-mono font-semibold">{r.batchNo}</span> },
            { key: 'exp', header: pick('Expiry Date', 'মেয়াদ শেষ'), render: (r) => <span className="font-mono">{r.expiryDate}</span> },
            {
              key: 'st',
              header: pick('Expiry Status', 'মেয়াদের অবস্থা'),
              render: (r) => {
                const isExpired = r.expiryDate < todayStr;
                const diffDays = Math.ceil(
                  (new Date(r.expiryDate).getTime() - new Date(todayStr).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const nearExpiry = !isExpired && diffDays <= 90;
                return (
                  <span
                    className={`font-bold text-xs ${
                      isExpired ? 'text-rose-600' : nearExpiry ? 'text-amber-600' : 'text-emerald-700'
                    }`}
                  >
                    {isExpired
                      ? pick('Expired', 'মেয়াদোত্তীর্ণ')
                      : nearExpiry
                      ? pick(`Near Expiry (${diffDays}d)`, `শীঘ্রই মেয়াদ শেষ (${diffDays} দিন)`)
                      : pick('Valid Stock', 'বৈধ স্টক')}
                  </span>
                );
              },
            },
          ]}
          getSearchText={(r) => `${r.sku} ${r.name} ${r.batchNo}`}
        />
      )}
    </DemoWorkspace>
  );
};

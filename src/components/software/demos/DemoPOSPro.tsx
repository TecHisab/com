import React, { useState, useMemo } from 'react';
import {
  ScanBarcode,
  ShoppingCart,
  ReceiptText,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DemoWorkspace, DemoModuleTab } from '../workspace/DemoWorkspace';
import { formatBDT, generateDemoId, parseSafeNumber, triggerPrintableReport } from '../../../utils/demoFormatters';
import { useLanguage } from '../../../context/LanguageContext';

interface PosProps {
  onRequestOnboarding?: () => void;
}

interface PosItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface CartLine {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface CompletedPosReceipt {
  receiptNo: string;
  timestamp: string;
  items: CartLine[];
  subtotal: number;
  discount: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'Sample Mobile Wallet Selection';
  amountReceived: number;
  changeDue: number;
}

const INITIAL_CATALOG: PosItem[] = [
  { id: 'pos-1', sku: 'SKU-01', name: 'Basmati Rice 5kg', category: 'Grocery', price: 820, stock: 25 },
  { id: 'pos-2', sku: 'SKU-02', name: 'Fortified Soybean Oil 2L', category: 'Grocery', price: 365, stock: 30 },
  { id: 'pos-3', sku: 'SKU-03', name: 'Arabica Roast Coffee 200g', category: 'Beverages', price: 680, stock: 12 },
  { id: 'pos-4', sku: 'SKU-04', name: 'Organic Honey Jar 400g', category: 'Grocery', price: 540, stock: 14 },
  { id: 'pos-5', sku: 'SKU-05', name: 'Stainless Water Tumbler', category: 'Lifestyle', price: 790, stock: 9 },
  { id: 'pos-6', sku: 'SKU-06', name: 'USB-C Fast Wall Charger', category: 'Electronics', price: 1150, stock: 11 },
  { id: 'pos-7', sku: 'SKU-07', name: 'Herbal Green Tea Box', category: 'Beverages', price: 240, stock: 40 },
  { id: 'pos-8', sku: 'SKU-08', name: 'A4 Notebook Spiral Pack', category: 'Stationery', price: 320, stock: 18 },
];

const POS_MODULES: DemoModuleTab[] = [
  { id: 'terminal', label: 'Counter Terminal', icon: ScanBarcode },
  { id: 'shift-log', label: 'Shift Sales & Receipts', icon: ReceiptText },
];

export const DemoPOSPro: React.FC<PosProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();
  const [activeModule, setActiveModule] = useState('terminal');
  const [catalog, setCatalog] = useState<PosItem[]>(INITIAL_CATALOG);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartLine[]>([
    { productId: 'pos-1', name: 'Basmati Rice 5kg', price: 820, qty: 1 },
    { productId: 'pos-3', name: 'Arabica Roast Coffee 200g', price: 680, qty: 1 },
  ]);
  const [discountAmount, setDiscountAmount] = useState('50');
  const [vatRate, setVatRate] = useState('5');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Sample Mobile Wallet Selection'>('Cash');
  const [amountReceived, setAmountReceived] = useState('2000');
  const [receipts, setReceipts] = useState<CompletedPosReceipt[]>([]);
  const [latestReceipt, setLatestReceipt] = useState<CompletedPosReceipt | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const posModules: DemoModuleTab[] = [
    { id: 'terminal', label: pick('Counter Terminal', 'কাউন্টার টার্মিনাল'), icon: ScanBarcode },
    { id: 'shift-log', label: pick('Shift Sales & Receipts', 'শিফট বিক্রয় ও রসিদ'), icon: ReceiptText },
  ];

  const categoryLabel = (cat: string) => {
    if (cat === 'All') return pick('All', 'সব');
    if (cat === 'Grocery') return pick('Grocery', 'মুদি পণ্য');
    if (cat === 'Beverages') return pick('Beverages', 'পানীয়');
    if (cat === 'Lifestyle') return pick('Lifestyle', 'লাইফস্টাইল');
    if (cat === 'Electronics') return pick('Electronics', 'ইলেকট্রনিক্স');
    if (cat === 'Stationery') return pick('Stationery', 'স্টেশনারি');
    return cat;
  };

  const paymentMethodLabel = (m: CompletedPosReceipt['paymentMethod']) =>
    m === 'Cash' ? pick('Cash', 'নগদ') : pick('Sample Mobile Wallet Selection', 'নমুনা মোবাইল ওয়ালেট');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(catalog.map((c) => c.category)))],
    [catalog]
  );

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalog.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (q && !item.name.toLowerCase().includes(q) && !item.sku.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [catalog, categoryFilter, searchQuery]);

  const subtotal = cart.reduce((sum, l) => sum + l.price * l.qty, 0);
  const parsedDiscount = Math.min(subtotal, Math.max(0, parseSafeNumber(discountAmount)));
  const taxableAmount = Math.max(0, subtotal - parsedDiscount);
  const parsedVatRate = Math.min(25, Math.max(0, parseSafeNumber(vatRate)));
  const vatAmount = Math.round(taxableAmount * (parsedVatRate / 100));
  const grandTotal = taxableAmount + vatAmount;
  const parsedReceived = Math.max(0, parseSafeNumber(amountReceived));
  const changeDue = Math.max(0, parsedReceived - grandTotal);

  const addToCart = (item: PosItem) => {
    const existing = cart.find((c) => c.productId === item.id);
    const currentQty = existing ? existing.qty : 0;
    if (currentQty + 1 > item.stock) {
      setBanner(
        pick(
          `Cannot exceed available demo stock (${item.stock}) for ${item.name}.`,
          `${item.name}-এর উপলব্ধ ডেমো স্টক (${item.stock}) অতিক্রম করা যাবে না।`
        )
      );
      return;
    }
    if (existing) {
      setCart((prev) =>
        prev.map((c) => (c.productId === item.id ? { ...c, qty: c.qty + 1 } : c))
      );
    } else {
      setCart((prev) => [...prev, { productId: item.id, name: item.name, price: item.price, qty: 1 }]);
    }
  };

  const updateCartQty = (productId: string, delta: number) => {
    const itemStock = catalog.find((p) => p.id === productId)?.stock ?? 0;
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.productId !== productId) return c;
          const next = c.qty + delta;
          if (next > itemStock) {
            setBanner(pick(`Stock limit reached (${itemStock} units available).`, `স্টক সীমা পূর্ণ (${itemStock}টি ইউনিট মজুত আছে)।`));
            return c;
          }
          return { ...c, qty: next };
        })
        .filter((c) => c.qty > 0)
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setBanner(pick('Add at least one item to the POS cart before completing checkout.', 'চেকআউট সম্পন্ন করার আগে POS কার্টে অন্তত একটি পণ্য যোগ করুন।'));
      return;
    }
    if (paymentMethod === 'Cash' && parsedReceived < grandTotal) {
      setBanner(
        pick(
          `Cash received (${formatBDT(parsedReceived)}) is less than Grand Total (${formatBDT(grandTotal)}).`,
          `গৃহীত নগদ (${formatBDT(parsedReceived)}) সর্বমোট বিল (${formatBDT(grandTotal)}) অপেক্ষা কম।`
        )
      );
      return;
    }

    const receipt: CompletedPosReceipt = {
      receiptNo: generateDemoId('RCP'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal,
      discount: parsedDiscount,
      vatRate: parsedVatRate,
      vatAmount,
      grandTotal,
      paymentMethod,
      amountReceived: paymentMethod === 'Cash' ? parsedReceived : grandTotal,
      changeDue: paymentMethod === 'Cash' ? changeDue : 0,
    };

    // Deduct stock immediately
    setCatalog((prev) =>
      prev.map((item) => {
        const line = cart.find((c) => c.productId === item.id);
        return line ? { ...item, stock: Math.max(0, item.stock - line.qty) } : item;
      })
    );
    setReceipts((prev) => [receipt, ...prev]);
    setLatestReceipt(receipt);
    setCart([]);
    setDiscountAmount('0');
    setBanner(
      pick(
        `Simulated checkout complete (${receipt.receiptNo}) — stock deducted automatically.`,
        `নমুনা চেকআউট সম্পন্ন (${receipt.receiptNo}) — স্টক স্বয়ংক্রিয়ভাবে বাদ দেওয়া হয়েছে।`
      )
    );
  };

  const handlePrintReceipt = (rcp: CompletedPosReceipt) => {
    triggerPrintableReport(
      `${pick('TecHisab POS Pro — Sample Thermal Receipt', 'TecHisab POS Pro — নমুনা থার্মাল রসিদ')} (${rcp.receiptNo})`,
      `
      <div style="max-width:340px; margin:0 auto; border:1px dashed #5F6D82; padding:16px; font-family: monospace; font-size:12px;">
        <div style="text-align:center; font-weight:800; font-size:15px;">TECHISAB POS PRO (${pick('DEMO', 'ডেমো')})</div>
        <div style="text-align:center; font-size:11px; margin-bottom:10px;">${pick('Receipt', 'রসিদ')}: ${rcp.receiptNo} | ${pick('Time', 'সময়')}: ${rcp.timestamp}</div>
        <hr/>
        ${rcp.items
          .map(
            (i) =>
              `<div style="display:flex; justify-content:space-between; margin:4px 0;"><span>${i.name} x${i.qty}</span><span>${formatBDT(i.price * i.qty)}</span></div>`
          )
          .join('')}
        <hr/>
        <div style="display:flex; justify-content:space-between;"><span>${pick('Subtotal', 'সাবটোটাল')}</span><span>${formatBDT(rcp.subtotal)}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>${pick('Discount', 'ডিসকাউন্ট')}</span><span>-${formatBDT(rcp.discount)}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>${pick('VAT', 'ভ্যাট')} (${rcp.vatRate}%)</span><span>${formatBDT(rcp.vatAmount)}</span></div>
        <div style="display:flex; justify-content:space-between; font-weight:800; font-size:14px; margin-top:4px;"><span>${pick('GRAND TOTAL', 'সর্বমোট')}</span><span>${formatBDT(rcp.grandTotal)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-top:6px;"><span>${pick('Tender', 'পেমেন্ট')} (${paymentMethodLabel(rcp.paymentMethod)})</span><span>${formatBDT(rcp.amountReceived)}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>${pick('Change Due', 'ফেরত')}</span><span>${formatBDT(rcp.changeDue)}</span></div>
      </div>`
    );
  };

  const handleResetDemo = () => {
    setCatalog(INITIAL_CATALOG);
    setCart([{ productId: 'pos-1', name: 'Basmati Rice 5kg', price: 820, qty: 1 }]);
    setReceipts([]);
    setLatestReceipt(null);
    setDiscountAmount('50');
    setAmountReceived('2000');
    setBanner(pick('POS Pro counter catalog and shift register reset to defaults.', 'POS Pro কাউন্টার ক্যাটালগ ও শিফট রেজিস্টার ডিফল্ট অবস্থায় রিসেট হয়েছে।'));
  };

  return (
    <DemoWorkspace
      productName="TecHisab POS Pro"
      productSubtitle={pick(
        'High-Speed Retail Checkout Terminal & Simulated Thermal Receipt Generator',
        'উচ্চ-গতির রিটেইল চেকআউট টার্মিনাল ও নমুনা থার্মাল রসিদ জেনারেটর'
      )}
      modules={posModules}
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      onResetDemo={handleResetDemo}
      onPrintReport={latestReceipt ? () => handlePrintReceipt(latestReceipt) : undefined}
      onRequestOnboarding={onRequestOnboarding}
      bannerMessage={banner}
      onClearBanner={() => setBanner(null)}
    >
      <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>
          {pick(
            'Simulated POS Checkout Environment — No real payment gateway or live mobile wallet API is connected.',
            'সিমুলেটেড POS চেকআউট পরিবেশ — কোনো আসল পেমেন্ট গেটওয়ে বা লাইভ মোবাইল ওয়ালেট API সংযুক্ত নয়।'
          )}
        </span>
      </div>

      {activeModule === 'terminal' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Left Panel: Search, Category Filters & Product Grid */}
          <div className="xl:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#5F6D82] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={pick('Search item name or SKU barcode...', 'পণ্যের নাম বা SKU বারকোড খুঁজুন...')}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 text-xs"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      categoryFilter === cat
                        ? 'bg-[#0345A4] text-white'
                        : 'bg-white dark:bg-slate-900 text-[#5F6D82] border border-[#D7E2F3] dark:border-slate-700'
                    }`}
                  >
                    {categoryLabel(cat)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCatalog.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.stock === 0}
                  onClick={() => addToCart(item)}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4] text-left flex items-center justify-between gap-3 transition-all cursor-pointer disabled:opacity-50"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-[#5F6D82]">
                      {item.sku} &middot; {categoryLabel(item.category)}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#0B1730] dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {pick('Stock:', 'মজুত:')} {item.stock} {pick('units', 'ইউনিট')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold font-mono tabular-nums text-[#0345A4] dark:text-sky-400">
                      {formatBDT(item.price)}
                    </div>
                    <span className="text-[10px] font-bold text-[#0A63D8]">{pick('+ Add', '+ যোগ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Interactive Cart & Checkout */}
          <div className="xl:col-span-5 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D7E2F3] dark:border-slate-800 pb-2.5">
              <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#0345A4]" />
                <span>{pick('Active Checkout Cart', 'সক্রিয় চেকআউট কার্ট')} ({cart.reduce((s, c) => s + c.qty, 0)})</span>
              </h4>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  {pick('Clear Cart', 'কার্ট খালি করুন')}
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5F6D82]">
                {pick('Select items on the left to add them to the POS checkout cart.', 'POS চেকআউট কার্টে যোগ করতে বাম দিক থেকে পণ্য নির্বাচন করুন।')}
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cart.map((line) => (
                  <div
                    key={line.productId}
                    className="p-2.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800/70 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold truncate">{line.name}</div>
                      <div className="text-[11px] text-[#5F6D82] font-mono">
                        {formatBDT(line.price)} × {line.qty} = {formatBDT(line.price * line.qty)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateCartQty(line.productId, -1)}
                        className="p-1.5 rounded bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono font-bold">{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(line.productId, 1)}
                        className="p-1.5 rounded bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCart((prev) => prev.filter((c) => c.productId !== line.productId))
                        }
                        className="p-1.5 text-rose-600 cursor-pointer"
                        title={pick('Remove line', 'আইটেম সরান')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 text-xs pt-2 border-t border-[#D7E2F3] dark:border-slate-800">
              <div>
                <label className="text-[11px] font-semibold text-[#5F6D82] block mb-1">
                  {pick('Discount (BDT)', 'ডিসকাউন্ট (BDT)')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#5F6D82] block mb-1">
                  {pick('VAT Rate (%)', 'ভ্যাট হার (%)')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/60 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5F6D82]">{pick('Subtotal', 'সাবটোটাল')}</span>
                <span className="font-mono tabular-nums">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6D82]">{pick('Discount', 'ডিসকাউন্ট')}</span>
                <span className="font-mono tabular-nums">-{formatBDT(parsedDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6D82]">{pick('VAT', 'ভ্যাট')} ({parsedVatRate}%)</span>
                <span className="font-mono tabular-nums">{formatBDT(vatAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#0345A4] dark:text-sky-400 pt-1.5 border-t border-[#D7E2F3] dark:border-slate-700">
                <span>{pick('Grand Total', 'সর্বমোট')}</span>
                <span className="font-mono tabular-nums">{formatBDT(grandTotal)}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                {(['Cash', 'Sample Mobile Wallet Selection'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-2.5 rounded-lg font-bold border cursor-pointer text-[11px] ${
                      paymentMethod === method
                        ? 'bg-[#0345A4] text-white border-[#0345A4]'
                        : 'bg-white dark:bg-slate-800 text-[#0B1730] dark:text-slate-300 border-[#D7E2F3] dark:border-slate-700'
                    }`}
                  >
                    {paymentMethodLabel(method)}
                  </button>
                ))}
              </div>

              {paymentMethod === 'Cash' && (
                <div className="grid grid-cols-2 gap-2.5 items-center">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5F6D82] block mb-1">
                      {pick('Amount Received', 'গৃহীত পরিমাণ')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 font-mono font-bold"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#5F6D82] block">{pick('Change Due', 'ফেরত প্রাপ্য')}</span>
                    <span className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                      {formatBDT(changeDue)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{pick('Complete Simulated Checkout', 'নমুনা চেকআউট সম্পন্ন করুন')}</span>
              </button>
            </div>

            {latestReceipt && (
              <div className="p-3.5 rounded-xl border border-dashed border-[#0345A4]/60 bg-[#F4F8FF]/70 dark:bg-slate-950/60 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between font-bold text-[#0345A4] dark:text-sky-400">
                  <span>{pick('Receipt:', 'রসিদ:')} {latestReceipt.receiptNo}</span>
                  <button
                    type="button"
                    onClick={() => handlePrintReceipt(latestReceipt)}
                    className="inline-flex items-center gap-1 underline cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{pick('Print Sample Receipt', 'নমুনা রসিদ প্রিন্ট')}</span>
                  </button>
                </div>
                <div className="text-[11px] text-[#5F6D82]">
                  {pick('Paid', 'পরিশোধিত')} {formatBDT(latestReceipt.amountReceived)} ({paymentMethodLabel(latestReceipt.paymentMethod)}) &middot; {pick('Change:', 'ফেরত:')} {formatBDT(latestReceipt.changeDue)}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-[#D7E2F3] dark:border-slate-800">
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {pick('Simulated Shift Receipts', 'নমুনা শিফট রসিদসমূহ')} ({receipts.length})
            </h4>
          </div>
          {receipts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5F6D82]">
              {pick(
                'No completed checkouts in this session yet. Complete a transaction in Counter Terminal.',
                'এই সেশনে এখনো কোনো চেকআউট সম্পন্ন হয়নি। কাউন্টার টার্মিনালে একটি লেনদেন সম্পন্ন করুন।'
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#D7E2F3]/70 dark:divide-slate-800">
              {receipts.map((rcp) => (
                <div key={rcp.receiptNo} className="px-4 py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#0345A4] mr-2">{rcp.receiptNo}</span>
                    <span className="text-[#5F6D82]">{rcp.timestamp} &middot; {rcp.items.length} {pick('line items', 'আইটেম')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">{formatBDT(rcp.grandTotal)}</span>
                    <button
                      type="button"
                      onClick={() => handlePrintReceipt(rcp)}
                      className="text-[#0345A4] font-bold hover:underline cursor-pointer"
                    >
                      {pick('Print', 'প্রিন্ট')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DemoWorkspace>
  );
};

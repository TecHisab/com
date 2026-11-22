import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Users,
  Truck,
  Tag,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  MapPin,
  FileBarChart,
} from 'lucide-react';
import { DemoWorkspace, DemoModuleTab } from '../workspace/DemoWorkspace';
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

interface TradeProps {
  onRequestOnboarding?: () => void;
}

interface TradeOrder {
  id: string;
  date: string;
  ref: string;
  kind: 'Sales Order' | 'Purchase Order';
  partyId: string;
  partyName: string;
  itemName: string;
  qty: number;
  unitPrice: number;
  discountPct: number;
  netTotal: number;
  paidAmount: number;
  isCredit: boolean;
  deliveryStatus: 'Delivered' | 'In Transit' | 'Pending Dispatch';
}

interface TradeParty {
  id: string;
  name: string;
  kind: 'Customer' | 'Supplier';
  tier: 'Wholesale A' | 'Wholesale B' | 'Distributor';
  creditLimit: number;
}

interface TradeProduct {
  id: string;
  sku: string;
  name: string;
  wholesaleTierA: number;
  wholesaleTierB: number;
  costPrice: number;
  stockQty: number;
}

const INITIAL_PARTIES: TradeParty[] = [
  { id: 'tp-c1', name: 'Karnaphuli Hardware Syndicate', kind: 'Customer', tier: 'Wholesale A', creditLimit: 350000 },
  { id: 'tp-c2', name: 'Cumilla Agro Traders', kind: 'Customer', tier: 'Wholesale B', creditLimit: 200000 },
  { id: 'tp-s1', name: 'Meghna Bulk Imports', kind: 'Supplier', tier: 'Distributor', creditLimit: 500000 },
  { id: 'tp-s2', name: 'Dhaka Packaging Mills', kind: 'Supplier', tier: 'Distributor', creditLimit: 250000 },
];

const INITIAL_TRADE_PRODUCTS: TradeProduct[] = [
  { id: 'tprod-1', sku: 'TR-501', name: 'Industrial PVC Pipe Bundle (20pcs)', wholesaleTierA: 6400, wholesaleTierB: 6750, costPrice: 5100, stockQty: 45 },
  { id: 'tprod-2', sku: 'TR-502', name: 'Galvanized Steel Wire Coil 25kg', wholesaleTierA: 3900, wholesaleTierB: 4100, costPrice: 3150, stockQty: 62 },
  { id: 'tprod-3', sku: 'TR-503', name: 'Commercial LED Floodlight Box (10pcs)', wholesaleTierA: 8800, wholesaleTierB: 9200, costPrice: 6900, stockQty: 24 },
];

const INITIAL_TRADE_ORDERS: TradeOrder[] = [
  { id: 'to-1', date: '2026-04-02', ref: 'TSO-401', kind: 'Sales Order', partyId: 'tp-c1', partyName: 'Karnaphuli Hardware Syndicate', itemName: 'Industrial PVC Pipe Bundle (20pcs)', qty: 20, unitPrice: 6400, discountPct: 2, netTotal: 125440, paidAmount: 75440, isCredit: true, deliveryStatus: 'Delivered' },
  { id: 'to-2', date: '2026-04-05', ref: 'TSO-402', kind: 'Sales Order', partyId: 'tp-c2', partyName: 'Cumilla Agro Traders', itemName: 'Galvanized Steel Wire Coil 25kg', qty: 18, unitPrice: 4100, discountPct: 0, netTotal: 73800, paidAmount: 30000, isCredit: true, deliveryStatus: 'In Transit' },
  { id: 'to-3', date: '2026-04-06', ref: 'TPO-801', kind: 'Purchase Order', partyId: 'tp-s1', partyName: 'Meghna Bulk Imports', itemName: 'Industrial PVC Pipe Bundle (20pcs)', qty: 25, unitPrice: 5100, discountPct: 0, netTotal: 127500, paidAmount: 80000, isCredit: true, deliveryStatus: 'Delivered' },
];

const TRADE_MODULES: DemoModuleTab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
  { id: 'sales-orders', label: 'Sales Orders', icon: TrendingUp },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'pricing', label: 'Product Pricing', icon: Tag },
  { id: 'credit-sales', label: 'Credit Sales', icon: CreditCard },
  { id: 'receivables', label: 'Receivables', icon: ArrowDownLeft },
  { id: 'payables', label: 'Payables', icon: ArrowUpRight },
  { id: 'stock', label: 'Stock', icon: Boxes },
  { id: 'deliveries', label: 'Delivery Records', icon: MapPin },
  { id: 'reports', label: 'Trading Reports', icon: FileBarChart },
];

export const DemoTradeManager: React.FC<TradeProps> = ({ onRequestOnboarding }) => {
  const { pick } = useLanguage();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [parties] = useState<TradeParty[]>(INITIAL_PARTIES);
  const [products, setProducts] = useState<TradeProduct[]>(INITIAL_TRADE_PRODUCTS);
  const [orders, setOrders] = useState<TradeOrder[]>(INITIAL_TRADE_ORDERS);
  const [banner, setBanner] = useState<string | null>(null);

  const tradeModules: DemoModuleTab[] = [
    { id: 'dashboard', label: pick('Dashboard', 'ড্যাশবোর্ড'), icon: LayoutDashboard },
    { id: 'purchase-orders', label: pick('Purchase Orders', 'পারচেজ অর্ডার'), icon: ShoppingCart },
    { id: 'sales-orders', label: pick('Sales Orders', 'সেলস অর্ডার'), icon: TrendingUp },
    { id: 'customers', label: pick('Customers', 'গ্রাহকগণ'), icon: Users },
    { id: 'suppliers', label: pick('Suppliers', 'সরবরাহকারীগণ'), icon: Truck },
    { id: 'pricing', label: pick('Product Pricing', 'পণ্যের মূল্য নির্ধারণ'), icon: Tag },
    { id: 'credit-sales', label: pick('Credit Sales', 'বাকিতে বিক্রয়'), icon: CreditCard },
    { id: 'receivables', label: pick('Receivables', 'প্রাপ্য হিসাব'), icon: ArrowDownLeft },
    { id: 'payables', label: pick('Payables', 'প্রদেয় হিসাব'), icon: ArrowUpRight },
    { id: 'stock', label: pick('Stock', 'স্টক'), icon: Boxes },
    { id: 'deliveries', label: pick('Delivery Records', 'ডেলিভারি রেকর্ড'), icon: MapPin },
    { id: 'reports', label: pick('Trading Reports', 'ট্রেডিং রিপোর্ট'), icon: FileBarChart },
  ];

  const orderKindLabel = (k: TradeOrder['kind']) =>
    k === 'Sales Order' ? pick('Sales Order', 'সেলস অর্ডার') : pick('Purchase Order', 'পারচেজ অর্ডার');

  const deliveryStatusLabel = (s: TradeOrder['deliveryStatus']) => {
    if (s === 'Delivered') return pick('Delivered', 'ডেলিভারি সম্পন্ন');
    if (s === 'In Transit') return pick('In Transit', 'পথে আছে');
    return pick('Pending Dispatch', 'পাঠানোর অপেক্ষায়');
  };

  // New Order Form
  const [orderPartyId, setOrderPartyId] = useState('tp-c1');
  const [orderProdId, setOrderProdId] = useState('tprod-1');
  const [orderQty, setOrderQty] = useState('5');
  const [orderDiscountPct, setOrderDiscountPct] = useState('2');
  const [orderPaid, setOrderPaid] = useState('10000');

  const handleResetDemo = () => {
    setProducts(INITIAL_TRADE_PRODUCTS);
    setOrders(INITIAL_TRADE_ORDERS);
    setBanner(pick('TecHisab Trade Manager sample wholesale data restored.', 'TecHisab ট্রেড ম্যানেজার নমুনা পাইকারি ডেটা ফিরিয়ে আনা হয়েছে।'));
  };

  const tradeStats = useMemo(() => {
    const salesOrders = orders.filter((o) => o.kind === 'Sales Order');
    const purchaseOrders = orders.filter((o) => o.kind === 'Purchase Order');
    const totalSales = salesOrders.reduce((s, o) => s + o.netTotal, 0);
    const totalPurchases = purchaseOrders.reduce((s, o) => s + o.netTotal, 0);
    const totalCogs = salesOrders.reduce((s, o) => {
      const p = products.find((item) => item.name === o.itemName);
      return s + (p ? p.costPrice * o.qty : Math.round(o.netTotal * 0.78));
    }, 0);
    const grossProfit = totalSales - totalCogs;
    const outstandingReceivables = salesOrders.reduce((s, o) => s + Math.max(0, o.netTotal - o.paidAmount), 0);
    const outstandingPayables = purchaseOrders.reduce((s, o) => s + Math.max(0, o.netTotal - o.paidAmount), 0);
    const stockValue = products.reduce((s, p) => s + p.costPrice * p.stockQty, 0);

    return {
      totalSales,
      totalPurchases,
      grossProfit,
      outstandingReceivables,
      outstandingPayables,
      stockValue,
    };
  }, [orders, products]);

  const handleCreateTradeOrder = (kind: 'Sales Order' | 'Purchase Order', e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.max(1, Math.round(parseSafeNumber(orderQty)));
    const discPct = Math.min(25, Math.max(0, parseSafeNumber(orderDiscountPct)));
    const prod = products.find((p) => p.id === orderProdId);
    const availableParties = parties.filter((p) =>
      p.kind === (kind === 'Sales Order' ? 'Customer' : 'Supplier')
    );
    const party = availableParties.find((p) => p.id === orderPartyId) || availableParties[0];
    if (!prod || !party) return;

    if (kind === 'Sales Order' && prod.stockQty < qty) {
      setBanner(
        pick(
          `Insufficient stock for ${prod.name} (Available: ${prod.stockQty}).`,
          `${prod.name}-এর পর্যাপ্ত স্টক নেই (মজুত আছে: ${prod.stockQty})।`
        )
      );
      return;
    }

    const unitPrice =
      kind === 'Sales Order'
        ? party.tier === 'Wholesale A'
          ? prod.wholesaleTierA
          : prod.wholesaleTierB
        : prod.costPrice;
    const gross = unitPrice * qty;
    const netTotal = Math.round(gross * (1 - discPct / 100));
    const paidAmount = Math.min(netTotal, Math.max(0, parseSafeNumber(orderPaid)));

    const newOrder: TradeOrder = {
      id: generateDemoId('to'),
      date: getTodayISO(),
      ref: generateDemoId(kind === 'Sales Order' ? 'TSO' : 'TPO'),
      kind,
      partyId: party.id,
      partyName: party.name,
      itemName: prod.name,
      qty,
      unitPrice,
      discountPct: discPct,
      netTotal,
      paidAmount,
      isCredit: paidAmount < netTotal,
      deliveryStatus: kind === 'Sales Order' ? 'Pending Dispatch' : 'Delivered',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setProducts((prev) =>
      prev.map((item) =>
        item.id === prod.id
          ? {
              ...item,
              stockQty: kind === 'Sales Order' ? item.stockQty - qty : item.stockQty + qty,
            }
          : item
      )
    );
    setBanner(
      pick(
        `Created ${kind} ${newOrder.ref} (${formatBDT(netTotal)}) — party balances & stock updated.`,
        `${orderKindLabel(kind)} ${newOrder.ref} (${formatBDT(netTotal)}) তৈরি হয়েছে — পার্টি ব্যালেন্স ও স্টক আপডেট হয়েছে।`
      )
    );
  };

  const handleSettleOrderBalance = (orderId: string, paySlice = 20000) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const nextPaid = Math.min(o.netTotal, o.paidAmount + paySlice);
        return { ...o, paidAmount: nextPaid, isCredit: nextPaid < o.netTotal };
      })
    );
    setBanner(pick('Recorded payment collection / settlement against invoice balance.', 'ইনভয়েস বকেয়ার বিপরীতে পেমেন্ট সংগ্রহ / সমন্বয় সংরক্ষিত হয়েছে।'));
  };

  const handleUpdateTierPrice = (prodId: string, newTierAPrice: number) => {
    if (newTierAPrice <= 0) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, wholesaleTierA: newTierAPrice } : p))
    );
    setBanner(pick('Updated wholesale tier price.', 'পাইকারি টায়ার মূল্য আপডেট করা হয়েছে।'));
  };

  const handlePrint = () => {
    triggerPrintableReport(
      pick('TecHisab Trade Manager — Wholesale Trading & Credit Summary', 'TecHisab ট্রেড ম্যানেজার — পাইকারি ব্যবসা ও ক্রেডিট সারসংক্ষেপ'),
      `<table style="width:100%; border-collapse: collapse; font-size:13px;">
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Total Sales', 'মোট বিক্রয়')}</td><td style="padding:8px; text-align:right; font-weight:700;">${formatBDT(tradeStats.totalSales)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Total Purchases', 'মোট ক্রয়')}</td><td style="padding:8px; text-align:right;">${formatBDT(tradeStats.totalPurchases)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Trading Gross Profit', 'ট্রেডিং মোট মুনাফা')}</td><td style="padding:8px; text-align:right; font-weight:700;">${formatBDT(tradeStats.grossProfit)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Outstanding Receivables', 'বকেয়া প্রাপ্য')}</td><td style="padding:8px; text-align:right;">${formatBDT(tradeStats.outstandingReceivables)}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #D7E2F3;">${pick('Outstanding Payables', 'বকেয়া প্রদেয়')}</td><td style="padding:8px; text-align:right;">${formatBDT(tradeStats.outstandingPayables)}</td></tr>
      </table>`
    );
  };

  return (
    <DemoWorkspace
      productName="TecHisab Trade Manager"
      productSubtitle={pick(
        'Wholesale Distribution, Tier Pricing, Credit Sales & Party Collections',
        'পাইকারি বিতরণ, টায়ার প্রাইসিং, ক্রেডিট বিক্রয় এবং পার্টি কালেকশন'
      )}
      modules={tradeModules}
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
              { id: 'tr-1', label: pick('Total Purchases', 'মোট ক্রয়'), value: formatBDT(tradeStats.totalPurchases) },
              { id: 'tr-2', label: pick('Total Sales', 'মোট বিক্রয়'), value: formatBDT(tradeStats.totalSales), tone: 'primary' },
              { id: 'tr-3', label: pick('Gross Profit', 'মোট মুনাফা'), value: formatBDT(tradeStats.grossProfit), tone: 'positive' },
              { id: 'tr-4', label: pick('Stock Value', 'মজুত মূল্য'), value: formatBDT(tradeStats.stockValue) },
              { id: 'tr-5', label: pick('Outstanding Receivables', 'বকেয়া প্রাপ্য'), value: formatBDT(tradeStats.outstandingReceivables), tone: 'warning' },
              { id: 'tr-6', label: pick('Outstanding Payables', 'বকেয়া প্রদেয়'), value: formatBDT(tradeStats.outstandingPayables) },
              { id: 'tr-7', label: pick('Credit Customers', 'ক্রেডিট গ্রাহক'), value: String(parties.filter((p) => p.kind === 'Customer').length) },
              { id: 'tr-8', label: pick('Suppliers Active', 'সক্রিয় সরবরাহকারী'), value: String(parties.filter((p) => p.kind === 'Supplier').length) },
            ]}
          />

          <FinancialBarChart
            title={pick('Trading Cashflow & Outstanding Party Balances', 'ট্রেডিং ক্যাশফ্লো ও বকেয়া পার্টি ব্যালেন্স')}
            data={[
              { label: pick('Sales Orders', 'সেলস অর্ডার'), value: tradeStats.totalSales, secondaryValue: tradeStats.outstandingReceivables },
              { label: pick('Purchase Orders', 'পারচেজ অর্ডার'), value: tradeStats.totalPurchases, secondaryValue: tradeStats.outstandingPayables },
              { label: pick('Gross Profit', 'মোট মুনাফা'), value: Math.max(0, tradeStats.grossProfit) },
              { label: pick('Stock Held', 'মজুতকৃত স্টক'), value: tradeStats.stockValue },
            ]}
            primaryLabel={pick('Total Volume', 'মোট পরিমাণ')}
            secondaryLabel={pick('Unpaid Balance', 'অপরিশোধিত ব্যালেন্স')}
          />
        </div>
      )}

      {(activeModule === 'sales-orders' || activeModule === 'purchase-orders' || activeModule === 'credit-sales') && (
        <div className="space-y-5">
          <form
            onSubmit={(e) =>
              handleCreateTradeOrder(
                activeModule === 'purchase-orders' ? 'Purchase Order' : 'Sales Order',
                e
              )
            }
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {activeModule === 'purchase-orders'
                ? pick('Create Wholesale Purchase Order', 'পাইকারি পারচেজ অর্ডার তৈরি করুন')
                : pick('Create Wholesale Sales Order (Credit Eligible)', 'পাইকারি সেলস অর্ডার তৈরি করুন (বাকিতে যোগ্য)')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              <select
                value={orderPartyId}
                onChange={(e) => setOrderPartyId(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              >
                {parties
                  .filter((p) =>
                    p.kind === (activeModule === 'purchase-orders' ? 'Supplier' : 'Customer')
                  )
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.tier})
                    </option>
                  ))}
              </select>
              <select
                value={orderProdId}
                onChange={(e) => setOrderProdId(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.stockQty} {pick('left', 'বাকি')})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={orderQty}
                onChange={(e) => setOrderQty(e.target.value)}
                placeholder={pick('Qty', 'পরিমাণ')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
              <input
                type="number"
                min="0"
                max="25"
                value={orderDiscountPct}
                onChange={(e) => setOrderDiscountPct(e.target.value)}
                placeholder={pick('Disc %', 'ছাড় %')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
              <input
                type="number"
                min="0"
                value={orderPaid}
                onChange={(e) => setOrderPaid(e.target.value)}
                placeholder={pick('Initial Paid (BDT)', 'প্রাথমিক পরিশোধ (BDT)')}
                className="px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
            >
              {activeModule === 'purchase-orders'
                ? pick('Submit Purchase Order', 'পারচেজ অর্ডার জমা দিন')
                : pick('Submit Sales Order', 'সেলস অর্ডার জমা দিন')}
            </button>
          </form>

          <InteractiveDataTable
            title={pick('Trading Orders Ledger', 'ট্রেডিং অর্ডার লেজার')}
            rows={orders.filter((o) =>
              activeModule === 'purchase-orders'
                ? o.kind === 'Purchase Order'
                : activeModule === 'credit-sales'
                ? o.kind === 'Sales Order' && o.isCredit
                : o.kind === 'Sales Order'
            )}
            columns={[
              { key: 'ref', header: pick('Ref #', 'রেফারেন্স #'), render: (r) => <span className="font-mono font-bold text-[#0345A4]">{r.ref}</span> },
              { key: 'party', header: pick('Party', 'পার্টি'), render: (r) => <span className="font-semibold">{r.partyName}</span> },
              { key: 'item', header: pick('Item (Qty)', 'পণ্য (পরিমাণ)'), render: (r) => `${r.itemName} (×${r.qty})` },
              { key: 'net', header: pick('Net Total', 'নিট মোট'), align: 'right', render: (r) => formatBDT(r.netTotal) },
              { key: 'due', header: pick('Due Balance', 'বকেয়া ব্যালেন্স'), align: 'right', render: (r) => <span className="font-bold text-amber-700">{formatBDT(Math.max(0, r.netTotal - r.paidAmount))}</span> },
            ]}
            getSearchText={(r) => `${r.ref} ${r.partyName} ${r.itemName}`}
            getDateValue={(r) => r.date}
          />
        </div>
      )}

      {(activeModule === 'receivables' || activeModule === 'payables') && (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-[#D7E2F3] dark:border-slate-800">
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">
              {activeModule === 'receivables'
                ? pick('Customer Outstanding Receivables & Collections', 'গ্রাহকের বকেয়া প্রাপ্য ও আদায়')
                : pick('Supplier Outstanding Payables & Settlements', 'সরবরাহকারীর বকেয়া প্রদেয় ও পরিশোধ')}
            </h4>
          </div>
          <div className="divide-y divide-[#D7E2F3]/70 dark:divide-slate-800">
            {orders
              .filter((o) =>
                o.kind === (activeModule === 'receivables' ? 'Sales Order' : 'Purchase Order')
              )
              .map((o) => {
                const due = Math.max(0, o.netTotal - o.paidAmount);
                return (
                  <div key={o.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#0345A4] mr-2">{o.ref}</span>
                      <span className="font-bold">{o.partyName}</span>
                      <span className="text-[#5F6D82] ml-2">
                        ({pick('Total:', 'মোট:')} {formatBDT(o.netTotal)} | {pick('Paid:', 'পরিশোধিত:')} {formatBDT(o.paidAmount)})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-700">
                        {pick('Due:', 'বকেয়া:')} {formatBDT(due)}
                      </span>
                      {due > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSettleOrderBalance(o.id, Math.min(due, 25000))}
                          className="px-3 py-1.5 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
                        >
                          {pick(`Record ${formatBDT(Math.min(due, 25000))} Payment`, `${formatBDT(Math.min(due, 25000))} পরিশোধ রেকর্ড করুন`)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {(activeModule === 'customers' || activeModule === 'suppliers') && (
        <InteractiveDataTable
          title={activeModule === 'customers' ? pick('Wholesale Customers & Credit Limits', 'পাইকারি গ্রাহক ও ক্রেডিট সীমা') : pick('Wholesale Suppliers', 'পাইকারি সরবরাহকারী')}
          rows={parties.filter((p) =>
            p.kind === (activeModule === 'customers' ? 'Customer' : 'Supplier')
          )}
          columns={[
            { key: 'name', header: pick('Company', 'প্রতিষ্ঠান'), render: (r) => <span className="font-bold">{r.name}</span> },
            { key: 'tier', header: pick('Pricing Tier', 'প্রাইসিং টায়ার'), render: (r) => r.tier },
            { key: 'limit', header: pick('Credit Limit', 'ক্রেডিট সীমা'), align: 'right', render: (r) => formatBDT(r.creditLimit) },
          ]}
          getSearchText={(r) => `${r.name} ${r.tier}`}
        />
      )}

      {(activeModule === 'pricing' || activeModule === 'stock') && (
        <InteractiveDataTable
          title={activeModule === 'pricing' ? pick('Wholesale Product Tier Pricing', 'পাইকারি পণ্যের টায়ার মূল্য') : pick('Trading Inventory Levels', 'ট্রেডিং ইনভেন্টরির পরিমাণ')}
          rows={products}
          columns={[
            { key: 'sku', header: 'SKU', render: (r) => <span className="font-mono font-bold">{r.sku}</span> },
            { key: 'name', header: pick('Product', 'পণ্য'), render: (r) => <span className="font-semibold">{r.name}</span> },
            { key: 'tierA', header: pick('Tier A Price', 'টায়ার A মূল্য'), align: 'right', render: (r) => (
              <input
                type="number"
                value={r.wholesaleTierA}
                onChange={(e) => handleUpdateTierPrice(r.id, parseSafeNumber(e.target.value))}
                className="w-24 px-2 py-1 rounded bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-right font-mono text-xs"
              />
            ) },
            { key: 'tierB', header: pick('Tier B Price', 'টায়ার B মূল্য'), align: 'right', render: (r) => formatBDT(r.wholesaleTierB) },
            { key: 'qty', header: pick('Stock', 'স্টক'), align: 'right', render: (r) => `${r.stockQty} ${pick('units', 'ইউনিট')}` },
          ]}
          getSearchText={(r) => `${r.sku} ${r.name}`}
        />
      )}

      {(activeModule === 'deliveries' || activeModule === 'reports') && (
        <InteractiveDataTable
          title={activeModule === 'deliveries' ? pick('Delivery Chalan & Dispatch Log', 'ডেলিভারি চালান ও ডিসপ্যাচ লগ') : pick('Customer-Wise Trading Summary', 'গ্রাহকভিত্তিক ট্রেডিং সারসংক্ষেপ')}
          rows={orders}
          columns={[
            { key: 'ref', header: pick('Order #', 'অর্ডার #'), render: (r) => <span className="font-mono font-bold">{r.ref}</span> },
            { key: 'date', header: pick('Date', 'তারিখ'), render: (r) => <span className="font-mono text-[11px]">{r.date}</span> },
            { key: 'party', header: pick('Party', 'পার্টি'), render: (r) => r.partyName },
            { key: 'status', header: pick('Delivery Status', 'ডেলিভারি অবস্থা'), render: (r) => (
              <button
                type="button"
                onClick={() =>
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === r.id
                        ? {
                            ...o,
                            deliveryStatus:
                              o.deliveryStatus === 'Pending Dispatch'
                                ? 'In Transit'
                                : 'Delivered',
                          }
                        : o
                    )
                  )
                }
                className="px-2.5 py-1 rounded bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[11px] font-bold text-[#0345A4] cursor-pointer"
              >
                {deliveryStatusLabel(r.deliveryStatus)} ({pick('Advance', 'পরবর্তী ধাপ')})
              </button>
            ) },
            { key: 'amt', header: pick('Order Value', 'অর্ডার মূল্য'), align: 'right', render: (r) => formatBDT(r.netTotal) },
          ]}
          getSearchText={(r) => `${r.ref} ${r.partyName} ${r.deliveryStatus}`}
        />
      )}
    </DemoWorkspace>
  );
};

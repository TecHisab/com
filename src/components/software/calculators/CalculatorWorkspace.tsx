import React, { useState } from 'react';
import {
  TrendingUp,
  Percent,
  Wallet,
  Boxes,
  Tag,
  PieChart,
  Landmark,
  Scale,
  RotateCcw,
  AlertCircle,
  Printer,
} from 'lucide-react';
import {
  formatBDT,
  formatPercent,
  parseSafeNumber,
  triggerPrintableReport,
} from '../../../utils/demoFormatters';
import { useLanguage } from '../../../context/LanguageContext';

type CalcKey =
  | 'profit'
  | 'vat'
  | 'payroll'
  | 'inventory'
  | 'pricing'
  | 'budget'
  | 'loan'
  | 'breakeven';

export const CalculatorWorkspace: React.FC = () => {
  const { pick } = useLanguage();
  const [activeCalc, setActiveCalc] = useState<CalcKey>('profit');

  const calcTabs: { id: CalcKey; code: string; label: string; icon: React.ElementType }[] = [
    { id: 'profit', code: 'A', label: pick('Business Profit', 'ব্যবসায়িক মুনাফা'), icon: TrendingUp },
    { id: 'vat', code: 'B', label: pick('VAT Calculator', 'ভ্যাট ক্যালকুলেটর'), icon: Percent },
    { id: 'payroll', code: 'C', label: pick('Payroll Calculator', 'পেরোল ক্যালকুলেটর'), icon: Wallet },
    { id: 'inventory', code: 'D', label: pick('Inventory Valuation', 'ইনভেন্টরি মূল্যায়ন'), icon: Boxes },
    { id: 'pricing', code: 'E', label: pick('Sales Price & Margin', 'বিক্রয়মূল্য ও মার্জিন'), icon: Tag },
    { id: 'budget', code: 'F', label: pick('Monthly Budget', 'মাসিক বাজেট'), icon: PieChart },
    { id: 'loan', code: 'G', label: pick('Loan & Installment', 'ঋণ ও কিস্তি'), icon: Landmark },
    { id: 'breakeven', code: 'H', label: pick('Break-Even Analysis', 'ব্রেক-ইভেন বিশ্লেষণ'), icon: Scale },
  ];

  // A. Profit Calculator State
  const [salesRev, setSalesRev] = useState('450000');
  const [cogs, setCogs] = useState('275000');
  const [opExp, setOpExp] = useState('85000');
  const [otherInc, setOtherInc] = useState('12000');
  const [otherExp, setOtherExp] = useState('6000');

  // B. VAT Calculator State
  const [vatBaseAmount, setVatBaseAmount] = useState('100000');
  const [vatRatePct, setVatRatePct] = useState('15');
  const [vatMode, setVatMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // C. Payroll Calculator State
  const [basicSal, setBasicSal] = useState('40000');
  const [houseRent, setHouseRent] = useState('16000');
  const [medicalAllow, setMedicalAllow] = useState('4000');
  const [conveyanceAllow, setConveyanceAllow] = useState('3000');
  const [otherAllow, setOtherAllow] = useState('2000');
  const [salDeductions, setSalDeductions] = useState('2500');

  // D. Inventory Valuation State
  const [invOpenQty, setInvOpenQty] = useState('120');
  const [invOpenCost, setInvOpenCost] = useState('240');
  const [invPurQty, setInvPurQty] = useState('80');
  const [invPurCost, setInvPurCost] = useState('290');
  const [invIssuedQty, setInvIssuedQty] = useState('130');

  // E. Sales Price Calculator State
  const [prodCost, setProdCost] = useState('850');
  const [desiredMarginPct, setDesiredMarginPct] = useState('30');
  const [discountPct, setDiscountPct] = useState('10');

  // F. Monthly Budget State
  const [budIncome, setBudIncome] = useState('75000');
  const [budHousing, setBudHousing] = useState('18000');
  const [budFood, setBudFood] = useState('14000');
  const [budTransport, setBudTransport] = useState('5500');
  const [budEducation, setBudEducation] = useState('6500');
  const [budUtilities, setBudUtilities] = useState('4500');
  const [budPersonal, setBudPersonal] = useState('6000');
  const [budSavings, setBudSavings] = useState('15000');

  // G. Loan & Installment State
  const [loanPrincipal, setLoanPrincipal] = useState('500000');
  const [loanRatePct, setLoanRatePct] = useState('11.5');
  const [loanMonths, setLoanMonths] = useState('24');

  // H. Break-Even State
  const [beFixedCost, setBeFixedCost] = useState('180000');
  const [beUnitPrice, setBeUnitPrice] = useState('1200');
  const [beVarCost, setBeVarCost] = useState('750');

  const n = (v: string) => Math.max(0, parseSafeNumber(v));

  const handleResetAll = () => {
    setSalesRev('450000');
    setCogs('275000');
    setOpExp('85000');
    setOtherInc('12000');
    setOtherExp('6000');
    setVatBaseAmount('100000');
    setVatRatePct('15');
    setVatMode('exclusive');
    setBasicSal('40000');
    setHouseRent('16000');
    setMedicalAllow('4000');
    setConveyanceAllow('3000');
    setOtherAllow('2000');
    setSalDeductions('2500');
    setInvOpenQty('120');
    setInvOpenCost('240');
    setInvPurQty('80');
    setInvPurCost('290');
    setInvIssuedQty('130');
    setProdCost('850');
    setDesiredMarginPct('30');
    setDiscountPct('10');
    setBudIncome('75000');
    setBudHousing('18000');
    setBudFood('14000');
    setBudTransport('5500');
    setBudEducation('6500');
    setBudUtilities('4500');
    setBudPersonal('6000');
    setBudSavings('15000');
    setLoanPrincipal('500000');
    setLoanRatePct('11.5');
    setLoanMonths('24');
    setBeFixedCost('180000');
    setBeUnitPrice('1200');
    setBeVarCost('750');
  };

  // Calculations
  // A
  const aRev = n(salesRev);
  const aCogs = n(cogs);
  const aOpEx = n(opExp);
  const aOtherInc = n(otherInc);
  const aOtherExp = n(otherExp);
  const aGrossProfit = aRev - aCogs;
  const aOperatingProfit = aGrossProfit - aOpEx;
  const aNetProfit = aOperatingProfit + aOtherInc - aOtherExp;
  const aGrossMargin = aRev > 0 ? (aGrossProfit / aRev) * 100 : 0;
  const aNetMargin = aRev > 0 ? (aNetProfit / aRev) * 100 : 0;

  // B
  const bAmt = n(vatBaseAmount);
  const bRate = Math.min(100, n(vatRatePct));
  const bNetAmount = vatMode === 'exclusive' ? bAmt : bAmt / (1 + bRate / 100);
  const bVatAmount = vatMode === 'exclusive' ? bAmt * (bRate / 100) : bAmt - bNetAmount;
  const bGrossAmount = vatMode === 'exclusive' ? bAmt + bVatAmount : bAmt;

  // C
  const cGrossSalary =
    n(basicSal) + n(houseRent) + n(medicalAllow) + n(conveyanceAllow) + n(otherAllow);
  const cDeductions = n(salDeductions);
  const cNetPayable = Math.max(0, cGrossSalary - cDeductions);

  // D
  const dOpQ = Math.round(n(invOpenQty));
  const dOpC = n(invOpenCost);
  const dPurQ = Math.round(n(invPurQty));
  const dPurC = n(invPurCost);
  const dTotalAvail = dOpQ + dPurQ;
  const dRawIssued = Math.round(n(invIssuedQty));
  const dIssuedInvalid = dRawIssued > dTotalAvail;
  const dIssued = Math.min(dTotalAvail, dRawIssued);
  const dRemaining = Math.max(0, dTotalAvail - dIssued);
  const dRemFromPur = Math.min(dRemaining, dPurQ);
  const dRemFromOp = Math.max(0, dRemaining - dRemFromPur);
  const dFifoValue = dRemFromPur * dPurC + dRemFromOp * dOpC;
  const dAvgCost = dTotalAvail > 0 ? (dOpQ * dOpC + dPurQ * dPurC) / dTotalAvail : 0;
  const dWeightedValue = dRemaining * dAvgCost;

  // E
  const eCost = n(prodCost);
  const eMargin = Math.min(95, n(desiredMarginPct));
  const eDiscount = Math.min(95, n(discountPct));
  const eSellingPrice = eMargin < 100 ? eCost / (1 - eMargin / 100) : 0;
  const eDiscountAmt = eSellingPrice * (eDiscount / 100);
  const eFinalPrice = Math.max(0, eSellingPrice - eDiscountAmt);
  const eProfitAmt = eFinalPrice - eCost;
  const eEffectiveMargin = eFinalPrice > 0 ? (eProfitAmt / eFinalPrice) * 100 : 0;

  // F
  const fIncome = n(budIncome);
  const fTotalExpenses =
    n(budHousing) + n(budFood) + n(budTransport) + n(budEducation) + n(budUtilities) + n(budPersonal);
  const fSavings = n(budSavings);
  const fRemaining = fIncome - fTotalExpenses - fSavings;
  const fSavingsPct = fIncome > 0 ? (fSavings / fIncome) * 100 : 0;
  const fStatus =
    fRemaining < 0
      ? pick('Overspending Warning', 'অতিরিক্ত ব্যয়ের সতর্কতা')
      : fRemaining === 0
      ? pick('Balanced Allocation', 'সুষম বণ্টন')
      : pick('Surplus Available', 'উদ্বৃত্ত রয়েছে');

  // G
  const gP = n(loanPrincipal);
  const gMonths = Math.max(1, Math.round(n(loanMonths)));
  const gAnnualRate = n(loanRatePct);
  const gMonthlyRate = gAnnualRate / 12 / 100;
  const gEmi =
    gMonthlyRate === 0
      ? gP / gMonths
      : (gP * gMonthlyRate * Math.pow(1 + gMonthlyRate, gMonths)) /
        (Math.pow(1 + gMonthlyRate, gMonths) - 1);
  const gTotalPayment = gEmi * gMonths;
  const gTotalInterest = Math.max(0, gTotalPayment - gP);

  // H
  const hFixed = n(beFixedCost);
  const hPrice = n(beUnitPrice);
  const hVar = n(beVarCost);
  const hContribution = hPrice - hVar;
  const hInvalid = hContribution <= 0;
  const hBreakEvenUnits = !hInvalid ? Math.ceil(hFixed / hContribution) : 0;
  const hBreakEvenRevenue = !hInvalid ? hBreakEvenUnits * hPrice : 0;

  const InputField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
  }) => (
    <div>
      <label className="block text-[11px] font-semibold text-[#5F6D82] dark:text-slate-400 mb-1">
        {label}
      </label>
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-mono font-bold text-[#0B1730] dark:text-white focus:outline-none focus:border-[#0345A4]"
      />
    </div>
  );

  const ResultTile = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string;
    highlight?: boolean;
  }) => (
    <div
      className={`p-3.5 rounded-xl border ${
        highlight
          ? 'bg-[#0345A4] text-white border-[#0345A4]'
          : 'bg-[#F4F8FF] dark:bg-slate-800/70 border-[#D7E2F3] dark:border-slate-700'
      }`}
    >
      <span
        className={`text-[11px] font-semibold block ${
          highlight ? 'text-sky-100' : 'text-[#5F6D82] dark:text-slate-400'
        }`}
      >
        {label}
      </span>
      <span
        className={`text-base sm:text-lg font-extrabold font-mono tabular-nums mt-0.5 block ${
          highlight ? 'text-white' : 'text-[#0B1730] dark:text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 shadow-lg overflow-hidden">
      <div className="bg-[#02377F] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold">
              {pick(
                'TecHisab Interactive Business & Finance Calculators',
                'টেকহিসাব ইন্টারেক্টিভ ব্যবসা ও অর্থ ক্যালকুলেটর'
              )}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-400/20 text-sky-100 border border-sky-300/30">
              {pick('DEMO MODE — Sample Calculators', 'ডেমো মোড — নমুনা ক্যালকুলেটর')}
            </span>
          </div>
          <p className="text-[11px] text-sky-100/80">
            {pick(
              'Instant BDT calculations for profit, VAT, salary sheets, stock valuation, pricing, budgeting, loans and break-even analysis.',
              'মুনাফা, ভ্যাট, বেতন শীট, স্টক মূল্যায়ন, মূল্য নির্ধারণ, বাজেটিং, ঋণ ও ব্রেক-ইভেন বিশ্লেষণের জন্য তাৎক্ষণিক টাকা হিসাব।'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              triggerPrintableReport(
                `${pick('TecHisab Calculators', 'টেকহিসাব ক্যালকুলেটর')} — ${calcTabs.find((t) => t.id === activeCalc)?.label}`,
                `<p style="font-size:13px;">${pick(
                  'Interactive calculator evaluation printed from the TecHisab sandbox.',
                  'টেকহিসাব স্যান্ডবক্স থেকে প্রিন্টকৃত ইন্টারেক্টিভ ক্যালকুলেটর মূল্যায়ন।'
                )}</p>`
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{pick('Print', 'প্রিন্ট')}</span>
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{pick('Reset Values', 'মান রিসেট করুন')}</span>
          </button>
        </div>
      </div>

      {/* Calculator Switcher Bar */}
      <div className="p-3 bg-[#F4F8FF]/80 dark:bg-slate-950/50 border-b border-[#D7E2F3] dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
        {calcTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeCalc === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCalc(tab.id)}
              className={`px-2.5 py-2 rounded-xl text-left text-[11px] font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                active
                  ? 'bg-[#0345A4] text-white border-[#0345A4]'
                  : 'bg-white dark:bg-slate-900 text-[#0B1730] dark:text-slate-300 border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4]/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.code}. {tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {activeCalc === 'profit' && (
          <div className="space-y-5">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('A. Business Profit & Margin Calculator', 'A. ব্যবসায়িক মুনাফা ও মার্জিন ক্যালকুলেটর')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <InputField label={pick('Sales Revenue (BDT)', 'বিক্রয় আয় (টাকা)')} value={salesRev} onChange={setSalesRev} />
              <InputField label={pick('Cost of Goods Sold', 'বিক্রিত পণ্যের ব্যয় (COGS)')} value={cogs} onChange={setCogs} />
              <InputField label={pick('Operating Expenses', 'পরিচালন ব্যয়')} value={opExp} onChange={setOpExp} />
              <InputField label={pick('Other Income', 'অন্যান্য আয়')} value={otherInc} onChange={setOtherInc} />
              <InputField label={pick('Other Expenses', 'অন্যান্য ব্যয়')} value={otherExp} onChange={setOtherExp} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <ResultTile label={pick('Gross Profit', 'মোট মুনাফা')} value={formatBDT(aGrossProfit)} />
              <ResultTile label={pick('Operating Profit', 'পরিচালন মুনাফা')} value={formatBDT(aOperatingProfit)} />
              <ResultTile label={pick('Net Profit', 'নিট মুনাফা')} value={formatBDT(aNetProfit)} highlight />
              <ResultTile label={pick('Gross Margin %', 'মোট মার্জিন %')} value={formatPercent(aGrossMargin)} />
              <ResultTile label={pick('Net Margin %', 'নিট মার্জিন %')} value={formatPercent(aNetMargin)} />
            </div>
          </div>
        )}

        {activeCalc === 'vat' && (
          <div className="space-y-5">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('B. VAT Exclusive / Inclusive Calculator', 'B. ভ্যাট এক্সক্লুসিভ / ইনক্লুসিভ ক্যালকুলেটর')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <InputField label={pick('Amount (BDT)', 'পরিমাণ (টাকা)')} value={vatBaseAmount} onChange={setVatBaseAmount} />
              <InputField label={pick('Configurable VAT Rate (%)', 'ভ্যাট হার (%)')} value={vatRatePct} onChange={setVatRatePct} />
              <div className="grid grid-cols-2 gap-2">
                {(['exclusive', 'inclusive'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setVatMode(mode)}
                    className={`py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                      vatMode === mode
                        ? 'bg-[#0345A4] text-white border-[#0345A4]'
                        : 'bg-[#F4F8FF] dark:bg-slate-800 text-[#0B1730] dark:text-slate-300 border-[#D7E2F3] dark:border-slate-700'
                    }`}
                  >
                    {mode === 'exclusive'
                      ? pick('VAT Exclusive', 'ভ্যাট ছাড়া')
                      : pick('VAT Inclusive', 'ভ্যাট সহ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResultTile label={pick('Net Amount (Excl. VAT)', 'নিট পরিমাণ (ভ্যাট ছাড়া)')} value={formatBDT(Math.round(bNetAmount))} />
              <ResultTile label={pick(`VAT Amount (${bRate}%)`, `ভ্যাট পরিমাণ (${bRate}%)`)} value={formatBDT(Math.round(bVatAmount))} />
              <ResultTile label={pick('Gross Amount (Incl. VAT)', 'মোট পরিমাণ (ভ্যাট সহ)')} value={formatBDT(Math.round(bGrossAmount))} highlight />
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {pick(
                  'Illustrative estimation only. Actual VAT calculation, Mushak treatment, and rebate eligibility depend on applicable Bangladesh VAT legislation.',
                  'এটি শুধুমাত্র আনুমানিক হিসাব। প্রকৃত ভ্যাট গণনা, মূসক বিধি ও রেয়াত যোগ্যতা বাংলাদেশের প্রযোজ্য ভ্যাট আইনের ওপর নির্ভরশীল।'
                )}
              </span>
            </div>
          </div>
        )}

        {activeCalc === 'payroll' && (
          <div className="space-y-5">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('C. Payroll & Net Salary Calculator', 'C. পেরোল ও নিট বেতন ক্যালকুলেটর')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <InputField label={pick('Basic Salary', 'মূল বেতন')} value={basicSal} onChange={setBasicSal} />
              <InputField label={pick('House Rent', 'বাড়ি ভাড়া ভাতা')} value={houseRent} onChange={setHouseRent} />
              <InputField label={pick('Medical Allowance', 'চিকিৎসা ভাতা')} value={medicalAllow} onChange={setMedicalAllow} />
              <InputField label={pick('Conveyance', 'যাতায়াত ভাতা')} value={conveyanceAllow} onChange={setConveyanceAllow} />
              <InputField label={pick('Other Allowances', 'অন্যান্য ভাতা')} value={otherAllow} onChange={setOtherAllow} />
              <InputField label={pick('Deductions', 'কর্তন')} value={salDeductions} onChange={setSalDeductions} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResultTile label={pick('Gross Salary', 'মোট বেতন (গ্রস)')} value={formatBDT(cGrossSalary)} />
              <ResultTile label={pick('Total Deductions', 'মোট কর্তন')} value={formatBDT(cDeductions)} />
              <ResultTile label={pick('Net Payable Salary', 'প্রদেয় নিট বেতন')} value={formatBDT(cNetPayable)} highlight />
            </div>
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-[#D7E2F3] dark:border-sky-900 text-xs text-[#02377F] dark:text-sky-200">
              {pick(
                'Note: This tool calculates sample gross-to-net salary disbursement and is not a complete statutory income tax assessment engine.',
                'দ্রষ্টব্য: এই টুলটি নমুনা গ্রস-থেকে-নিট বেতন হিসাব করে এবং এটি পূর্ণাঙ্গ বিধিবদ্ধ আয়কর নির্ণায়ক ইঞ্জিন নয়।'
              )}
            </div>
          </div>
        )}

        {activeCalc === 'inventory' && (
          <div className="space-y-5">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('D. Inventory Valuation Calculator (FIFO vs Weighted Average)', 'D. ইনভেন্টরি মূল্যায়ন ক্যালকুলেটর (FIFO বনাম ভারিত গড়)')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <InputField label={pick('Opening Qty', 'প্রারম্ভিক পরিমাণ')} value={invOpenQty} onChange={setInvOpenQty} />
              <InputField label={pick('Opening Unit Cost', 'প্রারম্ভিক একক মূল্য')} value={invOpenCost} onChange={setInvOpenCost} />
              <InputField label={pick('Purchase Qty', 'ক্রয়ের পরিমাণ')} value={invPurQty} onChange={setInvPurQty} />
              <InputField label={pick('Purchase Unit Cost', 'ক্রয় একক মূল্য')} value={invPurCost} onChange={setInvPurCost} />
              <InputField label={pick(`Issued Qty (Max ${dTotalAvail})`, `ইস্যুকৃত পরিমাণ (সর্বোচ্চ ${dTotalAvail})`)} value={invIssuedQty} onChange={setInvIssuedQty} />
            </div>
            {dIssuedInvalid && (
              <div className="text-xs font-semibold text-rose-600">
                {pick(
                  `Validation Notice: Issued Quantity cannot exceed Opening + Purchase Quantity (${dTotalAvail}). Calculation capped at ${dTotalAvail}.`,
                  `সতর্কতা: ইস্যুকৃত পরিমাণ প্রারম্ভিক + ক্রয়কৃত পরিমাণের (${dTotalAvail}) বেশি হতে পারে না। হিসাব ${dTotalAvail}-এ সীমাবদ্ধ করা হয়েছে।`
                )}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResultTile label={pick('Remaining Quantity', 'অবশিষ্ট পরিমাণ')} value={pick(`${dRemaining} units`, `${dRemaining} ইউনিট`)} />
              <ResultTile label={pick('FIFO Ending Value', 'FIFO সমাপনী মূল্য')} value={formatBDT(Math.round(dFifoValue))} highlight />
              <ResultTile label={pick('Weighted Average Value', 'ভারিত গড় মূল্য')} value={formatBDT(Math.round(dWeightedValue))} />
            </div>
          </div>
        )}

        {activeCalc === 'pricing' && (
          <div className="space-y-5">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('E. Sales Price, Discount & Effective Margin Calculator', 'E. বিক্রয়মূল্য, ছাড় ও কার্যকর মার্জিন ক্যালকুলেটর')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputField label={pick('Product Cost (BDT)', 'পণ্যের ক্রয়মূল্য (টাকা)')} value={prodCost} onChange={setProdCost} />
              <InputField label={pick('Desired Profit Margin (% < 95)', 'কাঙ্ক্ষিত মুনাফা মার্জিন (% < ৯৫)')} value={desiredMarginPct} onChange={setDesiredMarginPct} />
              <InputField label={pick('Discount Percentage (%)', 'ছাড়ের হার (%)')} value={discountPct} onChange={setDiscountPct} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <ResultTile label={pick('List Selling Price', 'তালিকা বিক্রয়মূল্য')} value={formatBDT(Math.round(eSellingPrice))} />
              <ResultTile label={pick('Discount Amount', 'ছাড়ের পরিমাণ')} value={formatBDT(Math.round(eDiscountAmt))} />
              <ResultTile label={pick('Final Selling Price', 'চূড়ান্ত বিক্রয়মূল্য')} value={formatBDT(Math.round(eFinalPrice))} highlight />
              <ResultTile label={pick('Profit Amount', 'মুনাফার পরিমাণ')} value={formatBDT(Math.round(eProfitAmt))} />
              <ResultTile label={pick('Effective Margin %', 'কার্যকর মার্জিন %')} value={formatPercent(eEffectiveMargin)} />
            </div>
          </div>
        )}

        {activeCalc === 'budget' && (
          <div className="space-y-5">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('F. Monthly Personal & Family Budget Calculator', 'F. মাসিক ব্যক্তিগত ও পারিবারিক বাজেট ক্যালকুলেটর')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InputField label={pick('Monthly Income', 'মাসিক আয়')} value={budIncome} onChange={setBudIncome} />
              <InputField label={pick('Housing', 'বাসস্থান')} value={budHousing} onChange={setBudHousing} />
              <InputField label={pick('Food & Groceries', 'খাবার ও বাজার')} value={budFood} onChange={setBudFood} />
              <InputField label={pick('Transport', 'যাতায়াত')} value={budTransport} onChange={setBudTransport} />
              <InputField label={pick('Education', 'শিক্ষা')} value={budEducation} onChange={setBudEducation} />
              <InputField label={pick('Utilities', 'বিল ও ইউটিলিটি')} value={budUtilities} onChange={setBudUtilities} />
              <InputField label={pick('Personal Expenses', 'ব্যক্তিগত খরচ')} value={budPersonal} onChange={setBudPersonal} />
              <InputField label={pick('Savings Allocation', 'সঞ্চয় বরাদ্দ')} value={budSavings} onChange={setBudSavings} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultTile label={pick('Total Living Expenses', 'মোট জীবনযাত্রা ব্যয়')} value={formatBDT(fTotalExpenses)} />
              <ResultTile label={pick('Remaining Balance', 'অবশিষ্ট ব্যালেন্স')} value={formatBDT(fRemaining)} highlight />
              <ResultTile label={pick('Savings Percentage', 'সঞ্চয়ের হার')} value={formatPercent(fSavingsPct)} />
              <ResultTile label={pick('Budget Status', 'বাজেটের অবস্থা')} value={fStatus} />
            </div>
          </div>
        )}

        {activeCalc === 'loan' && (
          <div className="space-y-5">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('G. Loan & Installment (EMI) Estimator', 'G. ঋণ ও কিস্তি (EMI) হিসাবক')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputField label={pick('Principal Amount (BDT)', 'মূল ঋণের পরিমাণ (টাকা)')} value={loanPrincipal} onChange={setLoanPrincipal} />
              <InputField label={pick('Annual Interest Rate (%)', 'বার্ষিক সুদের হার (%)')} value={loanRatePct} onChange={setLoanRatePct} />
              <InputField label={pick('Loan Duration (Months)', 'ঋণের মেয়াদ (মাস)')} value={loanMonths} onChange={setLoanMonths} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResultTile label={pick('Estimated Monthly EMI', 'আনুমানিক মাসিক কিস্তি')} value={formatBDT(Math.round(gEmi))} highlight />
              <ResultTile label={pick('Total Repayment', 'মোট পরিশোধযোগ্য অর্থ')} value={formatBDT(Math.round(gTotalPayment))} />
              <ResultTile label={pick('Estimated Total Interest', 'আনুমানিক মোট সুদ')} value={formatBDT(Math.round(gTotalInterest))} />
            </div>
            <p className="text-[11px] text-[#5F6D82]">
              {pick(
                'Disclaimer: Results are mathematical estimates using standard reducing-balance amortization and exclude bank processing fees or stamp charges.',
                'সতর্কীকরণ: ফলাফলগুলো প্রচলিত রিডিউসিং-ব্যালেন্স পদ্ধতিতে গাণিতিক অনুমান মাত্র এবং এতে ব্যাংক প্রসেসিং ফি বা স্ট্যাম্প চার্জ অন্তর্ভুক্ত নয়।'
              )}
            </p>
          </div>
        )}

        {activeCalc === 'breakeven' && (
          <div className="space-y-5">
            <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
              {pick('H. Break-Even Quantity & Revenue Calculator', 'H. ব্রেক-ইভেন পরিমাণ ও বিক্রয় ক্যালকুলেটর')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputField label={pick('Total Fixed Costs (BDT)', 'মোট স্থির ব্যয় (টাকা)')} value={beFixedCost} onChange={setBeFixedCost} />
              <InputField label={pick('Selling Price per Unit', 'প্রতি একক বিক্রয়মূল্য')} value={beUnitPrice} onChange={setBeUnitPrice} />
              <InputField label={pick('Variable Cost per Unit', 'প্রতি একক পরিবর্তনশীল ব্যয়')} value={beVarCost} onChange={setBeVarCost} />
            </div>
            {hInvalid ? (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-semibold">
                {pick(
                  'Validation Error: Selling Price per Unit must exceed Variable Cost per Unit to achieve a positive contribution margin.',
                  'ভ্যালিডেশন ত্রুটি: ইতিবাচক কন্ট্রিবিউশন মার্জিন পেতে প্রতি একক বিক্রয়মূল্য অবশ্যই পরিবর্তনশীল ব্যয়ের চেয়ে বেশি হতে হবে।'
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ResultTile label={pick('Contribution Margin / Unit', 'প্রতি একক কন্ট্রিবিউশন মার্জিন')} value={formatBDT(hContribution)} />
                <ResultTile label={pick('Break-Even Quantity', 'ব্রেক-ইভেন পরিমাণ')} value={pick(`${hBreakEvenUnits.toLocaleString()} units`, `${hBreakEvenUnits.toLocaleString()} ইউনিট`)} highlight />
                <ResultTile label={pick('Break-Even Revenue', 'ব্রেক-ইভেন বিক্রয় আয়')} value={formatBDT(hBreakEvenRevenue)} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

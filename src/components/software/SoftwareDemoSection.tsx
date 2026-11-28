import React, { useState, Suspense, lazy } from 'react';
import { SoftwareDemoKey, SoftwareProduct } from '../../types';
import { getLocalizedSoftwareProducts } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { SoftwareCard } from './SoftwareCard';
import { SoftwareProductSelector } from './SoftwareProductSelector';
import { SoftwareFeaturesModal } from './SoftwareFeaturesModal';

const DemoBusiness = lazy(() =>
  import('./demos/DemoBusiness').then((m) => ({ default: m.DemoBusiness }))
);
const DemoERP = lazy(() => import('./demos/DemoERP').then((m) => ({ default: m.DemoERP })));
const DemoCloudAccounting = lazy(() =>
  import('./demos/DemoCloudAccounting').then((m) => ({ default: m.DemoCloudAccounting }))
);
const DemoRetailManager = lazy(() =>
  import('./demos/DemoRetailManager').then((m) => ({ default: m.DemoRetailManager }))
);
const DemoPOSPro = lazy(() =>
  import('./demos/DemoPOSPro').then((m) => ({ default: m.DemoPOSPro }))
);
const DemoTradeManager = lazy(() =>
  import('./demos/DemoTradeManager').then((m) => ({ default: m.DemoTradeManager }))
);
const DemoInventoryPro = lazy(() =>
  import('./demos/DemoInventoryPro').then((m) => ({ default: m.DemoInventoryPro }))
);
const DemoTecHisabOne = lazy(() =>
  import('./demos/DemoTecHisabOne').then((m) => ({ default: m.DemoTecHisabOne }))
);
const DemoJibon = lazy(() =>
  import('./demos/DemoJibon').then((m) => ({ default: m.DemoJibon }))
);
const CalculatorWorkspace = lazy(() =>
  import('./calculators/CalculatorWorkspace').then((m) => ({ default: m.CalculatorWorkspace }))
);

interface SoftwareDemoSectionProps {
  sectionId: string;
  workspaceAnchorId: string;
  activeDemo: SoftwareDemoKey;
  onSelectDemo: (key: SoftwareDemoKey) => void;
  onRequestOnboarding: () => void;
  isStandalonePage?: boolean;
}

export const SoftwareDemoSection: React.FC<SoftwareDemoSectionProps> = ({
  sectionId,
  workspaceAnchorId,
  activeDemo,
  onSelectDemo,
  onRequestOnboarding,
  isStandalonePage = false,
}) => {
  const { isBengali, pick } = useLanguage();
  const [modalProduct, setModalProduct] = useState<SoftwareProduct | null>(null);
  const products = getLocalizedSoftwareProducts(isBengali);

  const handleOpenDemoFromCard = (product: SoftwareProduct) => {
    onSelectDemo(product.demoTabKey);
    setTimeout(() => {
      const el = document.getElementById(workspaceAnchorId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const renderDemoWorkspace = () => {
    switch (activeDemo) {
      case 'business':
        return <DemoBusiness onRequestOnboarding={onRequestOnboarding} />;
      case 'erp':
        return <DemoERP onRequestOnboarding={onRequestOnboarding} />;
      case 'cloud-accounting':
        return <DemoCloudAccounting onRequestOnboarding={onRequestOnboarding} />;
      case 'retail-manager':
        return <DemoRetailManager onRequestOnboarding={onRequestOnboarding} />;
      case 'pos-pro':
        return <DemoPOSPro onRequestOnboarding={onRequestOnboarding} />;
      case 'trade-manager':
        return <DemoTradeManager onRequestOnboarding={onRequestOnboarding} />;
      case 'inventory-pro':
        return <DemoInventoryPro onRequestOnboarding={onRequestOnboarding} />;
      case 'one':
        return <DemoTecHisabOne onRequestOnboarding={onRequestOnboarding} />;
      case 'jibon':
        return <DemoJibon onRequestOnboarding={onRequestOnboarding} />;
      case 'calculators':
        return <CalculatorWorkspace />;
      default:
        return <DemoBusiness onRequestOnboarding={onRequestOnboarding} />;
    }
  };

  const HeadingTag = isStandalonePage ? 'h1' : 'h2';

  return (
    <div id={sectionId} className="space-y-10">
      {/* Section Header matching required copy */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#0345A4] dark:text-sky-400">
          {pick('TecHisab Interactive Software Suite', 'টেকহিসাব ইন্টারেক্টিভ সফটওয়্যার স্যুট')}
        </span>
        <HeadingTag className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1730] dark:text-white tracking-tight">
          {pick(
            'Explore TecHisab Software — Interactive Live Previews',
            'টেকহিসাব সফটওয়্যার ঘুরে দেখুন — ইন্টারেক্টিভ লাইভ প্রিভিউ'
          )}
        </HeadingTag>
        <p className="text-sm sm:text-base text-[#5F6D82] dark:text-slate-400 leading-relaxed">
          {pick(
            'Experience the power of TecHisab through interactive software demonstrations. Explore business management, accounting, ERP, retail, POS, trading, inventory, integrated business operations and personal finance through realistic sample data and working calculators.',
            'ইন্টারেক্টিভ সফটওয়্যার ডেমোনস্ট্রেশনের মাধ্যমে টেকহিসাব-এর সক্ষমতা অভিজ্ঞতা করুন। বাস্তবসম্মত নমুনা ডেটা ও কার্যকর ক্যালকুলেটরের মাধ্যমে বিজনেস ম্যানেজমেন্ট, অ্যাকাউন্টিং, ইআরপি, রিটেইল, পিওএস, ট্রেডিং, ইনভেন্টরি, সমন্বিত ব্যবসা পরিচালনা এবং ব্যক্তিগত অর্থ ব্যবস্থাপনা দেখুন।'
          )}
        </p>
      </div>

      {/* 9 Official Product Cards Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <SoftwareCard
            key={product.id}
            product={product}
            isActiveDemo={activeDemo === product.demoTabKey}
            onSelect={(p) => setModalProduct(p)}
            onTryFree={handleOpenDemoFromCard}
          />
        ))}
      </div>

      {/* Interactive Workspace Area */}
      <div id={workspaceAnchorId} className="pt-4 space-y-4 scroll-mt-24">
        <SoftwareProductSelector
          activeDemo={activeDemo}
          onSelectDemo={onSelectDemo}
        />
        <Suspense
          fallback={
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-10 text-center text-xs font-semibold text-[#5F6D82] dark:text-slate-400">
              {pick('Loading interactive software workspace...', 'ইন্টারেক্টিভ সফটওয়্যার ওয়ার্কস্পেস লোড হচ্ছে...')}
            </div>
          }
        >
          {renderDemoWorkspace()}
        </Suspense>
      </div>

      <SoftwareFeaturesModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onLaunchDemo={handleOpenDemoFromCard}
        onRequestOnboarding={onRequestOnboarding}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { SoftwareDemoKey, SoftwareProduct } from '../../types';
import { getLocalizedSoftwareProducts } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { SoftwareCard } from './SoftwareCard';
import { SoftwareProductSelector } from './SoftwareProductSelector';
import { SoftwareFeaturesModal } from './SoftwareFeaturesModal';
import { DemoBusiness } from './demos/DemoBusiness';
import { DemoERP } from './demos/DemoERP';
import { DemoCloudAccounting } from './demos/DemoCloudAccounting';
import { DemoRetailManager } from './demos/DemoRetailManager';
import { DemoPOSPro } from './demos/DemoPOSPro';
import { DemoTradeManager } from './demos/DemoTradeManager';
import { DemoInventoryPro } from './demos/DemoInventoryPro';
import { DemoTecHisabOne } from './demos/DemoTecHisabOne';
import { DemoJibon } from './demos/DemoJibon';
import { CalculatorWorkspace } from './calculators/CalculatorWorkspace';

interface SoftwareDemoSectionProps {
  sectionId: string;
  workspaceAnchorId: string;
  activeDemo: SoftwareDemoKey;
  onSelectDemo: (key: SoftwareDemoKey) => void;
  onRequestOnboarding: () => void;
}

export const SoftwareDemoSection: React.FC<SoftwareDemoSectionProps> = ({
  sectionId,
  workspaceAnchorId,
  activeDemo,
  onSelectDemo,
  onRequestOnboarding,
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

  return (
    <div id={sectionId} className="space-y-10">
      {/* Section Header matching required copy */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#0345A4] dark:text-sky-400">
          {pick('TecHisab Interactive Software Suite', 'টেকহিসাব ইন্টারেক্টিভ সফটওয়্যার স্যুট')}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1730] dark:text-white tracking-tight">
          {pick(
            'Explore TecHisab Software — Interactive Live Previews',
            'টেকহিসাব সফটওয়্যার ঘুরে দেখুন — ইন্টারেক্টিভ লাইভ প্রিভিউ'
          )}
        </h2>
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
        {renderDemoWorkspace()}
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

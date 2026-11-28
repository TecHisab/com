import React, { useEffect, useRef } from 'react';
import { ServiceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { localizeService } from '../../data/localizedData';
import { SERVICE_ID_TO_LANDING_SLUG } from '../../utils/routing';
import { X, CheckCircle2, PackageCheck, Users, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onRequestQuote: (service: ServiceItem) => void;
  onOpenServicePage?: (slug: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onRequestQuote,
  onOpenServicePage,
}) => {
  const { isBengali, pick } = useLanguage();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!service) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;
  const loc = localizeService(service, isBengali);
  const landingSlug = loc.landingSlug || SERVICE_ID_TO_LANDING_SLUG[loc.id];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1730]/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-detail-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#D7E2F3] dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#D7E2F3] dark:border-slate-800 bg-[#F4F8FF]/70 dark:bg-slate-950/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
              {loc.categoryLabel}
            </span>
            <h3 id="service-detail-title" className="text-xl sm:text-2xl font-extrabold text-[#0B1730] dark:text-white mt-0.5">
              {loc.title}
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={pick('Close service modal', 'বন্ধ করুন')}
            className="p-2 text-[#5F6D82] hover:text-[#0B1730] dark:hover:text-slate-200 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#5F6D82] dark:text-slate-300">
          <div>
            <h4 className="font-bold text-[#0B1730] dark:text-white mb-1.5 text-xs uppercase tracking-wider">
              {pick('Service Overview', 'সেবার সংক্ষিপ্ত বিবরণ')}
            </h4>
            <p className="leading-relaxed">{loc.fullDesc}</p>
          </div>

          <div>
            <h4 className="font-bold text-[#0B1730] dark:text-white mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0345A4] dark:text-sky-400" />
              <span>{pick('Included Scope & Activities', 'অন্তর্ভুক্ত কার্যক্রম ও পরিধি')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {loc.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-[#F4F8FF] dark:bg-slate-800/60 p-2.5 rounded-xl border border-[#D7E2F3] dark:border-slate-800 text-[#0B1730] dark:text-slate-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0345A4] mt-1.5 shrink-0" />
                  <span className="text-xs font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {loc.deliverables && loc.deliverables.length > 0 && (
            <div>
              <h4 className="font-bold text-[#0B1730] dark:text-white mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-[#0A63D8] dark:text-sky-400" />
                <span>{pick('Key Deliverables', 'মূল ডেলিভারেবলস')}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {loc.deliverables.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-[#F4F8FF] dark:bg-sky-950/60 text-[#0345A4] dark:text-sky-300 text-xs font-semibold border border-[#D7E2F3] dark:border-sky-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {loc.techSpecs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F4F8FF]/60 dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700">
                <span className="font-bold text-[#0B1730] dark:text-white block mb-0.5">
                  {pick('Delivery Format', 'সেবা প্রদানের ধরন')}
                </span>
                <span>{loc.techSpecs.delivery}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F8FF]/60 dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700">
                <span className="font-bold text-[#0B1730] dark:text-white block mb-0.5">
                  {pick('Compliance Alignment', 'বিধিবদ্ধ মানদণ্ড')}
                </span>
                <span>{loc.techSpecs.compliance}</span>
              </div>
            </div>
          )}

          <div className="bg-[#F4F8FF] dark:bg-slate-800/80 p-3.5 rounded-xl border border-[#D7E2F3] dark:border-slate-700 flex items-start gap-3">
            <Users className="w-5 h-5 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0B1730] dark:text-white text-xs block">
                {pick('Best Suited For:', 'যাদের জন্য উপযোগী:')}
              </span>
              <span className="text-xs">{loc.idealFor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs bg-[#F4F8FF] dark:bg-slate-800 p-3.5 rounded-xl border border-[#D7E2F3] dark:border-slate-700">
            <span className="flex items-center gap-1.5 text-[#0B1730] dark:text-slate-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#0345A4] dark:text-sky-400" />
              <span>
                {loc.startingRate
                  ? `${pick('Indicative Rate:', 'নির্দেশক মূল্য:')} ${loc.startingRate}`
                  : pick(
                      'Final scope & quotation confirmed after discovery call.',
                      'আলোচনার পর চূড়ান্ত কাজের পরিধি ও কোটেশন নির্ধারণ করা হয়।'
                    )}
              </span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F4F8FF] dark:bg-slate-800/80 border-t border-[#D7E2F3] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5F6D82] dark:text-slate-400 hover:text-[#0B1730] dark:hover:text-white cursor-pointer"
            >
              {pick('Close', 'বন্ধ করুন')}
            </button>

            {landingSlug && onOpenServicePage && (
              <a
                href={`/services/${landingSlug}`}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onClose();
                    onOpenServicePage(landingSlug);
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:underline"
              >
                <span>{pick('Full Service Page', 'পূর্ণাঙ্গ সেবা পেজ')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRequestQuote(service)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>{pick('Request Consultation', 'পরামর্শের অনুরোধ করুন')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


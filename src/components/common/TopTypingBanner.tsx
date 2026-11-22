import React, { useState, useEffect } from 'react';
import { ArrowRight, Tag, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface TopTypingBannerProps {
  onClaimOffer: () => void;
}

export const TopTypingBanner: React.FC<TopTypingBannerProps> = ({ onClaimOffer }) => {
  const { isBengali, pick } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  const fullText = pick(
    '25% off for new clients and students',
    'নতুন ক্লায়েন্ট ও শিক্ষার্থীদের জন্য ২৫% ছাড়'
  );

  const [charCount, setCharCount] = useState<number>(fullText.length);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing');

  // Reset typing sequence when language changes
  useEffect(() => {
    if (prefersReducedMotion) {
      setCharCount(fullText.length);
      return;
    }
    setCharCount(0);
    setPhase('typing');
  }, [fullText, prefersReducedMotion]);

  // Live typing / pausing / erasing loop
  useEffect(() => {
    if (prefersReducedMotion || dismissed) {
      setCharCount(fullText.length);
      return;
    }

    let timeoutId: number;

    if (phase === 'typing') {
      if (charCount < fullText.length) {
        timeoutId = window.setTimeout(() => {
          setCharCount((prev) => prev + 1);
        }, 55);
      } else {
        timeoutId = window.setTimeout(() => {
          setPhase('pausing');
        }, 2800);
      }
    } else if (phase === 'pausing') {
      timeoutId = window.setTimeout(() => {
        setPhase('erasing');
      }, 300);
    } else {
      if (charCount > 0) {
        timeoutId = window.setTimeout(() => {
          setCharCount((prev) => Math.max(0, prev - 1));
        }, 28);
      } else {
        timeoutId = window.setTimeout(() => {
          setPhase('typing');
        }, 350);
      }
    }

    return () => window.clearTimeout(timeoutId);
  }, [charCount, phase, fullText, prefersReducedMotion, dismissed]);

  if (dismissed) return null;

  const displayedText = prefersReducedMotion
    ? fullText
    : fullText.slice(0, charCount);

  return (
    <div
      role="region"
      aria-label={pick('Promotional Offer', 'বিশেষ অফার')}
      className="relative z-30 bg-gradient-to-r from-[#02377F] via-[#0345A4] to-[#02377F] text-white border-b border-white/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        <div className="w-6 hidden sm:block shrink-0" aria-hidden="true" />

        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 min-h-[22px] text-center mx-auto">
          <Tag className="w-3.5 h-3.5 text-sky-300 shrink-0" aria-hidden="true" />

          <p
            className={`text-xs sm:text-[13px] font-semibold tracking-tight text-white inline-flex items-center ${
              isBengali ? 'font-bangla' : ''
            }`}
            aria-label={fullText}
          >
            <span>{displayedText}</span>
            {!prefersReducedMotion && (
              <span
                aria-hidden="true"
                className="animate-typing-cursor inline-block w-[2px] h-3.5 bg-sky-300 ml-0.5 align-middle"
              />
            )}
          </p>

          <button
            type="button"
            onClick={onClaimOffer}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 border border-white/20 ${
              isBengali ? 'font-bangla' : ''
            }`}
          >
            <span>{pick('Claim Offer', 'অফার নিন')}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={pick('Dismiss announcement', 'বিজ্ঞপ্তি বন্ধ করুন')}
          className="p-1 rounded-md text-sky-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

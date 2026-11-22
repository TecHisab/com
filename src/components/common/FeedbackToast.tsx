import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFeedback } from '../../context/FeedbackContext';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, Sparkles, GraduationCap, X } from 'lucide-react';

export const FeedbackToast: React.FC = () => {
  const { activeFeedback, dismissFeedback } = useFeedback();
  const { pick } = useLanguage();

  return (
    <div
      id="feedback-toast-container"
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-24 right-4 sm:right-8 z-50 pointer-events-none select-none max-w-md w-[calc(100vw-2rem)]"
    >
      <AnimatePresence>
        {activeFeedback && (
          <motion.div
            key={activeFeedback.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-500/40 p-4 relative overflow-hidden"
          >
            {/* Top border highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

            <div className="flex items-start gap-3">
              {/* Icon badge with pulsing ring */}
              <div className="relative shrink-0 mt-0.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  {activeFeedback.type === 'trial' ? (
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : activeFeedback.type === 'enroll' ? (
                    <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              </div>

              {/* Text info */}
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeFeedback.title}
                  </h4>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                    {pick('Confirmed', 'নিশ্চিত')}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                  {activeFeedback.message}
                </p>
                {activeFeedback.details && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {activeFeedback.details}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={dismissFeedback}
                aria-label={pick('Dismiss notification', 'বিজ্ঞপ্তি বন্ধ করুন')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

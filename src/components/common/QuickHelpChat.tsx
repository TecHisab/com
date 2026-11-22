import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE_CONFIG } from '../../data/siteData';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Mail,
} from 'lucide-react';

export const QuickHelpChat: React.FC = () => {
  const { t, isBengali } = useLanguage();
  const qh = t.quickHelp;

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('General');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const buildSummary = () =>
    [
      `TecHisab Consultation Inquiry`,
      `Name: ${name.trim()}`,
      `Contact: ${contact.trim()}`,
      `Category: ${category}`,
      `Message: ${message.trim()}`,
    ].join('\n');

  const whatsappDeepLink = () =>
    `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(buildSummary())}`;

  const mailtoLink = () =>
    `mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent(
      `TecHisab Inquiry (${category}) - ${name.trim()}`
    )}&body=${encodeURIComponent(buildSummary())}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setErrorMessage(qh.validationError);
      return;
    }
    setErrorMessage(null);
    setIsSubmitted(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback ignored cleanly
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setMessage('');
    setErrorMessage(null);
  };

  return (
    <aside id="quick-help-chat-root" className="fixed bottom-5 right-5 z-50 select-none" aria-label="Quick Consultation Desk">
      {!isOpen && (
        <button
          type="button"
          id="quick-help-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label={qh.buttonLabel}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0345A4] hover:bg-[#02377F] text-white font-semibold text-sm shadow-lg shadow-[#0345A4]/25 hover:shadow-xl active:scale-95 transition-all cursor-pointer border border-white/15"
        >
          <MessageSquare className="w-4 h-4" />
          <span className={isBengali ? 'font-bangla font-bold' : ''}>{qh.buttonLabel}</span>
        </button>
      )}

      {isOpen && (
        <div
          id="quick-help-chat-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-help-modal-title"
          className="w-[calc(100vw-2rem)] sm:w-[370px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#D7E2F3] dark:border-slate-800 overflow-hidden flex flex-col max-h-[600px]"
        >
          <div className="bg-gradient-to-r from-[#0345A4] to-[#02377F] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white font-extrabold text-sm">
                TH
              </div>
              <div>
                <h3
                  id="quick-help-modal-title"
                  className={`text-sm font-bold tracking-tight ${isBengali ? 'font-bangla' : ''}`}
                >
                  {qh.headerTitle}
                </h3>
                <p className="text-[11px] text-sky-100/85">
                  {qh.statusOnline}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="quick-help-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label={qh.closeAria}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-2 bg-[#F4F8FF] dark:bg-slate-800/60 border-b border-[#D7E2F3] dark:border-slate-800 text-[11px] text-[#5F6D82] dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-[#0345A4] dark:text-sky-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{qh.statusSub}</span>
            </span>
            <span className="text-[10px] font-semibold">{qh.directChannel}</span>
          </div>

          <div className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
            {isSubmitted ? (
              <div className="py-4 px-1 text-center space-y-3" role="status" aria-live="polite">
                <div className="w-12 h-12 bg-[#F4F8FF] dark:bg-emerald-950/60 text-[#0345A4] dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-[#D7E2F3] dark:border-emerald-800">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold text-[#0B1730] dark:text-white ${isBengali ? 'font-bangla' : ''}`}>
                    {qh.successTitle}
                  </h4>
                  <p className="text-xs text-[#5F6D82] dark:text-slate-300 leading-relaxed">
                    {qh.successDesc}
                  </p>
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <a
                    href={whatsappDeepLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{qh.directChatWhatsApp}</span>
                  </a>

                  <a
                    href={mailtoLink()}
                    className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-semibold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{qh.openEmailDraft}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0B1730] dark:text-slate-200 border border-[#D7E2F3] dark:border-slate-700 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? qh.copiedText : qh.copyBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-1.5 text-[11px] text-[#5F6D82] hover:text-[#0345A4] font-semibold cursor-pointer"
                  >
                    {qh.sendAnotherBtn}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0B1730] dark:text-slate-200 leading-relaxed border border-[#D7E2F3] dark:border-slate-700">
                  <p className={`text-[11px] ${isBengali ? 'font-bangla' : ''}`}>
                    {qh.welcomeGreeting}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2" role="alert">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6D82]">
                    {qh.quickPromptsTitle}
                  </span>
                  <div className="flex flex-col gap-1">
                    {[qh.prompt1, qh.prompt2, qh.prompt3, qh.prompt4].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setMessage(p)}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 hover:bg-[#D7E2F3]/50 dark:hover:bg-slate-750 text-[#0345A4] dark:text-sky-300 border border-[#D7E2F3] dark:border-slate-700 text-[11px] transition-colors truncate cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2.5 pt-1" noValidate>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="qh-name" className="block text-[10px] font-bold text-[#0B1730] dark:text-slate-300 mb-0.5">
                        {qh.yourName}
                      </label>
                      <input
                        id="qh-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={qh.namePlaceholder}
                        className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4]"
                      />
                    </div>

                    <div>
                      <label htmlFor="qh-contact" className="block text-[10px] font-bold text-[#0B1730] dark:text-slate-300 mb-0.5">
                        {qh.yourContact}
                      </label>
                      <input
                        id="qh-contact"
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={qh.contactPlaceholder}
                        className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="qh-category" className="block text-[10px] font-bold text-[#0B1730] dark:text-slate-300 mb-0.5">
                      {qh.serviceType}
                    </label>
                    <select
                      id="qh-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4]"
                    >
                      <option value="General">{qh.categoryGeneral}</option>
                      <option value="Tax & VAT">{qh.categoryTax}</option>
                      <option value="Accounting">{qh.categoryAccounting}</option>
                      <option value="Software Demo">{qh.categorySoftware}</option>
                      <option value="Training">{qh.categoryTraining}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="qh-message" className="block text-[10px] font-bold text-[#0B1730] dark:text-slate-300 mb-0.5">
                      {qh.yourMessage} *
                    </label>
                    <textarea
                      id="qh-message"
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={qh.messagePlaceholder}
                      className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4] resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{qh.sendBtn}</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="p-3 bg-[#F4F8FF] dark:bg-slate-850 border-t border-[#D7E2F3] dark:border-slate-800 flex items-center justify-between text-[11px]">
            <a
              href={SITE_CONFIG.contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${SITE_CONFIG.contact.phone}`}
              className="inline-flex items-center gap-1 text-[#0B1730] dark:text-slate-300 font-semibold hover:text-[#0345A4]"
            >
              <Phone className="w-3 h-3" />
              <span>{SITE_CONFIG.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </aside>
  );
};

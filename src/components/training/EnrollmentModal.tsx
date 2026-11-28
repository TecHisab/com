import React, { useState, useEffect, useRef } from 'react';
import { TrainingCourse } from '../../types';
import { X, CheckCircle2, BookOpen, Send, AlertCircle, MessageCircle, Mail, Copy } from 'lucide-react';
import { getLocalizedSiteConfig, localizeCourse } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { useFeedback } from '../../context/FeedbackContext';
import { trackConversion } from '../../utils/analytics';

interface EnrollmentModalProps {
  course: TrainingCourse | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  course,
  onClose,
  onSuccess,
}) => {
  const { isBengali, pick } = useLanguage();
  const site = getLocalizedSiteConfig(isBengali);
  const { showFeedback } = useFeedback();
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [batchPreference, setBatchPreference] = useState('weekend-online');

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!course) return;

    setSubmitted(false);
    setErrorMessage(null);
    setFieldErrors({});

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
  }, [course, onClose]);

  if (!course) return null;
  const loc = localizeCourse(course, isBengali);

  const getBatchLabel = (val: string) => {
    if (val === 'weekend-online') {
      return pick('Weekend Online / Live Batch', 'সাপ্তাহিক ছুটির দিন অনলাইন / লাইভ ব্যাচ');
    }
    if (val === 'weekday-evening') {
      return pick('Weekday Evening Batch', 'কর্মদিবস সান্ধ্যকালীন ব্যাচ');
    }
    return pick('Chittagong Office Practical Batch', 'চট্টগ্রাম অফিস প্র্যাকটিক্যাল ব্যাচ');
  };

  const buildEnrollmentSummary = () =>
    [
      pick('TecHisab Training Admission Inquiry', 'টেকহিসাব প্রশিক্ষণ ভর্তির অনুরোধ'),
      `${pick('Course', 'কোর্স')}: ${loc.title}`,
      `${pick('Course Fee', 'কোর্স ফি')}: ${loc.feeDisplay}`,
      `${pick('Name', 'নাম')}: ${studentName.trim()}`,
      `${pick('Phone', 'ফোন')}: ${studentPhone.trim()}`,
      `${pick('Email', 'ইমেইল')}: ${studentEmail.trim()}`,
      `${pick('Preferred Schedule', 'পছন্দের সময়সূচি')}: ${getBatchLabel(batchPreference)}`,
    ].join('\n');

  const whatsappUrl = `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(
    buildEnrollmentSummary()
  )}`;

  const mailtoUrl = `mailto:${site.contact.email}?subject=${encodeURIComponent(
    `Training Inquiry: ${loc.title} - ${studentName.trim()}`
  )}&body=${encodeURIComponent(buildEnrollmentSummary())}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!studentName.trim() || studentName.trim().length < 2) {
      errors.studentName = pick('Please enter your full name.', 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
    }
    if (!studentEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim())) {
      errors.studentEmail = pick(
        'Please provide a valid email address.',
        'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।'
      );
    }
    if (!studentPhone.trim() || studentPhone.trim().length < 7) {
      errors.studentPhone = pick(
        'Please provide a contact phone number.',
        'অনুগ্রহ করে একটি যোগাযোগের ফোন নম্বর দিন।'
      );
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage(
        pick('Please complete all required fields.', 'অনুগ্রহ করে প্রয়োজনীয় সকল ঘর পূরণ করুন।')
      );
      return;
    }

    setErrorMessage(null);
    setFieldErrors({});
    setSubmitted(true);
    trackConversion('training_enrollment_submit', { category: 'training', label: course.id });
    showFeedback({
      type: 'enroll',
      title: pick('Admission Summary Prepared', 'ভর্তির সারসংক্ষেপ প্রস্তুত হয়েছে'),
      message: pick(
        `Choose WhatsApp or Email to send your enrollment inquiry for "${loc.title}".`,
        `"${loc.title}" কোর্সে ভর্তির অনুরোধ পাঠাতে হোয়াটসঅ্যাপ বা ইমেইল নির্বাচন করুন।`
      ),
    });
    onSuccess?.();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildEnrollmentSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unsupported fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1730]/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrollment-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#D7E2F3] dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#D7E2F3] dark:border-slate-800 bg-[#F4F8FF]/70 dark:bg-slate-950/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
              {pick('TecHisab Training Admission', 'টেকহিসাব প্রশিক্ষণ ভর্তি')}
            </span>
            <h3 id="enrollment-modal-title" className="text-xl sm:text-2xl font-extrabold text-[#0B1730] dark:text-white mt-0.5">
              {loc.title}
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={pick('Close modal', 'বন্ধ করুন')}
            className="p-2 text-[#5F6D82] hover:text-[#0B1730] dark:hover:text-slate-200 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#5F6D82] dark:text-slate-300">
          {submitted ? (
            <div className="text-center py-6 space-y-4" role="status" aria-live="polite">
              <div className="w-14 h-14 bg-[#F4F8FF] dark:bg-emerald-950/60 text-[#0345A4] dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-[#D7E2F3]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#0B1730] dark:text-white">
                {pick('Send Your Admission Request', 'আপনার ভর্তির অনুরোধ পাঠান')}
              </h4>
              <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {pick(
                  `Your enrollment summary for ${loc.title} (${loc.feeDisplay}) is ready. Send it directly via WhatsApp or Email to confirm upcoming batch schedules and seats.`,
                  `${loc.title} (${loc.feeDisplay}) কোর্সের জন্য আপনার ভর্তির তথ্য প্রস্তুত। আসন্ন ব্যাচের সময়সূচি ও আসন নিশ্চিত করতে সরাসরি হোয়াটসঅ্যাপ বা ইমেইলে পাঠান।`
                )}
              </p>

              <div className="p-4 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span>{pick('Applicant:', 'আবেদনকারী:')}</span>
                  <span className="font-bold text-[#0B1730] dark:text-white">{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>{pick('Preferred Batch:', 'পছন্দের ব্যাচ:')}</span>
                  <span className="font-semibold text-[#0B1730] dark:text-white">
                    {getBatchLabel(batchPreference)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{pick('Course Fee:', 'কোর্স ফি:')}</span>
                  <span className="font-bold text-[#0345A4] dark:text-sky-400">{loc.feeDisplay}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackConversion('whatsapp_click', { label: `enroll-${course.id}` })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{pick('Send on WhatsApp', 'হোয়াটসঅ্যাপে পাঠান')}</span>
                </a>

                <a
                  href={mailtoUrl}
                  onClick={() => trackConversion('email_click', { label: `enroll-${course.id}` })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold text-xs shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>{pick('Send via Email', 'ইমেইলে পাঠান')}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0B1730] dark:text-slate-200 border border-[#D7E2F3] dark:border-slate-700 font-semibold text-xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? pick('Copied!', 'কপি হয়েছে!') : pick('Copy Details', 'তথ্য কপি করুন')}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#F4F8FF] dark:bg-slate-800/60 p-3.5 rounded-xl border border-[#D7E2F3] dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[#5F6D82] block text-[10px] uppercase font-bold">
                    {pick('Duration', 'মেয়াদ')}
                  </span>
                  <span className="font-bold text-[#0B1730] dark:text-slate-200">{loc.duration}</span>
                </div>
                <div>
                  <span className="text-[#5F6D82] block text-[10px] uppercase font-bold">
                    {pick('Sessions', 'ক্লাস সংখ্যা')}
                  </span>
                  <span className="font-bold text-[#0B1730] dark:text-slate-200">{loc.sessions}</span>
                </div>
                <div>
                  <span className="text-[#5F6D82] block text-[10px] uppercase font-bold">
                    {pick('Schedule', 'সময়সূচি')}
                  </span>
                  <span className="font-bold text-[#0B1730] dark:text-slate-200">{loc.nextBatch}</span>
                </div>
                <div>
                  <span className="text-[#0345A4] dark:text-sky-400 block text-[10px] uppercase font-bold">
                    {pick('Program Fee', 'কোর্স ফি')}
                  </span>
                  <span className="font-extrabold text-[#0345A4] dark:text-sky-300">{loc.feeDisplay}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0B1730] dark:text-white mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#0345A4] dark:text-sky-400" />
                  <span>{pick('Course Curriculum & Topics', 'কোর্স সিলেবাস ও আলোচ্য বিষয়')}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {loc.curriculum.map((module, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-[#F4F8FF]/70 dark:bg-slate-800/40 p-2.5 rounded-xl border border-[#D7E2F3] dark:border-slate-800 text-xs text-[#0B1730] dark:text-slate-200"
                    >
                      <span className="font-mono text-[#0345A4] dark:text-sky-400 font-bold">{i + 1}.</span>
                      <span>{module}</span>
                    </div>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-[#D7E2F3] dark:border-slate-800" noValidate>
                <h4 className="font-bold text-[#0B1730] dark:text-white text-xs uppercase tracking-wider">
                  {pick('Participant Details', 'শিক্ষার্থীর তথ্য')}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="enr-name" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                      {pick('Full Name', 'পূর্ণ নাম')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="enr-name"
                      type="text"
                      required
                      placeholder={pick('Your full name', 'আপনার পূর্ণ নাম')}
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        if (fieldErrors.studentName) setFieldErrors((prev) => ({ ...prev, studentName: '' }));
                      }}
                      className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl p-2.5 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4] ${
                        fieldErrors.studentName ? 'border-rose-400' : 'border-[#D7E2F3] dark:border-slate-700'
                      }`}
                    />
                    {fieldErrors.studentName && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.studentName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="enr-phone" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                      {pick('Phone / WhatsApp', 'ফোন / হোয়াটসঅ্যাপ')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="enr-phone"
                      type="tel"
                      required
                      placeholder="+880 1XXX-XXXXXX"
                      value={studentPhone}
                      onChange={(e) => {
                        setStudentPhone(e.target.value);
                        if (fieldErrors.studentPhone) setFieldErrors((prev) => ({ ...prev, studentPhone: '' }));
                      }}
                      className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl p-2.5 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4] ${
                        fieldErrors.studentPhone ? 'border-rose-400' : 'border-[#D7E2F3] dark:border-slate-700'
                      }`}
                    />
                    {fieldErrors.studentPhone && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.studentPhone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="enr-email" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                      {pick('Email Address', 'ইমেইল ঠিকানা')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="enr-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={studentEmail}
                      onChange={(e) => {
                        setStudentEmail(e.target.value);
                        if (fieldErrors.studentEmail) setFieldErrors((prev) => ({ ...prev, studentEmail: '' }));
                      }}
                      className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl p-2.5 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4] ${
                        fieldErrors.studentEmail ? 'border-rose-400' : 'border-[#D7E2F3] dark:border-slate-700'
                      }`}
                    />
                    {fieldErrors.studentEmail && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.studentEmail}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="enr-batch" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                      {pick('Preferred Format', 'পছন্দের ক্লাস মাধ্যম')}
                    </label>
                    <select
                      id="enr-batch"
                      value={batchPreference}
                      onChange={(e) => setBatchPreference(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 rounded-xl p-2.5 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4]"
                    >
                      <option value="weekend-online">
                        {pick('Weekend Online / Live Batch', 'সাপ্তাহিক ছুটির দিন অনলাইন / লাইভ ব্যাচ')}
                      </option>
                      <option value="weekday-evening">
                        {pick('Weekday Evening Batch', 'কর্মদিবস সান্ধ্যকালীন ব্যাচ')}
                      </option>
                      <option value="in-person-chittagong">
                        {pick('Chittagong Office Practical Batch', 'চট্টগ্রাম অফিস প্র্যাকটিক্যাল ব্যাচ')}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-[#5F6D82] hover:text-[#0B1730] cursor-pointer"
                  >
                    {pick('Cancel', 'বাতিল করুন')}
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{pick('Continue to Send Inquiry', 'অনুরোধ পাঠাতে এগিয়ে যান')}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


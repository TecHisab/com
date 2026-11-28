import React from 'react';
import { BlogPost } from '../../types';
import { getBlogCategoryLabel, localizeBlogPost } from '../../data/localizedData';
import { getServiceLandingBySlug } from '../../data/serviceLandingData';
import { useLanguage } from '../../context/LanguageContext';
import { CtaBanner } from '../common/CtaBanner';
import { trackConversion } from '../../utils/analytics';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
} from 'lucide-react';

interface BlogArticlePageProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBackToBlog: () => void;
  onSelectArticleSlug: (slug: string) => void;
  onSelectServiceSlug: (slug: string) => void;
  onOpenContact: () => void;
}

export const BlogArticlePage: React.FC<BlogArticlePageProps> = ({
  post,
  allPosts,
  onBackToBlog,
  onSelectArticleSlug,
  onSelectServiceSlug,
  onOpenContact,
}) => {
  const { isBengali, pick } = useLanguage();
  const loc = localizeBlogPost(post, isBengali);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, cb: () => void) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    cb();
  };

  const relatedServices = (loc.relatedServiceSlugs || [])
    .map((slug) => getServiceLandingBySlug(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const relatedArticles = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => localizeBlogPost(p, isBengali));

  return (
    <article className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-7 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href="/blog"
              onClick={(e) => handleLinkClick(e, onBackToBlog)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{pick('All Knowledge Articles', 'সকল প্রবন্ধ ও গাইড')}</span>
            </a>

            <div className="flex items-center gap-2 text-xs text-[#5F6D82] dark:text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-[#F4F8FF] dark:bg-sky-950/60 border border-[#D7E2F3] dark:border-sky-800 font-bold text-[#0345A4] dark:text-sky-300">
                {getBlogCategoryLabel(loc.category, isBengali)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {loc.readTime}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1730] dark:text-white tracking-tight leading-tight">
            {loc.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5F6D82] dark:text-slate-300 leading-relaxed">
            {loc.summary}
          </p>

          {/* Author & Dates Metadata Bar */}
          <div className="p-4 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/80 border border-[#D7E2F3] dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0345A4] text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0B1730] dark:text-white">{loc.author.name}</div>
                <div className="text-[#5F6D82] dark:text-slate-400">
                  {loc.author.role}
                  {loc.author.credentials ? ` • ${loc.author.credentials}` : ''}
                </div>
              </div>
            </div>

            <div className="text-right text-[#5F6D82] dark:text-slate-400 space-y-0.5">
              <div className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {pick('Published:', 'প্রকাশিত:')} <strong className="text-[#0B1730] dark:text-white">{loc.date}</strong>
                </span>
              </div>
              {loc.updatedAt && (
                <div className="text-[11px]">
                  {pick('Reviewed:', 'সর্বশেষ পর্যালোচনা:')} {loc.updatedAt}
                </div>
              )}
            </div>
          </div>

          {/* Key Takeaways */}
          {loc.keyTakeaways.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#F4F8FF]/75 dark:bg-slate-800/50 border border-[#D7E2F3] dark:border-slate-700 space-y-2.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0345A4] dark:text-sky-400">
                {pick('Key Takeaways', 'মূল শিক্ষণীয় বিষয়সমূহ')}
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm">
                {loc.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[#0B1730] dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Body Paragraphs + Structured H2 Sections */}
          <div className="space-y-6 text-sm sm:text-base text-[#5F6D82] dark:text-slate-300 leading-relaxed">
            {loc.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {loc.sections?.map((sec, idx) => (
              <section key={idx} className="space-y-2.5 pt-2">
                <h2 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </section>
            ))}
          </div>

          {/* Statutory Educational Notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {pick(
                'Educational Notice: Tax thresholds, rebates, and VAT SRO provisions vary by Assessment Year under current Bangladesh legislation. Confirm official updates before statutory submission.',
                'শিক্ষামূলক নোট: প্রচলিত বাংলাদেশ আইন ও অর্থ আইন অনুযায়ী করবর্ষ ভেদে করসীমা, রেয়াত ও ভ্যাট বিধি পরিবর্তিত হতে পারে। দাখিলের পূর্বে সরকারি সর্বশেষ বিধি যাচাই করুন।'
              )}
            </span>
          </div>
        </div>

        {/* Related Services Internal Links */}
        {relatedServices.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#0345A4] dark:text-sky-400">
              <Briefcase className="w-5 h-5" />
              <h2 className="text-lg font-extrabold text-[#0B1730] dark:text-white">
                {pick('Related TecHisab Services', 'সংশ্লিষ্ট টেকহিসাব সেবাসমূহ')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedServices.map((svc) => (
                <a
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  onClick={(e) => handleLinkClick(e, () => onSelectServiceSlug(svc.slug))}
                  className="p-4 rounded-xl bg-[#F4F8FF]/70 dark:bg-slate-800/60 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] transition-colors flex flex-col justify-between gap-2"
                >
                  <h3 className="text-sm font-bold text-[#0B1730] dark:text-white">
                    {isBengali ? svc.h1Bn : svc.h1}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0345A4] dark:text-sky-400">
                    <span>{pick('View Service', 'সেবা দেখুন')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* More Articles */}
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold text-[#0B1730] dark:text-white">
            {pick('More Practical Guides', 'আরও প্র্যাকটিক্যাল গাইড পড়ুন')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((item) => (
              <a
                key={item.slug}
                href={`/blog/${item.slug}`}
                onClick={(e) => handleLinkClick(e, () => onSelectArticleSlug(item.slug))}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4] transition-colors flex flex-col justify-between gap-2"
              >
                <span className="text-[11px] font-bold text-[#0A63D8] dark:text-sky-400">
                  {getBlogCategoryLabel(item.category, isBengali)}
                </span>
                <h3 className="text-sm font-bold text-[#0B1730] dark:text-white leading-snug">
                  {item.title}
                </h3>
                <span className="text-xs font-semibold text-[#0345A4] dark:text-sky-400 inline-flex items-center gap-1">
                  <span>{pick('Read Guide', 'বিস্তারিত পড়ুন')}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <CtaBanner
          onPrimaryClick={() => {
            trackConversion('cta_click', {
              location: `/blog/${loc.slug}`,
              label: 'blog-bottom-cta',
            });
            onOpenContact();
          }}
        />
      </div>
    </article>
  );
};

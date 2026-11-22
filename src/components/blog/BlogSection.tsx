import React, { useState, useEffect } from 'react';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../../data/blogData';
import {
  getLocalizedBlogPosts,
  localizeBlogPost,
  getBlogCategoryLabel,
} from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { BlogPost } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { Calendar, Clock, User, ArrowRight, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BlogSectionProps {
  selectedPost?: BlogPost | null;
  onSelectPost?: (post: BlogPost | null) => void;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  selectedPost: controlledPost,
  onSelectPost,
  activeCategory: controlledCategory,
  onSelectCategory,
}) => {
  const { isBengali, pick } = useLanguage();
  const [internalPost, setInternalPost] = useState<BlogPost | null>(null);
  const [internalCategory, setInternalCategory] = useState<string>('all');

  const selectedPost = controlledPost !== undefined ? controlledPost : internalPost;
  const setSelectedPost = onSelectPost || setInternalPost;

  const activeCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;
  const setActiveCategory = onSelectCategory || setInternalCategory;

  const localizedPosts = getLocalizedBlogPosts(isBengali);
  const filteredPosts =
    activeCategory === 'all'
      ? localizedPosts
      : localizedPosts.filter((p) => p.category === activeCategory);

  const localizedSelectedPost = selectedPost ? localizeBlogPost(selectedPost, isBengali) : null;

  useEffect(() => {
    if (!selectedPost) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPost(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost, setSelectedPost]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeading
          badge={pick('Knowledge & Articles', 'জ্ঞানভাণ্ডার ও প্রবন্ধসমূহ')}
          title={pick(
            'Accounting, Bangladesh Tax, VAT & Technology Guides',
            'অ্যাকাউন্টিং, বাংলাদেশ ট্যাক্স, ভ্যাট ও প্রযুক্তি গাইড'
          )}
          subtitle={pick(
            'Practical reference guides across finance, NBR rules, Excel & Google Sheets automation, QuickBooks/Xero, and modern business management.',
            'ফাইন্যান্স, এনবিআর বিধিমালা, এক্সেল ও গুগল শিটস অটোমেশন, কুইকবুকস/জেরো এবং আধুনিক ব্যবসা পরিচালনার ওপর প্র্যাকটিক্যাল রেফারেন্স গাইড।'
          )}
        />

        {/* Categories + All Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeCategory === 'all'
                ? 'bg-[#0345A4] text-white border-[#0345A4]'
                : 'bg-white dark:bg-slate-900 text-[#5F6D82] dark:text-slate-300 border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4]'
            }`}
          >
            {pick(`All Articles (${BLOG_POSTS.length})`, `সকল নিবন্ধ (${BLOG_POSTS.length})`)}
          </button>

          {BLOG_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeCategory === category
                  ? 'bg-[#0345A4] text-white border-[#0345A4]'
                  : 'bg-white dark:bg-slate-900 text-[#5F6D82] dark:text-slate-300 border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4]'
              }`}
            >
              {getBlogCategoryLabel(category, isBengali)}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 text-sm text-[#5F6D82]">
            {pick(
              'No articles match this category right now.',
              'এই বিভাগে বর্তমানে কোনো নিবন্ধ নেই।'
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0345A4]/70 transition-all flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#F4F8FF] dark:bg-sky-950/60 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-sky-800">
                      {getBlogCategoryLabel(post.category, isBengali)}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-[#5F6D82]">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#0B1730] dark:text-white group-hover:text-[#0345A4] dark:group-hover:text-sky-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#5F6D82] pt-3 border-t border-[#D7E2F3]/70 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium">{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-[#F4F8FF]/70 dark:bg-slate-800/40 border-t border-[#D7E2F3]/70 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:text-[#02377F] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{pick('Read Guide', 'বিস্তারিত পড়ুন')}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Full Article Reader Modal */}
        {localizedSelectedPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1730]/65 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#D7E2F3] dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[#D7E2F3] dark:border-slate-800 bg-[#F4F8FF]/80 dark:bg-slate-950/70 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
                    {getBlogCategoryLabel(localizedSelectedPost.category, isBengali)} &bull; {localizedSelectedPost.readTime}
                  </span>
                  <h3 id="article-modal-title" className="text-xl sm:text-2xl font-extrabold text-[#0B1730] dark:text-white mt-1">
                    {localizedSelectedPost.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  aria-label={pick('Close article', 'নিবন্ধ বন্ধ করুন')}
                  className="p-2 text-[#5F6D82] hover:text-[#0B1730] rounded-xl hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#5F6D82] dark:text-slate-300 leading-relaxed">
                <div className="p-3.5 bg-[#F4F8FF] dark:bg-slate-800 rounded-xl border border-[#D7E2F3] dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong className="text-[#0B1730] dark:text-white">{localizedSelectedPost.author.name}</strong>
                    <span className="block text-[11px]">{localizedSelectedPost.author.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="block">
                      {pick('Published:', 'প্রকাশিত:')} <strong>{localizedSelectedPost.date}</strong>
                    </span>
                    {localizedSelectedPost.updatedAt && (
                      <span className="block text-[11px]">
                        {pick('Reviewed:', 'পর্যালোচিত:')} {localizedSelectedPost.updatedAt}
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-semibold text-[#0B1730] dark:text-white">
                  {localizedSelectedPost.summary}
                </p>

                {localizedSelectedPost.keyTakeaways && localizedSelectedPost.keyTakeaways.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#F4F8FF]/70 dark:bg-slate-800/50 border border-[#D7E2F3] dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0345A4] dark:text-sky-400">
                      {pick('Key Takeaways', 'মূল শিক্ষণীয় বিষয়সমূহ')}
                    </h4>
                    <ul className="space-y-1.5 text-xs">
                      {localizedSelectedPost.keyTakeaways.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#0B1730] dark:text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3 text-xs sm:text-sm">
                  {localizedSelectedPost.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    {pick(
                      'Educational Note: Statutory tax slabs, rebates, and VAT SRO rates vary by Assessment Year under current Bangladesh legislation. Confirm assessment-year specifics with a qualified advisor before filing.',
                      'শিক্ষামূলক নোট: প্রচলিত বাংলাদেশ আইন অনুযায়ী করবর্ষ ভেদে আয়কর স্ল্যাব, বিনিয়োগ রেয়াত ও ভ্যাট এসআরও (SRO) হার পরিবর্তিত হতে পারে। রিটার্ন দাখিলের পূর্বে একজন অভিজ্ঞ পরামর্শকের সাথে সংশ্লিষ্ট করবর্ষের বিধান যাচাই করে নিন।'
                    )}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#F4F8FF] dark:bg-slate-800 border-t border-[#D7E2F3] dark:border-slate-700 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-semibold text-xs cursor-pointer"
                >
                  {pick('Close Article', 'নিবন্ধ বন্ধ করুন')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


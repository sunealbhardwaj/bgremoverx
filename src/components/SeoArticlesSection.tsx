import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X, Sparkles, Check, Share2, Tag, User } from 'lucide-react';
import { SEO_ARTICLES, SeoArticle } from '../data/seoArticles';

interface SeoArticlesSectionProps {
  onSelectArticleToRead?: (article: SeoArticle) => void;
}

export const SeoArticlesSection: React.FC<SeoArticlesSectionProps> = ({
  onSelectArticleToRead,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<SeoArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleOpenArticle = (article: SeoArticle) => {
    setSelectedArticle(article);
    if (onSelectArticleToRead) {
      onSelectArticleToRead(article);
    }
  };

  const handleShare = () => {
    if (navigator.share && selectedArticle) {
      navigator.share({
        title: selectedArticle.title,
        text: selectedArticle.metaDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="guides" className="py-10 md:py-14 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mastery Guides & Photography Knowledge Base</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pro Tips, Marketplace Standards & AI Workflows
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            In-depth guides on e-commerce catalog standards, passport photo biometrics, transparent web formats, and computer vision technology.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEO_ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Article Cover Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-500" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span>{article.publishedDate}</span>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl my-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                <span>{selectedArticle.category} Knowledge Guide</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-8">
              {/* Title & Author Meta */}
              <div className="space-y-4">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800 pb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                      {selectedArticle.author.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{selectedArticle.author}</span>
                      <span className="text-[10px] text-slate-400">{selectedArticle.authorRole}</span>
                    </div>
                  </div>
                  <span>•</span>
                  <span>Published on {selectedArticle.publishedDate}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden h-64 sm:h-80 shadow-md">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Sections */}
              <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {selectedArticle.content.map((sec, idx) => (
                  <div key={idx} className="space-y-4">
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                      {sec.heading}
                    </h2>

                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {sec.keyPoints && (
                      <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                          Key Takeaways
                        </span>
                        <ul className="space-y-1.5">
                          {sec.keyPoints.map((pt, ptIdx) => (
                            <li key={ptIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {sec.callout && (
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-xs sm:text-sm text-amber-900 dark:text-amber-200 italic font-medium">
                        {sec.callout}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Keywords Tag Cloud */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Related Topics & Keywords
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Box */}
              <div className="p-8 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-center space-y-4 shadow-xl">
                <h3 className="font-display font-extrabold text-2xl">
                  Ready to Try It on Your Own Photos?
                </h3>
                <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto">
                  BgRemoverX is 100% free with unlimited 4K exports. No account needed.
                </p>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-white text-indigo-600 font-display font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Removing Backgrounds Free</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

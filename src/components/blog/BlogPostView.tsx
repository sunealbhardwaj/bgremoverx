import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  ChevronRight,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ChevronDown,
  AlertTriangle,
  Lightbulb,
  Info,
  BookOpen,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { BlogPost, BlogSection } from '../../types/blog';
import { getRelatedBlogPosts } from '../../data/blogPosts';
import { BlogCard } from './BlogCard';
import { SocialShareButtons } from './SocialShareButtons';

interface BlogPostViewProps {
  post: BlogPost;
  onNavigate: (url: string) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const relatedPosts = getRelatedBlogPosts(post, 3);

  // Update SEO metadata and inject JSON-LD schemas
  useEffect(() => {
    document.title = `${post.seoTitle} | BGRemoverX`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', post.metaDescription);
    }

    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const currentUrl = `https://bgremoverx.com/blog/${post.slug}`;
    canonical.setAttribute('href', currentUrl);

    // OpenGraph Tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', post.seoTitle);
    updateOrCreateMeta('og:description', post.metaDescription);
    updateOrCreateMeta('og:image', post.coverImage);
    updateOrCreateMeta('og:url', currentUrl);
    updateOrCreateMeta('og:type', 'article');

    // JSON-LD Schemas: Article, BreadcrumbList, FAQPage
    const jsonLdScriptId = 'blog-post-jsonld';
    let scriptTag = document.getElementById(jsonLdScriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = jsonLdScriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const articleSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${currentUrl}#article`,
          isPartOf: {
            '@type': 'WebPage',
            '@id': currentUrl,
          },
          headline: post.title,
          description: post.metaDescription,
          image: [post.coverImage],
          datePublished: new Date(post.publishedDate).toISOString(),
          dateModified: new Date(post.modifiedDate).toISOString(),
          author: {
            '@type': 'Organization',
            name: post.author.name,
            url: 'https://bgremoverx.com',
          },
          publisher: {
            '@type': 'Organization',
            name: 'BGRemoverX',
            url: 'https://bgremoverx.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://bgremoverx.com/favicon.svg',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': currentUrl,
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${currentUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://bgremoverx.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: 'https://bgremoverx.com/blog',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: currentUrl,
            },
          ],
        },
        ...(post.faqs && post.faqs.length > 0
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${currentUrl}#faq`,
                mainEntity: post.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              },
            ]
          : []),
      ],
    };

    scriptTag.text = JSON.stringify(articleSchema);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      const existingScript = document.getElementById(jsonLdScriptId);
      if (existingScript) existingScript.remove();
    };
  }, [post]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const renderCallout = (callout: NonNullable<BlogSection['callout']>) => {
    switch (callout.type) {
      case 'tip':
        return (
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3.5">
            <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
              {callout.title && <strong className="block font-bold mb-1">{callout.title}</strong>}
              <span>{callout.text}</span>
            </div>
          </div>
        );
      case 'warning':
        return (
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              {callout.title && <strong className="block font-bold mb-1">{callout.title}</strong>}
              <span>{callout.text}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
              {callout.title && <strong className="block font-bold mb-1">{callout.title}</strong>}
              <span>{callout.text}</span>
            </div>
          </div>
        );
    }
  };

  const renderBoldText = (text: string): React.ReactNode => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={`${match.index}-${match[1]}`} className="font-semibold text-slate-900 dark:text-white">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const renderRichText = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderBoldText(text.substring(lastIndex, match.index)));
      }
      const anchorText = match[1];
      const url = match[2];
      const isInternal = url.startsWith('/') || url.includes('bgremoverx.com');

      parts.push(
        <button
          key={`${match.index}-${url}`}
          type="button"
          onClick={() => {
            if (isInternal) {
              const cleanPath = url.replace(/^https?:\/\/bgremoverx\.com/, '');
              onNavigate(cleanPath || '/');
            } else {
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          }}
          className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors inline cursor-pointer text-left"
        >
          {anchorText}
        </button>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(renderBoldText(text.substring(lastIndex)));
    }

    return parts;
  };

  return (
    <div className="py-6 sm:py-10 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => onNavigate('/blog')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Blog
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[220px] sm:max-w-md">
            {post.title}
          </span>
        </nav>

        {/* Back link */}
        <button
          onClick={() => onNavigate('/blog')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all blog articles</span>
        </button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
              {post.category}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            {post.title}
          </h1>

          {/* Author & Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                BX
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {post.author.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>Published {post.publishedDate}</span>
                </p>
              </div>
            </div>

            <SocialShareButtons
              url={`https://bgremoverx.com/blog/${post.slug}`}
              title={post.title}
              variant="compact"
              idPrefix="top-share"
            />
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-10 shadow-sm border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          <img
            src={post.coverImage}
            alt={post.coverImageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Table of Contents Box */}
        {post.tableOfContents && post.tableOfContents.length > 0 && (
          <aside className="mb-10 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 font-display text-sm font-bold text-slate-900 dark:text-white mb-3">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>In This Article (Table of Contents)</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              {post.tableOfContents.map((item, idx) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-1"
                  >
                    <span className="text-indigo-400 font-mono text-[11px]">{idx + 1}.</span>
                    <span className="hover:underline">{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Introduction */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 mb-10">
          {post.introParagraphs.map((p, idx) => (
            <p key={idx} className="leading-relaxed">
              {renderRichText(p)}
            </p>
          ))}
        </div>

        {/* Inline CTA Box */}
        <div className="my-10 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Need to remove a background from your own image?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Try BGRemoverX and create a clean transparent image online in 2 seconds.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
          >
            Remove Background
          </button>
        </div>

        {/* Main Article Sections */}
        <div className="space-y-12">
          {post.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug mb-4">
                {section.heading}
              </h2>

              {section.subheading && (
                <h3 className="font-display text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  {section.subheading}
                </h3>
              )}

              {section.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4"
                >
                  {renderRichText(p)}
                </p>
              ))}

              {/* Section illustrative image if present */}
              {section.image && (
                <figure className="my-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-xs">
                  <img
                    src={section.image.url}
                    alt={section.image.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[420px] object-cover"
                  />
                  {section.image.caption && (
                    <figcaption className="p-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/60 dark:border-slate-800 italic">
                      {section.image.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Numbered steps if present */}
              {section.numberedSteps && (
                <div className="my-6 space-y-4">
                  {section.numberedSteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4"
                    >
                      <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {renderRichText(step.text)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bullet points if present */}
              {section.bulletPoints && (
                <ul className="my-4 space-y-2 pl-2">
                  {section.bulletPoints.map((bp, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>{renderRichText(bp)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Subsections if present */}
              {section.subsections && section.subsections.length > 0 && (
                <div className="my-6 space-y-6 pl-1 sm:pl-3 border-l-2 border-indigo-100 dark:border-indigo-900/60">
                  {section.subsections.map((sub, subIdx) => (
                    <div key={subIdx} className="space-y-3">
                      <h4 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {sub.heading}
                      </h4>
                      {sub.paragraphs.map((subP, spIdx) => (
                        <p
                          key={spIdx}
                          className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                        >
                          {renderRichText(subP)}
                        </p>
                      ))}
                      {sub.bulletPoints && (
                        <ul className="space-y-1.5 pl-2">
                          {sub.bulletPoints.map((subBp, sbpIdx) => (
                            <li
                              key={sbpIdx}
                              className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2 leading-relaxed"
                            >
                              <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 mt-2 shrink-0" />
                              <span>{renderRichText(subBp)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Callout box if present */}
              {section.callout && renderCallout(section.callout)}

              {/* Table if present */}
              {section.table && (
                <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    {section.table.caption && (
                      <caption className="text-left text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 font-medium">
                        {section.table.caption}
                      </caption>
                    )}
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
                        {section.table.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className="py-3 px-4 font-bold text-slate-900 dark:text-white"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {section.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`py-3 px-4 ${
                                cIdx === 0
                                  ? 'font-semibold text-slate-900 dark:text-white'
                                  : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Common Mistakes & Solutions */}
        {post.commonMistakes && post.commonMistakes.length > 0 && (
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Common Mistakes and Practical Solutions</span>
            </h3>

            <div className="space-y-4">
              {post.commonMistakes.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60"
                >
                  <p className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">
                    Mistake: {item.mistake}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-600 dark:text-emerald-400">Fix: </strong>
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conclusion */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
            Summary & Final Thoughts
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {post.conclusionParagraphs.map((p, idx) => (
              <p key={idx}>{renderRichText(p)}</p>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        {post.faqs && post.faqs.length > 0 && (
          <section id="faq-section" className="mt-14 scroll-mt-24">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {post.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-indigo-500' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Social Share Callout */}
        <div className="mt-14">
          <SocialShareButtons
            url={`https://bgremoverx.com/blog/${post.slug}`}
            title={post.title}
            variant="expanded"
            idPrefix="bottom-share"
          />
        </div>

        {/* Author Bio Card */}
        <div className="mt-14 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
            BX
          </div>
          <div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              {post.author.name}
            </h4>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
              {post.author.role}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {post.author.bio}
            </p>
          </div>
        </div>

        {/* Bottom Prominent CTA: Try BGRemoverX */}
        <div className="mt-14 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-800 p-8 sm:p-10 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Fast, Free, No Watermark</span>
            </span>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Need to remove a background from your own image?
            </h3>

            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
              Try BGRemoverX and create a clean transparent image online. Upload any photo and download an ultra-high-definition cutout in seconds.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-98 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Remove Background</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Related Articles
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Continue learning with more guides and image editing workflows
                </p>
              </div>

              <button
                onClick={() => onNavigate('/blog')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View all articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.slug} post={related} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ListOrdered,
  ChevronDown,
  ChevronUp,
  Hash,
  ArrowUp,
  Check,
  Link2,
  BookOpen,
  Compass,
  AlignLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { BlogPost, BlogSection } from '../../types/blog';

export interface TocHeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
  sectionIndex?: number;
  subIndex?: number;
}

export interface TableOfContentsProps {
  post: BlogPost;
  contentRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  variant?: 'card' | 'compact' | 'sidebar';
  onNavigateSection?: (id: string) => void;
}

export function generateTocItemsFromPost(post: BlogPost): TocHeadingItem[] {
  const items: TocHeadingItem[] = [];

  if (!post || !post.sections) return items;

  post.sections.forEach((section, sIdx) => {
    // 1. H2 Section Heading
    if (section.heading) {
      items.push({
        id: section.id,
        text: section.heading,
        level: 2,
        sectionIndex: sIdx + 1,
      });
    }

    // 2. H3 Subheading (if exists)
    if (section.subheading) {
      items.push({
        id: `${section.id}-subheading`,
        text: section.subheading,
        level: 3,
        sectionIndex: sIdx + 1,
      });
    }

    // 3. H3 Subsections (if exists)
    if (section.subsections && section.subsections.length > 0) {
      section.subsections.forEach((sub, subIdx) => {
        if (sub.heading) {
          items.push({
            id: `${section.id}-sub-${subIdx}`,
            text: sub.heading,
            level: 3,
            sectionIndex: sIdx + 1,
            subIndex: subIdx + 1,
          });
        }
      });
    }
  });

  // Common Mistakes (H2)
  if (post.commonMistakes && post.commonMistakes.length > 0) {
    items.push({
      id: 'common-mistakes',
      text: 'Common Mistakes & Practical Solutions',
      level: 2,
    });
  }

  // Summary / Conclusion (H2)
  if (post.conclusionParagraphs && post.conclusionParagraphs.length > 0) {
    items.push({
      id: 'summary-conclusion',
      text: 'Summary & Final Thoughts',
      level: 2,
    });
  }

  // FAQs (H2)
  if (post.faqs && post.faqs.length > 0) {
    items.push({
      id: 'faq-section',
      text: 'Frequently Asked Questions',
      level: 2,
    });
  }

  return items;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  post,
  contentRef,
  className = '',
  variant = 'card',
  onNavigateSection,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeId, setActiveId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [filterLevel, setFilterLevel] = useState<'all' | 'h2-only'>('all');

  // Compute TOC items
  const tocItems = useMemo(() => {
    return generateTocItemsFromPost(post);
  }, [post]);

  const h2Count = useMemo(() => tocItems.filter((i) => i.level === 2).length, [tocItems]);
  const h3Count = useMemo(() => tocItems.filter((i) => i.level === 3).length, [tocItems]);

  const filteredItems = useMemo(() => {
    if (filterLevel === 'h2-only') {
      return tocItems.filter((item) => item.level === 2);
    }
    return tocItems;
  }, [tocItems, filterLevel]);

  // Scrollspy & Reading Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate reading progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(Math.round(currentProgress));
      }

      // 2. Identify currently active heading
      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 140; // offset for fixed navbar

      // Find the element currently in view
      let currentActive = headingElements[0].id;
      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i];
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        if (top <= scrollPosition) {
          currentActive = el.id;
        } else {
          break;
        }
      }

      setActiveId(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tocItems]);

  // Smooth Scroll Jump
  const handleJumpToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset below sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Update URL hash without causing page jump
      if (window.history.pushState) {
        window.history.pushState(null, '', `#${id}`);
      }

      setActiveId(id);

      if (onNavigateSection) {
        onNavigateSection(id);
      }
    }
  };

  // Copy direct anchor link to clipboard
  const handleCopySectionLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    const fullUrl = `${window.location.origin}/blog/${post.slug}#${id}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Scroll to Top
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Table of contents"
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-xs transition-all ${className}`}
    >
      {/* Reading Progress Line */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-t-3xl overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
          role="progressbar"
          aria-valuenow={readingProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/70 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Table of Contents</span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {tocItems.length} items
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{h2Count} main topics</span>
              {h3Count > 0 && <span>• {h3Count} subheadings</span>}
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{readingProgress}% read</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Filter toggle H2 only / All */}
          {h3Count > 0 && (
            <button
              type="button"
              onClick={() => setFilterLevel(filterLevel === 'all' ? 'h2-only' : 'all')}
              className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                filterLevel === 'h2-only'
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Toggle between showing main topics only or all headings"
            >
              <Layers className="w-3 h-3" />
              <span>{filterLevel === 'h2-only' ? 'Main Topics Only' : 'All Sections'}</span>
            </button>
          )}

          {/* Expand/Collapse Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
            title={isExpanded ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Heading Jump Links List */}
      {isExpanded && (
        <div className="p-4 sm:p-5">
          <nav aria-label="Article sections navigation">
            <ol className="space-y-1 text-xs sm:text-sm">
              {filteredItems.map((item, idx) => {
                const isActive = activeId === item.id;
                const isSubheading = item.level === 3;

                return (
                  <li
                    key={item.id}
                    className={`group rounded-xl transition-all ${
                      isSubheading ? 'ml-4 sm:ml-6 pl-2 border-l-2 border-slate-200 dark:border-slate-800' : ''
                    } ${
                      isActive
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between py-1.5 px-2.5">
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleJumpToSection(e, item.id)}
                        className="flex-1 flex items-start gap-2 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left"
                      >
                        {/* Number / Level indicator */}
                        {isSubheading ? (
                          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono mt-0.5 shrink-0 flex items-center">
                            ↳
                          </span>
                        ) : (
                          <span
                            className={`font-mono text-[11px] px-1.5 py-0.2 rounded-md shrink-0 mt-0.5 ${
                              isActive
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {item.sectionIndex ?? idx + 1}
                          </span>
                        )}

                        <span
                          className={`line-clamp-2 leading-snug ${
                            isSubheading
                              ? 'text-xs text-slate-600 dark:text-slate-400'
                              : 'font-medium text-slate-800 dark:text-slate-200'
                          } ${isActive ? 'text-indigo-700 dark:text-indigo-300 font-bold' : ''}`}
                        >
                          {item.text}
                        </span>
                      </a>

                      {/* Quick Copy Link Action Button */}
                      <button
                        type="button"
                        onClick={(e) => handleCopySectionLink(e, item.id)}
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-opacity cursor-pointer shrink-0 ml-1 ${
                          copiedId === item.id ? 'opacity-100 text-emerald-600 dark:text-emerald-400' : ''
                        }`}
                        title="Copy direct link to this section"
                        aria-label={`Copy link to ${item.text}`}
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Link2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Quick Footer Action Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>Click any link to jump directly to that section</span>
            </span>

            <button
              type="button"
              onClick={handleScrollToTop}
              className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

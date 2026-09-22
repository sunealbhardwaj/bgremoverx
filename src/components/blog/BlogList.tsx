import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, Filter, ArrowRight, BookOpen, Layers, CheckCircle2, Facebook, ExternalLink } from 'lucide-react';
import { BlogPost, BlogCategory } from '../../types/blog';
import { BLOG_POSTS, BLOG_CATEGORIES, searchBlogPosts } from '../../data/blogPosts';
import { BlogCard } from './BlogCard';
import { BlogNewsletterSignup } from './BlogNewsletterSignup';

interface BlogListProps {
  onNavigate: (url: string) => void;
  page?: number;
}

const POSTS_PER_PAGE = 6;

export const BlogList: React.FC<BlogListProps> = ({ onNavigate, page = 1 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(page);

  // Synchronize document SEO metadata for the blog hub
  useEffect(() => {
    document.title = 'Background Remover Blog – Image Editing Tips & Guides | BGRemoverX';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn how to remove image backgrounds, create transparent PNGs, edit product photos, and use AI background removal tools with practical guides from BGRemoverX.'
      );
    }

    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://bgremoverx.com/blog');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedCategory, sortBy]);

  // Filtered and sorted posts based on search, category, and sort order
  const filteredPosts = useMemo(() => {
    const results = searchBlogPosts(BLOG_POSTS, searchQuery, selectedCategory);
    return [...results].sort((a, b) => {
      const dateA = new Date(a.publishedDate).getTime();
      const dateB = new Date(b.publishedDate).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  // Featured post (always the top article when on first page with no search)
  const isDefaultView = searchQuery === '' && selectedCategory === 'All' && currentPage === 1;
  const featuredPost = isDefaultView ? filteredPosts[0] : null;

  // Items for the grid
  const gridPosts = useMemo(() => {
    if (isDefaultView && featuredPost) {
      // Exclude featured post from the rest of the list on page 1
      const remaining = filteredPosts.slice(1);
      const start = (currentPage - 1) * POSTS_PER_PAGE;
      return remaining.slice(start, start + POSTS_PER_PAGE);
    }

    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, isDefaultView, featuredPost, currentPage]);

  const totalPages = Math.ceil(
    (isDefaultView ? filteredPosts.length - 1 : filteredPosts.length) / POSTS_PER_PAGE
  );

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">Blog</span>
        </nav>

        {/* Hero Header Section */}
        <header className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practical Photography & Editing Knowledge Hub</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            Background Remover & Image Editing Blog
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mb-6">
            The BGRemoverX blog provides practical guides about image background removal, transparent PNG images, photo editing, product photography, AI image tools, image formats, ecommerce images, social media graphics, and design workflows.
          </p>

          {/* Quick Pillars Chips */}
          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {['E-Commerce Standards', 'Transparent PNGs', 'AI Edge Matting', 'Social Media Graphics', 'Studio Lighting'].map((topic) => (
              <span key={topic} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{topic}</span>
              </span>
            ))}
          </div>
        </header>

        {/* Search & Category Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs mb-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search articles by title, keyword, or topic..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort & Results Count */}
            <div className="flex items-center gap-3 justify-between md:justify-end">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-500" />
                <span>{filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}</span>
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    sortBy === 'newest'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Newest
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('oldest')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    sortBy === 'oldest'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategoryClick('All')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Articles ({BLOG_POSTS.length})
            </button>

            {BLOG_CATEGORIES.map((cat) => {
              const count = BLOG_POSTS.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Post (if default view on page 1) */}
        {featuredPost && (
          <div className="mb-10">
            <BlogCard post={featuredPost} onNavigate={onNavigate} featured={true} />
          </div>
        )}

        {/* Articles Grid */}
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {gridPosts.map((post) => (
              <BlogCard key={post.slug} post={post} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-12">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No articles found matching "{searchQuery}"
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Try searching with different keywords or reset your category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-16">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-500 transition-all cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-9 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  currentPage === num
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-500 transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        {/* Subscribe to our Blog Newsletter Signup */}
        <div className="mb-10">
          <BlogNewsletterSignup
            variant="card"
            idPrefix="blog-list-newsletter"
            sourceContext="blog-list"
          />
        </div>

        {/* Facebook Page Community Banner */}
        <div className="mb-14 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200/80 dark:border-blue-900/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Facebook className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Join the BGRemoverX Community on Facebook
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#1877F2] dark:bg-blue-950 dark:text-blue-300">
                  Official
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Follow <span className="font-semibold text-[#1877F2]">@bgremoverx</span> for weekly photo editing tips, product news, and direct support.
              </p>
            </div>
          </div>

          <a
            href="https://www.facebook.com/bgremoverx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow BGRemoverX on Facebook: https://www.facebook.com/bgremoverx"
            className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] active:scale-98 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 shrink-0 group cursor-pointer"
          >
            <Facebook className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
            <span>Follow @bgremoverx</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Bottom Blog CTA: Background Remover Tool */}
        <div className="rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-800/60 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant AI Precision Matting</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Need to remove a background from your own image?
            </h2>

            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              Try BGRemoverX and create a clean transparent image online. 100% free with unlimited 4K exports and zero watermarks.
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

      </div>
    </div>
  );
};

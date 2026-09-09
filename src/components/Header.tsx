import React, { useState } from 'react';
import { Sparkles, Layers, Sliders, Palette, Zap, Moon, Sun, BarChart3, BookOpen, Menu, X, ChevronRight, Home, HelpCircle } from 'lucide-react';

export interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode?: () => void;
  toggleDarkMode?: () => void;
  onOpenBatch?: () => void;
  onOpenAdmin?: () => void;
  onOpenMetrics?: () => void;
  onOpenSeoPage?: (pageId: string) => void;
  onScrollToSection?: (sectionId: string) => void;
  onNavigate?: (url: string) => void;
  currentPath?: string;
  hasActiveProject?: boolean;
  onResetProject?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  toggleDarkMode,
  onOpenBatch = () => {},
  onOpenAdmin,
  onOpenMetrics,
  onOpenSeoPage = (_pageId: string) => {},
  onScrollToSection = (_sectionId: string) => {},
  onNavigate = (_url: string) => {},
  currentPath = '/',
  hasActiveProject = false,
  onResetProject = () => {},
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleToggleTheme = onToggleDarkMode || toggleDarkMode || (() => {});
  const handleOpenAdmin = onOpenAdmin || onOpenMetrics || (() => {});

  const isBlogActive = currentPath.startsWith('/blog');
  const isHomeActive = currentPath === '/' || currentPath === '';

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentPath !== '/') {
      onNavigate('/');
      setTimeout(() => {
        onScrollToSection(sectionId);
      }, 100);
    } else {
      onScrollToSection(sectionId);
    }
  };

  const handleBlogClick = () => {
    setMobileMenuOpen(false);
    onNavigate('/blog');
  };

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    onNavigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      darkMode 
        ? 'bg-slate-950/85 border-slate-800/80 text-white' 
        : 'bg-white/90 border-slate-200/80 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={handleHomeClick}
          className="flex items-center gap-2 cursor-pointer group select-none py-1"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-150">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-300">
              BgRemoverX
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              PRO
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={handleHomeClick}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isHomeActive
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                : 'hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('editor-tool')}
            className="px-3 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Background Remover</span>
          </button>

          <button
            onClick={() => handleNavClick('features')}
            className="px-3 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer"
          >
            Features
          </button>

          <button
            onClick={() => handleNavClick('how-it-works')}
            className="px-3 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer"
          >
            How It Works
          </button>

          <button
            onClick={handleBlogClick}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              isBlogActive
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-bold'
                : 'hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Blog</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Admin Metrics Trigger */}
          <button
            onClick={handleOpenAdmin}
            title="System Analytics & Core Web Vitals"
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={handleToggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-100'
            }`}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>

          {/* Batch CTA (Desktop) */}
          <button
            onClick={onOpenBatch}
            className="hidden sm:inline-flex items-center gap-1 h-8 px-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Batch</span>
          </button>

          {/* Primary Action Button */}
          {hasActiveProject ? (
            <button
              onClick={onResetProject}
              className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:scale-98 rounded-lg transition-all cursor-pointer shadow-xs"
            >
              <span>+ New</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('editor-tool')}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-xs shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Upload</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={handleHomeClick}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              isHomeActive
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4 text-indigo-500" />
              <span>Home</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('editor-tool')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Background Remover</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('features')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Features</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('how-it-works')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>How It Works</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleBlogClick}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              isBlogActive
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Blog (Image Guides & Tips)</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              New
            </span>
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBatch();
              }}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Batch Processor</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

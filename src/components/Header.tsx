import React from 'react';
import { Sparkles, Layers, Sliders, Palette, Zap, Moon, Sun, ShieldCheck, BarChart3, Image as ImageIcon } from 'lucide-react';

export interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode?: () => void;
  toggleDarkMode?: () => void;
  onOpenBatch?: () => void;
  onOpenAdmin?: () => void;
  onOpenMetrics?: () => void;
  onOpenSeoPage?: (pageId: string) => void;
  onScrollToSection?: (sectionId: string) => void;
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
  hasActiveProject = false,
  onResetProject = () => {},
}) => {
  const handleToggleTheme = onToggleDarkMode || toggleDarkMode || (() => {});
  const handleOpenAdmin = onOpenAdmin || onOpenMetrics || (() => {});

  const handleNavClick = (sectionId: string) => {
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      darkMode 
        ? 'bg-slate-950/85 border-slate-800/80 text-white' 
        : 'bg-white/90 border-slate-200/80 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-12 flex items-center justify-between">
        {/* Brand Logo - Compact */}
        <div 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 cursor-pointer group select-none py-1"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-150">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-display text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-300">
              BgRemoverX
            </span>
            <span className="text-[8px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-indigo-100/80 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              PRO
            </span>
          </div>
        </div>

        {/* Desktop Nav - Streamlined & Compact */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('editor-tool')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Remover</span>
          </button>

          <button
            onClick={() => {
              if (onOpenSeoPage) onOpenSeoPage('color-changer');
              handleNavClick('editor-tool');
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Palette className="w-3.5 h-3.5 text-pink-500" />
            <span>Color Changer</span>
          </button>

          <button
            onClick={onOpenBatch}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Batch</span>
          </button>

          <button
            onClick={() => handleNavClick('use-cases')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-1"
          >
            Use Cases
          </button>

          <button
            onClick={() => handleNavClick('guides')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-1"
          >
            Guides
          </button>

          <button
            onClick={() => handleNavClick('pricing')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-1 text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            100% Free
          </button>
        </nav>

        {/* Right Actions - Compact H-8 Controls */}
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

          {/* Batch CTA (Tablet+) */}
          <button
            onClick={onOpenBatch}
            className="hidden sm:inline-flex items-center gap-1 h-8 px-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
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
        </div>
      </div>
    </header>
  );
};

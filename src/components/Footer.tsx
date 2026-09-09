import React from 'react';
import { Sparkles, Shield, Heart, Github, Twitter, Linkedin, Zap, BookOpen } from 'lucide-react';
import { LegalModalType } from './LegalModals';

export const Footer: React.FC<{ 
  onOpenBatch: () => void; 
  onOpenMetrics: () => void;
  onOpenLegalModal: (type: LegalModalType) => void;
}> = ({
  onOpenBatch,
  onOpenMetrics,
  onOpenLegalModal,
}) => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & Mission (Col 1 & 2) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">
                BgRemover<span className="text-indigo-600 dark:text-indigo-400">X</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Professional AI Background Remover & Color Changer. Sub-pixel edge matting for fine hair, e-commerce products, cars, and portraits with instant transparent PNG export.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Neural Processing Systems Operational</span>
            </div>
          </div>

          {/* Column: Tools */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Studio Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#upload" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Background Remover
                </a>
              </li>
              <li>
                <a href="#upload" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Filters & Tone Studio
                </a>
              </li>
              <li>
                <a href="#upload" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Background Color Changer
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBatch}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Batch Image Processor
                </button>
              </li>
              <li>
                <a href="#upload" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cast Shadow Generator
                </a>
              </li>
            </ul>
          </div>

          {/* Column: Resources & Guides */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Guides & Solutions
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#guides" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-indigo-500" />
                  <span>Mastery Guides</span>
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Shopify & Amazon Sellers
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Professional Headshots & Portraits
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  YouTube & Social Media
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  100% Free Forever Model
                </a>
              </li>
            </ul>
          </div>

          {/* Column: Company & Legal */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Trust & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegalModal('about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('contact')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Privacy Policy (GDPR/CCPA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('disclaimer')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Legal Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMetrics}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>System Telemetry</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© 2026 BgRemoverX Technologies Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="hover:underline"
            >
              Terms
            </button>
            <span>•</span>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:underline">
              robots.txt
            </a>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:underline">
              sitemap.xml
            </a>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Shield className="w-3.5 h-3.5" />
              100% Privacy Protected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Sparkles, Shield, Heart, Github, Twitter, Linkedin, Zap, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { LegalModalType } from './LegalModals';

export const Footer: React.FC<{ 
  onOpenBatch: () => void; 
  onOpenMetrics: () => void;
  onOpenLegalModal: (type: LegalModalType) => void;
  onNavigate?: (url: string) => void;
}> = ({
  onOpenBatch,
  onOpenMetrics,
  onOpenLegalModal,
  onNavigate = (_url: string) => {},
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
              100% Free AI Background Remover & Remove BG Studio. Fast, high-precision bg remove tool for hair, e-commerce product photos, and portraits with instant 4K transparent PNG exports.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Neural Processing Systems Operational</span>
            </div>

            {/* Prominent Blog Callout Link */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/blog')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all font-semibold cursor-pointer shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Visit BGRemoverX Blog & Guides</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Column: Tools */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Studio Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  Remove BG (AI Cutout)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  AI Background Remover
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBatch}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  Batch BG Remover (Bulk)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  Transparent PNG Maker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  White Background Editor
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Resources & Guides */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Blog & Guides</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
                NEW
              </span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/blog')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 font-semibold text-slate-900 dark:text-white text-left cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-indigo-500" />
                  <span>All Blog Guides (/blog)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/how-to-remove-background-from-an-image-online')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  Remove Background Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/how-to-make-transparent-png')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  How to Make Transparent PNG
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/remove-background-from-product-photos')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  Product Photo Editing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/jpg-vs-png')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  JPG vs PNG Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/ai-background-remover-vs-photoshop')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                >
                  AI Remover vs Photoshop
                </button>
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

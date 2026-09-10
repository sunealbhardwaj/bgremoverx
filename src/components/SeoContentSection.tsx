import React from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ShoppingBag, 
  UserCheck, 
  FileText, 
  Palette, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  MousePointerClick
} from 'lucide-react';

interface SeoContentSectionProps {
  onScrollToTop?: () => void;
  onNavigate?: (url: string) => void;
}

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({
  onScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  onNavigate = (_url: string) => {},
}) => {
  return (
    <section id="about-bg-remover" className="py-12 md:py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>The #1 Free Online AI Background Remover</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Why Millions Choose BgRemoverX to Remove BG & Cut Out Photos
          </h2>
          <p className="mt-3.5 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminating image backgrounds used to require hours of manual pen-tool tracing in expensive desktop software. 
            BgRemoverX brings studio-grade computer vision to your browser, enabling anyone to <strong>remove background</strong>, 
            <strong>bg remove</strong> graphics, and download transparent 4K PNGs in less than a second.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pillar 1: Remove BG */}
          <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-600/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
              Instant 1-Click Remove BG
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload any JPG, PNG, or WEBP photo. Our neural vision engine automatically identifies people, products, vehicles, 
              and pets to execute a flawless <strong>remove bg</strong> cutout in under a second.
            </p>
          </div>

          {/* Pillar 2: Background Remover */}
          <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
              Precision AI Background Remover
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No jagged borders or green halos. Our <strong>background remover</strong> utilizes deep alpha matting 
              to keep fine strands of hair, animal fur, jewelry reflections, and transparent glass perfectly intact.
            </p>
          </div>

          {/* Pillar 3: BG Remove & Color Studio */}
          <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-pink-600 text-white flex items-center justify-center mb-4 shadow-md shadow-pink-600/20">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
              Versatile BG Remover & Color Changer
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              More than a basic <strong>bg remover</strong>. Once you <strong>bg remove</strong> your subject, easily 
              switch to solid e-commerce white, modern gradients, custom HEX shades, or add realistic ground shadows.
            </p>
          </div>
        </div>

        {/* Detailed SEO Explanatory Guide Section */}
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-purple-50/30 to-slate-50/50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 border border-indigo-100 dark:border-slate-800 mb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                What Can You Do with Our Free BG Remover?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Whether you are preparing inventory for an online store or designing custom avatars, 
                BgRemoverX is the all-in-one solution to <strong>remove background</strong> from images online:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    E-Commerce Product Photography
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Instantly <strong>remove bg</strong> from shoes, apparel, electronics, and jewelry. 
                    Export pure white backdrops that strictly comply with Amazon, eBay, and Shopify requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    Portraits, Headshots & ID Photos
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cut out profile photos, LinkedIn headshots, and team rosters. Our <strong>bg remove</strong> engine 
                    preserves hair strands cleanly without artificial choppy cut lines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    Logos, Signatures & Graphics
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Convert scanned signatures, brand marks, and PNG sketches into isolated transparent assets 
                    ready to paste onto presentations, documents, and videos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    100% Free with Zero Watermarks
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Other tools downgrade quality or watermark your downloads. BgRemoverX is an open, free 
                    <strong>background remover</strong> with full-resolution 4K exports and commercial rights.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action CTA Button */}
            <div className="pt-4 border-t border-indigo-100/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
                Ready to transform your images? Try the online tool now — no registration or installation needed.
              </p>
              <button
                type="button"
                onClick={onScrollToTop}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0 group"
              >
                <MousePointerClick className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Remove BG from Image Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Keyword Topics & Deep-Link Cloud */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3 uppercase tracking-wider">
            Popular Searches & Background Removal Workflows:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Remove BG', desc: 'Instant 1-click cutout' },
              { label: 'Background Remover', desc: 'AI edge matting tool' },
              { label: 'Remove Background', desc: 'Free online photo eraser' },
              { label: 'BG Remove', desc: 'Quick transparent cutout' },
              { label: 'BG Remover', desc: 'High-definition 4K PNG maker' },
              { label: 'Transparent PNG Maker', desc: 'Lossless alpha export' },
              { label: 'White Background Product Photo', desc: 'Amazon & Shopify standards' },
              { label: 'Batch Background Remover', desc: 'Bulk photo processing' },
            ].map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={onScrollToTop}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium transition-all shadow-xs cursor-pointer"
                title={`${tag.label}: ${tag.desc}`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

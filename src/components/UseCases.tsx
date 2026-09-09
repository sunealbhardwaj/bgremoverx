import React from 'react';
import { ShoppingBag, UserCheck, Youtube, Megaphone, Car, PenTool } from 'lucide-react';

export const UseCases: React.FC<{ onSelectUseCase: (sampleUrl: string) => void }> = ({ onSelectUseCase }) => {
  const cases = [
    {
      icon: ShoppingBag,
      title: 'E-Commerce & Product Photos',
      description: 'Satisfy Amazon, Shopify, and eBay 100% pure white background requirements instantly with realistic contact shadows.',
      tag: 'E-Commerce',
      sampleUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      icon: UserCheck,
      title: 'Passport & ID Headshots',
      description: 'Create compliant visa, passport, student ID, and corporate badge photos with official white or solid blue backgrounds.',
      tag: 'Official ID',
      sampleUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=85',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      icon: Youtube,
      title: 'YouTube & Creator Thumbnails',
      description: 'Pop your character cutouts against high-energy cyber gradients, neon backdrops, and dramatic cast shadows.',
      tag: 'Social Media',
      sampleUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=85',
      badgeColor: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
    },
    {
      icon: Megaphone,
      title: 'Marketing & Digital Ads',
      description: 'Isolate brand assets, models, and campaign elements to rapidly assemble Facebook, Instagram, and TikTok ad creatives.',
      tag: 'Marketing',
      sampleUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=85',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
    },
    {
      icon: Car,
      title: 'Automotive & Dealerships',
      description: 'Replace cluttered parking lot backgrounds with sleek modern architectural showrooms while preserving window transparency.',
      tag: 'Automotive',
      sampleUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=85',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      icon: PenTool,
      title: 'Graphic Design & Signatures',
      description: 'Extract handwritten signatures, sketches, and logos into clean transparent PNG stamps for documents and branding.',
      tag: 'Design',
      sampleUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&auto=format&fit=crop&q=85',
      badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300',
    },
  ];

  return (
    <section id="use-cases" className="py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Versatile Applications</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tailored for Every Industry
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          From e-commerce entrepreneurs to professional agencies, see how BgRemoverX accelerates production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${c.badgeColor}`}>
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onSelectUseCase(c.sampleUrl)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                >
                  <span>Try with sample image</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

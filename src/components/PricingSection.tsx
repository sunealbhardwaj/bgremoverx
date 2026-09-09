import React from 'react';
import { Check, Sparkles, Zap, Shield, Heart, Megaphone, Gift, Unlock } from 'lucide-react';
import { AdBanner } from './AdBanner';

export const PricingSection: React.FC = () => {
  const freePerks = [
    {
      title: 'Unlimited 4K HD Downloads',
      desc: 'Export crystal clear full-resolution PNG, JPG, and WEBP files with zero artificial resolution limits.',
    },
    {
      title: 'Batch Processing Included',
      desc: 'Queue multiple images at once, apply uniform background themes, and download everything packaged as a ZIP.',
    },
    {
      title: 'Advanced Edge Matting',
      desc: 'Sub-pixel feathering and neural edge decontaminator for delicate hair wisps, fur, and transparent objects.',
    },
    {
      title: 'Studio Color & Gradient Studio',
      desc: 'Over 24+ curated solid colors, pure e-commerce white (#FFFFFF), live Eyedropper, and multi-stop gradients.',
    },
    {
      title: 'Realistic Cast Shadows',
      desc: 'Ground your subjects on solid backgrounds with custom directional angle, blur, spread, and opacity controls.',
    },
    {
      title: 'Zero Account & Zero Credit Card',
      desc: 'Open the website, drop your image, and download. No registration, no passwords, and no hidden trial traps.',
    },
  ];

  return (
    <section id="pricing" className="py-10 md:py-14 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
            <Gift className="w-3.5 h-3.5" />
            <span>100% Free Forever & Ad-Supported</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            No Subscriptions. No Paid Upgrades.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            BgRemoverX is completely free for everyone. All pro features, high-resolution exports, and batch processing are unlocked.
          </p>
        </div>

        {/* Free Forever Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {freePerks.map((perk, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  {perk.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                {perk.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Ad-Supported Disclosure & Sponsor Banner */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950/80 p-8 shadow-lg shadow-indigo-500/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Megaphone className="w-4 h-4" />
                <span>How We Keep BgRemoverX 100% Free</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Powered by Privacy-Friendly Advertiser Sponsorships
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Instead of charging monthly subscription fees or restricting downloads behind paywalls, we partner with industry-leading creative tools and hosting sponsors. This allows unlimited background removals for designers, e-commerce sellers, and creators worldwide.
              </p>
            </div>

            {/* Sponsored Rectangle Unit */}
            <div className="shrink-0 w-full lg:w-auto">
              <AdBanner type="rectangle" slotId="ad-pricing-section" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

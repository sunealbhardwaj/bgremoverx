import React, { useState } from 'react';
import { ExternalLink, Info, X, Sparkles, Shield, Tag, Megaphone } from 'lucide-react';

export type AdSlotType = 
  | 'leaderboard'      // 728x90 desktop / 320x50 mobile
  | 'billboard'        // 970x250 or 970x90
  | 'rectangle'        // 300x250 standard medium rectangle
  | 'native'           // In-feed content sponsored card
  | 'sticky-bottom';   // Bottom docking ad strip

interface AdBannerProps {
  type?: AdSlotType;
  className?: string;
  slotId?: string;
  customTitle?: string;
  customDescription?: string;
  customCta?: string;
  customImage?: string;
  customLink?: string;
}

const SAMPLE_ADS = [
  {
    id: 'ad-cloud-1',
    sponsor: 'CloudScale Studio Pro',
    category: 'Creative Cloud Tools',
    headline: 'High-Speed Asset Hosting & Instant CDN for Designers',
    description: 'Store, compress, and deliver 4K transparent PNGs globally with sub-20ms latency. Get 100GB free tier today.',
    cta: 'Claim Free 100GB',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    tag: 'Sponsored Partner',
    url: 'https://example.com/sponsor-creative-cloud',
  },
  {
    id: 'ad-cam-2',
    sponsor: 'Lumix Studio Master',
    category: 'Photography Gear',
    headline: 'Studio Lighting & Softbox Kits for E-Commerce Sellers',
    description: 'Capture crisp product contours with ultra-high CRI 98+ continuous daylight LED fixtures. 25% Off Summer Sale.',
    cta: 'Shop Studio Kits',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
    tag: 'Featured Offer',
    url: 'https://example.com/sponsor-studio-lighting',
  },
  {
    id: 'ad-mock-3',
    sponsor: 'VectorCraft Mockups',
    category: 'Design Assets',
    headline: '50,000+ Photorealistic Apparel & Device Mockup PSDs',
    description: 'Place your transparent cutouts directly into 3D packaging, apparel, and mobile devices in 1-click.',
    cta: 'Download 50 Free PSDs',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80',
    tag: 'Ad Choice',
    url: 'https://example.com/sponsor-vectorcraft',
  },
];

// Master toggle to disable all ads across the application
export const ADS_ENABLED = false;

export const AdBanner: React.FC<AdBannerProps> = ({
  type = 'leaderboard',
  className = '',
  slotId = 'ad-slot-default',
  customTitle,
  customDescription,
  customCta,
  customImage,
  customLink,
}) => {
  // All ads disabled per user instruction ("website me sare ads hata do")
  if (!ADS_ENABLED) {
    return null;
  }

  const [isDismissed, setIsDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [adIndex] = useState(() => Math.floor(Math.random() * SAMPLE_ADS.length));

  if (isDismissed) return null;

  const currentAd = SAMPLE_ADS[adIndex];
  const headline = customTitle || currentAd.headline;
  const description = customDescription || currentAd.description;
  const ctaText = customCta || currentAd.cta;
  const imageUrl = customImage || currentAd.image;
  const targetUrl = customLink || currentAd.url;

  // 1. Leaderboard Banner (728x90 on Desktop, 320x50 on Mobile)
  if (type === 'leaderboard') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-2 sm:my-3 px-4 ${className}`}>
        <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
          {/* Header Ad Tag bar */}
          <div className="bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Megaphone className="w-3 h-3 text-indigo-500" />
              <span>Advertisement</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{currentAd.sponsor}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                title="Why am I seeing this ad?"
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center gap-0.5"
              >
                <Info className="w-3 h-3" />
                <span className="hidden sm:inline">Ad Choices</span>
              </button>
            </div>
          </div>

          {showInfo && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
              <span>Ads keep BgRemoverX 100% free with unlimited 4K downloads for all users.</span>
              <button 
                onClick={() => setShowInfo(false)}
                className="font-bold underline text-[11px]"
              >
                Close
              </button>
            </div>
          )}

          {/* Ad Content */}
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <img
                src={imageUrl}
                alt={currentAd.sponsor}
                referrerPolicy="no-referrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {currentAd.category}
                  </span>
                </div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate mt-0.5">
                  {headline}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {description}
                </p>
              </div>
            </div>

            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Billboard / Mega Banner (970x250 responsive)
  if (type === 'billboard') {
    return (
      <div className={`w-full max-w-6xl mx-auto my-4 md:my-6 px-4 ${className}`}>
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-indigo-500/20">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-slate-300 border border-white/10">
            <Tag className="w-3 h-3 text-amber-400" />
            <span>Sponsored Ad • Keeps Tool Free</span>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                {currentAd.sponsor}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
                {headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-display font-bold text-xs sm:text-sm shadow-lg transition-all text-center flex items-center justify-center gap-2"
              >
                <span>{ctaText}</span>
                <ExternalLink className="w-4 h-4 text-indigo-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Medium Rectangle Ad (300x250 for Sidebar / Workspace)
  if (type === 'rectangle') {
    return (
      <div className={`w-full max-w-[320px] mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 flex flex-col justify-between ${className}`}>
        {/* Ad Tag */}
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-indigo-500" />
            Advertisement
          </span>
          <span className="text-slate-500">{currentAd.sponsor}</span>
        </div>

        {/* Creative Image */}
        <div className="relative rounded-xl overflow-hidden h-32 mb-3 bg-slate-100 dark:bg-slate-800">
          <img
            src={imageUrl}
            alt={currentAd.sponsor}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold">
            {currentAd.category}
          </div>
        </div>

        {/* Copy */}
        <div className="mb-4">
          <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
            {headline}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // 4. Native In-Feed Sponsored Card
  if (type === 'native') {
    return (
      <div className={`p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/50 shadow-md ${className}`}>
        <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Featured Creator Tool • Sponsored</span>
          </div>
          <span>{currentAd.sponsor}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={imageUrl}
            alt={currentAd.sponsor}
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 shadow-md"
          />
          <div className="space-y-1.5 text-left">
            <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {headline}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
              {description}
            </p>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
            >
              <span>{ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 5. Sticky Bottom Floating Ad Bar
  if (type === 'sticky-bottom') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-30 p-2 sm:p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
              Ad
            </span>
            <div className="min-w-0">
              <p className="font-display font-bold text-xs text-slate-900 dark:text-white truncate">
                {headline}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate hidden md:block">
                Sponsored by {currentAd.sponsor} • Free tier supported by ethical ads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
            >
              <span>{ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setIsDismissed(true)}
              title="Dismiss ad bar"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

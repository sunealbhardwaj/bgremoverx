import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Settings, ExternalLink } from 'lucide-react';
import { LegalModalType } from './LegalModals';

interface CookieConsentBannerProps {
  onOpenLegalModal: (type: LegalModalType) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenLegalModal,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cutout_cookie_consent');
      if (!consent) {
        // Show after short gentle delay
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('cutout_cookie_consent', JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      }));
    } catch {}
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('cutout_cookie_consent', JSON.stringify({
        essential: true,
        analytics: analyticsEnabled,
        marketing: marketingEnabled,
        timestamp: new Date().toISOString(),
      }));
    } catch {}
    setIsVisible(false);
  };

  const handleDeclineNonEssential = () => {
    try {
      localStorage.setItem('cutout_cookie_consent', JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      }));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Cookie consent banner" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200 text-xs">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                Cookie & Advertising Choices
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                GDPR, CCPA & Google AdSense Compliant
              </p>
            </div>
          </div>

          <button
            onClick={handleDeclineNonEssential}
            title="Dismiss non-essential"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text */}
        {!showPreferences ? (
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            We use cookies and similar technologies to measure site traffic and serve personalized sponsor ads via Google AdSense. Ads keep this studio <strong>100% free with unlimited 4K exports</strong> for everyone.{' '}
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline"
            >
              Read Privacy Policy
            </button>.
          </p>
        ) : (
          <div className="space-y-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px]">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Essential Processing</span>
                <span className="text-[10px] text-slate-400">Required for in-browser neural image matting</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Always Active
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Analytics Cookies</span>
                <span className="text-[10px] text-slate-400">Aggregated performance and processing telemetry</span>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Advertising & AdSense</span>
                <span className="text-[10px] text-slate-400">Keeps background removal 100% free</span>
              </div>
              <input
                type="checkbox"
                checked={marketingEnabled}
                onChange={(e) => setMarketingEnabled(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {!showPreferences ? (
            <>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
              >
                Accept All Cookies
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="w-full sm:w-auto py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
              >
                Customize
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSavePreferences}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all"
              >
                Save My Preferences
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="w-full sm:w-auto py-2 px-3 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs transition-colors"
              >
                Back
              </button>
            </>
          )}
        </div>

      </div>
    </aside>
  );
};

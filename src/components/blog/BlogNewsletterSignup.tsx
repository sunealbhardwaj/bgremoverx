import React, { useState } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface BlogNewsletterSignupProps {
  variant?: 'card' | 'compact' | 'minimal';
  className?: string;
  onSubscribed?: (email: string) => void;
  idPrefix?: string;
  sourceContext?: string;
}

export const BlogNewsletterSignup: React.FC<BlogNewsletterSignupProps> = ({
  variant = 'card',
  className = '',
  onSubscribed,
  idPrefix = 'blog-newsletter',
  sourceContext = 'blog',
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState('');

  // Email format validation helper
  const isValidEmail = (val: string): boolean => {
    // Robust RFC 5322-compliant basic pattern without excessive backtracking
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(val.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    // 1. Validation: Empty Check
    if (!cleanEmail) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    // 2. Validation: Format Check
    if (!isValidEmail(cleanEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g. name@company.com).');
      return;
    }

    // 3. Validation: Duplicate subscription check in localStorage
    try {
      const stored = localStorage.getItem('bgremoverx_newsletter_subscribers');
      const subscribers: string[] = stored ? JSON.parse(stored) : [];
      if (subscribers.includes(cleanEmail.toLowerCase())) {
        setStatus('error');
        setErrorMessage('This email is already subscribed! You are all set to receive the next monthly tips.');
        return;
      }
    } catch {
      // Ignore localStorage read errors
    }

    // Begin Submission
    setStatus('loading');
    setErrorMessage('');

    // Simulate async network request
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('bgremoverx_newsletter_subscribers');
        const subscribers: string[] = stored ? JSON.parse(stored) : [];
        if (!subscribers.includes(cleanEmail.toLowerCase())) {
          subscribers.push(cleanEmail.toLowerCase());
          localStorage.setItem('bgremoverx_newsletter_subscribers', JSON.stringify(subscribers));
        }
        localStorage.setItem('bgremoverx_newsletter_last_sub', JSON.stringify({
          email: cleanEmail,
          date: new Date().toISOString(),
          context: sourceContext,
        }));
      } catch {
        // Fallback gracefully
      }

      setSubscribedEmail(cleanEmail);
      setStatus('success');
      setEmail('');
      if (onSubscribed) {
        onSubscribed(cleanEmail);
      }
    }, 700);
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
    setEmail('');
  };

  // -------------------------------------------------------------
  // Variant: Minimal / Inline (One-line or compact bar)
  // -------------------------------------------------------------
  if (variant === 'minimal') {
    return (
      <div id={`${idPrefix}-container`} className={`w-full ${className}`}>
        {status === 'success' ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-medium">Subscribed! Check your inbox for monthly tips.</span>
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto text-[11px] underline hover:no-underline font-semibold text-emerald-700 dark:text-emerald-300 cursor-pointer"
            >
              Add another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id={`${idPrefix}-email-input`}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email..."
                  aria-label="Email address for monthly blog newsletter"
                  aria-invalid={status === 'error'}
                  aria-describedby={status === 'error' ? `${idPrefix}-error-msg` : undefined}
                  disabled={status === 'loading'}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-all"
                />
              </div>
              <button
                id={`${idPrefix}-submit-btn`}
                type="submit"
                disabled={status === 'loading'}
                className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Subscribe</span>
              </button>
            </div>
            {status === 'error' && (
              <p
                id={`${idPrefix}-error-msg`}
                role="alert"
                className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </form>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Variant: Compact (For sidebars, article sub-sections, or smaller spots)
  // -------------------------------------------------------------
  if (variant === 'compact') {
    return (
      <div
        id={`${idPrefix}-container`}
        className={`p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 ${className}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
            Subscribe to our Blog
          </h4>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
          Get monthly image editing tips, transparent PNG tutorials, and studio cutout techniques.
        </p>

        {status === 'success' ? (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">You’re subscribed!</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Monthly tips will be sent to <span className="font-medium">{subscribedEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Subscribe another email
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id={`${idPrefix}-email-input`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="you@example.com"
                aria-label="Email address for monthly blog newsletter"
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? `${idPrefix}-error-msg` : undefined}
                disabled={status === 'loading'}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-all"
              />
            </div>

            {status === 'error' && (
              <div
                id={`${idPrefix}-error-msg`}
                role="alert"
                className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              id={`${idPrefix}-submit-btn`}
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe to Monthly Tips</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-500" />
                <span>Monthly edition</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>No spam, 1-click cancel</span>
              </span>
            </div>
          </form>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Variant: Card (Default high-contrast, polished section component)
  // -------------------------------------------------------------
  return (
    <section
      id={`${idPrefix}-container`}
      aria-labelledby={`${idPrefix}-heading`}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-indigo-50/40 to-white dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* Decorative backdrop light element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Subscribe to our Blog</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
            <Calendar className="w-3 h-3 text-indigo-500" />
            <span>Monthly Digest</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>100% Free • No Spam</span>
          </span>
        </div>

        {/* Header Content */}
        <div className="text-center sm:text-left mb-6">
          <h3
            id={`${idPrefix}-heading`}
            className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-2.5"
          >
            Get Monthly Image Editing & Cutout Tips
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Join thousands of creators, e-commerce sellers, and designers. Receive curated guides on transparent PNG workflows, AI matting updates, studio lighting tricks, and e-commerce photo standards once a month.
          </p>
        </div>

        {/* State: Success Confirmation */}
        {status === 'success' ? (
          <div
            id={`${idPrefix}-success-panel`}
            className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white transition-all duration-300 animate-in fade-in"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    You’re subscribed to our blog!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    We’ve registered <span className="font-semibold text-slate-900 dark:text-white">{subscribedEmail}</span>. Look out for our next monthly edition packed with actionable image editing breakdowns.
                  </p>
                </div>
              </div>

              <button
                id={`${idPrefix}-reset-btn`}
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                Subscribe another email
              </button>
            </div>
          </div>
        ) : (
          /* State: Signup Form */
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <label htmlFor={`${idPrefix}-email-input`} className="sr-only">
                  Email Address
                </label>
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id={`${idPrefix}-email-input`}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') {
                      setStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  placeholder="Enter your email address (e.g. alex@example.com)"
                  autoComplete="email"
                  aria-invalid={status === 'error'}
                  aria-describedby={status === 'error' ? `${idPrefix}-error-msg` : undefined}
                  disabled={status === 'loading'}
                  className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border ${
                    status === 'error'
                      ? 'border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500'
                  } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xs`}
                />
              </div>

              <button
                id={`${idPrefix}-submit-btn`}
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Validation Error Message Box */}
            {status === 'error' && (
              <div
                id={`${idPrefix}-error-msg`}
                role="alert"
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 transition-all"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Privacy Guarantee & Value Points */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Practical step-by-step tutorials</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>E-commerce photo best practices</span>
                </span>
              </div>

              <div className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero spam. Unsubscribe with 1 click.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

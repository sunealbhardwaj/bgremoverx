import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Link2, Check, Share2, ExternalLink } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
  variant?: 'compact' | 'expanded';
  idPrefix?: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  variant = 'compact',
  idPrefix = 'share',
}) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API fails
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap" aria-label="Share options">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Share:</span>
        </span>

        {/* Twitter / X */}
        <a
          id={`${idPrefix}-twitter-btn`}
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on Twitter / X"
          title="Share on X (Twitter)"
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#1DA1F2] hover:border-[#1DA1F2] dark:hover:bg-[#1DA1F2] dark:hover:border-[#1DA1F2] transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <Twitter className="w-4 h-4 transition-transform group-hover:scale-110" />
        </a>

        {/* LinkedIn */}
        <a
          id={`${idPrefix}-linkedin-btn`}
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on LinkedIn"
          title="Share on LinkedIn"
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] dark:hover:bg-[#0A66C2] dark:hover:border-[#0A66C2] transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
        </a>

        {/* Facebook */}
        <a
          id={`${idPrefix}-facebook-btn`}
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on Facebook"
          title="Share on Facebook"
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] dark:hover:bg-[#1877F2] dark:hover:border-[#1877F2] transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
        </a>

        {/* Copy Link button */}
        <button
          id={`${idPrefix}-copy-link-btn`}
          onClick={handleCopyLink}
          type="button"
          aria-label={copied ? 'Link copied to clipboard' : 'Copy link to article'}
          title={copied ? 'Copied!' : 'Copy link'}
          className={`inline-flex items-center gap-1 px-2.5 h-8 rounded-xl border text-xs font-semibold transition-all duration-200 shadow-xs cursor-pointer ${
            copied
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Copy Link</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Expanded variant for bottom of the article
  return (
    <div
      id={`${idPrefix}-container`}
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Found this guide useful? Share it with your network
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Spread the word on Twitter, LinkedIn, and Facebook to help creators remove backgrounds cleanly.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
        {/* Twitter */}
        <a
          id={`${idPrefix}-twitter-btn`}
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on Twitter / X"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white border border-[#1DA1F2]/30 hover:border-[#1DA1F2] text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <Twitter className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Twitter / X</span>
        </a>

        {/* LinkedIn */}
        <a
          id={`${idPrefix}-linkedin-btn`}
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on LinkedIn"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white border border-[#0A66C2]/30 hover:border-[#0A66C2] text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>LinkedIn</span>
        </a>

        {/* Facebook Share */}
        <a
          id={`${idPrefix}-facebook-btn`}
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on Facebook"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 hover:border-[#1877F2] text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Facebook</span>
        </a>

        {/* Official Page Follow */}
        <a
          id={`${idPrefix}-facebook-page-btn`}
          href="https://www.facebook.com/bgremoverx"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow BgRemoverX on Facebook"
          title="Official Facebook Page"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1877F2] dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-[#1877F2] hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
        >
          <Facebook className="w-3.5 h-3.5 fill-current" />
          <span>Follow @bgremoverx</span>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </a>

        {/* Copy Link */}
        <button
          id={`${idPrefix}-copy-link-btn`}
          onClick={handleCopyLink}
          type="button"
          aria-label={copied ? 'Link copied' : 'Copy article link'}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer ${
            copied
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

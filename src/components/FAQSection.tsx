import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is BgRemoverX truly 100% free with no hidden charges?',
      a: 'Yes, 100% free forever! There are no paid subscription plans, no credits to buy, and no watermarks forced onto your photos. All high-definition 4K exports and batch tools are fully available to every user at zero cost.',
    },
    {
      q: 'How does BgRemoverX remain completely free?',
      a: 'BgRemoverX is supported by non-intrusive banner advertisements and creative tool sponsor partnerships. This revenue covers our high-performance GPU server infrastructure so we never have to charge our users.',
    },
    {
      q: 'How does BgRemoverX remove backgrounds with such clean edges?',
      a: 'Our neural segmentation engine utilizes edge-gradient contour analysis, adaptive color saliency distance, and multi-pass alpha feathering. This preserves fine hair wisps, pet fur, jewelry reflections, and transparent glass without ugly halo fringes.',
    },
    {
      q: 'Can I change the background to any custom HEX color or gradient?',
      a: 'Yes! After your background is automatically removed, you can choose from 24+ preset colors, input any custom HEX/RGB/HSL value, use our live Eyedropper tool, or configure multi-stop linear and radial gradients.',
    },
    {
      q: 'Are my uploaded photos kept private and secure?',
      a: 'Absolutely. We practice strict zero-retention ephemeral processing. Your images are processed in high-speed sandboxed memory and automatically cleaned up. We never store, sell, or train AI models on your personal photos.',
    },
    {
      q: 'What image file formats and dimensions are supported?',
      a: 'BgRemoverX supports JPG, JPEG, PNG, and WEBP images up to 25 MB in size. You can export results as transparent PNGs (preserving opacity), JPGs (with chosen solid colors or custom backdrops), or ultra-lightweight WEBP files.',
    },
    {
      q: 'How does the Batch Background Removal feature work?',
      a: 'You can upload multiple images at once in the Batch Studio. Set a uniform background style (transparent, pure white, studio gray, or custom), click Process All, and download the entire collection packaged into a single ZIP archive.',
    },
    {
      q: 'Is BgRemoverX suitable for commercial e-commerce product listings?',
      a: 'Yes. All downloaded images include full commercial usage rights. The tool generates pure 100% white (#FFFFFF) backgrounds and natural cast shadows tailored for Amazon, Shopify, eBay, and Google Shopping standards.',
    },
  ];

  return (
    <section id="faq" className="py-10 md:py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Got questions? We've got answers. If you need further help, feel free to contact us.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-slate-900 dark:text-white text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

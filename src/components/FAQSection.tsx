import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I remove bg or remove background from an image for free?',
      a: 'Simply drag and drop or paste any photo directly into BgRemoverX. Our AI background remover automatically detects the subject and performs the remove bg process in under 1 second. You can download a crystal-clear 4K transparent PNG immediately without signing up or paying fees.',
    },
    {
      q: 'What makes BgRemoverX the best free background remover and bg remover?',
      a: 'Unlike other tools that lock high-resolution downloads behind paywalls or slap ugly watermarks on your photos, BgRemoverX is 100% free forever. You get unlimited 4K exports, sub-pixel edge matting for hair and fur, an integrated color changer, and batch processing at zero cost.',
    },
    {
      q: 'How does this bg remover preserve clean edges around hair, fur, and glass?',
      a: 'Our neural segmentation engine utilizes edge-gradient contour analysis, adaptive color saliency distance, and multi-pass alpha feathering. This preserves fine hair wisps, pet fur, jewelry reflections, and transparent glass without halo fringes when you remove background.',
    },
    {
      q: 'Can I bg remove multiple images at once?',
      a: 'Yes! Our Batch Background Remover lets you queue up to 50 photos simultaneously. The system executes the remove bg process across all images in parallel and bundles your transparent PNGs or white-backdrop JPEGs into a single ZIP archive.',
    },
    {
      q: 'Can I remove background and replace it with pure white or custom colors?',
      a: 'Yes! After you remove bg, click any color preset to instantly turn your background into pure Amazon-compliant white (#FFFFFF), studio gray, or choose any custom HEX/RGB/HSL shade. You can also generate realistic cast ground shadows.',
    },
    {
      q: 'Are my uploaded photos kept private when using this background remover?',
      a: 'Absolutely. We practice strict zero-retention ephemeral processing. Your images are processed directly in high-speed browser memory or sandboxed compute and automatically wiped clean. We never store, sell, or train public AI models on your photos.',
    },
    {
      q: 'What image file formats and dimensions are supported by the bg remover?',
      a: 'BgRemoverX supports JPG, JPEG, PNG, and WEBP images up to 30 MB in size and up to 4K+ resolutions. You can export results as transparent PNGs (preserving opacity), JPEGs with solid colors, or lightweight WEBP files.',
    },
    {
      q: 'Is this free background remover suitable for commercial e-commerce listings?',
      a: 'Yes. All downloaded cutouts include full commercial usage rights. The tool generates pure white (#FFFFFF) backgrounds and natural cast shadows tailored for Amazon, Shopify, eBay, Etsy, and Google Shopping standards.',
    },
  ];

  return (
    <section id="faq" className="py-10 md:py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Background Remover FAQs</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions About Removing Backgrounds
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Everything you need to know about our free AI bg remover, transparent PNG maker, and photo cutout workflows.
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

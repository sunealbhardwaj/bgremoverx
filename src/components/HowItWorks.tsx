import React from 'react';
import { Upload, Sparkles, Download, Palette, Layers, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Your Image',
      description: 'Drag and drop any JPG, PNG, or WEBP file, or paste directly from your clipboard.',
      icon: Upload,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Instant AI Background Removal',
      description: 'Our neural segmentation engine detects the subject and isolates fine hair, fur, and edges in milliseconds.',
      icon: Sparkles,
      gradient: 'from-indigo-600 to-purple-600',
    },
    {
      step: '03',
      title: 'Change Color & Download',
      description: 'Pick from 24+ colors, modern gradients, studio backdrops, add realistic shadows, and export in 4K.',
      icon: Download,
      gradient: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <section className="py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>Streamlined Workflow</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How BgRemoverX Works in 3 Simple Steps
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          No complex Photoshop lasso tools or pen selections needed. Completely automated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.gradient} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-display text-4xl font-extrabold text-slate-200 dark:text-slate-800">
                  {s.step}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {s.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

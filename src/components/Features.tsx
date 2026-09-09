import React from 'react';
import { 
  Sparkles, 
  Palette, 
  Layers, 
  Sun, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  Filter,
  Eraser,
  Image as ImageIcon
} from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Layers,
      title: 'Precision AI Background Removal',
      description: 'Sub-second neural network matting isolates humans, products, automobiles, animals, and complex objects with 1-click.',
    },
    {
      icon: Filter,
      title: 'Filters & Tone Grading',
      description: 'Adjust grayscale, vintage sepia, brightness, contrast, saturation, color temperature, and 1-click creative presets.',
    },
    {
      icon: Eraser,
      title: 'Magic Eraser & Restore Brush',
      description: 'Refine cutout boundaries manually with adjustable brush radius and edge hardness to add or erase intricate subject details.',
    },
    {
      icon: Sparkles,
      title: 'Hair & Edge Precision',
      description: 'Intelligent boundary feathering and alpha matting preserve wispy hair strands, furry pets, and translucent objects.',
    },
    {
      icon: Palette,
      title: 'Dynamic Color Changer',
      description: 'Choose from 24+ curated solid colors, pure e-commerce white, or input any custom HEX/RGB/HSL with the live Eyedropper tool.',
    },
    {
      icon: Sun,
      title: 'Realistic Natural Shadows',
      description: 'Add depth and ground your subject with directional soft drop shadows, controllable blur, spread, distance, and opacity.',
    },
    {
      icon: Zap,
      title: 'Batch Processing Studio',
      description: 'Queue up to 50 images at once, apply uniform color themes, and download everything packaged cleanly in a ZIP archive.',
    },
    {
      icon: ShieldCheck,
      title: '100% Privacy & Security',
      description: 'Ephemeral client and server processing with automatic immediate cleanup. Your images are never stored or trained on.',
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-slate-50/70 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
            <Sliders className="w-3.5 h-3.5" />
            <span>Built for Creators & E-Commerce</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Pixel-Perfect Results
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every feature you need to create product hero shots, profile headshots, and marketing collateral in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

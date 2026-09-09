import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Info, 
  Layers, 
  Zap, 
  Sliders, 
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  HardDrive
} from 'lucide-react';
import { 
  ProcessedImage, 
  EditorState, 
  ExportFormat, 
  ExportQuality, 
  ExportSize 
} from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  processedImage: ProcessedImage;
  editorState: EditorState;
  onExport: (format: ExportFormat, quality: ExportQuality, size: ExportSize, customFileName: string) => Promise<void>;
  isExporting: boolean;
  darkMode: boolean;
}

interface FormatOption {
  format: ExportFormat;
  title: string;
  extension: string;
  badge: string;
  supportsAlpha: boolean;
  description: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    format: 'png',
    title: 'PNG',
    extension: '.png',
    badge: 'Lossless • Alpha',
    supportsAlpha: true,
    description: 'Pixel-perfect transparent background cutout. Ideal for logos, graphics, stickers, and compositing.',
  },
  {
    format: 'jpg',
    title: 'JPG',
    extension: '.jpg',
    badge: 'Universal • E-Commerce',
    supportsAlpha: false,
    description: 'Standard photo format. Transparent background is rendered on crisp pure white (#FFFFFF) for marketplace compliance.',
  },
  {
    format: 'webp',
    title: 'WebP',
    extension: '.webp',
    badge: 'Modern • 35% Smaller',
    supportsAlpha: true,
    description: 'Next-generation web image format featuring full alpha transparency with significantly reduced file size.',
  },
];

interface QualityOption {
  quality: 'low' | 'medium' | 'high';
  title: string;
  badge: string;
  description: string;
  compressionLabel: string;
}

const QUALITY_OPTIONS: QualityOption[] = [
  {
    quality: 'low',
    title: 'Low',
    badge: 'Small File',
    description: 'Great for rapid messaging, mobile bandwidth saving, and web previews.',
    compressionLabel: '~65% Quality',
  },
  {
    quality: 'medium',
    title: 'Medium',
    badge: 'Recommended',
    description: 'Optimal balance between crisp contours and compact storage size.',
    compressionLabel: '~85% Quality',
  },
  {
    quality: 'high',
    title: 'High',
    badge: 'Studio Master',
    description: 'Maximum fidelity and sharp edge transitions. Preserves fine hair, fur, and delicate contours.',
    compressionLabel: '~98% Quality',
  },
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  processedImage,
  editorState,
  onExport,
  isExporting,
  darkMode,
}) => {
  // Format, Quality, Size selections
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(editorState.exportFormat || 'png');
  const [selectedQuality, setSelectedQuality] = useState<'low' | 'medium' | 'high'>(() => {
    if (editorState.exportQuality === 'low') return 'low';
    if (editorState.exportQuality === 'medium' || editorState.exportQuality === 'standard') return 'medium';
    return 'high';
  });
  const [selectedSize, setSelectedSize] = useState<ExportSize>(editorState.exportSize || 'original');
  const [customFileName, setCustomFileName] = useState<string>(() => {
    return processedImage.originalName.replace(/\.[^/.]+$/, '');
  });

  // Sync state when modal opens or processedImage changes
  useEffect(() => {
    if (isOpen) {
      setSelectedFormat(editorState.exportFormat || 'png');
      if (editorState.exportQuality === 'low') setSelectedQuality('low');
      else if (editorState.exportQuality === 'medium' || editorState.exportQuality === 'standard') setSelectedQuality('medium');
      else setSelectedQuality('high');
      setSelectedSize(editorState.exportSize || 'original');
      setCustomFileName(processedImage.originalName.replace(/\.[^/.]+$/, ''));
    }
  }, [isOpen, editorState, processedImage]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isExporting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExporting, onClose]);

  if (!isOpen) return null;

  // Compute calculated dimensions based on size selection
  const getCalculatedDimensions = () => {
    const w = processedImage.originalWidth;
    const h = processedImage.originalHeight;
    const maxDim = Math.max(w, h);

    if (selectedSize === '1080p') {
      const scale = 1080 / maxDim;
      return { width: Math.round(w * scale), height: Math.round(h * scale) };
    }
    if (selectedSize === '2048px') {
      const scale = 2048 / maxDim;
      return { width: Math.round(w * scale), height: Math.round(h * scale) };
    }
    if (selectedSize === '4k') {
      const scale = 3840 / maxDim;
      return { width: Math.round(w * scale), height: Math.round(h * scale) };
    }
    return { width: w, height: h };
  };

  const currentDims = getCalculatedDimensions();

  // Dynamic estimate of output size based on format, resolution, and quality
  const getEstimatedFileSize = (): string => {
    const megapixels = (currentDims.width * currentDims.height) / 1000000;
    
    if (selectedFormat === 'png') {
      // PNG is lossless raster
      const baseKb = megapixels * 650;
      if (baseKb > 1024) {
        return `~${(baseKb / 1024).toFixed(1)} MB`;
      }
      return `~${Math.round(baseKb)} KB`;
    }

    if (selectedFormat === 'jpg') {
      let multiplier = 120;
      if (selectedQuality === 'low') multiplier = 75;
      if (selectedQuality === 'medium') multiplier = 135;
      if (selectedQuality === 'high') multiplier = 240;
      const kb = megapixels * multiplier;
      if (kb > 1024) return `~${(kb / 1024).toFixed(1)} MB`;
      return `~${Math.round(kb)} KB`;
    }

    // WebP
    let multiplier = 80;
    if (selectedQuality === 'low') multiplier = 45;
    if (selectedQuality === 'medium') multiplier = 90;
    if (selectedQuality === 'high') multiplier = 160;
    const kb = megapixels * multiplier;
    if (kb > 1024) return `~${(kb / 1024).toFixed(1)} MB`;
    return `~${Math.round(kb)} KB`;
  };

  const handleTriggerExport = async () => {
    try {
      await onExport(selectedFormat, selectedQuality, selectedSize, customFileName);
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isExporting) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 id="export-modal-title" className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Export Image Settings</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Ready to Download
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose output format, compression quality, and image options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExporting}
            aria-label="Close export dialog"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(88vh-140px)] text-slate-900 dark:text-slate-100">
          {/* Preview & File Metadata Strip */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Thumbnail with checkerboard */}
              <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 relative bg-checkerboard flex items-center justify-center">
                <img 
                  src={processedImage.cutoutUrl} 
                  alt="Export preview" 
                  className="w-full h-full object-contain p-0.5" 
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                    {customFileName || 'image'}.{selectedFormat}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {selectedFormat}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{currentDims.width} × {currentDims.height} px</span>
                  <span>•</span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    Est. Size: {getEstimatedFileSize()}
                  </span>
                </div>
              </div>
            </div>

            {/* Rename Input */}
            <div className="w-full sm:w-48 shrink-0">
              <label htmlFor="export-filename-input" className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                File Name
              </label>
              <input
                id="export-filename-input"
                type="text"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder="image_cutout"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 1: Output Format (PNG, JPG, WebP) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>1. Choose Output Format</span>
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {selectedFormat === 'jpg' ? 'Solid Backdrop' : 'Transparency Supported'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {FORMAT_OPTIONS.map((opt) => {
                const isSelected = selectedFormat === opt.format;
                return (
                  <button
                    key={opt.format}
                    type="button"
                    onClick={() => setSelectedFormat(opt.format)}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-bold uppercase ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {opt.title}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected 
                              ? 'bg-indigo-200/80 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {opt.extension}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mb-2">
                        {opt.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-medium">
                      <span className={opt.supportsAlpha ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}>
                        {opt.supportsAlpha ? '✓ Alpha Transparent' : '• Pure White/Backdrop'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Helpful format-specific notice */}
            {selectedFormat === 'jpg' && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>JPG notice:</strong> JPEG format does not support transparency. Any transparent background areas will automatically render on a clean pure white background (#FFFFFF), making it ready for e-commerce listings.
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Quality Level (Low, Medium, High) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>2. Select Quality Level</span>
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {selectedQuality === 'high' ? 'Studio Fidelity' : selectedQuality === 'medium' ? 'Balanced Compression' : 'Maximum Compression'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {QUALITY_OPTIONS.map((q) => {
                const isSelected = selectedQuality === q.quality;
                return (
                  <button
                    key={q.quality}
                    type="button"
                    onClick={() => setSelectedQuality(q.quality)}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                            {q.title}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                            ({q.compressionLabel})
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mb-2">
                        {q.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                        {q.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedFormat === 'png' && (
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>PNG uses lossless compression (always pixel-perfect). Selecting Medium or Low applies WebP/JPG compression or downsampling when converting.</span>
              </p>
            )}
          </div>

          {/* Section 3: Output Resolution (Scale) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>3. Resolution Scale</span>
              </label>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                {currentDims.width} × {currentDims.height} px
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedSize('original')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedSize === 'original'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">Original (100%)</div>
                <div className="text-[10px] text-slate-400 font-normal">
                  {processedImage.originalWidth} × {processedImage.originalHeight} px
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSize('1080p')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedSize === '1080p'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">Full HD (1080p)</div>
                <div className="text-[10px] text-slate-400 font-normal">1080px Max Dim</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSize('4k')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedSize === '4k'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">Ultra HD 4K</div>
                <div className="text-[10px] text-slate-400 font-normal">3840px Max Dim</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 w-full sm:w-auto justify-center sm:justify-start">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% Free • No watermark • Commercial use</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleTriggerExport}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preparing Export...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    Download {selectedFormat.toUpperCase()} ({QUALITY_OPTIONS.find((q) => q.quality === selectedQuality)?.title})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

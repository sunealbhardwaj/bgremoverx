import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Clipboard, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Shield, 
  RefreshCw,
  Layers,
  Palette,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { SampleImageItem, ProcessingMode } from '../types';

interface HeroUploadProps {
  onFileSelected: (file: File, mode?: ProcessingMode) => void;
  onSampleSelected: (sample: SampleImageItem, mode?: ProcessingMode) => void;
  isProcessing: boolean;
  progressStep: string;
  progressPercent: number;
  errorMessage: string | null;
  onClearError: () => void;
}

export const HeroUpload: React.FC<HeroUploadProps> = ({
  onFileSelected,
  onSampleSelected,
  isProcessing,
  progressStep,
  progressPercent,
  errorMessage,
  onClearError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ProcessingMode>('hd');
  const [localNotification, setLocalNotification] = useState<string | null>(null);

  const displayMessage = (msg: string) => {
    setLocalNotification(msg);
    setTimeout(() => {
      setLocalNotification((current) => (current === msg ? null : current));
    }, 5000);
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isProcessing) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            setPasteSuccess(true);
            setTimeout(() => setPasteSuccess(false), 2000);
            onFileSelected(blob, selectedMode);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isProcessing, onFileSelected, selectedMode]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndUpload(file);
      e.target.value = '';
    }
  };

  const validateAndUpload = (file: File) => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeBytes = 30 * 1024 * 1024; // 30 MB

    if (!validImageTypes.includes(file.type.toLowerCase())) {
      displayMessage('Please upload a supported image format (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > maxSizeBytes) {
      displayMessage('File size exceeds 30MB. Please upload a smaller file.');
      return;
    }

    onFileSelected(file, selectedMode);
  };

  const handlePasteClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const file = new File([blob], 'clipboard_image.png', { type });
              setPasteSuccess(true);
              setTimeout(() => setPasteSuccess(false), 2000);
              onFileSelected(file, selectedMode);
              return;
            }
          }
        }
        displayMessage('No image found on your clipboard. Try copying an image first, or press Ctrl+V / Cmd+V.');
      } else {
        displayMessage('Press Ctrl+V (or Cmd+V on Mac) anywhere on this page to paste your image directly.');
      }
    } catch {
      displayMessage('Press Ctrl+V (or Cmd+V on Mac) to paste your copied image.');
    }
  };

  const MODES: { id: ProcessingMode; label: string; icon: string; tag: string }[] = [
    { id: 'hd', label: 'HD Neural', icon: '✨', tag: 'Recommended' },
    { id: 'full_body', label: 'Full Body (Men/Women)', icon: '🚶', tag: 'Limbs & Shoes' },
    { id: 'portrait', label: 'Portrait', icon: '👤', tag: 'Hair & Skin' },
    { id: 'ultra_hd', label: 'Ultra HD', icon: '💎', tag: 'Sub-pixel' },
    { id: 'product', label: 'Product', icon: '📦', tag: 'E-Commerce' },
    { id: 'hair_fur', label: 'Hair & Fur', icon: '🐾', tag: 'Fine Strands' },
    { id: 'standard', label: 'Fast AI', icon: '⚡', tag: 'Quick' },
  ];

  return (
    <section id="hero" className="relative pt-4 pb-6 md:pt-6 md:pb-8 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Compact Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold mb-2.5 shadow-xs">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>100% Free AI Background Remover & Remove BG Studio</span>
        </div>

        {/* Compact Headline */}
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
          Free Background Remover —{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Remove BG & Cut Out Photos
          </span>
        </h1>

        {/* Compact Subtitle */}
        <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Fastest AI bg remover to remove background from photos, cut out portraits or products, and bg remove images with sub-pixel edge matting and 4K transparent PNG downloads.
        </p>

        {/* Upload Container */}
        <div id="editor-tool" className="mt-4 md:mt-5 max-w-3xl mx-auto">
          {/* AI Mode Selector Bar */}
          <div className="mb-4 p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 px-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Matting Mode:</span>
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMode(m.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedMode === m.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={`${m.label} (${m.tag})`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf, .pdf"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* Error Message Banner */}
          {(errorMessage || localNotification) && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-left text-sm text-amber-900 dark:text-amber-200 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{errorMessage || localNotification}</span>
              </div>
              <button 
                type="button"
                onClick={() => {
                  if (errorMessage) onClearError();
                  setLocalNotification(null);
                }}
                className="text-xs font-semibold underline hover:text-amber-950 dark:hover:text-amber-100 ml-3 shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Processing Card */}
          {isProcessing ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-indigo-500/5 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-slate-800" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"
                  style={{ animationDuration: '1.2s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {progressStep || 'Processing Image...'}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Preserving fine hair strands, transparent textures, and crisp contours.
              </p>

              {/* Progress Bar */}
              <div className="mt-4 max-w-md mx-auto">
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Detection</span>
                  <span>Isolation</span>
                  <span>Edge Matting</span>
                  <span>{progressPercent}%</span>
                </div>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-3xl p-6 sm:p-8 border-2 border-dashed transition-all duration-200 text-center ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.01]'
                  : 'border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xl shadow-slate-200/50 dark:shadow-none'
              }`}
            >
              {/* Drop Visual Indicator */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner mb-3 sm:mb-4">
                <Upload className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce" style={{ animationDuration: '2.5s' }} />
              </div>

              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Drag and drop your image here
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                or use one of the quick options below
              </p>

              {/* Action Buttons */}
              <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>

                <button
                  type="button"
                  onClick={handlePasteClick}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Clipboard className="w-4 h-4 text-indigo-500" />
                  <span>{pasteSuccess ? 'Pasted!' : 'Paste Image (Ctrl+V)'}</span>
                </button>
              </div>

              {/* Supported Formats info */}
              <div className="mt-4 sm:mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Supported formats: <strong className="text-slate-700 dark:text-slate-300">JPG, JPEG, PNG, WEBP</strong></span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Max file size: <strong className="text-slate-700 dark:text-slate-300">25 MB</strong></span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>100% Automatic & Free</span>
                </div>
              </div>
            </div>
          )}

          {/* Sample Images Section for Instant Testing */}
          <div className="mt-5 text-center">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2.5">
              Don't have an image ready? Try with a sample photo:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSampleSelected(sample, selectedMode)}
                  disabled={isProcessing}
                  className="group relative flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all text-left text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-50"
                >
                  <img
                    src={sample.previewUrl}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <span>{sample.title}</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Test →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

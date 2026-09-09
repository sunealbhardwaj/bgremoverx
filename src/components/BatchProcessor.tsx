import React, { useState, useRef } from 'react';
import { 
  Zap, 
  Upload, 
  Trash2, 
  Play, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileArchive, 
  X,
  Sparkles,
  Layers,
  Palette
} from 'lucide-react';
import JSZip from 'jszip';
import { BatchItem } from '../types';
import { removeImageBackground, formatBytes } from '../utils/segmentation';
import { SOLID_COLOR_PRESETS } from '../utils/presets';

interface BatchProcessorProps {
  onClose: () => void;
  darkMode: boolean;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({ onClose, darkMode }) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [batchBgColor, setBatchBgColor] = useState<string>('transparent');
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: BatchItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newItems.push({
          id: `batch_${Date.now()}_${i}`,
          file,
          originalName: file.name,
          sizeFormatted: formatBytes(file.size),
          status: 'idle',
          progressStep: 'Waiting in queue',
          originalUrl: URL.createObjectURL(file),
        });
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  // Process single item
  const processItem = async (item: BatchItem, bgColor: string): Promise<BatchItem> => {
    try {
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: 'processing', progressStep: 'Removing background...' } : it
        )
      );

      const result = await removeImageBackground(item.file, item.originalName, (step) => {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, progressStep: step } : it))
        );
      });

      // If a non-transparent background color is specified for batch:
      let finalDataUrl = result.cutoutUrl;
      if (bgColor !== 'transparent') {
        const renderCanvas = document.createElement('canvas');
        renderCanvas.width = result.originalWidth;
        renderCanvas.height = result.originalHeight;
        const ctx = renderCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, result.originalWidth, result.originalHeight);
          const cutoutImg = new Image();
          cutoutImg.src = result.cutoutUrl;
          await new Promise<void>((resolve, reject) => {
            cutoutImg.onload = () => resolve();
            cutoutImg.onerror = () => reject(new Error('Failed to load cutout image for composition'));
          });
          ctx.drawImage(cutoutImg, 0, 0);
          finalDataUrl = renderCanvas.toDataURL('image/png');
        }
      }

      return {
        ...item,
        status: 'completed',
        progressStep: 'Completed',
        cutoutUrl: result.cutoutUrl,
        resultDataUrl: finalDataUrl,
      };
    } catch (err: any) {
      return {
        ...item,
        status: 'error',
        progressStep: 'Failed',
        error: err?.message || 'Processing error',
      };
    }
  };

  // Process all queue items sequentially
  const handleProcessAll = async () => {
    if (items.length === 0 || isProcessingAll) return;
    setIsProcessingAll(true);

    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      if (current.status !== 'completed') {
        const updated = await processItem(current, batchBgColor);
        setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      }
    }

    setIsProcessingAll(false);
  };

  // Download single item
  const handleDownloadSingle = (item: BatchItem) => {
    if (!item.resultDataUrl) return;
    const link = document.createElement('a');
    link.download = `cutout_${item.originalName.replace(/\.[^/.]+$/, '')}.png`;
    link.href = item.resultDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    const completedItems = items.filter((it) => it.status === 'completed' && it.resultDataUrl);
    if (completedItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('cutout_batch_results');

      for (let i = 0; i < completedItems.length; i++) {
        const it = completedItems[i];
        const base64Data = it.resultDataUrl!.replace(/^data:image\/[a-z]+;base64,/, '');
        const filename = `cutout_${it.originalName.replace(/\.[^/.]+$/, '')}.png`;
        folder?.file(filename, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.download = `cutout_ai_batch_${Date.now()}.zip`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const completedCount = items.filter((it) => it.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Batch Image Studio</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  Bulk Processing
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Remove backgrounds and replace colors for up to 50 images in one click.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Config: Bulk Background Color */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Apply Background to All:
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { name: 'Transparent', hex: 'transparent' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Black', hex: '#000000' },
                { name: 'Studio Gray', hex: '#E2E8F0' },
                { name: 'Blue', hex: '#3B82F6' },
                { name: 'Red', hex: '#EF4444' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setBatchBgColor(c.hex)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    batchBgColor === c.hex
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area if empty or Add more */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />

          {items.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/30"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                Click to Select Multiple Images
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, PNG, WEBP files up to 25MB each
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Queue: {items.length} images ({completedCount} completed)</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add More</span>
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div
                    key={it.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 bg-checkerboard-light">
                        <img
                          src={it.resultDataUrl || it.originalUrl}
                          alt={it.originalName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
                          {it.originalName}
                        </h4>
                        <p className="text-[11px] text-slate-400">{it.sizeFormatted}</p>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="flex items-center gap-3">
                      {it.status === 'idle' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Waiting
                        </span>
                      )}
                      {it.status === 'processing' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 animate-pulse flex items-center gap-1">
                          <Sparkles className="w-3 h-3 animate-spin" />
                          <span>{it.progressStep}</span>
                        </span>
                      )}
                      {it.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Done</span>
                          </span>
                          <button
                            onClick={() => handleDownloadSingle(it)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400"
                            title="Download this image"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {it.status === 'error' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                          Failed
                        </span>
                      )}

                      <button
                        onClick={() => handleRemoveItem(it.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="px-5 py-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center gap-2"
              >
                <FileArchive className="w-4 h-4" />
                <span>{isZipping ? 'Creating ZIP...' : `Download All (${completedCount}) as ZIP`}</span>
              </button>
            )}

            <button
              onClick={handleProcessAll}
              disabled={items.length === 0 || isProcessingAll}
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isProcessingAll ? 'Processing Batch...' : 'Process All Images'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

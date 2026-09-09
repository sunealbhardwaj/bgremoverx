import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, 
  RefreshCw, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Palette, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  FlipHorizontal, 
  FlipVertical, 
  Sun, 
  Eye, 
  Copy, 
  Check, 
  Upload, 
  Move,
  Grid,
  Zap,
  Pipette,
  Maximize,
  ChevronDown,
  Eraser,
  Brush,
  Undo2,
  Redo2,
  Wand2,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowLeftRight,
  SlidersHorizontal,
  ShieldCheck,
  SplitSquareVertical,
  Activity,
  Filter
} from 'lucide-react';
import { 
  ProcessedImage, 
  EditorState, 
  BackgroundMode, 
  GradientConfig, 
  ShadowConfig, 
  SubjectTransform, 
  ExportFormat, 
  ExportQuality, 
  ExportSize,
  ProcessingMode,
  NaturalShadowMode,
  QualityReport
} from '../types';
import { SOLID_COLOR_PRESETS, GRADIENT_PRESETS, CURATED_BACKDROPS, FILTER_PRESETS, FilterPreset } from '../utils/presets';
import { renderCompositionToCanvas, downloadExportedImage, getCanvasDimensions } from '../utils/canvasRenderer';
import { 
  removeImageBackground, 
  loadImage, 
  applyAutoEdgeCleanup, 
  applyEdgeDecontamination,
  analyzeMaskQuality,
  restoreFullBodySilhouette
} from '../utils/segmentation';
import { AdBanner } from './AdBanner';
import { ExportModal } from './ExportModal';

interface WorkspaceEditorProps {
  processedImage: ProcessedImage;
  onUploadAnother: () => void;
  darkMode: boolean;
}

type TabType = 'ai_modes' | 'color' | 'gradient' | 'backdrop' | 'filters' | 'shadow' | 'refine' | 'transform' | 'adjustments' | 'export';
type PreviewViewMode = 'split' | 'side-by-side' | 'result-only' | 'original-only';
type CanvasBackdrop = 'checkered' | 'checkered-dark' | 'white' | 'black' | 'gray';

export const WorkspaceEditor: React.FC<WorkspaceEditorProps> = ({
  processedImage,
  onUploadAnother,
  darkMode,
}) => {
  // Current Processed Image (holds high-res cutout & mask)
  const [currentImage, setCurrentImage] = useState<ProcessedImage>(processedImage);
  const [undoStack, setUndoStack] = useState<string[]>([processedImage.cutoutUrl]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Active Tool Tabs
  const [activeTab, setActiveTab] = useState<TabType>('ai_modes');
  const [viewMode, setViewMode] = useState<PreviewViewMode>('split');
  const [canvasBackdrop, setCanvasBackdrop] = useState<CanvasBackdrop>('checkered');

  // Interactive Split Slider (0 to 100%)
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Action status
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isAutoCleaning, setIsAutoCleaning] = useState<boolean>(false);
  const [isRestoringFullBody, setIsRestoringFullBody] = useState<boolean>(false);

  // AI Matting & Processing Mode
  const [selectedMode, setSelectedMode] = useState<ProcessingMode>(
    processedImage.processingMode || 'hd'
  );
  const [isReProcessing, setIsReProcessing] = useState<boolean>(false);
  const [reProcessStep, setReProcessStep] = useState<string>('');
  const [reProcessPercent, setReProcessPercent] = useState<number>(0);

  // Matting fine-tuning options
  const [sensitivity, setSensitivity] = useState<number>(50);
  const [edgeFeather, setEdgeFeather] = useState<number>(2);
  const [smoothRadius, setSmoothRadius] = useState<number>(1);
  const [defringeStrength, setDefringeStrength] = useState<number>(0.75);

  // Quality Diagnostics
  const [qualityReport, setQualityReport] = useState<QualityReport | undefined>(
    processedImage.qualityReport
  );

  // Manual Brush Touch-up Studio
  const [brushMode, setBrushMode] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState<number>(28);
  const [brushFeather, setBrushFeather] = useState<number>(25);
  const [brushOpacity, setBrushOpacity] = useState<number>(100);
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  // Natural Shadow Preset
  const [naturalShadowPreset, setNaturalShadowPreset] = useState<NaturalShadowMode>('none');

  // Custom Color State
  const [hexInput, setHexInput] = useState<string>('#FFFFFF');
  const [editorToast, setEditorToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setEditorToast(msg);
    setTimeout(() => {
      setEditorToast((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Editor State
  const [editorState, setEditorState] = useState<EditorState>({
    backgroundMode: 'transparent',
    solidColor: '#FFFFFF',
    gradient: GRADIENT_PRESETS[0],
    backdrop: {
      url: CURATED_BACKDROPS[0].url,
      name: CURATED_BACKDROPS[0].name,
      scale: 1.0,
      positionX: 0,
      positionY: 0,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      opacity: 100,
    },
    subjectTransform: {
      scale: 1.0,
      positionX: 0,
      positionY: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
    },
    subjectAdjustments: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      warmth: 0,
      sharpness: 0,
      clarity: 0,
      defringe: 0,
      vibrance: 0,
      denoise: 0,
      highlights: 0,
      shadows: 0,
      upscale: 1,
    },
    shadow: {
      enabled: false,
      color: '#000000',
      opacity: 0.35,
      blur: 24,
      distance: 18,
      angle: 90,
      spread: 0,
      type: 'none',
    },
    outline: {
      enabled: false,
      color: '#FFFFFF',
      width: 8,
      blur: 0,
    },
    aspectRatio: 'original',
    exportFormat: 'png',
    exportQuality: 'high',
    exportSize: 'original',
    activeProcessingMode: processedImage.processingMode || 'hd',
  });

  // Canvas Refs
  const compositionCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Sync prop updates
  useEffect(() => {
    setCurrentImage(processedImage);
    setUndoStack([processedImage.cutoutUrl]);
    setRedoStack([]);
    setQualityReport(processedImage.qualityReport);
    if (processedImage.processingMode) {
      setSelectedMode(processedImage.processingMode);
    }
  }, [processedImage]);

  // Main Canvas Render
  const updateCanvas = useCallback(async () => {
    if (compositionCanvasRef.current) {
      await renderCompositionToCanvas(
        compositionCanvasRef.current,
        currentImage,
        editorState,
        1.0
      );
    }

    // Render Original onto original canvas for split view
    if (originalCanvasRef.current && (viewMode === 'split' || viewMode === 'side-by-side' || viewMode === 'original-only')) {
      const origCanvas = originalCanvasRef.current;
      const { width: tW, height: tH } = getCanvasDimensions(
        currentImage.originalWidth,
        currentImage.originalHeight,
        editorState.aspectRatio,
        1.0
      );
      origCanvas.width = tW;
      origCanvas.height = tH;
      const ctx = origCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, tW, tH);
        try {
          const origImg = await loadImage(currentImage.originalUrl);
          ctx.drawImage(origImg, 0, 0, tW, tH);
        } catch {
          // ignore
        }
      }
    }
  }, [currentImage, editorState, viewMode]);

  useEffect(() => {
    updateCanvas();
  }, [updateCanvas]);

  // Re-run AI Segmentation with selected mode
  const handleReProcessWithMode = async (targetMode: ProcessingMode) => {
    setSelectedMode(targetMode);
    setIsReProcessing(true);
    setReProcessStep('Initializing AI Matting Pipeline...');
    setReProcessPercent(10);

    try {
      const result = await removeImageBackground(
        currentImage.originalUrl,
        currentImage.originalName,
        (step, percent) => {
          setReProcessStep(step);
          setReProcessPercent(percent);
        },
        {
          mode: targetMode,
          sensitivity,
          edgeFeather,
          smoothRadius,
          defringeStrength,
        }
      );

      setCurrentImage(result);
      setUndoStack((prev) => [...prev, result.cutoutUrl]);
      setRedoStack([]);
      setQualityReport(result.qualityReport);
      setEditorState((prev) => ({
        ...prev,
        activeProcessingMode: targetMode,
      }));
    } catch (err: any) {
      console.error('Re-processing failed:', err);
      showToast(err?.message || 'Re-processing failed. Switching back to standard precision.');
    } finally {
      setIsReProcessing(false);
      setReProcessStep('');
      setReProcessPercent(0);
    }
  };

  // 1-Click Auto Edge Clean & De-halo
  const handleAutoEdgeClean = async () => {
    setIsAutoCleaning(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = currentImage.originalWidth;
      canvas.height = currentImage.originalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const cutoutImg = await loadImage(currentImage.cutoutUrl);
      ctx.drawImage(cutoutImg, 0, 0);

      // Apply cleanup filters
      applyAutoEdgeCleanup(canvas);
      applyEdgeDecontamination(canvas, 0.85);

      const newCutoutUrl = canvas.toDataURL('image/png');
      const updatedImage: ProcessedImage = {
        ...currentImage,
        cutoutUrl: newCutoutUrl,
      };

      // Re-run diagnostics
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newReport = analyzeMaskQuality(imgData, canvas.width, canvas.height);

      setCurrentImage(updatedImage);
      setQualityReport(newReport);
      setUndoStack((prev) => [...prev, newCutoutUrl]);
      setRedoStack([]);
    } catch (e) {
      console.error('Auto edge cleanup error:', e);
    } finally {
      setIsAutoCleaning(false);
    }
  };

  // 1-Click Restore Full Body, Legs & Hands
  const handleRestoreFullBody = async () => {
    setIsRestoringFullBody(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = currentImage.originalWidth;
      canvas.height = currentImage.originalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const [cutoutImg, origImg] = await Promise.all([
        loadImage(currentImage.cutoutUrl),
        loadImage(currentImage.originalUrl),
      ]);

      ctx.drawImage(cutoutImg, 0, 0);
      restoreFullBodySilhouette(canvas, origImg);

      const newCutoutUrl = canvas.toDataURL('image/png');
      const updatedImage: ProcessedImage = {
        ...currentImage,
        cutoutUrl: newCutoutUrl,
      };

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newReport = analyzeMaskQuality(imgData, canvas.width, canvas.height);

      setCurrentImage(updatedImage);
      setQualityReport(newReport);
      setUndoStack((prev) => [...prev, newCutoutUrl]);
      setRedoStack([]);
    } catch (e) {
      console.error('Restore full body error:', e);
    } finally {
      setIsRestoringFullBody(false);
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (undoStack.length > 1) {
      const newStack = [...undoStack];
      const popped = newStack.pop();
      if (popped) {
        setRedoStack((prev) => [...prev, popped]);
      }
      const prevUrl = newStack[newStack.length - 1];
      setUndoStack(newStack);
      setCurrentImage((prev) => ({
        ...prev,
        cutoutUrl: prevUrl,
      }));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const newRedo = [...redoStack];
      const nextUrl = newRedo.pop();
      if (nextUrl) {
        setRedoStack(newRedo);
        setUndoStack((prev) => [...prev, nextUrl]);
        setCurrentImage((prev) => ({
          ...prev,
          cutoutUrl: nextUrl,
        }));
      }
    }
  };

  // Reset to original AI cutout
  const handleResetToInitial = () => {
    setCurrentImage(processedImage);
    setUndoStack([processedImage.cutoutUrl]);
    setRedoStack([]);
    setQualityReport(processedImage.qualityReport);
  };

  // Eyedropper API
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          setEditorState((prev) => ({
            ...prev,
            backgroundMode: 'solid',
            solidColor: result.sRGBHex,
          }));
          setHexInput(result.sRGBHex);
        }
      } catch {
        // User canceled
      }
    } else {
      showToast('Eyedropper tool is not supported in this browser. Please use the color palette below.');
    }
  };

  // Natural Shadow Preset Switcher
  const handleSelectShadowPreset = (preset: NaturalShadowMode) => {
    setNaturalShadowPreset(preset);
    if (preset === 'none') {
      setEditorState((prev) => ({
        ...prev,
        shadow: { ...prev.shadow, enabled: false, type: 'none' },
      }));
    } else if (preset === 'contact') {
      setEditorState((prev) => ({
        ...prev,
        shadow: {
          enabled: true,
          type: 'contact',
          color: '#000000',
          opacity: 0.55,
          blur: 10,
          distance: 12,
          angle: 90,
          spread: -2,
        },
      }));
    } else if (preset === 'ambient') {
      setEditorState((prev) => ({
        ...prev,
        shadow: {
          enabled: true,
          type: 'ambient',
          color: '#000000',
          opacity: 0.35,
          blur: 32,
          distance: 0,
          angle: 0,
          spread: 4,
        },
      }));
    } else if (preset === 'directional') {
      setEditorState((prev) => ({
        ...prev,
        shadow: {
          enabled: true,
          type: 'directional',
          color: '#000000',
          opacity: 0.4,
          blur: 24,
          distance: 28,
          angle: 120,
          spread: 0,
        },
      }));
    } else if (preset === 'preserve_original') {
      setEditorState((prev) => ({
        ...prev,
        shadow: {
          enabled: true,
          type: 'preserve_original',
          color: '#000000',
          opacity: 0.45,
          blur: 16,
          distance: 14,
          angle: 90,
          spread: 0,
        },
      }));
    }
  };

  // Filter Presets & Reset Handlers
  const handleApplyFilterPreset = (preset: FilterPreset) => {
    setEditorState((prev) => ({
      ...prev,
      subjectAdjustments: {
        ...prev.subjectAdjustments,
        brightness: preset.adjustments.brightness,
        contrast: preset.adjustments.contrast,
        saturation: preset.adjustments.saturation,
        grayscale: preset.adjustments.grayscale,
        sepia: preset.adjustments.sepia,
        hueRotate: preset.adjustments.hueRotate ?? 0,
        warmth: preset.adjustments.warmth ?? 0,
      },
    }));
    showToast(`Applied ${preset.name} filter preset`);
  };

  const handleResetFilters = () => {
    setEditorState((prev) => ({
      ...prev,
      subjectAdjustments: {
        ...prev.subjectAdjustments,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        grayscale: 0,
        sepia: 0,
        hueRotate: 0,
        warmth: 0,
      },
    }));
    showToast('Reset all filters to default');
  };

  // Interactive Brush Editing (Erase / Restore)
  const applyBrushStroke = async (clientX: number, clientY: number) => {
    if (activeTab !== 'refine' || !compositionCanvasRef.current) return;

    const canvas = compositionCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const xNorm = (clientX - rect.left) / rect.width;
    const yNorm = (clientY - rect.top) / rect.height;

    if (xNorm < 0 || xNorm > 1 || yNorm < 0 || yNorm > 1) return;

    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = currentImage.originalWidth;
      offCanvas.height = currentImage.originalHeight;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      const [cutoutImg, origImg] = await Promise.all([
        loadImage(currentImage.cutoutUrl),
        loadImage(currentImage.originalUrl),
      ]);

      offCtx.drawImage(cutoutImg, 0, 0);

      const px = xNorm * currentImage.originalWidth;
      const py = yNorm * currentImage.originalHeight;
      // Scale brush according to original high resolution
      const scaleMultiplier = currentImage.originalWidth / Math.max(10, rect.width);
      const scaledBrushRadius = (brushSize / 2) * scaleMultiplier;

      offCtx.save();
      offCtx.beginPath();
      offCtx.arc(px, py, scaledBrushRadius, 0, Math.PI * 2);
      offCtx.clip();

      const alphaOpacity = brushOpacity / 100;

      if (brushMode === 'erase') {
        offCtx.globalCompositeOperation = 'destination-out';
        offCtx.fillStyle = `rgba(0, 0, 0, ${alphaOpacity})`;
        offCtx.fillRect(
          px - scaledBrushRadius - 2,
          py - scaledBrushRadius - 2,
          scaledBrushRadius * 2 + 4,
          scaledBrushRadius * 2 + 4
        );
      } else {
        // Restore from pristine original image
        offCtx.globalCompositeOperation = 'source-over';
        offCtx.globalAlpha = alphaOpacity;
        offCtx.drawImage(origImg, 0, 0);
      }

      offCtx.restore();

      const newCutoutUrl = offCanvas.toDataURL('image/png');
      setCurrentImage((prev) => ({
        ...prev,
        cutoutUrl: newCutoutUrl,
      }));
    } catch (e) {
      console.warn('Brush drawing error:', e);
    }
  };

  // Pointer events on canvas container
  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTab === 'refine') {
      setIsPainting(true);
      applyBrushStroke(e.clientX, e.clientY);
    } else if (e.button === 1 || (e.altKey && e.button === 0)) {
      // Middle click or Alt+Click pan
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeTab === 'refine') {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true,
      });

      if (isPainting) {
        applyBrushStroke(e.clientX, e.clientY);
      }
    }

    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }

    // Split Slider dragging
    if (isDraggingSplit && splitContainerRef.current) {
      const rect = splitContainerRef.current.getBoundingClientRect();
      const pos = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPosition(Math.max(0, Math.min(100, pos)));
    }
  };

  const handlePointerUp = () => {
    if (isPainting) {
      setIsPainting(false);
      setUndoStack((prev) => [...prev, currentImage.cutoutUrl]);
      setRedoStack([]);
    }
    setIsPanning(false);
    setIsDraggingSplit(false);
  };

  const handlePointerLeave = () => {
    if (isPainting) {
      setIsPainting(false);
      setUndoStack((prev) => [...prev, currentImage.cutoutUrl]);
      setRedoStack([]);
    }
    setIsPanning(false);
    setIsDraggingSplit(false);
    setMousePos((prev) => ({ ...prev, visible: false }));
  };

  // Custom Background File Upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setEditorState((prev) => ({
        ...prev,
        backgroundMode: 'image',
        backdrop: {
          ...prev.backdrop,
          url,
          name: file.name,
        },
      }));
      e.target.value = '';
    }
  };

  // Copy Cutout to Clipboard
  const handleCopyToClipboard = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = currentImage.originalWidth;
      canvas.height = currentImage.originalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = await loadImage(currentImage.cutoutUrl);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && (window as any).ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new (window as any).ClipboardItem({ 'image/png': blob }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
          } catch {
            downloadExportedImage(currentImage, editorState, 'png');
          }
        } else {
          downloadExportedImage(currentImage, editorState, 'png');
        }
      }, 'image/png');
    } catch {
      downloadExportedImage(currentImage, editorState, 'png');
    }
  };

  // Download Trigger
  const handleDownload = async (
    format?: ExportFormat,
    quality?: ExportQuality,
    size?: ExportSize,
    customFileName?: string
  ) => {
    setIsExporting(true);
    try {
      await downloadExportedImage(currentImage, editorState, format, quality, size, customFileName);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Mode descriptions helper
  const MODE_INFO: Record<ProcessingMode, { name: string; desc: string; badge: string; icon: string }> = {
    hd: {
      name: 'HD Neural Matting',
      desc: 'Balanced high-precision neural edge matting. Excellent for general studio portraits and items.',
      badge: 'Recommended',
      icon: '✨',
    },
    full_body: {
      name: 'Full Body (Men/Women)',
      desc: 'Guarantees complete full-body protection from head to toe, preserving shoes, pants, legs, arms, and hands.',
      badge: 'Head-to-Toe',
      icon: '🚶',
    },
    portrait: {
      name: 'Portrait & Skin',
      desc: 'Tuned specifically for human headshots, delicate hair strands, clothing folds, and rim lighting.',
      badge: 'People',
      icon: '👤',
    },
    ultra_hd: {
      name: 'Ultra HD & Detail',
      desc: 'Maximum sub-pixel alpha resolution. Captures delicate semi-transparent details and wisps.',
      badge: 'Max Precision',
      icon: '💎',
    },
    product: {
      name: 'Product Photography',
      desc: 'Sharp geometric boundaries, specular glass transparency, footwear, and jewelry edges.',
      badge: 'E-Commerce',
      icon: '📦',
    },
    hair_fur: {
      name: 'Hair & Animal Fur',
      desc: 'Deep multi-scale texture matting designed for animal fur, pet whiskers, and textured fleece.',
      badge: 'Pets & Hair',
      icon: '🐾',
    },
    standard: {
      name: 'Fast AI',
      desc: 'Fast, lightweight foreground segmentation suitable for simple shapes and quick drafts.',
      badge: 'Fast',
      icon: '⚡',
    },
  };

  return (
    <div 
      ref={containerRef}
      id="workspace-editor-root"
      className={`max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 transition-all relative ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 max-w-none' : ''
      }`}
    >
      {/* Non-intrusive Floating Notification Toast */}
      {editorToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 text-white dark:bg-white/95 dark:text-slate-900 shadow-2xl border border-slate-700/50 dark:border-slate-200/50 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-sm">
          <Info className="w-4 h-4 text-indigo-400 dark:text-indigo-600 shrink-0" />
          <span className="flex-1">{editorToast}</span>
          <button
            type="button"
            onClick={() => setEditorToast(null)}
            className="hover:opacity-70 text-slate-400 dark:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Action & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 mb-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Left Info: Filename & Resolution badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onUploadAnother}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Upload a new photo"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>New Photo</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 max-w-[180px] sm:max-w-[240px] truncate">
              {currentImage.originalName}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
              {currentImage.originalWidth} × {currentImage.originalHeight} px
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
              {MODE_INFO[selectedMode].icon} {MODE_INFO[selectedMode].name}
            </span>
          </div>
        </div>

        {/* Right Actions: Undo/Redo, Copy & Instant Transparent PNG Download */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              onClick={handleUndo}
              disabled={undoStack.length <= 1}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Undo last touch-up"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyToClipboard}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Copy transparent PNG to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-indigo-500" />}
            <span className="hidden sm:inline">{copied ? 'Copied PNG!' : 'Copy PNG'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Primary Export & Download Button */}
          <button
            onClick={() => setShowExportModal(true)}
            disabled={isExporting}
            className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            title="Choose format, quality, and download image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Image</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split: Canvas Area & Professional Controls Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================== CANVAS STAGE (8 COLS) ===================== */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Canvas Toolbar Controls (View modes & Checkerboard toggles) */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-semibold ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Split Before/After Slider"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Split Slider</span>
              </button>

              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-semibold ${
                  viewMode === 'side-by-side'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Side by Side Comparison"
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span>Side by Side</span>
              </button>

              <button
                onClick={() => setViewMode('result-only')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-semibold ${
                  viewMode === 'result-only'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Processed Cutout & Studio Background"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Cutout Only</span>
              </button>

              <button
                onClick={() => setViewMode('original-only')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-semibold ${
                  viewMode === 'original-only'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Untouched Original"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Original</span>
              </button>
            </div>

            {/* Quick Canvas Inspection Backdrop Switcher */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">Inspect:</span>
              <button
                onClick={() => setCanvasBackdrop('checkered')}
                className={`w-6 h-6 rounded-md border transition-all ${
                  canvasBackdrop === 'checkered'
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-110'
                    : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                  backgroundColor: '#ffffff',
                }}
                title="Light Checkerboard (Transparency)"
              />
              <button
                onClick={() => setCanvasBackdrop('checkered-dark')}
                className={`w-6 h-6 rounded-md border transition-all ${
                  canvasBackdrop === 'checkered-dark'
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-110'
                    : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #334155 25%, transparent 25%), linear-gradient(-45deg, #334155 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #334155 75%), linear-gradient(-45deg, transparent 75%, #334155 75%)',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                  backgroundColor: '#0f172a',
                }}
                title="Dark Checkerboard (High Contrast)"
              />
              <button
                onClick={() => setCanvasBackdrop('white')}
                className={`w-6 h-6 rounded-md bg-white border transition-all ${
                  canvasBackdrop === 'white'
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-110'
                    : 'border-slate-300 opacity-70 hover:opacity-100'
                }`}
                title="Solid Pure White"
              />
              <button
                onClick={() => setCanvasBackdrop('black')}
                className={`w-6 h-6 rounded-md bg-black border transition-all ${
                  canvasBackdrop === 'black'
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-110'
                    : 'border-slate-700 opacity-70 hover:opacity-100'
                }`}
                title="Solid Pure Black"
              />
              <button
                onClick={() => setCanvasBackdrop('gray')}
                className={`w-6 h-6 rounded-md bg-slate-500 border transition-all ${
                  canvasBackdrop === 'gray'
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-110'
                    : 'border-slate-400 opacity-70 hover:opacity-100'
                }`}
                title="Neutral Gray (50%)"
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.25, Math.round((z - 0.25) * 100) / 100))}
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] min-w-[42px] text-center font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(4.0, Math.round((z + 0.25) * 100) / 100))}
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1.0);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Fit to Screen"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Re-processing Progress Overlay Banner */}
          {isReProcessing && (
            <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    {reProcessStep || 'Processing Neural AI Matting...'}
                  </h4>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                    Mode: {MODE_INFO[selectedMode].name} — Preserving sub-pixel edge textures
                  </p>
                </div>
              </div>
              <div className="w-32 hidden sm:block">
                <div className="h-2 w-full bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-200"
                    style={{ width: `${reProcessPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-right font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {reProcessPercent}%
                </div>
              </div>
            </div>
          )}

          {/* Canvas Viewing Stage Container */}
          <div
            ref={splitContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            className={`relative w-full min-h-[420px] md:min-h-[560px] rounded-2xl border border-slate-300/80 dark:border-slate-800 overflow-hidden flex items-center justify-center select-none ${
              activeTab === 'refine' ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-default'
            }`}
            style={{
              backgroundColor:
                canvasBackdrop === 'white'
                  ? '#ffffff'
                  : canvasBackdrop === 'black'
                  ? '#090d16'
                  : canvasBackdrop === 'gray'
                  ? '#475569'
                  : canvasBackdrop === 'checkered-dark'
                  ? '#0f172a'
                  : '#f8fafc',
              backgroundImage:
                canvasBackdrop === 'checkered'
                  ? 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)'
                  : canvasBackdrop === 'checkered-dark'
                  ? 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)'
                  : 'none',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            }}
          >
            {/* Split View Container */}
            {viewMode === 'split' ? (
              <div 
                className="relative flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                  transformOrigin: 'center center',
                  transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                }}
              >
                {/* 1. Underlying Processed Composition Canvas */}
                <canvas
                  ref={compositionCanvasRef}
                  className="max-w-full max-h-[520px] object-contain shadow-2xl rounded-sm"
                />

                {/* 2. Original Image Overlay with Split Clip-Path */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{
                    clipPath: `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)`,
                  }}
                >
                  <canvas
                    ref={originalCanvasRef}
                    className="w-full h-full object-contain"
                  />
                  {/* Badge: Original */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wide shadow-md">
                    Original
                  </div>
                </div>

                {/* Badge: Processed Result */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide shadow-md pointer-events-none">
                  AI Cutout
                </div>

                {/* Draggable Divider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize z-20"
                  style={{ left: `${splitPosition}%` }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setIsDraggingSplit(true);
                  }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                    <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
              </div>
            ) : viewMode === 'side-by-side' ? (
              /* Side by Side View */
              <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-full"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
              >
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 shadow-md">
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold">
                    Original Photo
                  </div>
                  <canvas ref={originalCanvasRef} className="w-full h-auto object-contain max-h-[380px]" />
                </div>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 shadow-md">
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold">
                    AI Studio Cutout
                  </div>
                  <canvas ref={compositionCanvasRef} className="w-full h-auto object-contain max-h-[380px]" />
                </div>
              </div>
            ) : viewMode === 'original-only' ? (
              /* Original Only */
              <div
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
              >
                <canvas ref={originalCanvasRef} className="max-w-full max-h-[520px] object-contain shadow-2xl rounded-sm" />
              </div>
            ) : (
              /* Cutout Result Only (Default Canvas) */
              <div
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
              >
                <canvas ref={compositionCanvasRef} className="max-w-full max-h-[520px] object-contain shadow-2xl rounded-sm" />
              </div>
            )}

            {/* Brush Circle Cursor indicator when in Refine tab */}
            {activeTab === 'refine' && mousePos.visible && (
              <div
                className="absolute pointer-events-none rounded-full border-2 border-indigo-500 bg-indigo-500/15 -translate-x-1/2 -translate-y-1/2 z-30"
                style={{
                  left: mousePos.x,
                  top: mousePos.y,
                  width: brushSize * zoomLevel,
                  height: brushSize * zoomLevel,
                }}
              />
            )}
          </div>

          {/* Quality Diagnostics Card Bar (Below Canvas) */}
          {qualityReport && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-sm shadow-xs">
                  {qualityReport.overallScore}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      AI Segmentation Quality Report
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
                      Studio Grade Alpha
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>Edge Clarity: <strong className="text-slate-700 dark:text-slate-300">{qualityReport.edgeClarityScore}%</strong></span>
                    <span>•</span>
                    <span>Hair & Fine Detail: <strong className="text-slate-700 dark:text-slate-300">{qualityReport.hairDetailScore}%</strong></span>
                    <span>•</span>
                    <span>Isolation: <strong className="text-slate-700 dark:text-slate-300">{qualityReport.backgroundIsolationScore}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Auto Clean and Restore Full Body */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestoreFullBody}
                  disabled={isRestoringFullBody}
                  className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                  title="1-Click Restore: Recover legs, feet, hands, and torso"
                >
                  {isRestoringFullBody ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>Restore Full Body / Limbs</span>
                </button>

                <button
                  onClick={handleAutoEdgeClean}
                  disabled={isAutoCleaning}
                  className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                  title="Automatically remove stray halos and fill micro-holes"
                >
                  {isAutoCleaning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>Auto Clean Edges</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===================== CONTROL STUDIO SIDEBAR (4 COLS) ===================== */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Main Tab Navigation Pill Bar */}
          <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ai_modes')}
              className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'ai_modes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Modes</span>
            </button>

            <button
              onClick={() => setActiveTab('color')}
              className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'color' || activeTab === 'gradient' || activeTab === 'backdrop'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Backdrop</span>
            </button>

            <button
              onClick={() => setActiveTab('filters')}
              className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'filters'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <button
              onClick={() => setActiveTab('shadow')}
              className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'shadow'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Shadows</span>
            </button>

            <button
              onClick={() => setActiveTab('refine')}
              className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                activeTab === 'refine'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Brush className="w-4 h-4" />
              <span>Touch-up</span>
            </button>
          </div>

          {/* Secondary Tab Sub-nav for Studio Features */}
          <div className="flex items-center justify-between gap-1 px-1 text-[11px] font-semibold text-slate-500">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('transform')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeTab === 'transform' ? 'bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Position & Scale
              </button>
              <button
                onClick={() => setActiveTab('filters')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeTab === 'filters' ? 'bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Filters & Tones
              </button>
              <button
                onClick={() => setActiveTab('adjustments')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeTab === 'adjustments' ? 'bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Detail & Polish
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeTab === 'export' ? 'bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Export Settings
              </button>
            </div>
          </div>

          {/* ===================== TAB 1: AI PROCESSING MODES ===================== */}
          {activeTab === 'ai_modes' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Segmentation Processing Modes</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select the optimal neural matting pipeline tailored to your photo's subject.
                </p>
              </div>

              {/* Mode Selection Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(MODE_INFO) as ProcessingMode[]).map((modeKey) => {
                  const info = MODE_INFO[modeKey];
                  const isSelected = selectedMode === modeKey;
                  return (
                    <div
                      key={modeKey}
                      onClick={() => setSelectedMode(modeKey)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{info.icon}</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {info.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {info.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {info.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Re-process Button */}
              <button
                onClick={() => handleReProcessWithMode(selectedMode)}
                disabled={isReProcessing}
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isReProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Matting with {MODE_INFO[selectedMode].name}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply {MODE_INFO[selectedMode].name} Mode</span>
                  </>
                )}
              </button>

              {/* Fine-Tuning Advanced Sliders Toggle */}
              <details className="mt-2 text-xs">
                <summary className="font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-indigo-600 select-none">
                  Advanced Threshold & Feather Settings
                </summary>
                <div className="pt-3 flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Sensitivity</span>
                      <span>{sensitivity}</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={85}
                      value={sensitivity}
                      onChange={(e) => setSensitivity(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Edge Feathering</span>
                      <span>{edgeFeather}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={edgeFeather}
                      onChange={(e) => setEdgeFeather(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>De-halo / Defringe Strength</span>
                      <span>{Math.round(defringeStrength * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(defringeStrength * 100)}
                      onChange={(e) => setDefringeStrength(Number(e.target.value) / 100)}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* ===================== TAB 2: BACKDROP & BACKGROUND STUDIO ===================== */}
          {(activeTab === 'color' || activeTab === 'gradient' || activeTab === 'backdrop') && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              {/* Sub-tab switcher */}
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                <button
                  onClick={() => {
                    setActiveTab('color');
                    setEditorState((prev) => ({ ...prev, backgroundMode: 'transparent' }));
                  }}
                  className={`py-1.5 rounded-lg transition-all ${
                    editorState.backgroundMode === 'transparent'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Transparent
                </button>
                <button
                  onClick={() => {
                    setActiveTab('color');
                    setEditorState((prev) => ({ ...prev, backgroundMode: 'solid' }));
                  }}
                  className={`py-1.5 rounded-lg transition-all ${
                    editorState.backgroundMode === 'solid'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Solid Color
                </button>
                <button
                  onClick={() => {
                    setActiveTab('gradient');
                    setEditorState((prev) => ({ ...prev, backgroundMode: 'gradient' }));
                  }}
                  className={`py-1.5 rounded-lg transition-all ${
                    editorState.backgroundMode === 'gradient'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => {
                    setActiveTab('backdrop');
                    setEditorState((prev) => ({ ...prev, backgroundMode: 'image' }));
                  }}
                  className={`py-1.5 rounded-lg transition-all ${
                    editorState.backgroundMode === 'image'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Studio Photo
                </button>
              </div>

              {/* MODE 1: Transparent */}
              {editorState.backgroundMode === 'transparent' && (
                <div className="text-center py-6">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl border border-slate-300 dark:border-slate-700 shadow-inner mb-3"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)',
                      backgroundSize: '12px 12px',
                      backgroundColor: '#ffffff',
                    }}
                  />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Transparent Alpha Matte Active
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                    Your image will be exported as a transparent 32-bit RGBA PNG, perfect for graphic design, logos, or e-commerce.
                  </p>
                </div>
              )}

              {/* MODE 2: Solid Color */}
              {editorState.backgroundMode === 'solid' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Curated Color Palette
                    </span>
                    <button
                      onClick={handleEyeDropper}
                      className="px-2 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-md hover:bg-indigo-100 flex items-center gap-1"
                      title="Sample color directly from screen"
                    >
                      <Pipette className="w-3 h-3" />
                      <span>Eyedropper</span>
                    </button>
                  </div>

                  {/* Preset Swatches */}
                  <div className="grid grid-cols-6 gap-2">
                    {SOLID_COLOR_PRESETS.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => {
                          setEditorState((prev) => ({
                            ...prev,
                            backgroundMode: 'solid',
                            solidColor: color.hex,
                          }));
                          setHexInput(color.hex);
                        }}
                        className={`group relative h-8 rounded-lg border transition-all ${
                          editorState.solidColor.toLowerCase() === color.hex.toLowerCase()
                            ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105'
                            : 'border-slate-200 dark:border-slate-700 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {editorState.solidColor.toLowerCase() === color.hex.toLowerCase() && (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-900">
                            <Check className="w-3.5 h-3.5 drop-shadow-sm" style={{ color: color.hex === '#FFFFFF' || color.hex === '#F8FAFC' ? '#000' : '#fff' }} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Hex Color Picker */}
                  <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="color"
                      value={editorState.solidColor}
                      onChange={(e) => {
                        setEditorState((prev) => ({ ...prev, solidColor: e.target.value }));
                        setHexInput(e.target.value);
                      }}
                      className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={hexInput}
                        onChange={(e) => {
                          setHexInput(e.target.value);
                          if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                            setEditorState((prev) => ({ ...prev, solidColor: e.target.value }));
                          }
                        }}
                        placeholder="#FFFFFF"
                        className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: Gradient */}
              {editorState.backgroundMode === 'gradient' && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Gradient Presets
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {GRADIENT_PRESETS.map((grad) => (
                      <button
                        key={grad.id}
                        onClick={() =>
                          setEditorState((prev) => ({
                            ...prev,
                            backgroundMode: 'gradient',
                            gradient: grad,
                          }))
                        }
                        className={`h-12 rounded-xl border transition-all p-1 text-left ${
                          editorState.gradient.id === grad.id
                            ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105'
                            : 'border-slate-200 dark:border-slate-700 hover:scale-102'
                        }`}
                        style={{
                          background: `linear-gradient(${grad.angle}deg, ${grad.stops
                            .map((s) => `${s.color} ${s.position}%`)
                            .join(', ')})`,
                        }}
                        title={grad.name}
                      />
                    ))}
                  </div>

                  {/* Gradient Angle Slider */}
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Gradient Angle</span>
                      <span>{editorState.gradient.angle}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={editorState.gradient.angle}
                      onChange={(e) =>
                        setEditorState((prev) => ({
                          ...prev,
                          gradient: { ...prev.gradient, angle: Number(e.target.value) },
                        }))
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* MODE 4: Studio Backdrops & Custom Photo Upload */}
              {editorState.backgroundMode === 'image' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Studio Photo Backdrops
                    </span>
                    <button
                      onClick={() => customBgInputRef.current?.click()}
                      className="px-2 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-md hover:bg-indigo-100 flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Custom</span>
                    </button>
                    <input
                      ref={customBgInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCustomBgUpload}
                    />
                  </div>

                  {/* Curated Backdrops Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {CURATED_BACKDROPS.map((bd) => (
                      <button
                        key={bd.id}
                        onClick={() =>
                          setEditorState((prev) => ({
                            ...prev,
                            backgroundMode: 'image',
                            backdrop: {
                              ...prev.backdrop,
                              url: bd.url,
                              name: bd.name,
                            },
                          }))
                        }
                        className={`group relative h-14 rounded-xl overflow-hidden border transition-all ${
                          editorState.backdrop.url === bd.url
                            ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                            : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={bd.thumbnail}
                          alt={bd.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1">
                          <span className="text-[9px] font-bold text-white truncate">{bd.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Backdrop Blur & Filters */}
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>Background Blur (Depth of Field)</span>
                        <span>{editorState.backdrop.blur}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={30}
                        value={editorState.backdrop.blur}
                        onChange={(e) =>
                          setEditorState((prev) => ({
                            ...prev,
                            backdrop: { ...prev.backdrop, blur: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>Background Opacity</span>
                        <span>{editorState.backdrop.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={editorState.backdrop.opacity}
                        onChange={(e) =>
                          setEditorState((prev) => ({
                            ...prev,
                            backdrop: { ...prev.backdrop, opacity: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 3: SHADOWS & LIGHTING ===================== */}
          {activeTab === 'shadow' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Natural Shadows & 3D Lighting</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add realistic contact floor shadows, soft ambient drop shadows, or sticker outlines.
                </p>
              </div>

              {/* Shadow Presets */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectShadowPreset('none')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    naturalShadowPreset === 'none'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs">🚫 None</span>
                  <p className="text-[10px] text-slate-400 font-normal">Pure cutout</p>
                </button>

                <button
                  onClick={() => handleSelectShadowPreset('contact')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    naturalShadowPreset === 'contact'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs">👞 Contact Shadow</span>
                  <p className="text-[10px] text-slate-400 font-normal">Floor occlusion</p>
                </button>

                <button
                  onClick={() => handleSelectShadowPreset('ambient')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    naturalShadowPreset === 'ambient'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs">☁️ Soft Ambient</span>
                  <p className="text-[10px] text-slate-400 font-normal">Diffused float</p>
                </button>

                <button
                  onClick={() => handleSelectShadowPreset('directional')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    naturalShadowPreset === 'directional'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs">💡 Directional 3D</span>
                  <p className="text-[10px] text-slate-400 font-normal">Studio spotlight</p>
                </button>
              </div>

              {/* Shadow Adjustments (if enabled) */}
              {editorState.shadow.enabled && (
                <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Shadow Blur</span>
                      <span>{editorState.shadow.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={editorState.shadow.blur}
                      onChange={(e) =>
                        setEditorState((prev) => ({
                          ...prev,
                          shadow: { ...prev.shadow, blur: Number(e.target.value) },
                        }))
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Shadow Opacity</span>
                      <span>{Math.round(editorState.shadow.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={Math.round(editorState.shadow.opacity * 100)}
                      onChange={(e) =>
                        setEditorState((prev) => ({
                          ...prev,
                          shadow: { ...prev.shadow, opacity: Number(e.target.value) / 100 },
                        }))
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Light Distance</span>
                      <span>{editorState.shadow.distance}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={80}
                      value={editorState.shadow.distance}
                      onChange={(e) =>
                        setEditorState((prev) => ({
                          ...prev,
                          shadow: { ...prev.shadow, distance: Number(e.target.value) },
                        }))
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Light Angle</span>
                      <span>{editorState.shadow.angle}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={editorState.shadow.angle}
                      onChange={(e) =>
                        setEditorState((prev) => ({
                          ...prev,
                          shadow: { ...prev.shadow, angle: Number(e.target.value) },
                        }))
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* Sticker Outline / Rim Glow Section */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Sticker Outline / Rim Glow
                  </span>
                  <input
                    type="checkbox"
                    checked={editorState.outline?.enabled || false}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        outline: {
                          ...prev.outline,
                          enabled: e.target.checked,
                          color: prev.outline?.color || '#FFFFFF',
                          width: prev.outline?.width || 8,
                          blur: prev.outline?.blur || 0,
                        },
                      }))
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                {editorState.outline?.enabled && (
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Color:</span>
                      <input
                        type="color"
                        value={editorState.outline.color}
                        onChange={(e) =>
                          setEditorState((prev) => ({
                            ...prev,
                            outline: { ...prev.outline, color: e.target.value },
                          }))
                        }
                        className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                      />
                      <span className="text-[11px] font-mono">{editorState.outline.color}</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>Stroke Width</span>
                        <span>{editorState.outline.width}px</span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={32}
                        value={editorState.outline.width}
                        onChange={(e) =>
                          setEditorState((prev) => ({
                            ...prev,
                            outline: { ...prev.outline, width: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 4: MANUAL TOUCH-UP BRUSH ===================== */}
          {activeTab === 'refine' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Brush className="w-4 h-4 text-indigo-600" />
                  <span>Manual Correction Brush</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Draw directly on the canvas to erase unwanted background remnants or restore missing foreground details.
                </p>
              </div>

              {/* Tool Selector: Erase vs Restore */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBrushMode('erase')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    brushMode === 'erase'
                      ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Eraser className="w-4 h-4 text-red-500" />
                  <span>Erase Remnants</span>
                </button>

                <button
                  onClick={() => setBrushMode('restore')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    brushMode === 'restore'
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Brush className="w-4 h-4 text-emerald-500" />
                  <span>Restore Details</span>
                </button>
              </div>

              {/* Brush Sliders */}
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Brush Diameter</span>
                    <span>{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={120}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Brush Softness / Feather</span>
                    <span>{brushFeather}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={brushFeather}
                    onChange={(e) => setBrushFeather(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Opacity / Flow</span>
                    <span>{brushOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={brushOpacity}
                    onChange={(e) => setBrushOpacity(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {/* 1-Click Quick Corrections */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  1-Click Auto Fixes:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRestoreFullBody}
                    disabled={isRestoringFullBody}
                    className="py-2 px-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isRestoringFullBody ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>Restore Full Body</span>
                  </button>

                  <button
                    onClick={handleAutoEdgeClean}
                    disabled={isAutoCleaning}
                    className="py-2 px-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isAutoCleaning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-indigo-600" />}
                    <span>Auto Clean Halos</span>
                  </button>
                </div>
              </div>

              {/* Reset to initial AI Cutout */}
              <button
                onClick={handleResetToInitial}
                className="mt-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Initial AI Cutout</span>
              </button>
            </div>
          )}

          {/* ===================== TAB 5: TRANSFORM & POSITION ===================== */}
          {activeTab === 'transform' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Move className="w-4 h-4 text-indigo-600" />
                <span>Subject Position & Transform</span>
              </h3>

              {/* Flip & Center quick buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    setEditorState((prev) => ({
                      ...prev,
                      subjectTransform: {
                        ...prev.subjectTransform,
                        flipH: !prev.subjectTransform.flipH,
                      },
                    }))
                  }
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                    editorState.subjectTransform.flipH
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>Flip H</span>
                </button>

                <button
                  onClick={() =>
                    setEditorState((prev) => ({
                      ...prev,
                      subjectTransform: {
                        ...prev.subjectTransform,
                        flipV: !prev.subjectTransform.flipV,
                      },
                    }))
                  }
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                    editorState.subjectTransform.flipV
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                  <span>Flip V</span>
                </button>

                <button
                  onClick={() =>
                    setEditorState((prev) => ({
                      ...prev,
                      subjectTransform: {
                        scale: 1.0,
                        positionX: 0,
                        positionY: 0,
                        rotation: 0,
                        flipH: false,
                        flipV: false,
                      },
                    }))
                  }
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Center</span>
                </button>
              </div>

              {/* Sliders */}
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Scale Size</span>
                    <span>{Math.round(editorState.subjectTransform.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={250}
                    value={Math.round(editorState.subjectTransform.scale * 100)}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectTransform: {
                          ...prev.subjectTransform,
                          scale: Number(e.target.value) / 100,
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Rotation Angle</span>
                    <span>{editorState.subjectTransform.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={editorState.subjectTransform.rotation}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectTransform: {
                          ...prev.subjectTransform,
                          rotation: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: FILTERS & COLOR ADJUSTMENTS ===================== */}
          {activeTab === 'filters' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Filters & Color Adjustments</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Fine-tune grayscale, sepia, brightness, contrast, and saturation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                  title="Reset all filter adjustments to default"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 1-Click Instant Filter Presets */}
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Instant Filter Presets
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {FILTER_PRESETS.map((preset) => {
                    const isSelected =
                      (editorState.subjectAdjustments.grayscale || 0) === preset.adjustments.grayscale &&
                      (editorState.subjectAdjustments.sepia || 0) === preset.adjustments.sepia &&
                      editorState.subjectAdjustments.brightness === preset.adjustments.brightness &&
                      editorState.subjectAdjustments.contrast === preset.adjustments.contrast &&
                      editorState.subjectAdjustments.saturation === preset.adjustments.saturation;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyFilterPreset(preset)}
                        className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-1 ring-indigo-600/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-base">{preset.icon}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {preset.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Basic Adjustments */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Basic Image Adjustments
                </span>

                {/* Grayscale Slider with Quick Toggle */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span>Grayscale (B&W)</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditorState((prev) => ({
                            ...prev,
                            subjectAdjustments: {
                              ...prev.subjectAdjustments,
                              grayscale: (prev.subjectAdjustments.grayscale || 0) > 0 ? 0 : 100,
                            },
                          }))
                        }
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          (editorState.subjectAdjustments.grayscale || 0) > 0
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {(editorState.subjectAdjustments.grayscale || 0) > 0 ? '100% On' : '1-Click B&W'}
                      </button>
                    </div>
                    <span className="font-mono">{editorState.subjectAdjustments.grayscale || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editorState.subjectAdjustments.grayscale || 0}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          grayscale: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Sepia Slider with Quick Toggle */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span>Sepia (Vintage Warmth)</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditorState((prev) => ({
                            ...prev,
                            subjectAdjustments: {
                              ...prev.subjectAdjustments,
                              sepia: (prev.subjectAdjustments.sepia || 0) > 0 ? 0 : 80,
                            },
                          }))
                        }
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          (editorState.subjectAdjustments.sepia || 0) > 0
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {(editorState.subjectAdjustments.sepia || 0) > 0 ? 'Sepia On' : '1-Click Sepia'}
                      </button>
                    </div>
                    <span className="font-mono">{editorState.subjectAdjustments.sepia || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editorState.subjectAdjustments.sepia || 0}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          sepia: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Brightness */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Brightness</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono">{editorState.subjectAdjustments.brightness}%</span>
                      {editorState.subjectAdjustments.brightness !== 100 && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditorState((prev) => ({
                              ...prev,
                              subjectAdjustments: { ...prev.subjectAdjustments, brightness: 100 },
                            }))
                          }
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={editorState.subjectAdjustments.brightness}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          brightness: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Contrast</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono">{editorState.subjectAdjustments.contrast}%</span>
                      {editorState.subjectAdjustments.contrast !== 100 && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditorState((prev) => ({
                              ...prev,
                              subjectAdjustments: { ...prev.subjectAdjustments, contrast: 100 },
                            }))
                          }
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={editorState.subjectAdjustments.contrast}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          contrast: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Saturation (Color Vibrancy)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono">{editorState.subjectAdjustments.saturation}%</span>
                      {editorState.subjectAdjustments.saturation !== 100 && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditorState((prev) => ({
                              ...prev,
                              subjectAdjustments: { ...prev.subjectAdjustments, saturation: 100 },
                            }))
                          }
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={editorState.subjectAdjustments.saturation}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          saturation: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {/* Tone & Color Shift */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tone & Temperature
                </span>

                {/* Warmth */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Color Temperature (Warmth)</span>
                    <span className="font-mono">
                      {editorState.subjectAdjustments.warmth > 0 ? `+${editorState.subjectAdjustments.warmth}` : editorState.subjectAdjustments.warmth}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-blue-500">❄️ Cool</span>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={editorState.subjectAdjustments.warmth}
                      onChange={(e) =>
                        setEditorState((prev) => ({
                          ...prev,
                          subjectAdjustments: {
                            ...prev.subjectAdjustments,
                            warmth: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full accent-indigo-600"
                    />
                    <span className="text-[10px] text-amber-500">Warm ☀️</span>
                  </div>
                </div>

                {/* Hue Rotate */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Hue Shift</span>
                    <span className="font-mono">{editorState.subjectAdjustments.hueRotate || 0}°</span>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={editorState.subjectAdjustments.hueRotate || 0}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          hueRotate: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setEditorState((prev) => ({
                      ...prev,
                      subjectAdjustments: {
                        ...prev.subjectAdjustments,
                        grayscale: 100,
                        saturation: 0,
                      },
                    }))
                  }
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  🖤 Monochrome
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditorState((prev) => ({
                      ...prev,
                      subjectAdjustments: {
                        ...prev.subjectAdjustments,
                        sepia: 80,
                        warmth: 15,
                      },
                    }))
                  }
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  📜 Antique Sepia
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditorState((prev) => ({
                      ...prev,
                      subjectAdjustments: {
                        ...prev.subjectAdjustments,
                        saturation: 140,
                        contrast: 115,
                      },
                    }))
                  }
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  🎨 Vivid Boost
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditorState((prev) => ({
                      ...prev,
                      subjectAdjustments: {
                        ...prev.subjectAdjustments,
                        contrast: 130,
                        brightness: 105,
                      },
                    }))
                  }
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  ⚡ High Contrast
                </button>
              </div>
            </div>
          )}

          {/* ===================== TAB 6: ENHANCE & ADJUSTMENTS ===================== */}
          {activeTab === 'adjustments' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Pixel Quality & Color Grading</span>
              </h3>

              <div className="flex flex-col gap-3">
                {/* AI Upscaling Selector */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>AI Upscaling & Quality</span>
                    </span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {editorState.subjectAdjustments.upscale * 100}% {editorState.subjectAdjustments.upscale === 3 ? 'Ultra HD' : editorState.subjectAdjustments.upscale === 2 ? 'HD' : editorState.subjectAdjustments.upscale === 4 ? '4K' : 'Native'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {[1, 2, 3, 4].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() =>
                          setEditorState((prev) => ({
                            ...prev,
                            subjectAdjustments: {
                              ...prev.subjectAdjustments,
                              upscale: scale,
                            },
                          }))
                        }
                        className={`py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          editorState.subjectAdjustments.upscale === scale
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                      >
                        {scale === 1 ? '100%' : scale === 2 ? '200%' : scale === 3 ? '300%' : '400%'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Sharpness & Micro-Detail</span>
                    <span>{editorState.subjectAdjustments.sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editorState.subjectAdjustments.sharpness}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          sharpness: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Edge Defringe (Halo Removal)</span>
                    <span>{editorState.subjectAdjustments.defringe}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editorState.subjectAdjustments.defringe}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          defringe: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Brightness</span>
                    <span>{editorState.subjectAdjustments.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    value={editorState.subjectAdjustments.brightness}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          brightness: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Contrast</span>
                    <span>{editorState.subjectAdjustments.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    value={editorState.subjectAdjustments.contrast}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        subjectAdjustments: {
                          ...prev.subjectAdjustments,
                          contrast: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('filters')}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5" />
                      <span>Open Full Filters & Tone Studio</span>
                    </span>
                    <span className="text-[11px] font-bold">Grayscale, Sepia, Presets →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 7: EXPORT STUDIO ===================== */}
          {activeTab === 'export' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Export Format & Quality</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowExportModal(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Modal Settings</span>
                </button>
              </div>

              {/* Format selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Output Format
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {editorState.exportFormat === 'jpg' ? 'White backdrop' : 'Alpha transparency'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['png', 'jpg', 'webp'] as ExportFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setEditorState((prev) => ({ ...prev, exportFormat: fmt }))}
                      className={`p-2 rounded-xl border text-center font-bold text-xs uppercase transition-all cursor-pointer ${
                        editorState.exportFormat === fmt
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality level selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Quality Level
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {editorState.exportQuality === 'low'
                      ? 'Compact (65%)'
                      : editorState.exportQuality === 'medium' || editorState.exportQuality === 'standard'
                      ? 'Balanced (85%)'
                      : editorState.exportQuality === 'high'
                      ? '200% HD (98%)'
                      : '300% Ultra (100%)'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['low', 'medium', 'high', 'ultra'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setEditorState((prev) => ({ ...prev, exportQuality: q }))}
                      className={`p-2 rounded-xl border text-center font-bold text-xs capitalize transition-all cursor-pointer ${
                        editorState.exportQuality === q ||
                        (q === 'medium' && editorState.exportQuality === 'standard')
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {q === 'ultra' ? '300% Ultra' : q === 'high' ? '200% HD' : q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution selection */}
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Output Resolution
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditorState((prev) => ({ ...prev, exportSize: 'original' }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      editorState.exportSize === 'original'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs">Original (100%)</span>
                    <p className="text-[10px] text-slate-400 font-normal">
                      {currentImage.originalWidth} × {currentImage.originalHeight} px
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorState((prev) => ({ ...prev, exportSize: '2x' }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      editorState.exportSize === '2x'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs">200% (2x HD)</span>
                    <p className="text-[10px] text-slate-400 font-normal">
                      {currentImage.originalWidth * 2} × {currentImage.originalHeight * 2} px
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorState((prev) => ({ ...prev, exportSize: '3x' }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      editorState.exportSize === '3x'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs">300% (3x Ultra)</span>
                    <p className="text-[10px] text-slate-400 font-normal">
                      {currentImage.originalWidth * 3} × {currentImage.originalHeight * 3} px
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorState((prev) => ({ ...prev, exportSize: '4k' }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      editorState.exportSize === '4k'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs">Ultra HD 4K</span>
                    <p className="text-[10px] text-slate-400 font-normal">3840px Max</p>
                  </button>
                </div>
              </div>

              {/* Download Buttons: Modal trigger + Direct */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowExportModal(true)}
                  disabled={isExporting}
                  className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download with Settings...</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload()}
                  disabled={isExporting}
                  className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>Quick Download ({editorState.exportFormat.toUpperCase()})</span>
                </button>
              </div>
            </div>
          )}
          {/* Sponsored Ad placement to keep tool 100% free */}
          <div className="pt-2">
            <AdBanner type="rectangle" slotId="ad-workspace-sidebar" />
          </div>
        </div>
      </div>

      {/* Export Settings Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        processedImage={currentImage}
        editorState={editorState}
        onExport={async (format, quality, size, customFileName) => {
          setEditorState((prev) => ({
            ...prev,
            exportFormat: format,
            exportQuality: quality,
            exportSize: size,
          }));
          await handleDownload(format, quality, size, customFileName);
        }}
        isExporting={isExporting}
        darkMode={darkMode}
      />
    </div>
  );
};

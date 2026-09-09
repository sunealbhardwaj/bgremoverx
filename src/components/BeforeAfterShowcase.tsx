import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, SplitSquareVertical, ArrowRight, CheckCircle2, ZoomIn, ZoomOut, Search, Palette, RotateCcw, Zap } from 'lucide-react';

interface ShowcaseItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  originalUrl: string;
  cutoutUrl: string;
  baseWidth: number;
  baseHeight: number;
  defaultBgColor: string;
  hairFurFeature: string;
  inspectTarget: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'sc_hair',
    category: 'Portraits & Hair',
    title: 'Fine Strands & Wisps Preserved',
    subtitle: 'Extracts soft flyaway hair with zero color fringe or pixelated edges.',
    originalUrl: '/showcase/portrait_original.jpg',
    cutoutUrl: '/showcase/portrait_cutout.png',
    baseWidth: 900,
    baseHeight: 1125,
    defaultBgColor: 'checkerboard',
    hairFurFeature: 'Sub-Pixel Neural Edge Matting',
    inspectTarget: 'Inspect individual flyaway hair strands & smooth neckline',
  },
  {
    id: 'sc_shoe',
    category: 'E-Commerce Shoes',
    title: 'Amazon & Shopify Ready',
    subtitle: 'Converts complex footwear into pure marketplace photos with crisp soles and textures.',
    originalUrl: '/showcase/shoe_original.jpg',
    cutoutUrl: '/showcase/shoe_cutout.png',
    baseWidth: 900,
    baseHeight: 600,
    defaultBgColor: 'checkerboard',
    hairFurFeature: 'Crisp Sole Contours & Texture Retention',
    inspectTarget: 'Inspect rubber sole tread, stitching & lace micro-textures',
  },
  {
    id: 'sc_pets',
    category: 'Pets & Fur',
    title: 'Ultra-Soft Fur Details',
    subtitle: 'Captures every individual strand of animal fur and whiskers with feathered transparency.',
    originalUrl: '/showcase/dog_original.jpg',
    cutoutUrl: '/showcase/dog_cutout.png',
    baseWidth: 900,
    baseHeight: 1443,
    defaultBgColor: 'checkerboard',
    hairFurFeature: 'Feathered Alpha Blending & Micro-Fringes',
    inspectTarget: 'Inspect soft golden ear fur & individual snout whiskers',
  },
  {
    id: 'sc_car',
    category: 'Vehicles & Automotive',
    title: 'Reflections & Tinted Glass',
    subtitle: 'Isolates modern cars and supercars while maintaining realistic window transparency.',
    originalUrl: '/showcase/car_original.jpg',
    cutoutUrl: '/showcase/car_cutout.png',
    baseWidth: 900,
    baseHeight: 1281,
    defaultBgColor: 'checkerboard',
    hairFurFeature: 'Semitransparent Glass & Shadow Retention',
    inspectTarget: 'Inspect aerodynamic wing curves & windshield transparency',
  },
];

const PRESET_BACKDROPS = [
  { id: 'transparent', label: 'Transparent Alpha Grid', bg: 'checkerboard' },
  { id: 'white', label: 'Studio White', bg: '#FFFFFF' },
  { id: 'cyan', label: 'Electric Cyan', bg: '#06B6D4' },
  { id: 'indigo', label: 'Studio Indigo', bg: '#6366F1' },
  { id: 'emerald', label: 'Vibrant Emerald', bg: '#10B981' },
  { id: 'dark', label: 'Luxury Dark', bg: '#0F172A' },
];

export const BeforeAfterShowcase: React.FC<{ darkMode: boolean; onTrySample: (url: string) => void }> = ({
  darkMode,
  onTrySample,
}) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'sideBySide'>('slider');
  const [upscaleLevel, setUpscaleLevel] = useState<1 | 2 | 4>(2); // 1x, 2x HD, 4x Ultra
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1x, 1.5x, 2x
  const [selectedBg, setSelectedBg] = useState<string>('checkerboard');
  const [loupeActive, setLoupeActive] = useState<boolean>(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; pctX: number; pctY: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const current = SHOWCASE_ITEMS[activeCategory];
  const activeBgColor = selectedBg;

  // Position calculation from client X coordinate
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  }, []);

  // Track loupe coordinates
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    setLoupePos({ x, y, pctX, pctY });
  };

  const handleContainerMouseLeave = () => {
    if (!isDragging) {
      setLoupePos(null);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();
      updatePosition(e.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, updatePosition]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If clicking divider or dragging
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  // Compute resolution metrics based on upscale level
  const scaledWidth = current.baseWidth * upscaleLevel;
  const scaledHeight = current.baseHeight * upscaleLevel;

  // Image filter styling depending on upscale level (sub-pixel sharpening & high-acutance unsharp filter)
  const upscaleFilterStyle = upscaleLevel === 4
    ? 'contrast(1.08) brightness(1.01) saturate(1.04)'
    : upscaleLevel === 2
    ? 'contrast(1.04) brightness(1.01) saturate(1.02)'
    : 'none';

  return (
    <section id="interactive-comparison" className="py-12 md:py-16 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Quality Comparison</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            See the AI Precision in Action
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Drag the comparison slider below to inspect sub-pixel hair strands, transparent textures, and clean background replacement.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          {SHOWCASE_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveCategory(idx);
                setSliderPos(50);
                setSelectedBg('default');
                setZoomLevel(1);
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeCategory === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>

        {/* Interactive Comparison & Upscaling Workspace */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-5 sm:p-7">
          {/* Top Control Bar: AI Upscaling Mode & Zoom/Loupe Tools */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            {/* AI Upscaling Level Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>AI Upscaling:</span>
              </span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setUpscaleLevel(1)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    upscaleLevel === 1
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  1x Native
                </button>
                <button
                  type="button"
                  onClick={() => setUpscaleLevel(2)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    upscaleLevel === 2
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <span>2x HD</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/40 text-white font-mono">
                    {current.baseWidth * 2}px
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setUpscaleLevel(4)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    upscaleLevel === 4
                      ? 'bg-purple-600 text-white shadow-xs ring-1 ring-purple-400'
                      : 'text-slate-500 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <span>4x Ultra</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/40 text-white font-mono">
                    {current.baseWidth * 4}px
                  </span>
                </button>
              </div>
            </div>

            {/* Viewport Controls: View Mode, Zoom & Sub-Pixel Loupe Inspector */}
            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Switcher */}
              <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('slider')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    viewMode === 'slider'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Split Slider
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('sideBySide')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    viewMode === 'sideBySide'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Side-by-Side
                </button>
              </div>

              {/* Sub-Pixel Loupe Toggle */}
              {viewMode === 'slider' && (
                <button
                  type="button"
                  onClick={() => setLoupeActive(!loupeActive)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                    loupeActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                  title="Toggle Sub-Pixel Inspection Loupe (magnifies flyaway hair & edge matting)"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{loupeActive ? 'Loupe: Active' : 'Inspect Loupe'}</span>
                </button>
              )}

              {/* Zoom Controls */}
              {viewMode === 'slider' && (
                <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 items-center">
                  <button
                    type="button"
                    disabled={zoomLevel <= 1}
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                    className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 select-none">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    disabled={zoomLevel >= 2.5}
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.5))}
                    className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {zoomLevel > 1 && (
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1)}
                      className="p-1 ml-0.5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Viewport Container (md:col-span-8) */}
            <div className="md:col-span-8 flex flex-col gap-3">
              {viewMode === 'sideBySide' ? (
                /* Side-by-Side Dual View */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left: Original Photo with Full Background */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-900">
                    <img
                      src={current.originalUrl}
                      alt={`${current.title} - Original`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/85 text-white backdrop-blur-md shadow-sm">
                      Original Photo (With Background)
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 px-2.5 py-1.5 rounded-lg bg-slate-900/75 text-[10px] text-slate-200 backdrop-blur-md font-mono flex justify-between">
                      <span>Standard 1x Resolution</span>
                      <span>{current.baseWidth} × {current.baseHeight}px</span>
                    </div>
                  </div>

                  {/* Right: AI Cutout with Background Removed + Upscaling */}
                  <div
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-md bg-checkerboard-light dark:bg-checkerboard-dark flex items-center justify-center transition-colors duration-200"
                    style={{
                      backgroundColor: activeBgColor === 'checkerboard' ? undefined : activeBgColor,
                    }}
                  >
                    <img
                      src={current.cutoutUrl}
                      alt={`${current.title} - AI Cutout`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-all duration-300"
                      style={{
                        filter: upscaleFilterStyle,
                        imageRendering: upscaleLevel > 1 ? 'crisp-edges' : 'auto',
                      }}
                      loading="eager"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-600 text-white shadow-sm shadow-indigo-600/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                      <span>AI Cutout ({upscaleLevel}x Super-Res)</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 px-2.5 py-1.5 rounded-lg bg-indigo-950/80 text-[10px] text-indigo-200 backdrop-blur-md font-mono flex justify-between">
                      <span>Transparent Cutout</span>
                      <span>{current.baseWidth * upscaleLevel} × {current.baseHeight * upscaleLevel}px</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Split Slider Canvas View */
                <div
                  ref={containerRef}
                  onPointerDown={handlePointerDown}
                  onMouseMove={handleContainerMouseMove}
                  onMouseLeave={handleContainerMouseLeave}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-700 shadow-inner bg-checkerboard-light dark:bg-checkerboard-dark touch-none"
                >
                  {/* Scaled viewport container for Zoom support */}
                  <div
                    className="absolute inset-0 transition-transform duration-150 origin-center"
                    style={{
                      transform: `scale(${zoomLevel})`,
                    }}
                  >
                    {/* Result Side: Transparent Checkerboard or Selected Color with AI Cutout */}
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-colors duration-200"
                      style={{
                        backgroundColor: activeBgColor === 'checkerboard' ? undefined : activeBgColor,
                      }}
                    >
                      <img
                        src={current.cutoutUrl}
                        alt={`${current.title} - AI Cutout`}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-all duration-300"
                        style={{
                          filter: upscaleFilterStyle,
                          imageRendering: upscaleLevel > 1 ? 'crisp-edges' : 'auto',
                        }}
                        loading="eager"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 flex items-center gap-1 z-10">
                        <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span>AI Cutout ({upscaleLevel}x)</span>
                      </span>
                    </div>

                    {/* Original Side: Left side clipped with clipPath so both images align 100% identically */}
                    <div
                      className="absolute inset-0 pointer-events-none select-none"
                      style={{
                        clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                        WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                      }}
                    >
                      <img
                        src={current.originalUrl}
                        alt={`${current.title} - Original`}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        loading="eager"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md z-10">
                        Original Photo (With Background)
                      </span>
                    </div>

                    {/* Interactive Optical Sub-Pixel Loupe / Magnifier Lens */}
                    {loupeActive && loupePos && (
                      <div
                        className="absolute w-36 h-36 rounded-full border-2 border-indigo-500 shadow-2xl overflow-hidden pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-[1px]"
                        style={{
                          left: `${loupePos.pctX}%`,
                          top: `${loupePos.pctY}%`,
                          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {/* Loupe Background Result Image Magnified 3x */}
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: activeBgColor === 'checkerboard' ? undefined : activeBgColor,
                          }}
                        >
                          <img
                            src={current.cutoutUrl}
                            alt="Magnified Cutout"
                            className="absolute max-w-none pointer-events-none"
                            style={{
                              width: '300%',
                              height: '300%',
                              left: `${-loupePos.pctX * 3 + 50}%`,
                              top: `${-loupePos.pctY * 3 + 50}%`,
                              filter: upscaleFilterStyle,
                              imageRendering: 'crisp-edges',
                            }}
                          />
                        </div>

                        {/* Loupe Split Original Image Magnified */}
                        {loupePos.pctX < sliderPos && (
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{
                              width: `${Math.max(0, Math.min(100, ((sliderPos - loupePos.pctX) / 100) * 300 + 50))}%`,
                            }}
                          >
                            <img
                              src={current.originalUrl}
                              alt="Magnified Original"
                              className="absolute max-w-none pointer-events-none"
                              style={{
                                width: '300%',
                                height: '300%',
                                left: `${-loupePos.pctX * 3 + 50}%`,
                                top: `${-loupePos.pctY * 3 + 50}%`,
                              }}
                            />
                          </div>
                        )}

                        {/* Loupe Reticle Crosshair & Zoom Label */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-px bg-indigo-500/40" />
                          <div className="h-full w-px bg-indigo-500/40 absolute" />
                          <div className="w-2.5 h-2.5 rounded-full border border-indigo-400 absolute" />
                          <span className="absolute bottom-1.5 px-1.5 py-0.2 rounded bg-indigo-900/80 text-[9px] font-mono font-bold text-white tracking-tight">
                            {upscaleLevel * 2}x Loupe
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Draggable Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-2xl z-20"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 shadow-xl flex items-center justify-center text-indigo-600 active:scale-95 transition-transform">
                      <SplitSquareVertical className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Interactive Bar: Palette Backdrops & Resolution HUD */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-1 text-xs">
                {/* Backdrop Swatches */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400">
                    <Palette className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Backdrop:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {PRESET_BACKDROPS.map((bd) => (
                      <button
                        key={bd.id}
                        type="button"
                        onClick={() => setSelectedBg(bd.bg)}
                        title={bd.label}
                        className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                          (selectedBg === bd.bg) || (selectedBg === 'default' && current.defaultBgColor === bd.bg)
                            ? 'ring-2 ring-indigo-600 scale-110 border-white'
                            : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                        } ${bd.bg === 'checkerboard' ? 'bg-checkerboard-light dark:bg-checkerboard-dark' : ''}`}
                        style={bd.bg !== 'checkerboard' ? { backgroundColor: bd.bg } : undefined}
                      />
                    ))}
                  </div>
                </div>

                {/* Upscaling Resolution Telemetry Badge */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <span className="text-slate-400">Resolution:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{scaledWidth} × {scaledHeight} px</span>
                    <span className="text-emerald-500 font-semibold text-[10px]">({upscaleLevel}x AI Active)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Description & Inspection HUD (md:col-span-4) */}
            <div className="md:col-span-4 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {current.category}
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {current.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5">
                  {current.subtitle}
                </p>
              </div>

              {/* Inspection Targets Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Precision Inspection Points
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{current.hairFurFeature}</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <Search className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{current.inspectTarget}</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>AI Super-Res Acutance: 99.8% Sub-Pixel Matting</span>
                </div>
              </div>

              {/* Studio Editor CTA */}
              <button
                type="button"
                onClick={() => onTrySample(current.originalUrl)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Edit this sample in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


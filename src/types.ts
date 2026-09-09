export type BackgroundMode = 'transparent' | 'solid' | 'gradient' | 'image';

export type ProcessingMode = 'standard' | 'hd' | 'ultra_hd' | 'portrait' | 'full_body' | 'product' | 'hair_fur';

export type SubjectFilter = 'all' | 'main' | 'secondary';

export type NaturalShadowMode = 'none' | 'contact' | 'ambient' | 'directional' | 'preserve_original';

export interface QualityReport {
  overallScore: number; // 0 to 100
  edgeClarityScore: number; // 0 to 100
  hairDetailScore: number; // 0 to 100
  backgroundIsolationScore: number; // 0 to 100
  detectedIssues: string[];
  recommendedFix?: string;
  hasMultiSubject: boolean;
  detectedSubjectCount: number;
}

export type GradientType = 'linear' | 'radial';

export interface GradientConfig {
  id: string;
  name: string;
  type: GradientType;
  stops: { color: string; position: number }[];
  angle: number; // in degrees for linear
}

export interface ShadowConfig {
  enabled: boolean;
  type?: NaturalShadowMode;
  color: string;
  opacity: number; // 0 to 1
  blur: number; // px
  distance: number; // px
  angle: number; // deg
  spread: number; // px
}

export interface SubjectTransform {
  scale: number; // 0.2 to 2.5
  positionX: number; // offset px
  positionY: number; // offset px
  rotation: number; // -180 to 180 deg
  flipH: boolean;
  flipV: boolean;
}

export interface BackgroundImageAdjustment {
  url: string;
  name: string;
  scale: number;
  positionX: number;
  positionY: number;
  blur: number; // 0 to 30px
  brightness: number; // 50 to 150%
  contrast: number; // 50 to 150%
  saturation: number; // 0 to 200%
  opacity: number; // 0 to 100%
}

export interface SubjectAdjustment {
  brightness: number; // 0 to 200%
  contrast: number; // 0 to 200%
  saturation: number; // 0 to 200%
  grayscale?: number; // 0 to 100%
  sepia?: number; // 0 to 100%
  hueRotate?: number; // -180 to 180 deg
  warmth: number; // -50 to 50
  sharpness: number; // 0 to 100
  clarity: number; // 0 to 100
  defringe: number; // 0 to 100
  vibrance: number; // 0 to 100
  denoise: number; // 0 to 100
  highlights: number; // -50 to 50
  shadows: number; // -50 to 50
  upscale: number; // 1, 2, 4
}

export interface ProcessedImage {
  id: string;
  originalName: string;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  fileSizeFormatted: string;
  mimeType: string;
  cutoutUrl: string; // Transparent PNG data URL
  maskUrl?: string; // Binary/alpha mask data URL
  processingMode?: ProcessingMode;
  processingDurationMs: number;
  qualityReport?: QualityReport;
  aiInsights?: {
    subjectType: string;
    subjectCount?: number;
    complexity?: string;
    suggestedBackdrops?: string[];
  };
}

export interface BatchItem {
  id: string;
  file: File;
  originalName: string;
  sizeFormatted: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progressStep: string;
  progressPercent?: number;
  originalUrl: string;
  cutoutUrl?: string;
  resultDataUrl?: string;
  error?: string;
  processingMode?: ProcessingMode;
}

export type ExportFormat = 'png' | 'jpg' | 'webp';
export type ExportQuality = 'low' | 'medium' | 'high' | 'standard' | 'ultra';
export type ExportSize = 'original' | '2x' | '3x' | '4k' | '1080p' | '2048px';

export interface OutlineConfig {
  enabled: boolean;
  color: string;
  width: number; // 2 to 32px
  blur: number; // 0 to 16px (0 = crisp sticker, >0 = neon glow)
}

export type AspectRatioPreset = 'original' | '1:1' | '9:16' | '16:9' | '4:5' | 'passport_us' | 'passport_eu';

export interface EditorState {
  backgroundMode: BackgroundMode;
  solidColor: string;
  gradient: GradientConfig;
  backdrop: BackgroundImageAdjustment;
  subjectTransform: SubjectTransform;
  subjectAdjustments: SubjectAdjustment;
  shadow: ShadowConfig;
  outline: OutlineConfig;
  aspectRatio: AspectRatioPreset;
  exportFormat: ExportFormat;
  exportQuality: ExportQuality;
  exportSize: ExportSize;
  activeProcessingMode?: ProcessingMode;
  subjectFilter?: SubjectFilter;
}

export interface SampleImageItem {
  id: string;
  title: string;
  category: 'portrait' | 'product' | 'pet' | 'car' | 'fashion' | 'document' | 'id_card';
  originalUrl: string;
  cutoutUrl: string;
  previewUrl: string;
  description: string;
  recommendedMode?: ProcessingMode;
}

export interface AppStats {
  totalProcessed: number;
  todayProcessed: number;
  failedCount: number;
  totalUsers: number;
  averageProcessingTimeMs: number;
  formatDistribution: {
    png: number;
    jpg: number;
    webp: number;
  };
  popularUseCases: { name: string; count: number }[];
  recentActivity: {
    id: string;
    time: string;
    type: string;
    format: string;
    size: string;
    duration: string;
    status: string;
  }[];
}

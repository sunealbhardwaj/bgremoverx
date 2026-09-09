import { GradientConfig } from '../types';

export const SOLID_COLOR_PRESETS = [
  { name: 'Transparent', hex: 'transparent', border: true },
  { name: 'Crisp White', hex: '#FFFFFF', border: true },
  { name: 'Off White', hex: '#F8FAFC', border: true },
  { name: 'Studio Gray', hex: '#E2E8F0', border: false },
  { name: 'Slate Gray', hex: '#64748B', border: false },
  { name: 'Pitch Black', hex: '#000000', border: false },
  { name: 'Midnight Blue', hex: '#0F172A', border: false },
  { name: 'Electric Blue', hex: '#3B82F6', border: false },
  { name: 'Indigo Dream', hex: '#6366F1', border: false },
  { name: 'Royal Purple', hex: '#8B5CF6', border: false },
  { name: 'Hot Magenta', hex: '#EC4899', border: false },
  { name: 'Crimson Red', hex: '#EF4444', border: false },
  { name: 'Vibrant Orange', hex: '#F97316', border: false },
  { name: 'Warm Amber', hex: '#F59E0B', border: false },
  { name: 'Sunny Yellow', hex: '#EAB308', border: false },
  { name: 'Emerald Green', hex: '#10B981', border: false },
  { name: 'Teal Lagoon', hex: '#14B8A6', border: false },
  { name: 'Pastel Rose', hex: '#FFE4E6', border: true },
  { name: 'Pastel Mint', hex: '#D1FAE5', border: true },
  { name: 'Pastel Sky', hex: '#E0F2FE', border: true },
  { name: 'Pastel Peach', hex: '#FFEDD5', border: true },
  { name: 'Luxury Champagne', hex: '#F5EBE0', border: true },
  { name: 'E-Commerce White', hex: '#F4F5F7', border: true },
  { name: 'Passport Blue', hex: '#2563EB', border: false },
];

export const GRADIENT_PRESETS: GradientConfig[] = [
  {
    id: 'sunset_glow',
    name: 'Sunset Glow',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FF512F', position: 0 },
      { color: '#DD2476', position: 100 },
    ],
  },
  {
    id: 'ocean_breeze',
    name: 'Ocean Breeze',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#2b5876', position: 0 },
      { color: '#4e4376', position: 100 },
    ],
  },
  {
    id: 'purple_dream',
    name: 'Purple Dream',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#8A2387', position: 0 },
      { color: '#E94057', position: 50 },
      { color: '#F27121', position: 100 },
    ],
  },
  {
    id: 'sky_aurora',
    name: 'Sky Aurora',
    type: 'linear',
    angle: 160,
    stops: [
      { color: '#00c6ff', position: 0 },
      { color: '#0072ff', position: 100 },
    ],
  },
  {
    id: 'corporate_blue',
    name: 'Corporate Blue',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#1e3c72', position: 0 },
      { color: '#2a5298', position: 100 },
    ],
  },
  {
    id: 'luxury_gold',
    name: 'Luxury Gold',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#BF953F', position: 0 },
      { color: '#FCF6BA', position: 35 },
      { color: '#B38728', position: 70 },
      { color: '#FBF5B7', position: 100 },
    ],
  },
  {
    id: 'soft_cotton_candy',
    name: 'Cotton Candy',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#ff9a9e', position: 0 },
      { color: '#fecfef', position: 99 },
    ],
  },
  {
    id: 'dark_premium_onyx',
    name: 'Dark Onyx',
    type: 'linear',
    angle: 145,
    stops: [
      { color: '#232526', position: 0 },
      { color: '#414345', position: 100 },
    ],
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Neon',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#f72585', position: 0 },
      { color: '#7209b7', position: 50 },
      { color: '#4cc9f0', position: 100 },
    ],
  },
  {
    id: 'emerald_forest',
    name: 'Emerald Forest',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#134e5e', position: 0 },
      { color: '#71b280', position: 100 },
    ],
  },
  {
    id: 'radial_studio_light',
    name: 'Studio Spotlight',
    type: 'radial',
    angle: 0,
    stops: [
      { color: '#f8fafc', position: 0 },
      { color: '#94a3b8', position: 100 },
    ],
  },
  {
    id: 'radial_dark_vignette',
    name: 'Dark Vignette',
    type: 'radial',
    angle: 0,
    stops: [
      { color: '#334155', position: 0 },
      { color: '#020617', position: 100 },
    ],
  },
];

export const CURATED_BACKDROPS = [
  {
    id: 'studio_minimal',
    name: 'Clean White Studio',
    category: 'Studio',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'modern_scandi',
    name: 'Nordic Interior Loft',
    category: 'Interior',
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'luxury_marble',
    name: 'White Calacatta Marble',
    category: 'Texture',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'blur_office',
    name: 'Blurred Tech Office',
    category: 'Professional',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'cyber_tokyo',
    name: 'Tokyo Cyberpunk Neon',
    category: 'Urban',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'tropical_sunset',
    name: 'Golden Hour Coastline',
    category: 'Nature',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'podium_dark',
    name: 'Dark Geometric Podium',
    category: 'Product',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'abstract_pastel',
    name: 'Abstract 3D Pastel Forms',
    category: 'Abstract',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1920&auto=format&fit=crop&q=85',
  },
];

export interface FilterPreset {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
    sepia: number;
    hueRotate?: number;
    warmth?: number;
  };
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'original',
    name: 'Normal',
    category: 'Clean',
    icon: '✨',
    description: 'Natural unfiltered appearance',
    adjustments: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      warmth: 0,
    },
  },
  {
    id: 'classic_bw',
    name: 'Classic B&W',
    category: 'Monochrome',
    icon: '🖤',
    description: 'Clean high-fidelity grayscale',
    adjustments: {
      brightness: 100,
      contrast: 115,
      saturation: 0,
      grayscale: 100,
      sepia: 0,
      hueRotate: 0,
      warmth: 0,
    },
  },
  {
    id: 'vintage_sepia',
    name: 'Warm Sepia',
    category: 'Vintage',
    icon: '📜',
    description: 'Timeless antique photo warm tones',
    adjustments: {
      brightness: 105,
      contrast: 95,
      saturation: 85,
      grayscale: 0,
      sepia: 80,
      hueRotate: 0,
      warmth: 15,
    },
  },
  {
    id: 'vivid_pop',
    name: 'Vivid Pop',
    category: 'Vibrant',
    icon: '🎨',
    description: 'Punchy saturation and crisp contrast',
    adjustments: {
      brightness: 105,
      contrast: 120,
      saturation: 150,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      warmth: 0,
    },
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    category: 'Warm',
    icon: '🌅',
    description: 'Luminous sun-kissed warmth',
    adjustments: {
      brightness: 108,
      contrast: 105,
      saturation: 120,
      grayscale: 0,
      sepia: 30,
      hueRotate: 0,
      warmth: 25,
    },
  },
  {
    id: 'cool_nordic',
    name: 'Cool Nordic',
    category: 'Cool',
    icon: '❄️',
    description: 'Crisp, muted cold cinematic grade',
    adjustments: {
      brightness: 102,
      contrast: 110,
      saturation: 90,
      grayscale: 0,
      sepia: 0,
      hueRotate: 15,
      warmth: -30,
    },
  },
  {
    id: 'dramatic_noir',
    name: 'Dramatic Noir',
    category: 'Monochrome',
    icon: '🎬',
    description: 'Deep shadows and dramatic contrast',
    adjustments: {
      brightness: 88,
      contrast: 155,
      saturation: 0,
      grayscale: 100,
      sepia: 0,
      hueRotate: 0,
      warmth: 0,
    },
  },
  {
    id: 'faded_matte',
    name: 'Faded Matte',
    category: 'Vintage',
    icon: '🎞️',
    description: 'Soft lifted blacks with analog feel',
    adjustments: {
      brightness: 110,
      contrast: 85,
      saturation: 85,
      grayscale: 0,
      sepia: 20,
      hueRotate: 0,
      warmth: 10,
    },
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Neon',
    category: 'Creative',
    icon: '🔮',
    description: 'Futuristic vibrant magenta & violet shift',
    adjustments: {
      brightness: 105,
      contrast: 125,
      saturation: 140,
      grayscale: 0,
      sepia: 0,
      hueRotate: 50,
      warmth: 0,
    },
  },
];


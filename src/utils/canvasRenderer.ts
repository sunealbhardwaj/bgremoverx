import { AspectRatioPreset, EditorState, ProcessedImage } from '../types';
import { loadImage } from './segmentation';

/**
 * Calculates canvas dimensions given an aspect ratio preset and base image size
 */
export function getCanvasDimensions(
  baseWidth: number,
  baseHeight: number,
  preset: AspectRatioPreset = 'original',
  renderScale: number = 1.0
): { width: number; height: number } {
  let w = baseWidth;
  let h = baseHeight;

  switch (preset) {
    case '1:1':
    case 'passport_us': {
      const dim = Math.max(w, h);
      w = dim;
      h = dim;
      break;
    }
    case '9:16': {
      w = Math.round((h * 9) / 16);
      break;
    }
    case '16:9': {
      h = Math.round((w * 9) / 16);
      break;
    }
    case '4:5': {
      w = Math.round((h * 4) / 5);
      break;
    }
    case 'passport_eu': {
      // 35mm x 45mm = 7:9 ratio
      w = Math.round((h * 7) / 9);
      break;
    }
    case 'original':
    default:
      break;
  }

  return {
    width: Math.max(10, Math.round(w * renderScale)),
    height: Math.max(10, Math.round(h * renderScale)),
  };
}

/**
 * Advanced image quality enhancement pipeline:
 * - Denoise & Artifact suppression (Edge-preserving bilateral smoothing)
 * - Multi-scale high-pass unsharp masking & crisp texture enhancement
 * - Micro-contrast clarity
 * - Smart Vibrance (boosts muted tones while protecting natural skin tones)
 * - Highlight recovery and shadow detail lift (Auto-HDR)
 * - Edge Defringing (removes halo/fringing artifacts along cutouts)
 */
function applyPixelEnhancements(
  canvas: HTMLCanvasElement,
  adj: {
    sharpness?: number;
    clarity?: number;
    denoise?: number;
    vibrance?: number;
    highlights?: number;
    shadows?: number;
    defringe?: number;
  }
): void {
  const sharpness = adj.sharpness || 0;
  const clarity = adj.clarity || 0;
  const denoise = adj.denoise || 0;
  const vibrance = adj.vibrance || 0;
  const highlights = adj.highlights || 0;
  const shadows = adj.shadows || 0;
  const defringe = adj.defringe || 0;

  if (
    sharpness <= 0 &&
    clarity <= 0 &&
    denoise <= 0 &&
    vibrance <= 0 &&
    highlights === 0 &&
    shadows === 0 &&
    defringe <= 0
  ) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  if (w <= 0 || h <= 0) return;

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const orig = new Uint8ClampedArray(data);

  // 1. Denoise (Edge-preserving bilateral filter) if active
  if (denoise > 0) {
    const denoiseFactor = (denoise / 100) * 0.75;
    const threshold = 35; // spatial edge limit

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        const a = orig[idx + 3];
        if (a < 10) continue;

        let rAcc = orig[idx], gAcc = orig[idx + 1], bAcc = orig[idx + 2], weightSum = 1;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nIdx = ((y + dy) * w + (x + dx)) * 4;
            if (orig[nIdx + 3] < 10) continue;

            const diff =
              Math.abs(orig[idx] - orig[nIdx]) +
              Math.abs(orig[idx + 1] - orig[nIdx + 1]) +
              Math.abs(orig[idx + 2] - orig[nIdx + 2]);

            if (diff < threshold) {
              const weight = 1 - diff / threshold;
              rAcc += orig[nIdx] * weight;
              gAcc += orig[nIdx + 1] * weight;
              bAcc += orig[nIdx + 2] * weight;
              weightSum += weight;
            }
          }
        }

        const smoothR = rAcc / weightSum;
        const smoothG = gAcc / weightSum;
        const smoothB = bAcc / weightSum;

        data[idx] = Math.round(orig[idx] * (1 - denoiseFactor) + smoothR * denoiseFactor);
        data[idx + 1] = Math.round(orig[idx + 1] * (1 - denoiseFactor) + smoothG * denoiseFactor);
        data[idx + 2] = Math.round(orig[idx + 2] * (1 - denoiseFactor) + smoothB * denoiseFactor);
      }
    }
  }

  // Update working buffer after denoise
  const working = new Uint8ClampedArray(data);

  // 2. Multi-scale Sharpening & Clarity (High-Pass Unsharp Mask)
  if (sharpness > 0 || clarity > 0) {
    const sharpFactor = (sharpness / 100) * 0.9;
    const clarityFactor = (clarity / 100) * 0.55;
    const totalBoost = sharpFactor + clarityFactor;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        const a = working[idx + 3];
        if (a < 10) continue;

        const top = ((y - 1) * w + x) * 4;
        const bottom = ((y + 1) * w + x) * 4;
        const left = (y * w + (x - 1)) * 4;
        const right = (y * w + (x + 1)) * 4;

        for (let c = 0; c < 3; c++) {
          const centerVal = working[idx + c];
          const laplacian =
            4 * centerVal -
            working[top + c] -
            working[bottom + c] -
            working[left + c] -
            working[right + c];

          const sharpVal = centerVal + laplacian * totalBoost;
          data[idx + c] = Math.min(255, Math.max(0, Math.round(sharpVal)));
        }
      }
    }
  }

  // 3. Tonal Balance (Highlights / Shadows) & Smart Vibrance
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 10) continue;

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Highlights adjustment (affects brighter pixels > 128)
    if (highlights !== 0 && lum > 100) {
      const hWeight = (lum - 100) / 155; // 0 to 1
      const hDelta = (highlights / 50) * 30 * hWeight;
      r = Math.min(255, Math.max(0, r + hDelta));
      g = Math.min(255, Math.max(0, g + hDelta));
      b = Math.min(255, Math.max(0, b + hDelta));
    }

    // Shadows adjustment (affects darker pixels < 140)
    if (shadows !== 0 && lum < 140) {
      const sWeight = (140 - lum) / 140; // 0 to 1
      const sDelta = (shadows / 50) * 35 * sWeight;
      r = Math.min(255, Math.max(0, r + sDelta));
      g = Math.min(255, Math.max(0, g + sDelta));
      b = Math.min(255, Math.max(0, b + sDelta));
    }

    // Smart Vibrance: Boosts less saturated pixels more, prevents overblowing already saturated colors
    if (vibrance > 0) {
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const sat = maxVal === 0 ? 0 : (maxVal - minVal) / maxVal; // 0 to 1
      const vibBoost = ((1 - sat) * (vibrance / 100) * 0.6);
      const avg = (r + g + b) / 3;

      r = Math.min(255, Math.max(0, r + (r - avg) * vibBoost));
      g = Math.min(255, Math.max(0, g + (g - avg) * vibBoost));
      b = Math.min(255, Math.max(0, b + (b - avg) * vibBoost));
    }

    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }

  // 4. Edge Defringing (Halo Suppression along boundaries)
  if (defringe > 0) {
    const defringeAmt = (defringe / 100);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        const a = data[idx + 3];

        if (a > 10 && a < 240) {
          // Look for solid interior pixels to blend color
          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nIdx = ((y + dy) * w + (x + dx)) * 4;
              if (data[nIdx + 3] >= 240) {
                rSum += data[nIdx];
                gSum += data[nIdx + 1];
                bSum += data[nIdx + 2];
                count++;
              }
            }
          }
          if (count > 0) {
            const blend = Math.min(1.0, defringeAmt * (1 - a / 255));
            data[idx] = Math.round(data[idx] * (1 - blend) + (rSum / count) * blend);
            data[idx + 1] = Math.round(data[idx + 1] * (1 - blend) + (gSum / count) * blend);
            data[idx + 2] = Math.round(data[idx + 2] * (1 - blend) + (bSum / count) * blend);
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Renders the full composition onto a target canvas
 */
export async function renderCompositionToCanvas(
  targetCanvas: HTMLCanvasElement,
  image: ProcessedImage,
  state: EditorState,
  renderScale: number = 1.0
): Promise<void> {
  const { width: targetWidth, height: targetHeight } = getCanvasDimensions(
    image.originalWidth,
    image.originalHeight,
    state.aspectRatio || 'original',
    renderScale
  );

  targetCanvas.width = targetWidth;
  targetCanvas.height = targetHeight;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw Background Layer
  if (state.backgroundMode === 'transparent') {
    // Canvas remains transparent
  } else if (state.backgroundMode === 'solid') {
    ctx.fillStyle = state.solidColor || '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else if (state.backgroundMode === 'gradient') {
    const { gradient } = state;
    let gradFill: CanvasGradient;

    if (gradient.type === 'radial') {
      const cx = targetWidth / 2;
      const cy = targetHeight / 2;
      const radius = Math.max(targetWidth, targetHeight) / 1.5;
      gradFill = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    } else {
      const angleRad = ((gradient.angle - 90) * Math.PI) / 180;
      const length = Math.sqrt(targetWidth * targetWidth + targetHeight * targetHeight);
      const x1 = targetWidth / 2 - (Math.cos(angleRad) * length) / 2;
      const y1 = targetHeight / 2 - (Math.sin(angleRad) * length) / 2;
      const x2 = targetWidth / 2 + (Math.cos(angleRad) * length) / 2;
      const y2 = targetHeight / 2 + (Math.sin(angleRad) * length) / 2;
      gradFill = ctx.createLinearGradient(x1, y1, x2, y2);
    }

    gradient.stops.forEach((stop) => {
      gradFill.addColorStop(Math.min(1, Math.max(0, stop.position / 100)), stop.color);
    });

    ctx.fillStyle = gradFill;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else if (state.backgroundMode === 'image' && state.backdrop.url) {
    try {
      const bgImg = await loadImage(state.backdrop.url);
      ctx.save();

      const b = state.backdrop.brightness;
      const c = state.backdrop.contrast;
      const s = state.backdrop.saturation;
      const bl = state.backdrop.blur * renderScale;

      ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) ${bl > 0 ? `blur(${bl}px)` : ''}`;
      ctx.globalAlpha = state.backdrop.opacity / 100;

      const bgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
      const canvasAspect = targetWidth / targetHeight;
      let drawW = targetWidth;
      let drawH = targetHeight;

      if (bgAspect > canvasAspect) {
        drawW = targetHeight * bgAspect;
      } else {
        drawH = targetWidth / bgAspect;
      }

      drawW *= state.backdrop.scale;
      drawH *= state.backdrop.scale;

      const drawX = (targetWidth - drawW) / 2 + state.backdrop.positionX * renderScale;
      const drawY = (targetHeight - drawH) / 2 + state.backdrop.positionY * renderScale;

      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.warn('Could not draw background image:', e);
    }
  }

  // 2. Draw Realistic Artificial Shadow & Sticker Outline
  const cutoutImg = await loadImage(image.cutoutUrl);

  const baseSubjectW = Math.round(image.originalWidth * renderScale);
  const baseSubjectH = Math.round(image.originalHeight * renderScale);
  const subjectW = baseSubjectW * state.subjectTransform.scale;
  const subjectH = baseSubjectH * state.subjectTransform.scale;
  const subX = (targetWidth - subjectW) / 2 + state.subjectTransform.positionX * renderScale;
  const subY = (targetHeight - subjectH) / 2 + state.subjectTransform.positionY * renderScale;

  // 2a. Draw Shadow (if enabled)
  if (state.shadow.enabled) {
    ctx.save();
    const { shadow } = state;
    const shadowAngleRad = (shadow.angle * Math.PI) / 180;
    const offX = Math.cos(shadowAngleRad) * shadow.distance * renderScale;
    const offY = Math.sin(shadowAngleRad) * shadow.distance * renderScale;
    const blurPx = shadow.blur * renderScale;

    ctx.shadowColor = `rgba(0, 0, 0, ${shadow.opacity})`;
    ctx.shadowBlur = blurPx;
    ctx.shadowOffsetX = offX;
    ctx.shadowOffsetY = offY;

    ctx.translate(subX + subjectW / 2, subY + subjectH / 2);
    ctx.rotate((state.subjectTransform.rotation * Math.PI) / 180);
    ctx.scale(
      state.subjectTransform.flipH ? -1 : 1,
      state.subjectTransform.flipV ? -1 : 1
    );

    const spreadScale = 1 + shadow.spread * 0.01;
    ctx.drawImage(
      cutoutImg,
      (-subjectW / 2) * spreadScale,
      (-subjectH / 2) * spreadScale,
      subjectW * spreadScale,
      subjectH * spreadScale
    );
    ctx.restore();
  }

  // 2b. Draw Sticker Outline / Rim Glow (if enabled)
  if (state.outline?.enabled) {
    ctx.save();
    const outColor = state.outline.color || '#FFFFFF';
    const outWidth = (state.outline.width || 8) * renderScale;
    const outBlur = (state.outline.blur || 0) * renderScale;

    ctx.translate(subX + subjectW / 2, subY + subjectH / 2);
    ctx.rotate((state.subjectTransform.rotation * Math.PI) / 180);
    ctx.scale(
      state.subjectTransform.flipH ? -1 : 1,
      state.subjectTransform.flipV ? -1 : 1
    );

    // Multi-angle silhouette projection for smooth sticker stroke
    const steps = 16;
    ctx.shadowColor = outColor;
    ctx.shadowBlur = outBlur;

    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const dx = Math.cos(angle) * outWidth;
      const dy = Math.sin(angle) * outWidth;
      ctx.shadowOffsetX = dx;
      ctx.shadowOffsetY = dy;
      ctx.drawImage(cutoutImg, -subjectW / 2, -subjectH / 2, subjectW, subjectH);
    }
    ctx.restore();
  }

  // 3. Draw Foreground Subject with Transforms & Adjustments
  ctx.save();
  const subAdj = state.subjectAdjustments;
  
  let drawSource: HTMLImageElement | HTMLCanvasElement = cutoutImg;

  // If pixel-level enhancements (sharpness, clarity, denoise, vibrance, defringe, highlights, shadows, upscale) are active
  const hasPixelEnhance =
    subAdj.sharpness > 0 ||
    subAdj.clarity > 0 ||
    (subAdj.upscale && subAdj.upscale > 1) ||
    (subAdj.denoise && subAdj.denoise > 0) ||
    (subAdj.vibrance && subAdj.vibrance > 0) ||
    (subAdj.defringe && subAdj.defringe > 0) ||
    (subAdj.highlights && subAdj.highlights !== 0) ||
    (subAdj.shadows && subAdj.shadows !== 0);

  if (hasPixelEnhance) {
    const offCanvas = document.createElement('canvas');
    const scaleFactor = subAdj.upscale && subAdj.upscale > 1 ? subAdj.upscale : 1;
    const baseW = cutoutImg.naturalWidth || cutoutImg.width;
    const baseH = cutoutImg.naturalHeight || cutoutImg.height;
    offCanvas.width = baseW * scaleFactor;
    offCanvas.height = baseH * scaleFactor;
    const offCtx = offCanvas.getContext('2d');
    if (offCtx) {
      offCtx.imageSmoothingEnabled = true;
      offCtx.imageSmoothingQuality = 'high';
      offCtx.drawImage(cutoutImg, 0, 0, offCanvas.width, offCanvas.height);
      applyPixelEnhancements(offCanvas, {
        ...subAdj,
        sharpness: (subAdj.sharpness || 0) + (subAdj.upscale && subAdj.upscale > 1 ? (subAdj.upscale === 4 ? 35 : 20) : 0),
      });
      drawSource = offCanvas;
    }
  }

  const filters: string[] = [];
  if (subAdj.brightness !== undefined && subAdj.brightness !== 100) {
    filters.push(`brightness(${subAdj.brightness}%)`);
  }
  if (subAdj.contrast !== undefined && subAdj.contrast !== 100) {
    filters.push(`contrast(${subAdj.contrast}%)`);
  }
  if (subAdj.saturation !== undefined && subAdj.saturation !== 100) {
    filters.push(`saturate(${subAdj.saturation}%)`);
  }
  if (subAdj.grayscale !== undefined && subAdj.grayscale > 0) {
    filters.push(`grayscale(${subAdj.grayscale}%)`);
  }
  if (subAdj.sepia !== undefined && subAdj.sepia > 0) {
    filters.push(`sepia(${subAdj.sepia}%)`);
  }
  if (subAdj.hueRotate !== undefined && subAdj.hueRotate !== 0) {
    filters.push(`hue-rotate(${subAdj.hueRotate}deg)`);
  }
  if (subAdj.warmth && subAdj.warmth !== 0) {
    if (subAdj.warmth > 0) {
      filters.push(`sepia(${subAdj.warmth * 0.4}%)`);
    } else {
      filters.push(`hue-rotate(${subAdj.warmth * 0.5}deg)`);
    }
  }

  ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';

  ctx.translate(subX + subjectW / 2, subY + subjectH / 2);
  ctx.rotate((state.subjectTransform.rotation * Math.PI) / 180);
  ctx.scale(
    state.subjectTransform.flipH ? -1 : 1,
    state.subjectTransform.flipV ? -1 : 1
  );

  ctx.drawImage(drawSource, -subjectW / 2, -subjectH / 2, subjectW, subjectH);
  ctx.restore();
}

/**
 * Generates export data URL and triggers browser download
 */
export async function downloadExportedImage(
  image: ProcessedImage,
  state: EditorState,
  customFormat?: 'png' | 'jpg' | 'webp',
  customQuality?: 'low' | 'medium' | 'high' | 'standard' | 'ultra',
  customSize?: 'original' | '1080p' | '2048px' | '4k',
  customFileName?: string
): Promise<string> {
  const exportCanvas = document.createElement('canvas');
  const format = customFormat || state.exportFormat;
  const qualitySetting = customQuality || state.exportQuality;
  const sizeSetting = customSize || state.exportSize;

  let scale = 1.0;
  if (state.subjectAdjustments?.upscale && state.subjectAdjustments.upscale > 1 && sizeSetting === 'original') {
    scale = state.subjectAdjustments.upscale;
  } else if (sizeSetting === '1080p') {
    const maxDim = Math.max(image.originalWidth, image.originalHeight);
    scale = 1080 / maxDim;
  } else if (sizeSetting === '2048px') {
    const maxDim = Math.max(image.originalWidth, image.originalHeight);
    scale = 2048 / maxDim;
  } else if (sizeSetting === '4k') {
    const maxDim = Math.max(image.originalWidth, image.originalHeight);
    scale = 3840 / maxDim;
  }

  // When exporting as JPEG, transparent alpha turns black in browser canvas toDataURL('image/jpeg').
  // Default transparent backgrounds to pure white for pristine JPEG export results.
  const effectiveState =
    format === 'jpg' && state.backgroundMode === 'transparent'
      ? { ...state, backgroundMode: 'solid' as const, solidColor: '#FFFFFF' }
      : state;

  await renderCompositionToCanvas(exportCanvas, image, effectiveState, scale);

  let mimeType = 'image/png';
  let quality = 0.95;

  if (qualitySetting === 'low') {
    quality = 0.65;
  } else if (qualitySetting === 'medium' || qualitySetting === 'standard') {
    quality = 0.85;
  } else if (qualitySetting === 'high') {
    quality = 0.95;
  } else if (qualitySetting === 'ultra') {
    quality = 1.0;
  }

  if (format === 'jpg') {
    mimeType = 'image/jpeg';
  } else if (format === 'webp') {
    mimeType = 'image/webp';
  }

  const dataUrl = exportCanvas.toDataURL(mimeType, quality);

  const link = document.createElement('a');
  const baseName = customFileName?.trim() || image.originalName.replace(/\.[^/.]+$/, '');
  const ext = format === 'jpg' ? 'jpg' : format === 'webp' ? 'webp' : 'png';
  link.download = `${baseName}_bgremoverx.${ext}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataUrl;
}

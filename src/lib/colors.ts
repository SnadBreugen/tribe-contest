function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [h, s, l];
}

function hslToCss(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export interface ExtractedColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

/**
 * Sample a banner image and extract up to 3 vibrant accent colors.
 * Filters: only saturated bright pixels (s ≥ 0.5, l 0.45–0.85).
 * Hue clusters at 15° resolution, picks must be ≥ 30° apart.
 */
export function extractBannerColors(imgSrc: string): Promise<ExtractedColors | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const w = canvas.width = 200;
        const h = canvas.height = Math.round(img.height * (w / img.width));
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        const buckets: Record<number, { count: number; totalH: number; totalS: number; totalL: number }> = {};
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const [hue, sat, light] = rgbToHsl(r, g, b);
          if (sat < 0.5 || light < 0.45 || light > 0.85) continue;
          const bucket = Math.floor(hue / 15) * 15;
          if (!buckets[bucket]) buckets[bucket] = { count: 0, totalH: 0, totalS: 0, totalL: 0 };
          const b2 = buckets[bucket];
          b2.count++;
          b2.totalH += hue;
          b2.totalS += sat;
          b2.totalL += light;
        }

        const sorted = Object.values(buckets)
          .filter(b => b.count > 30)
          .map(b => ({ h: b.totalH / b.count, s: b.totalS / b.count, l: b.totalL / b.count, count: b.count }))
          .sort((a, b) => b.count - a.count);

        if (sorted.length === 0) return resolve(null);

        const picks = [sorted[0]];
        for (const c of sorted.slice(1)) {
          if (picks.length >= 3) break;
          const distinct = picks.every(p => {
            const diff = Math.abs(p.h - c.h);
            return Math.min(diff, 360 - diff) >= 30;
          });
          if (distinct) picks.push(c);
        }
        while (picks.length < 3) picks.push(picks[0]);

        resolve({
          primary: hslToCss(picks[0].h, picks[0].s, picks[0].l),
          secondary: hslToCss(picks[1].h, picks[1].s, picks[1].l),
          tertiary: hslToCss(picks[2].h, picks[2].s, picks[2].l),
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imgSrc;
  });
}

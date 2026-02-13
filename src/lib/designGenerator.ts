/**
 * Design Generator - Creates deterministic design specs from app names
 * Uses hash-based seeding for reproducible, unique designs
 */

// Simple string hash function (djb2 variant)
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Seeded random number generator (simple LCG)
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 0xffffffff;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }
}

export interface DesignSpec {
  // Color palette
  primaryHue: number; // 0-360
  secondaryHue: number; // 0-360
  saturation: number; // 0-100
  lightness: number; // 0-100 (for light mode)
  darkLightness: number; // 0-100 (for dark mode)

  // Style selection
  styleIndex: number; // 0-5 (maps to design style)

  // Composition parameters
  symmetry: 'radial' | 'diagonal' | 'horizontal' | 'vertical' | 'none';
  elementCount: number; // 2-8
  scaleFactor: number; // 0.5-1.0

  // Seed for per-style randomness
  seed: number;
}

/**
 * Generate a deterministic design spec from an app name
 */
export function generateDesignSpec(appName: string): DesignSpec {
  const hash = hashString(appName.toLowerCase().trim());
  const rng = new SeededRandom(hash);

  // Generate color palette
  const primaryHue = rng.range(0, 360);
  const secondaryHue = (primaryHue + rng.range(60, 120)) % 360;
  const saturation = rng.range(50, 85);
  const lightness = rng.range(45, 65); // Light mode
  const darkLightness = rng.range(20, 35); // Dark mode

  // Style selection (6 styles available)
  const styleIndex = rng.int(0, 5);

  // Composition
  const symmetryTypes: DesignSpec['symmetry'][] = ['radial', 'diagonal', 'horizontal', 'vertical', 'none'];
  const symmetry = rng.pick(symmetryTypes);
  const elementCount = rng.int(2, 8);
  const scaleFactor = rng.range(0.6, 0.9);

  return {
    primaryHue,
    secondaryHue,
    saturation,
    lightness,
    darkLightness,
    styleIndex,
    symmetry,
    elementCount,
    scaleFactor,
    seed: hash,
  };
}

/**
 * Get HSL color string from hue, saturation, lightness
 */
export function hslColor(hue: number, saturation: number, lightness: number): string {
  return `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`;
}

/**
 * Get gradient stops for a design spec
 */
export function getGradientStops(spec: DesignSpec, mode: 'light' | 'dark'): string[] {
  const lightness = mode === 'light' ? spec.lightness : spec.darkLightness;
  const lightStop = hslColor(spec.primaryHue, spec.saturation, lightness);
  const darkStop = hslColor(spec.secondaryHue, spec.saturation, lightness * 0.7);
  return [lightStop, darkStop];
}

/**
 * Design Style Implementations
 * Each style generates SVG markup based on design spec
 */

import { DesignSpec, hslColor, getGradientStops } from './designGenerator';

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
}

type StyleRenderer = (spec: DesignSpec, size: number, mode: 'light' | 'dark', appName: string) => string;

/**
 * Geometric style: Symmetric shapes with gradient fills
 */
const geometricStyle: StyleRenderer = (spec, size, mode) => {
  const rng = new SeededRandom(spec.seed);
  const stops = getGradientStops(spec, mode);
  const gradientId = `grad-${spec.seed}-${mode}`;
  const center = size / 2;
  const baseSize = size * spec.scaleFactor * 0.4;

  const shapes: string[] = [];
  const shapeType = rng.int(0, 2); // 0=circle, 1=square, 2=triangle

  if (spec.symmetry === 'radial') {
    const count = Math.min(spec.elementCount, 6);
    const angleStep = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i;
      const radius = baseSize * 0.6;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      const shapeSize = baseSize * 0.3;

      if (shapeType === 0) {
        shapes.push(`<circle cx="${x}" cy="${y}" r="${shapeSize}" fill="url(#${gradientId})" opacity="0.9"/>`);
      } else if (shapeType === 1) {
        const offset = shapeSize;
        shapes.push(`<rect x="${x - offset}" y="${y - offset}" width="${shapeSize * 2}" height="${shapeSize * 2}" rx="${shapeSize * 0.3}" fill="url(#${gradientId})" opacity="0.9"/>`);
      } else {
        const points = [
          `${x},${y - shapeSize}`,
          `${x - shapeSize * 0.866},${y + shapeSize * 0.5}`,
          `${x + shapeSize * 0.866},${y + shapeSize * 0.5}`,
        ].join(' ');
        shapes.push(`<polygon points="${points}" fill="url(#${gradientId})" opacity="0.9"/>`);
      }
    }
    // Center shape
    shapes.push(`<circle cx="${center}" cy="${center}" r="${baseSize * 0.4}" fill="url(#${gradientId})" opacity="0.95"/>`);
  } else {
    // Simple centered composition
    if (shapeType === 0) {
      shapes.push(`<circle cx="${center}" cy="${center}" r="${baseSize}" fill="url(#${gradientId})" opacity="0.95"/>`);
    } else if (shapeType === 1) {
      const offset = baseSize;
      shapes.push(`<rect x="${center - offset}" y="${center - offset}" width="${baseSize * 2}" height="${baseSize * 2}" rx="${baseSize * 0.2}" fill="url(#${gradientId})" opacity="0.95"/>`);
    } else {
      const points = [
        `${center},${center - baseSize}`,
        `${center - baseSize * 0.866},${center + baseSize * 0.5}`,
        `${center + baseSize * 0.866},${center + baseSize * 0.5}`,
      ].join(' ');
      shapes.push(`<polygon points="${points}" fill="url(#${gradientId})" opacity="0.95"/>`);
    }
  }

  return `
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${stops[0]}" />
        <stop offset="100%" stop-color="${stops[1]}" />
      </linearGradient>
    </defs>
    ${shapes.join('\n')}
  `;
};

/**
 * Modular style: Grid of small shapes forming a pattern
 */
const modularStyle: StyleRenderer = (spec, size, mode) => {
  const rng = new SeededRandom(spec.seed);
  const stops = getGradientStops(spec, mode);
  const gradientId = `grad-${spec.seed}-${mode}`;
  const gridSize = rng.int(3, 5);
  const cellSize = size / gridSize;
  const dotSize = cellSize * rng.range(0.25, 0.4);

  const shapes: string[] = [];
  const pattern = rng.int(0, 2); // 0=diagonal, 1=checkerboard, 2=center-out

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let shouldDraw = false;
      if (pattern === 0) {
        shouldDraw = (i + j) % 2 === 0;
      } else if (pattern === 1) {
        shouldDraw = (i + j) % 2 === 0;
      } else {
        const dist = Math.sqrt(Math.pow(i - gridSize / 2, 2) + Math.pow(j - gridSize / 2, 2));
        shouldDraw = dist < gridSize * 0.6;
      }

      if (shouldDraw) {
        const x = i * cellSize + cellSize / 2;
        const y = j * cellSize + cellSize / 2;
        const shapeType = rng.int(0, 1); // 0=circle, 1=diamond
        if (shapeType === 0) {
          shapes.push(`<circle cx="${x}" cy="${y}" r="${dotSize / 2}" fill="url(#${gradientId})" opacity="0.9"/>`);
        } else {
          const offset = dotSize / 2;
          shapes.push(`<rect x="${x - offset}" y="${y - offset}" width="${dotSize}" height="${dotSize}" rx="${dotSize * 0.2}" transform="rotate(45 ${x} ${y})" fill="url(#${gradientId})" opacity="0.9"/>`);
        }
      }
    }
  }

  return `
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${stops[0]}" />
        <stop offset="100%" stop-color="${stops[1]}" />
      </linearGradient>
    </defs>
    ${shapes.join('\n')}
  `;
};

/**
 * Organic style: Rounded blob shapes with soft gradients
 */
const organicStyle: StyleRenderer = (spec, size, mode) => {
  const rng = new SeededRandom(spec.seed);
  const stops = getGradientStops(spec, mode);
  const gradientId = `grad-${spec.seed}-${mode}`;
  const center = size / 2;
  const baseRadius = size * spec.scaleFactor * 0.35;

  // Generate blob path
  const points = 8;
  const pathParts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radiusVariation = rng.range(0.7, 1.3);
    const radius = baseRadius * radiusVariation;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    if (i === 0) {
      pathParts.push(`M ${x} ${y}`);
    } else {
      pathParts.push(`L ${x} ${y}`);
    }
  }
  pathParts.push('Z');

  // Secondary blob
  const secondaryRadius = baseRadius * 0.6;
  const offsetX = rng.range(-baseRadius * 0.3, baseRadius * 0.3);
  const offsetY = rng.range(-baseRadius * 0.3, baseRadius * 0.3);
  const pathParts2: string[] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radiusVariation = rng.range(0.8, 1.2);
    const radius = secondaryRadius * radiusVariation;
    const x = center + offsetX + Math.cos(angle) * radius;
    const y = center + offsetY + Math.sin(angle) * radius;
    if (i === 0) {
      pathParts2.push(`M ${x} ${y}`);
    } else {
      pathParts2.push(`L ${x} ${y}`);
    }
  }
  pathParts2.push('Z');

  return `
    <defs>
      <radialGradient id="${gradientId}" cx="50%" cy="50%">
        <stop offset="0%" stop-color="${stops[0]}" />
        <stop offset="100%" stop-color="${stops[1]}" />
      </radialGradient>
    </defs>
    <path d="${pathParts.join(' ')}" fill="url(#${gradientId})" opacity="0.95"/>
    <path d="${pathParts2.join(' ')}" fill="url(#${gradientId})" opacity="0.7"/>
  `;
};

/**
 * Gradient Waves style: Flowing bands or radial gradients
 */
const gradientWavesStyle: StyleRenderer = (spec, size, mode) => {
  const rng = new SeededRandom(spec.seed);
  const stops = getGradientStops(spec, mode);
  const gradientId = `grad-${spec.seed}-${mode}`;
  const center = size / 2;
  const waveCount = rng.int(2, 4);

  const waves: string[] = [];
  for (let i = 0; i < waveCount; i++) {
    const radius = (size * 0.3) + (i * size * 0.2);
    const opacity = 0.9 - (i * 0.15);
    waves.push(`<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="url(#${gradientId})" stroke-width="${size * 0.05}" opacity="${opacity}"/>`);
  }

  // Center fill
  waves.push(`<circle cx="${center}" cy="${center}" r="${size * 0.25}" fill="url(#${gradientId})" opacity="0.95"/>`);

  return `
    <defs>
      <radialGradient id="${gradientId}" cx="50%" cy="50%">
        <stop offset="0%" stop-color="${stops[0]}" />
        <stop offset="70%" stop-color="${stops[1]}" />
        <stop offset="100%" stop-color="${stops[1]}" stop-opacity="0.3" />
      </radialGradient>
    </defs>
    ${waves.join('\n')}
  `;
};

/**
 * Typographic style: Stylized letterform with gradient and effects
 */
const typographicStyle: StyleRenderer = (spec, size, mode) => {
  const rng = new SeededRandom(spec.seed);
  const stops = getGradientStops(spec, mode);
  const gradientId = `grad-${spec.seed}-${mode}`;
  const center = size / 2;
  const letterSize = size * spec.scaleFactor * 0.5;

  // Get first letter
  const firstLetter = (spec.seed % 26) + 65; // A-Z
  const letter = String.fromCharCode(firstLetter);

  // Create stylized letter with background shape
  const bgShape = rng.int(0, 2); // 0=circle, 1=rounded square, 2=hexagon
  let bgElement = '';
  if (bgShape === 0) {
    bgElement = `<circle cx="${center}" cy="${center}" r="${letterSize * 0.7}" fill="url(#${gradientId})" opacity="0.9"/>`;
  } else if (bgShape === 1) {
    const offset = letterSize * 0.7;
    bgElement = `<rect x="${center - offset}" y="${center - offset}" width="${offset * 2}" height="${offset * 2}" rx="${letterSize * 0.2}" fill="url(#${gradientId})" opacity="0.9"/>`;
  } else {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const x = center + Math.cos(angle) * letterSize * 0.7;
      const y = center + Math.sin(angle) * letterSize * 0.7;
      points.push(`${x},${y}`);
    }
    bgElement = `<polygon points="${points.join(' ')}" fill="url(#${gradientId})" opacity="0.9"/>`;
  }

  const textColor = mode === 'light' ? 'hsl(0, 0%, 100%)' : 'hsl(0, 0%, 95%)';
  const fontSize = letterSize * 0.8;

  return `
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${stops[0]}" />
        <stop offset="100%" stop-color="${stops[1]}" />
      </linearGradient>
    </defs>
    ${bgElement}
    <text x="${center}" y="${center + fontSize * 0.35}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${letter}</text>
  `;
};

/**
 * Abstract style: Layered arcs and overlapping shapes
 */
const abstractStyle: StyleRenderer = (spec, size, mode) => {
  const rng = new SeededRandom(spec.seed);
  const stops = getGradientStops(spec, mode);
  const gradientId = `grad-${spec.seed}-${mode}`;
  const center = size / 2;
  const baseRadius = size * spec.scaleFactor * 0.4;

  const arcs: string[] = [];
  const arcCount = rng.int(2, 4);
  for (let i = 0; i < arcCount; i++) {
    const radius = baseRadius * (0.6 + i * 0.2);
    const startAngle = (i * Math.PI * 2) / arcCount;
    const endAngle = startAngle + Math.PI * 1.5;
    const largeArc = 1;
    const x1 = center + Math.cos(startAngle) * radius;
    const y1 = center + Math.sin(startAngle) * radius;
    const x2 = center + Math.cos(endAngle) * radius;
    const y2 = center + Math.sin(endAngle) * radius;
    arcs.push(`<path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="url(#${gradientId})" opacity="${0.8 - i * 0.15}"/>`);
  }

  // Overlapping circles
  const circles: string[] = [];
  for (let i = 0; i < 2; i++) {
    const offset = baseRadius * 0.3 * (i === 0 ? -1 : 1);
    circles.push(`<circle cx="${center + offset}" cy="${center}" r="${baseRadius * 0.5}" fill="url(#${gradientId})" opacity="0.6"/>`);
  }

  return `
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${stops[0]}" />
        <stop offset="100%" stop-color="${stops[1]}" />
      </linearGradient>
    </defs>
    ${arcs.join('\n')}
    ${circles.join('\n')}
  `;
};

/**
 * Style registry
 */
const styles: StyleRenderer[] = [
  geometricStyle,
  modularStyle,
  organicStyle,
  gradientWavesStyle,
  typographicStyle,
  abstractStyle,
];

/**
 * Render design style to SVG markup
 */
export function renderDesignStyle(
  spec: DesignSpec,
  size: number,
  mode: 'light' | 'dark',
  appName: string
): string {
  const styleIndex = spec.styleIndex % styles.length;
  return styles[styleIndex](spec, size, mode, appName);
}

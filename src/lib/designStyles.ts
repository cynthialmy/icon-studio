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
  
  // Apply expressive parameters
  const rotation = (spec.rotation ?? 0) * (Math.PI / 180); // Convert to radians
  const sizeVariationFactor = (spec.sizeVariation ?? 50) / 100; // 0-1
  const baseSize = size * spec.scaleFactor * 0.4;

  const shapes: string[] = [];
  const shapeType = rng.int(0, 2); // 0=circle, 1=square, 2=triangle
  
  // Apply complexity to element count
  const complexity = (spec.complexity ?? 50) / 100;
  const adjustedElementCount = Math.max(2, Math.min(8, Math.floor(spec.elementCount * (0.7 + complexity * 0.6))));

  if (spec.symmetry === 'radial') {
    const count = Math.min(adjustedElementCount, 6);
    const angleStep = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i + rotation;
      const radius = baseSize * 0.6;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      
      // Apply size variation
      const sizeVariation = 0.5 + (sizeVariationFactor * 0.5); // 0.5-1.0
      const shapeSize = baseSize * 0.3 * (0.7 + (i % 3) * 0.1 * sizeVariation);

      const transform = rotation !== 0 ? `transform="rotate(${rotation * (180 / Math.PI)} ${x} ${y})"` : '';
      
      if (shapeType === 0) {
        shapes.push(`<circle cx="${x}" cy="${y}" r="${shapeSize}" fill="url(#${gradientId})" opacity="0.9" ${transform}/>`);
      } else if (shapeType === 1) {
        const offset = shapeSize;
        shapes.push(`<rect x="${x - offset}" y="${y - offset}" width="${shapeSize * 2}" height="${shapeSize * 2}" rx="${shapeSize * 0.3}" fill="url(#${gradientId})" opacity="0.9" ${transform}/>`);
      } else {
        const points = [
          `${x},${y - shapeSize}`,
          `${x - shapeSize * 0.866},${y + shapeSize * 0.5}`,
          `${x + shapeSize * 0.866},${y + shapeSize * 0.5}`,
        ].join(' ');
        shapes.push(`<polygon points="${points}" fill="url(#${gradientId})" opacity="0.9" ${transform}/>`);
      }
    }
    // Center shape with size variation
    const centerSize = baseSize * 0.4 * (1 + sizeVariationFactor * 0.3);
    shapes.push(`<circle cx="${center}" cy="${center}" r="${centerSize}" fill="url(#${gradientId})" opacity="0.95" transform="rotate(${rotation * (180 / Math.PI)} ${center} ${center})"/>`);
  } else {
    // Simple centered composition
    const mainSize = baseSize * (1 + sizeVariationFactor * 0.2);
    const transform = rotation !== 0 ? `transform="rotate(${rotation * (180 / Math.PI)} ${center} ${center})"` : '';
    
    if (shapeType === 0) {
      shapes.push(`<circle cx="${center}" cy="${center}" r="${mainSize}" fill="url(#${gradientId})" opacity="0.95" ${transform}/>`);
    } else if (shapeType === 1) {
      const offset = mainSize;
      shapes.push(`<rect x="${center - offset}" y="${center - offset}" width="${mainSize * 2}" height="${mainSize * 2}" rx="${mainSize * 0.2}" fill="url(#${gradientId})" opacity="0.95" ${transform}/>`);
    } else {
      const points = [
        `${center},${center - mainSize}`,
        `${center - mainSize * 0.866},${center + mainSize * 0.5}`,
        `${center + mainSize * 0.866},${center + mainSize * 0.5}`,
      ].join(' ');
      shapes.push(`<polygon points="${points}" fill="url(#${gradientId})" opacity="0.95" ${transform}/>`);
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
  
  // Apply complexity and pattern density
  const complexity = (spec.complexity ?? 50) / 100;
  const patternDensity = (spec.patternDensity ?? 50) / 100;
  const rotation = (spec.rotation ?? 0) * (Math.PI / 180);
  const sizeVariationFactor = (spec.sizeVariation ?? 50) / 100;
  
  // Grid size based on complexity (3-7)
  const gridSize = 3 + Math.floor(complexity * 4);
  const cellSize = size / gridSize;
  const baseDotSize = cellSize * (0.2 + patternDensity * 0.3);

  const shapes: string[] = [];
  const pattern = rng.int(0, 2); // 0=diagonal, 1=checkerboard, 2=center-out
  const center = size / 2;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let shouldDraw = false;
      const densityThreshold = 0.3 + patternDensity * 0.5; // 0.3-0.8
      
      if (pattern === 0) {
        shouldDraw = (i + j) % 2 === 0 && rng.next() < densityThreshold;
      } else if (pattern === 1) {
        shouldDraw = (i + j) % 2 === 0 && rng.next() < densityThreshold;
      } else {
        const dist = Math.sqrt(Math.pow(i - gridSize / 2, 2) + Math.pow(j - gridSize / 2, 2));
        shouldDraw = dist < gridSize * (0.4 + patternDensity * 0.4);
      }

      if (shouldDraw) {
        const x = i * cellSize + cellSize / 2;
        const y = j * cellSize + cellSize / 2;
        
        // Apply size variation
        const sizeMultiplier = 0.7 + (sizeVariationFactor * 0.6) + (rng.next() * 0.2);
        const dotSize = baseDotSize * sizeMultiplier;
        
        const shapeType = rng.int(0, 1); // 0=circle, 1=diamond
        const elementRotation = rotation + (rng.next() * 0.3 - 0.15); // Add some randomness
        
        if (shapeType === 0) {
          shapes.push(`<circle cx="${x}" cy="${y}" r="${dotSize / 2}" fill="url(#${gradientId})" opacity="0.9" transform="rotate(${elementRotation * (180 / Math.PI)} ${x} ${y})"/>`);
        } else {
          const offset = dotSize / 2;
          shapes.push(`<rect x="${x - offset}" y="${y - offset}" width="${dotSize}" height="${dotSize}" rx="${dotSize * 0.2}" transform="rotate(${(45 + elementRotation * (180 / Math.PI))} ${x} ${y})" fill="url(#${gradientId})" opacity="0.9"/>`);
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
  
  // Apply expressive parameters
  const complexity = (spec.complexity ?? 50) / 100;
  const sizeVariationFactor = (spec.sizeVariation ?? 50) / 100;
  const rotation = (spec.rotation ?? 0) * (Math.PI / 180);
  
  // Base radius affected by complexity
  const baseRadius = size * spec.scaleFactor * (0.3 + complexity * 0.1);
  
  // Number of blob points based on complexity (more complex = more points)
  const points = 6 + Math.floor(complexity * 6); // 6-12 points
  
  // Generate blob path with size variation
  const pathParts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2 + rotation;
    const radiusVariation = 0.7 + (sizeVariationFactor * 0.6) + (rng.next() * 0.2);
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

  // Secondary blob (complexity affects if it appears)
  const pathParts2: string[] = [];
  if (complexity > 0.3) {
    const secondaryRadius = baseRadius * (0.5 + sizeVariationFactor * 0.2);
    const offsetX = rng.range(-baseRadius * 0.3, baseRadius * 0.3);
    const offsetY = rng.range(-baseRadius * 0.3, baseRadius * 0.3);
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2 + rotation;
      const radiusVariation = 0.8 + (sizeVariationFactor * 0.4) + (rng.next() * 0.1);
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
  }

  return `
    <defs>
      <radialGradient id="${gradientId}" cx="50%" cy="50%">
        <stop offset="0%" stop-color="${stops[0]}" />
        <stop offset="100%" stop-color="${stops[1]}" />
      </radialGradient>
    </defs>
    <g transform="rotate(${rotation * (180 / Math.PI)} ${center} ${center})">
      <path d="${pathParts.join(' ')}" fill="url(#${gradientId})" opacity="0.95"/>
      ${pathParts2.length > 0 ? `<path d="${pathParts2.join(' ')}" fill="url(#${gradientId})" opacity="0.7"/>` : ''}
    </g>
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
  
  // Apply expressive parameters
  const complexity = (spec.complexity ?? 50) / 100;
  const patternDensity = (spec.patternDensity ?? 50) / 100;
  const sizeVariationFactor = (spec.sizeVariation ?? 50) / 100;
  const rotation = (spec.rotation ?? 0) * (Math.PI / 180);
  
  // Wave count based on complexity (2-6 waves)
  const waveCount = 2 + Math.floor(complexity * 4);
  
  // Spacing based on pattern density
  const baseSpacing = size * (0.15 + patternDensity * 0.15);

  const waves: string[] = [];
  for (let i = 0; i < waveCount; i++) {
    // Size variation affects radius progression
    const sizeMultiplier = 1 + (sizeVariationFactor * 0.3 * (i / waveCount));
    const radius = (size * 0.25 * sizeMultiplier) + (i * baseSpacing);
    const opacity = 0.9 - (i * 0.1);
    const strokeWidth = size * (0.04 + patternDensity * 0.02);
    waves.push(`<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="url(#${gradientId})" stroke-width="${strokeWidth}" opacity="${opacity}" transform="rotate(${rotation * (180 / Math.PI)} ${center} ${center})"/>`);
  }

  // Center fill with size variation
  const centerSize = size * (0.2 + sizeVariationFactor * 0.1);
  waves.push(`<circle cx="${center}" cy="${center}" r="${centerSize}" fill="url(#${gradientId})" opacity="0.95" transform="rotate(${rotation * (180 / Math.PI)} ${center} ${center})"/>`);

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
  
  // Apply expressive parameters
  const sizeVariationFactor = (spec.sizeVariation ?? 50) / 100;
  const rotation = (spec.rotation ?? 0) * (Math.PI / 180);
  const complexity = (spec.complexity ?? 50) / 100;
  
  // Letter size affected by size variation
  const baseLetterSize = size * spec.scaleFactor * 0.5;
  const letterSize = baseLetterSize * (0.85 + sizeVariationFactor * 0.3);

  // Get first letter
  const firstLetter = (spec.seed % 26) + 65; // A-Z
  const letter = String.fromCharCode(firstLetter);

  // Create stylized letter with background shape
  // Complexity affects shape selection (more complex = more shapes)
  const bgShape = complexity > 0.6 ? rng.int(0, 2) : rng.int(0, 1);
  let bgElement = '';
  const bgSize = letterSize * (0.65 + sizeVariationFactor * 0.1);
  
  if (bgShape === 0) {
    bgElement = `<circle cx="${center}" cy="${center}" r="${bgSize}" fill="url(#${gradientId})" opacity="0.9" transform="rotate(${rotation * (180 / Math.PI)} ${center} ${center})"/>`;
  } else if (bgShape === 1) {
    const offset = bgSize;
    bgElement = `<rect x="${center - offset}" y="${center - offset}" width="${offset * 2}" height="${offset * 2}" rx="${letterSize * 0.2}" fill="url(#${gradientId})" opacity="0.9" transform="rotate(${rotation * (180 / Math.PI)} ${center} ${center})"/>`;
  } else {
    const points: string[] = [];
    const sides = 6 + Math.floor(complexity * 2); // 6-8 sides based on complexity
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2 + rotation;
      const x = center + Math.cos(angle) * bgSize;
      const y = center + Math.sin(angle) * bgSize;
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
    <text x="${center}" y="${center + fontSize * 0.35}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${rotation * (180 / Math.PI)} ${center} ${center + fontSize * 0.35})">${letter}</text>
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
  
  // Apply expressive parameters
  const complexity = (spec.complexity ?? 50) / 100;
  const sizeVariationFactor = (spec.sizeVariation ?? 50) / 100;
  const rotation = (spec.rotation ?? 0) * (Math.PI / 180);
  const patternDensity = (spec.patternDensity ?? 50) / 100;
  
  const baseRadius = size * spec.scaleFactor * (0.35 + sizeVariationFactor * 0.1);

  const arcs: string[] = [];
  // Arc count based on complexity (2-6 arcs)
  const arcCount = 2 + Math.floor(complexity * 4);
  
  // Spacing based on pattern density
  const spacing = 0.15 + patternDensity * 0.15;
  
  for (let i = 0; i < arcCount; i++) {
    const radiusMultiplier = 0.6 + (i * spacing) + (sizeVariationFactor * 0.1 * (i / arcCount));
    const radius = baseRadius * radiusMultiplier;
    const startAngle = (i * Math.PI * 2) / arcCount + rotation;
    const endAngle = startAngle + Math.PI * (1.3 + patternDensity * 0.4);
    const largeArc = 1;
    const x1 = center + Math.cos(startAngle) * radius;
    const y1 = center + Math.sin(startAngle) * radius;
    const x2 = center + Math.cos(endAngle) * radius;
    const y2 = center + Math.sin(endAngle) * radius;
    arcs.push(`<path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="url(#${gradientId})" opacity="${0.8 - i * 0.1}"/>`);
  }

  // Overlapping circles (complexity affects count)
  const circles: string[] = [];
  const circleCount = complexity > 0.5 ? 3 : 2;
  for (let i = 0; i < circleCount; i++) {
    const offsetAngle = (i * Math.PI * 2) / circleCount + rotation;
    const offset = baseRadius * (0.25 + sizeVariationFactor * 0.15);
    const circleRadius = baseRadius * (0.4 + sizeVariationFactor * 0.2);
    const x = center + Math.cos(offsetAngle) * offset;
    const y = center + Math.sin(offsetAngle) * offset;
    circles.push(`<circle cx="${x}" cy="${y}" r="${circleRadius}" fill="url(#${gradientId})" opacity="${0.6 - i * 0.1}"/>`);
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

/**
 * Generate OpenGraph images for social media sharing
 * Run: npx tsx scripts/generate-og-images.ts
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Color scheme - matching OpenClaw Hub theme
const colors = {
  background: '#0a0a0a',
  cardBackground: '#1a1a1a',
  primary: '#6366f1', // indigo-500
  secondary: '#8b5cf6', // violet-500
  accent: '#06b6d4', // cyan-500
  text: '#ffffff',
  textMuted: '#a1a1aa',
};

/**
 * Draw rounded rectangle on SVG
 */
function roundedRect(x: number, y: number, width: number, height: number, radius: number, fill: string) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" />`;
}

/**
 * Generate SVG template for OG image
 */
function generateOGImageSVG(width: number, height: number): string {
  const centerX = width / 2;
  const centerY = height / 2;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradient background -->
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f0f23;stop-opacity:1" />
        </linearGradient>

        <!-- Card gradient -->
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#2d1b4e;stop-opacity:0.6" />
        </linearGradient>

        <!-- Glow effect -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Text shadow -->
        <filter id="textShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGradient)" />

      <!-- Decorative elements -->
      <circle cx="${width * 0.1}" cy="${height * 0.15}" r="80" fill="${colors.primary}" opacity="0.15" />
      <circle cx="${width * 0.9}" cy="${height * 0.85}" r="100" fill="${colors.secondary}" opacity="0.15" />
      <circle cx="${width * 0.85}" cy="${height * 0.2}" r="60" fill="${colors.accent}" opacity="0.1" />

      <!-- Grid pattern -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.05"/>
      </pattern>
      <rect width="${width}" height="${height}" fill="url(#grid)" />

      <!-- Main card -->
      <rect x="${centerX - 450}" y="${centerY - 180}" width="900" height="360" rx="20"
            fill="url(#cardGradient)" stroke="${colors.primary}" stroke-width="2" opacity="0.9" />

      <!-- Corner accents -->
      <path d="M ${centerX - 430} ${centerY - 160} L ${centerX - 400} ${centerY - 160} L ${centerX - 430} ${centerY - 130} Z"
            fill="${colors.primary}" />
      <path d="M ${centerX + 430} ${centerY + 160} L ${centerX + 400} ${centerY + 160} L ${centerX + 430} ${centerY + 130} Z"
            fill="${colors.secondary}" />

      <!-- Logo/Icon area -->
      <circle cx="${centerX}" cy="${centerY - 100}" r="40" fill="${colors.primary}" opacity="0.2" />
      <circle cx="${centerX}" cy="${centerY - 100}" r="30" fill="${colors.primary}" opacity="0.4" />
      <text x="${centerX}" y="${centerY - 90}" text-anchor="middle" font-family="Arial, sans-serif"
            font-size="32" font-weight="bold" fill="#ffffff">OC</text>

      <!-- Main title -->
      <text x="${centerX}" y="${centerY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
            font-size="48" font-weight="700" fill="${colors.text}" filter="url(#textShadow)">
        OpenClaw 实战指南
      </text>

      <!-- Subtitle -->
      <text x="${centerX}" y="${centerY + 50}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
            font-size="24" font-weight="400" fill="${colors.textMuted}">
        让 AI 助手真正帮你工作
      </text>

      <!-- Stats badges -->
      <g transform="translate(${centerX - 150}, ${centerY + 100})">
        <rect x="0" y="0" width="100" height="32" rx="16" fill="${colors.primary}" opacity="0.8" />
        <text x="50" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#ffffff">
          30+ 教程
        </text>
      </g>

      <g transform="translate(${centerX - 45}, ${centerY + 100})">
        <rect x="0" y="0" width="100" height="32" rx="16" fill="${colors.secondary}" opacity="0.8" />
        <text x="50" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#ffffff">
          1500+ 技能
        </text>
      </g>

      <g transform="translate(${centerX + 60}, ${centerY + 100})">
        <rect x="0" y="0" width="90" height="32" rx="16" fill="${colors.accent}" opacity="0.8" />
        <text x="45" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#ffffff">
          开源免费
        </text>
      </g>

      <!-- URL at bottom -->
      <text x="${centerX}" y="${height - 30}" text-anchor="middle" font-family="system-ui, monospace"
            font-size="16" fill="${colors.textMuted}" opacity="0.7">
        clawtools.dev
      </text>
    </svg>
  `;
}

/**
 * Generate square OG image SVG (1:1 ratio)
 */
function generateSquareOGImageSVG(width: number, height: number): string {
  const centerX = width / 2;
  const centerY = height / 2;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradientSquare" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f0f23;stop-opacity:1" />
        </linearGradient>
        <filter id="glowSquare">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGradientSquare)" />

      <!-- Animated-style circles -->
      <circle cx="${width * 0.2}" cy="${height * 0.2}" r="120" fill="${colors.primary}" opacity="0.1" />
      <circle cx="${width * 0.8}" cy="${height * 0.8}" r="150" fill="${colors.secondary}" opacity="0.1" />
      <circle cx="${width * 0.8}" cy="${height * 0.2}" r="80" fill="${colors.accent}" opacity="0.15" />
      <circle cx="${width * 0.2}" cy="${height * 0.8}" r="100" fill="${colors.primary}" opacity="0.08" />

      <!-- Central logo circle -->
      <circle cx="${centerX}" cy="${centerY - 100}" r="80" fill="${colors.primary}" opacity="0.15" />
      <circle cx="${centerX}" cy="${centerY - 100}" r="65" fill="${colors.primary}" opacity="0.25" />
      <circle cx="${centerX}" cy="${centerY - 100}" r="50" fill="${colors.primary}" />

      <!-- Logo text -->
      <text x="${centerX}" y="${centerY - 85}" text-anchor="middle" font-family="Arial, sans-serif"
            font-size="50" font-weight="bold" fill="#ffffff" filter="url(#glowSquare)">
        OC
      </text>

      <!-- Title -->
      <text x="${centerX}" y="${centerY + 30}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
            font-size="52" font-weight="700" fill="${colors.text}" filter="url(#glowSquare)">
        OpenClaw
      </text>

      <text x="${centerX}" y="${centerY + 100}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
            font-size="52" font-weight="700" fill="${colors.text}" filter="url(#glowSquare)">
        实战指南
      </text>

      <!-- Tagline -->
      <text x="${centerX}" y="${centerY + 170}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
            font-size="28" font-weight="400" fill="${colors.textMuted}">
        让 AI 助手真正帮你工作
      </text>

      <!-- Badge row -->
      <g transform="translate(${centerX - 160}, ${centerY + 230})">
        <rect x="0" y="0" width="100" height="36" rx="18" fill="${colors.primary}" opacity="0.8" />
        <text x="50" y="24" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#ffffff">
          30+ 教程
        </text>
      </g>

      <g transform="translate(${centerX - 50}, ${centerY + 230})">
        <rect x="0" y="0" width="100" height="36" rx="18" fill="${colors.secondary}" opacity="0.8" />
        <text x="50" y="24" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#ffffff">
          1500+ 技能
        </text>
      </g>

      <g transform="translate(${centerX + 60}, ${centerY + 230})">
        <rect x="0" y="0" width="100" height="36" rx="18" fill="${colors.accent}" opacity="0.8" />
        <text x="50" y="24" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#ffffff">
          完全免费
        </text>
      </g>

      <!-- URL -->
      <text x="${centerX}" y="${height - 40}" text-anchor="middle" font-family="system-ui, monospace"
            font-size="20" fill="${colors.textMuted}" opacity="0.6">
        clawtools.dev
      </text>
    </svg>
  `;
}

/**
 * Generate apple-touch-icon
 */
function generateAppleTouchIconSVG(): string {
  const size = 180;
  const center = size / 2;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1" />
          <stop offset="100%" style="stop-color:#8b5cf6" />
        </linearGradient>
      </defs>

      <!-- Background with rounded corners (apple style) -->
      <rect width="${size}" height="${size}" rx="40" fill="url(#iconBg)" />

      <!-- Simple icon design -->
      <circle cx="${center}" cy="${center - 10}" r="35" fill="#ffffff" opacity="0.2" />
      <text x="${center}" y="${center + 20}" text-anchor="middle" font-family="Arial, sans-serif"
            font-size="60" font-weight="bold" fill="#ffffff">
        OC
      </text>
    </svg>
  `;
}

/**
 * Main generation function
 */
async function generateImages() {
  console.log('🎨 Generating OG images...\n');

  // Generate horizontal OG image (1200x630)
  console.log('📐 Creating og-image.png (1200x630)...');
  const ogHorizontalSVG = generateOGImageSVG(1200, 630);
  await sharp(Buffer.from(ogHorizontalSVG))
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✅ og-image.png created!\n');

  // Generate square OG image (1200x1200)
  console.log('📐 Creating og-image-square.png (1200x1200)...');
  const ogSquareSVG = generateSquareOGImageSVG(1200, 1200);
  await sharp(Buffer.from(ogSquareSVG))
    .png()
    .toFile(path.join(publicDir, 'og-image-square.png'));
  console.log('✅ og-image-square.png created!\n');

  // Generate apple-touch-icon (180x180)
  console.log('📐 Creating apple-touch-icon.png (180x180)...');
  const iconSVG = generateAppleTouchIconSVG();
  await sharp(Buffer.from(iconSVG))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ apple-touch-icon.png created!\n');

  console.log('🎉 All OG images generated successfully!');
  console.log('\n📁 Files created:');
  console.log('  - public/og-image.png');
  console.log('  - public/og-image-square.png');
  console.log('  - public/apple-touch-icon.png');
}

// Run generation
generateImages().catch(console.error);

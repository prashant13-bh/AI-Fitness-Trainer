const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function createSvg(size) {
  const fontSize = Math.round(size * 0.42);
  const subFontSize = Math.round(size * 0.08);
  const radius = Math.round(size * 0.22);

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#060A14"/>
        <stop offset="50%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#1E1B4B"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="50%" stop-color="#FF7A00"/>
        <stop offset="100%" stop-color="#0085FF"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="${size * 0.02}" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    
    <!-- Background rounded squircle -->
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
    
    <!-- Outer gold accent border -->
    <rect x="${size * 0.04}" y="${size * 0.04}" width="${size * 0.92}" height="${size * 0.92}" rx="${radius * 0.85}" fill="none" stroke="url(#gold)" stroke-width="${size * 0.02}" opacity="0.75"/>
    
    <!-- Lightning bolt & B monogram -->
    <g filter="url(#glow)">
      <!-- Lightning Bolt -->
      <polygon points="${size*0.52},${size*0.18} ${size*0.35},${size*0.48} ${size*0.48},${size*0.48} ${size*0.44},${size*0.78} ${size*0.65},${size*0.44} ${size*0.52},${size*0.44}" fill="url(#gold)"/>
    </g>
    
    <!-- BRUCE ARC Text -->
    <text x="50%" y="${size * 0.88}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="${subFontSize}" fill="#FFFFFF" text-anchor="middle" letter-spacing="${size * 0.015}">BRUCE ARC</text>
  </svg>
  `;
}

async function run() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  const svg192 = Buffer.from(createSvg(192));
  await sharp(svg192).png().toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Created icon-192.png');

  const svg512 = Buffer.from(createSvg(512));
  await sharp(svg512).png().toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Created icon-512.png');
}

run().catch(console.error);

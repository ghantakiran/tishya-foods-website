/**
 * Generate PWA Icons Script
 * Creates placeholder PWA icons for testing
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const iconSizes = [192, 256, 384, 512];

// SVG template for Tishya Foods icon
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 10}" fill="url(#grad1)" stroke="#ffffff" stroke-width="4"/>
  
  <!-- Tishya Foods logo elements -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Leaf symbol -->
    <path d="M-30,-20 Q-40,-30 -20,-40 Q0,-30 10,-20 Q0,-10 -20,-10 Q-30,-15 -30,-20 Z" 
          fill="#ffffff" opacity="0.9"/>
    
    <!-- Grain/protein symbol -->
    <circle cx="15" cy="5" r="8" fill="#ffffff" opacity="0.8"/>
    <circle cx="25" cy="-5" r="6" fill="#ffffff" opacity="0.7"/>
    <circle cx="5" cy="15" r="7" fill="#ffffff" opacity="0.7"/>
    
    <!-- Text representation -->
    <text x="0" y="35" text-anchor="middle" fill="#ffffff" 
          font-family="Arial, sans-serif" font-size="${size/12}" font-weight="bold">
      TISHYA
    </text>
  </g>
</svg>
`;

// Create icons directory
const iconsDir = path.join(__dirname, '../public');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Generated ${size}x${size} SVG icon`);
});

// Create a simple favicon
const faviconSVG = createSVGIcon(32);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSVG);

console.log('✅ PWA icons generated successfully!');
console.log('📝 Note: For production, convert SVG icons to PNG format using a tool like ImageMagick:');
console.log('   convert icon-192x192.svg icon-192x192.png');
console.log('   or use an online SVG to PNG converter');

// Also create a simple manifest validation
const manifestPath = path.join(iconsDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update icon paths to point to SVG files for now
  manifest.icons = iconSizes.map(size => ({
    src: `/icon-${size}x${size}.svg`,
    sizes: `${size}x${size}`,
    type: 'image/svg+xml',
    purpose: size >= 512 ? 'any' : 'maskable any'
  }));
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Updated manifest.json with SVG icon references');
}
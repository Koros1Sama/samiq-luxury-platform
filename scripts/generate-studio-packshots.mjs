import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.resolve(process.cwd(), 'public/media/products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Shared backdrop SVG components
const commonDefs = `
  <defs>
    <!-- Studio Softbox Radial Backdrop -->
    <radialGradient id="studioBackdrop" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#FAF8F5"/>
      <stop offset="55%" stop-color="#ECE6DC"/>
      <stop offset="100%" stop-color="#DCD5C9"/>
    </radialGradient>

    <!-- Studio Floor Linear Gradient -->
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E2DDD4"/>
      <stop offset="40%" stop-color="#D6CFC4"/>
      <stop offset="100%" stop-color="#C2BAB0"/>
    </linearGradient>

    <!-- Soft Pedestal Contact Shadow Blur -->
    <filter id="softContactBlur" x="-30%" y="-40%" width="160%" height="180%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
    <filter id="tightContactBlur" x="-30%" y="-40%" width="160%" height="180%">
      <feGaussianBlur stdDeviation="6" />
    </filter>

    <!-- Specular Highlight Strip Linear Gradient -->
    <linearGradient id="specularVertical" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.65"/>
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="65%" stop-color="#FFFFFF" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>

    <!-- Brushed Gold Linear Gradient -->
    <linearGradient id="goldBrushed" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8C6D2E"/>
      <stop offset="18%" stop-color="#C5A059"/>
      <stop offset="38%" stop-color="#FFF3B0"/>
      <stop offset="58%" stop-color="#D4AF37"/>
      <stop offset="80%" stop-color="#9A7828"/>
      <stop offset="92%" stop-color="#6E531D"/>
      <stop offset="100%" stop-color="#BFA04A"/>
    </linearGradient>

    <!-- Silver Champagne Metallic Gradient -->
    <linearGradient id="silverChampagne" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8E887E"/>
      <stop offset="22%" stop-color="#CFC9BE"/>
      <stop offset="42%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#E2DDD4"/>
      <stop offset="82%" stop-color="#A8A296"/>
      <stop offset="100%" stop-color="#CCC6BC"/>
    </linearGradient>

    <!-- Obsidian Case Gradient -->
    <linearGradient id="obsidianCase" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0E0E12"/>
      <stop offset="25%" stop-color="#22222A"/>
      <stop offset="45%" stop-color="#343440"/>
      <stop offset="70%" stop-color="#16161B"/>
      <stop offset="100%" stop-color="#0A0A0D"/>
    </linearGradient>
  </defs>
`;

const studioBackground = `
  <!-- Studio Wall Backdrop -->
  <rect width="900" height="900" fill="url(#studioBackdrop)"/>

  <!-- Pedestal Horizon Line at y=720 -->
  <line x1="0" y1="720" x2="900" y2="720" stroke="#BFB7A8" stroke-width="1.5" opacity="0.5"/>

  <!-- Pedestal Floor -->
  <rect x="0" y="720" width="900" height="180" fill="url(#floorGrad)"/>
`;

// 1. Amber Apothecary Glass Dropper Bottle (Vitamin C 10%)
const serumVitaminCSvg = `
<svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <defs>
    <!-- Deep Amber Glass Gradient -->
    <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#241107"/>
      <stop offset="14%" stop-color="#4A2511"/>
      <stop offset="32%" stop-color="#8A4A20"/>
      <stop offset="48%" stop-color="#7A431D"/>
      <stop offset="72%" stop-color="#3D1F0D"/>
      <stop offset="90%" stop-color="#200E05"/>
      <stop offset="100%" stop-color="#4A2511"/>
    </linearGradient>
    <!-- Rubber Bulb Radial Gradient -->
    <radialGradient id="rubberBulb" cx="42%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#3A3A3D"/>
      <stop offset="50%" stop-color="#1E1E22"/>
      <stop offset="100%" stop-color="#0E0E10"/>
    </radialGradient>
  </defs>

  ${studioBackground}

  <!-- Pedestal Contact Shadows -->
  <ellipse cx="450" cy="728" rx="135" ry="16" fill="#1C140A" opacity="0.32" filter="url(#softContactBlur)"/>
  <ellipse cx="450" cy="722" rx="90" ry="7" fill="#0C0804" opacity="0.55" filter="url(#tightContactBlur)"/>

  <!-- Bottle Body (Amber Glass) -->
  <rect x="345" y="380" width="210" height="340" rx="28" fill="url(#amberGlass)"/>
  
  <!-- Glass Base Lens (translucent bottom curve) -->
  <path d="M 345,690 Q 450,725 555,690 L 555,692 Q 450,730 345,692 Z" fill="#A85E2A" opacity="0.45"/>

  <!-- Bottle Shoulder Taper -->
  <path d="M 345,410 C 345,355 410,345 412,330 L 488,330 C 490,345 555,355 555,410 Z" fill="url(#amberGlass)"/>

  <!-- Vertical Glass Specular Highlight -->
  <rect x="385" y="385" width="20" height="315" rx="10" fill="url(#specularVertical)" opacity="0.6"/>

  <!-- Metallic Brushed Gold Collar -->
  <rect x="412" y="285" width="76" height="46" rx="4" fill="url(#goldBrushed)"/>
  <line x1="412" y1="298" x2="488" y2="298" stroke="#5A4215" stroke-width="1.2" opacity="0.4"/>
  <line x1="412" y1="316" x2="488" y2="316" stroke="#5A4215" stroke-width="1.2" opacity="0.4"/>

  <!-- Matte Black Rubber Dropper Bulb -->
  <path d="M 426,285 C 424,240 432,205 450,205 C 468,205 476,240 474,285 Z" fill="url(#rubberBulb)"/>
  <!-- Bulb Rim Highlight -->
  <ellipse cx="445" cy="225" rx="10" ry="16" fill="#FFFFFF" opacity="0.12"/>

  <!-- Minimal Lab Bottle Label -->
  <rect x="375" y="450" width="150" height="200" rx="6" fill="#F8F6F0" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.18))"/>
  
  <!-- Label Content -->
  <text x="450" y="475" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#8C7853">SAMIQ LABS</text>
  <line x1="400" y1="486" x2="500" y2="486" stroke="#DCD6C8" stroke-width="1"/>
  <text x="450" y="520" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="1" fill="#1C1814">VITAMIN C 10%</text>
  <text x="450" y="538" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" letter-spacing="1.5" fill="#584E42">PURE SERUM</text>
  <line x1="420" y1="552" x2="480" y2="552" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="450" y="575" text-anchor="middle" font-family="'IBM Plex Sans Arabic', 'Readex Pro', sans-serif" font-size="10" font-weight="600" fill="#2C241B">سيروم فيتامين سي النقي</text>
  <text x="450" y="594" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="500" fill="#756A5C">FERULIC ACID + HA</text>
  <text x="450" y="632" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="#8C7853">30 ML / 1.0 FL. OZ.</text>
</svg>
`;

// 2. Tall Matte Ivory-White Cylindrical Pump Bottle (Hydrating Cleanser)
const cleanserHydratingSvg = `
<svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <defs>
    <!-- Matte Ivory Cylindrical Gradient -->
    <linearGradient id="ivoryBottle" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#CFC8BC"/>
      <stop offset="15%" stop-color="#EAE5DC"/>
      <stop offset="35%" stop-color="#FFFFFF"/>
      <stop offset="55%" stop-color="#F7F5F0"/>
      <stop offset="78%" stop-color="#DCD5C8"/>
      <stop offset="92%" stop-color="#B8B0A2"/>
      <stop offset="100%" stop-color="#DFD9CD"/>
    </linearGradient>
  </defs>

  ${studioBackground}

  <!-- Pedestal Contact Shadows -->
  <ellipse cx="450" cy="728" rx="130" ry="15" fill="#1C1814" opacity="0.28" filter="url(#softContactBlur)"/>
  <ellipse cx="450" cy="722" rx="85" ry="7" fill="#0E0C0A" opacity="0.5" filter="url(#tightContactBlur)"/>

  <!-- Bottle Body (Tall Matte Ivory Cylinder) -->
  <rect x="355" y="300" width="190" height="420" rx="20" fill="url(#ivoryBottle)"/>
  
  <!-- Subtle Vertical Sheen -->
  <rect x="390" y="305" width="22" height="405" rx="11" fill="url(#specularVertical)" opacity="0.45"/>

  <!-- Sage/Teal Clinical Brand Band -->
  <rect x="355" y="340" width="190" height="28" fill="#0F4C4A"/>
  <text x="450" y="358" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#FFFFFF">DERMATOLOGICALLY TESTED</text>

  <!-- Pump Neck Collar (Brushed Champagne Gold) -->
  <rect x="420" y="258" width="60" height="42" rx="3" fill="url(#goldBrushed)"/>
  
  <!-- Pump Dispenser Stem -->
  <rect x="438" y="232" width="24" height="26" fill="url(#goldBrushed)"/>

  <!-- Pump Dispenser Head & Nozzle (Angled toward left) -->
  <path d="M 390,210 L 468,206 C 476,206 482,212 482,220 L 482,234 L 434,234 L 388,222 C 384,221 384,213 390,210 Z" fill="url(#goldBrushed)"/>
  <ellipse cx="388" cy="216" rx="3" ry="5" fill="#3D2D10"/>

  <!-- Bottle Clinical Label -->
  <rect x="380" y="420" width="140" height="230" rx="6" fill="#FDFDFB" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.08))"/>
  
  <text x="450" y="450" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#0F4C4A">SAMIQ CLINICAL</text>
  <line x1="410" y1="462" x2="490" y2="462" stroke="#0F4C4A" stroke-width="1" opacity="0.4"/>
  <text x="450" y="496" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="1" fill="#1A2826">HYDRATING</text>
  <text x="450" y="515" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="1" fill="#0F4C4A">CERAMIDE CLEANSER</text>
  
  <line x1="420" y1="532" x2="480" y2="532" stroke="#C9A84C" stroke-width="1.5"/>
  
  <text x="450" y="556" text-anchor="middle" font-family="'IBM Plex Sans Arabic', 'Readex Pro', sans-serif" font-size="10.5" font-weight="600" fill="#1C2422">غسول السيراميد المرطب</text>
  <text x="450" y="576" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="500" fill="#586360">ESSENTIAL CERAMIDES 1, 3, 6-II</text>
  <text x="450" y="594" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="500" fill="#75827E">FOR NORMAL TO DRY SKIN</text>
  
  <text x="450" y="632" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="#0F4C4A">200 ML / 6.7 FL. OZ.</text>
</svg>
`;

// 3. Frosted Translucent Pearl-White Dropper Bottle (Niacinamide 10% + Zinc 1%)
const serumNiacinamideSvg = `
<svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <defs>
    <!-- Frosted Glass Gradient -->
    <linearGradient id="frostedGlass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C2BCB2"/>
      <stop offset="16%" stop-color="#E2DFD7"/>
      <stop offset="34%" stop-color="#FFFFFF"/>
      <stop offset="52%" stop-color="#F2F0EC"/>
      <stop offset="74%" stop-color="#D8D2C6"/>
      <stop offset="90%" stop-color="#B8B2A6"/>
      <stop offset="100%" stop-color="#D5CFBE"/>
    </linearGradient>
    <radialGradient id="whiteRubber" cx="42%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#EAE6DE"/>
      <stop offset="100%" stop-color="#CEC7BC"/>
    </radialGradient>
  </defs>

  ${studioBackground}

  <!-- Pedestal Contact Shadows -->
  <ellipse cx="450" cy="728" rx="135" ry="16" fill="#1C1814" opacity="0.25" filter="url(#softContactBlur)"/>
  <ellipse cx="450" cy="722" rx="90" ry="7" fill="#0C0A08" opacity="0.45" filter="url(#tightContactBlur)"/>

  <!-- Bottle Body (Frosted Pearl White Glass) -->
  <rect x="345" y="380" width="210" height="340" rx="28" fill="url(#frostedGlass)"/>
  
  <!-- Glass Base Lens Effect -->
  <path d="M 345,690 Q 450,725 555,690 L 555,692 Q 450,730 345,692 Z" fill="#FFFFFF" opacity="0.55"/>

  <!-- Bottle Shoulder Taper -->
  <path d="M 345,410 C 345,355 410,345 412,330 L 488,330 C 490,345 555,355 555,410 Z" fill="url(#frostedGlass)"/>

  <!-- Vertical Specular Highlight -->
  <rect x="385" y="385" width="22" height="315" rx="11" fill="url(#specularVertical)" opacity="0.75"/>

  <!-- Silver Champagne Metallic Collar -->
  <rect x="412" y="285" width="76" height="46" rx="4" fill="url(#silverChampagne)"/>
  <line x1="412" y1="300" x2="488" y2="300" stroke="#7A7468" stroke-width="1.2" opacity="0.3"/>
  <line x1="412" y1="318" x2="488" y2="318" stroke="#7A7468" stroke-width="1.2" opacity="0.3"/>

  <!-- White Rubber Dropper Bulb -->
  <path d="M 426,285 C 424,240 432,205 450,205 C 468,205 476,240 474,285 Z" fill="url(#whiteRubber)"/>
  <ellipse cx="445" cy="225" rx="8" ry="14" fill="#FFFFFF" opacity="0.4"/>

  <!-- Minimal Clinical Label -->
  <rect x="375" y="450" width="150" height="200" rx="6" fill="#FFFFFF" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.12))"/>
  
  <text x="450" y="475" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#7A7468">SAMIQ FORMULATION</text>
  <line x1="400" y1="486" x2="500" y2="486" stroke="#E2DDD4" stroke-width="1"/>
  <text x="450" y="520" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" letter-spacing="0.5" fill="#1C1A18">NIACINAMIDE 10%</text>
  <text x="450" y="538" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" letter-spacing="1" fill="#4A453E">+ ZINC 1%</text>
  <line x1="420" y1="552" x2="480" y2="552" stroke="#8C8476" stroke-width="1.5"/>
  <text x="450" y="575" text-anchor="middle" font-family="'IBM Plex Sans Arabic', 'Readex Pro', sans-serif" font-size="10" font-weight="600" fill="#24211D">سيروم نياسيناميد المركز</text>
  <text x="450" y="594" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="500" fill="#7A7468">HIGH STRENGTH VITAMIN</text>
  <text x="450" y="632" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="#7A7468">30 ML / 1.0 FL. OZ.</text>
</svg>
`;

// 4. Luxury Couture Lipstick (Black & Brushed-Gold, Open with Cap Aside)
const lipstickCoutureSvg = `
<svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <defs>
    <!-- Satin Rose-Berry Lipstick Bullet Gradient -->
    <linearGradient id="roseBerryBullet" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#54111E"/>
      <stop offset="22%" stop-color="#8E2438"/>
      <stop offset="48%" stop-color="#D94D66"/>
      <stop offset="70%" stop-color="#B83B52"/>
      <stop offset="90%" stop-color="#681726"/>
      <stop offset="100%" stop-color="#420B16"/>
    </linearGradient>
    <linearGradient id="bulletBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E8617B"/>
      <stop offset="100%" stop-color="#8E2438"/>
    </linearGradient>
  </defs>

  ${studioBackground}

  <!-- Pedestal Contact Shadows: Main Tube (cx=390) and Cap (cx=525) -->
  <ellipse cx="390" cy="726" rx="65" ry="12" fill="#14100C" opacity="0.4" filter="url(#softContactBlur)"/>
  <ellipse cx="390" cy="722" rx="45" ry="6" fill="#080604" opacity="0.65" filter="url(#tightContactBlur)"/>

  <ellipse cx="525" cy="726" rx="65" ry="12" fill="#14100C" opacity="0.4" filter="url(#softContactBlur)"/>
  <ellipse cx="525" cy="722" rx="45" ry="6" fill="#080604" opacity="0.65" filter="url(#tightContactBlur)"/>

  <!-- 1. STANDING CAP (Beside Lipstick on Pedestal at x=490 to 560) -->
  <rect x="490" y="470" width="70" height="250" rx="4" fill="url(#obsidianCase)"/>
  <!-- Gold Top Trim on Cap -->
  <rect x="490" y="470" width="70" height="6" rx="2" fill="url(#goldBrushed)"/>
  <!-- Gold Bottom Trim on Cap -->
  <rect x="490" y="714" width="70" height="6" rx="2" fill="url(#goldBrushed)"/>
  <!-- Cap Specular Highlight -->
  <rect x="502" y="476" width="8" height="238" rx="4" fill="url(#specularVertical)" opacity="0.3"/>
  <!-- Cap Gold Monogram Motif -->
  <circle cx="525" cy="580" r="14" fill="none" stroke="url(#goldBrushed)" stroke-width="1.5"/>
  <path d="M 520,580 L 525,572 L 530,580 L 525,588 Z" fill="url(#goldBrushed)"/>

  <!-- 2. MAIN LIPSTICK CASE -->
  <!-- Matte Obsidian Lower Case -->
  <rect x="355" y="520" width="70" height="200" rx="4" fill="url(#obsidianCase)"/>
  <rect x="367" y="525" width="8" height="190" rx="4" fill="url(#specularVertical)" opacity="0.35"/>

  <!-- Gold Monogram Accent Ring -->
  <rect x="353" y="510" width="74" height="14" rx="2" fill="url(#goldBrushed)"/>
  <line x1="353" y1="517" x2="427" y2="517" stroke="#4A3510" stroke-width="1" opacity="0.5"/>

  <!-- Gleaming Gold Inner Tube (Emerging from case) -->
  <rect x="365" y="415" width="50" height="98" rx="2" fill="url(#goldBrushed)"/>
  <rect x="373" y="417" width="6" height="94" rx="3" fill="#FFFFFF" opacity="0.5"/>

  <!-- Beveled Satin Rose-Berry Bullet -->
  <!-- Cylinder base of bullet inside gold tube -->
  <path d="M 368,418 L 368,360 C 368,350 375,340 380,335 L 412,355 C 412,358 412,418 412,418 Z" fill="url(#roseBerryBullet)"/>
  <!-- Beveled Angled Tip -->
  <polygon points="380,335 412,355 408,375 376,355" fill="url(#bulletBevel)"/>
  <!-- Velvet Sheen Highlight -->
  <path d="M 378,350 L 388,342 L 396,358 L 386,366 Z" fill="#FFFFFF" opacity="0.35"/>
</svg>
`;

// 5. Sleek Open Square Luxury Compact Palette (Eyeshadows & Mirror)
const eyeshadowPaletteSvg = `
<svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <defs>
    <!-- Eyeshadow Shimmer Gradients -->
    <!-- 1. Warm Bronze -->
    <linearGradient id="panBronze" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9C684E"/>
      <stop offset="45%" stop-color="#7C503A"/>
      <stop offset="100%" stop-color="#4A2F22"/>
    </linearGradient>
    <!-- 2. Champagne Shimmer -->
    <linearGradient id="panChampagne" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0D4"/>
      <stop offset="50%" stop-color="#E6CFAF"/>
      <stop offset="100%" stop-color="#B89C78"/>
    </linearGradient>
    <!-- 3. Dusty Rose -->
    <linearGradient id="panDustyRose" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D49990"/>
      <stop offset="50%" stop-color="#B87D74"/>
      <stop offset="100%" stop-color="#7E4C44"/>
    </linearGradient>
    <!-- 4. Deep Espresso -->
    <linearGradient id="panEspresso" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#553830"/>
      <stop offset="50%" stop-color="#3B2621"/>
      <stop offset="100%" stop-color="#1E120E"/>
    </linearGradient>

    <!-- Mirror Reflection Gradient -->
    <linearGradient id="mirrorGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B8BAC0"/>
      <stop offset="35%" stop-color="#E8EAF0"/>
      <stop offset="70%" stop-color="#CACCD4"/>
      <stop offset="100%" stop-color="#9AA0AC"/>
    </linearGradient>
  </defs>

  ${studioBackground}

  <!-- Pedestal Contact Shadows -->
  <ellipse cx="450" cy="728" rx="220" ry="20" fill="#14100C" opacity="0.35" filter="url(#softContactBlur)"/>
  <ellipse cx="450" cy="724" rx="160" ry="9" fill="#080604" opacity="0.6" filter="url(#tightContactBlur)"/>

  <!-- UPPER OPEN LID (Standing Angled Upright Behind Base) -->
  <rect x="250" y="270" width="400" height="260" rx="14" fill="#161418"/>
  <rect x="250" y="270" width="400" height="260" rx="14" fill="none" stroke="url(#goldBrushed)" stroke-width="2"/>
  
  <!-- Interior Mirror in Lid -->
  <rect x="272" y="290" width="356" height="220" rx="8" fill="url(#mirrorGlass)"/>
  <!-- Mirror Glare Strip -->
  <polygon points="320,290 380,290 300,510 272,510" fill="#FFFFFF" opacity="0.35"/>
  <polygon points="460,290 490,290 390,510 360,510" fill="#FFFFFF" opacity="0.18"/>

  <!-- Gold Palette Hinge Axis -->
  <rect x="260" y="524" width="380" height="12" rx="3" fill="url(#goldBrushed)"/>

  <!-- LOWER CHASSIS (Resting on Pedestal) -->
  <rect x="240" y="534" width="420" height="188" rx="14" fill="#161418"/>
  <rect x="240" y="534" width="420" height="188" rx="14" fill="none" stroke="url(#goldBrushed)" stroke-width="2"/>

  <!-- 4 EYESHADOW PANS -->
  <!-- Pan 1: Warm Bronze (Top-Left) -->
  <rect x="270" y="556" width="165" height="66" rx="6" fill="#0D0B0E" stroke="url(#goldBrushed)" stroke-width="1"/>
  <rect x="273" y="559" width="159" height="60" rx="5" fill="url(#panBronze)"/>
  <rect x="280" y="563" width="20" height="50" rx="8" fill="#FFFFFF" opacity="0.2"/>

  <!-- Pan 2: Champagne Shimmer (Top-Right) -->
  <rect x="465" y="556" width="165" height="66" rx="6" fill="#0D0B0E" stroke="url(#goldBrushed)" stroke-width="1"/>
  <rect x="468" y="559" width="159" height="60" rx="5" fill="url(#panChampagne)"/>
  <rect x="475" y="563" width="25" height="50" rx="8" fill="#FFFFFF" opacity="0.45"/>

  <!-- Pan 3: Dusty Rose (Bottom-Left) -->
  <rect x="270" y="638" width="165" height="66" rx="6" fill="#0D0B0E" stroke="url(#goldBrushed)" stroke-width="1"/>
  <rect x="273" y="641" width="159" height="60" rx="5" fill="url(#panDustyRose)"/>
  <rect x="280" y="645" width="20" height="50" rx="8" fill="#FFFFFF" opacity="0.2"/>

  <!-- Pan 4: Deep Espresso (Bottom-Right) -->
  <rect x="465" y="638" width="165" height="66" rx="6" fill="#0D0B0E" stroke="url(#goldBrushed)" stroke-width="1"/>
  <rect x="468" y="641" width="159" height="60" rx="5" fill="url(#panEspresso)"/>
  <rect x="475" y="645" width="20" height="50" rx="8" fill="#FFFFFF" opacity="0.15"/>
</svg>
`;

// 6. Wide Frosted Glass Moisturizer Jar (Barrier Cream)
const creamMoisturizingSvg = `
<svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <defs>
    <!-- Heavy Frosted Jar Gradient -->
    <linearGradient id="frostedJar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C2BCB0"/>
      <stop offset="16%" stop-color="#DFDBD2"/>
      <stop offset="35%" stop-color="#FFFFFF"/>
      <stop offset="55%" stop-color="#F4F1EA"/>
      <stop offset="76%" stop-color="#D2CCC0"/>
      <stop offset="90%" stop-color="#ACA496"/>
      <stop offset="100%" stop-color="#CCC6B8"/>
    </linearGradient>
  </defs>

  ${studioBackground}

  <!-- Pedestal Contact Shadows -->
  <ellipse cx="450" cy="728" rx="195" ry="18" fill="#1A1612" opacity="0.32" filter="url(#softContactBlur)"/>
  <ellipse cx="450" cy="722" rx="135" ry="8" fill="#0C0906" opacity="0.55" filter="url(#tightContactBlur)"/>

  <!-- Jar Body (Heavy Frosted Glass) -->
  <rect x="285" y="495" width="330" height="225" rx="32" fill="url(#frostedJar)"/>

  <!-- Thick Glass Base Lens (Heavy Bottom) -->
  <path d="M 285,675 Q 450,725 615,675 L 615,680 Q 450,730 285,680 Z" fill="#FFFFFF" opacity="0.6"/>

  <!-- Vertical Specular Highlight -->
  <rect x="345" y="505" width="28" height="195" rx="14" fill="url(#specularVertical)" opacity="0.65"/>

  <!-- Wide Domed Brushed-Gold Lid -->
  <path d="M 270,495 C 270,430 330,410 450,410 C 570,410 630,430 630,495 Z" fill="url(#goldBrushed)"/>
  <rect x="268" y="485" width="364" height="16" rx="3" fill="url(#goldBrushed)"/>
  <line x1="268" y1="492" x2="632" y2="492" stroke="#604615" stroke-width="1.2" opacity="0.4"/>
  <!-- Specular Curve on Lid Dome -->
  <ellipse cx="420" cy="435" rx="45" ry="14" fill="#FFFFFF" opacity="0.45"/>

  <!-- Cream Label on Jar -->
  <rect x="340" y="540" width="220" height="130" rx="8" fill="#FAF8F4" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.1))"/>
  
  <text x="450" y="566" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#8C7853">SAMIQ DERMA</text>
  <line x1="390" y1="575" x2="510" y2="575" stroke="#E2DDD4" stroke-width="1"/>
  <text x="450" y="602" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" letter-spacing="1" fill="#1C1814">BARRIER CREAM</text>
  <text x="450" y="618" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="600" letter-spacing="0.5" fill="#584E42">HYALURONIC + CERAMIDE</text>
  <text x="450" y="638" text-anchor="middle" font-family="'IBM Plex Sans Arabic', 'Readex Pro', sans-serif" font-size="9.5" font-weight="600" fill="#2C241B">كريم استعادة الحاجز الواقي</text>
  <text x="450" y="658" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" letter-spacing="1" fill="#8C7853">50 ML / 1.7 FL. OZ.</text>
</svg>
`;

const packshots = [
  { filename: 'serum-vitamin-c.jpg', svg: serumVitaminCSvg },
  { filename: 'cleanser-hydrating.jpg', svg: cleanserHydratingSvg },
  { filename: 'serum-niacinamide.jpg', svg: serumNiacinamideSvg },
  { filename: 'lipstick-couture.jpg', svg: lipstickCoutureSvg },
  { filename: 'eyeshadow-palette.jpg', svg: eyeshadowPaletteSvg },
  { filename: 'cream-moisturizing.jpg', svg: creamMoisturizingSvg },
];

async function generate() {
  console.log('========================================================================');
  console.log('            GENERATING STUDIO-GRADE 3D PACKSHOTS (900x900 JPEG)         ');
  console.log('========================================================================');

  let allValid = true;

  for (const item of packshots) {
    const dest = path.join(outputDir, item.filename);
    const buffer = Buffer.from(item.svg);

    await sharp(buffer)
      .resize(900, 900)
      .jpeg({ quality: 88, progressive: true, mozjpeg: true })
      .toFile(dest);

    const stat = fs.statSync(dest);
    const kb = (stat.size / 1024).toFixed(1);
    const passLimit = stat.size < 85 * 1024;
    
    if (!passLimit) allValid = false;

    console.log(`  -> ${item.filename.padEnd(25)}: ${kb} KB [${passLimit ? 'PASS < 85KB' : 'FAIL >= 85KB'}]`);
  }

  if (allValid) {
    console.log('\nResult: PASS. All 6 studio packshots generated successfully (< 85 KB each).');
  } else {
    console.error('\nResult: FAIL. One or more packshots exceeded 85 KB budget.');
    process.exit(1);
  }
}

generate().catch(err => {
  console.error('[Packshot Error]:', err);
  process.exit(1);
});

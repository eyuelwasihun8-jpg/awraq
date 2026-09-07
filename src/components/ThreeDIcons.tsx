import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * 1. Programming 3D Icon:
 * Vibrant 3D blue gradient sphere with glossy top specular highlight,
 * soft ambient drop shadow, and floating 3D code brackets </> with specular bevel.
 */
export const Programming3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Sphere 3D Gradient */}
        <radialGradient id="progSphere" cx="36%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#739BD3" />
          <stop offset="35%" stopColor="#4276BD" />
          <stop offset="75%" stopColor="#406BA6" />
          <stop offset="100%" stopColor="#1F334F" />
        </radialGradient>

        {/* Specular Highlight Gradient */}
        <linearGradient id="progGloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Bracket 3D Shadow */}
        <filter id="bracketShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#162539" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Ambient Drop Shadow */}
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />

      {/* Main 3D Sphere */}
      <circle cx="50" cy="48" r="40" fill="url(#progSphere)" />

      {/* Top Specular Crescent Gloss */}
      <ellipse cx="48" cy="24" rx="26" ry="12" fill="url(#progGloss)" />

      {/* 3D Code Brackets and Slash with depth */}
      <g filter="url(#bracketShadow)">
        {/* Left bracket < (3D layered) */}
        <path
          d="M38 36L26 48L38 60"
          stroke="#1F334F"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38 35L26 47L38 59"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Slash / (3D layered) */}
        <line
          x1="55"
          y1="34"
          x2="45"
          y2="62"
          stroke="#1F334F"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="55"
          y1="33"
          x2="45"
          y2="61"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Right bracket > (3D layered) */}
        <path
          d="M62 36L74 48L62 60"
          stroke="#1F334F"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M62 35L74 47L62 59"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Tiny light sparkle */}
      <circle cx="68" cy="28" r="2" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
};

/**
 * 2. Design 3D Icon:
 * Vibrant multicolor segmented circular badge (teal, yellow, pink, red)
 * with a high-gloss 3D digital art pen/stylus angled at 45 degrees,
 * golden nib, and light glints.
 */
export const Design3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Multicolor Rainbow Base Gradients */}
        {/* Top-left quadrant — lightest gold */}
        <linearGradient id="designRingGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2DA9B" />
          <stop offset="100%" stopColor="#D6B03A" />
        </linearGradient>
        {/* Bottom-left quadrant — deepest navy, closing the sweep */}
        <linearGradient id="designRingYellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A5086" />
          <stop offset="100%" stopColor="#12294A" />
        </linearGradient>
        {/* Bottom-right quadrant — mid navy */}
        <linearGradient id="designRingCoral" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6E97D2" />
          <stop offset="100%" stopColor="#2F5583" />
        </linearGradient>
        {/* Top-right quadrant — deep gold */}
        <linearGradient id="designRingBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D2A62B" />
          <stop offset="100%" stopColor="#8F6C13" />
        </linearGradient>

        <linearGradient id="penBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9FAFB" />
          <stop offset="40%" stopColor="#E5E8ED" />
          <stop offset="100%" stopColor="#5E6D82" />
        </linearGradient>

        <linearGradient id="penGrip" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5F8CCC" />
          <stop offset="100%" stopColor="#2A5086" />
        </linearGradient>

        <linearGradient id="penNibGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEC55E" />
          <stop offset="60%" stopColor="#DCA61F" />
          <stop offset="100%" stopColor="#957116" />
        </linearGradient>

        <filter id="penShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#131A22" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Ambient Shadow */}
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />

      {/* Circular Disc with 4 Color Quadrants */}
      <g clipPath="url(#discClip)">
        <clipPath id="discClip">
          <circle cx="50" cy="48" r="40" />
        </clipPath>
        {/* Top-Left: Green */}
        <path d="M50 48L10 48A40 40 0 0 1 50 8Z" fill="url(#designRingGreen)" />
        {/* Top-Right: Blue */}
        <path d="M50 48L50 8A40 40 0 0 1 90 48Z" fill="url(#designRingBlue)" />
        {/* Bottom-Right: Coral/Pink */}
        <path d="M50 48L90 48A40 40 0 0 1 50 88Z" fill="url(#designRingCoral)" />
        {/* Bottom-Left: Yellow/Orange */}
        <path d="M50 48L50 88A40 40 0 0 1 10 48Z" fill="url(#designRingYellow)" />

        {/* Soft center overlay to blend segments */}
        <circle cx="50" cy="48" r="28" fill="#FFFFFF" opacity="0.15" />
      </g>

      {/* Top Gloss Overlay on Disc */}
      <ellipse cx="48" cy="26" rx="26" ry="12" fill="#FFFFFF" opacity="0.3" />

      {/* 3D Stylus / Fountain Pen Angled across badge */}
      <g filter="url(#penShadow)" transform="rotate(-40 50 48)">
        {/* Pen Back Cap */}
        <path d="M46 16H54V24H46Z" fill="#363E4A" rx="1.5" />

        {/* Pen Main Shaft */}
        <path d="M45 24H55V48H45Z" fill="url(#penBody)" />
        <rect x="49" y="24" width="2" height="24" fill="#FFFFFF" opacity="0.6" />

        {/* Grip Section */}
        <path d="M44 48H56V62H44Z" fill="url(#penGrip)" rx="2" />
        {/* Grip rings */}
        <line x1="45" y1="52" x2="55" y2="52" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
        <line x1="45" y1="57" x2="55" y2="57" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />

        {/* Golden Nib Base & Tip */}
        <path d="M45 62L50 78L55 62Z" fill="url(#penNibGold)" />
        <line x1="50" y1="62" x2="50" y2="73" stroke="#80641C" strokeWidth="1" />
        <circle cx="50" cy="67" r="1" fill="#80641C" />
        {/* Nib Tip Gleam */}
        <circle cx="50" cy="77" r="1.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * 3. Marketing 3D Icon:
 * 3D Megaphone with glossy red/coral body, cyan bell rim,
 * and bursting floating 3D social badges (YouTube ▶, Twitter/Email @, LinkedIn in).
 */
export const Marketing3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Megaphone Red Cone Gradient */}
        <linearGradient id="megaCone" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#E1B441" />
          <stop offset="45%" stopColor="#CB9F2E" />
          <stop offset="100%" stopColor="#8B6D21" />
        </linearGradient>

        <linearGradient id="megaBell" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6993CF" />
          <stop offset="100%" stopColor="#1F3A61" />
        </linearGradient>

        <linearGradient id="badgeRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DDB245" />
          <stop offset="100%" stopColor="#AE892B" />
        </linearGradient>

        <linearGradient id="badgeAmber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E7B638" />
          <stop offset="100%" stopColor="#BC8D18" />
        </linearGradient>

        <filter id="megaShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#111822" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Ambient Shadow */}
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />

      {/* 3D Floating Social Badges Bursting Out Top-Right */}
      {/* 1. YouTube/Video Badge (Top) */}
      <g filter="url(#megaShadow)">
        <rect x="58" y="10" width="22" height="17" rx="5" fill="url(#badgeRed)" />
        <path d="M66 14.5L74 18.5L66 22.5Z" fill="#FFFFFF" />
        <ellipse cx="69" cy="13" rx="7" ry="2" fill="#FFFFFF" opacity="0.4" />
      </g>

      {/* 2. Red/Orange Round @ Badge (Right) */}
      <g filter="url(#megaShadow)">
        <circle cx="83" cy="38" r="9" fill="url(#badgeRed)" />
        <text
          x="83"
          y="42"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          @
        </text>
      </g>

      {/* 3. Amber/Yellow "in" badge (Bottom-Right) */}
      <g filter="url(#megaShadow)">
        <circle cx="78" cy="58" r="7.5" fill="url(#badgeAmber)" />
        <text
          x="78"
          y="61.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          in
        </text>
      </g>

      {/* 3D Megaphone Structure */}
      <g filter="url(#megaShadow)">
        {/* Handle */}
        <path
          d="M34 52L29 68C28.5 70 30 72 32 72L36 72C38 72 39 70 38.5 68L35 55"
          fill="#363E4A"
        />
        <rect x="30" y="69" width="7" height="3" rx="1.5" fill="#5E6D82" />

        {/* Back Speaker Cap */}
        <ellipse cx="26" cy="46" rx="5" ry="11" fill="#455160" />
        <ellipse cx="25" cy="46" rx="3" ry="8" fill="#222932" />

        {/* Megaphone Cone Body */}
        <path
          d="M26 37L54 28V64L26 55Z"
          fill="url(#megaCone)"
        />

        {/* Top Highlight on Cone */}
        <path
          d="M26 38L54 29L54 35L26 42Z"
          fill="#FFFFFF"
          opacity="0.25"
        />

        {/* Front Bell / Rim (Cyan Gloss 3D Ellipse) */}
        <ellipse cx="54" cy="46" rx="6" ry="18" fill="url(#megaBell)" />
        <ellipse cx="53" cy="46" rx="3.5" ry="14" fill="#254675" />

        {/* Inner Sound Cone */}
        <ellipse cx="52" cy="46" rx="2" ry="7" fill="#1F3554" />
      </g>
    </svg>
  );
};

/**
 * 4. Fitness 3D Icon:
 * Vibrant cyan/turquoise 3D sphere with high-gloss specular shine
 * and a floating 3D metallic dumbbell in the center.
 */
export const Fitness3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Cyan 3D Sphere */}
        <radialGradient id="fitSphere" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#A6C0E3" />
          <stop offset="35%" stopColor="#305D9A" />
          <stop offset="75%" stopColor="#264877" />
          <stop offset="100%" stopColor="#1B293E" />
        </radialGradient>

        {/* Dumbbell Chrome Gradient */}
        <linearGradient id="dbChrome" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#EAEEF4" />
          <stop offset="100%" stopColor="#B5CAE8" />
        </linearGradient>

        <filter id="dbShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#132134" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Ambient Shadow */}
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />

      {/* Main Cyan Sphere */}
      <circle cx="50" cy="48" r="40" fill="url(#fitSphere)" />

      {/* Specular Highlight Crescent */}
      <ellipse cx="48" cy="24" rx="26" ry="12" fill="#FFFFFF" opacity="0.35" />

      {/* 3D Dumbbell (Angled at -25 degrees) */}
      <g filter="url(#dbShadow)" transform="rotate(-28 50 48)">
        {/* Connecting Bar */}
        <rect x="36" y="46" width="28" height="4" rx="2" fill="url(#dbChrome)" />
        {/* Bar texture/grip rings */}
        <line x1="48" y1="46" x2="48" y2="50" stroke="#2A5085" strokeWidth="1" />
        <line x1="52" y1="46" x2="52" y2="50" stroke="#2A5085" strokeWidth="1" />

        {/* Left Weights */}
        {/* Outer Plate */}
        <rect x="26" y="38" width="5" height="20" rx="2.5" fill="url(#dbChrome)" />
        {/* Inner Plate */}
        <rect x="32" y="41" width="4" height="14" rx="2" fill="url(#dbChrome)" />
        {/* Left End cap */}
        <ellipse cx="26" cy="48" rx="2" ry="7" fill="#FFFFFF" />

        {/* Right Weights */}
        {/* Inner Plate */}
        <rect x="64" y="41" width="4" height="14" rx="2" fill="url(#dbChrome)" />
        {/* Outer Plate */}
        <rect x="69" y="38" width="5" height="20" rx="2.5" fill="url(#dbChrome)" />
        {/* Right End cap */}
        <ellipse cx="74" cy="48" rx="2" ry="7" fill="#FFFFFF" />
      </g>

      {/* Subtle sparkle */}
      <circle cx="32" cy="30" r="1.5" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
};

/**
 * 5. Copywriting 3D Icon (Violet/Purple Sphere with Golden Quill & Glowing Sheet)
 */
export const Copywriting3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="copySphere" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#8EAEDB" />
          <stop offset="35%" stopColor="#4D7CBF" />
          <stop offset="75%" stopColor="#4269A0" />
          <stop offset="100%" stopColor="#192E4C" />
        </radialGradient>
        <filter id="copyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#20334E" floodOpacity="0.7" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />
      <circle cx="50" cy="48" r="40" fill="url(#copySphere)" />
      <ellipse cx="48" cy="24" rx="26" ry="12" fill="#FFFFFF" opacity="0.32" />

      {/* Floating 3D Page + Gold Pen */}
      <g filter="url(#copyShadow)">
        {/* Document Sheet */}
        <rect x="30" y="32" width="26" height="34" rx="3" fill="#FFFFFF" />
        <line x1="35" y1="40" x2="49" y2="40" stroke="#4D7CBF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="46" x2="51" y2="46" stroke="#8EAEDB" strokeWidth="2" strokeLinecap="round" />
        <line x1="35" y1="52" x2="47" y2="52" stroke="#8EAEDB" strokeWidth="2" strokeLinecap="round" />

        {/* Angled Golden Fountain Pen */}
        <g transform="rotate(-30 58 48)">
          <path d="M55 24H61V44H55Z" fill="#E6B22C" />
          <path d="M54 44H62L58 56Z" fill="#DCA61F" />
          <line x1="58" y1="44" x2="58" y2="52" stroke="#80641C" strokeWidth="1" />
          <circle cx="58" cy="55" r="1" fill="#FFFFFF" />
        </g>
      </g>
    </svg>
  );
};

/**
 * 6. SEO & Growth 3D Icon (Emerald Sphere with 3D Magnifying Glass & Rising Bar Chart)
 */
export const SEO3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="seoSphere" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#F2DA9B" />
          <stop offset="35%" stopColor="#D8B33C" />
          <stop offset="75%" stopColor="#B8901D" />
          <stop offset="100%" stopColor="#7A5C0F" />
        </radialGradient>
        <filter id="seoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#4C3A0B" floodOpacity="0.7" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />
      <circle cx="50" cy="48" r="40" fill="url(#seoSphere)" />
      <ellipse cx="48" cy="24" rx="26" ry="12" fill="#FFFFFF" opacity="0.32" />

      {/* 3D Magnifying Lens & Rising Graph */}
      <g filter="url(#seoShadow)">
        {/* Rising Growth Bars inside */}
        <rect x="36" y="50" width="5" height="10" rx="1.5" fill="#FFFFFF" opacity="0.8" />
        <rect x="44" y="44" width="5" height="16" rx="1.5" fill="#FFFFFF" opacity="0.9" />
        <rect x="52" y="38" width="5" height="22" rx="1.5" fill="#FFFFFF" />

        {/* 3D Magnifying Glass */}
        <circle cx="48" cy="46" r="16" stroke="#FFFFFF" strokeWidth="4" fill="#FFFFFF" fillOpacity="0.1" />
        <ellipse cx="45" cy="38" rx="8" ry="3" fill="#FFFFFF" opacity="0.4" />
        {/* Handle */}
        <path d="M59 57L71 69" stroke="#EBBC45" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/**
 * 7. Social Media 3D Icon (Ruby/Pink Sphere with 3D Heart & Speech Bubble)
 */
export const Social3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="socSphere" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#EBC564" />
          <stop offset="35%" stopColor="#E1B441" />
          <stop offset="75%" stopColor="#CB9F2E" />
          <stop offset="100%" stopColor="#8B6D21" />
        </radialGradient>
        <filter id="socShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#624B10" floodOpacity="0.7" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />
      <circle cx="50" cy="48" r="40" fill="url(#socSphere)" />
      <ellipse cx="48" cy="24" rx="26" ry="12" fill="#FFFFFF" opacity="0.32" />
      <g filter="url(#socShadow)">
        {/* Chat bubble */}
        <path
          d="M32 34H68C72 34 75 37 75 41V55C75 59 72 62 68 62H46L36 70V62H32C28 62 25 59 25 55V41C25 37 28 34 32 34Z"
          fill="#FFFFFF"
        />
        {/* Heart icon inside bubble */}
        <path
          d="M50 54L48 52C41 46 38 43 38 39C38 36 40 34 43 34C45 34 47 35 48 37C49 35 51 34 53 34C56 34 58 36 58 39C58 43 55 46 48 52L50 54Z"
          fill="#CB9F2E"
          transform="translate(2, 6) scale(0.9)"
        />
      </g>
    </svg>
  );
};

/**
 * 8. Strategy 3D Icon (Gold/Amber Sphere with 3D Compass & Target)
 */
export const Strategy3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="stratSphere" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#EDC256" />
          <stop offset="35%" stopColor="#E0A920" />
          <stop offset="75%" stopColor="#C69419" />
          <stop offset="100%" stopColor="#6F5718" />
        </radialGradient>
        <filter id="stratShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#5E470D" floodOpacity="0.7" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />
      <circle cx="50" cy="48" r="40" fill="url(#stratSphere)" />
      <ellipse cx="48" cy="24" rx="26" ry="12" fill="#FFFFFF" opacity="0.32" />
      <g filter="url(#stratShadow)">
        <circle cx="50" cy="48" r="20" stroke="#FFFFFF" strokeWidth="4" fill="#80641C" fillOpacity="0.2" />
        <circle cx="50" cy="48" r="12" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="3 3" />
        {/* Compass needle */}
        <polygon points="50,30 55,48 50,45 45,48" fill="#DDB245" />
        <polygon points="50,66 55,48 50,51 45,48" fill="#FFFFFF" />
        <circle cx="50" cy="48" r="3" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * 9. Analytics 3D Icon (Indigo/Blue Sphere with 3D Rocket & Growth Chart)
 */
export const Analytics3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="anaSphere" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#89AADA" />
          <stop offset="35%" stopColor="#7298CE" />
          <stop offset="75%" stopColor="#5A84BF" />
          <stop offset="100%" stopColor="#232E3D" />
        </radialGradient>
        <filter id="anaShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#232E3D" floodOpacity="0.7" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />
      <circle cx="50" cy="48" r="40" fill="url(#anaSphere)" />
      <ellipse cx="48" cy="24" rx="26" ry="12" fill="#FFFFFF" opacity="0.32" />
      <g filter="url(#anaShadow)">
        {/* Upward 3D Trending Arrow */}
        <path
          d="M30 62L46 46L56 54L72 34"
          stroke="#5585C9"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M60 34H72V46" stroke="#5585C9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="72" cy="34" r="3" fill="#FFFFFF" />
        {/* Base Grid line */}
        <line x1="28" y1="68" x2="72" y2="68" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      </g>
    </svg>
  );
};

/**
 * 10. Email 3D Icon (Orange Sphere with 3D Flying Envelope)
 */
export const Email3DIcon: React.FC<IconProps> = ({ className = '', size = 84 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="mailSphere" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#E8B83E" />
          <stop offset="35%" stopColor="#E4AD23" />
          <stop offset="75%" stopColor="#D3A020" />
          <stop offset="100%" stopColor="#82661F" />
        </radialGradient>
        <filter id="mailShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#5B4612" floodOpacity="0.7" />
        </filter>
      </defs>
      <ellipse cx="50" cy="91" rx="34" ry="7" fill="#080C12" opacity="0.45" />
      <circle cx="50" cy="48" r="40" fill="url(#mailSphere)" />
      <ellipse cx="48" cy="24" rx="26" ry="12" fill="#FFFFFF" opacity="0.32" />
      <g filter="url(#mailShadow)" transform="rotate(-10 50 48)">
        <rect x="26" y="34" width="48" height="32" rx="5" fill="#FFFFFF" />
        <path d="M28 36L50 52L72 36" stroke="#E4AD23" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="28" y1="64" x2="42" y2="50" stroke="#C1C8D2" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="72" y1="64" x2="58" y2="50" stroke="#C1C8D2" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
};


import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
}) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-gray-900' : 'text-white';
  const bracketColor = isDark ? 'text-gray-400' : 'text-gray-500';

  const dimensions = {
    sm: { icon: 'w-7 h-7', text: 'text-xs', markH: 26 },
    md: { icon: 'w-9 h-9', text: 'text-sm', markH: 32 },
    lg: { icon: 'w-11 h-11', text: 'text-base', markH: 40 },
  };

  return (
    <div className={`flex flex-col items-center select-none cursor-pointer ${className}`}>
      {/* Golden-Yellow Hexagon Monogram Emblem from Reference */}
      <svg
        className={`${dimensions[size].icon} text-[#F59E0B]`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Hexagon outline with subtle rounded vertices */}
        <path
          d="M20 3L35 11.66V28.34L20 37L5 28.34V11.66L20 3Z"
          stroke="#F59E0B"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Inner geometric H / fold mark */}
        <path
          d="M14 13V27M26 13V27M14 20H26"
          stroke="#F59E0B"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Wordmark with reference bracket accents */}
      <div className="flex items-center gap-0.5 mt-0.5 leading-none">
        <span className={`text-[10px] font-mono font-medium ${bracketColor}`}>[</span>
        <span
          className={`font-sans font-black tracking-widest uppercase ${textColor} ${dimensions[size].text}`}
          style={{ letterSpacing: '0.18em' }}
        >
          AWRAQ
        </span>
        <span className={`text-[10px] font-mono font-medium ${bracketColor}`}>]</span>
      </div>
    </div>
  );
};

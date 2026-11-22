import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface BrandLogoProps {
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  themeMode?: 'auto' | 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  themeMode = 'auto',
}) => {
  const { theme } = useTheme();
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && theme === 'dark');

  const heightClass = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  }[size];

  // Official TecHisab Square Mark: top blue "Tech", bottom "হিসাব", Bangla tagline
  const renderBadgeIcon = (withTagline = false) => (
    <div
      className={`relative ${heightClass} ${
        withTagline ? 'aspect-[120/135]' : 'aspect-square'
      } shrink-0 inline-flex items-center justify-center select-none`}
    >
      <svg
        viewBox={withTagline ? '0 0 120 135' : '0 0 120 116'}
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g id="badge-container">
          <path
            d="M 12 10 L 108 10 A 5 5 0 0 1 112 15 L 112 58 L 8 58 L 8 15 A 5 5 0 0 1 12 10 Z"
            fill="#0055A5"
          />
          <text
            x="60"
            y="46"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize="37"
            letterSpacing="-0.5px"
          >
            Tech
          </text>

          <path
            d="M 8 58 L 112 58 L 112 106 A 5 5 0 0 1 108 110 L 12 110 A 5 5 0 0 1 8 106 Z"
            fill={isDark ? '#0F172A' : '#FFFFFF'}
            stroke="#0055A5"
            strokeWidth="3.5"
          />
          <text
            x="60"
            y="95"
            textAnchor="middle"
            fill={isDark ? '#F8FAFC' : '#000000'}
            fontFamily="'Hind Siliguri', 'Noto Sans Bengali', sans-serif"
            fontWeight="800"
            fontSize="33"
          >
            হিসাব
          </text>
        </g>

        {withTagline && (
          <text
            x="60"
            y="128"
            textAnchor="middle"
            fontFamily="'Hind Siliguri', 'Noto Sans Bengali', sans-serif"
            fontWeight="700"
            fontSize="13.5"
          >
            <tspan fill={isDark ? '#E2E8F0' : '#000000'}>কাজকে </tspan>
            <tspan fill={isDark ? '#38BDF8' : '#0055A5'}>সহজ </tspan>
            <tspan fill={isDark ? '#E2E8F0' : '#000000'}>করুন</tspan>
          </text>
        )}
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} id="brand-logo-mark">
        {renderBadgeIcon(true)}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} id="brand-logo-full">
      {renderBadgeIcon(false)}

      <div className="flex flex-col justify-center leading-tight select-none">
        <div className="flex items-baseline">
          <span
            className={`font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-[#0B1730]'
            } ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'}`}
          >
            Tec<span className={isDark ? 'text-sky-400' : 'text-[#0345A4]'}>Hisab</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`font-bangla font-semibold text-xs tracking-wide ${
              isDark ? 'text-slate-300' : 'text-[#5F6D82]'
            }`}
          >
            কাজকে সহজ করুন
          </span>
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase hidden sm:inline ${
              isDark ? 'text-slate-400' : 'text-[#5F6D82]/80'
            }`}
          >
            • ITES &amp; FINTEC
          </span>
        </div>
      </div>
    </div>
  );
};

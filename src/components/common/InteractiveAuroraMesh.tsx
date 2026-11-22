import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface InteractiveAuroraMeshProps {
  className?: string;
  showConstellation?: boolean;
}

/**
 * Animated abstract geometric & flowing backdrop for hero and spotlight sections.
 * Compositor-only animations that automatically disable under prefers-reduced-motion.
 */
export const InteractiveAuroraMesh: React.FC<InteractiveAuroraMeshProps> = ({
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Drifting Gradient Light Fields */}
      <div
        className="animate-aurora-drift absolute -top-28 left-[18%] w-[540px] h-[540px] rounded-full blur-[110px] opacity-65 dark:opacity-35"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(10,99,216,0.36) 0%, rgba(2,55,127,0.18) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(10,99,216,0.16) 0%, rgba(215,226,243,0.45) 60%, transparent 80%)',
        }}
      />
      <div
        className="animate-aurora-drift-reverse absolute top-14 right-4 w-[440px] h-[440px] rounded-full blur-[100px] opacity-55 dark:opacity-30"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(56,189,248,0.24) 0%, transparent 72%)'
            : 'radial-gradient(circle, rgba(3,69,164,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Abstract Architectural SVG Composition */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroAbstractGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#38BDF8' : '#0A63D8'} stopOpacity={isDark ? '0.18' : '0.14'} />
            <stop offset="100%" stopColor={isDark ? '#0345A4' : '#02377F'} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="heroRibbonFill" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={isDark ? '#0A63D8' : '#0345A4'} stopOpacity="0" />
            <stop offset="50%" stopColor={isDark ? '#38BDF8' : '#0A63D8'} stopOpacity={isDark ? '0.09' : '0.06'} />
            <stop offset="100%" stopColor={isDark ? '#0A63D8' : '#0345A4'} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sculpted Organic Abstract Ribbon */}
        <path
          d="M-80 510 C 260 390, 560 580, 920 430 C 1180 320, 1340 410, 1520 340 L 1520 470 C 1300 540, 1140 450, 900 560 C 560 700, 240 520, -80 620 Z"
          fill="url(#heroRibbonFill)"
          className="animate-abstract-float"
        />

        {/* Animated Dashed Flow Curves */}
        <path
          d="M-40 160 C 310 260, 620 60, 980 180 C 1220 260, 1360 170, 1490 120"
          stroke={isDark ? '#38BDF8' : '#0A63D8'}
          strokeOpacity={isDark ? '0.2' : '0.16'}
          strokeWidth="1.5"
          strokeDasharray="12 10"
          className="animate-abstract-dash"
        />
        <path
          d="M-40 560 C 280 450, 640 640, 1020 490 C 1240 400, 1380 480, 1500 420"
          stroke={isDark ? '#0A63D8' : '#0345A4'}
          strokeOpacity={isDark ? '0.28' : '0.16'}
          strokeWidth="1.5"
          strokeDasharray="8 14"
          className="animate-abstract-dash"
        />

        {/* Orbital Rings Behind Right Hero Showcase */}
        <g transform="translate(1080, 355)">
          <g className="animate-abstract-orbit">
            <circle
              r="285"
              stroke={isDark ? '#38BDF8' : '#0A63D8'}
              strokeOpacity={isDark ? '0.16' : '0.12'}
              strokeWidth="1.25"
              strokeDasharray="16 14"
            />
            <circle
              cx="285"
              cy="0"
              r="4.5"
              fill={isDark ? '#38BDF8' : '#0A63D8'}
              fillOpacity="0.4"
            />
          </g>
          <g className="animate-abstract-orbit-reverse">
            <circle
              r="215"
              stroke={isDark ? '#0A63D8' : '#0345A4'}
              strokeOpacity={isDark ? '0.24' : '0.14'}
              strokeWidth="1"
              strokeDasharray="5 9"
            />
            <rect
              x="-150"
              y="-150"
              width="300"
              height="300"
              rx="38"
              stroke="url(#heroAbstractGradA)"
              strokeWidth="1.5"
              transform="rotate(18)"
            />
          </g>
        </g>

        {/* Floating Abstract Polygonal Shards */}
        <g className="animate-abstract-float-delayed">
          <rect
            x="92"
            y="435"
            width="92"
            height="92"
            rx="22"
            transform="rotate(24 138 481)"
            stroke={isDark ? '#38BDF8' : '#0345A4'}
            strokeOpacity={isDark ? '0.18' : '0.14'}
            strokeWidth="1.4"
            fill={isDark ? '#0A63D8' : '#0A63D8'}
            fillOpacity={isDark ? '0.07' : '0.03'}
          />
        </g>
        <g className="animate-abstract-float">
          <circle
            cx="650"
            cy="128"
            r="34"
            stroke={isDark ? '#38BDF8' : '#0A63D8'}
            strokeOpacity={isDark ? '0.2' : '0.14'}
            strokeWidth="1.25"
            fill="none"
          />
          <circle
            cx="650"
            cy="128"
            r="6"
            fill={isDark ? '#38BDF8' : '#0345A4'}
            fillOpacity={isDark ? '0.3' : '0.18'}
          />
        </g>
      </svg>
    </div>
  );
};

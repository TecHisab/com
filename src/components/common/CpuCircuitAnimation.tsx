import React from 'react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface CpuCircuitAnimationProps {
  activeChannel?: number | null;
  onSelectChannel?: (index: number) => void;
  className?: string;
}

interface TraceRoute {
  id: number;
  d: string;
  endX: number;
  endY: number;
  labelEn: string;
  labelBn: string;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'end' | 'middle';
  speedClass: string;
}

const TRACE_ROUTES: TraceRoute[] = [
  {
    id: 0,
    d: 'M 218 112 L 165 112 L 135 82 L 72 82 L 54 64',
    endX: 54,
    endY: 64,
    labelEn: 'Accounting',
    labelBn: 'অ্যাকাউন্টিং',
    labelX: 54,
    labelY: 46,
    anchor: 'middle',
    speedClass: 'animate-circuit-pulse',
  },
  {
    id: 1,
    d: 'M 218 140 L 138 140 L 114 156 L 44 156',
    endX: 44,
    endY: 156,
    labelEn: 'Tax & VAT',
    labelBn: 'ট্যাক্স ও ভ্যাট',
    labelX: 44,
    labelY: 139,
    anchor: 'start',
    speedClass: 'animate-circuit-pulse-delayed',
  },
  {
    id: 2,
    d: 'M 218 168 L 164 168 L 130 202 L 74 202 L 56 220',
    endX: 56,
    endY: 220,
    labelEn: 'Payroll',
    labelBn: 'পেরোল',
    labelX: 56,
    labelY: 242,
    anchor: 'middle',
    speedClass: 'animate-circuit-pulse-slow',
  },
  {
    id: 3,
    d: 'M 302 112 L 355 112 L 385 82 L 448 82 L 466 64',
    endX: 466,
    endY: 64,
    labelEn: 'MIS Reports',
    labelBn: 'এমআইএস',
    labelX: 466,
    labelY: 46,
    anchor: 'middle',
    speedClass: 'animate-circuit-pulse-delayed',
  },
  {
    id: 4,
    d: 'M 302 140 L 382 140 L 406 156 L 476 156',
    endX: 476,
    endY: 156,
    labelEn: 'BPO Ops',
    labelBn: 'বিপিও',
    labelX: 476,
    labelY: 139,
    anchor: 'end',
    speedClass: 'animate-circuit-pulse',
  },
  {
    id: 5,
    d: 'M 302 168 L 356 168 L 390 202 L 446 202 L 464 220',
    endX: 464,
    endY: 220,
    labelEn: 'Software',
    labelBn: 'সফটওয়্যার',
    labelX: 464,
    labelY: 242,
    anchor: 'middle',
    speedClass: 'animate-circuit-pulse-slow',
  },
];

const SECONDARY_TRACES: string[] = [
  'M 236 98 L 236 52 L 212 28 L 154 28',
  'M 260 98 L 260 38 L 284 14',
  'M 284 98 L 284 52 L 310 28 L 372 28',
  'M 236 182 L 236 226 L 210 252 L 146 252',
  'M 260 182 L 260 242 L 236 266',
  'M 284 182 L 284 226 L 312 252 L 380 252',
  'M 218 126 L 175 126 L 158 109 L 116 109',
  'M 302 126 L 345 126 L 362 109 L 404 109',
  'M 218 154 L 174 154 L 154 174 L 110 174',
  'M 302 154 L 346 154 L 366 174 L 410 174',
];

export const CpuCircuitAnimation: React.FC<CpuCircuitAnimationProps> = ({
  activeChannel = null,
  onSelectChannel,
  className = '',
}) => {
  const { pick } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative w-full select-none ${className}`}>
      <svg
        viewBox="0 0 520 280"
        className="w-full h-auto block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={pick(
          'Animated CPU processor and circuit board connecting TecHisab modules',
          'টেকহিসাবের মডিউলসমূহ সংযুক্তকারী অ্যানিমেটেড সিপিইউ চিপ ও সার্কিট ডায়াগ্রাম'
        )}
      >
        <defs>
          <radialGradient id="cpuCoreRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#0A63D8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#02377F" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="cpuDieSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A63D8" />
            <stop offset="100%" stopColor="#02285E" />
          </linearGradient>

          <linearGradient id="tracePulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#0A63D8" />
          </linearGradient>

          <filter id="circuitGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle PCB Micro-Grid */}
        <g opacity="0.16" stroke="#7DD3FC" strokeWidth="0.6">
          <path d="M 20 40 H 500 M 20 90 H 500 M 20 140 H 500 M 20 190 H 500 M 20 240 H 500" strokeDasharray="3 9" />
          <path d="M 80 12 V 268 M 170 12 V 268 M 260 12 V 268 M 350 12 V 268 M 440 12 V 268" strokeDasharray="3 9" />
        </g>

        {/* Ambient CPU Glow Halo */}
        <circle
          cx="260"
          cy="140"
          r="98"
          fill="url(#cpuCoreRadial)"
          className={prefersReducedMotion ? '' : 'animate-cpu-core'}
        />

        {/* Secondary Background PCB Traces */}
        {SECONDARY_TRACES.map((path, idx) => (
          <g key={path}>
            <path
              d={path}
              stroke="#38BDF8"
              strokeOpacity="0.22"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {!prefersReducedMotion && (
              <path
                d={path}
                stroke="#7DD3FC"
                strokeOpacity="0.55"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="16 96"
                className={idx % 2 === 0 ? 'animate-circuit-pulse-slow' : 'animate-circuit-pulse-delayed'}
              />
            )}
          </g>
        ))}

        {/* Primary Module Traces Connected to CPU Pins */}
        {TRACE_ROUTES.map((route) => {
          const isFocused = activeChannel === route.id;
          return (
            <g
              key={route.id}
              className={onSelectChannel ? 'cursor-pointer' : ''}
              onClick={() => onSelectChannel?.(route.id)}
            >
              {/* Static Copper/Blue Base Trace */}
              <path
                d={route.d}
                stroke={isFocused ? '#BAE6FD' : '#38BDF8'}
                strokeOpacity={isFocused ? 0.9 : 0.34}
                strokeWidth={isFocused ? 2.6 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Traveling Electrical Signal Pulse */}
              {!prefersReducedMotion && (
                <path
                  d={route.d}
                  stroke="url(#tracePulseGrad)"
                  strokeWidth={isFocused ? 3 : 2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="24 96"
                  filter="url(#circuitGlow)"
                  className={route.speedClass}
                />
              )}

              {/* PCB Via Terminal Pad */}
              <circle
                cx={route.endX}
                cy={route.endY}
                r={isFocused ? 7.5 : 6}
                fill="#02377F"
                stroke={isFocused ? '#FFFFFF' : '#7DD3FC'}
                strokeWidth="2"
              />
              <circle
                cx={route.endX}
                cy={route.endY}
                r="2.4"
                fill={isFocused ? '#FFFFFF' : '#38BDF8'}
              />

              {/* Terminal Label */}
              <text
                x={route.labelX}
                y={route.labelY}
                textAnchor={route.anchor}
                fill={isFocused ? '#FFFFFF' : '#BAE6FD'}
                fontSize="11"
                fontWeight={isFocused ? '700' : '600'}
                fontFamily="'Plus Jakarta Sans', 'Hind Siliguri', sans-serif"
              >
                {pick(route.labelEn, route.labelBn)}
              </text>
            </g>
          );
        })}

        {/* Central CPU Chip Socket & Pins */}
        <g>
          {/* Left & Right IC Pins */}
          {[112, 126, 140, 154, 168].map((y) => (
            <g key={`lr-${y}`}>
              <rect x="208" y={y - 2} width="10" height="4" rx="1" fill="#7DD3FC" fillOpacity="0.85" />
              <rect x="302" y={y - 2} width="10" height="4" rx="1" fill="#7DD3FC" fillOpacity="0.85" />
            </g>
          ))}

          {/* Top & Bottom IC Pins */}
          {[236, 248, 260, 272, 284].map((x) => (
            <g key={`tb-${x}`}>
              <rect x={x - 2} y="88" width="4" height="10" rx="1" fill="#7DD3FC" fillOpacity="0.85" />
              <rect x={x - 2} y="182" width="4" height="10" rx="1" fill="#7DD3FC" fillOpacity="0.85" />
            </g>
          ))}

          {/* Outer CPU Substrate Package */}
          <rect
            x="218"
            y="98"
            width="84"
            height="84"
            rx="12"
            fill="#02285E"
            stroke="#38BDF8"
            strokeWidth="2"
          />

          {/* Inner Metallic Heat-Spreader / Silicon Die */}
          <rect
            x="229"
            y="109"
            width="62"
            height="62"
            rx="8"
            fill="url(#cpuDieSurface)"
            stroke="#BAE6FD"
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />

          {/* Internal Die Circuit Grid Lines */}
          <g stroke="#7DD3FC" strokeOpacity="0.32" strokeWidth="1">
            <path d="M 239 124 H 281 M 239 156 H 281 M 244 119 V 161 M 276 119 V 161" />
          </g>

          {/* Pin-1 Corner Chamfer Dot */}
          <circle cx="235" cy="115" r="2" fill="#BAE6FD" />

          {/* Center Core Label */}
          <text
            x="260"
            y="138"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="800"
            letterSpacing="0.06em"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            TECHISAB
          </text>
          <text
            x="260"
            y="151"
            textAnchor="middle"
            fill="#BAE6FD"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.14em"
            fontFamily="'JetBrains Mono', monospace"
          >
            CORE
          </text>
        </g>
      </svg>
    </div>
  );
};

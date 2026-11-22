import React from 'react';

interface CosmicSkyBackgroundProps {
  className?: string;
}

/**
 * Animated abstract geometric & flowing vector background tailored to TecHisab's blue palette.
 * Uses GPU compositor animations only and honors prefers-reduced-motion via CSS.
 */
export const CosmicSkyBackground: React.FC<CosmicSkyBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Base Corporate Surface + Subtle Grid */}
      <div className="absolute inset-0 bg-[#F4F8FF] dark:bg-slate-950 bg-corporate-grid" />

      {/* Drifting Soft Radial Washes */}
      <div
        className="animate-aurora-drift absolute -top-44 right-[-10%] w-[620px] h-[620px] rounded-full opacity-55 dark:opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(10,99,216,0.20) 0%, rgba(3,69,164,0.07) 55%, transparent 75%)',
        }}
      />
      <div
        className="animate-aurora-drift-reverse absolute bottom-[-16%] left-[-8%] w-[540px] h-[540px] rounded-full opacity-45 dark:opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(3,69,164,0.16) 0%, rgba(56,189,248,0.06) 55%, transparent 72%)',
        }}
      />
      <div
        className="animate-aurora-drift absolute top-[38%] left-[42%] w-[420px] h-[420px] rounded-full opacity-30 dark:opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(10,99,216,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Full-Viewport Animated Abstract SVG Geometry */}
      <svg
        className="absolute inset-0 w-full h-full opacity-75 dark:opacity-55"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="abstractRibbonBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A63D8" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#0345A4" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="abstractRibbonSoft" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0345A4" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0A63D8" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Flowing Abstract Wave Splines */}
        <path
          d="M-80 220 C 240 120, 480 340, 820 210 C 1100 100, 1280 240, 1520 150"
          stroke="url(#abstractRibbonBlue)"
          strokeWidth="1.75"
          strokeDasharray="14 10"
          className="animate-abstract-dash"
        />
        <path
          d="M-60 660 C 260 540, 540 760, 890 610 C 1160 495, 1320 630, 1520 550"
          stroke="url(#abstractRibbonBlue)"
          strokeWidth="1.5"
          strokeDasharray="10 14"
          className="animate-abstract-dash"
        />
        <path
          d="M-100 440 C 210 380, 510 490, 790 420 C 1070 350, 1260 460, 1540 390"
          stroke="url(#abstractRibbonSoft)"
          strokeWidth="1.25"
        />

        {/* Top-Right Rotating Concentric Geometric Rings */}
        <g transform="translate(1220, 170)">
          <g className="animate-abstract-orbit">
            <circle
              r="210"
              stroke="#0A63D8"
              strokeOpacity="0.12"
              strokeWidth="1.25"
              strokeDasharray="18 14"
            />
            <circle
              cx="210"
              cy="0"
              r="4"
              fill="#0A63D8"
              fillOpacity="0.28"
            />
          </g>
          <g className="animate-abstract-orbit-reverse">
            <circle
              r="148"
              stroke="#0345A4"
              strokeOpacity="0.14"
              strokeWidth="1"
              strokeDasharray="6 10"
            />
            <rect
              x="-105"
              y="-105"
              width="210"
              height="210"
              rx="28"
              stroke="#0A63D8"
              strokeOpacity="0.09"
              strokeWidth="1"
              transform="rotate(24)"
            />
          </g>
        </g>

        {/* Bottom-Left Rotating Orbital Rings & Rounded Polygon */}
        <g transform="translate(180, 740)">
          <g className="animate-abstract-orbit-reverse">
            <circle
              r="190"
              stroke="#0345A4"
              strokeOpacity="0.11"
              strokeWidth="1.25"
              strokeDasharray="12 16"
            />
            <circle
              cx="-190"
              cy="0"
              r="3.5"
              fill="#38BDF8"
              fillOpacity="0.35"
            />
          </g>
          <g className="animate-abstract-orbit">
            <polygon
              points="0,-120 104,60 -104,60"
              stroke="#0A63D8"
              strokeOpacity="0.09"
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        </g>

        {/* Floating Minimal Geometric Accents */}
        <g className="animate-abstract-float">
          <rect
            x="110"
            y="165"
            width="68"
            height="68"
            rx="16"
            transform="rotate(18 144 199)"
            stroke="#0345A4"
            strokeOpacity="0.15"
            strokeWidth="1.4"
            fill="#0A63D8"
            fillOpacity="0.03"
          />
        </g>

        <g className="animate-abstract-float-delayed">
          <rect
            x="1180"
            y="620"
            width="84"
            height="84"
            rx="20"
            transform="rotate(-22 1222 662)"
            stroke="#0A63D8"
            strokeOpacity="0.14"
            strokeWidth="1.4"
            fill="#38BDF8"
            fillOpacity="0.035"
          />
        </g>

        {/* Subtle Architectural Plus Marks & PCB Circuit Traces */}
        <g stroke="#0A63D8" strokeOpacity="0.14" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 40 310 H 190 L 224 276 H 380" />
          <path d="M 1400 470 H 1240 L 1202 508 H 1040" />
          <circle cx="380" cy="276" r="3.5" fill="#0A63D8" fillOpacity="0.18" />
          <circle cx="1040" cy="508" r="3.5" fill="#38BDF8" fillOpacity="0.22" />
        </g>
        <g stroke="#38BDF8" strokeOpacity="0.26" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="16 110" className="animate-circuit-pulse-slow">
          <path d="M 40 310 H 190 L 224 276 H 380" />
          <path d="M 1400 470 H 1240 L 1202 508 H 1040" />
        </g>

        <g className="animate-abstract-float" stroke="#0345A4" strokeOpacity="0.22" strokeWidth="1.4" strokeLinecap="round">
          <path d="M520 130 V142 M514 136 H526" />
          <path d="M960 760 V772 M954 766 H966" />
        </g>
        <g className="animate-abstract-float-delayed" stroke="#0A63D8" strokeOpacity="0.20" strokeWidth="1.4" strokeLinecap="round">
          <path d="M840 310 V320 M835 315 H845" />
          <path d="M310 510 V520 M305 515 H315" />
        </g>
      </svg>
    </div>
  );
};

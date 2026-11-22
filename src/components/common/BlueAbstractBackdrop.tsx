import React, { useId } from 'react';

interface BlueAbstractBackdropProps {
  variant?: 'footer' | 'banner';
}

/**
 * Layered animated abstract geometric & atmospheric wave design
 * for TecHisab's deep-blue ending sections (Footer & CTA Banner).
 */
export const BlueAbstractBackdrop: React.FC<BlueAbstractBackdropProps> = ({
  variant = 'footer',
}) => {
  const isFooter = variant === 'footer';
  const uid = useId().replace(/:/g, '');
  const ribbonAId = `blueRibbonA-${variant}-${uid}`;
  const ribbonBId = `blueRibbonB-${variant}-${uid}`;
  const facetId = `blueFacet-${variant}-${uid}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Rich multi-layered deep blue gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: isFooter
            ? 'linear-gradient(145deg, #022050 0%, #02377F 48%, #0345A4 100%)'
            : 'linear-gradient(135deg, #0345A4 0%, #02377F 55%, #01255C 100%)',
        }}
      />

      {/* Soft volumetric radial light blooms */}
      <div
        className="animate-aurora-drift absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full opacity-55 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(56,189,248,0.24) 0%, rgba(10,99,216,0.12) 48%, transparent 72%)',
        }}
      />
      <div
        className="animate-aurora-drift-reverse absolute -bottom-36 -right-20 w-[480px] h-[480px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(14,165,233,0.22) 0%, rgba(3,69,164,0.14) 52%, transparent 74%)',
        }}
      />
      {isFooter && (
        <div
          className="animate-aurora-drift absolute top-1/3 left-1/2 -translate-x-1/2 w-[560px] h-[280px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse, rgba(125,211,252,0.18) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Subtle architectural perspective dot-grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(186,230,253,0.35) 1px, transparent 0)',
          backgroundSize: isFooter ? '28px 28px' : '22px 22px',
          maskImage:
            'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.95) 20%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.95) 20%, transparent 85%)',
        }}
      />

      {/* Vector Abstract Ribbons, Orbital Geometry & Faceted Accents */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={isFooter ? '0 0 1440 620' : '0 0 1200 380'}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={ribbonAId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="35%" stopColor="#7DD3FC" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0A63D8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={ribbonBId} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.26" />
            <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#02377F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={facetId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0A63D8" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {isFooter ? (
          <>
            {/* Top Sculpted Horizon Ribbon */}
            <path
              d="M-60 95 C 260 20, 520 175, 860 90 C 1120 25, 1300 120, 1500 55"
              stroke={`url(#${ribbonAId})`}
              strokeWidth="2"
            />
            <path
              d="M-80 125 C 240 55, 510 210, 870 120 C 1140 50, 1310 155, 1520 85"
              stroke={`url(#${ribbonAId})`}
              strokeWidth="1.2"
              strokeDasharray="12 10"
              className="animate-abstract-dash"
            />

            {/* Bottom Sweeping Wave Arcs */}
            <path
              d="M-40 520 C 280 420, 560 585, 920 465 C 1170 385, 1320 490, 1500 425 L 1500 640 L -40 640 Z"
              fill={`url(#${facetId})`}
              opacity="0.45"
            />
            <path
              d="M-40 495 C 290 390, 580 565, 940 445 C 1185 365, 1330 475, 1500 410"
              stroke={`url(#${ribbonBId})`}
              strokeWidth="1.6"
              strokeDasharray="14 12"
              className="animate-abstract-dash"
            />

            {/* Right-Side Rotating Concentric Architectural Rings */}
            <g transform="translate(1290, 155)">
              <g className="animate-abstract-orbit">
                <circle
                  r="175"
                  stroke="#7DD3FC"
                  strokeOpacity="0.16"
                  strokeWidth="1.25"
                  strokeDasharray="16 12"
                />
                <circle cx="175" cy="0" r="4" fill="#7DD3FC" fillOpacity="0.5" />
              </g>
              <g className="animate-abstract-orbit-reverse">
                <circle
                  r="122"
                  stroke="#BAE6FD"
                  strokeOpacity="0.14"
                  strokeWidth="1"
                  strokeDasharray="5 9"
                />
                <polygon
                  points="0,-96 83,48 -83,48"
                  stroke="#7DD3FC"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                  fill="none"
                />
              </g>
            </g>

            {/* Left-Side Concentric Orbital Ring & Polygon */}
            <g transform="translate(130, 470)">
              <g className="animate-abstract-orbit-reverse">
                <circle
                  r="155"
                  stroke="#38BDF8"
                  strokeOpacity="0.15"
                  strokeWidth="1.2"
                  strokeDasharray="10 14"
                />
                <circle cx="-155" cy="0" r="3.5" fill="#BAE6FD" fillOpacity="0.55" />
              </g>
              <g className="animate-abstract-orbit">
                <rect
                  x="-74"
                  y="-74"
                  width="148"
                  height="148"
                  rx="24"
                  stroke="#7DD3FC"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                  transform="rotate(20)"
                />
              </g>
            </g>

            {/* Floating Faceted Geometric Shards */}
            <g className="animate-abstract-float">
              <polygon
                points="320,120 390,95 420,165 345,190"
                fill={`url(#${facetId})`}
                stroke="#7DD3FC"
                strokeOpacity="0.2"
                strokeWidth="1"
              />
            </g>
            <g className="animate-abstract-float-delayed">
              <rect
                x="980"
                y="340"
                width="76"
                height="76"
                rx="18"
                transform="rotate(28 1018 378)"
                fill={`url(#${facetId})`}
                stroke="#BAE6FD"
                strokeOpacity="0.2"
                strokeWidth="1.2"
              />
            </g>

            {/* Subtle Circuit Trace Lines */}
            <g
              stroke="#7DD3FC"
              strokeOpacity="0.18"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 40 240 H 165 L 195 210 H 310" />
              <path d="M 1400 390 H 1265 L 1230 425 H 1105" />
              <circle cx="310" cy="210" r="3" fill="#7DD3FC" fillOpacity="0.35" />
              <circle cx="1105" cy="425" r="3" fill="#BAE6FD" fillOpacity="0.35" />
            </g>
            <g
              stroke="#BAE6FD"
              strokeOpacity="0.38"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="18 110"
              className="animate-circuit-pulse-slow"
            >
              <path d="M 40 240 H 165 L 195 210 H 310" />
              <path d="M 1400 390 H 1265 L 1230 425 H 1105" />
            </g>
          </>
        ) : (
          <>
            {/* CTA Banner Abstract Flowing Wave Layers */}
            <path
              d="M-40 285 C 210 190, 440 340, 740 230 C 970 145, 1110 245, 1250 180 L 1250 400 L -40 400 Z"
              fill={`url(#${facetId})`}
              opacity="0.48"
            />
            <path
              d="M-60 95 C 220 35, 460 175, 760 90 C 980 28, 1120 115, 1260 65"
              stroke={`url(#${ribbonAId})`}
              strokeWidth="1.6"
              strokeDasharray="12 10"
              className="animate-abstract-dash"
            />
            <path
              d="M-40 270 C 220 180, 460 325, 760 215 C 980 135, 1120 230, 1260 165"
              stroke={`url(#${ribbonBId})`}
              strokeWidth="1.5"
            />

            {/* Right Corner Orbital Ring */}
            <g transform="translate(1095, 90)">
              <g className="animate-abstract-orbit">
                <circle
                  r="130"
                  stroke="#7DD3FC"
                  strokeOpacity="0.2"
                  strokeWidth="1.25"
                  strokeDasharray="14 10"
                />
                <circle cx="130" cy="0" r="3.5" fill="#BAE6FD" fillOpacity="0.55" />
              </g>
              <g className="animate-abstract-orbit-reverse">
                <circle
                  r="86"
                  stroke="#BAE6FD"
                  strokeOpacity="0.16"
                  strokeWidth="1"
                  strokeDasharray="5 8"
                />
              </g>
            </g>

            {/* Left Floating Geometric Hex/Rounded Square */}
            <g className="animate-abstract-float">
              <rect
                x="62"
                y="54"
                width="64"
                height="64"
                rx="16"
                transform="rotate(22 94 86)"
                fill={`url(#${facetId})`}
                stroke="#7DD3FC"
                strokeOpacity="0.24"
                strokeWidth="1.2"
              />
            </g>
            <g className="animate-abstract-float-delayed">
              <polygon
                points="148,270 198,250 214,300 164,318"
                fill={`url(#${facetId})`}
                stroke="#BAE6FD"
                strokeOpacity="0.22"
                strokeWidth="1"
              />
            </g>
          </>
        )}
      </svg>
    </div>
  );
};

import React, { useRef, useState, useCallback } from 'react';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowOpacity?: number;
  glowSize?: number;
  interactiveTilt?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(14, 165, 233, 0.15)',
  glowOpacity = 1,
  glowSize = 350,
  interactiveTilt = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (interactiveTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      setTilt({ rx: rotateX, ry: rotateY });
    }
  }, [interactiveTilt]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (interactiveTilt) {
      setTilt({ rx: 0, ry: 0 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactiveTilt && isHovered
          ? `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateZ(4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out',
      }}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 -z-0"
        style={{
          opacity: isHovered ? glowOpacity : 0,
          background: `radial-gradient(${glowSize}px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

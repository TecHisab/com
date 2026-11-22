import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.55,
  distance = 32,
  className = '',
  id,
}) => {
  const getInitialOffsets = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, x: 0 };
      case 'down':
        return { opacity: 0, y: -distance, x: 0 };
      case 'left':
        return { opacity: 0, x: distance, y: 0 };
      case 'right':
        return { opacity: 0, x: -distance, y: 0 };
      case 'none':
      default:
        return { opacity: 0, x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      id={id}
      initial={getInitialOffsets()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

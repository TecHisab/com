import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  digitalTag?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  as?: 'h1' | 'h2';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
  as = 'h2',
}) => {
  const HeadingTag = as;
  return (
    <div
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {badge && (
        <p
          className={`mb-2 text-xs font-bold tracking-[0.14em] uppercase text-[#0A63D8] dark:text-sky-400 ${
            align === 'center' ? 'text-center' : 'text-left'
          }`}
        >
          {badge}
        </p>
      )}
      <HeadingTag className="text-2xl sm:text-3xl lg:text-[2.15rem] font-extrabold text-[#0B1730] dark:text-white tracking-tight leading-tight">
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="mt-3 text-base sm:text-[17px] text-[#5F6D82] dark:text-slate-300 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};

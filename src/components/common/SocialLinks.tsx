import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteData';

interface SocialLinksProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = '',
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5';
  const buttonPad = size === 'sm' ? 'p-2' : 'p-2.5';

  const socialItems = [
    {
      name: 'Facebook',
      handle: SITE_CONFIG.social.facebookHandle,
      url: SITE_CONFIG.social.facebook,
      hoverClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
      renderIcon: () => <Facebook className={iconSize} />,
    },
    {
      name: 'Instagram',
      handle: SITE_CONFIG.social.instagramHandle,
      url: SITE_CONFIG.social.instagram,
      hoverClass: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent',
      renderIcon: () => <Instagram className={iconSize} />,
    },
    {
      name: 'WhatsApp',
      handle: SITE_CONFIG.contact.phoneDisplay,
      url: SITE_CONFIG.contact.whatsappUrl,
      hoverClass: 'hover:bg-emerald-600 hover:text-white hover:border-emerald-600',
      renderIcon: () => <MessageCircle className={iconSize} />,
    },
  ];

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {socialItems.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${item.name} (${item.handle})`}
          title={`${item.name} ${item.handle}`}
          className={`${buttonPad} rounded-xl bg-white/10 text-slate-200 border border-white/15 transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${item.hoverClass}`}
        >
          {item.renderIcon()}
          <span className="hidden sm:inline">{item.handle}</span>
        </a>
      ))}
    </div>
  );
};

import { NavigationTab, SoftwareDemoKey } from '../types';

export const CANONICAL_ORIGIN = 'https://www.techisab.com';

export const VALID_SERVICE_SLUGS = [
  'bookkeeping-accounting',
  'financial-reporting-mis',
  'payroll-salary-processing',
  'tax-vat-documentation',
  'quickbooks-online-accounting-support',
  'excel-google-sheets-automation',
  'business-software-website-development',
  'inventory-business-management-solutions',
  'bpo-data-processing',
  'practical-accounting-computer-training',
] as const;

export type ServiceLandingSlug = (typeof VALID_SERVICE_SLUGS)[number];

export const SERVICE_ID_TO_LANDING_SLUG: Record<string, ServiceLandingSlug> = {
  'accounting-bookkeeping': 'bookkeeping-accounting',
  'financial-analysis-budgeting': 'financial-reporting-mis',
  'virtual-cfo-controller': 'financial-reporting-mis',
  'payroll-hr-operations': 'payroll-salary-processing',
  'ar-ap-inventory-ops': 'inventory-business-management-solutions',
  'income-tax-support': 'tax-vat-documentation',
  'vat-mushak-support': 'tax-vat-documentation',
  'cloud-accounting-automation': 'quickbooks-online-accounting-support',
  'web-custom-software-dev': 'business-software-website-development',
  'bpo-backoffice-services': 'bpo-data-processing',
  'professional-training-services': 'practical-accounting-computer-training',
};

const VALID_DEMO_KEYS: SoftwareDemoKey[] = [
  'business',
  'erp',
  'cloud-accounting',
  'retail-manager',
  'pos-pro',
  'trade-manager',
  'inventory-pro',
  'one',
  'jibon',
  'calculators',
];

const STATIC_TAB_TO_PATH: Partial<Record<NavigationTab, string>> = {
  home: '/',
  about: '/about',
  services: '/services',
  software: '/software',
  'software-tax': '/software/calculators',
  training: '/training',
  pricing: '/pricing',
  blog: '/blog',
  contact: '/contact',
  'privacy-policy': '/privacy-policy',
  'terms-of-service': '/terms-of-service',
  'refund-policy': '/refund-policy',
  'tax-disclaimer': '/tax-disclaimer',
};

export interface ParsedRouteState {
  tab: NavigationTab;
  serviceSlug?: string;
  blogSlug?: string;
  softwareDemoTab?: SoftwareDemoKey;
  serviceFilter?: string;
  canonicalPath: string;
}

export function buildPathForState(params: {
  tab: NavigationTab;
  serviceSlug?: string | null;
  blogSlug?: string | null;
  softwareDemoTab?: SoftwareDemoKey;
}): string {
  const { tab, serviceSlug, blogSlug, softwareDemoTab } = params;

  if (tab === 'service-detail' && serviceSlug) {
    return `/services/${serviceSlug}`;
  }
  if (tab === 'blog-article' && blogSlug) {
    return `/blog/${blogSlug}`;
  }
  if (tab === 'software' && softwareDemoTab && softwareDemoTab !== 'business') {
    return `/software/${softwareDemoTab}`;
  }
  if (tab === 'software-tax') {
    return '/software/calculators';
  }
  return STATIC_TAB_TO_PATH[tab] || '/';
}

export function getCanonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized === '/' ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${normalized}`;
}

export function parseRouteFromLocation(
  rawPathname: string,
  rawSearch: string,
  rawHash: string,
  knownBlogSlugs: string[],
  knownBlogIdToSlug: Record<string, string>
): ParsedRouteState {
  // 1. Check GitHub Pages 404.html redirect pattern (?/path) or window.__TECHISAB_REDIRECT_PATH__
  let effectivePath = rawPathname || '/';

  if (typeof window !== 'undefined' && window.__TECHISAB_REDIRECT_PATH__) {
    effectivePath = window.__TECHISAB_REDIRECT_PATH__;
    delete window.__TECHISAB_REDIRECT_PATH__;
  } else if (rawSearch && rawSearch.startsWith('?/')) {
    const decoded = rawSearch
      .slice(2)
      .split('&')[0]
      .replace(/~and~/g, '&');
    effectivePath = `/${decoded.replace(/^\/+/, '')}`;
  } else {
    const params = new URLSearchParams(rawSearch);
    const pParam = params.get('p');
    if (pParam) {
      effectivePath = `/${pParam.replace(/^\/+/, '')}`;
    }
  }

  // 2. Fallback to legacy hash routes (#services, #blog/..., etc.) if pathname is root
  const normalizedPath = effectivePath.replace(/\/+$/, '') || '/';
  if (normalizedPath === '/' && rawHash && rawHash !== '#') {
    const cleanHash = rawHash.replace(/^#\/?/, '').trim();
    if (cleanHash && cleanHash !== 'home') {
      effectivePath = `/${cleanHash}`;
    }
  }

  const finalPath = (effectivePath.replace(/\/+$/, '') || '/').split('?')[0];
  const segments = finalPath.split('/').filter(Boolean);

  if (segments.length === 0 || segments[0] === 'home') {
    return { tab: 'home', canonicalPath: '/' };
  }

  const root = segments[0].toLowerCase();

  if (root === 'about') {
    return { tab: 'about', canonicalPath: '/about' };
  }

  if (root === 'services') {
    const sub = segments[1]?.toLowerCase();
    if (!sub || sub === 'all') {
      return { tab: 'services', serviceFilter: 'all', canonicalPath: '/services' };
    }
    if ((VALID_SERVICE_SLUGS as readonly string[]).includes(sub)) {
      return {
        tab: 'service-detail',
        serviceSlug: sub,
        canonicalPath: `/services/${sub}`,
      };
    }
    // Check if legacy service ID or category filter
    if (SERVICE_ID_TO_LANDING_SLUG[sub]) {
      const mappedSlug = SERVICE_ID_TO_LANDING_SLUG[sub];
      return {
        tab: 'service-detail',
        serviceSlug: mappedSlug,
        canonicalPath: `/services/${mappedSlug}`,
      };
    }
    if (['accounting', 'payroll', 'tax', 'technology', 'bpo', 'training'].includes(sub)) {
      const maybeId = segments[2]?.toLowerCase();
      if (maybeId && SERVICE_ID_TO_LANDING_SLUG[maybeId]) {
        const mappedSlug = SERVICE_ID_TO_LANDING_SLUG[maybeId];
        return {
          tab: 'service-detail',
          serviceSlug: mappedSlug,
          canonicalPath: `/services/${mappedSlug}`,
        };
      }
      return {
        tab: 'services',
        serviceFilter: sub,
        canonicalPath: '/services',
      };
    }
    return { tab: 'not-found', canonicalPath: finalPath };
  }

  if (root === 'software') {
    const sub = segments[1]?.toLowerCase() as SoftwareDemoKey | undefined;
    if (!sub || sub === 'business') {
      return { tab: 'software', softwareDemoTab: 'business', canonicalPath: '/software' };
    }
    if (VALID_DEMO_KEYS.includes(sub)) {
      return {
        tab: sub === 'calculators' ? 'software-tax' : 'software',
        softwareDemoTab: sub,
        canonicalPath: `/software/${sub}`,
      };
    }
    return { tab: 'not-found', canonicalPath: finalPath };
  }

  if (root === 'training') {
    return { tab: 'training', canonicalPath: '/training' };
  }

  if (root === 'pricing') {
    return { tab: 'pricing', canonicalPath: '/pricing' };
  }

  if (root === 'blog') {
    const sub = segments[1];
    if (!sub || sub === 'category') {
      return { tab: 'blog', canonicalPath: '/blog' };
    }
    if (knownBlogSlugs.includes(sub)) {
      return {
        tab: 'blog-article',
        blogSlug: sub,
        canonicalPath: `/blog/${sub}`,
      };
    }
    if (knownBlogIdToSlug[sub]) {
      const mapped = knownBlogIdToSlug[sub];
      return {
        tab: 'blog-article',
        blogSlug: mapped,
        canonicalPath: `/blog/${mapped}`,
      };
    }
    return { tab: 'not-found', canonicalPath: finalPath };
  }

  if (root === 'contact') {
    return { tab: 'contact', canonicalPath: '/contact' };
  }

  if (
    root === 'privacy-policy' ||
    root === 'terms-of-service' ||
    root === 'refund-policy' ||
    root === 'tax-disclaimer'
  ) {
    return { tab: root as NavigationTab, canonicalPath: `/${root}` };
  }

  return { tab: 'not-found', canonicalPath: finalPath };
}

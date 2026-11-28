import { BlogPost, NavigationTab, ServiceLandingPageData } from '../types';
import { FAQ_LIST } from '../data/faqData';
import { getLocalizedFaqs } from '../data/localizedData';
import { SITE_CONFIG } from '../data/siteData';
import { SERVICE_LANDING_PAGES } from '../data/serviceLandingData';
import { CANONICAL_ORIGIN, getCanonicalUrl } from './routing';

interface PageSeoMetaOptions {
  title: string;
  description: string;
  canonicalPath: string;
  isBengali: boolean;
  type?: 'website' | 'article';
  noindex?: boolean;
}

export const ORGANIZATION_NODE_ID = `${CANONICAL_ORIGIN}/#organization`;
export const BUSINESS_NODE_ID = `${CANONICAL_ORIGIN}/#business`;
export const WEBSITE_NODE_ID = `${CANONICAL_ORIGIN}/#website`;

const REMOTE_ELIGIBLE_SERVICE_SLUGS = new Set([
  'bookkeeping-accounting',
  'financial-reporting-mis',
  'quickbooks-online-accounting-support',
  'excel-google-sheets-automation',
  'business-software-website-development',
  'bpo-data-processing',
]);

function getAreaServedForService(slug: string) {
  const base: Record<string, string>[] = [
    { '@type': 'City', name: 'Chattogram' },
    { '@type': 'City', name: 'Dhaka' },
    { '@type': 'Country', name: 'Bangladesh' },
  ];
  if (REMOTE_ELIGIBLE_SERVICE_SLUGS.has(slug)) {
    base.push({ '@type': 'Place', name: 'International (Remote)' });
  }
  return base;
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  if (typeof document === 'undefined') return;
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function updatePageSeoMeta(options: PageSeoMetaOptions): void {
  if (typeof document === 'undefined') return;

  const { title, description, canonicalPath, isBengali, type = 'website', noindex = false } = options;
  const canonicalUrl = getCanonicalUrl(canonicalPath);

  document.title = title;
  document.documentElement.lang = isBengali ? 'bn' : 'en';

  upsertMetaTag('name', 'description', description);
  upsertMetaTag(
    'name',
    'robots',
    noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', noindex ? `${CANONICAL_ORIGIN}/` : canonicalUrl);

  upsertMetaTag('property', 'og:type', type);
  upsertMetaTag('property', 'og:title', title);
  upsertMetaTag('property', 'og:description', description);
  upsertMetaTag('property', 'og:url', canonicalUrl);
  upsertMetaTag('property', 'og:locale', isBengali ? 'bn_BD' : 'en_US');
  upsertMetaTag('property', 'og:image', `${CANONICAL_ORIGIN}/og-image.png`);

  upsertMetaTag('name', 'twitter:card', 'summary_large_image');
  upsertMetaTag('name', 'twitter:title', title);
  upsertMetaTag('name', 'twitter:description', description);
  upsertMetaTag('name', 'twitter:image', `${CANONICAL_ORIGIN}/og-image.png`);
}

interface StructuredDataOptions {
  activeTab: NavigationTab;
  canonicalPath: string;
  isBengali: boolean;
  serviceLanding?: ServiceLandingPageData | null;
  blogPost?: BlogPost | null;
  breadcrumbs?: { name: string; path: string }[];
}

export function syncStructuredData(options: StructuredDataOptions): void {
  if (typeof document === 'undefined') return;

  const { activeTab, canonicalPath, isBengali, serviceLanding, blogPost, breadcrumbs } = options;
  const canonicalUrl = getCanonicalUrl(canonicalPath);

  const organizationNode = {
    '@type': 'Organization',
    '@id': ORGANIZATION_NODE_ID,
    name: SITE_CONFIG.name,
    alternateName: 'TecHisab ITES & FINTEC',
    description: SITE_CONFIG.description,
    slogan: `${SITE_CONFIG.banglaTagline} — ${SITE_CONFIG.englishTagline}`,
    url: `${CANONICAL_ORIGIN}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${CANONICAL_ORIGIN}/logo.svg`,
    },
    image: `${CANONICAL_ORIGIN}/og-image.png`,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    founder: {
      '@type': 'Person',
      '@id': `${CANONICAL_ORIGIN}/#founder-mm-alam`,
      name: 'M. M. Alam',
      jobTitle: 'Founder & CEO',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near Hakkani Pump, Naya Bazar Biswa Road More',
      addressLocality: 'Chattogram',
      addressRegion: 'Chattogram',
      postalCode: '4216',
      addressCountry: 'BD',
    },
    areaServed: [
      { '@type': 'City', name: 'Chattogram' },
      { '@type': 'City', name: 'Dhaka' },
      { '@type': 'Country', name: 'Bangladesh' },
      { '@type': 'Place', name: 'International (Remote Cloud Accounting & BPO)' },
    ],
    sameAs: [SITE_CONFIG.social.facebook, SITE_CONFIG.social.instagram],
  };

  const professionalServiceNode = {
    '@type': ['ProfessionalService', 'AccountingService'],
    '@id': BUSINESS_NODE_ID,
    name: SITE_CONFIG.name,
    url: `${CANONICAL_ORIGIN}/`,
    image: `${CANONICAL_ORIGIN}/og-image.png`,
    description:
      'Accounting, bookkeeping, payroll, tax and VAT, BPO and business technology solutions in Chattogram and across Bangladesh.',
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    parentOrganization: { '@id': ORGANIZATION_NODE_ID },
    openingHours: 'Sa-Th 09:00-19:00',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near Hakkani Pump, Naya Bazar Biswa Road More',
      addressLocality: 'Chattogram',
      addressRegion: 'Chattogram',
      postalCode: '4216',
      addressCountry: 'BD',
    },
    hasMap: SITE_CONFIG.contact.mapDirectionsUrl,
    areaServed: [
      { '@type': 'City', name: 'Chattogram' },
      { '@type': 'City', name: 'Dhaka' },
      { '@type': 'Country', name: 'Bangladesh' },
    ],
    sameAs: [SITE_CONFIG.social.facebook, SITE_CONFIG.social.instagram],
  };

  const websiteNode = {
    '@type': 'WebSite',
    '@id': WEBSITE_NODE_ID,
    url: `${CANONICAL_ORIGIN}/`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: { '@id': ORGANIZATION_NODE_ID },
    inLanguage: isBengali ? 'bn-BD' : 'en',
  };

  const graph: Record<string, unknown>[] = [
    organizationNode,
    professionalServiceNode,
    websiteNode,
  ];

  if (breadcrumbs && breadcrumbs.length >= 2 && activeTab !== 'not-found') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: getCanonicalUrl(crumb.path),
      })),
    });
  }

  if (activeTab === 'home') {
    const faqs = getLocalizedFaqs(isBengali) || FAQ_LIST;
    graph.push({
      '@type': 'FAQPage',
      '@id': `${CANONICAL_ORIGIN}/#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  if (activeTab === 'services') {
    graph.push({
      '@type': 'OfferCatalog',
      '@id': `${CANONICAL_ORIGIN}/services#catalog`,
      name: isBengali
        ? 'টেকহিসাব ব্যবসায়িক ও অ্যাকাউন্টিং সেবাসমূহ'
        : 'TecHisab Business & Accounting Services',
      url: `${CANONICAL_ORIGIN}/services`,
      itemListElement: SERVICE_LANDING_PAGES.map((svc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Service',
          '@id': `${CANONICAL_ORIGIN}/services/${svc.slug}#service`,
          name: isBengali ? svc.h1Bn : svc.h1,
          description: isBengali ? svc.seoDescriptionBn : svc.seoDescription,
          serviceType: svc.primaryKeyword,
          provider: { '@id': BUSINESS_NODE_ID },
          brand: { '@id': ORGANIZATION_NODE_ID },
          areaServed: getAreaServedForService(svc.slug),
          url: `${CANONICAL_ORIGIN}/services/${svc.slug}`,
        },
      })),
    });
  }

  if (activeTab === 'about') {
    graph.push(
      {
        '@type': 'Person',
        '@id': `${CANONICAL_ORIGIN}/#founder-mm-alam`,
        name: 'M. M. Alam',
        jobTitle: 'Founder & CEO',
        worksFor: { '@id': ORGANIZATION_NODE_ID },
        description:
          'CA CC (ICAB), Income Tax Practitioner (ITP), and QuickBooks Online Certified Accountant leading TecHisab.',
      },
      {
        '@type': 'Person',
        '@id': `${CANONICAL_ORIGIN}/#cto-tarek-hasan`,
        name: 'Engr. Md. Tarek Hasan',
        jobTitle: 'Chief Technology Officer (CTO)',
        worksFor: { '@id': ORGANIZATION_NODE_ID },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Monash University, Australia',
        },
      }
    );
  }

  if (activeTab === 'service-detail' && serviceLanding) {
    const svcName = isBengali ? serviceLanding.h1Bn : serviceLanding.h1;
    const svcDesc = isBengali ? serviceLanding.heroSummaryBn : serviceLanding.heroSummary;
    const svcFaqs = isBengali ? serviceLanding.faqsBn : serviceLanding.faqs;

    graph.push({
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: svcName,
      description: svcDesc,
      serviceType: serviceLanding.primaryKeyword,
      provider: { '@id': BUSINESS_NODE_ID },
      brand: { '@id': ORGANIZATION_NODE_ID },
      areaServed: getAreaServedForService(serviceLanding.slug),
      url: canonicalUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    });

    if (svcFaqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: svcFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }
  }

  if (activeTab === 'blog-article' && blogPost) {
    graph.push({
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: blogPost.title,
      description: blogPost.metaDescription || blogPost.summary,
      articleSection: blogPost.category,
      keywords: blogPost.tags,
      datePublished: blogPost.date,
      dateModified: blogPost.updatedAt || blogPost.date,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      isPartOf: { '@id': WEBSITE_NODE_ID },
      image: `${CANONICAL_ORIGIN}/og-image.png`,
      author: blogPost.author.isPerson
        ? {
            '@type': 'Person',
            name: blogPost.author.name,
            jobTitle: blogPost.author.role,
          }
        : {
            '@type': 'Organization',
            '@id': ORGANIZATION_NODE_ID,
            name: blogPost.author.name,
          },
      publisher: { '@id': ORGANIZATION_NODE_ID },
      inLanguage: isBengali ? 'bn-BD' : 'en',
    });
  }

  const schemaPayload = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  let scriptEl = document.getElementById('techisab-structured-data') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'techisab-structured-data';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(schemaPayload);
}

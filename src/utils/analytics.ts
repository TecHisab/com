// Privacy-safe conversion and pageview analytics helper.
// Never sends personal customer information (names, emails, phone numbers, or message text) to analytics.

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    __TECHISAB_REDIRECT_PATH__?: string;
  }
}

export type ConversionEventName =
  | 'contact_form_submit'
  | 'quick_help_submit'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'service_quote_request'
  | 'training_enrollment_submit'
  | 'cta_click';

export function trackPageView(path: string, title: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: `https://www.techisab.com${path}`,
      });
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'virtual_page_view',
        page_path: path,
        page_title: title,
      });
    }
  } catch {
    // Analytics must never interrupt user flows
  }
}

export function trackConversion(
  eventName: ConversionEventName,
  params?: {
    location?: string;
    category?: string;
    label?: string;
  }
): void {
  if (typeof window === 'undefined') return;
  const safePayload = {
    event_category: params?.category || 'conversion',
    event_label: params?.label || eventName,
    interaction_location: params?.location || window.location.pathname,
  };

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, safePayload);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...safePayload,
      });
    }
  } catch {
    // Analytics must never interrupt user flows
  }
}

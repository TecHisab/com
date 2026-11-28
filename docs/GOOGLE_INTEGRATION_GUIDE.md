# Google Search Console, Analytics & Local SEO Setup Guide (TecHisab)

This guide covers the manual Google platform configurations required after deploying the updated codebase to `https://www.techisab.com`. No tracking tokens or unverified codes have been hardcoded in the repository.

---

## 1. Google Search Console (GSC) Verification & Sitemap Submission

1. Open [Google Search Console](https://search.google.com/search-console) and select **Add property** -> **Domain** (`techisab.com`, recommended) or **URL prefix** (`https://www.techisab.com/`).
2. **Domain Verification (Recommended):** Copy the TXT record provided by GSC and add it to your domain DNS settings (alongside your `www.techisab.com` CNAME record).
3. **HTML Meta Tag Alternative:** Copy only the verification token string from GSC and uncomment the placeholder line in `/index.html`:
   ```html
   <meta name="google-site-verification" content="YOUR_GOOGLE_SITE_VERIFICATION_CODE" />
   ```
4. Once verified, open **Indexing -> Sitemaps** and submit:
   ```text
   https://www.techisab.com/sitemap.xml
   ```
5. Use **URL Inspection** to test and request initial indexing for priority URLs:
   - `https://www.techisab.com/`
   - `https://www.techisab.com/services`
   - `https://www.techisab.com/services/bookkeeping-accounting`
   - `https://www.techisab.com/services/tax-vat-documentation`
   - `https://www.techisab.com/services/quickbooks-online-accounting-support`
   - `https://www.techisab.com/blog/vat-and-tax-documentation-guide-bangladeshi-businesses`
   - `https://www.techisab.com/contact`

---

## 2. Google Analytics 4 (GA4) & Google Tag Manager (GTM) Setup

`src/utils/analytics.ts` is already wired into route navigation and conversion points. It emits **zero personally identifiable information (PII)** (no names, emails, phone numbers, or message text).

### Option A: Direct GA4 Tag
1. Create a GA4 Web Data Stream for `https://www.techisab.com` to obtain your Measurement ID (`G-XXXXXXXXXX`).
2. Uncomment and update the GA4 snippet in `/index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Option B: Google Tag Manager (GTM)
1. Create a GTM Web container (`GTM-XXXXXXX`) and place the container snippet in `/index.html`.
2. Configure triggers in GTM for these `dataLayer` events automatically pushed by `src/utils/analytics.ts`:
   - `virtual_page_view` (`page_path`, `page_title`)
   - `contact_form_submit`
   - `quick_help_submit`
   - `training_enrollment_submit`
   - `service_quote_request`
   - `whatsapp_click`
   - `phone_click`
   - `email_click`
   - `cta_click`
3. Mark `contact_form_submit`, `quick_help_submit`, `training_enrollment_submit`, `whatsapp_click`, and `phone_click` as **Key Events** in GA4.

---

## 3. Google Business Profile (Chattogram Local SEO)

Keep exact **NAP (Name, Address, Phone)** consistency matching `/src/data/siteData.ts` and JSON-LD schema:

- **Business Name:** `TecHisab`
- **Primary Category:** `Accounting firm` (or `Bookkeeping service`)
- **Additional Categories:** `Tax preparation service`, `Software company`, `Training centre`
- **Address:** `Near Hakkani Pump, Naya Bazar Biswa Road More, Chattogram 4216, Bangladesh`
- **Phone:** `+8801556615555`
- **Website:** `https://www.techisab.com`
- **Hours:** Saturday – Thursday, `09:00 – 19:00` (Friday Closed)
- **Service Areas:** Chattogram, Dhaka, Bangladesh (plus remote QuickBooks/bookkeeping support globally)

---

## 4. Technical Validation Tools After Deployment

1. **Google Rich Results Test:** Validate `https://www.techisab.com/`, a service page (`/services/bookkeeping-accounting`), and a blog article (`/blog/vat-and-tax-documentation-guide-bangladeshi-businesses`) to confirm `AccountingService`, `BreadcrumbList`, `Service`, `FAQPage`, and `Article` JSON-LD schemas pass with zero errors.
2. **PageSpeed Insights / Lighthouse:** Test both Mobile and Desktop against `https://www.techisab.com/` to review LCP, INP, CLS, and deferred Three.js/vendor chunk loading.
3. **robots.txt Tester:** Confirm `https://www.techisab.com/robots.txt` allows `/` and declares `Sitemap: https://www.techisab.com/sitemap.xml`.

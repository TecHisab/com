# TecHisab SEO Audit Report & Keyword Strategy Matrix

**Website:** https://www.techisab.com  
**Business Name:** TecHisab (`ITES & FINTEC`)  
**Tagline:** কাজকে সহজ করুন — Making Business Simple.  
**Location:** Near Hakkani Pump, Naya Bazar Biswa Road More, Chattogram 4216, Bangladesh  
**Official Contact:** +8801556615555 | info@techisab.com  

---

## Part 1: Complete Technical & On-Page SEO Audit (Before vs. Implemented)

| Audit Area | Initial Findings (Before Optimization) | Implemented Resolution |
|---|---|---|
| **Title & Meta Descriptions** | Homepage used a generic category title (`TecHisab | ITES & FINTEC...`). Inner views relied on hash fragments and lacked service-specific landing metadata and blog article `metaDescription` fields. | Set the exact primary homepage title & meta description in `index.html` and `App.tsx`, added unique bilingual SEO titles/descriptions for all 10 dedicated service pages (`/services/<slug>`), 18 blog articles (`/blog/<slug>`), core pages, and legal pages via `updatePageSeoMeta()`. |
| **Heading Hierarchy (`H1`–`H3`)** | Multiple components skipped heading levels (`h4` directly under `h2` in `HowItWorksSection`, `EcosystemDiagram`, `SoftwareProductSelector`, `PricingSection`, `ContactSection`, `AboutSection`, `Footer`, and `h3` in `CtaBanner`). | Enforced strict semantic hierarchy: single `<h1>` per active view (`HeroSection` on `/`, `SectionHeading as="h1"` on standalone routes, `ServiceLandingPage`, `BlogArticlePage`, `LegalPageView`, `NotFoundView`), and normalized skipped `<h4>`/`<h5>` elements to `<h2>`/`<h3>`. |
| **URL Structure & Routing** | Navigation relied on `<button>` state changes and `#hash` URLs (`#services`, `#pricing`, `#blog`), making deep routes invisible as distinct canonical URLs to crawlers. | Implemented clean path-based SPA routing (`src/utils/routing.ts` + `App.tsx`) supporting `/about`, `/services`, `/services/<slug>`, `/software`, `/software/<demo>`, `/training`, `/pricing`, `/blog`, `/blog/<slug>`, `/contact`, legal routes, `popstate`, and GitHub Pages `404.html` `?/` restoration after bundle load. |
| **Internal Linking & Crawlability** | Primary navigation links (`Navbar`), service cards (`ServiceCard`), blog links (`BlogSection`), CTAs (`HeroSection`, `CtaBanner`), and `Footer` links used `<button type="button">` instead of `<a href="...">`. | Converted navigation links, footer directory links, breadcrumbs, service landing links, hero CTAs, and blog links to semantic `<a href="...">` anchors while preserving smooth client-side navigation. |
| **Canonical URLs & Status Handling** | `<link rel="canonical">` previously generated `#fragment` URLs (`https://www.techisab.com/#services`). Unknown paths fell back silently to home without `noindex`. | Every valid route emits a clean path-based `<link rel="canonical">` (`src/utils/seoSchema.ts`). Unknown URLs render `NotFoundView` with `<meta name="robots" content="noindex, follow" />`; unmatched `/api/*` endpoints return HTTP `404` JSON in `server.ts`. |
| **XML Sitemap & `robots.txt`** | `public/sitemap.xml` listed 12 `#hash` fragment URLs (ignored by search engines). `robots.txt` did not disallow `/api/`. | Replaced `public/sitemap.xml` with 39 canonical path URLs covering core pages, all 10 `/services/<slug>` landing pages, calculators, all 18 `/blog/<slug>` articles, and legal pages. Updated `public/robots.txt` with `Disallow: /api/` and canonical sitemap reference. |
| **Open Graph, Twitter & Icons** | `og:image` pointed to an SVG (`logo.svg`), `twitter:card` used `summary` without an image, and `apple-touch-icon.png` was missing. | Generated raster `public/og-image.png` (`1200x630`) and `public/apple-touch-icon.png` (`180x180`) preserving exact TecHisab branding; upgraded to `summary_large_image` and full `og:locale` (`en_US` / `bn_BD`). |
| **Structured Data (JSON-LD)** | Static `ProfessionalService` block in `index.html` and dynamic `#breadcrumb-schema` used `#crumb-id` items. No `Service`, `FAQPage`, `Article`, or `Person` schemas existed. | Unified schema orchestration in `src/utils/seoSchema.ts` injecting valid `@graph` nodes: `Organization`, `AccountingService` (Chattogram NAP + hours), `WebSite`, `BreadcrumbList`, `FAQPage` (home & service pages), `Service`, `Article` (`/blog/<slug>`), and `Person` (M. M. Alam & Engr. Md. Tarek Hasan on `/about`). Zero fabricated reviews/ratings. |
| **Dedicated Service & Content Pages** | Services only opened in a modal; blog posts only opened in an overlay modal without dedicated indexable URLs or structured `<h2>` headings. | Built 10 dedicated `/services/<slug>` landing pages (`ServiceLandingPage.tsx` + `serviceLandingData.ts`) and dedicated `/blog/<slug>` article views (`BlogArticlePage.tsx`) featuring 10 newly written Bangladesh & Chattogram-focused guides alongside existing reference articles. |
| **Bundle Performance** | `Three.js`, `d3`, all 9 interactive software demos, and secondary views loaded eagerly in the main entry chunk. | Configured `manualChunks` in `vite.config.ts` (`vendor-three`, `vendor-d3`, `vendor-motion`, `vendor-icons`), deferred `GlobalThreeBackdrop` mount via `requestIdleCallback`, and applied `React.lazy` + `Suspense` to routes and all software demo sandboxes without altering visual behavior. |

---

## Part 2: Keyword Strategy & Page Mapping Matrix (Zero Cannibalization)

Each primary and secondary keyword is assigned to a single canonical target URL so pages reinforce rather than compete with one another.

### A. Primary Keywords (10)

| Primary Keyword | Assigned Target URL | Secondary Support Context |
|---|---|---|
| `Accounting Services in Bangladesh` | `/services/bookkeeping-accounting` (reinforced at `/` brand level) | Core double-entry accounting & ledger operations |
| `Bookkeeping Services Bangladesh` | `/services/bookkeeping-accounting` | Daily recording, bank reconciliation & SME books |
| `Outsourced Accounting Services Bangladesh` | `/blog/how-to-choose-an-accounting-outsourcing-service` & `/services/bpo-data-processing` | Dedicated BPO & remote finance back-office execution |
| `Accounting Firm in Chattogram` | `/about` & `/contact` | Local NAP authority (Naya Bazar Biswa Road More, Chattogram 4216) |
| `Tax and VAT Services Bangladesh` | `/services/tax-vat-documentation` | Income Tax Act 2023 & VAT Act 2012 Mushak preparation |
| `Payroll Management Services Bangladesh` | `/services/payroll-salary-processing` | Monthly salary sheets, TDS deduction schedules & payslips |
| `QuickBooks Bookkeeping Services` | `/services/quickbooks-online-accounting-support` | QBO / Xero setup, chart of accounts & ongoing cleanup |
| `Business Software Development Bangladesh` | `/services/business-software-website-development` (plus `/software`) | Custom billing, web apps & TecHisab SaaS portfolio |
| `Excel Automation Services` | `/services/excel-google-sheets-automation` | Formula templates, Apps Script & automated dashboards |
| `Practical Accounting Training Chattogram` | `/services/practical-accounting-computer-training` (plus `/training`) | Hands-on accounting, Excel, QBO, Xero & tax batches |

### B. Secondary Keywords (10)

| Secondary Keyword | Assigned Target URL |
|---|---|
| `Monthly Bookkeeping Services` | `/services/bookkeeping-accounting` & `/blog/how-to-maintain-monthly-accounts-small-business` |
| `Financial Reporting Services` | `/services/financial-reporting-mis` |
| `Virtual CFO Services Bangladesh` | `/services/financial-reporting-mis` & `/pricing` |
| `Accounting Outsourcing for SMEs` | `/blog/how-to-choose-an-accounting-outsourcing-service` |
| `Business Financial Management` | `/blog/cash-flow-management-for-small-businesses` & `/software` |
| `Inventory Management Software` | `/services/inventory-business-management-solutions` & `/software/inventory-pro` |
| `Google Sheets Automation` | `/services/excel-google-sheets-automation` |
| `QuickBooks Online Accountant` | `/services/quickbooks-online-accounting-support` & `/blog/quickbooks-online-for-small-businesses-bangladesh` |
| `VAT Return Preparation Bangladesh` | `/services/tax-vat-documentation` & `/blog/vat-and-tax-documentation-guide-bangladeshi-businesses` |
| `Business Process Outsourcing Bangladesh` | `/services/bpo-data-processing` |

---

## Part 3: Dedicated Service Landing Pages & Blog Articles Inventory

### 10 Dedicated Service Pages
1. `/services/bookkeeping-accounting` — Bookkeeping & Accounting Services in Bangladesh
2. `/services/financial-reporting-mis` — Financial Reporting & MIS Services
3. `/services/payroll-salary-processing` — Payroll & Salary Processing Services in Bangladesh
4. `/services/tax-vat-documentation` — Bangladesh Tax & VAT Documentation Support
5. `/services/quickbooks-online-accounting-support` — QuickBooks Online & Cloud Accounting Support
6. `/services/excel-google-sheets-automation` — Excel & Google Sheets Automation Services
7. `/services/business-software-website-development` — Business Software & Website Development in Bangladesh
8. `/services/inventory-business-management-solutions` — Inventory & Business Management Solutions
9. `/services/bpo-data-processing` — BPO & Back-Office Data Processing in Bangladesh
10. `/services/practical-accounting-computer-training` — Practical Accounting & Computer Training in Chattogram

### 10 Newly Authored Original Blog Articles (Plus 8 Reference Guides)
1. `/blog/why-small-businesses-need-professional-bookkeeping-bangladesh`
2. `/blog/how-to-maintain-monthly-accounts-small-business`
3. `/blog/vat-and-tax-documentation-guide-bangladeshi-businesses`
4. `/blog/quickbooks-online-for-small-businesses-bangladesh`
5. `/blog/how-excel-automation-can-improve-business-accounting`
6. `/blog/understanding-monthly-financial-statements`
7. `/blog/payroll-management-for-smes-bangladesh`
8. `/blog/cash-flow-management-for-small-businesses`
9. `/blog/budget-vs-actual-analysis-practical-guide`
10. `/blog/how-to-choose-an-accounting-outsourcing-service`

# TecHisab Website (`www.techisab.com`)

**TecHisab** is an ITES & FINTEC company providing Accounting, Finance, Bookkeeping, Payroll, Inventory Management, Tax & VAT Support, BPO, MIS Reporting, Business Software, Website Development, Digital Automation, and Practical Technology Training services.

**Taglines:** কাজকে সহজ করুন | *Making Business Simple.*

---

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4 (Corporate Blue palette: `#0345A4`, `#02377F`, `#0A63D8`, `#F4F8FF`)
- **Icons & Visualization:** Lucide React & D3.js (Interactive Business OS chart)
- **Hosting:** Static build ready for **GitHub Pages**

---

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Run TypeScript validation and build production bundle:
   ```bash
   npm run lint
   npm run build
   ```
   The static production bundle is output to `./dist`.

---

## GitHub Pages Deployment

This repository is configured for deployment strictly via **GitHub Pages** (static hosting, no server-side packages or runtime database required):

1. Push the repository to your `main` branch on GitHub.
2. In GitHub Repository Settings → **Pages** → **Build and deployment**, select **GitHub Actions** as the source.
3. The included workflow `.github/workflows/deploy.yml` runs on every push to `main`:
   - Installs dependencies with Node.js 20 (`npm ci`)
   - Builds the static bundle (`npm run build`) with `VITE_BASE_PATH=/`
   - Uploads `./dist` and deploys to GitHub Pages via `actions/deploy-pages@v4`
4. Custom domain configuration:
   - `public/CNAME` sets `www.techisab.com` automatically in `./dist`.
   - `public/404.html` and the restoration snippet in `index.html` preserve client-side routes cleanly on GitHub Pages.
   - If deploying under `https://<username>.github.io/<repo>/` without a custom domain, set `VITE_BASE_PATH=/<repo>/` in the workflow environment and remove `public/CNAME`.

---

## Contact Information

- **Website:** https://www.techisab.com
- **Email:** info@techisab.com
- **Phone / WhatsApp:** +880 1556-615555
- **Facebook / Instagram:** @TecHishab
- **Address:** Near Hakkani Pump, Naya Bazar Biswa Road More, Chittagong, Bangladesh, 4216

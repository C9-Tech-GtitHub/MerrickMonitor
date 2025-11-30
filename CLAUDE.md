# Merrick Monitor - Claude Configuration

> Surveillance dashboard for tracking development activity

## Project Overview

**Merrick Monitor** is a personal surveillance dashboard for tracking key performance indicators across delivery, quality, and adoption metrics with a retro terminal aesthetic.

**Tech Stack:**
- React 18 + Vite
- Tailwind CSS
- lucide-react icons

## KPI Categories

### Delivery KPIs
- Features/tools shipped per month or quarter
- Cycle time (start to deployed)
- Planned vs. unplanned work percentage

### Quality KPIs
- Tool uptime/availability
- Rework rate

### Adoption KPIs
- Active users per tool

## Development

**Environment Setup:**
1. Copy `.env.example` to `.env`
2. Add your GitHub Personal Access Token to `.env` (optional but recommended to avoid rate limits)

**Start dev server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

## Deployment

**Hosting:** Cloudflare Pages with GitHub Integration
- **Production URL:** https://merrick-monitor.c9-dev.com (custom domain)
- **Pages URL:** https://merrick-monitor.pages.dev (default)
- **Auth:** Username: `merrick`, Password: `peek` (handled by Pages Functions)
- **Production Branch:** `main`
- **Auto-Deploy:** Enabled via GitHub integration

**Architecture:**
```
GitHub Push (main) → Cloudflare Pages + Functions (auto-build) → Live Site
```

**How It Works:**
1. Push to `main` branch on GitHub
2. Cloudflare Pages automatically detects the change via GitHub integration
3. Cloudflare runs `npm run build` and deploys to production
4. `functions/_middleware.js` provides authentication layer (deploys with Pages)
5. Site is live at both URLs with authentication

**To Deploy:**
```bash
git add -A
git commit -m "Your changes"
git push origin main
```

That's it! Cloudflare handles the rest automatically.

**Cloudflare Pages Configuration:**
Navigate to: Cloudflare Dashboard → Workers & Pages → merrick-monitor → Settings

**Build Settings:**
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty)
- **Deploy command:** LEAVE EMPTY (critical - Cloudflare auto-deploys the built files)

**Environment Variables (Production):**
- `AUTH_USER` = `merrick`
- `AUTH_PASS` = `peek`

**Custom Domain Setup:**
1. Go to: Workers & Pages → merrick-monitor → Custom domains
2. Add: `merrick-monitor.c9-dev.com`
3. Cloudflare auto-configures DNS and SSL

**Pages Functions (Authentication):**
- Location: `functions/_middleware.js`
- Purpose: HTTP Basic Auth protection for all routes
- Deployment: Automatic with Pages (no separate deployment needed)
- Environment vars: Uses `AUTH_USER` and `AUTH_PASS` from Pages settings

**Important Notes:**
- `vite.config.js` must have `base: "/"` (NOT `/MerrickMonitor/`)
- Authentication is built into Pages via Functions (no separate Worker needed)
- Pages auto-deploys from GitHub - no manual deploy command needed
- Environment variables are set in Pages Settings, not in code
- The project uses Cloudflare Pages, not GitHub Pages

**Common Issues:**
- **Build fails with route conflict:** Ensure "deploy command" is empty in Cloudflare Pages settings
- **Assets fail to load:** Verify `base: "/"` in vite.config.js
- **Old build showing:** Check Cloudflare is deploying from `main` branch, verify latest commit in deployment logs
- **Authentication not working:** Ensure environment variables `AUTH_USER` and `AUTH_PASS` are set in Pages Settings → Environment variables → Production
- **Custom domain not working:** Verify custom domain is added in Pages Settings → Custom domains, and DNS CNAME exists

**GitHub Integration:**
- Repository data is fetched from GitHub API for live metrics
- Each tool on the dashboard maps to a GitHub repository
- Commit activity, status, and trends are calculated in real-time
- Data refreshes every 5 minutes automatically

## Styling Guidelines

**Retro Terminal Theme:**
- Use monospace fonts (`font-mono`)
- Green/amber/cyan color palette
- Border glow effects
- Dark backgrounds

**Responsive:**
- Mobile-first approach
- Use Tailwind breakpoints (sm, md, lg, xl)

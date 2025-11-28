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

**Hosting:** Cloudflare Pages with GitHub Actions Integration
- **URL:** https://merrick-monitor.c9-dev.com
- **Auth:** Username: `merrick`, Password: `peek` (handled by Worker)
- **Production Branch:** `main`
- **Auto-Deploy:** Enabled via GitHub integration

**Architecture:**
```
GitHub Push (main) → Cloudflare Pages (auto-build) → Worker Auth → Live Site
```

**How It Works:**
1. Push to `main` branch on GitHub
2. Cloudflare Pages automatically detects the change via GitHub integration
3. Cloudflare runs `npm run build` and deploys to production
4. `worker-auth.js` Worker provides authentication layer
5. Site is live at https://merrick-monitor.c9-dev.com

**To Deploy:**
```bash
git add -A
git commit -m "Your changes"
git push origin main
```

That's it! Cloudflare handles the rest automatically.

**Cloudflare Pages Configuration:**
Navigate to: Cloudflare Dashboard → Workers & Pages → merrick-monitor → Settings → Builds & deployments

Required settings:
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty)
- **Deploy command:** LEAVE EMPTY (critical - Cloudflare auto-deploys the built files)

**Two Separate Services:**

1. **Cloudflare Pages** (Static Site)
   - Project: `merrick-monitor`
   - Source: GitHub repository (auto-sync from `main` branch)
   - Purpose: Hosts the React application
   - Deployment: Automatic on push to `main`

2. **Cloudflare Worker** (Authentication)
   - Worker: `merrick-monitor-auth`
   - Source: `worker-auth.js` (deployed separately via `npx wrangler deploy`)
   - Purpose: Protects the site with basic HTTP authentication
   - Route: `merrick-monitor.c9-dev.com/*`

**Important Notes:**
- `vite.config.js` must have `base: "/"` (NOT `/MerrickMonitor/`)
- Never use `npx wrangler deploy` for the Pages project (that's for Workers only)
- Pages auto-deploys from GitHub - no manual deploy command needed
- Authentication Worker is deployed separately when `worker-auth.js` changes
- The project uses GitHub integration, not GitHub Pages

**Common Issues:**
- **Build fails with route conflict:** Ensure "deploy command" is empty in Cloudflare Pages settings
- **Assets fail to load:** Verify `base: "/"` in vite.config.js
- **Old build showing:** Check Cloudflare is deploying from `main` branch, verify latest commit in deployment logs
- **Authentication not working:** Ensure `worker-auth.js` Worker is deployed via `npx wrangler deploy`

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

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
- **URL:** https://merrick-monitor.c9-dev.com
- **Auth:** Username: `merrick`, Password: `peek` (handled by Worker)
- **Production Branch:** `main`

**Architecture:**
```
GitHub Push → Cloudflare Pages (auto-build) → Worker Auth → Live Site
```

**How It Works:**
1. Push to `main` branch on GitHub
2. Cloudflare Pages automatically detects the change
3. Cloudflare builds and deploys (no manual steps needed)
4. `worker-auth.js` provides authentication layer

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
- **Deploy command:** LEAVE EMPTY (critical - do not use `npx wrangler deploy`)

**Important Notes:**
- `vite.config.js` must have `base: "/"` (NOT `/MerrickMonitor/`)
- Never use `npx wrangler deploy` for Pages (that's for Workers only)
- The `gh-pages` branch is deprecated and should not exist
- Authentication is handled by separate Worker: `worker-auth.js`

**Common Issues:**
- **Build fails with route conflict:** Remove any "deploy command" in Cloudflare Pages settings
- **Assets fail to load:** Check that `base: "/"` in vite.config.js
- **Old build cached:** Verify Cloudflare is deploying from `main` branch
- Never commit `node_modules` to git (already in `.gitignore`)

## Styling Guidelines

**Retro Terminal Theme:**
- Use monospace fonts (`font-mono`)
- Green/amber/cyan color palette
- Border glow effects
- Dark backgrounds

**Responsive:**
- Mobile-first approach
- Use Tailwind breakpoints (sm, md, lg, xl)

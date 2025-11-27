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

**Hosting:** Cloudflare Pages
- **URL:** https://merrick-monitor.c9-dev.com
- **Auth:** Username: `merrick`, Password: `peek`
- **Production Branch:** `main` (NOT gh-pages)

**Important Configuration:**
- `vite.config.js` must have `base: "/"` (NOT `/MerrickMonitor/`)
- Cloudflare Pages deploys from `main` branch
- The `gh-pages` branch is deprecated and should not exist
- Authentication is handled by `worker-auth.js` Cloudflare Worker

**Push fixes to GitHub:**
When fixing bugs or making changes:
1. Build the project: `npm run build`
2. Commit and push: `git add -A && git commit -m "description" && git push`
3. Cloudflare Pages will auto-deploy from the `main` branch

**Common Issues:**
- If assets fail to load with wrong MIME types, check that `base: "/"` in vite.config.js
- If old build is cached, ensure Cloudflare Pages is deploying from `main` not `gh-pages`
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

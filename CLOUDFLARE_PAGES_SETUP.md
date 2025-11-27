# Cloudflare Pages + Worker Auth Setup Guide

## Architecture Overview

```
Internet Request
    ↓
merrick-monitor-auth Worker (handles authentication)
    ↓
Cloudflare Pages (serves static React app)
```

The authentication Worker (`merrick-monitor-auth`) sits in front of the Pages site and protects it with basic authentication.

## Current Setup

### 1. Cloudflare Pages Project: `merrick-monitor`
- **URL:** https://merrick-monitor.c9-dev.com
- **Purpose:** Hosts the static React application
- **Git Connection:** Connected to GitHub repository
- **Production Branch:** `main`

### 2. Cloudflare Worker: `merrick-monitor-auth`
- **Purpose:** Provides basic authentication protection
- **Route:** `merrick-monitor.c9-dev.com/*`
- **Source:** `worker-auth.js`
- **Config:** `wrangler.toml`

## Correct Cloudflare Pages Configuration

### Pages Build Settings

Go to Cloudflare Dashboard → Workers & Pages → merrick-monitor → Settings → Builds & deployments

**Required Settings:**
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty or set to root)

**CRITICAL: Deploy Command**
- **Deploy command:** LEAVE EMPTY or DELETE if present
- **DO NOT USE:** `npx wrangler deploy`

### Why No Deploy Command?

Cloudflare Pages automatically deploys the built static files from the `dist` directory. The `npx wrangler deploy` command is for deploying Workers, not Pages projects. Using it causes a route conflict with the auth Worker.

## Deployment Workflow

### Automatic Deployments (Recommended)

With Git integration enabled:

1. **Push to `main` branch:**
   ```bash
   git add -A
   git commit -m "Update application"
   git push origin main
   ```

2. **Cloudflare Pages automatically:**
   - Detects the push
   - Runs `npm clean-install`
   - Runs `npm run build`
   - Deploys the `dist` folder
   - The auth Worker continues to protect the site

### Manual Deployment (If Needed)

If you need to manually deploy:

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages (NOT Workers)
npx wrangler pages deploy dist --project-name=merrick-monitor

# Commit and push
git add -A
git commit -m "Deploy update"
git push origin main
```

## Managing the Auth Worker

The authentication Worker is separate from the Pages deployment.

### Deploy Auth Worker

Only needed when updating `worker-auth.js`:

```bash
# From project root
npx wrangler deploy

# Or with config file
npx wrangler deploy --config wrangler.toml
```

### Update Auth Credentials

```bash
# Set username
npx wrangler secret put AUTH_USER --name merrick-monitor-auth

# Set password
npx wrangler secret put AUTH_PASS --name merrick-monitor-auth
```

## Troubleshooting

### Error: "Can't deploy routes that are assigned to another worker"

**Cause:** Trying to deploy a Worker when you should be deploying to Pages.

**Solution:** 
1. Go to Pages project settings
2. Remove any deploy command (`npx wrangler deploy`)
3. Let Pages handle deployment automatically

### Error: Wrong MIME types or 404s

**Cause:** Incorrect base path in vite.config.js

**Solution:**
- Ensure `base: "/"` in vite.config.js (NOT `/MerrickMonitor/`)
- Rebuild: `npm run build`

### Pages Shows "No Git Connection"

**Solution:**
1. Go to Workers & Pages → merrick-monitor
2. Settings → Builds → Git Repository
3. Click "Connect" and authorize GitHub
4. Select the repository

**Note:** You cannot add Git integration to a Direct Upload project. If needed, create a new Pages project with Git integration.

## Environment Variables

### For Pages Project

Set in: Workers & Pages → merrick-monitor → Settings → Environment variables

Example:
```
VITE_API_URL=https://api.example.com
GITHUB_TOKEN=ghp_xxxxx (optional, for GitHub data fetching)
```

### For Auth Worker

Set via Wrangler CLI:
```bash
npx wrangler secret put AUTH_USER --name merrick-monitor-auth
npx wrangler secret put AUTH_PASS --name merrick-monitor-auth
```

## File Structure

```
MerrickMonitor/
├── worker-auth.js          # Auth Worker code
├── wrangler.toml           # Worker configuration (NOT Pages)
├── vite.config.js          # MUST have base: "/"
├── src/                    # React app source
├── public/                 # Static assets
└── dist/                   # Build output (deployed to Pages)
```

## Key Points

1. **Pages and Workers are separate** - Don't confuse them
2. **No deploy command in Pages** - Let it auto-deploy from Git
3. **Worker protects Pages** - Auth happens before serving static files
4. **Use Git integration** - Automatic deployments on push to `main`
5. **Manual deploys use Wrangler Pages** - `npx wrangler pages deploy dist`

## Quick Reference

```bash
# Development
npm run dev

# Build locally
npm run build

# Preview build
npm run preview

# Deploy Pages manually (if needed)
npx wrangler pages deploy dist --project-name=merrick-monitor

# Deploy Worker (only when updating auth)
npx wrangler deploy

# Auto-deploy via Git (recommended)
git push origin main
```

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Git Integration Guide](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

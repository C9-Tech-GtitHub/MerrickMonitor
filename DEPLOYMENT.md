# Deployment Guide - GitHub to Cloudflare Pages

## Simple Deployment (What You Actually Do)

```bash
git add -A
git commit -m "Your changes"
git push origin main
```

**That's it!** Cloudflare Pages automatically builds and deploys from GitHub.

---

## How It Works

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────┐
│   GitHub    │──────>│ Cloudflare Pages │──────>│  Worker Auth    │
│    main     │ push  │   Auto-Build     │ route │ (protection)    │
└─────────────┘       └──────────────────┘       └─────────────────┘
                                                           │
                                                           v
                                                  ┌─────────────────┐
                                                  │   Live Site     │
                                                  │ merrick-monitor │
                                                  └─────────────────┘
```

### What Happens Automatically

1. **You push to GitHub** → Cloudflare detects the change
2. **Cloudflare builds** → Runs `npm run build` 
3. **Cloudflare deploys** → Serves files from `dist/`
4. **Worker protects** → Auth layer (`worker-auth.js`) guards access

---

## Cloudflare Pages Settings

> **You need to set these once in the Cloudflare Dashboard**

Navigate to: **Cloudflare Dashboard → Workers & Pages → merrick-monitor → Settings → Builds & deployments**

### Required Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| **Production branch** | `main` | Auto-deploy from this branch |
| **Build command** | `npm run build` | Builds the React app |
| **Build output directory** | `dist` | Where Vite outputs files |
| **Deploy command** | *(leave empty)* | **CRITICAL: Do NOT set this** |

### ⚠️ Critical: Deploy Command Must Be Empty

**DO NOT USE:** `npx wrangler deploy`

Why? That command deploys Workers, not Pages. It causes a route conflict with the auth Worker. Cloudflare Pages automatically deploys the `dist/` folder - no deploy command needed.

---

## Two Separate Services

### 1. Cloudflare Pages (Static Site)
- **Project:** `merrick-monitor`
- **Source:** GitHub repository (auto-sync)
- **Purpose:** Hosts the React application
- **Deployment:** Automatic on push to `main`

### 2. Cloudflare Worker (Authentication)
- **Worker:** `merrick-monitor-auth`
- **Source:** `worker-auth.js` (deployed separately)
- **Purpose:** Protects the site with basic auth
- **Route:** `merrick-monitor.c9-dev.com/*`

---

## Updating the Auth Worker

The auth Worker is **separate** from the Pages deployment. Only update when changing authentication:

```bash
# Deploy the worker
npx wrangler deploy

# Update credentials (if needed)
npx wrangler secret put AUTH_USER --name merrick-monitor-auth
npx wrangler secret put AUTH_PASS --name merrick-monitor-auth
```

---

## Monitoring Deployments

### View Build Logs

1. Go to **Cloudflare Dashboard → Workers & Pages → merrick-monitor**
2. Click on the **Deployments** tab
3. Click on any deployment to see build logs

### Check Deployment Status

- **Green checkmark** ✅ = Deployed successfully
- **Yellow spinner** 🔄 = Building
- **Red X** ❌ = Build failed (check logs)

---

## Troubleshooting

### Error: "Can't deploy routes that are assigned to another worker"

**Problem:** Deploy command is set to `npx wrangler deploy`

**Fix:**
1. Go to Cloudflare Pages settings
2. Remove the deploy command (leave it empty)
3. Push to GitHub again

---

### Error: Assets not loading (wrong MIME types)

**Problem:** Incorrect base path in Vite config

**Fix:**
Check `vite.config.js` has:
```javascript
export default defineConfig({
  plugins: [react()],
  base: "/",  // Must be "/" not "/MerrickMonitor/"
});
```

---

### Old version still showing

**Problem:** Cloudflare may be caching

**Fix:**
1. Check which branch is deploying (should be `main`)
2. Ensure latest commit is in the deployment logs
3. Force refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## Quick Reference

```bash
# Local development
npm run dev              # Start dev server at http://localhost:5173

# Local build test
npm run build            # Build to dist/
npm run preview          # Preview the build locally

# Deploy to production
git add -A
git commit -m "Update"
git push origin main     # Cloudflare auto-deploys

# Deploy auth worker (separate, rarely needed)
npx wrangler deploy      # Only for worker-auth.js changes
```

---

## Environment Variables

### For the Pages Project

Set in: **Cloudflare Dashboard → Workers & Pages → merrick-monitor → Settings → Environment variables**

Example:
```
VITE_API_URL=https://api.example.com
```

All variables for Vite must be prefixed with `VITE_`

### For Local Development

Create `.env` file:
```bash
VITE_API_URL=http://localhost:3000
GITHUB_TOKEN=ghp_xxxxx
```

---

## Key Takeaways

✅ **DO:**
- Push to `main` branch to deploy
- Let Cloudflare auto-build and deploy
- Keep `base: "/"` in vite.config.js

❌ **DON'T:**
- Set a deploy command in Pages settings
- Use `npx wrangler deploy` for the Pages project
- Confuse Pages (static site) with Workers (auth layer)

---

## Need Help?

- **Build failing?** Check Cloudflare deployment logs
- **Auth not working?** Check worker-auth.js is deployed
- **Assets 404?** Verify vite.config.js base path

**Live URL:** https://merrick-monitor.c9-dev.com  
**Credentials:** Username: `merrick` / Password: `peek`

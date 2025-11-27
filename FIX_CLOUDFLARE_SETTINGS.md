# 🚨 CRITICAL: Fix Cloudflare Pages Settings

## The Problem

Your deployment is failing because Cloudflare Pages has a **deploy command** set to:
```
npx wrangler deploy
```

This is **WRONG** for a Pages project. It tries to deploy a Worker instead of the static site, causing a route conflict.

---

## The Fix (Do This Now)

### Step 1: Open Cloudflare Dashboard

Go to: https://dash.cloudflare.com/7cc9a0eb055fa66d0b1c31e8d1a34466/workers-and-pages

### Step 2: Click on `merrick-monitor` Project

You should see it in the list (not the `merrick-monitor-auth` Worker - that's different).

### Step 3: Go to Settings → Builds & deployments

Click on **Settings** in the top menu, then **Builds & deployments** from the sidebar.

### Step 4: Edit Build Configuration

Click **Edit configuration** (or similar button) next to the build settings.

### Step 5: Set These Values Exactly

| Field | Value |
|-------|-------|
| **Production branch** | `main` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory (path)** | `/` (or leave empty) |
| **Deploy command** | **DELETE THIS / LEAVE EMPTY** |

### Step 6: Save

Click **Save** or **Save and Deploy**.

---

## What This Does

- **Build command** (`npm run build`): Runs Vite to build your React app
- **Build output directory** (`dist`): Tells Cloudflare where to find the built files
- **Deploy command** (EMPTY): Lets Cloudflare automatically deploy the `dist` folder

**No deploy command means Cloudflare handles deployment automatically - which is what you want!**

---

## After Fixing

Once you've updated the settings:

```bash
# Make a small change to trigger a new deploy
echo "# Fixed deployment" >> README.md

# Push to GitHub
git add -A
git commit -m "Trigger rebuild with correct settings"
git push origin main
```

Watch the **Deployments** tab in Cloudflare. You should see:
1. ✅ Build succeeds
2. ✅ Deploy succeeds
3. ✅ Site is live at https://merrick-monitor.c9-dev.com

---

## If You See This Error Again

```
ERROR: Can't deploy routes that are assigned to another worker.
  "merrick-monitor-auth" is already assigned to routes:
    - merrick-monitor.c9-dev.com/*
```

**It means the deploy command is still set.** Go back and ensure it's completely empty/deleted.

---

## Understanding the Setup

### What Gets Deployed Automatically (Pages)
- React application (static files)
- Built from GitHub `main` branch
- No manual deployment needed

### What Needs Manual Deployment (Worker)
- `worker-auth.js` (authentication layer)
- Deployed with: `npx wrangler deploy`
- Only when updating auth logic

They are **two separate services** that work together.

---

## Quick Verification

After fixing settings, you should see in deployment logs:

```
✓ Build command completed
✓ Deploying to Cloudflare Pages
✓ Success: Deployed to production
```

**NOT:**
```
✗ Executing user deploy command: npx wrangler deploy
✗ ERROR: Can't deploy routes...
```

---

## Next Steps

1. Fix the Cloudflare Pages settings (above)
2. Push to GitHub to trigger a new deploy
3. Verify deployment succeeds in Cloudflare dashboard
4. Visit https://merrick-monitor.c9-dev.com to confirm it works

From then on, just `git push origin main` and you're done! ✨

# GitHub Integration - Merrick Monitor

## Overview
Successfully integrated **live GitHub data** into the Merrick Monitor dashboard. Each tool now displays real-time data from your C9-Tech-GtitHub repositories.

## What's Connected

### Repository Mapping
Each dashboard tool is mapped to a GitHub repository:

| Dashboard Tool | GitHub Repo | Type |
|---|---|---|
| ON_PAGE_JOSH_BOT | SheetFreak-OnPage | BOT |
| RANDY_PEM_DASH | Randy | DASH |
| INTERLINKING_SYS | Lead | SEO |
| LSI_ANALYZER | LSI | SEO |
| GMC_TITLE_DASH | titlestruct | DASH |
| META_CHECKER | Product-Enrichment-Manager | TOOL |
| SEASONAL_SALLY | Lead-but-dyad | BOT |
| METAOBJECTS_AUTO | Product-Dashboard | AUTO |
| SCHEMA_SCANNER | SheetFreak | TOOL |
| COMPETITOR_SCRAPE | Ecom-price-tracker | SCRAPE |

## Features

### 1. **Live Commit Activity** (M-F Grid)
- Shows actual commit activity for the current week (Mon-Fri)
- Green/blue dots indicate days with commits
- Updates automatically every 5 minutes

### 2. **Dynamic Status Detection**
- **LIVE**: Updated within last 7 days
- **BETA**: Updated within last 30 days  
- **MAINT**: Older than 30 days

### 3. **Trend Analysis**
- **UP**: 10+ commits in last 30 days
- **STABLE**: 3-10 commits in last 30 days
- **FLAT**: 1-2 commits
- **DOWN**: No activity in 30+ days

### 4. **User Metrics**
- Calculated from: `(watchers × 2) + (stars × 3)`
- Provides engagement estimation

### 5. **Direct GitHub Links**
- Click any tool name to open its GitHub repository
- GitHub icon indicator on each tool

### 6. **Manual Refresh**
- Click "Refresh" button to reload GitHub data on demand
- Auto-refreshes every 5 minutes
- Loading indicator shows sync status

## Technical Implementation

### Files Created
1. **`src/config/repoMapping.js`** - Maps tools to GitHub repos
2. **`src/services/githubService.js`** - Fetches and processes GitHub data

### API Integration
- Uses GitHub REST API v3
- No authentication required for public repos
- Caches data for 5 minutes to avoid rate limits
- Graceful fallback to mock data on errors

### Data Sources
- Repository stats: `/repos/{owner}/{repo}`
- Commit activity: `/repos/{owner}/{repo}/commits`
- Weekly activity calculation based on commit timestamps

## Usage

The dashboard automatically:
1. Loads GitHub data on login (password: `peek`)
2. Displays real-time commit activity
3. Shows current tool status
4. Links to GitHub repositories
5. Refreshes data every 5 minutes

## Dev Server
```bash
npm run dev
# Opens at: http://localhost:5173/MerrickMonitor/
```

## Build & Deploy
```bash
npm run build
npm run deploy  # Deploys to GitHub Pages
```

## Customization

To modify repository mappings, edit:
```javascript
// src/config/repoMapping.js
export const REPO_MAPPING = {
  TOOL_NAME: {
    repo: 'github-repo-name',
    type: 'BOT|DASH|SEO|TOOL|AUTO|SCRAPE',
    description: 'Tool description'
  }
};
```

## Next Steps (Optional Enhancements)

- [ ] Add GitHub issue count to tool cards
- [ ] Show recent commit messages on hover
- [ ] Display contributor avatars
- [ ] Add deployment status badges
- [ ] Track PR merge activity
- [ ] Show repository language breakdown

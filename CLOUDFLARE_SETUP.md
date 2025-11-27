# Cloudflare Deployment Setup for c9-dev.com

This guide covers the setup completed for deploying projects to your Cloudflare domain.

## ✅ Completed Setup

### 1. MCP Server Installation
Installed 6 Cloudflare MCP servers for Claude Code:
- **cloudflare-docs** - Search Cloudflare documentation
- **cloudflare-bindings** - Workers bindings management
- **cloudflare-builds** - Build monitoring
- **cloudflare-observability** - Logs and analytics
- **cloudflare-browser** - Browser rendering
- **cloudflare-dns** - DNS analytics

**Location:** `~/Library/Application Support/Claude/mcp.json`

### 2. Environment Configuration
Added Cloudflare credentials to `.env`:
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
```

### 3. Cloudflare Deploy Agent
Created specialized subagent at `.claude/agents/cloudflare-deploy.md`

**Usage:** Invoke when you need to deploy projects or manage Cloudflare infrastructure

**Capabilities:**
- Deploy to Cloudflare Pages
- Configure subdomains on c9-dev.com
- Set up password protection
- Manage multiple projects
- Troubleshoot deployment issues

## 🎯 Next Steps

### Step 1: Get Cloudflare Credentials

1. **Get Account ID:**
   - Go to https://dash.cloudflare.com
   - Click on any domain (c9-dev.com)
   - Scroll down right sidebar - Account ID is shown there
   - Or check the URL: `dash.cloudflare.com/<account_id>`

2. **Create API Token:**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use template: "Edit Cloudflare Pages" or create custom with:
     - Account > Cloudflare Pages > Edit
     - Account > Workers Scripts > Edit  
     - Zone > DNS > Edit
     - Zone > Workers Routes > Edit
   - Copy the token (shown only once!)

3. **Update `.env` file:**
   ```bash
   CLOUDFLARE_ACCOUNT_ID=abc123...
   CLOUDFLARE_API_TOKEN=your_token_here
   ```

### Step 2: Deploy Merrick Monitor

You have two options:

#### Option A: Use Cloudflare Dashboard (Easier)

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" > "Create application" > "Pages" > "Connect to Git"
3. Authenticate with GitHub and select: `MerrickMonitor` repo
4. Configure build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
5. Click "Save and Deploy"
6. After deployment, add custom domain:
   - Go to your Pages project > "Custom domains"
   - Add: `merrick-monitor.c9-dev.com`
   - Cloudflare will auto-configure DNS

#### Option B: Use Cloudflare Deploy Agent

Just ask Claude:
```
Deploy Merrick Monitor to merrick-monitor.c9-dev.com
```

The agent will guide you through the process!

### Step 3: Add Password Protection (Optional)

Ask the Cloudflare agent:
```
Add password protection to merrick-monitor.c9-dev.com
```

It will:
1. Create a Cloudflare Worker with Basic HTTP Auth
2. Configure the Worker to protect your subdomain
3. Set up username/password
4. Test the authentication

### Step 4: Deploy More Projects

For future projects, just use subdomain pattern:
```
[project-name].c9-dev.com
```

Examples:
- `portfolio.c9-dev.com`
- `blog.c9-dev.com`
- `app.c9-dev.com`

Each project can be:
- A separate Cloudflare Pages project
- Password protected individually
- Auto-deployed from GitHub

## 🔧 Using the Cloudflare Agent

The `cloudflare-deploy` agent is automatically available. Just describe what you want:

**Examples:**
- "Deploy this project to Cloudflare Pages"
- "Set up a new subdomain for my blog"
- "Add password protection to my staging site"
- "Check deployment status for Merrick Monitor"
- "Why is my Cloudflare build failing?"

The agent has access to Cloudflare MCP tools and knows how to:
- Deploy Vite/React apps
- Configure DNS and subdomains
- Set up Workers for authentication
- Debug deployment issues
- Monitor application logs

## 📚 Architecture Overview

```
c9-dev.com (Cloudflare DNS)
│
├── merrick-monitor.c9-dev.com
│   ├── Cloudflare Pages (React app)
│   ├── GitHub auto-deploy (main branch)
│   └── Optional: Worker (password protection)
│
├── [future-project].c9-dev.com
│   └── Same pattern as above
│
└── [another-project].c9-dev.com
    └── Same pattern as above
```

### How It Works

1. **GitHub Push** → Triggers Cloudflare Pages build
2. **Cloudflare Builds** → Runs `npm run build`
3. **Static Files** → Deployed to edge (CDN)
4. **Worker (Optional)** → Intercepts requests for auth
5. **User Access** → Fast global delivery

### Benefits

- ⚡ **Fast** - Cloudflare's global CDN
- 🔒 **Secure** - HTTPS automatic, optional password
- 🚀 **Simple** - Push to GitHub = Deploy
- 💰 **Free** - Generous free tier
- 🌍 **Reliable** - 99.99% uptime

## 🆘 Troubleshooting

### Build Fails
```bash
# Test locally first
npm run build

# Check the logs in Cloudflare dashboard
# Common issues:
# - Wrong build command
# - Missing dependencies
# - Environment variables
```

### Subdomain Not Working
```bash
# Check DNS
dig merrick-monitor.c9-dev.com

# Wait a few minutes for propagation
# Verify in Cloudflare Pages > Custom domains
```

### Can't Access MCP Servers
```
# Restart Claude Code/Desktop
# Check: ~/Library/Application Support/Claude/mcp.json
# Verify npx and node are installed
```

### Need Help?
Ask the Cloudflare agent! It has access to:
- Official Cloudflare documentation (via MCP)
- Build logs and deployment status
- DNS and network diagnostics
- Your project configuration

## 📖 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Custom Domains Guide](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Basic HTTP Auth Example](https://developers.cloudflare.com/workers/examples/basic-auth/)

---

**Ready to deploy?** Get your Cloudflare credentials and ask Claude to deploy Merrick Monitor!

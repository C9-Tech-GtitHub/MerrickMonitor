import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repository mappings
const REPO_MAPPING = {
  ON_PAGE_JOSH_BOT: {
    repo: "OnPageSheet",
    type: "BOT",
    description: "On-page SEO automation bot",
    teams: ["Specialists", "Content"],
  },
  RANDY_PEM_DASH: {
    repo: "Randy",
    type: "DASH",
    description: "Randy PEM Dashboard",
    teams: ["Specialists", "Content"],
  },
  LEAD: {
    repo: "Lead",
    type: "TOOL",
    description: "Lead generation and management tool",
    teams: ["Sales"],
  },
  LSI_ANALYZER: {
    repo: "LSI",
    type: "SEO",
    description: "LSI keyword analysis tool",
    teams: ["Content", "Specialists"],
  },
  PEM: {
    repo: "Product-Enrichment-Manager",
    type: "TOOL",
    description: "Product Enrichment Manager - metadata management",
    teams: ["GMC"],
  },
  SHEETFREAK: {
    repo: "SheetFreak",
    type: "TOOL",
    description: "CLI tool for programmatic Google Sheets control",
    teams: ["Specialists", "Content"],
  },
  CLAUDE_CODE_BOOTSTRAP: {
    repo: "claude-code-bootstrap",
    type: "TOOL",
    description: "Smart bootstrap system for Claude Code projects",
    teams: ["Tech"],
  },
  MERRICK_MONITOR: {
    repo: "MerrickMonitor",
    type: "DASH",
    description: "Surveillance dashboard for monitoring activity",
    teams: ["Management"],
  },
};

const ARCHIVED_REPOS = {
  "[ARCHIVED] TITLE_STRUCT": {
    repo: "titlestruct",
    type: "DASH",
    description: "GMC Title Structure Dashboard - DISCONTINUED",
    archivedDate: "2025-09-19",
  },
  "[ARCHIVED] ECOM_PRICE_TRACKER": {
    repo: "Ecom-price-tracker",
    type: "SCRAPE",
    description: "Competitor price tracking - DISCONTINUED",
    archivedDate: "2025-10-27",
  },
};

const GITHUB_CONFIG = {
  owner: "C9-Tech-GtitHub",
  baseUrl: "https://github.com/C9-Tech-GtitHub",
};

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      if (response.status === 403 || response.status === 429) {
        console.warn(`Rate limited, waiting before retry ${i + 1}/${retries}`);
        await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
        continue;
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function getRepoCommits(repoName) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${repoName}/commits?since=${thirtyDaysAgo.toISOString()}&per_page=100`;

  const response = await fetchWithRetry(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    console.error(
      `Failed to fetch commits for ${repoName}: ${response.status}`,
    );
    return [];
  }

  return await response.json();
}

async function getWeeklyActivity(repoName) {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const commits = await getRepoCommits(repoName);

  const activity = [false, false, false, false, false];

  commits.forEach((commit) => {
    // Parse commit date and work in local timezone
    const commitDate = new Date(commit.commit.author.date);

    // Get the day of week for the commit in local timezone
    const commitDayOfWeek = commitDate.getDay() || 7;

    // Check if commit is in current week
    if (commitDate >= monday) {
      // Map to weekday index (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4)
      const weekdayIndex = commitDayOfWeek - 1;

      // Only track Mon-Fri (0-4)
      if (weekdayIndex >= 0 && weekdayIndex < 5) {
        activity[weekdayIndex] = true;
      }
    }
  });

  return activity;
}

async function getRepoStats(repoName) {
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${repoName}`;

  const response = await fetchWithRetry(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    console.error(
      `Failed to fetch repo stats for ${repoName}: ${response.status}`,
    );
    return { stars: 0, forks: 0, openIssues: 0 };
  }

  const data = await response.json();
  return {
    stars: data.stargazers_count || 0,
    forks: data.forks_count || 0,
    openIssues: data.open_issues_count || 0,
  };
}

async function fetchAllData() {
  console.log("Fetching GitHub data...");

  const toolFleet = [];
  let id = 1;

  // Fetch active repos
  for (const [toolName, config] of Object.entries(REPO_MAPPING)) {
    console.log(`Fetching data for ${toolName} (${config.repo})...`);

    const commits = await getRepoCommits(config.repo);
    const activity = await getWeeklyActivity(config.repo);
    const stats = await getRepoStats(config.repo);

    toolFleet.push({
      id: id++,
      name: toolName
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" "),
      type: config.type,
      status: "ACTIVE",
      description: config.description,
      teams: config.teams,
      commits: commits.length,
      activity: activity,
      repoUrl: `${GITHUB_CONFIG.baseUrl}/${config.repo}`,
      ...stats,
    });

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Fetch archived repos
  const archived = [];
  for (const [toolName, config] of Object.entries(ARCHIVED_REPOS)) {
    console.log(`Fetching data for ${toolName} (${config.repo})...`);

    const stats = await getRepoStats(config.repo);

    archived.push({
      id: id++,
      name: toolName,
      type: config.type,
      status: "ARCHIVED",
      description: config.description,
      archivedDate: config.archivedDate,
      commits: 0,
      activity: [false, false, false, false, false],
      repoUrl: `${GITHUB_CONFIG.baseUrl}/${config.repo}`,
      ...stats,
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const data = {
    toolFleet: toolFleet,
    archived: archived,
    lastUpdated: new Date().toISOString(),
  };

  // Write to public/data directory
  const outputPath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "github-data.json",
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`✅ Data written to ${outputPath}`);
  console.log(`   - Active repos: ${toolFleet.length}`);
  console.log(`   - Archived repos: ${archived.length}`);
  console.log(
    `   - Total commits (30d): ${toolFleet.reduce((sum, t) => sum + t.commits, 0)}`,
  );
}

fetchAllData().catch((error) => {
  console.error("Error fetching GitHub data:", error);
  process.exit(1);
});

import {
  REPO_MAPPING,
  ARCHIVED_REPOS,
  GITHUB_CONFIG,
} from "../config/repoMapping";

/**
 * Fetches GitHub data for all mapped repositories
 * Uses GitHub CLI (gh) for authentication
 */
export class GitHubService {
  constructor() {
    this.owner = GITHUB_CONFIG.owner;
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes cache for production
    this.loadCacheFromLocalStorage();
  }

  /**
   * Load cache from localStorage on initialization
   */
  loadCacheFromLocalStorage() {
    try {
      const savedCache = localStorage.getItem("github_cache");
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        const now = Date.now();

        // Only restore cache items that haven't expired
        Object.entries(parsed).forEach(([key, value]) => {
          if (now - value.timestamp < this.cacheTimeout) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.error("Failed to load cache from localStorage:", error);
    }
  }

  /**
   * Save cache to localStorage
   */
  saveCacheToLocalStorage() {
    try {
      const cacheObj = {};
      this.cache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem("github_cache", JSON.stringify(cacheObj));
    } catch (error) {
      console.error("Failed to save cache to localStorage:", error);
    }
  }

  /**
   * Get headers for GitHub API requests
   */
  getHeaders() {
    const headers = {
      Accept: "application/vnd.github.v3+json",
    };

    // Add token if available (from import.meta.env in Vite)
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    return headers;
  }

  /**
   * Get commit activity for the current week (Monday-Friday)
   * Returns array of [Mon, Tue, Wed, Thu, Fri] with 1 for activity, 0 for none
   */
  async getWeeklyActivity(repoName) {
    try {
      const cacheKey = `activity_${repoName}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Get current week's Monday
      const now = new Date();
      const dayOfWeek = now.getDay() || 7; // Convert Sunday (0) to 7
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);

      // Get commits since Monday
      const sinceDate = monday.toISOString();

      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${repoName}/commits?since=${sinceDate}&per_page=100`,
        { headers: this.getHeaders() },
      );

      if (!response.ok) {
        if (response.status === 403) {
          console.warn(`GitHub API rate limit exceeded for ${repoName}`);
        } else {
          console.warn(
            `Failed to fetch commits for ${repoName}:`,
            response.status,
          );
        }
        return [0, 0, 0, 0, 0];
      }

      const commits = await response.json();

      // Map commits to weekdays (0=Mon, 4=Fri)
      const activity = [0, 0, 0, 0, 0];

      commits.forEach((commit) => {
        const commitDate = new Date(commit.commit.author.date);
        const daysSinceMonday = Math.floor(
          (commitDate - monday) / (1000 * 60 * 60 * 24),
        );

        if (daysSinceMonday >= 0 && daysSinceMonday < 5) {
          activity[daysSinceMonday] = 1;
        }
      });

      const result = { data: activity, timestamp: Date.now() };
      this.cache.set(cacheKey, result);
      this.saveCacheToLocalStorage();

      return activity;
    } catch (error) {
      console.error(`Error fetching activity for ${repoName}:`, error);
      return [0, 0, 0, 0, 0];
    }
  }

  /**
   * Get repository statistics
   */
  async getRepoStats(repoName) {
    try {
      const cacheKey = `stats_${repoName}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${repoName}`,
        { headers: this.getHeaders() },
      );

      if (!response.ok) {
        if (response.status === 403) {
          console.warn(`GitHub API rate limit exceeded for ${repoName}`);
        } else {
          console.warn(
            `Failed to fetch stats for ${repoName}:`,
            response.status,
          );
        }
        return null;
      }

      const repo = await response.json();

      const stats = {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        watchers: repo.watchers_count,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        size: repo.size,
        language: repo.language,
        isPrivate: repo.private,
      };

      const result = { data: stats, timestamp: Date.now() };
      this.cache.set(cacheKey, result);
      this.saveCacheToLocalStorage();

      return stats;
    } catch (error) {
      console.error(`Error fetching stats for ${repoName}:`, error);
      return null;
    }
  }

  /**
   * Get recent commits count (last 30 days)
   */
  async getRecentCommitsCount(repoName) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${repoName}/commits?since=${thirtyDaysAgo.toISOString()}&per_page=100`,
        { headers: this.getHeaders() },
      );

      if (!response.ok) {
        return 0;
      }

      const commits = await response.json();
      return commits.length;
    } catch (error) {
      console.error(`Error fetching commits count for ${repoName}:`, error);
      return 0;
    }
  }

  /**
   * Determine tool status based on recent activity
   */
  determineStatus(stats, commitsCount) {
    if (!stats) return "MAINT";

    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(stats.pushedAt)) / (1000 * 60 * 60 * 24),
    );

    // Active in last 7 days = LIVE
    if (daysSinceUpdate < 7) return "LIVE";

    // Active in last 30 days = BETA
    if (daysSinceUpdate < 30) return "BETA";

    // Otherwise maintenance mode
    return "MAINT";
  }

  /**
   * Determine trend based on commit frequency
   */
  determineTrend(commitsCount, stats) {
    if (!stats) return "FLAT";

    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(stats.pushedAt)) / (1000 * 60 * 60 * 24),
    );

    if (commitsCount > 10) return "UP";
    if (commitsCount > 3) return "STABLE";
    if (daysSinceUpdate > 30) return "DOWN";

    return "FLAT";
  }

  /**
   * Load static GitHub data from JSON file (fallback)
   */
  async loadStaticData() {
    try {
      const response = await fetch("/src/data/githubData.json");
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn("Failed to load static GitHub data:", error);
    }
    return null;
  }

  /**
   * Get enriched tool data for all mapped repositories
   */
  async getAllToolsData() {
    // Try to use static data first (for production/GitHub Pages)
    const staticData = await this.loadStaticData();

    const tools = [];
    let id = 1;

    for (const [toolName, config] of Object.entries(REPO_MAPPING)) {
      let activity, stats, status, trend;

      // Use static data if available, otherwise fetch from API
      if (staticData && staticData.tools[toolName]) {
        const toolData = staticData.tools[toolName];
        activity = toolData.activity;
        stats = toolData.stats;
        status = toolData.status;
        trend = toolData.trend;
      } else {
        // Fallback to API (only in development with token)
        const [fetchedActivity, fetchedStats, commitsCount] = await Promise.all(
          [
            this.getWeeklyActivity(config.repo),
            this.getRepoStats(config.repo),
            this.getRecentCommitsCount(config.repo),
          ],
        );

        activity = fetchedActivity;
        stats = fetchedStats;
        status = this.determineStatus(stats, commitsCount);
        trend = this.determineTrend(commitsCount, stats);
      }

      // Estimate users based on watchers/stars (mock calculation)
      const users = stats
        ? Math.max(stats.watchers * 2 + stats.stars * 3, 1)
        : Math.floor(Math.random() * 50) + 1;

      tools.push({
        id: id++,
        name: toolName,
        type: config.type,
        status,
        users,
        trend,
        activity,
        repoName: config.repo,
        stats,
        description: config.description,
        repoUrl: `${GITHUB_CONFIG.baseUrl}/${config.repo}`,
        teams: config.teams || [],
      });
    }

    return tools;
  }

  /**
   * Get archived repositories data
   */
  async getArchivedRepos() {
    const archived = [];
    let id = 1;

    for (const [toolName, config] of Object.entries(ARCHIVED_REPOS)) {
      const stats = await this.getRepoStats(config.repo);

      archived.push({
        id: id++,
        name: toolName,
        type: config.type,
        status: "ARCHIVED",
        repoName: config.repo,
        archivedDate: config.archivedDate,
        description: config.description,
        repoUrl: `${GITHUB_CONFIG.baseUrl}/${config.repo}`,
        stats,
      });
    }

    return archived;
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
    localStorage.removeItem("github_cache");
  }
}

// Singleton instance
export const githubService = new GitHubService();

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
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
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
      );

      if (!response.ok) {
        console.warn(
          `Failed to fetch commits for ${repoName}:`,
          response.status,
        );
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
      );

      if (!response.ok) {
        console.warn(`Failed to fetch stats for ${repoName}:`, response.status);
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
   * Get enriched tool data for all mapped repositories
   */
  async getAllToolsData() {
    const tools = [];
    let id = 1;

    for (const [toolName, config] of Object.entries(REPO_MAPPING)) {
      const [activity, stats, commitsCount] = await Promise.all([
        this.getWeeklyActivity(config.repo),
        this.getRepoStats(config.repo),
        this.getRecentCommitsCount(config.repo),
      ]);

      const status = this.determineStatus(stats, commitsCount);
      const trend = this.determineTrend(commitsCount, stats);

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
        commitsCount,
        description: config.description,
        repoUrl: `${GITHUB_CONFIG.baseUrl}/${config.repo}`,
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
  }
}

// Singleton instance
export const githubService = new GitHubService();

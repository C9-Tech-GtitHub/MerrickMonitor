/**
 * Service for fetching Claude Code telemetry data from Grafana Cloud via Prometheus API
 */
export class TelemetryService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60 * 1000; // 1 minute cache (telemetry data updates frequently)
    this.loadCacheFromLocalStorage();
  }

  /**
   * Load cache from localStorage on initialization
   */
  loadCacheFromLocalStorage() {
    try {
      const savedCache = localStorage.getItem("telemetry_cache");
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        const now = Date.now();

        Object.entries(parsed).forEach(([key, value]) => {
          if (now - value.timestamp < this.cacheTimeout) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.error("Failed to load telemetry cache:", error);
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
      localStorage.setItem("telemetry_cache", JSON.stringify(cacheObj));
    } catch (error) {
      console.error("Failed to save telemetry cache:", error);
    }
  }

  /**
   * Execute a PromQL query
   * @param {string} query - PromQL query
   * @param {string} type - 'instant' or 'range'
   * @param {object} options - Additional options (start, end, step for range queries)
   */
  async query(query, type = "instant", options = {}) {
    const cacheKey = `${type}_${query}_${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const params = new URLSearchParams({ query, type });

      if (type === "range") {
        if (options.start) params.set("start", options.start);
        if (options.end) params.set("end", options.end);
        if (options.step) params.set("step", options.step);
      }

      const response = await fetch(`/api/telemetry?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Query failed");
      }

      const data = await response.json();

      const result = { data, timestamp: Date.now() };
      this.cache.set(cacheKey, result);
      this.saveCacheToLocalStorage();

      return data;
    } catch (error) {
      console.error("Telemetry query failed:", error);
      throw error;
    }
  }

  /**
   * Extract scalar value from Prometheus response
   */
  extractScalar(response) {
    if (
      response?.status === "success" &&
      response?.data?.result?.[0]?.value?.[1]
    ) {
      return parseFloat(response.data.result[0].value[1]);
    }
    return 0;
  }

  /**
   * Extract values grouped by label from Prometheus response
   */
  extractByLabel(response, labelName) {
    const result = {};
    if (response?.status === "success" && response?.data?.result) {
      response.data.result.forEach((item) => {
        const label = item.metric[labelName] || "unknown";
        const value = parseFloat(item.value[1]) || 0;
        result[label] = value;
      });
    }
    return result;
  }

  /**
   * Get total session count
   */
  async getSessionCount() {
    const response = await this.query("sum(claude_code_session_count)");
    return this.extractScalar(response);
  }

  /**
   * Get token usage by type (input, output, cacheRead, cacheCreation)
   */
  async getTokenUsage() {
    const response = await this.query(
      'sum by (type) (claude_code_token_usage)',
    );
    return this.extractByLabel(response, "type");
  }

  /**
   * Get total token usage
   */
  async getTotalTokens() {
    const response = await this.query("sum(claude_code_token_usage)");
    return this.extractScalar(response);
  }

  /**
   * Get cost usage by model
   */
  async getCostByModel() {
    const response = await this.query(
      'sum by (model) (claude_code_cost_usage)',
    );
    return this.extractByLabel(response, "model");
  }

  /**
   * Get total cost
   */
  async getTotalCost() {
    const response = await this.query("sum(claude_code_cost_usage)");
    return this.extractScalar(response);
  }

  /**
   * Get lines of code by type (added, removed)
   */
  async getLinesOfCode() {
    const response = await this.query(
      'sum by (type) (claude_code_lines_of_code_count)',
    );
    return this.extractByLabel(response, "type");
  }

  /**
   * Get total commits created
   */
  async getCommitCount() {
    const response = await this.query("sum(claude_code_commit_count)");
    return this.extractScalar(response);
  }

  /**
   * Get total pull requests created
   */
  async getPullRequestCount() {
    const response = await this.query("sum(claude_code_pull_request_count)");
    return this.extractScalar(response);
  }

  /**
   * Get total active time in seconds
   */
  async getActiveTime() {
    const response = await this.query("sum(claude_code_active_time_total)");
    return this.extractScalar(response);
  }

  /**
   * Get code edit tool decisions by tool and decision type
   */
  async getCodeEditDecisions() {
    const response = await this.query(
      'sum by (tool, decision) (claude_code_code_edit_tool_decision)',
    );
    const result = {
      accept: {},
      reject: {},
    };

    if (response?.status === "success" && response?.data?.result) {
      response.data.result.forEach((item) => {
        const tool = item.metric.tool || "unknown";
        const decision = item.metric.decision || "unknown";
        const value = parseFloat(item.value[1]) || 0;

        if (decision === "accept" || decision === "reject") {
          result[decision][tool] = value;
        }
      });
    }

    return result;
  }

  /**
   * Get all telemetry metrics in one call
   */
  async getAllMetrics() {
    try {
      const [
        sessionCount,
        tokenUsage,
        totalTokens,
        totalCost,
        costByModel,
        linesOfCode,
        commitCount,
        pullRequestCount,
        activeTime,
      ] = await Promise.all([
        this.getSessionCount(),
        this.getTokenUsage(),
        this.getTotalTokens(),
        this.getTotalCost(),
        this.getCostByModel(),
        this.getLinesOfCode(),
        this.getCommitCount(),
        this.getPullRequestCount(),
        this.getActiveTime(),
      ]);

      return {
        sessions: sessionCount,
        tokens: {
          total: totalTokens,
          byType: tokenUsage,
        },
        cost: {
          total: totalCost,
          byModel: costByModel,
        },
        linesOfCode: {
          added: linesOfCode.added || 0,
          removed: linesOfCode.removed || 0,
        },
        commits: commitCount,
        pullRequests: pullRequestCount,
        activeTimeSeconds: activeTime,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to fetch all metrics:", error);
      throw error;
    }
  }

  /**
   * Check if telemetry backend is connected
   */
  async checkConnection() {
    try {
      // Simple query to check if Prometheus is reachable
      const response = await this.query("up");
      return response?.status === "success";
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
    localStorage.removeItem("telemetry_cache");
  }
}

// Singleton instance
export const telemetryService = new TelemetryService();

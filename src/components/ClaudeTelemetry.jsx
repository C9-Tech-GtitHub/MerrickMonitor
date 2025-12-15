import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  DollarSign,
  Clock,
  GitCommit,
  GitPullRequest,
  Code,
  Zap,
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { telemetryService } from "../services/telemetryService";

/**
 * Format seconds into human-readable duration
 */
function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 && hours === 0) parts.push(`${secs}s`);

  return parts.join(" ") || "0s";
}

/**
 * Format number with commas
 */
function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  return Math.round(num).toLocaleString();
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "$0.00";
  return `$${amount.toFixed(2)}`;
}

/**
 * ASCII Progress Bar for retro mode
 */
const ProgressBar = ({ value, max, label, color, isRetro, theme }) => {
  const percent = max > 0 ? (value / max) * 100 : 0;
  const barLength = 30;
  const filledLength = Math.round((barLength * percent) / 100);

  if (isRetro) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className={`w-16 uppercase ${theme.textMuted}`}>{label}</span>
        <span className={color}>
          {"█".repeat(filledLength)}
          <span className="opacity-30">{"░".repeat(barLength - filledLength)}</span>
        </span>
        <span className={`w-20 text-right ${theme.text}`}>
          {formatNumber(value)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-slate-500 uppercase">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-20 text-right text-slate-700 font-medium">
        {formatNumber(value)}
      </span>
    </div>
  );
};

/**
 * Stat Card Component
 */
const StatCard = ({ icon: Icon, label, value, subValue, isRetro, theme, color }) => {
  return (
    <div
      className={`p-4 ${
        isRetro
          ? `border ${theme.border} bg-black/50`
          : "bg-white rounded-xl shadow-sm border border-slate-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color || theme.accent}`} />
        <span className={`text-xs uppercase tracking-wider ${theme.textMuted}`}>
          {label}
        </span>
      </div>
      <div className={`text-2xl font-bold ${theme.textBold}`}>{value}</div>
      {subValue && (
        <div className={`text-xs mt-1 ${theme.textMuted}`}>{subValue}</div>
      )}
    </div>
  );
};

/**
 * Claude Code Telemetry Dashboard Component
 */
const ClaudeTelemetry = ({ theme, isRetro }) => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check connection first
      const connected = await telemetryService.checkConnection();
      setIsConnected(connected);

      if (!connected) {
        setError("Telemetry backend not configured or unreachable");
        setIsLoading(false);
        return;
      }

      const data = await telemetryService.getAllMetrics();
      setMetrics(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message || "Failed to fetch telemetry data");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh every 5 minutes
  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  // Calculate token totals for progress bars
  const tokenMax = metrics?.tokens?.total || 1;
  const tokensByType = metrics?.tokens?.byType || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div
        className={`p-4 flex items-center justify-between ${theme.cardBg} ${
          isRetro ? "border" : "rounded-xl"
        } ${theme.border}`}
      >
        <div className="flex items-center gap-3">
          <Zap className={`w-5 h-5 ${theme.accent}`} />
          <div>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${theme.textBold}`}>
              Claude Code Telemetry
            </h2>
            <p className={`text-xs ${theme.textMuted}`}>
              OpenTelemetry metrics from Grafana Cloud
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className={`text-xs ${isRetro ? "text-green-500" : "text-green-600"}`}>
                  Connected
                </span>
              </>
            ) : (
              <>
                <WifiOff className={`w-4 h-4 ${isRetro ? "text-red-500" : "text-red-400"}`} />
                <span className={`text-xs ${isRetro ? "text-red-500" : "text-red-400"}`}>
                  Disconnected
                </span>
              </>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchMetrics}
            disabled={isLoading}
            className={`p-2 rounded transition-colors ${
              isRetro
                ? `border ${theme.border} hover:bg-green-900/30 disabled:opacity-50`
                : "bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""} ${theme.textMuted}`}
            />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div
          className={`p-4 flex items-center gap-3 ${
            isRetro
              ? "border border-red-900 bg-red-900/20 text-red-400"
              : "bg-red-50 border border-red-200 text-red-600 rounded-xl"
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium text-sm">{error}</p>
            <p className={`text-xs mt-1 ${isRetro ? "text-red-500/70" : "text-red-500"}`}>
              Configure GRAFANA_PROMETHEUS_URL, GRAFANA_INSTANCE_ID, and GRAFANA_API_TOKEN
              in Cloudflare Pages environment variables.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !metrics && (
        <div
          className={`p-8 text-center ${theme.cardBg} ${
            isRetro ? "border" : "rounded-xl"
          } ${theme.border}`}
        >
          <RefreshCw className={`w-8 h-8 mx-auto mb-3 animate-spin ${theme.accent}`} />
          <p className={`text-sm ${theme.textMuted}`}>Loading telemetry data...</p>
        </div>
      )}

      {/* Metrics Dashboard */}
      {metrics && (
        <>
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Activity}
              label="Sessions"
              value={formatNumber(metrics.sessions)}
              isRetro={isRetro}
              theme={theme}
            />
            <StatCard
              icon={DollarSign}
              label="Total Cost"
              value={formatCurrency(metrics.cost.total)}
              isRetro={isRetro}
              theme={theme}
              color={isRetro ? "text-yellow-500" : "text-amber-500"}
            />
            <StatCard
              icon={Clock}
              label="Active Time"
              value={formatDuration(metrics.activeTimeSeconds)}
              isRetro={isRetro}
              theme={theme}
              color={isRetro ? "text-cyan-500" : "text-cyan-500"}
            />
            <StatCard
              icon={Zap}
              label="Total Tokens"
              value={formatNumber(metrics.tokens.total)}
              isRetro={isRetro}
              theme={theme}
              color={isRetro ? "text-purple-500" : "text-purple-500"}
            />
          </div>

          {/* Token Usage Breakdown */}
          <div
            className={`p-6 ${theme.cardBg} ${
              isRetro ? "border" : "rounded-xl"
            } ${theme.border}`}
          >
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${theme.accent}`}
            >
              <Zap className="w-4 h-4" />
              Token Usage Breakdown
            </h3>
            <div className="space-y-3">
              <ProgressBar
                label="Input"
                value={tokensByType.input || 0}
                max={tokenMax}
                color={isRetro ? "text-green-500" : "bg-green-500"}
                isRetro={isRetro}
                theme={theme}
              />
              <ProgressBar
                label="Output"
                value={tokensByType.output || 0}
                max={tokenMax}
                color={isRetro ? "text-blue-500" : "bg-blue-500"}
                isRetro={isRetro}
                theme={theme}
              />
              <ProgressBar
                label="Cache Read"
                value={tokensByType.cacheRead || 0}
                max={tokenMax}
                color={isRetro ? "text-cyan-500" : "bg-cyan-500"}
                isRetro={isRetro}
                theme={theme}
              />
              <ProgressBar
                label="Cache Create"
                value={tokensByType.cacheCreation || 0}
                max={tokenMax}
                color={isRetro ? "text-purple-500" : "bg-purple-500"}
                isRetro={isRetro}
                theme={theme}
              />
            </div>
          </div>

          {/* Productivity Metrics */}
          <div
            className={`p-6 ${theme.cardBg} ${
              isRetro ? "border" : "rounded-xl"
            } ${theme.border}`}
          >
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${theme.accent}`}
            >
              <Code className="w-4 h-4" />
              Productivity Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`text-center p-3 rounded ${isRetro ? "bg-green-900/10" : "bg-slate-50"}`}>
                <GitCommit className={`w-5 h-5 mx-auto mb-2 ${theme.accent}`} />
                <div className={`text-xl font-bold ${theme.textBold}`}>
                  {formatNumber(metrics.commits)}
                </div>
                <div className={`text-xs ${theme.textMuted}`}>Commits</div>
              </div>
              <div className={`text-center p-3 rounded ${isRetro ? "bg-purple-900/10" : "bg-slate-50"}`}>
                <GitPullRequest className={`w-5 h-5 mx-auto mb-2 ${isRetro ? "text-purple-500" : "text-purple-500"}`} />
                <div className={`text-xl font-bold ${theme.textBold}`}>
                  {formatNumber(metrics.pullRequests)}
                </div>
                <div className={`text-xs ${theme.textMuted}`}>Pull Requests</div>
              </div>
              <div className={`text-center p-3 rounded ${isRetro ? "bg-cyan-900/10" : "bg-slate-50"}`}>
                <Code className={`w-5 h-5 mx-auto mb-2 ${isRetro ? "text-cyan-500" : "text-cyan-500"}`} />
                <div className={`text-xl font-bold ${isRetro ? "text-cyan-400" : "text-cyan-600"}`}>
                  +{formatNumber(metrics.linesOfCode.added)}
                </div>
                <div className={`text-xs ${theme.textMuted}`}>Lines Added</div>
              </div>
              <div className={`text-center p-3 rounded ${isRetro ? "bg-red-900/10" : "bg-slate-50"}`}>
                <Code className={`w-5 h-5 mx-auto mb-2 ${isRetro ? "text-red-500" : "text-red-500"}`} />
                <div className={`text-xl font-bold ${isRetro ? "text-red-400" : "text-red-600"}`}>
                  -{formatNumber(metrics.linesOfCode.removed)}
                </div>
                <div className={`text-xs ${theme.textMuted}`}>Lines Removed</div>
              </div>
            </div>
          </div>

          {/* Cost by Model */}
          {Object.keys(metrics.cost.byModel || {}).length > 0 && (
            <div
              className={`p-6 ${theme.cardBg} ${
                isRetro ? "border" : "rounded-xl"
              } ${theme.border}`}
            >
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${theme.accent}`}
              >
                <DollarSign className="w-4 h-4" />
                Cost by Model
              </h3>
              <div className="space-y-2">
                {Object.entries(metrics.cost.byModel).map(([model, cost]) => (
                  <div
                    key={model}
                    className={`flex justify-between items-center py-2 border-b ${theme.border} last:border-0`}
                  >
                    <span className={`text-sm font-mono ${theme.text}`}>
                      {model}
                    </span>
                    <span className={`font-bold ${isRetro ? "text-yellow-500" : "text-amber-600"}`}>
                      {formatCurrency(cost)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Updated */}
          {lastRefresh && (
            <div className={`text-xs text-center ${theme.textMuted}`}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          )}
        </>
      )}

      {/* Setup Instructions (when not connected) */}
      {!isConnected && !isLoading && (
        <div
          className={`p-6 ${theme.cardBg} ${
            isRetro ? "border" : "rounded-xl"
          } ${theme.border}`}
        >
          <h3
            className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme.accent}`}
          >
            Setup Instructions
          </h3>
          <div className={`space-y-4 text-sm ${theme.text}`}>
            <div>
              <p className={`font-bold mb-2 ${theme.textBold}`}>1. Create Grafana Cloud Account</p>
              <p className={theme.textMuted}>
                Sign up at grafana.com/auth/sign-up/create-user (free tier)
              </p>
            </div>
            <div>
              <p className={`font-bold mb-2 ${theme.textBold}`}>2. Configure Claude Code</p>
              <pre
                className={`p-3 rounded text-xs overflow-x-auto ${
                  isRetro ? "bg-green-900/20 text-green-400" : "bg-slate-100 text-slate-700"
                }`}
              >
{`export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
export OTEL_EXPORTER_OTLP_ENDPOINT=<your-grafana-otlp-endpoint>
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic <token>"`}
              </pre>
            </div>
            <div>
              <p className={`font-bold mb-2 ${theme.textBold}`}>3. Set Cloudflare Environment Variables</p>
              <ul className={`list-disc list-inside ${theme.textMuted}`}>
                <li>GRAFANA_PROMETHEUS_URL</li>
                <li>GRAFANA_INSTANCE_ID</li>
                <li>GRAFANA_API_TOKEN</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaudeTelemetry;

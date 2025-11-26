import React, { useState, useEffect } from "react";
import {
  Terminal,
  Cpu,
  Activity,
  AlertTriangle,
  BarChart2,
  Users,
  ShieldCheck,
  GitCommit,
  Clock,
  Zap,
  Calendar,
  Github,
  TrendingUp,
  Monitor,
  Layout,
  Lock,
} from "lucide-react";
import { githubService } from "./services/githubService";

const MerrickMonitor = () => {
  const [date, setDate] = useState(new Date());
  const [cursorVisible, setCursorVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [viewMode, setViewMode] = useState("RETRO"); // 'RETRO' or 'MINIMAL'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [toolFleet, setToolFleet] = useState([]);
  const [archivedRepos, setArchivedRepos] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const CORRECT_PASSWORD = "peek";

  // Blinking cursor & Time update
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    const cursorTimer = setInterval(() => setCursorVisible((v) => !v), 800);
    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  // Fetch GitHub data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadGitHubData();
      // Refresh data every 5 minutes
      const refreshInterval = setInterval(
        () => {
          loadGitHubData();
        },
        5 * 60 * 1000,
      );

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated]);

  const loadGitHubData = async () => {
    setIsLoadingData(true);
    try {
      const [toolsData, archivedData] = await Promise.all([
        githubService.getAllToolsData(),
        githubService.getArchivedRepos(),
      ]);
      setToolFleet(toolsData);
      setArchivedRepos(archivedData);
    } catch (error) {
      console.error("Failed to load GitHub data:", error);
      // Fallback to mock data if GitHub fails
      setToolFleet(mockToolFleet);
      setArchivedRepos([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Date Helpers
  const formatTime = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (d) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const getCurrentDayShort = () =>
    date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();

  const getWeekRange = () => {
    const curr = new Date();
    const day = curr.getDay() || 7;
    if (day !== 1) curr.setHours(-24 * (day - 1));

    const monday = new Date(curr);
    const friday = new Date(curr);
    friday.setDate(monday.getDate() + 4);

    const opts = { month: "short", day: "numeric" };
    return `${monday.toLocaleDateString("en-US", opts)} - ${friday.toLocaleDateString("en-US", opts)}`;
  };

  // Password Handler
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setShowError(false);
    } else {
      setShowError(true);
      setPasswordInput("");
    }
  };

  // --- THEME ENGINE ---
  const isRetro = viewMode === "RETRO";

  const theme = {
    bg: isRetro ? "bg-black" : "bg-slate-50",
    text: isRetro ? "text-green-500" : "text-slate-600",
    textBold: isRetro ? "text-green-400" : "text-slate-900",
    textMuted: isRetro ? "text-green-700" : "text-slate-400",
    border: isRetro ? "border-green-800" : "border-slate-200",
    cardBg: isRetro ? "bg-black" : "bg-white shadow-sm border border-slate-200",
    font: isRetro ? "font-mono" : "font-sans",
    accent: isRetro ? "text-green-400" : "text-indigo-600",
    accentBg: isRetro ? "bg-green-500" : "bg-indigo-600",
    success: isRetro ? "text-green-500" : "text-emerald-600",
    warning: isRetro ? "text-green-500" : "text-amber-600",
    tableHeader: isRetro
      ? "text-green-700 border-green-800"
      : "text-slate-400 border-slate-100",
    gridActive: isRetro
      ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"
      : "bg-indigo-600",
    gridInactive: isRetro ? "bg-green-900/30" : "bg-slate-200",
    selection: isRetro
      ? "selection:bg-green-900 selection:text-green-100"
      : "selection:bg-indigo-100 selection:text-indigo-900",
  };

  // --- MOCK DATA (Fallback) ---

  const mockToolFleet = [
    {
      id: 1,
      name: "ON_PAGE_JOSH_BOT",
      type: "BOT",
      status: "LIVE",
      users: 12,
      trend: "UP",
      activity: [1, 0, 0, 0, 0],
    },
    {
      id: 2,
      name: "RANDY_PEM_DASH",
      type: "DASH",
      status: "LIVE",
      users: 45,
      trend: "STABLE",
      activity: [0, 0, 1, 0, 0],
    },
    {
      id: 3,
      name: "INTERLINKING_SYS",
      type: "SEO",
      status: "LIVE",
      users: 8,
      trend: "UP",
      activity: [0, 0, 0, 0, 0],
    },
    {
      id: 4,
      name: "LSI_ANALYZER",
      type: "SEO",
      status: "BETA",
      users: 3,
      trend: "FLAT",
      activity: [0, 1, 0, 0, 0],
    },
    {
      id: 5,
      name: "GMC_TITLE_DASH",
      type: "DASH",
      status: "LIVE",
      users: 22,
      trend: "UP",
      activity: [0, 0, 0, 0, 0],
    },
    {
      id: 6,
      name: "META_CHECKER",
      type: "TOOL",
      status: "LIVE",
      users: 156,
      trend: "UP",
      activity: [1, 1, 0, 0, 0],
    },
    {
      id: 7,
      name: "SEASONAL_SALLY",
      type: "BOT",
      status: "MAINT",
      users: 4,
      trend: "DOWN",
      activity: [0, 0, 0, 1, 0],
    },
    {
      id: 8,
      name: "METAOBJECTS_AUTO",
      type: "AUTO",
      status: "LIVE",
      users: 19,
      trend: "STABLE",
      activity: [0, 0, 0, 0, 0],
    },
    {
      id: 9,
      name: "SCHEMA_SCANNER",
      type: "TOOL",
      status: "LIVE",
      users: 89,
      trend: "UP",
      activity: [0, 0, 0, 0, 1],
    },
    {
      id: 10,
      name: "COMPETITOR_SCRAPE",
      type: "SCRAPE",
      status: "LIVE",
      users: 12,
      trend: "STABLE",
      activity: [1, 0, 0, 0, 0],
    },
  ];

  const systems = [
    {
      id: "SYS_01",
      name: "LEGACY_CRM",
      status: "OK",
      latency: "45ms",
      uptime: "99.9%",
    },
    {
      id: "SYS_02",
      name: "DATA_WH",
      status: "WARN",
      latency: "820ms",
      uptime: "98.5%",
    },
    {
      id: "SYS_03",
      name: "INT_WIKI",
      status: "OK",
      latency: "12ms",
      uptime: "99.99%",
    },
    {
      id: "SYS_04",
      name: "CI_PIPELINE",
      status: "OK",
      latency: "110ms",
      uptime: "100%",
    },
  ];

  const weeklySchedule = {
    MON: [
      { id: 1, task: "Patch: Josh Bot", type: "MAINT", status: "DONE" },
      { id: 2, task: "User Training", type: "ADOPT", status: "DONE" },
    ],
    TUE: [{ id: 3, task: "LSI Logic Tweak", type: "FEAT", status: "IN_PROG" }],
    WED: [
      { id: 4, task: "Randy Dash Update", type: "MAINT", status: "PENDING" },
    ],
    THU: [
      { id: 5, task: "Seasonal Sally Fix", type: "MAINT", status: "PENDING" },
    ],
    FRI: [
      { id: 6, task: "Schema Scan Check", type: "MAINT", status: "PENDING" },
    ],
  };

  const reactiveLoad = 15;
  const totalUsers = toolFleet.reduce((acc, curr) => acc + curr.users, 0);

  // --- RENDER HELPERS ---

  const ProgressBar = ({ percent }) => {
    if (isRetro) {
      const length = 20;
      const filledLen = Math.round((length * percent) / 100);
      const emptyLen = length - filledLen;
      return (
        <span className="opacity-90">
          {"▓".repeat(filledLen) + "░".repeat(emptyLen)}
        </span>
      );
    }
    return (
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  };

  const Sparkline = ({ data }) => {
    if (isRetro) {
      const chars = [" ", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
      const max = Math.max(...data);
      const str = data.map((v) => chars[Math.floor((v / max) * 7)]).join("");
      return <span className="font-mono tracking-widest">{str}</span>;
    }
    return (
      <div className="flex items-end gap-0.5 h-6">
        {data.map((v, i) => (
          <div
            key={i}
            className="w-1 bg-indigo-200 rounded-t-sm"
            style={{ height: `${(v / Math.max(...data)) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  const ActivityGrid = ({ activity }) => {
    return (
      <div className="flex gap-1.5 items-center">
        {["M", "T", "W", "T", "F"].map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-0.5">
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${activity[idx] ? theme.gridActive : theme.gridInactive}`}
            ></div>
          </div>
        ))}
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const getColors = () => {
      if (isRetro) {
        if (status === "LIVE")
          return "border-green-800 text-green-400 bg-green-900/20";
        if (status === "BETA") return "border-yellow-900 text-yellow-600";
        return "border-red-900 text-red-800";
      }
      if (status === "LIVE")
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      if (status === "BETA")
        return "bg-amber-100 text-amber-700 border-amber-200";
      return "bg-slate-100 text-slate-600 border-slate-200";
    };

    return (
      <span
        className={`px-2 py-0.5 text-[10px] rounded border font-medium ${getColors()}`}
      >
        {status}
      </span>
    );
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4 selection:bg-green-900 selection:text-green-100">
        <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />

        <div className="max-w-md w-full border-2 border-green-900 p-8 bg-black shadow-[0_0_30px_rgba(34,197,94,0.1)] relative z-10">
          <div className="flex items-center justify-center mb-8">
            <Lock className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-green-400 uppercase tracking-widest">
            ACCESS REQUIRED
          </h1>
          <p className="text-xs text-green-700 text-center mb-8 tracking-wide">
            MERRICK MONITOR // AUTHENTICATION PORTAL
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-green-600 mb-2 uppercase tracking-wider">
                Enter Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-black border-2 border-green-800 text-green-400 px-4 py-3 focus:outline-none focus:border-green-500 transition-colors font-mono"
                placeholder="••••••••"
                autoFocus
              />
              {showError && (
                <p className="text-xs text-red-500 mt-2 animate-pulse">
                  ACCESS DENIED - INVALID PASSWORD
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-900 hover:bg-green-800 text-green-100 font-bold py-3 px-4 border-2 border-green-700 hover:border-green-500 transition-all uppercase tracking-widest"
            >
              → AUTHENTICATE
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="text-xs text-green-800">
              {formatTime(date)}
              <span
                className={`ml-1 ${cursorVisible ? "opacity-100" : "opacity-0"} transition-opacity`}
              >
                _
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEWS ---

  const OverviewView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-4">
      {/* Left Column (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Ops Load Section */}
        <section
          className={`p-6 transition-colors duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
        >
          <h2
            className={`text-xs font-bold uppercase mb-4 flex items-center gap-2 ${theme.accent}`}
          >
            <Activity className="w-4 h-4" />
            Maintenance Load
          </h2>
          <div className="flex justify-between text-xs mb-3 tracking-wide">
            <span className={theme.textMuted}>Stable Ops</span>
            <span
              className={`font-bold ${isRetro ? "text-green-400" : "text-indigo-600"}`}
            >
              Reactive Fixes: {reactiveLoad}%
            </span>
          </div>
          <ProgressBar percent={100 - reactiveLoad} />
        </section>

        {/* Live Tool Fleet Table */}
        <section
          className={`p-6 transition-colors duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-xs font-bold uppercase flex items-center gap-2 ${theme.accent}`}
            >
              <Cpu className="w-4 h-4" />
              Live Tool Fleet
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={loadGitHubData}
                disabled={isLoadingData}
                className={`text-[10px] uppercase tracking-wider flex items-center gap-1 transition-opacity ${theme.textMuted} ${isLoadingData ? "opacity-50 cursor-not-allowed" : "hover:opacity-70 cursor-pointer"}`}
                title="Refresh GitHub data"
              >
                <Activity
                  className={`w-3 h-3 ${isLoadingData ? "animate-spin" : ""}`}
                />
                {isLoadingData ? "Loading..." : "Refresh"}
              </button>
              <span
                className={`text-[10px] uppercase tracking-wider flex items-center gap-1 ${theme.textMuted}`}
              >
                <Github className="w-3 h-3" /> Activity
              </span>
              <span
                className={`text-xs flex items-center gap-1.5 ${theme.success} ${isLoadingData ? "animate-pulse" : ""}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isRetro ? "bg-green-500" : "bg-emerald-500"}`}
                ></span>
                {isLoadingData ? "Syncing" : "Live"}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-xs uppercase tracking-wider ${theme.tableHeader}`}
                >
                  <th className="p-3 font-normal w-12">ID</th>
                  <th className="p-3 font-normal">Tool Name</th>
                  <th className="p-3 font-normal">Activity (M-F)</th>
                  <th className="p-3 font-normal">Status</th>
                  <th className="p-3 font-normal text-right">Users</th>
                </tr>
              </thead>
              <tbody
                className={`text-xs md:text-sm ${isRetro ? "font-mono" : ""}`}
              >
                {toolFleet.map((tool) => (
                  <tr
                    key={tool.id}
                    className={`border-b transition-colors ${isRetro ? "border-green-900/40 hover:bg-green-900/10" : "border-slate-100 hover:bg-slate-50"}`}
                  >
                    <td className={`p-3 ${theme.textMuted}`}>
                      {tool.id < 10 ? `0${tool.id}` : tool.id}
                    </td>
                    <td
                      className={`p-3 font-medium transition-colors ${theme.textBold}`}
                    >
                      {tool.repoUrl ? (
                        <a
                          href={tool.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`hover:underline flex items-center gap-1 ${isRetro ? "hover:text-green-300" : "hover:text-indigo-700"}`}
                        >
                          {tool.name}
                          <Github className="w-3 h-3 opacity-50" />
                        </a>
                      ) : (
                        <div>{tool.name}</div>
                      )}
                      <div
                        className={`text-[10px] font-normal ${theme.textMuted}`}
                      >
                        {tool.type} {tool.repoName && `• ${tool.repoName}`}
                      </div>
                    </td>
                    <td className="p-3">
                      <ActivityGrid activity={tool.activity} />
                    </td>
                    <td className="p-3">
                      <StatusBadge status={tool.status} />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`font-bold ${theme.textBold}`}>
                          {tool.users}
                        </span>
                        {tool.trend === "UP" && (
                          <TrendingUp className={`w-3 h-3 ${theme.success}`} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Right Column (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Weekly Timeline */}
        <section
          className={`p-6 transition-colors duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
        >
          <h2
            className={`text-xs font-bold uppercase mb-6 flex items-center gap-2 ${theme.accent}`}
          >
            <Calendar className="w-4 h-4" />
            Weekly Log
          </h2>
          <div
            className={`text-xs mb-4 border-b pb-2 ${theme.tableHeader} ${theme.textMuted}`}
          >
            Current Week: {getWeekRange()}
          </div>
          <div className="space-y-4">
            {Object.entries(weeklySchedule).map(([day, tasks]) => {
              const isToday = day === getCurrentDayShort();
              return (
                <div
                  key={day}
                  className={`flex gap-4 p-2 -mx-2 rounded transition-colors ${isToday ? (isRetro ? "bg-green-900/20 border border-green-900" : "bg-indigo-50 border border-indigo-100") : ""}`}
                >
                  <div
                    className={`text-xs font-bold w-8 pt-1 ${isToday ? theme.accent : theme.textMuted}`}
                  >
                    {day}{" "}
                    {isToday && (
                      <span className="animate-pulse text-[8px] block">
                        NOW
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex-1 space-y-2 border-l pl-4 ${isToday ? (isRetro ? "border-green-500" : "border-indigo-400") : isRetro ? "border-green-900" : "border-slate-200"}`}
                  >
                    {tasks.length > 0 ? (
                      tasks.map((t) => (
                        <div key={t.id} className="text-xs group">
                          <span
                            className={`text-[9px] mr-2 px-1 rounded uppercase font-bold tracking-wide ${t.status === "DONE" ? (isRetro ? "text-green-500 line-through opacity-50" : "text-slate-400 line-through") : theme.accent}`}
                          >
                            {t.type}
                          </span>
                          <span
                            className={
                              t.status === "DONE"
                                ? theme.textMuted
                                : theme.textBold
                            }
                          >
                            {t.task}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className={`text-[10px] italic ${theme.textMuted}`}>
                        -- No Activity --
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* System Diagnostics */}
        <section
          className={`p-6 transition-colors duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
        >
          <h2
            className={`text-xs font-bold uppercase mb-6 border-b pb-2 flex items-center gap-2 ${theme.tableHeader}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Fleet Health
          </h2>
          <div className="space-y-5">
            {systems.map((sys) => (
              <div
                key={sys.id}
                className={`flex items-center justify-between text-xs group p-2 -mx-2 rounded transition-colors cursor-default ${isRetro ? "hover:bg-green-900/10" : "hover:bg-slate-50"}`}
              >
                <div>
                  <div className={`font-bold mb-1 ${theme.textBold}`}>
                    {sys.name}
                  </div>
                  <div className={`text-[10px] font-mono ${theme.textMuted}`}>
                    LAT: {sys.latency}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold inline-block px-1.5 py-0.5 rounded text-[10px] ${sys.status === "WARN" ? (isRetro ? "bg-green-500 text-black" : "bg-amber-100 text-amber-700") : isRetro ? "text-green-500" : "bg-emerald-100 text-emerald-700"}`}
                  >
                    {sys.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const AdoptionView = () => (
    <div
      className={`p-6 animate-in fade-in duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
    >
      <h2
        className={`text-xs font-bold uppercase mb-8 flex items-center gap-2 ${theme.accent}`}
      >
        <Users className="w-4 h-4" />
        Detailed Adoption Metrics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {toolFleet.map((tool) => (
          <div
            key={tool.id}
            className={`p-5 transition-all ${isRetro ? "border border-green-800 bg-green-900/5 hover:bg-green-900/20 hover:border-green-600" : "bg-slate-50 rounded-xl hover:bg-white hover:shadow-md border border-slate-100"}`}
          >
            <div className={`text-xs mb-3 font-semibold ${theme.textMuted}`}>
              {tool.name}
            </div>
            <div className="flex justify-between items-end mb-4">
              <div className={`text-3xl font-bold ${theme.textBold}`}>
                {tool.users}
              </div>
              <div className={`text-[10px] mb-1 ${theme.textMuted}`}>
                ACTIVE USERS
              </div>
            </div>
            <div
              className={`pt-4 border-t flex justify-between items-center ${isRetro ? "border-green-900" : "border-slate-200"}`}
            >
              <Sparkline
                data={[10, 25, 40, 30, 60, tool.users - 10, tool.users]}
              />
              <div
                className={`text-[10px] font-bold ${tool.trend === "UP" ? theme.success : theme.textMuted}`}
              >
                {tool.trend === "UP"
                  ? "↑ GROWTH"
                  : tool.trend === "DOWN"
                    ? "↓ CHURN"
                    : "→ STABLE"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ArchivedView = () => (
    <div
      className={`p-6 animate-in fade-in duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
    >
      <h2
        className={`text-xs font-bold uppercase mb-8 flex items-center gap-2 ${theme.accent}`}
      >
        <GitCommit className="w-4 h-4" />
        Archived Projects
      </h2>
      {archivedRepos.length === 0 ? (
        <div className={`text-center py-12 ${theme.textMuted}`}>
          <p className="text-sm">No archived projects</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-xs uppercase tracking-wider ${theme.tableHeader}`}
              >
                <th className="p-3 font-normal">Project Name</th>
                <th className="p-3 font-normal">Repository</th>
                <th className="p-3 font-normal">Type</th>
                <th className="p-3 font-normal">Archived Date</th>
                <th className="p-3 font-normal">Description</th>
              </tr>
            </thead>
            <tbody
              className={`text-xs md:text-sm ${isRetro ? "font-mono" : ""}`}
            >
              {archivedRepos.map((repo) => (
                <tr
                  key={repo.id}
                  className={`border-b transition-colors ${isRetro ? "border-green-900/40 hover:bg-green-900/10" : "border-slate-100 hover:bg-slate-50"}`}
                >
                  <td className={`p-3 font-medium ${theme.textBold}`}>
                    {repo.name}
                  </td>
                  <td className="p-3">
                    {repo.repoUrl ? (
                      <a
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:underline flex items-center gap-1 ${isRetro ? "hover:text-green-300" : "hover:text-indigo-700"}`}
                      >
                        {repo.repoName}
                        <Github className="w-3 h-3 opacity-50" />
                      </a>
                    ) : (
                      <span className={theme.textMuted}>{repo.repoName}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${isRetro ? "border-green-900 text-green-700" : "border-slate-200 text-slate-600"}`}
                    >
                      {repo.type}
                    </span>
                  </td>
                  <td className={`p-3 ${theme.textMuted}`}>
                    {repo.archivedDate}
                  </td>
                  <td className={`p-3 ${theme.textMuted}`}>
                    {repo.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen p-4 md:p-8 overflow-hidden relative transition-colors duration-500 ${theme.bg} ${theme.text} ${theme.font} ${theme.selection}`}
    >
      {/* Scanline Effect (Only in Retro Mode) */}
      {isRetro && (
        <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      )}

      {/* Main Container */}
      <div
        className={`max-w-7xl mx-auto p-1 relative z-10 transition-all duration-300 ${isRetro ? "border-2 border-green-900 shadow-[0_0_30px_rgba(34,197,94,0.05)]" : ""}`}
      >
        {/* Header Section */}
        <header
          className={`p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors duration-300 ${isRetro ? "border-b-2 border-green-900 bg-black" : "bg-transparent"}`}
        >
          <div>
            <h1
              className={`text-3xl font-bold uppercase tracking-widest flex items-center gap-3 ${theme.textBold}`}
            >
              {isRetro ? (
                <Terminal className="w-8 h-8" />
              ) : (
                <Layout className="w-8 h-8" />
              )}
              Merrick Monitor
            </h1>
            <p
              className={`text-xs mt-2 tracking-wide font-medium ${theme.textMuted}`}
            >
              FLEET_STATUS: OPERATIONAL // v.2.2
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            {/* Mode Toggle */}
            <div
              className={`flex items-center p-1 rounded-lg ${isRetro ? "border border-green-900" : "bg-slate-200/50"}`}
            >
              <button
                onClick={() => setViewMode("RETRO")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${isRetro ? "bg-green-900 text-green-100" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Terminal className="w-3 h-3 inline mr-1" /> TERMINAL
              </button>
              <button
                onClick={() => setViewMode("MINIMAL")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${!isRetro ? "bg-white shadow text-slate-800" : "text-green-800 hover:text-green-600"}`}
              >
                <Monitor className="w-3 h-3 inline mr-1" /> CLEAN
              </button>
            </div>

            <div className="text-right">
              <div className={`font-bold text-2xl mb-1 ${theme.textBold}`}>
                {formatTime(date)}
                {isRetro && (
                  <span
                    className={`${cursorVisible ? "opacity-100" : "opacity-0"} transition-opacity`}
                  >
                    _
                  </span>
                )}
              </div>
              <div
                className={`text-xs font-bold mb-2 uppercase tracking-wide ${theme.textMuted}`}
              >
                {formatDate(date)}
              </div>
              {/* Tab Navigation */}
              <div className="flex justify-end gap-6 text-xs mt-2">
                {["OVERVIEW", "ADOPTION", "ARCHIVED"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`uppercase tracking-widest transition-colors py-1 font-bold ${activeTab === tab ? `${theme.accent} border-b-2 ${isRetro ? "border-green-500" : "border-indigo-600"}` : theme.textMuted}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Top Stats Row (Always Visible) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 px-4 md:px-6">
          <div
            className={`p-4 transition-all duration-300 ${theme.cardBg} ${isRetro ? "border border-green-900 bg-green-900/5" : "rounded-xl"}`}
          >
            <div
              className={`text-[10px] mb-1 uppercase tracking-wider font-bold ${theme.textMuted}`}
            >
              Maintenance Load
            </div>
            <div
              className={`text-2xl font-bold ${isRetro ? (reactiveLoad > 30 ? "text-green-400" : "text-green-600") : reactiveLoad > 30 ? "text-amber-600" : "text-slate-700"}`}
            >
              {reactiveLoad}%
            </div>
          </div>
          <div
            className={`p-4 transition-all duration-300 ${theme.cardBg} ${isRetro ? "border border-green-900 bg-green-900/5" : "rounded-xl"}`}
          >
            <div
              className={`text-[10px] mb-1 uppercase tracking-wider font-bold ${theme.textMuted}`}
            >
              Live Tools
            </div>
            <div className={`text-2xl font-bold ${theme.textBold}`}>
              {toolFleet.length}{" "}
              <span className={`text-xs ${theme.textMuted}`}>ONLINE</span>
            </div>
          </div>
          <div
            className={`p-4 transition-all duration-300 ${theme.cardBg} ${isRetro ? "border border-green-900 bg-green-900/5" : "rounded-xl"}`}
          >
            <div
              className={`text-[10px] mb-1 uppercase tracking-wider font-bold ${theme.textMuted}`}
            >
              Total Users
            </div>
            <div className={`text-2xl font-bold ${theme.textBold}`}>
              {totalUsers}{" "}
              <span className={`text-xs ${theme.textMuted}`}>ACROSS_FLEET</span>
            </div>
          </div>
          <div
            className={`p-4 transition-all duration-300 ${theme.cardBg} ${isRetro ? "border border-green-900 bg-green-900/5" : "rounded-xl"}`}
          >
            <div
              className={`text-[10px] mb-1 uppercase tracking-wider font-bold ${theme.textMuted}`}
            >
              System Health
            </div>
            <div className={`text-2xl font-bold ${theme.success}`}>
              98% <span className={`text-xs ${theme.textMuted}`}>NOMINAL</span>
            </div>
          </div>
        </div>

        {/* Currently Working On Section */}
        <div className="px-4 md:px-6 mb-8">
          <div
            className={`p-6 transition-all duration-300 ${theme.cardBg} ${isRetro ? "border-2" : "rounded-xl"} ${isRetro ? "border-green-500" : "border-indigo-200"} ${isRetro ? "bg-green-900/10" : "bg-gradient-to-r from-indigo-50 to-purple-50"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`${isRetro ? "bg-green-500" : "bg-indigo-600"} p-2 rounded ${isRetro ? "" : "shadow-md"}`}
                >
                  <Zap
                    className={`w-5 h-5 ${isRetro ? "text-black" : "text-white"}`}
                  />
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider ${isRetro ? "text-green-300" : "text-indigo-900"}`}
                  >
                    Currently Working On
                  </h3>
                  <p
                    className={`text-[10px] ${isRetro ? "text-green-600" : "text-indigo-500"} mt-0.5`}
                  >
                    Active Development
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isRetro ? "bg-green-900 text-green-300 border border-green-700" : "bg-indigo-100 text-indigo-700"}`}
              >
                IN PROGRESS
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div
                  className={`text-lg font-bold mb-2 ${isRetro ? "text-green-400" : "text-slate-900"}`}
                >
                  On-Page SEO Josh Bot
                </div>
                <p
                  className={`text-sm mb-4 ${isRetro ? "text-green-600" : "text-slate-600"}`}
                >
                  Enhancing automated on-page SEO analysis with improved
                  metadata detection and schema validation capabilities
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2 py-1 text-[10px] rounded ${isRetro ? "bg-green-900/50 text-green-400 border border-green-800" : "bg-white text-indigo-600 border border-indigo-200"}`}
                  >
                    BOT
                  </span>
                  <span
                    className={`px-2 py-1 text-[10px] rounded ${isRetro ? "bg-green-900/50 text-green-400 border border-green-800" : "bg-white text-indigo-600 border border-indigo-200"}`}
                  >
                    SEO AUTOMATION
                  </span>
                  <span
                    className={`px-2 py-1 text-[10px] rounded ${isRetro ? "bg-green-900/50 text-green-400 border border-green-800" : "bg-white text-indigo-600 border border-indigo-200"}`}
                  >
                    METADATA
                  </span>
                </div>
              </div>
              <div
                className={`hidden md:flex flex-col items-end gap-2 min-w-[120px]`}
              >
                <div
                  className={`text-xs uppercase tracking-wider ${isRetro ? "text-green-700" : "text-slate-400"}`}
                >
                  Progress
                </div>
                <div className={`text-3xl font-bold ${theme.accent}`}>65%</div>
                <div className="w-full mt-2">
                  <div
                    className={`h-2 rounded-full overflow-hidden ${isRetro ? "bg-green-900/30" : "bg-slate-200"}`}
                  >
                    <div
                      className={`h-full ${isRetro ? "bg-green-500" : "bg-indigo-600"} transition-all duration-500`}
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 md:px-6 pb-6 min-h-[500px]">
          {activeTab === "OVERVIEW" && <OverviewView />}
          {activeTab === "ADOPTION" && <AdoptionView />}
          {activeTab === "ARCHIVED" && <ArchivedView />}
        </div>
      </div>
    </div>
  );
};

export default MerrickMonitor;

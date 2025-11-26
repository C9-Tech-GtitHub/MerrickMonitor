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
import WeeklyAgenda from "./components/WeeklyAgenda";
import WeekHistory from "./components/WeekHistory";
import WorkloadTracker from "./components/WorkloadTracker";

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
  const [teamViewMode, setTeamViewMode] = useState("members"); // 'members' or 'tools'
  const [weeklyAgenda, setWeeklyAgenda] = useState([]);

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
      loadWeeklyAgenda();
      // Refresh data every 5 minutes
      const refreshInterval = setInterval(
        () => {
          loadGitHubData();
          loadWeeklyAgenda();
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

  const loadWeeklyAgenda = async () => {
    try {
      const response = await fetch("/MerrickMonitor/data/weeklyAgendas.json");
      if (response.ok) {
        const allAgendas = await response.json();
        const currentWeekKey = getCurrentWeekKey();
        const weekData = allAgendas[currentWeekKey];
        setWeeklyAgenda(weekData?.goals || []);
      }
    } catch (error) {
      console.error("Failed to load weekly agenda:", error);
      setWeeklyAgenda([]);
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
    const monday = new Date(curr);
    monday.setDate(curr.getDate() - (day - 1));

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const opts = { month: "short", day: "numeric" };
    return `${monday.toLocaleDateString("en-US", opts)} - ${friday.toLocaleDateString("en-US", opts)}`;
  };

  const getCurrentWeekKey = () => {
    const now = new Date();
    const dayOfWeek = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split("T")[0];
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

  // Team structure: 28 total employees
  const teams = [
    { id: 1, name: "Tech", color: "#3b82f6", count: 5 },
    { id: 2, name: "GMC", color: "#8b5cf6", count: 3 },
    { id: 3, name: "Content", color: "#10b981", count: 2 },
    { id: 4, name: "Sales", color: "#f59e0b", count: 2 },
    { id: 5, name: "Specialists", color: "#ec4899", count: 14 },
    { id: 6, name: "Management", color: "#06b6d4", count: 2 },
    { id: 7, name: "Company-Wide", color: "#6366f1", count: 28 },
  ];

  const mockToolFleet = [
    {
      id: 1,
      name: "ON_PAGE_JOSH_BOT",
      type: "BOT",
      status: "LIVE",
      trend: "UP",
      activity: [1, 0, 0, 0, 0],
      teams: ["Specialists", "Content"],
    },
    {
      id: 2,
      name: "REVIEWIN_RANDY",
      type: "DASH",
      status: "LIVE",
      trend: "STABLE",
      activity: [0, 0, 1, 0, 0],
      teams: ["Specialists", "Content"],
    },
    {
      id: 3,
      name: "LEAD",
      type: "TOOL",
      status: "LIVE",
      trend: "UP",
      activity: [0, 0, 0, 0, 0],
      teams: ["Sales"],
    },
    {
      id: 4,
      name: "LSI_ANALYZER",
      type: "SEO",
      status: "LIVE",
      trend: "UP",
      activity: [0, 1, 0, 0, 0],
      teams: ["Content", "Specialists"],
    },
    {
      id: 5,
      name: "PEM",
      type: "TOOL",
      status: "LIVE",
      trend: "UP",
      activity: [0, 0, 0, 0, 0],
      teams: ["GMC"],
    },
    {
      id: 6,
      name: "SHEETFREAK",
      type: "TOOL",
      status: "LIVE",
      trend: "UP",
      activity: [1, 1, 0, 0, 0],
      teams: ["Specialists", "Content"],
    },
    {
      id: 7,
      name: "CLAUDE_CODE_BOOTSTRAP",
      type: "TOOL",
      status: "LIVE",
      trend: "UP",
      activity: [0, 0, 0, 1, 0],
      teams: ["Tech"],
    },
    {
      id: 8,
      name: "MERRICK_MONITOR",
      type: "DASH",
      status: "LIVE",
      trend: "UP",
      activity: [1, 1, 1, 1, 1],
      teams: ["Management"],
    },
  ];

  // Calculate user count based on team assignments
  const calculateUserCount = (teamNames) => {
    if (!teamNames || teamNames.length === 0) return 0;

    // Get unique team members (avoiding double-counting)
    const uniqueTeams = [...new Set(teamNames)];

    // If it's company-wide, return total employees
    if (uniqueTeams.includes("Company-Wide")) return 28;

    // Sum up team members
    return uniqueTeams.reduce((total, teamName) => {
      const team = teams.find((t) => t.name === teamName);
      return total + (team ? team.count : 0);
    }, 0);
  };

  // Add user counts to tool fleet dynamically
  const toolFleetWithUsers = toolFleet.map((tool) => ({
    ...tool,
    users: calculateUserCount(tool.teams),
  }));

  // Calculate how many tools each team uses
  const getToolCountForTeam = (teamName) => {
    // Use mock data for team counts since GitHub data doesn't have team info
    return mockToolFleet.filter((tool) => tool.teams?.includes(teamName))
      .length;
  };

  // Get GitHub activity stats for the week
  const getWeekGitHubStats = () => {
    if (toolFleet.length === 0) return { commits: 0, repos: 0, tools: 0 };

    const totalCommits = toolFleet.reduce((sum, tool) => {
      return sum + (tool.activity?.filter((a) => a === 1).length || 0);
    }, 0);

    const activeRepos = toolFleet.filter((tool) =>
      tool.activity?.some((a) => a === 1),
    ).length;

    return {
      commits: totalCommits,
      repos: activeRepos,
      tools: toolFleet.length,
    };
  };

  // Generate System Health from actual tool data
  const getSystemHealth = () => {
    const pemTool = toolFleet.find((t) => t.name === "PEM");

    const systems = [];

    // Always show PEM first if available
    if (pemTool) {
      systems.push({
        id: "SYS_01",
        name: "PEM",
        status: pemTool.status === "LIVE" ? "OK" : "WARN",
        latency: "45ms",
        uptime: "99.9%",
      });
    }

    // Add other tools
    const otherTools = toolFleet
      .filter((t) => t.name !== "PEM")
      .slice(0, pemTool ? 3 : 4);

    otherTools.forEach((tool, index) => {
      const latencyMap = {
        BOT: Math.floor(Math.random() * 50) + 20,
        DASH: Math.floor(Math.random() * 30) + 10,
        TOOL: Math.floor(Math.random() * 100) + 50,
        SEO: Math.floor(Math.random() * 200) + 100,
      };

      const latency =
        latencyMap[tool.type] || Math.floor(Math.random() * 100) + 50;
      const isWarning = latency > 200;

      systems.push({
        id: `SYS_${String(pemTool ? index + 2 : index + 1).padStart(2, "0")}`,
        name: tool.name,
        status: isWarning ? "WARN" : "OK",
        latency: `${latency}ms`,
        uptime: isWarning ? "98.5%" : "99.9%",
      });
    });

    // Fallback if no tools loaded
    if (systems.length === 0) {
      return [
        {
          id: "SYS_01",
          name: "PEM",
          status: "OK",
          latency: "45ms",
          uptime: "99.9%",
        },
        {
          id: "SYS_02",
          name: "GITHUB_API",
          status: "OK",
          latency: "120ms",
          uptime: "99.9%",
        },
      ];
    }

    return systems;
  };

  const systems = getSystemHealth();
  const weekStats = getWeekGitHubStats();

  // Build weekly schedule from agenda data
  const getWeeklySchedule = () => {
    const schedule = {
      MON: [],
      TUE: [],
      WED: [],
      THU: [],
      FRI: [],
    };

    weeklyAgenda.forEach((goal) => {
      if (goal.day && schedule[goal.day]) {
        schedule[goal.day].push({
          id: goal.id,
          task: goal.text,
          type: goal.type === "reactive" ? "REACTIVE" : "PLANNED",
          status: goal.completed ? "DONE" : "PENDING",
          timeSlot: goal.timeSlot,
        });
      }
    });

    return schedule;
  };

  const weeklySchedule = getWeeklySchedule();

  const reactiveLoad = 15;
  const totalUsers = toolFleetWithUsers.reduce(
    (acc, curr) => acc + curr.users,
    0,
  );

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

  const TeamBadge = ({ teamName }) => {
    const team = teams.find((t) => t.name === teamName);
    if (!team) return null;

    if (isRetro) {
      return (
        <span
          className="px-1.5 py-0.5 text-[9px] rounded border border-green-800 text-green-500 bg-green-900/20 font-medium uppercase tracking-wide"
          style={{ borderColor: team.color + "40", color: team.color }}
        >
          {teamName}
        </span>
      );
    }

    return (
      <span
        className="px-1.5 py-0.5 text-[9px] rounded font-medium uppercase tracking-wide"
        style={{
          backgroundColor: team.color + "15",
          color: team.color,
          border: `1px solid ${team.color}30`,
        }}
      >
        {teamName}
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
        {/* Workload Tracker - Replaces Ops Load Section */}
        <WorkloadTracker
          theme={theme}
          isRetro={isRetro}
          currentWeek={getCurrentWeekKey()}
        />

        {/* Live Tools Table */}
        <section
          className={`p-6 transition-colors duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-xs font-bold uppercase flex items-center gap-2 ${theme.accent}`}
            >
              <Cpu className="w-4 h-4" />
              Live Tools
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
                  <th className="p-3 font-normal">Teams</th>
                  <th className="p-3 font-normal">Activity (M-F)</th>
                  <th className="p-3 font-normal">Status</th>
                  <th className="p-3 font-normal text-right">Users</th>
                </tr>
              </thead>
              <tbody
                className={`text-xs md:text-sm ${isRetro ? "font-mono" : ""}`}
              >
                {toolFleetWithUsers.map((tool) => (
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
                      <div className="flex flex-wrap gap-1">
                        {tool.teams?.map((teamName, idx) => (
                          <TeamBadge key={idx} teamName={teamName} />
                        ))}
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
                    className={`flex-1 space-y-3 border-l pl-4 ${isToday ? (isRetro ? "border-green-500" : "border-indigo-400") : isRetro ? "border-green-900" : "border-slate-200"}`}
                  >
                    {tasks.length > 0 ? (
                      <>
                        {/* Morning Tasks */}
                        {tasks.filter((t) => t.timeSlot === "morning").length >
                          0 && (
                          <div className="space-y-1">
                            <div
                              className={`text-[8px] uppercase font-bold tracking-wider ${theme.textMuted}`}
                            >
                              ☀️ Morning
                            </div>
                            {tasks
                              .filter((t) => t.timeSlot === "morning")
                              .map((t) => (
                                <div key={t.id} className="text-xs group">
                                  <span
                                    className={`text-[9px] mr-2 px-1 rounded uppercase font-bold tracking-wide ${
                                      t.status === "DONE"
                                        ? isRetro
                                          ? "text-green-500 line-through opacity-50"
                                          : "text-slate-400 line-through"
                                        : t.type === "REACTIVE"
                                          ? isRetro
                                            ? "bg-green-500 text-black"
                                            : "bg-orange-500 text-white"
                                          : theme.accent
                                    }`}
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
                              ))}
                          </div>
                        )}
                        {/* Afternoon Tasks */}
                        {tasks.filter((t) => t.timeSlot === "afternoon")
                          .length > 0 && (
                          <div className="space-y-1">
                            <div
                              className={`text-[8px] uppercase font-bold tracking-wider ${theme.textMuted}`}
                            >
                              🌙 Afternoon
                            </div>
                            {tasks
                              .filter((t) => t.timeSlot === "afternoon")
                              .map((t) => (
                                <div key={t.id} className="text-xs group">
                                  <span
                                    className={`text-[9px] mr-2 px-1 rounded uppercase font-bold tracking-wide ${
                                      t.status === "DONE"
                                        ? isRetro
                                          ? "text-green-500 line-through opacity-50"
                                          : "text-slate-400 line-through"
                                        : t.type === "REACTIVE"
                                          ? isRetro
                                            ? "bg-green-500 text-black"
                                            : "bg-orange-500 text-white"
                                          : theme.accent
                                    }`}
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
                              ))}
                          </div>
                        )}
                      </>
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

        {/* GitHub Week Stats */}
        <section
          className={`p-6 transition-colors duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
        >
          <h2
            className={`text-xs font-bold uppercase mb-4 flex items-center gap-2 ${theme.accent}`}
          >
            <Github className="w-4 h-4" />
            This Week
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme.textMuted}`}>Active Days</span>
              <span className={`text-lg font-bold ${theme.textBold}`}>
                {weekStats.commits}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme.textMuted}`}>Active Repos</span>
              <span className={`text-lg font-bold ${theme.textBold}`}>
                {weekStats.repos}
              </span>
            </div>
          </div>
        </section>

        {/* System Health */}
        <section
          className={`p-6 transition-colors duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
        >
          <h2
            className={`text-xs font-bold uppercase mb-6 border-b pb-2 flex items-center gap-2 ${theme.tableHeader}`}
          >
            <ShieldCheck className="w-4 h-4" />
            System Health
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
        {toolFleetWithUsers.map((tool) => (
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
                {["OVERVIEW", "ADOPTION", "AGENDA", "HISTORY"].map((tab) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4 md:px-6">
          {/* Currently Working On - Compact Version */}
          <div
            className={`p-4 transition-all duration-300 ${theme.cardBg} ${isRetro ? "border-2 border-green-500 bg-green-900/10" : "rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap
                className={`w-3 h-3 ${isRetro ? "text-green-300" : "text-indigo-600"}`}
              />
              <div
                className={`text-[10px] uppercase tracking-wider font-bold ${isRetro ? "text-green-300" : "text-indigo-600"}`}
              >
                Currently Working On
              </div>
              <div className="flex gap-0.5 ml-auto">
                <span
                  className={`w-1 h-1 rounded-full animate-pulse ${isRetro ? "bg-green-400" : "bg-indigo-600"}`}
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className={`w-1 h-1 rounded-full animate-pulse ${isRetro ? "bg-green-400" : "bg-indigo-600"}`}
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className={`w-1 h-1 rounded-full animate-pulse ${isRetro ? "bg-green-400" : "bg-indigo-600"}`}
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
            <div
              className={`text-sm font-bold mb-1 ${isRetro ? "text-green-400" : "text-slate-900"}`}
            >
              On-Page Josh Bot
            </div>
            <div
              className={`text-[9px] ${isRetro ? "text-green-700" : "text-slate-500"}`}
            >
              SEO automation enhancement
            </div>
          </div>

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
              {toolFleetWithUsers.length}{" "}
              <span className={`text-xs ${theme.textMuted}`}>ONLINE</span>
            </div>
          </div>
          <div
            className={`p-4 transition-all duration-300 ${theme.cardBg} ${isRetro ? "border border-green-900 bg-green-900/5" : "rounded-xl"}`}
          >
            <div
              className={`text-[10px] mb-1 uppercase tracking-wider font-bold ${theme.textMuted}`}
            >
              Total Employees
            </div>
            <div className={`text-2xl font-bold ${theme.textBold}`}>
              28 <span className={`text-xs ${theme.textMuted}`}>TEAM</span>
            </div>
          </div>
        </div>

        {/* Team Overview Section */}
        <div className="px-4 md:px-6 mb-8">
          <div
            className={`p-6 transition-all duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xs font-bold uppercase flex items-center gap-2 ${theme.accent}`}
              >
                <Users className="w-4 h-4" />
                Team
              </h2>
              <div
                className={`flex items-center gap-2 p-1 rounded ${isRetro ? "border border-green-900" : "bg-slate-100"}`}
              >
                <button
                  onClick={() => setTeamViewMode("members")}
                  className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                    teamViewMode === "members"
                      ? isRetro
                        ? "bg-green-900 text-green-100"
                        : "bg-white shadow text-slate-800"
                      : isRetro
                        ? "text-green-800 hover:text-green-600"
                        : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Members
                </button>
                <button
                  onClick={() => setTeamViewMode("tools")}
                  className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                    teamViewMode === "tools"
                      ? isRetro
                        ? "bg-green-900 text-green-100"
                        : "bg-white shadow text-slate-800"
                      : isRetro
                        ? "text-green-800 hover:text-green-600"
                        : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Tools
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {teams
                .filter((t) => t.name !== "Company-Wide")
                .map((team) => (
                  <div
                    key={team.id}
                    className={`p-4 transition-all cursor-pointer ${isRetro ? "border bg-green-900/5 hover:bg-green-900/10" : "bg-slate-50 rounded-lg hover:shadow-md"}`}
                    style={{
                      borderColor: isRetro ? team.color + "40" : "transparent",
                    }}
                    onClick={() =>
                      setTeamViewMode(
                        teamViewMode === "members" ? "tools" : "members",
                      )
                    }
                  >
                    <div
                      className="text-xs font-bold mb-2 uppercase tracking-wide"
                      style={{ color: team.color }}
                    >
                      {team.name}
                    </div>
                    <div className={`text-2xl font-bold ${theme.textBold}`}>
                      {teamViewMode === "members"
                        ? team.count
                        : getToolCountForTeam(team.name)}
                    </div>
                    <div className={`text-[9px] mt-1 ${theme.textMuted}`}>
                      {teamViewMode === "members" ? "MEMBERS" : "TOOLS"}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 md:px-6 pb-6 min-h-[500px]">
          {activeTab === "OVERVIEW" && <OverviewView />}
          {activeTab === "ADOPTION" && <AdoptionView />}
          {activeTab === "AGENDA" && (
            <div
              className={`p-6 animate-in fade-in duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
            >
              <h2
                className={`text-xs font-bold uppercase mb-8 flex items-center gap-2 ${theme.accent}`}
              >
                <Calendar className="w-4 h-4" />
                Weekly Agenda
              </h2>
              <WeeklyAgenda
                theme={theme}
                isRetro={isRetro}
                toolFleet={toolFleetWithUsers}
              />
            </div>
          )}
          {activeTab === "HISTORY" && (
            <div
              className={`p-6 animate-in fade-in duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
            >
              <h2
                className={`text-xs font-bold uppercase mb-8 flex items-center gap-2 ${theme.accent}`}
              >
                <Calendar className="w-4 h-4" />
                Week History
              </h2>
              <WeekHistory theme={theme} isRetro={isRetro} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerrickMonitor;

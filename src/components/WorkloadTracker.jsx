import React, { useState, useEffect } from "react";
import { Activity, Calendar, AlertTriangle, Plus, X } from "lucide-react";
import { weeklySchedule } from "../data/weeklySchedule";

// Helper function to get current week key (Melbourne timezone, 1st-5th pattern)
function getCurrentWeekKey() {
  // Get Melbourne time properly without timezone conversion issues
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Australia/Melbourne",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const dateObj = {};
  parts.forEach(({ type, value }) => {
    dateObj[type] = value;
  });

  const now = new Date(
    parseInt(dateObj.year),
    parseInt(dateObj.month) - 1,
    parseInt(dateObj.day),
  );
  const dayOfMonth = now.getDate();

  // Calculate which 5-day block this day falls into
  const weekNumber = Math.floor((dayOfMonth - 1) / 5);
  const firstDayOfWeek = weekNumber * 5 + 1;

  const weekStart = new Date(now);
  weekStart.setDate(firstDayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString().split("T")[0];
}

/**
 * Workload Tracker Component
 * Toggles between Maintenance Load and Weekly Workload
 * Tracks planned work vs reactive/unplanned tasks
 */
const WorkloadTracker = ({
  theme,
  isRetro,
  currentWeek,
  weekSchedule,
  festiveMode,
}) => {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("workloadViewMode") || "weekly";
  });
  const [reactiveTasks, setReactiveTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  // Persist viewMode to localStorage
  useEffect(() => {
    localStorage.setItem("workloadViewMode", viewMode);
  }, [viewMode]);

  // Load reactive tasks from localStorage
  useEffect(() => {
    const weekKey = getCurrentWeekKey();
    const savedTasks = JSON.parse(
      localStorage.getItem("reactiveTasks") || "{}",
    );
    const weekTasks = savedTasks[weekKey] || [];
    setReactiveTasks(weekTasks);
  }, [currentWeek]);

  // Save reactive tasks to localStorage
  const saveReactiveTasks = (tasks) => {
    const weekKey = getCurrentWeekKey();
    const savedTasks = JSON.parse(
      localStorage.getItem("reactiveTasks") || "{}",
    );
    savedTasks[weekKey] = tasks;
    localStorage.setItem("reactiveTasks", JSON.stringify(savedTasks));
    setReactiveTasks(tasks);
  };

  // Add reactive task
  const handleAddReactiveTask = () => {
    if (newTaskName.trim()) {
      const task = {
        id: Date.now(),
        name: newTaskName.trim(),
        addedAt: new Date().toISOString(),
      };
      saveReactiveTasks([...reactiveTasks, task]);
      setNewTaskName("");
      setIsAddingTask(false);
    }
  };

  // Remove reactive task
  const removeReactiveTask = (id) => {
    saveReactiveTasks(reactiveTasks.filter((t) => t.id !== id));
  };

  // Calculate workload metrics from weekly schedule
  const calculateWorkload = () => {
    // Use passed weekSchedule prop or fall back to imported default
    const scheduleToUse = weekSchedule || weeklySchedule;

    // Count all slots from weekly schedule
    let plannedCount = 0;
    let reactiveCount = 0;
    let festiveCount = 0;
    let completedPlanned = 0;
    let completedReactive = 0;

    scheduleToUse.forEach((day) => {
      day.slots.forEach((slot) => {
        if (slot.type === "planned") {
          plannedCount++;
          if (slot.completed) completedPlanned++;
        } else if (slot.type === "reactive") {
          reactiveCount++;
          if (slot.completed) completedReactive++;
        } else if (slot.type === "christmas") {
          festiveCount++;
        }
      });
    });

    // Fixed 15% R&D allocation
    const rndPercent = 15;

    // Calculate percentages with R&D factored in
    const totalWork = plannedCount + reactiveCount + festiveCount;
    const workPercent = 100 - rndPercent; // 85% for actual work

    const plannedPercent =
      totalWork > 0
        ? Math.round((plannedCount / totalWork) * workPercent)
        : workPercent;
    const reactivePercent =
      totalWork > 0 ? Math.round((reactiveCount / totalWork) * workPercent) : 0;
    const festivePercent =
      totalWork > 0 ? Math.round((festiveCount / totalWork) * workPercent) : 0;

    const completionRate =
      plannedCount > 0
        ? Math.round((completedPlanned / plannedCount) * 100)
        : 0;

    return {
      plannedCount,
      reactiveCount,
      festiveCount,
      totalWork,
      plannedPercent,
      reactivePercent,
      festivePercent,
      rndPercent,
      completedPlanned,
      completionRate,
    };
  };

  const workload = calculateWorkload();

  // Maintenance mode constants (original)
  const maintenanceReactivePercent = 15;

  const ProgressBar = ({
    percent,
    showReactive = false,
    reactivePercent = 0,
    showRnd = false,
    rndPercent = 0,
    showFestive = false,
    festivePercent = 0,
  }) => {
    if (isRetro) {
      // Use dynamic length based on container width (approximate characters that fit)
      const length = 100;
      const plannedLen = Math.round((length * percent) / 100);
      const reactiveLen = showReactive
        ? Math.round((length * reactivePercent) / 100)
        : 0;
      const festiveLen = showFestive
        ? Math.round((length * festivePercent) / 100)
        : 0;
      const rndLen = showRnd ? Math.round((length * rndPercent) / 100) : 0;
      const emptyLen = length - plannedLen - reactiveLen - festiveLen - rndLen;

      return (
        <div className="opacity-90 tracking-tighter text-xs overflow-hidden break-all">
          {"▓".repeat(plannedLen)}
          {showReactive && (
            <span className="text-yellow-500">{"▓".repeat(reactiveLen)}</span>
          )}
          {showFestive && (
            <span className="text-red-500 animate-pulse">
              {"▓".repeat(festiveLen)}
            </span>
          )}
          {showRnd && (
            <span className="text-purple-500">{"▓".repeat(rndLen)}</span>
          )}
          {"░".repeat(emptyLen)}
        </div>
      );
    }

    return (
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-indigo-600 rounded-l-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
        {showReactive && reactivePercent > 0 && (
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${reactivePercent}%` }}
          />
        )}
        {showFestive && festivePercent > 0 && (
          <div
            className="h-full bg-gradient-to-r from-red-500 via-green-500 to-red-500 transition-all duration-500"
            style={{ width: `${festivePercent}%` }}
          />
        )}
        {showRnd && rndPercent > 0 && (
          <div
            className="h-full bg-purple-500 transition-all duration-500"
            style={{ width: `${rndPercent}%` }}
          />
        )}
      </div>
    );
  };

  return (
    <section
      className={`p-6 transition-colors duration-300 ${theme.cardBg} ${isRetro ? "border" : "rounded-xl"} ${theme.border}`}
    >
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-xs font-bold uppercase flex items-center gap-2 ${theme.accent}`}
        >
          <Activity className="w-4 h-4" />
          {viewMode === "maintenance" ? "Maintenance Load" : "Weekly Workload"}
        </h2>
        <div
          className={`flex items-center p-0.5 rounded ${isRetro ? "border border-green-900" : "bg-slate-200/50"}`}
        >
          <button
            onClick={() => setViewMode("maintenance")}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
              viewMode === "maintenance"
                ? isRetro
                  ? "bg-green-900 text-green-100"
                  : "bg-white shadow text-slate-800"
                : isRetro
                  ? "text-green-800 hover:text-green-600"
                  : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Maintenance
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
              viewMode === "weekly"
                ? isRetro
                  ? "bg-green-900 text-green-100"
                  : "bg-white shadow text-slate-800"
                : isRetro
                  ? "text-green-800 hover:text-green-600"
                  : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Maintenance Mode */}
      {viewMode === "maintenance" && (
        <>
          <div className="flex justify-between text-xs mb-3 tracking-wide">
            <span className={theme.textMuted}>Stable Ops</span>
            <span
              className={`font-bold ${isRetro ? "text-green-400" : "text-indigo-600"}`}
            >
              Reactive Fixes: {maintenanceReactivePercent}%
            </span>
          </div>
          <ProgressBar percent={100 - maintenanceReactivePercent} />
        </>
      )}

      {/* Weekly Workload Mode */}
      {viewMode === "weekly" && (
        <>
          {/* Stats Row */}
          <div
            className={`grid gap-3 mb-4 ${workload.festivePercent > 0 || festiveMode ? "grid-cols-4" : "grid-cols-3"}`}
          >
            <div
              className={`text-center p-2 rounded ${isRetro ? "bg-green-900/10" : "bg-slate-50"}`}
            >
              <div className={`text-xs ${theme.textMuted} mb-1`}>Planned</div>
              <div className={`text-lg font-bold ${theme.textBold}`}>
                {workload.plannedPercent}%
              </div>
            </div>
            <div
              className={`text-center p-2 rounded ${isRetro ? "bg-yellow-900/10 border border-yellow-900/30" : "bg-amber-50 border border-amber-200"}`}
            >
              <div
                className={`text-xs ${isRetro ? "text-yellow-700" : "text-amber-700"} mb-1`}
              >
                Reactive
              </div>
              <div
                className={`text-lg font-bold ${isRetro ? "text-yellow-500" : "text-amber-600"}`}
              >
                {workload.reactivePercent}%
              </div>
            </div>
            {/* Festive Stats - only show when there's festive data or festive mode is on */}
            {(workload.festivePercent > 0 || festiveMode) && (
              <div
                className={`text-center p-2 rounded ${isRetro ? "bg-red-900/20 border border-red-900/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]" : "bg-gradient-to-r from-red-50 via-green-50 to-red-50 border border-red-200"}`}
              >
                <div
                  className={`text-xs ${isRetro ? "text-red-400" : "text-red-600"} mb-1`}
                >
                  Festive
                </div>
                <div
                  className={`text-lg font-bold ${isRetro ? "text-red-400 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]" : "text-red-600"}`}
                >
                  {workload.festivePercent}%
                </div>
              </div>
            )}
            <div
              className={`text-center p-2 rounded ${isRetro ? "bg-cyan-900/10 border border-cyan-900/30" : "bg-cyan-50 border border-cyan-200"}`}
            >
              <div
                className={`text-xs ${isRetro ? "text-cyan-700" : "text-cyan-700"} mb-1`}
              >
                R&D
              </div>
              <div
                className={`text-lg font-bold ${isRetro ? "text-cyan-400" : "text-cyan-600"}`}
              >
                {workload.rndPercent}%
              </div>
            </div>
          </div>

          {/* Workload Distribution */}
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme.textMuted}`}
            >
              Workload Distribution
            </h3>
            <ProgressBar
              percent={workload.plannedPercent}
              showReactive={true}
              reactivePercent={workload.reactivePercent}
              showFestive={workload.festivePercent > 0 || festiveMode}
              festivePercent={workload.festivePercent}
              showRnd={true}
              rndPercent={workload.rndPercent}
            />
            <div
              className={`flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2 tracking-wide ${workload.festivePercent > 0 || festiveMode ? "justify-start" : "justify-between"}`}
            >
              <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                <span
                  className={`w-2 h-2 rounded-sm ${isRetro ? "bg-green-500" : "bg-indigo-600"}`}
                ></span>
                Planned Work: {workload.plannedPercent}%
              </span>
              <span
                className={`flex items-center gap-1 ${isRetro ? "text-yellow-500" : "text-amber-600"}`}
              >
                <span
                  className={`w-2 h-2 rounded-sm ${isRetro ? "bg-yellow-500" : "bg-amber-500"}`}
                ></span>
                Reactive Work: {workload.reactivePercent}%
              </span>
              {(workload.festivePercent > 0 || festiveMode) && (
                <span
                  className={`flex items-center gap-1 ${isRetro ? "text-red-400" : "text-red-600"}`}
                >
                  <span
                    className={`w-2 h-2 rounded-sm ${isRetro ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-red-500 to-green-500"}`}
                  ></span>
                  Festive: {workload.festivePercent}%
                </span>
              )}
              <span
                className={`flex items-center gap-1 ${isRetro ? "text-purple-400" : "text-purple-600"}`}
              >
                <span
                  className={`w-2 h-2 rounded-sm ${isRetro ? "bg-purple-500" : "bg-purple-500"}`}
                ></span>
                R&D: {workload.rndPercent}%
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default WorkloadTracker;

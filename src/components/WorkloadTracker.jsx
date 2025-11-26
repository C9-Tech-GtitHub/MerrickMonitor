import React, { useState, useEffect } from "react";
import { Activity, Calendar, AlertTriangle, Plus, X } from "lucide-react";
import { weeklySchedule } from "../data/weeklySchedule";

// Helper function to get current week key
function getCurrentWeekKey() {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

/**
 * Workload Tracker Component
 * Toggles between Maintenance Load and Weekly Workload
 * Tracks planned work vs reactive/unplanned tasks
 */
const WorkloadTracker = ({ theme, isRetro, currentWeek }) => {
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
    // Count all slots from weekly schedule
    let plannedCount = 0;
    let reactiveCount = 0;
    let completedPlanned = 0;
    let completedReactive = 0;

    weeklySchedule.forEach((day) => {
      day.slots.forEach((slot) => {
        if (slot.type === "planned") {
          plannedCount++;
          if (slot.completed) completedPlanned++;
        } else if (slot.type === "unplanned") {
          reactiveCount++;
          if (slot.completed) completedReactive++;
        }
      });
    });

    // Fixed 15% R&D allocation
    const rndPercent = 15;

    // Calculate percentages with R&D factored in
    const totalWork = plannedCount + reactiveCount;
    const workPercent = 100 - rndPercent; // 85% for actual work

    const plannedPercent =
      totalWork > 0
        ? Math.round((plannedCount / totalWork) * workPercent)
        : workPercent;
    const reactivePercent =
      totalWork > 0 ? Math.round((reactiveCount / totalWork) * workPercent) : 0;

    const completionRate =
      plannedCount > 0
        ? Math.round((completedPlanned / plannedCount) * 100)
        : 0;

    return {
      plannedCount,
      reactiveCount,
      totalWork,
      plannedPercent,
      reactivePercent,
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
  }) => {
    if (isRetro) {
      // Use dynamic length based on container width (approximate characters that fit)
      const length = 100;
      const plannedLen = Math.round((length * percent) / 100);
      const reactiveLen = showReactive
        ? Math.round((length * reactivePercent) / 100)
        : 0;
      const rndLen = showRnd ? Math.round((length * rndPercent) / 100) : 0;
      const emptyLen = length - plannedLen - reactiveLen - rndLen;

      return (
        <div className="opacity-90 tracking-tighter text-xs overflow-hidden break-all">
          {"▓".repeat(plannedLen)}
          {showReactive && (
            <span className="text-yellow-500">{"▓".repeat(reactiveLen)}</span>
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
          <div className="grid grid-cols-3 gap-3 mb-4">
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
              showRnd={true}
              rndPercent={workload.rndPercent}
            />
            <div className="flex justify-between text-xs mt-2 tracking-wide">
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

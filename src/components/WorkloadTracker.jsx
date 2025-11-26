import React, { useState, useEffect } from "react";
import { Activity, Calendar, AlertTriangle, Plus, X } from "lucide-react";

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

  // Get weekly agenda from GitHub/localStorage
  const [weeklyAgenda, setWeeklyAgenda] = useState([]);

  useEffect(() => {
    loadWeeklyAgenda();
  }, [currentWeek]);

  const loadWeeklyAgenda = async () => {
    try {
      const response = await fetch("/MerrickMonitor/data/weeklyAgendas.json");
      if (response.ok) {
        const allAgendas = await response.json();
        const weekKey = getCurrentWeekKey();
        const weekData = allAgendas[weekKey];
        setWeeklyAgenda(weekData?.goals || []);
      } else {
        // Fallback to localStorage
        const weekKey = getCurrentWeekKey();
        const savedAgendas = JSON.parse(
          localStorage.getItem("weeklyAgendas") || "{}",
        );
        setWeeklyAgenda(savedAgendas[weekKey]?.goals || []);
      }
    } catch (error) {
      console.error("Failed to load weekly agenda:", error);
      const weekKey = getCurrentWeekKey();
      const savedAgendas = JSON.parse(
        localStorage.getItem("weeklyAgendas") || "{}",
      );
      setWeeklyAgenda(savedAgendas[weekKey]?.goals || []);
    }
  };

  // Calculate workload metrics
  const calculateWorkload = () => {
    // Count planned vs reactive from agenda
    const plannedCount = weeklyAgenda.filter(
      (g) => g.type === "planned",
    ).length;
    const reactiveCount =
      weeklyAgenda.filter((g) => g.type === "reactive").length +
      reactiveTasks.length;
    const totalWork = plannedCount + reactiveCount;

    const plannedPercent =
      totalWork > 0 ? Math.round((plannedCount / totalWork) * 100) : 100;
    const reactivePercent =
      totalWork > 0 ? Math.round((reactiveCount / totalWork) * 100) : 0;

    const completedPlanned = weeklyAgenda.filter((g) => g.completed).length;
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
  }) => {
    if (isRetro) {
      const length = 20;
      const plannedLen = Math.round((length * percent) / 100);
      const reactiveLen = showReactive
        ? Math.round((length * reactivePercent) / 100)
        : 0;
      const emptyLen = length - plannedLen - reactiveLen;

      return (
        <span className="opacity-90 tracking-wider">
          {"▓".repeat(plannedLen)}
          {showReactive && (
            <span className="text-yellow-500">{"▓".repeat(reactiveLen)}</span>
          )}
          {"░".repeat(emptyLen)}
        </span>
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
                {workload.plannedCount}
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
                {workload.reactiveCount}
              </div>
            </div>
            <div
              className={`text-center p-2 rounded ${isRetro ? "bg-green-900/10" : "bg-slate-50"}`}
            >
              <div className={`text-xs ${theme.textMuted} mb-1`}>Total</div>
              <div className={`text-lg font-bold ${theme.textBold}`}>
                {workload.totalWork}
              </div>
            </div>
          </div>

          {/* Workload Distribution */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2 tracking-wide">
              <span className={theme.textMuted}>
                Planned Work: {workload.plannedPercent}%
              </span>
              <span
                className={`font-bold ${isRetro ? "text-yellow-500" : "text-amber-600"}`}
              >
                Reactive Work: {workload.reactivePercent}%
              </span>
            </div>
            <ProgressBar
              percent={workload.plannedPercent}
              showReactive={true}
              reactivePercent={workload.reactivePercent}
            />
          </div>

          {/* Completion Progress */}
          {workload.plannedCount > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2 tracking-wide">
                <span className={theme.textMuted}>Agenda Completion</span>
                <span className={`font-bold ${theme.accent}`}>
                  {workload.completedPlanned}/{workload.plannedCount} (
                  {workload.completionRate}%)
                </span>
              </div>
              <ProgressBar percent={workload.completionRate} />
            </div>
          )}

          {/* Reactive Tasks Section */}
          <div
            className={`mt-4 pt-4 border-t ${isRetro ? "border-green-900" : "border-slate-200"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isRetro ? "text-yellow-600" : "text-amber-700"}`}
              >
                <AlertTriangle className="w-3 h-3" />
                Reactive Tasks
              </h3>
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  isAddingTask
                    ? isRetro
                      ? "bg-yellow-900/30 text-yellow-500 border border-yellow-800"
                      : "bg-amber-100 text-amber-700"
                    : isRetro
                      ? "border border-yellow-900/50 text-yellow-600 hover:bg-yellow-900/20"
                      : "border border-amber-300 text-amber-700 hover:bg-amber-50"
                }`}
              >
                {isAddingTask ? (
                  <X className="w-3 h-3" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                {isAddingTask ? "Cancel" : "Add"}
              </button>
            </div>

            {/* Add Task Input */}
            <div
              className={`transition-all duration-200 ease-in-out overflow-hidden ${
                isAddingTask ? "max-h-32 opacity-100 mb-3" : "max-h-0 opacity-0"
              }`}
            >
              <div className="mb-3">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddReactiveTask()
                  }
                  placeholder="Describe the reactive task..."
                  className={`w-full px-2 py-1.5 mb-2 text-xs ${
                    isRetro
                      ? "bg-black border border-yellow-800 text-yellow-400 placeholder-yellow-900/50"
                      : "bg-white border border-amber-300 text-slate-900 placeholder-slate-400"
                  } focus:outline-none focus:ring-2 ${isRetro ? "focus:ring-yellow-500" : "focus:ring-amber-500"} rounded`}
                  autoFocus={isAddingTask}
                />
                <button
                  onClick={handleAddReactiveTask}
                  disabled={!newTaskName.trim()}
                  className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                    !newTaskName.trim() ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isRetro
                      ? "bg-yellow-900/50 text-yellow-100 hover:bg-yellow-900/70 border border-yellow-800"
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  }`}
                >
                  Add Reactive Task
                </button>
              </div>
            </div>

            {/* Reactive Tasks List */}
            {reactiveTasks.length > 0 ? (
              <div className="space-y-2">
                {reactiveTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2 rounded border text-xs ${
                      isRetro
                        ? "border-yellow-900/50 bg-yellow-900/10"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="flex-1">
                      <div
                        className={`font-medium ${isRetro ? "text-yellow-400" : "text-amber-900"}`}
                      >
                        {task.name}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 ${isRetro ? "text-yellow-800" : "text-amber-600"}`}
                      >
                        Added:{" "}
                        {new Date(task.addedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => removeReactiveTask(task.id)}
                      className={`p-1 rounded transition-colors ${
                        isRetro
                          ? "text-yellow-600 hover:bg-yellow-900/30"
                          : "text-amber-600 hover:bg-amber-100"
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center p-3 rounded border text-xs ${
                  isRetro
                    ? "border-yellow-900/30 bg-yellow-900/5 text-yellow-800"
                    : "border-amber-200 bg-amber-50/50 text-amber-600"
                }`}
              >
                No reactive tasks this week - great!
              </div>
            )}
          </div>

          {/* Warning if reactive load is high */}
          {workload.reactivePercent > 40 && workload.totalWork > 0 && (
            <div
              className={`mt-4 p-3 rounded border flex items-start gap-2 ${
                isRetro
                  ? "border-yellow-800 bg-yellow-900/20 text-yellow-400"
                  : "border-amber-300 bg-amber-100 text-amber-800"
              }`}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold mb-1">High Reactive Load</div>
                <div className={isRetro ? "text-yellow-600" : "text-amber-700"}>
                  {workload.reactivePercent}% of your work this week is
                  reactive. Consider blocking time for planned work.
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default WorkloadTracker;

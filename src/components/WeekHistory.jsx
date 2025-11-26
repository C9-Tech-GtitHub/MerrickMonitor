import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  GitCommit,
  CheckCircle,
  Circle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

/**
 * Week History Component
 * View past weeks' agendas, reactive tasks, and workload metrics
 */
const WeekHistory = ({ theme, isRetro }) => {
  const [weeklyAgendas, setWeeklyAgendas] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weeks, setWeeks] = useState([]);

  // Load all agendas and reactive tasks from localStorage
  useEffect(() => {
    const savedAgendas = JSON.parse(
      localStorage.getItem("weeklyAgendas") || "{}",
    );
    const savedReactive = JSON.parse(
      localStorage.getItem("reactiveTasks") || "{}",
    );
    setWeeklyAgendas(savedAgendas);

    // Get sorted list of weeks (newest first) - combine both agendas and reactive tasks
    const allWeeks = new Set([
      ...Object.keys(savedAgendas),
      ...Object.keys(savedReactive),
    ]);
    const weekKeys = Array.from(allWeeks).sort().reverse();
    setWeeks(weekKeys);
    if (weekKeys.length > 0 && !selectedWeek) {
      setSelectedWeek(weekKeys[0]);
    }
  }, []);

  const navigateWeek = (direction) => {
    const currentIndex = weeks.indexOf(selectedWeek);
    if (direction === "prev" && currentIndex < weeks.length - 1) {
      setSelectedWeek(weeks[currentIndex + 1]);
    } else if (direction === "next" && currentIndex > 0) {
      setSelectedWeek(weeks[currentIndex - 1]);
    }
  };

  const formatWeekRange = (weekKey) => {
    const monday = new Date(weekKey);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const opts = { month: "short", day: "numeric", year: "numeric" };
    return `${monday.toLocaleDateString("en-US", opts)} - ${friday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  const isCurrentWeek = (weekKey) => {
    return weekKey === getCurrentWeekKey();
  };

  // Get reactive tasks for a specific week
  const getReactiveTasks = (weekKey) => {
    const savedReactive = JSON.parse(
      localStorage.getItem("reactiveTasks") || "{}",
    );
    return savedReactive[weekKey] || [];
  };

  // Calculate workload metrics for a week
  const calculateWeekMetrics = (weekKey) => {
    const agendaData = weeklyAgendas[weekKey] || [];
    const agenda = Array.isArray(agendaData) ? agendaData : [];
    const reactive = getReactiveTasks(weekKey);

    const plannedCount = agenda.length;
    const reactiveCount = reactive.length;
    const totalWork = plannedCount + reactiveCount;
    const completedPlanned = agenda.filter((g) => g.completed).length;

    const plannedPercent =
      totalWork > 0 ? Math.round((plannedCount / totalWork) * 100) : 100;
    const reactivePercent =
      totalWork > 0 ? Math.round((reactiveCount / totalWork) * 100) : 0;
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

  if (weeks.length === 0) {
    return (
      <div
        className={`p-8 rounded border text-center ${isRetro ? "border-green-800 bg-green-900/5" : "border-slate-200 bg-slate-50"}`}
      >
        <Calendar className={`w-12 h-12 mx-auto mb-4 ${theme.textMuted}`} />
        <h3 className={`text-sm font-bold mb-2 ${theme.textBold}`}>
          No Week History Yet
        </h3>
        <p className={`text-xs ${theme.textMuted}`}>
          Start adding goals to your weekly agenda to build your history
        </p>
      </div>
    );
  }

  const currentAgenda = selectedWeek
    ? Array.isArray(weeklyAgendas[selectedWeek])
      ? weeklyAgendas[selectedWeek]
      : []
    : [];
  const currentReactive = selectedWeek ? getReactiveTasks(selectedWeek) : [];
  const metrics = selectedWeek ? calculateWeekMetrics(selectedWeek) : null;

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
        <span className="opacity-90 tracking-wider text-sm">
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
    <div className="space-y-6">
      {/* Week Navigator */}
      <div
        className={`flex items-center justify-between p-4 rounded border ${isRetro ? "border-green-800 bg-green-900/10" : "border-slate-200 bg-slate-50"}`}
      >
        <button
          onClick={() => navigateWeek("prev")}
          disabled={weeks.indexOf(selectedWeek) === weeks.length - 1}
          className={`p-2 rounded transition-all ${
            weeks.indexOf(selectedWeek) === weeks.length - 1
              ? "opacity-30 cursor-not-allowed"
              : isRetro
                ? "hover:bg-green-900/30 text-green-500"
                : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className={`text-sm font-bold ${theme.textBold}`}>
            {selectedWeek && formatWeekRange(selectedWeek)}
          </div>
          {selectedWeek && isCurrentWeek(selectedWeek) && (
            <div className={`text-xs mt-1 ${theme.accent}`}>Current Week</div>
          )}
        </div>

        <button
          onClick={() => navigateWeek("next")}
          disabled={weeks.indexOf(selectedWeek) === 0}
          className={`p-2 rounded transition-all ${
            weeks.indexOf(selectedWeek) === 0
              ? "opacity-30 cursor-not-allowed"
              : isRetro
                ? "hover:bg-green-900/30 text-green-500"
                : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Workload Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded border ${isRetro ? "border-green-800 bg-green-900/5" : "border-slate-200 bg-white"}`}
          >
            <div
              className={`text-xs uppercase tracking-wider mb-2 ${theme.textMuted}`}
            >
              Planned
            </div>
            <div className={`text-2xl font-bold ${theme.textBold}`}>
              {metrics.plannedCount}
            </div>
          </div>
          <div
            className={`p-4 rounded border ${isRetro ? "border-yellow-800 bg-yellow-900/10" : "border-amber-200 bg-amber-50"}`}
          >
            <div
              className={`text-xs uppercase tracking-wider mb-2 ${isRetro ? "text-yellow-700" : "text-amber-700"}`}
            >
              Reactive
            </div>
            <div
              className={`text-2xl font-bold ${isRetro ? "text-yellow-500" : "text-amber-600"}`}
            >
              {metrics.reactiveCount}
            </div>
          </div>
          <div
            className={`p-4 rounded border ${isRetro ? "border-green-800 bg-green-900/5" : "border-slate-200 bg-white"}`}
          >
            <div
              className={`text-xs uppercase tracking-wider mb-2 ${theme.textMuted}`}
            >
              Completed
            </div>
            <div
              className={`text-2xl font-bold ${isRetro ? "text-green-500" : "text-emerald-600"}`}
            >
              {metrics.completedPlanned}
            </div>
          </div>
          <div
            className={`p-4 rounded border ${isRetro ? "border-green-800 bg-green-900/5" : "border-slate-200 bg-white"}`}
          >
            <div
              className={`text-xs uppercase tracking-wider mb-2 ${theme.textMuted}`}
            >
              Completion
            </div>
            <div className={`text-2xl font-bold ${theme.textBold}`}>
              {metrics.completionRate}%
            </div>
          </div>
        </div>
      )}

      {/* Workload Distribution */}
      {metrics && metrics.totalWork > 0 && (
        <div
          className={`p-4 rounded border ${isRetro ? "border-green-800 bg-green-900/5" : "border-slate-200 bg-slate-50"}`}
        >
          <h4
            className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme.textMuted}`}
          >
            Workload Distribution
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className={theme.textMuted}>
                Planned: {metrics.plannedPercent}%
              </span>
              <span className={isRetro ? "text-yellow-600" : "text-amber-600"}>
                Reactive: {metrics.reactivePercent}%
              </span>
            </div>
            <ProgressBar
              percent={metrics.plannedPercent}
              showReactive={true}
              reactivePercent={metrics.reactivePercent}
            />
          </div>
          {metrics.reactivePercent > 40 && (
            <div
              className={`mt-3 text-xs flex items-start gap-2 ${isRetro ? "text-yellow-600" : "text-amber-700"}`}
            >
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>High reactive load this week</span>
            </div>
          )}
        </div>
      )}

      {/* Goals List */}
      {currentAgenda.length > 0 && (
        <div className="space-y-2">
          <h4
            className={`text-xs font-bold uppercase tracking-wider ${theme.textMuted}`}
          >
            Planned Goals ({currentAgenda.length})
          </h4>
          {currentAgenda.map((goal) => (
            <div
              key={goal.id}
              className={`p-3 rounded border flex items-start gap-3 ${
                goal.completed
                  ? isRetro
                    ? "border-green-900/40 bg-green-900/5"
                    : "border-slate-200 bg-slate-50"
                  : isRetro
                    ? "border-green-800 bg-green-900/10"
                    : "border-slate-300 bg-white"
              }`}
            >
              {goal.completed ? (
                <CheckCircle
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isRetro ? "text-green-500" : "text-emerald-600"}`}
                />
              ) : (
                <Circle
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${theme.textMuted}`}
                />
              )}
              <div className="flex-1">
                <div
                  className={`text-sm ${
                    goal.completed
                      ? `line-through ${theme.textMuted}`
                      : theme.textBold
                  }`}
                >
                  {goal.text}
                </div>
                {goal.createdAt && (
                  <div className={`text-xs mt-1 ${theme.textMuted}`}>
                    Created:{" "}
                    {new Date(goal.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reactive Tasks List */}
      {currentReactive.length > 0 && (
        <div className="space-y-2">
          <h4
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isRetro ? "text-yellow-600" : "text-amber-700"}`}
          >
            <AlertTriangle className="w-3 h-3" />
            Reactive Tasks ({currentReactive.length})
          </h4>
          {currentReactive.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded border ${
                isRetro
                  ? "border-yellow-900/50 bg-yellow-900/10"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div
                className={`text-sm font-medium ${isRetro ? "text-yellow-400" : "text-amber-900"}`}
              >
                {task.name}
              </div>
              {task.addedAt && (
                <div
                  className={`text-xs mt-1 ${isRetro ? "text-yellow-800" : "text-amber-600"}`}
                >
                  Added:{" "}
                  {new Date(task.addedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No data message */}
      {currentAgenda.length === 0 && currentReactive.length === 0 && (
        <div
          className={`p-8 rounded border text-center ${isRetro ? "border-green-800 bg-green-900/5" : "border-slate-200 bg-slate-50"}`}
        >
          <p className={`text-sm ${theme.textMuted}`}>
            No goals or reactive tasks for this week
          </p>
        </div>
      )}

      {/* Week Timeline */}
      <div
        className={`p-4 rounded border ${isRetro ? "border-green-800 bg-green-900/5" : "border-slate-200 bg-slate-50"}`}
      >
        <h4
          className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme.textMuted}`}
        >
          All Weeks
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {weeks.map((weekKey) => {
            const weekMetrics = calculateWeekMetrics(weekKey);

            return (
              <button
                key={weekKey}
                onClick={() => setSelectedWeek(weekKey)}
                className={`w-full p-3 rounded border text-left transition-all ${
                  selectedWeek === weekKey
                    ? isRetro
                      ? "border-green-600 bg-green-900/20"
                      : "border-indigo-400 bg-indigo-50"
                    : isRetro
                      ? "border-green-900/40 hover:bg-green-900/10"
                      : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className={`text-xs font-bold ${theme.textBold}`}>
                      {formatWeekRange(weekKey)}
                    </div>
                    {isCurrentWeek(weekKey) && (
                      <div className={`text-xs mt-0.5 ${theme.accent}`}>
                        Current
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${theme.textBold}`}>
                      {weekMetrics.completionRate}%
                    </div>
                    <div className={`text-xs ${theme.textMuted}`}>
                      {weekMetrics.completedPlanned}/{weekMetrics.plannedCount}
                    </div>
                  </div>
                </div>
                {weekMetrics.totalWork > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className={theme.textMuted}>
                      {weekMetrics.plannedCount} planned
                    </span>
                    {weekMetrics.reactiveCount > 0 && (
                      <>
                        <span className={theme.textMuted}>•</span>
                        <span
                          className={
                            isRetro ? "text-yellow-600" : "text-amber-600"
                          }
                        >
                          {weekMetrics.reactiveCount} reactive
                        </span>
                      </>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getCurrentWeekKey() {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

export default WeekHistory;

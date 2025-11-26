import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Check,
  X,
  GitCommit,
  Edit2,
  Trash2,
} from "lucide-react";

/**
 * Weekly Agenda Component
 * Allows setting goals for the week and tracks GitHub activity per day
 */
const WeeklyAgenda = ({ theme, isRetro, toolFleet }) => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekKey());
  const [agenda, setAgenda] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("morning");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load agenda from GitHub (with localStorage fallback for offline)
  useEffect(() => {
    loadAgenda();
  }, [currentWeek]);

  const loadAgenda = async () => {
    try {
      // Try to fetch from GitHub first
      const response = await fetch("/MerrickMonitor/data/weeklyAgendas.json");
      if (response.ok) {
        const allAgendas = await response.json();
        const weekAgenda = allAgendas[currentWeek]?.goals || [];
        setAgenda(weekAgenda);
        // Cache in localStorage for offline access
        localStorage.setItem("weeklyAgendas", JSON.stringify(allAgendas));
      } else {
        // Fallback to localStorage
        const savedAgendas = JSON.parse(
          localStorage.getItem("weeklyAgendas") || "{}",
        );
        const weekAgenda = savedAgendas[currentWeek]?.goals || [];
        setAgenda(weekAgenda);
      }
    } catch (error) {
      console.error("Failed to load agenda from GitHub:", error);
      // Fallback to localStorage
      const savedAgendas = JSON.parse(
        localStorage.getItem("weeklyAgendas") || "{}",
      );
      const weekAgenda = savedAgendas[currentWeek]?.goals || [];
      setAgenda(weekAgenda);
    }
  };

  // Save agenda to localStorage (manual sync to GitHub needed)
  const saveAgenda = (newAgenda) => {
    const savedAgendas = JSON.parse(
      localStorage.getItem("weeklyAgendas") || "{}",
    );
    savedAgendas[currentWeek] = {
      weekRange: getWeekRange(),
      goals: newAgenda,
    };
    localStorage.setItem("weeklyAgendas", JSON.stringify(savedAgendas));
    setAgenda(newAgenda);

    // Log to console for manual GitHub sync
    console.log("📋 Agenda updated. Copy this to src/data/weeklyAgendas.json:");
    console.log(JSON.stringify(savedAgendas, null, 2));
  };

  // Add new goal
  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const goal = {
        id: Date.now(),
        text: newGoal.trim(),
        completed: false,
        type: "planned",
        timeSlot: newTimeSlot,
        createdAt: new Date().toISOString(),
      };
      saveAgenda([...agenda, goal]);
      setNewGoal("");
      setNewTimeSlot("morning");
      setIsAdding(false);
    }
  };

  // Toggle goal completion
  const toggleGoal = (id) => {
    const updated = agenda.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g,
    );
    saveAgenda(updated);
  };

  // Delete goal
  const deleteGoal = (id) => {
    saveAgenda(agenda.filter((g) => g.id !== id));
  };

  // Start editing
  const startEdit = (goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  // Save edit
  const saveEdit = () => {
    if (editText.trim()) {
      const updated = agenda.map((g) =>
        g.id === editingId ? { ...g, text: editText.trim() } : g,
      );
      saveAgenda(updated);
    }
    setEditingId(null);
    setEditText("");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Get GitHub activity by day
  const getActivityByDay = () => {
    const days = ["MON", "TUE", "WED", "THU", "FRI"];
    const activityByDay = days.map(() => []);

    toolFleet.forEach((tool) => {
      tool.activity.forEach((hasActivity, dayIndex) => {
        if (hasActivity && dayIndex < 5) {
          activityByDay[dayIndex].push({
            name: tool.name,
            type: tool.type,
            repoUrl: tool.repoUrl,
          });
        }
      });
    });

    return activityByDay;
  };

  const activityByDay = getActivityByDay();
  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <div
        className={`flex items-center justify-between pb-3 border-b ${theme.border}`}
      >
        <div>
          <h3
            className={`text-lg font-bold uppercase tracking-wide ${theme.textBold}`}
          >
            Week of {getWeekRange()}
          </h3>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>
            Set your goals and track project activity
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            isAdding
              ? isRetro
                ? "bg-green-900 text-green-100 border border-green-700"
                : "bg-slate-200 text-slate-700"
              : isRetro
                ? "border border-green-800 text-green-500 hover:bg-green-900/20"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Plus className="w-3 h-3" />
          {isAdding ? "Cancel" : "Add Goal"}
        </button>
      </div>

      {/* Add Goal Input */}
      {isAdding && (
        <div
          className={`p-4 rounded border ${isRetro ? "border-green-800 bg-green-900/10" : "border-slate-200 bg-slate-50"}`}
        >
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddGoal()}
            placeholder="What do you want to accomplish this week?"
            className={`w-full px-3 py-2 mb-3 ${
              isRetro
                ? "bg-black border border-green-800 text-green-400 placeholder-green-900"
                : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
            } focus:outline-none focus:ring-2 ${isRetro ? "focus:ring-green-500" : "focus:ring-indigo-500"} rounded`}
            autoFocus
          />
          <div className="mb-3">
            <label
              className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textMuted}`}
            >
              Time Slot
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setNewTimeSlot("morning")}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                  newTimeSlot === "morning"
                    ? isRetro
                      ? "bg-green-900 text-green-100 border border-green-700"
                      : "bg-indigo-600 text-white"
                    : isRetro
                      ? "border border-green-800 text-green-500 hover:bg-green-900/20"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Morning
              </button>
              <button
                onClick={() => setNewTimeSlot("afternoon")}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                  newTimeSlot === "afternoon"
                    ? isRetro
                      ? "bg-green-900 text-green-100 border border-green-700"
                      : "bg-indigo-600 text-white"
                    : isRetro
                      ? "border border-green-800 text-green-500 hover:bg-green-900/20"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Afternoon
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddGoal}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${
                isRetro
                  ? "bg-green-900 text-green-100 hover:bg-green-800 border border-green-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Add Goal
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${
                isRetro
                  ? "border border-green-800 text-green-500 hover:bg-green-900/20"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals List - Organized by Time Slot */}
      {agenda.length > 0 && (
        <div className="space-y-6">
          {/* Morning Goals */}
          {agenda.filter((g) => g.timeSlot === "morning").length > 0 && (
            <div className="space-y-2">
              <h4
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.accent}`}
              >
                <span>☀️ Morning</span>
              </h4>
              {agenda
                .filter((g) => g.timeSlot === "morning")
                .map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-3 rounded border transition-all ${
                      goal.completed
                        ? isRetro
                          ? "border-green-900/40 bg-green-900/5"
                          : "border-slate-200 bg-slate-50"
                        : isRetro
                          ? "border-green-800 bg-green-900/10"
                          : "border-slate-300 bg-white"
                    }`}
                  >
                    {editingId === goal.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                          className={`w-full px-2 py-1 ${
                            isRetro
                              ? "bg-black border border-green-800 text-green-400"
                              : "bg-white border border-slate-300 text-slate-900"
                          } focus:outline-none focus:ring-2 ${isRetro ? "focus:ring-green-500" : "focus:ring-indigo-500"} rounded text-sm`}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className={`px-2 py-1 rounded text-xs ${
                              isRetro
                                ? "bg-green-900 text-green-100 hover:bg-green-800"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className={`px-2 py-1 rounded text-xs ${
                              isRetro
                                ? "border border-green-800 text-green-500 hover:bg-green-900/20"
                                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleGoal(goal.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              goal.completed
                                ? isRetro
                                  ? "bg-green-500 border-green-500"
                                  : "bg-indigo-600 border-indigo-600"
                                : isRetro
                                  ? "border-green-700 hover:border-green-500"
                                  : "border-slate-400 hover:border-indigo-500"
                            }`}
                          >
                            {goal.completed && (
                              <Check className="w-3 h-3 text-black" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {goal.type === "reactive" && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    isRetro
                                      ? "bg-green-500 text-black"
                                      : "bg-amber-100 text-amber-700 border border-amber-300"
                                  }`}
                                >
                                  ⚠️ REACTIVE
                                </span>
                              )}
                              <span
                                className={`text-sm ${
                                  goal.completed
                                    ? `line-through ${theme.textMuted}`
                                    : theme.textBold
                                }`}
                              >
                                {goal.text}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(goal)}
                            className={`p-1 rounded transition-colors ${
                              isRetro
                                ? "text-green-600 hover:bg-green-900/20"
                                : "text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className={`p-1 rounded transition-colors ${
                              isRetro
                                ? "text-green-600 hover:bg-green-900/20"
                                : "text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Afternoon Goals */}
          {agenda.filter((g) => g.timeSlot === "afternoon").length > 0 && (
            <div className="space-y-2">
              <h4
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.accent}`}
              >
                <span>🌙 Afternoon</span>
              </h4>
              {agenda
                .filter((g) => g.timeSlot === "afternoon")
                .map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-3 rounded border transition-all ${
                      goal.completed
                        ? isRetro
                          ? "border-green-900/40 bg-green-900/5"
                          : "border-slate-200 bg-slate-50"
                        : isRetro
                          ? "border-green-800 bg-green-900/10"
                          : "border-slate-300 bg-white"
                    }`}
                  >
                    {editingId === goal.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                          className={`w-full px-2 py-1 ${
                            isRetro
                              ? "bg-black border border-green-800 text-green-400"
                              : "bg-white border border-slate-300 text-slate-900"
                          } focus:outline-none focus:ring-2 ${isRetro ? "focus:ring-green-500" : "focus:ring-indigo-500"} rounded text-sm`}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className={`px-2 py-1 rounded text-xs ${
                              isRetro
                                ? "bg-green-900 text-green-100 hover:bg-green-800"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className={`px-2 py-1 rounded text-xs ${
                              isRetro
                                ? "border border-green-800 text-green-500 hover:bg-green-900/20"
                                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleGoal(goal.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              goal.completed
                                ? isRetro
                                  ? "bg-green-500 border-green-500"
                                  : "bg-indigo-600 border-indigo-600"
                                : isRetro
                                  ? "border-green-700 hover:border-green-500"
                                  : "border-slate-400 hover:border-indigo-500"
                            }`}
                          >
                            {goal.completed && (
                              <Check className="w-3 h-3 text-black" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {goal.type === "reactive" && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    isRetro
                                      ? "bg-green-500 text-black"
                                      : "bg-amber-100 text-amber-700 border border-amber-300"
                                  }`}
                                >
                                  ⚠️ REACTIVE
                                </span>
                              )}
                              <span
                                className={`text-sm ${
                                  goal.completed
                                    ? `line-through ${theme.textMuted}`
                                    : theme.textBold
                                }`}
                              >
                                {goal.text}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(goal)}
                            className={`p-1 rounded transition-colors ${
                              isRetro
                                ? "text-green-600 hover:bg-green-900/20"
                                : "text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className={`p-1 rounded transition-colors ${
                              isRetro
                                ? "text-green-600 hover:bg-green-900/20"
                                : "text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* GitHub Activity by Day */}
      <div className="space-y-3">
        <h4
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.textMuted}`}
        >
          <GitCommit className="w-3 h-3" />
          Project Activity This Week
        </h4>
        <div className="space-y-3">
          {days.map((day, idx) => {
            const projects = activityByDay[idx];
            const isToday = day === getCurrentDayShort();

            return (
              <div
                key={day}
                className={`flex gap-4 p-3 rounded transition-all ${
                  isToday
                    ? isRetro
                      ? "bg-green-900/20 border border-green-800"
                      : "bg-indigo-50 border border-indigo-200"
                    : isRetro
                      ? "border border-green-900/40"
                      : "border border-slate-200"
                }`}
              >
                <div
                  className={`text-xs font-bold w-12 pt-0.5 ${
                    isToday ? theme.accent : theme.textMuted
                  }`}
                >
                  {day}
                  {isToday && (
                    <div className="text-[8px] animate-pulse mt-0.5">TODAY</div>
                  )}
                </div>
                <div className="flex-1">
                  {projects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {projects.map((project, pidx) => (
                        <a
                          key={pidx}
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide transition-all inline-flex items-center gap-1 ${
                            isRetro
                              ? "bg-green-900/30 border border-green-700 text-green-400 hover:bg-green-900/50"
                              : "bg-white border border-slate-300 text-slate-700 hover:shadow-sm"
                          }`}
                        >
                          <GitCommit className="w-2.5 h-2.5" />
                          {project.name}
                          <span className={`opacity-60`}>· {project.type}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className={`text-xs italic ${theme.textMuted}`}>
                      No activity
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Stats */}
      {agenda.length > 0 && (
        <div
          className={`p-4 rounded border ${isRetro ? "border-green-800 bg-green-900/5" : "border-slate-200 bg-slate-50"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${theme.textMuted}`}
            >
              Progress
            </span>
            <span className={`text-sm font-bold ${theme.textBold}`}>
              {agenda.filter((g) => g.completed).length} / {agenda.length}
            </span>
          </div>
          <div
            className={`h-2 rounded-full overflow-hidden ${isRetro ? "bg-green-900/30" : "bg-slate-200"}`}
          >
            <div
              className={`h-full transition-all duration-500 ${isRetro ? "bg-green-500" : "bg-indigo-600"}`}
              style={{
                width: `${(agenda.filter((g) => g.completed).length / agenda.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
function getCurrentWeekKey() {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

function getWeekRange() {
  const curr = new Date();
  const day = curr.getDay() || 7;
  const monday = new Date(curr);
  monday.setDate(curr.getDate() - (day - 1));

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const opts = { month: "short", day: "numeric" };
  return `${monday.toLocaleDateString("en-US", opts)} - ${friday.toLocaleDateString("en-US", opts)}`;
}

function getCurrentDayShort() {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
}

export default WeeklyAgenda;

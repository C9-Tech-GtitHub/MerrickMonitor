import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  currentWeekSchedule,
  getWeekSchedule,
  getAvailableWeeks,
  getWeekRangeDisplay,
} from "../data/weeklySchedule";

/**
 * Weekly Agenda Component
 * Displays week schedule with simple navigation
 */
const WeeklyAgenda = ({ theme, isRetro }) => {
  const [selectedWeekKey, setSelectedWeekKey] = useState(
    currentWeekSchedule.weekStart,
  );
  const [showWeekPicker, setShowWeekPicker] = useState(false);

  const availableWeeks = getAvailableWeeks();
  const weekData = getWeekSchedule(selectedWeekKey);
  const weekSchedule = weekData?.schedule || [];
  const weekRange = getWeekRangeDisplay(selectedWeekKey);
  const isCurrentWeek = selectedWeekKey === currentWeekSchedule.weekStart;

  const currentWeekIndex = availableWeeks.indexOf(selectedWeekKey);
  const canGoPrevious = currentWeekIndex < availableWeeks.length - 1;
  const canGoNext = currentWeekIndex > 0;

  const handlePreviousWeek = () => {
    if (canGoPrevious) {
      setSelectedWeekKey(availableWeeks[currentWeekIndex + 1]);
    }
  };

  const handleNextWeek = () => {
    if (canGoNext) {
      setSelectedWeekKey(availableWeeks[currentWeekIndex - 1]);
    }
  };

  const handleJumpToCurrent = () => {
    setSelectedWeekKey(currentWeekSchedule.weekStart);
    setShowWeekPicker(false);
  };

  const getSlotStyles = (slot) => {
    if (!slot)
      return { bg: "bg-transparent", text: "text-green-900/20", border: "" };

    // Christmas party - festive red and green theme
    if (slot.type === "christmas") {
      return {
        bg: isRetro
          ? "bg-gradient-to-r from-red-950/40 via-green-950/40 to-red-950/40 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]"
          : "bg-gradient-to-r from-red-100 via-green-100 to-red-100",
        text: isRetro
          ? "text-red-400 font-bold drop-shadow-[0_0_8px_rgba(220,38,38,0.6)] animate-pulse"
          : "text-red-600 font-bold",
        border: "",
        isChristmas: true,
      };
    }

    if (slot.type === "reactive") {
      return {
        bg: isRetro
          ? "bg-amber-950/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]"
          : "bg-amber-50",
        text: isRetro
          ? "text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"
          : "text-amber-700",
        border: "",
      };
    }

    return {
      bg: "bg-transparent",
      text: isRetro ? "text-green-400" : "text-slate-700",
      border: "",
    };
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation Header */}
      <div className="flex items-center justify-between">
        <h4
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.textMuted}`}
        >
          <Calendar className="w-3 h-3" />
          Weekly Agenda
        </h4>

        <div className="flex items-center gap-2">
          {/* Previous Week Button */}
          <button
            onClick={handlePreviousWeek}
            disabled={!canGoPrevious}
            className={`p-1.5 rounded transition-all ${
              canGoPrevious
                ? isRetro
                  ? "text-green-400 hover:bg-green-900/30 border border-green-800"
                  : "text-slate-700 hover:bg-slate-100 border border-slate-200"
                : "opacity-30 cursor-not-allowed"
            }`}
            title="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Week Range Display / Picker */}
          <div className="relative">
            <button
              onClick={() => setShowWeekPicker(!showWeekPicker)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                isRetro
                  ? "bg-green-900/30 text-green-400 border border-green-800 hover:bg-green-900/50"
                  : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              {weekRange}
              {!isCurrentWeek && (
                <span className={`ml-2 text-[9px] ${theme.textMuted}`}>
                  (past)
                </span>
              )}
            </button>

            {/* Week Picker Dropdown */}
            {showWeekPicker && (
              <div
                className={`absolute right-0 top-full mt-2 w-56 p-3 z-50 shadow-2xl ${
                  isRetro
                    ? "bg-black border-2 border-green-700"
                    : "bg-white rounded-xl border border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h5
                    className={`text-xs font-bold uppercase tracking-wider ${theme.accent}`}
                  >
                    Select Week
                  </h5>
                  <button
                    onClick={() => setShowWeekPicker(false)}
                    className={`text-xs ${theme.textMuted} hover:opacity-70`}
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableWeeks.map((weekKey) => {
                    const isCurrent = weekKey === currentWeekSchedule.weekStart;
                    const isSelected = weekKey === selectedWeekKey;

                    return (
                      <button
                        key={weekKey}
                        onClick={() => {
                          setSelectedWeekKey(weekKey);
                          setShowWeekPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                          isSelected
                            ? isRetro
                              ? "bg-green-900 text-green-100 border border-green-600"
                              : "bg-indigo-600 text-white"
                            : isRetro
                              ? "hover:bg-green-900/30 text-green-400 border border-green-900 hover:border-green-600"
                              : "hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-bold">
                          {getWeekRangeDisplay(weekKey)}
                        </div>
                        {isCurrent && (
                          <div className={`text-[10px] ${theme.accent} mt-0.5`}>
                            Current Week
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Next Week Button */}
          <button
            onClick={handleNextWeek}
            disabled={!canGoNext}
            className={`p-1.5 rounded transition-all ${
              canGoNext
                ? isRetro
                  ? "text-green-400 hover:bg-green-900/30 border border-green-800"
                  : "text-slate-700 hover:bg-slate-100 border border-slate-200"
                : "opacity-30 cursor-not-allowed"
            }`}
            title="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Jump to Current Week (only show when viewing past weeks) */}
          {!isCurrentWeek && (
            <button
              onClick={handleJumpToCurrent}
              className={`ml-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                isRetro
                  ? "bg-green-900 text-green-100 border border-green-700 hover:bg-green-800"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Current
            </button>
          )}
        </div>
      </div>

      {/* Schedule Table */}
      <div className="space-y-3">
        {/* Table Header */}
        <div
          className={`grid grid-cols-12 gap-0 px-4 py-2 text-[10px] uppercase tracking-widest font-bold ${theme.textMuted}`}
        >
          <div className="col-span-2">Day</div>
          <div className="col-span-5">Morning</div>
          <div className="col-span-5">Afternoon</div>
        </div>

        {/* Table Rows */}
        {weekSchedule.length > 0 ? (
          weekSchedule.map((daySchedule) => {
            const isToday =
              isCurrentWeek && daySchedule.day === getCurrentDayShort();
            const morningSlot = daySchedule.slots?.find(
              (s) => s.timeSlot === "morning",
            );
            const afternoonSlot = daySchedule.slots?.find(
              (s) => s.timeSlot === "afternoon",
            );

            // Check if it's an all-day task (same project AM and PM)
            const isAllDay =
              morningSlot &&
              afternoonSlot &&
              morningSlot.project === afternoonSlot.project &&
              morningSlot.type === afternoonSlot.type;

            return (
              <div
                key={daySchedule.day}
                className={`grid grid-cols-12 gap-0 border rounded-md overflow-hidden transition-all ${
                  isToday
                    ? isRetro
                      ? "border-green-500 shadow-[0_0_15px_rgba(0,255,0,0.15)] bg-green-950/10"
                      : "border-indigo-500 shadow-lg bg-indigo-50"
                    : isRetro
                      ? "border-green-900/40 hover:border-green-700/60"
                      : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Day Column */}
                <div
                  className={`col-span-2 flex flex-col items-start justify-center pl-4 py-3 border-r ${isRetro ? "border-green-900/40 bg-green-950/10" : "border-slate-200 bg-slate-50"}`}
                >
                  <span
                    className={`text-lg font-bold tracking-wider ${isToday ? theme.accent : theme.textMuted}`}
                  >
                    {daySchedule.day}
                  </span>
                  {isToday && (
                    <span
                      className={`text-[9px] font-bold tracking-widest mt-0.5 ${theme.accent}`}
                    >
                      TODAY
                    </span>
                  )}
                </div>

                {/* All Day or Split Layout */}
                {isAllDay ? (
                  <div className="col-span-10">
                    <div
                      className={`h-full w-full px-4 py-3 flex flex-col items-center justify-center gap-1 ${getSlotStyles(morningSlot).bg}`}
                    >
                      <span
                        className={`font-mono text-sm tracking-wider ${getSlotStyles(morningSlot).text}`}
                      >
                        {morningSlot.project}
                      </span>
                      <span
                        className={`text-[10px] uppercase border px-1.5 py-0.5 rounded tracking-wider ${
                          morningSlot.type === "christmas"
                            ? isRetro
                              ? "border-red-500 text-red-400 bg-red-950/50 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                              : "border-red-300 text-red-600 bg-red-50"
                            : morningSlot.type === "reactive"
                              ? isRetro
                                ? "border-amber-600 text-amber-500 bg-amber-950/50"
                                : "border-amber-300 text-amber-700"
                              : isRetro
                                ? "border-green-700 text-green-600"
                                : "border-slate-300 text-slate-600"
                        }`}
                      >
                        {morningSlot.type === "christmas"
                          ? "FESTIVE"
                          : morningSlot.type === "reactive"
                            ? "REACTIVE"
                            : "PLANNED"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Morning Column */}
                    <div
                      className={`col-span-5 border-r ${isRetro ? "border-green-900/40" : "border-slate-200"}`}
                    >
                      {morningSlot ? (
                        <div
                          className={`h-full w-full px-4 py-3 flex items-center justify-between ${getSlotStyles(morningSlot).bg}`}
                        >
                          <span
                            className={`font-mono text-sm tracking-wider ${getSlotStyles(morningSlot).text}`}
                          >
                            {morningSlot.project}
                          </span>
                          <span
                            className={`text-[10px] uppercase border px-1.5 py-0.5 rounded tracking-wider ${
                              morningSlot.type === "christmas"
                                ? isRetro
                                  ? "border-red-500 text-red-400 bg-red-950/50 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                                  : "border-red-300 text-red-600 bg-red-50"
                                : morningSlot.type === "reactive"
                                  ? isRetro
                                    ? "border-amber-600 text-amber-500 bg-amber-950/50"
                                    : "border-amber-300 text-amber-700"
                                  : isRetro
                                    ? "border-green-700 text-green-600"
                                    : "border-slate-300 text-slate-600"
                            }`}
                          >
                            {morningSlot.type === "christmas"
                              ? "FESTIVE"
                              : morningSlot.type === "reactive"
                                ? "REACTIVE"
                                : "PLANNED"}
                          </span>
                        </div>
                      ) : (
                        <div className="h-full opacity-20 bg-green-950/20"></div>
                      )}
                    </div>

                    {/* Afternoon Column */}
                    <div className="col-span-5">
                      {afternoonSlot ? (
                        <div
                          className={`h-full w-full px-4 py-3 flex items-center justify-between ${getSlotStyles(afternoonSlot).bg}`}
                        >
                          <span
                            className={`font-mono text-sm tracking-wider ${getSlotStyles(afternoonSlot).text}`}
                          >
                            {afternoonSlot.project}
                          </span>
                          <span
                            className={`text-[10px] uppercase border px-1.5 py-0.5 rounded tracking-wider ${
                              afternoonSlot.type === "christmas"
                                ? isRetro
                                  ? "border-red-500 text-red-400 bg-red-950/50 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                                  : "border-red-300 text-red-600 bg-red-50"
                                : afternoonSlot.type === "reactive"
                                  ? isRetro
                                    ? "border-amber-600 text-amber-500 bg-amber-950/50"
                                    : "border-amber-300 text-amber-700"
                                  : isRetro
                                    ? "border-green-700 text-green-600"
                                    : "border-slate-300 text-slate-600"
                            }`}
                          >
                            {afternoonSlot.type === "christmas"
                              ? "FESTIVE"
                              : afternoonSlot.type === "reactive"
                                ? "REACTIVE"
                                : "PLANNED"}
                          </span>
                        </div>
                      ) : (
                        <div className="h-full opacity-20 bg-green-950/20"></div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className={`text-center py-8 ${theme.textMuted} text-sm`}>
            -- No Activity --
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function
function getCurrentDayShort() {
  return new Date()
    .toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Australia/Melbourne",
    })
    .toUpperCase();
}

export default WeeklyAgenda;

import React from "react";
import { Calendar } from "lucide-react";

/**
 * Weekly Agenda Component
 * Displays hardcoded week schedule in table format
 */
const WeeklyAgenda = ({ theme, isRetro }) => {
  // Hardcoded weekly schedule
  const hardcodedAgenda = [
    {
      day: "MON",
      slots: [
        {
          timeSlot: "morning",
          project: "Sheet Freak",
          type: "planned",
          completed: true,
        },
        {
          timeSlot: "afternoon",
          project: "On-Page Sheet",
          type: "planned",
          completed: true,
        },
      ],
    },
    {
      day: "TUE",
      slots: [
        {
          timeSlot: "morning",
          project: "On-Page Sheet",
          type: "planned",
          completed: true,
        },
        {
          timeSlot: "afternoon",
          project: "On-Page Sheet",
          type: "planned",
          completed: true,
        },
      ],
    },
    {
      day: "WED",
      slots: [
        {
          timeSlot: "morning",
          project: "Merrick Monitor",
          type: "unplanned",
          completed: true,
        },
        {
          timeSlot: "afternoon",
          project: "Merrick Monitor",
          type: "unplanned",
          completed: true,
        },
      ],
    },
    {
      day: "THU",
      slots: [
        {
          timeSlot: "morning",
          project: "Merrick Monitor",
          type: "unplanned",
          completed: false,
        },
        {
          timeSlot: "afternoon",
          project: "On-Page Sheet",
          type: "planned",
          completed: false,
        },
      ],
    },
    {
      day: "FRI",
      slots: [
        {
          timeSlot: "morning",
          project: "On-Page Sheet",
          type: "planned",
          completed: false,
        },
        {
          timeSlot: "afternoon",
          project: "On-Page Sheet",
          type: "planned",
          completed: false,
        },
      ],
    },
  ];

  const getSlotStyles = (slot) => {
    if (!slot)
      return { bg: "bg-transparent", text: "text-green-900/20", border: "" };

    if (slot.completed) {
      return {
        bg: isRetro ? "bg-green-950/10" : "bg-green-50",
        text: isRetro ? "text-green-900" : "text-green-700",
        border: "",
      };
    }

    if (slot.type === "unplanned") {
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
      {/* Hardcoded Weekly Schedule */}
      <div className="space-y-3">
        <h4
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.textMuted}`}
        >
          ~ Project Activity This Week
        </h4>

        {/* Table Header */}
        <div
          className={`grid grid-cols-12 gap-0 px-4 py-2 text-[10px] uppercase tracking-widest font-bold ${theme.textMuted}`}
        >
          <div className="col-span-2">Day</div>
          <div className="col-span-5">Morning</div>
          <div className="col-span-5">Afternoon</div>
        </div>

        {/* Table Rows */}
        {hardcodedAgenda.map((daySchedule) => {
          const isToday = daySchedule.day === getCurrentDayShort();
          const morningSlot = daySchedule.slots.find(
            (s) => s.timeSlot === "morning",
          );
          const afternoonSlot = daySchedule.slots.find(
            (s) => s.timeSlot === "afternoon",
          );

          // Check if it's an all-day task (same project AM and PM)
          const isAllDay =
            morningSlot &&
            afternoonSlot &&
            morningSlot.project === afternoonSlot.project &&
            morningSlot.type === afternoonSlot.type &&
            morningSlot.completed === afternoonSlot.completed;

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
                    className={`h-full w-full px-4 py-3 flex items-center justify-center gap-3 ${getSlotStyles(morningSlot).bg}`}
                  >
                    <span
                      className={`font-mono text-sm tracking-wider ${getSlotStyles(morningSlot).text}`}
                    >
                      {morningSlot.project}
                    </span>
                    <span
                      className={`text-[10px] uppercase border px-1.5 py-0.5 rounded tracking-wider ${
                        morningSlot.type === "unplanned"
                          ? isRetro
                            ? "border-amber-600 text-amber-500 bg-amber-950/50"
                            : "border-amber-300 text-amber-700"
                          : isRetro
                            ? "border-green-700 text-green-600"
                            : "border-slate-300 text-slate-600"
                      }`}
                    >
                      {morningSlot.type === "unplanned"
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
                            morningSlot.type === "unplanned"
                              ? isRetro
                                ? "border-amber-600 text-amber-500 bg-amber-950/50"
                                : "border-amber-300 text-amber-700"
                              : isRetro
                                ? "border-green-700 text-green-600"
                                : "border-slate-300 text-slate-600"
                          }`}
                        >
                          {morningSlot.type === "unplanned"
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
                            afternoonSlot.type === "unplanned"
                              ? isRetro
                                ? "border-amber-600 text-amber-500 bg-amber-950/50"
                                : "border-amber-300 text-amber-700"
                              : isRetro
                                ? "border-green-700 text-green-600"
                                : "border-slate-300 text-slate-600"
                          }`}
                        >
                          {afternoonSlot.type === "unplanned"
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
        })}
      </div>
    </div>
  );
};

// Helper functions
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

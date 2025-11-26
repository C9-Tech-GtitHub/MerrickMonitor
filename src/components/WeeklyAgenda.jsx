import React from "react";
import { Calendar } from "lucide-react";

/**
 * Weekly Agenda Component
 * Displays hardcoded week schedule
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
            <Calendar className="inline w-4 h-4 mr-2" />
            Weekly Agenda
          </h3>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>
            Week of {getWeekRange()}
          </p>
        </div>
      </div>

      {/* Hardcoded Weekly Schedule */}
      <div className="space-y-3">
        <h4
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.textMuted}`}
        >
          ~ Project Activity This Week
        </h4>
        {hardcodedAgenda.map((daySchedule) => {
          const isToday = daySchedule.day === getCurrentDayShort();

          return (
            <div
              key={daySchedule.day}
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
                {daySchedule.day}
                {isToday && (
                  <div className="text-[8px] animate-pulse mt-0.5">TODAY</div>
                )}
              </div>
              <div className="flex-1 flex gap-6">
                {/* Morning */}
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className={`text-[9px] font-bold w-8 ${theme.textMuted}`}
                  >
                    AM
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {daySchedule.slots
                      .filter((s) => s.timeSlot === "morning")
                      .map((slot, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide transition-all inline-flex items-center gap-1 ${
                            slot.completed
                              ? isRetro
                                ? "bg-green-900/30 border border-green-700 text-green-400"
                                : "bg-green-50 border border-green-300 text-green-700"
                              : slot.type === "unplanned"
                                ? isRetro
                                  ? "bg-amber-900/30 border border-amber-700 text-amber-400"
                                  : "bg-amber-50 border border-amber-300 text-amber-700"
                                : isRetro
                                  ? "bg-slate-900/30 border border-slate-700 text-slate-400"
                                  : "bg-slate-50 border border-slate-300 text-slate-500"
                          }`}
                        >
                          {slot.type === "unplanned" && !slot.completed && (
                            <span className="opacity-60">!</span>
                          )}
                          {slot.project}
                          <span className="opacity-60">·</span>
                          <span className="opacity-60">
                            {slot.type === "unplanned" ? "REACTIVE" : "PLANNED"}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                {/* Afternoon */}
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className={`text-[9px] font-bold w-8 ${theme.textMuted}`}
                  >
                    PM
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {daySchedule.slots
                      .filter((s) => s.timeSlot === "afternoon")
                      .map((slot, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide transition-all inline-flex items-center gap-1 ${
                            slot.completed
                              ? isRetro
                                ? "bg-green-900/30 border border-green-700 text-green-400"
                                : "bg-green-50 border border-green-300 text-green-700"
                              : slot.type === "unplanned"
                                ? isRetro
                                  ? "bg-amber-900/30 border border-amber-700 text-amber-400"
                                  : "bg-amber-50 border border-amber-300 text-amber-700"
                                : isRetro
                                  ? "bg-slate-900/30 border border-slate-700 text-slate-400"
                                  : "bg-slate-50 border border-slate-300 text-slate-500"
                          }`}
                        >
                          {slot.type === "unplanned" && !slot.completed && (
                            <span className="opacity-60">!</span>
                          )}
                          {slot.project}
                          <span className="opacity-60">·</span>
                          <span className="opacity-60">
                            {slot.type === "unplanned" ? "REACTIVE" : "PLANNED"}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
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

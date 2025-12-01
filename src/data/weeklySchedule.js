/**
 * Weekly Schedule Data
 * Simple structure for tracking weekly work agenda
 *
 * To update your weekly schedule:
 * 1. Edit the schedule for the current week below
 * 2. At the end of the week, move current week data to weeklyHistory
 * 3. Clear the current week schedule for the next week
 *
 * Each week is identified by its start date (Monday of that week)
 */

// Current week's schedule (edit this at start of each week)
export const currentWeekSchedule = {
  weekStart: "2024-12-01", // Monday of current week (YYYY-MM-DD)
  schedule: [
    {
      day: "MON",
      slots: [
        {
          timeSlot: "morning",
          project: "Merrick Monitor – agenda set",
          type: "planned", // "planned" or "reactive"
        },
        {
          timeSlot: "afternoon",
          project: "PEM tool + reactive training",
          type: "planned",
        },
      ],
    },
    {
      day: "TUE",
      slots: [
        {
          timeSlot: "morning",
          project: "On-page",
          type: "planned",
        },
        {
          timeSlot: "afternoon",
          project: "Outback Equipment",
          type: "reactive",
        },
      ],
    },
    {
      day: "WED",
      slots: [
        {
          timeSlot: "morning",
          project: "Woolworths research",
          type: "planned",
        },
        {
          timeSlot: "afternoon",
          project: "Woolworths research",
          type: "planned",
        },
      ],
    },
    {
      day: "THU",
      slots: [
        {
          timeSlot: "morning",
          project: "PEM Tool",
          type: "planned",
        },
        {
          timeSlot: "afternoon",
          project: "PEM Tool",
          type: "planned",
        },
      ],
    },
    {
      day: "FRI",
      slots: [
        {
          timeSlot: "morning",
          project: "On-page",
          type: "planned",
        },
      ],
    },
  ],
};

// Historical weeks (automatically populated, don't edit manually)
// Structure: { "2024-11-26": { weekStart: "2024-11-26", schedule: [...] }, ... }
export const weeklyHistory = {
  "2024-11-26": {
    weekStart: "2024-11-26",
    schedule: [
      {
        day: "MON",
        slots: [
          {
            timeSlot: "morning",
            project: "Sheet Freak",
            type: "planned",
          },
          {
            timeSlot: "afternoon",
            project: "On-Page Sheet",
            type: "planned",
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
          },
          {
            timeSlot: "afternoon",
            project: "On-Page Sheet",
            type: "planned",
          },
        ],
      },
      {
        day: "WED",
        slots: [
          {
            timeSlot: "morning",
            project: "Merrick Monitor",
            type: "reactive",
          },
          {
            timeSlot: "afternoon",
            project: "Merrick Monitor",
            type: "reactive",
          },
        ],
      },
      {
        day: "THU",
        slots: [
          {
            timeSlot: "morning",
            project: "Merrick Monitor",
            type: "reactive",
          },
          {
            timeSlot: "afternoon",
            project: "On-Page Sheet",
            type: "planned",
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
          },
          {
            timeSlot: "afternoon",
            project: "On-Page Sheet",
            type: "planned",
          },
        ],
      },
    ],
  },
};

/**
 * Get schedule for a specific week
 * @param {string} weekKey - Week start date (YYYY-MM-DD)
 * @returns {Object|null} - Week schedule or null if not found
 */
export function getWeekSchedule(weekKey) {
  if (weekKey === currentWeekSchedule.weekStart) {
    return currentWeekSchedule;
  }
  return weeklyHistory[weekKey] || null;
}

/**
 * Get all available week keys (sorted newest first)
 * @returns {string[]}
 */
export function getAvailableWeeks() {
  const weeks = [currentWeekSchedule.weekStart, ...Object.keys(weeklyHistory)];
  return weeks.sort((a, b) => b.localeCompare(a));
}

/**
 * Calculate workload metrics from schedule
 * @param {Array} schedule - Day schedule array
 * @returns {Object} - Metrics (plannedPercent, reactivePercent, rndPercent)
 */
export function calculateMetrics(schedule) {
  if (!schedule || schedule.length === 0) {
    return {
      plannedPercent: 0,
      reactivePercent: 0,
      rndPercent: 0,
    };
  }

  let totalSlots = 0;
  let plannedSlots = 0;
  let reactiveSlots = 0;
  let rndSlots = 0;

  schedule.forEach((day) => {
    if (!day.slots) return;
    day.slots.forEach((slot) => {
      totalSlots++;

      if (slot.type === "planned") {
        plannedSlots++;
      } else if (slot.type === "reactive") {
        reactiveSlots++;
      }

      // Check if project name contains R&D keywords
      if (
        slot.project?.toLowerCase().includes("r&d") ||
        slot.project?.toLowerCase().includes("research")
      ) {
        rndSlots++;
      }
    });
  });

  if (totalSlots === 0) {
    return { plannedPercent: 0, reactivePercent: 0, rndPercent: 0 };
  }

  return {
    plannedPercent: Math.round((plannedSlots / totalSlots) * 100),
    reactivePercent: Math.round((reactiveSlots / totalSlots) * 100),
    rndPercent: Math.round((rndSlots / totalSlots) * 100),
  };
}

/**
 * Get week range display (e.g., "Nov 26 - Nov 30")
 * @param {string} weekStart - Week start date (YYYY-MM-DD)
 * @returns {string}
 */
export function getWeekRangeDisplay(weekStart) {
  const [year, month, day] = weekStart.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  const end = new Date(year, month - 1, day + 4);

  const opts = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
}

// Legacy export for backwards compatibility
export const weeklySchedule = currentWeekSchedule.schedule;

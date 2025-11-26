/**
 * Shared weekly schedule data
 * Used by both WeeklyAgenda and WeeklyLog components
 */
export const weeklySchedule = [
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

/**
 * Convert weekly schedule to the format used by Weekly Log
 * @param {Array} schedule - The weekly schedule array
 * @returns {Object} Schedule formatted for Weekly Log component
 */
export const convertToWeeklyLogFormat = (schedule) => {
  const result = {};

  schedule.forEach((dayData) => {
    result[dayData.day] = dayData.slots.map((slot, index) => ({
      id: `${dayData.day}-${slot.timeSlot}`,
      task: slot.project,
      type: slot.type === "planned" ? "PLANNED" : "REACTIVE",
      status: slot.completed ? "DONE" : "PENDING",
      timeSlot: slot.timeSlot,
    }));
  });

  return result;
};

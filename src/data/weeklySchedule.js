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
// Use "actual" for what actually happened, "plan" for original plan
export const currentWeekSchedule = {
  weekStart: "2026-02-16", // Monday of current week (YYYY-MM-DD)
  // Original plan for the week (set at start of week, don't modify)
  plan: [
    {
      day: "MON",
      slots: [
        { timeSlot: "morning", project: "Meeting, Interview & Merrick Monitor", type: "planned" },
        { timeSlot: "afternoon", project: "Cloud Screaming Frog", type: "planned" },
      ],
    },
    {
      day: "TUE",
      slots: [
        { timeSlot: "morning", project: "PEM", type: "planned" },
        { timeSlot: "afternoon", project: "On-Page", type: "planned" },
      ],
    },
    {
      day: "WED",
      slots: [
        { timeSlot: "morning", project: "Cloud SF & PEM Integration Research", type: "planned" },
        { timeSlot: "afternoon", project: "On-Page Sheet", type: "planned" },
      ],
    },
    {
      day: "THU",
      slots: [
        { timeSlot: "morning", project: "Woolworths Review", type: "planned" },
        { timeSlot: "afternoon", project: "Client PEM Mapping", type: "planned" },
      ],
    },
    {
      day: "FRI",
      slots: [
        { timeSlot: "morning", project: "On-Page Sheet", type: "planned" },
        { timeSlot: "afternoon", project: "Cloud Screaming Frog Review", type: "planned" },
      ],
    },
  ],
  // Actual schedule (updated as week progresses)
  schedule: [
    {
      day: "MON",
      slots: [
        { timeSlot: "morning", project: "Meeting, Interview & Merrick Monitor", type: "planned" },
        { timeSlot: "afternoon", project: "Cloud Screaming Frog", type: "planned" },
      ],
    },
    {
      day: "TUE",
      slots: [
        { timeSlot: "morning", project: "PEM", type: "planned" },
        { timeSlot: "afternoon", project: "On-Page", type: "planned" },
      ],
    },
    {
      day: "WED",
      slots: [
        { timeSlot: "morning", project: "Cloud SF & PEM Integration Research", type: "planned" },
        { timeSlot: "afternoon", project: "On-Page Sheet", type: "planned" },
      ],
    },
    {
      day: "THU",
      slots: [
        { timeSlot: "morning", project: "Woolworths Review", type: "planned" },
        { timeSlot: "afternoon", project: "Client PEM Mapping", type: "planned" },
      ],
    },
    {
      day: "FRI",
      slots: [
        { timeSlot: "morning", project: "On-Page Sheet", type: "planned" },
        { timeSlot: "afternoon", project: "Cloud Screaming Frog Review", type: "planned" },
      ],
    },
  ],
};

// Historical weeks (automatically populated, don't edit manually)
// Structure: { "2024-11-26": { weekStart: "2024-11-26", schedule: [...] }, ... }
export const weeklyHistory = {
  "2026-02-09": {
    weekStart: "2026-02-09",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Merrick Monitor & Woolies Crawl", type: "planned" }, { timeSlot: "afternoon", project: "Title Dashboard", type: "planned" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "PEM Tool Feature Development", type: "planned" }, { timeSlot: "afternoon", project: "Title Dashboard", type: "planned" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Woolies", type: "planned" }, { timeSlot: "afternoon", project: "Woolies", type: "planned" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "On-Page Review", type: "planned" }, { timeSlot: "afternoon", project: "Randy Development Review", type: "planned" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "SOP Review", type: "planned" }, { timeSlot: "afternoon", project: "SOP Review", type: "planned" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Merrick Monitor & Woolies Crawl", type: "planned" }, { timeSlot: "afternoon", project: "Title Dashboard", type: "planned" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "PEM Tool Feature Development", type: "planned" }, { timeSlot: "afternoon", project: "Title Dashboard", type: "planned" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Woolies", type: "planned" }, { timeSlot: "afternoon", project: "Woolies", type: "planned" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "On-Page Review", type: "planned" }, { timeSlot: "afternoon", project: "Randy Development Review", type: "planned" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "SOP Review", type: "planned" }, { timeSlot: "afternoon", project: "SOP Review", type: "planned" }] },
    ],
  },
  "2026-02-03": {
    weekStart: "2026-02-03",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Meeting & KPI Measurements", type: "planned" }, { timeSlot: "afternoon", project: "Holiday", type: "holiday" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Recovery from Flight", type: "holiday" }, { timeSlot: "afternoon", project: "Recovery from Flight", type: "holiday" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Merrick Monitor & Review Randy", type: "planned" }, { timeSlot: "afternoon", project: "Merrick Monitor & Review Randy", type: "planned" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "PEM & Woolies", type: "planned" }, { timeSlot: "afternoon", project: "PEM & Woolies", type: "planned" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "PEM", type: "planned" }, { timeSlot: "afternoon", project: "PEM", type: "planned" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Meeting & KPI Measurements", type: "planned" }, { timeSlot: "afternoon", project: "Holiday", type: "holiday" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Recovery from Flight", type: "holiday" }, { timeSlot: "afternoon", project: "Recovery from Flight", type: "holiday" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Merrick Monitor & Review Randy", type: "planned" }, { timeSlot: "afternoon", project: "Merrick Monitor & Review Randy", type: "planned" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "PEM & Woolies", type: "planned" }, { timeSlot: "afternoon", project: "PEM & Woolies", type: "planned" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "PEM", type: "planned" }, { timeSlot: "afternoon", project: "PEM", type: "planned" }] },
    ],
  },
  "2026-01-27": {
    weekStart: "2026-01-27",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "P.E.M Tool", type: "planned" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "Merrick Monitor & Randy Review", type: "planned" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "Woolies/P.E.M", type: "planned" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "On-page", type: "planned" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Singapore Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "Singapore Holiday", type: "holiday" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "P.E.M Tool", type: "planned" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "Merrick Monitor & Randy Review", type: "planned" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "Woolies/P.E.M", type: "planned" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "On-page", type: "planned" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Singapore Holiday", type: "holiday" }, { timeSlot: "afternoon", project: "Singapore Holiday", type: "holiday" }] },
    ],
  },
  "2026-01-05": {
    weekStart: "2026-01-05",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Merrick Monitor & Agenda Planning", type: "planned" }, { timeSlot: "afternoon", project: "Lead Gen Woolies Prep", type: "planned" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Lead Gen", type: "planned" }, { timeSlot: "afternoon", project: "SOP Review", type: "planned" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "PEM Tool", type: "planned" }, { timeSlot: "afternoon", project: "Woolies Review", type: "planned" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Full Review & Trip Setup", type: "planned" }, { timeSlot: "afternoon", project: "Full Review & Trip Setup", type: "planned" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "holiday" }, { timeSlot: "afternoon", project: "Holidays", type: "holiday" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Merrick Monitor & Agenda Planning", type: "planned" }, { timeSlot: "afternoon", project: "Lead Gen Woolies Prep", type: "planned" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Lead Gen", type: "planned" }, { timeSlot: "afternoon", project: "SOP Review", type: "planned" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "PEM Tool", type: "planned" }, { timeSlot: "afternoon", project: "Woolies Review", type: "planned" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Full Review & Trip Setup", type: "planned" }, { timeSlot: "afternoon", project: "Full Review & Trip Setup", type: "planned" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "holiday" }, { timeSlot: "afternoon", project: "Holidays", type: "holiday" }] },
    ],
  },
  "2026-01-26": {
    weekStart: "2026-01-26",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
    ],
  },
  "2026-01-19": {
    weekStart: "2026-01-19",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
    ],
  },
  "2026-01-12": {
    weekStart: "2026-01-12",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
    ],
  },
  "2025-12-29": {
    weekStart: "2025-12-29",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Holidays", type: "christmas" }] },
    ],
  },
  "2025-12-22": {
    weekStart: "2025-12-22",
    plan: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
    ],
    schedule: [
      { day: "MON", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
      { day: "TUE", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
      { day: "WED", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
      { day: "THU", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
      { day: "FRI", slots: [{ timeSlot: "morning", project: "Festive Holidays", type: "christmas" }, { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" }] },
    ],
  },
  "2025-12-15": {
    weekStart: "2025-12-15",
    plan: [
      {
        day: "MON",
        slots: [
          { timeSlot: "morning", project: "P.E.M", type: "planned" },
          { timeSlot: "afternoon", project: "P.E.M", type: "planned" },
        ],
      },
      {
        day: "TUE",
        slots: [
          { timeSlot: "morning", project: "P.E.M", type: "planned" },
          { timeSlot: "afternoon", project: "P.E.M", type: "planned" },
        ],
      },
      {
        day: "WED",
        slots: [
          { timeSlot: "morning", project: "P.E.M", type: "planned" },
          { timeSlot: "afternoon", project: "P.E.M", type: "planned" },
        ],
      },
      {
        day: "THU",
        slots: [
          { timeSlot: "morning", project: "P.E.M", type: "planned" },
          { timeSlot: "afternoon", project: "P.E.M", type: "planned" },
        ],
      },
      {
        day: "FRI",
        slots: [
          { timeSlot: "morning", project: "Christmas Party", type: "christmas" },
          { timeSlot: "afternoon", project: "Christmas Party", type: "christmas" },
        ],
      },
    ],
    schedule: [
      {
        day: "MON",
        slots: [
          { timeSlot: "morning", project: "FAQ-Off (SOP Hub)", type: "planned" },
          { timeSlot: "afternoon", project: "FAQ-Off (SOP Hub)", type: "planned" },
        ],
      },
      {
        day: "TUE",
        slots: [
          { timeSlot: "morning", project: "FAQ-Off (SOP Hub)", type: "planned" },
          { timeSlot: "afternoon", project: "FAQ-Off (SOP Hub)", type: "planned" },
        ],
      },
      {
        day: "WED",
        slots: [
          { timeSlot: "morning", project: "Woolies Research", type: "planned" },
          { timeSlot: "afternoon", project: "Woolies Research", type: "planned" },
        ],
      },
      {
        day: "THU",
        slots: [
          { timeSlot: "morning", project: "Woolies Calls", type: "planned" },
          { timeSlot: "afternoon", project: "Lead Gen Tool", type: "planned" },
        ],
      },
      {
        day: "FRI",
        slots: [
          { timeSlot: "morning", project: "Festive Holidays", type: "christmas" },
          { timeSlot: "afternoon", project: "Festive Holidays", type: "christmas" },
        ],
      },
    ],
  },
  "2025-12-08": {
    weekStart: "2025-12-08",
    plan: [
      {
        day: "MON",
        slots: [
          { timeSlot: "morning", project: "Merrick Monitor", type: "planned" },
          { timeSlot: "afternoon", project: "Woolies research", type: "planned" },
        ],
      },
      {
        day: "TUE",
        slots: [
          { timeSlot: "morning", project: "On-Page", type: "planned" },
          { timeSlot: "afternoon", project: "On-Page", type: "planned" },
        ],
      },
      {
        day: "WED",
        slots: [
          { timeSlot: "morning", project: "Woolies", type: "planned" },
          { timeSlot: "afternoon", project: "Woolies", type: "planned" },
        ],
      },
      {
        day: "THU",
        slots: [
          { timeSlot: "morning", project: "BBox PEM", type: "planned" },
          { timeSlot: "afternoon", project: "BBox PEM", type: "planned" },
        ],
      },
      {
        day: "FRI",
        slots: [
          { timeSlot: "morning", project: "Mizuno PEM", type: "planned" },
          { timeSlot: "afternoon", project: "Mizuno PEM", type: "planned" },
        ],
      },
    ],
    schedule: [
      {
        day: "MON",
        slots: [
          { timeSlot: "morning", project: "Merrick Monitor", type: "planned" },
          { timeSlot: "afternoon", project: "Woolies research", type: "planned" },
        ],
      },
      {
        day: "TUE",
        slots: [
          { timeSlot: "morning", project: "PEM", type: "reactive", movedFrom: "On-Page" },
          { timeSlot: "afternoon", project: "Woolies research", type: "reactive", movedFrom: "On-Page" },
        ],
      },
      {
        day: "WED",
        slots: [
          { timeSlot: "morning", project: "Title Dashboard", type: "reactive", movedFrom: "Woolies" },
          { timeSlot: "afternoon", project: "Title Dashboard", type: "reactive", movedFrom: "Woolies" },
        ],
      },
      {
        day: "THU",
        slots: [
          { timeSlot: "morning", project: "Back Links", type: "reactive", movedFrom: "BBox PEM" },
          { timeSlot: "afternoon", project: "Leads", type: "reactive", movedFrom: "BBox PEM" },
        ],
      },
      {
        day: "FRI",
        slots: [
          { timeSlot: "morning", project: "BBox PEM", type: "planned", movedFrom: "THU" },
          { timeSlot: "afternoon", project: "Mizuno PEM", type: "planned" },
        ],
      },
    ],
  },
  "2024-12-01": {
    weekStart: "2024-12-01",
    schedule: [
      {
        day: "MON",
        slots: [
          { timeSlot: "morning", project: "Merrick Monitor – Agenda Set", type: "planned" },
          { timeSlot: "afternoon", project: "PEM Tool", type: "planned" },
          { timeSlot: "afternoon", project: "Reactive Training", type: "reactive" },
        ],
      },
      {
        day: "TUE",
        slots: [
          { timeSlot: "morning", project: "Outback Equipment", type: "reactive" },
          { timeSlot: "afternoon", project: "Outback Equipment", type: "reactive" },
        ],
      },
      {
        day: "WED",
        slots: [
          { timeSlot: "morning", project: "Woolworths Research", type: "planned" },
          { timeSlot: "afternoon", project: "Woolworths Research", type: "planned" },
        ],
      },
      {
        day: "THU",
        slots: [
          { timeSlot: "morning", project: "PEM Tool", type: "planned" },
          { timeSlot: "afternoon", project: "PEM Tool", type: "planned" },
        ],
      },
      {
        day: "FRI",
        slots: [
          { timeSlot: "morning", project: "On-Page", type: "planned" },
        ],
      },
    ],
  },
  "2024-11-26": {
    weekStart: "2024-11-26",
    schedule: [
      {
        day: "MON",
        slots: [
          { timeSlot: "morning", project: "Sheet Freak", type: "planned" },
          { timeSlot: "afternoon", project: "On-Page Sheet", type: "planned" },
        ],
      },
      {
        day: "TUE",
        slots: [
          { timeSlot: "morning", project: "On-Page Sheet", type: "planned" },
          { timeSlot: "afternoon", project: "On-Page Sheet", type: "planned" },
        ],
      },
      {
        day: "WED",
        slots: [
          { timeSlot: "morning", project: "Merrick Monitor", type: "reactive" },
          { timeSlot: "afternoon", project: "Merrick Monitor", type: "reactive" },
        ],
      },
      {
        day: "THU",
        slots: [
          { timeSlot: "morning", project: "Merrick Monitor", type: "reactive" },
          { timeSlot: "afternoon", project: "On-Page Sheet", type: "planned" },
        ],
      },
      {
        day: "FRI",
        slots: [
          { timeSlot: "morning", project: "On-Page Sheet", type: "planned" },
          { timeSlot: "afternoon", project: "On-Page Sheet", type: "planned" },
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
 * Get previous week's key
 * @param {string} currentWeekKey - Current week start date (YYYY-MM-DD)
 * @returns {string|null} - Previous week key or null if no previous week
 */
export function getPreviousWeekKey(currentWeekKey) {
  const weeks = getAvailableWeeks();
  const currentIndex = weeks.indexOf(currentWeekKey);
  // Since weeks are sorted newest first, previous week is at index + 1
  return currentIndex < weeks.length - 1 ? weeks[currentIndex + 1] : null;
}

/**
 * Calculate week-over-week change in metrics
 * @param {Object} currentMetrics - Current week metrics from calculateMetrics()
 * @param {Object} previousMetrics - Previous week metrics from calculateMetrics()
 * @returns {Object|null} - { reactiveChange, plannedChange, direction } or null if no comparison
 */
export function calculateWeekOverWeekChange(currentMetrics, previousMetrics) {
  if (!previousMetrics || !currentMetrics) return null;

  const reactiveChange =
    currentMetrics.reactivePercent - previousMetrics.reactivePercent;
  const plannedChange =
    currentMetrics.plannedPercent - previousMetrics.plannedPercent;

  return {
    reactiveChange,
    plannedChange,
    direction: reactiveChange > 0 ? "up" : reactiveChange < 0 ? "down" : "same",
  };
}

/**
 * Calculate workload metrics from schedule
 * Uses same calculation as WorkloadTracker for consistency
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

  let plannedSlots = 0;
  let reactiveSlots = 0;

  schedule.forEach((day) => {
    if (!day.slots) return;
    day.slots.forEach((slot) => {
      if (slot.type === "planned") {
        plannedSlots++;
      } else if (slot.type === "reactive") {
        reactiveSlots++;
      }
    });
  });

  // Fixed 15% R&D allocation
  const rndPercent = 15;

  // Calculate percentages with R&D factored in
  const totalWork = plannedSlots + reactiveSlots;
  const workPercent = 100 - rndPercent; // 85% for actual work

  const plannedPercent =
    totalWork > 0
      ? Math.round((plannedSlots / totalWork) * workPercent)
      : workPercent;
  const reactivePercent =
    totalWork > 0 ? Math.round((reactiveSlots / totalWork) * workPercent) : 0;

  return {
    plannedPercent,
    reactivePercent,
    rndPercent,
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

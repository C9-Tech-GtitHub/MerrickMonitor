/**
 * Script to populate current week's data in localStorage
 * Run this in the browser console to set up your week's agenda
 */

// Get current week key (Monday of this week)
function getCurrentWeekKey() {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

const weekKey = getCurrentWeekKey();

// Weekly Agenda - Planned tasks for the week
const weeklyAgenda = [
  {
    id: 1732531200000, // Monday morning timestamp
    text: "Finalize Bootstrap",
    completed: true,
    createdAt: "2025-11-25T08:00:00.000Z"
  },
  {
    id: 1732531200001,
    text: "Start work on On-Page Josh Bot",
    completed: true,
    createdAt: "2025-11-25T10:00:00.000Z"
  },
  {
    id: 1732790400000, // Thursday morning
    text: "Final work on Merrick Monitor (90% complete)",
    completed: false,
    createdAt: "2025-11-25T08:00:00.000Z"
  },
  {
    id: 1732876800000, // Friday
    text: "Finish new On-Page Josh Bot",
    completed: false,
    createdAt: "2025-11-25T08:00:00.000Z"
  }
];

// Reactive Tasks - Unplanned work that came up
const reactiveTasks = [
  {
    id: 1732704000000, // Wednesday
    name: "Build Merrick Monitor dashboard",
    addedAt: "2025-11-27T09:00:00.000Z"
  }
];

// Save to localStorage
const savedAgendas = JSON.parse(localStorage.getItem("weeklyAgendas") || "{}");
savedAgendas[weekKey] = weeklyAgenda;
localStorage.setItem("weeklyAgendas", JSON.stringify(savedAgendas));

const savedReactiveTasks = JSON.parse(localStorage.getItem("reactiveTasks") || "{}");
savedReactiveTasks[weekKey] = reactiveTasks;
localStorage.setItem("reactiveTasks", JSON.stringify(savedReactiveTasks));

console.log("✅ Week data populated!");
console.log(`Week key: ${weekKey}`);
console.log(`Planned tasks: ${weeklyAgenda.length}`);
console.log(`Reactive tasks: ${reactiveTasks.length}`);
console.log("\nWeekly Agenda:", weeklyAgenda);
console.log("Reactive Tasks:", reactiveTasks);

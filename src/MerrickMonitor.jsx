import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Cpu,
  Activity,
  AlertTriangle,
  BarChart2,
  Users,
  ShieldCheck,
  GitCommit,
  Clock,
  Zap,
  Calendar,
  Github,
  TrendingUp
} from 'lucide-react';

const MerrickMonitor = () => {
  const [date, setDate] = useState(new Date());
  const [cursorVisible, setCursorVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Blinking cursor & Time update
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    const cursorTimer = setInterval(() => setCursorVisible(v => !v), 800);
    return () => { clearInterval(timer); clearInterval(cursorTimer); };
  }, []);

  // Date Helpers
  const formatTime = (d) => d.toLocaleTimeString();
  const formatDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const getCurrentDayShort = () => date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  const getWeekRange = () => {
    const curr = new Date();
    // Start of week (Monday) calculation
    const day = curr.getDay() || 7; // Get current day number, converting Sun (0) to 7
    if (day !== 1) curr.setHours(-24 * (day - 1)); // Set to Monday

    const monday = new Date(curr);
    const friday = new Date(curr);
    friday.setDate(monday.getDate() + 4);

    const opts = { month: 'short', day: 'numeric' };
    return `${monday.toLocaleDateString('en-US', opts)} - ${friday.toLocaleDateString('en-US', opts)}`;
  };

  // --- MOCK DATA ---

  // Live Tools Data
  const toolFleet = [
    { id: 1, name: "ON_PAGE_JOSH_BOT", type: "BOT", status: "LIVE", users: 12, trend: "UP", activity: [1, 0, 0, 0, 0] },
    { id: 2, name: "RANDY_PEM_DASH", type: "DASH", status: "LIVE", users: 45, trend: "STABLE", activity: [0, 0, 1, 0, 0] },
    { id: 3, name: "INTERLINKING_SYS", type: "SEO", status: "LIVE", users: 8, trend: "UP", activity: [0, 0, 0, 0, 0] },
    { id: 4, name: "LSI_ANALYZER", type: "SEO", status: "BETA", users: 3, trend: "FLAT", activity: [0, 1, 0, 0, 0] },
    { id: 5, name: "GMC_TITLE_DASH", type: "DASH", status: "LIVE", users: 22, trend: "UP", activity: [0, 0, 0, 0, 0] },
    { id: 6, name: "META_CHECKER", type: "TOOL", status: "LIVE", users: 156, trend: "UP", activity: [1, 1, 0, 0, 0] },
    { id: 7, name: "SEASONAL_SALLY", type: "BOT", status: "MAINT", users: 4, trend: "DOWN", activity: [0, 0, 0, 1, 0] },
    { id: 8, name: "METAOBJECTS_AUTO", type: "AUTO", status: "LIVE", users: 19, trend: "STABLE", activity: [0, 0, 0, 0, 0] },
    { id: 9, name: "SCHEMA_SCANNER", type: "TOOL", status: "LIVE", users: 89, trend: "UP", activity: [0, 0, 0, 0, 1] },
    { id: 10, name: "COMPETITOR_SCRAPE", type: "SCRAPE", status: "LIVE", users: 12, trend: "STABLE", activity: [1, 0, 0, 0, 0] },
  ];

  const systems = [
    { id: "SYS_01", name: "LEGACY_CRM", status: "OK", latency: "45ms", uptime: "99.9%" },
    { id: "SYS_02", name: "DATA_WH", status: "WARN", latency: "820ms", uptime: "98.5%" },
    { id: "SYS_03", name: "INT_WIKI", status: "OK", latency: "12ms", uptime: "99.99%" },
    { id: "SYS_04", name: "CI_PIPELINE", status: "OK", latency: "110ms", uptime: "100%" },
  ];

  // Mon-Fri Schedule Data
  const weeklySchedule = {
    MON: [
      { id: 1, task: "Patch: Josh Bot", type: "MAINT", status: "DONE" },
      { id: 2, task: "User Training", type: "ADOPT", status: "DONE" }
    ],
    TUE: [
      { id: 3, task: "LSI Logic Tweak", type: "FEAT", status: "IN_PROG" }
    ],
    WED: [
      { id: 4, task: "Randy Dash Update", type: "MAINT", status: "PENDING" }
    ],
    THU: [
      { id: 5, task: "Seasonal Sally Fix", type: "MAINT", status: "PENDING" }
    ],
    FRI: [
      { id: 6, task: "Schema Scan Check", type: "MAINT", status: "PENDING" }
    ]
  };

  const reactiveLoad = 15;
  const totalUsers = toolFleet.reduce((acc, curr) => acc + curr.users, 0);

  // --- HELPERS ---

  const renderProgressBar = (percent, length = 20) => {
    const filledLen = Math.round((length * percent) / 100);
    const emptyLen = length - filledLen;
    return '▓'.repeat(filledLen) + '░'.repeat(emptyLen);
  };

  const renderSparkline = (data) => {
    const chars = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    const max = Math.max(...data);
    return data.map(v => chars[Math.floor((v / max) * 7)]).join('');
  };

  const renderActivityGrid = (activity) => {
    return (
      <div className="flex gap-1.5 font-mono text-[10px] items-center">
        {['M', 'T', 'W', 'T', 'F'].map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-0.5">
             <div
               className={`w-2 h-2 rounded-full ${activity[idx] ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-green-900/30'}`}
             ></div>
          </div>
        ))}
      </div>
    );
  };

  // --- VIEWS ---

  const OverviewView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-4">
      {/* Left Column (8 cols) */}
      <div className="lg:col-span-8 space-y-8">

        {/* Ops Load Section */}
        <section className="border border-green-800 p-5 bg-black">
          <h2 className="text-sm font-bold uppercase mb-4 flex items-center gap-2 text-green-400">
            <Activity className="w-4 h-4" />
            MAINTENANCE_LOAD
          </h2>
          <div className="flex justify-between text-xs mb-2 tracking-wide">
            <span className="text-green-600">STABLE_OPS</span>
            <span className="text-green-400 font-bold">REACTIVE_FIXES: {reactiveLoad}%</span>
          </div>
          <div className="font-mono text-sm break-all leading-none tracking-tighter opacity-90 text-green-500">
            {renderProgressBar(100 - reactiveLoad, 80)}
          </div>
        </section>

        {/* Live Tool Fleet Table */}
        <section className="border border-green-800 p-5 bg-black">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold uppercase flex items-center gap-2 text-green-400">
              <Cpu className="w-4 h-4" />
              LIVE_TOOL_FLEET
            </h2>
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-green-700 uppercase tracking-wider flex items-center gap-1">
                   <Github className="w-3 h-3" /> GH_ACTIVITY
                </span>
                <span className="text-xs text-green-600 animate-pulse ml-2">● SYSTEMS_ONLINE</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-green-800 text-xs text-green-700 uppercase tracking-wider">
                  <th className="p-3 font-normal w-12">ID</th>
                  <th className="p-3 font-normal">TOOL_NAME</th>
                  <th className="p-3 font-normal">ACTIVITY (M-F)</th>
                  <th className="p-3 font-normal">STATUS</th>
                  <th className="p-3 font-normal text-right">USERS</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs md:text-sm">
                {toolFleet.map((tool) => (
                  <tr key={tool.id} className="border-b border-green-900/40 hover:bg-green-900/10 group transition-colors">
                    <td className="p-3 text-green-700">{tool.id < 10 ? `0${tool.id}` : tool.id}</td>
                    <td className="p-3 font-bold text-green-500 group-hover:text-green-300 transition-colors">
                        <div>{tool.name}</div>
                        <div className="text-[10px] text-green-800 font-normal">{tool.type}</div>
                    </td>
                    <td className="p-3">
                        {renderActivityGrid(tool.activity)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded border ${
                        tool.status === 'LIVE' ? 'border-green-800 text-green-400 bg-green-900/20' :
                        tool.status === 'BETA' ? 'border-yellow-900 text-yellow-600' :
                        'border-red-900 text-red-800'
                      }`}>
                        {tool.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <span className="text-green-300 font-bold">{tool.users}</span>
                          {tool.trend === 'UP' && <TrendingUp className="w-3 h-3 text-green-500" />}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Right Column (4 cols) */}
      <div className="lg:col-span-4 space-y-8">

        {/* Weekly Timeline */}
        <section className="border border-green-800 p-5 bg-black">
          <h2 className="text-sm font-bold uppercase mb-6 flex items-center gap-2 text-green-400">
             <Calendar className="w-4 h-4" />
             WEEKLY_LOG
          </h2>
          <div className="text-xs text-green-600 mb-4 border-b border-green-900 pb-2">
             CURRENT WEEK: {getWeekRange()}
          </div>
          <div className="space-y-4">
            {Object.entries(weeklySchedule).map(([day, tasks]) => {
              const isToday = day === getCurrentDayShort();
              return (
                <div key={day} className={`flex gap-4 p-2 -mx-2 rounded transition-colors ${isToday ? 'bg-green-900/20 border border-green-900' : ''}`}>
                   <div className={`text-xs font-bold w-8 pt-1 ${isToday ? 'text-green-400' : 'text-green-700'}`}>
                      {day} {isToday && <span className="animate-pulse text-[8px] block">NOW</span>}
                   </div>
                   <div className={`flex-1 space-y-2 border-l pl-4 ${isToday ? 'border-green-500' : 'border-green-900'}`}>
                      {tasks.length > 0 ? tasks.map(t => (
                         <div key={t.id} className="text-xs group">
                            <span className={`text-[9px] mr-2 px-1 ${t.status === 'DONE' ? 'text-green-500 line-through opacity-50' : 'text-green-400'}`}>
                               {t.type}
                            </span>
                            <span className={t.status === 'DONE' ? 'text-green-800' : 'text-green-300'}>{t.task}</span>
                         </div>
                      )) : <span className="text-[10px] text-green-900 italic">-- No Activity --</span>}
                   </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* System Diagnostics */}
        <section className="border border-green-800 p-5 bg-black">
          <h2 className="text-sm font-bold uppercase mb-6 border-b border-green-800 pb-2 text-green-400">FLEET_HEALTH</h2>
          <div className="space-y-5">
            {systems.map((sys) => (
              <div key={sys.id} className="flex items-center justify-between text-xs group hover:bg-green-900/10 p-2 -mx-2 rounded transition-colors cursor-default">
                <div>
                  <div className="font-bold mb-1 text-green-300 group-hover:text-green-100">{sys.name}</div>
                  <div className="text-green-700 text-[10px] font-mono">LAT: {sys.latency}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold inline-block px-1 ${sys.status === 'WARN' ? 'bg-green-500 text-black' : 'text-green-500'}`}>
                    [{sys.status}]
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );

  const AdoptionView = () => (
    <div className="border border-green-800 p-6 animate-in fade-in duration-300 bg-black">
       <h2 className="text-sm font-bold uppercase mb-8 flex items-center gap-2 text-green-400">
          <Users className="w-4 h-4" />
          DETAILED_ADOPTION_METRICS
       </h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {toolFleet.map(tool => (
             <div key={tool.id} className="border border-green-800 p-5 bg-green-900/5 hover:bg-green-900/20 transition-all hover:border-green-600">
                <div className="text-xs text-green-600 mb-3">{tool.name}</div>
                <div className="flex justify-between items-end mb-4">
                   <div className="text-3xl font-bold text-green-300">{tool.users}</div>
                   <div className="text-[10px] text-green-700 mb-1">ACTIVE USERS</div>
                </div>
                <div className="pt-4 border-t border-green-900 flex justify-between items-center">
                   <div className="text-[10px] text-green-500 font-mono tracking-widest opacity-80">
                      {renderSparkline([10, 25, 40, 30, 60, tool.users - 10, tool.users])}
                   </div>
                   <div className={`text-[10px] font-bold ${tool.trend === 'UP' ? 'text-green-400' : 'text-green-700'}`}>
                      {tool.trend === 'UP' ? '↑ GROWTH' : tool.trend === 'DOWN' ? '↓ CHURN' : '→ STABLE'}
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 selection:bg-green-900 selection:text-green-100 overflow-hidden relative">

      {/* Reduced Scanline Effect for Clarity */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto border-2 border-green-900 p-1 relative z-10 shadow-[0_0_30px_rgba(34,197,94,0.05)]">

        {/* Header Section */}
        <header className="border-b-2 border-green-900 p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-black">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest flex items-center gap-3 text-green-500">
              <Terminal className="w-8 h-8" />
              MERRICK MONITOR
            </h1>
            <p className="text-xs text-green-800 mt-2 tracking-wide">FLEET_STATUS: OPERATIONAL // v.2.2</p>
          </div>
          <div className="text-right">
             <div className="font-bold text-2xl mb-1 text-green-400">
               {formatTime(date)}
               <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
             </div>
             <div className="text-xs text-green-700 font-bold mb-2 uppercase tracking-wide">
                {formatDate(date)}
             </div>
             {/* Tab Navigation */}
             <div className="flex justify-end gap-6 text-xs mt-2">
                {['OVERVIEW', 'ADOPTION'].map(tab => (
                   <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`uppercase tracking-widest hover:text-green-300 transition-colors py-1 ${activeTab === tab ? 'text-green-400 border-b-2 border-green-500 font-bold' : 'text-green-800'}`}
                   >
                      {tab}
                   </button>
                ))}
             </div>
          </div>
        </header>

        {/* Top Stats Row (Always Visible) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 px-6">
          <div className="border border-green-900 p-4 bg-green-900/5">
            <div className="text-[10px] text-green-700 mb-1 uppercase tracking-wider">MAINTENANCE_LOAD</div>
            <div className={`text-2xl font-bold ${reactiveLoad > 30 ? 'text-green-400' : 'text-green-600'}`}>{reactiveLoad}%</div>
          </div>
          <div className="border border-green-900 p-4 bg-green-900/5">
             <div className="text-[10px] text-green-700 mb-1 uppercase tracking-wider">LIVE_TOOLS</div>
             <div className="text-2xl font-bold text-green-500">{toolFleet.length} <span className="text-xs text-green-800">ONLINE</span></div>
          </div>
          <div className="border border-green-900 p-4 bg-green-900/5">
             <div className="text-[10px] text-green-700 mb-1 uppercase tracking-wider">TOTAL_USERS</div>
             <div className="text-2xl font-bold text-green-500">{totalUsers} <span className="text-xs text-green-800">ACROSS_FLEET</span></div>
          </div>
           <div className="border border-green-900 p-4 bg-green-900/5">
             <div className="text-[10px] text-green-700 mb-1 uppercase tracking-wider">SYSTEM_HEALTH</div>
             <div className="text-2xl font-bold text-green-400">98% <span className="text-xs text-green-800">NOMINAL</span></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 pb-6 min-h-[500px]">
           {activeTab === 'OVERVIEW' && <OverviewView />}
           {activeTab === 'ADOPTION' && <AdoptionView />}
        </div>

      </div>
    </div>
  );
};

export default MerrickMonitor;

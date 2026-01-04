/**
 * Christmas/Festive Theme - STORED FOR NEXT YEAR
 *
 * To re-enable for Christmas season:
 * 1. Copy the snowEffect JSX into MerrickMonitor.jsx (replace summer effect)
 * 2. Copy the CSS animations into index.css (replace summer animations)
 * 3. Update the button styling in MerrickMonitor.jsx
 */

// === JSX for Snow Effect (place in MerrickMonitor.jsx around line 1185) ===
export const christmasSnowEffect = `
{/* 8-Bit Snow Effect (Only in Holiday Mode) */}
{holidayMode && (
  <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden font-mono">
    {[...Array(60)].map((_, i) => {
      const snowChars = ["*", ".", "+", "o", "°", "·"];
      const char = snowChars[Math.floor(Math.random() * snowChars.length)];
      return (
        <div
          key={i}
          className="absolute text-green-400 opacity-60 animate-snowfall drop-shadow-[0_0_2px_rgba(74,222,128,0.8)]"
          style={{
            left: \`\${Math.random() * 100}%\`,
            animationDelay: \`\${Math.random() * 8}s\`,
            animationDuration: \`\${8 + Math.random() * 12}s\`,
            fontSize: \`\${10 + Math.random() * 8}px\`,
          }}
        >
          {char}
        </div>
      );
    })}
  </div>
)}
`;

// === CSS for Snowfall Animation (place in index.css) ===
export const christmasCSS = `
/* 8-bit snowfall animation */
@keyframes snowfall {
    0% {
        transform: translateY(-10px) translateX(0);
        opacity: 0;
    }
    10% {
        opacity: 0.6;
    }
    90% {
        opacity: 0.6;
    }
    100% {
        transform: translateY(100vh) translateX(20px);
        opacity: 0;
    }
}

.animate-snowfall {
    animation: snowfall linear infinite;
}
`;

// === Button Styling (for Holiday Mode toggle) ===
export const christmasButtonStyle = `
holidayMode
  ? "bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse"
  : isRetro
    ? "border border-green-900 text-green-600 hover:bg-green-900/30"
    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
`;

// === Button Icon ===
export const christmasButtonIcon = `{holidayMode ? "/*\\\\" : "/^\\\\"}`;

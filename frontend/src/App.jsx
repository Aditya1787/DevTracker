import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center shadow-xl space-y-6">
        <h1 className="text-4xl font-extrabold font-sans bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          DevTrackr
        </h1>
        <p className="text-textMuted font-sans text-sm md:text-base leading-relaxed">
          An AI-powered GitHub Analytics &amp; Developer Productivity Dashboard.
        </p>
        <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400">STATUS:</span>
            <span className="text-emerald-400 font-semibold animate-pulse">SCAFFOLD COMPLETE</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-indigo-400">DESIGN SYSTEM:</span>
            <span className="text-textPrimary">READY</span>
          </div>
        </div>
        <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 font-sans font-semibold text-sm hover:brightness-110 transition duration-200 shadow-md">
          Explore Dashboard
        </button>
      </div>
      <div className="mt-8 text-center text-xs font-mono text-slate-500">
        Created by Antigravity IDE • 2026
      </div>
    </div>
  );
}

export default App;

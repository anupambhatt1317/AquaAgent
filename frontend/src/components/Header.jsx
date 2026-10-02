import React from 'react';
import {
  Droplets,
  Play,
  Pause,
  RefreshCw,
  Info,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sliders
} from 'lucide-react';

export default function Header({
  status,
  isStreaming,
  onToggleStream,
  onReset,
  onOpenRoadmap,
  onFocusControlCenter
}) {
  const getNetworkBadge = () => {
    if (!status) return null;
    const sysStatus = status.status;
    if (sysStatus === 'CRITICAL') {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs tracking-wider animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          🔴 CRITICAL ANOMALY
        </div>
      );
    }
    if (sysStatus === 'WARNING') {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          🟡 SYSTEM WARNING
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs tracking-wider">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        🟢 NETWORK NORMAL
      </div>
    );
  };

  return (
    <header className="bg-[#063B5C] text-white shadow-xl border-b border-[#04273e] sticky top-0 z-40">
      {/* Top prototype transparency strip */}
      <div className="bg-[#04273e] px-4 py-1.5 text-center text-xs font-mono text-cyan-200/90 flex flex-wrap items-center justify-center gap-3 border-b border-cyan-500/10">
        <span className="px-2 py-0.5 rounded bg-[#00A8C6]/20 text-[#00A8C6] font-bold text-[10px] uppercase tracking-wider">
          PROTOTYPE MODE • SIMULATED IoT TELEMETRY
        </span>
        <span className="text-slate-300 hidden sm:inline">
          AquaAgent 2.0 AI Smart Water Network Control Center
        </span>
        <span className="text-cyan-300 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          ● AI AGENT ONLINE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00A8C6] via-[#0ea5e9] to-[#43A047] flex items-center justify-center shadow-lg ring-2 ring-white/10">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                AquaAgent <span className="text-[#00A8C6] font-mono text-xs px-2 py-0.5 bg-white/10 rounded-md border border-cyan-400/30">2.0</span>
              </h1>
              {getNetworkBadge()}
            </div>
            <p className="text-xs text-slate-300 font-medium">
              AI-Powered Smart Water Distribution & Conservation System
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Start/Pause Stream */}
          <button
            onClick={onToggleStream}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm border ${
              isStreaming
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-[#00A8C6] border-[#00A8C6] text-white hover:bg-[#00839a]'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>⏸ Pause Monitoring</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-white" />
                <span>▶ Start Monitoring</span>
              </>
            )}
          </button>

          {/* Reset Network */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white text-xs font-bold transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
            <span>↻ Reset Network</span>
          </button>

          {/* AI Control Center Shortcut */}
          <button
            onClick={onFocusControlCenter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00A8C6]/20 border border-[#00A8C6]/50 text-cyan-200 hover:bg-[#00A8C6]/30 text-xs font-bold transition shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-[#00A8C6]" />
            <span>⌘ AI Control Center</span>
          </button>

          {/* Architecture Roadmap Info */}
          <button
            onClick={onOpenRoadmap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-slate-200 hover:bg-white/20 text-xs font-bold transition shadow-sm"
          >
            <Info className="w-3.5 h-3.5 text-slate-300" />
            <span>Architecture Info</span>
          </button>
        </div>
      </div>
    </header>
  );
}

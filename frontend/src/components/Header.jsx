import React from 'react';
import { Activity, Droplets, RefreshCw, Play, Pause, ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export default function Header({
  status,
  isStreaming,
  onToggleStream,
  onReset,
  onOpenRoadmap
}) {
  const getStatusBadge = () => {
    if (!status) return null;
    const sysStatus = status.status;
    if (sysStatus === 'CRITICAL') {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 font-semibold text-xs tracking-wider animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          🔴 CRITICAL ANOMALY
        </div>
      );
    }
    if (sysStatus === 'WARNING') {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 font-semibold text-xs tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          🟡 SYSTEM WARNING
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-semibold text-xs tracking-wider">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        🟢 SYSTEM NORMAL
      </div>
    );
  };

  return (
    <header className="bg-[#063B5C] text-white shadow-md border-b border-[#04273e]">
      <div className="bg-[#04273e] px-4 py-1 text-center text-xs font-medium text-cyan-200/90 flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded bg-[#00A8C6]/20 text-[#00A8C6] font-bold text-[11px] uppercase tracking-wide">
          PPT Architecture Prototype
        </span>
        <span>AquaAgent 2.0 • AI-Powered Decision Support Layer (Realistic Simulated IoT Telemetry)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A8C6] to-[#43A047] flex items-center justify-center shadow-md">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                AquaAgent <span className="text-[#00A8C6] font-mono text-sm px-1.5 py-0.5 bg-white/10 rounded">2.0</span>
              </h1>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Smart Water Distribution & Conservation Management Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onToggleStream}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm border ${
              isStreaming
                ? 'bg-slate-700/60 border-slate-600 text-slate-200 hover:bg-slate-600'
                : 'bg-[#00A8C6] border-[#00A8C6] text-white hover:bg-[#00839a]'
            }`}
            title={isStreaming ? 'Pause continuous simulation stream' : 'Resume continuous simulation stream'}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-white" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 border border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white text-xs font-semibold transition shadow-sm"
            title="Reset system telemetry to baseline normal"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={onOpenRoadmap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00A8C6]/20 border border-[#00A8C6]/50 text-cyan-200 hover:bg-[#00A8C6]/30 text-xs font-semibold transition shadow-sm"
          >
            <Info className="w-3.5 h-3.5 text-[#00A8C6]" />
            <span>Architecture Info</span>
          </button>
        </div>
      </div>
    </header>
  );
}

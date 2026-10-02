import React from 'react';
import {
  Cpu,
  Eye,
  Search,
  Activity,
  ListOrdered,
  Wrench,
  FileCheck,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Bot
} from 'lucide-react';

export default function AIReasoningEngine({ status, network, onCommandValve }) {
  const isLeak = network?.leak_active && !network?.leak_isolated;
  const isContained = network?.leak_active && network?.leak_isolated;
  const currentStage = status?.decision_stage || 'MONITOR';

  const stages = [
    { id: 'MONITOR', label: 'Monitor', icon: Eye, desc: 'Real-time telemetry stream' },
    { id: 'DETECT', label: 'Detect', icon: Search, desc: 'Threshold & gradient audit' },
    { id: 'ANALYZE', label: 'Analyze', icon: Activity, desc: 'Cross-sensor correlation' },
    { id: 'PRIORITIZE', label: 'Prioritize', icon: ListOrdered, desc: 'Zone threat ranking' },
    { id: 'ACT', label: 'Act', icon: Wrench, desc: 'Actuator policy dispatch' },
    { id: 'REPORT', label: 'Report', icon: FileCheck, desc: 'SQLite audit logging' }
  ];

  const getStageIdx = (st) => {
    switch (st) {
      case 'MONITOR': return 0;
      case 'DETECT': return 1;
      case 'ANALYZE': return 2;
      case 'PRIORITIZE': return 3;
      case 'ACT': return 4;
      case 'REPORT': return 5;
      default: return 0;
    }
  };

  const activeIdx = isLeak ? 4 : isContained ? 5 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#DCE8ED] p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#063B5C] to-[#00A8C6] flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#063B5C] uppercase tracking-wide">
                AquaAgent AI Decision Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                AI AGENT ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Autonomous multi-sensor cross-correlation & closed-loop isolation advisory
            </p>
          </div>
        </div>

        {/* AI State Badge */}
        <div className="text-right">
          {isLeak ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5" />
              CRITICAL ANOMALY • ZONE B
            </span>
          ) : isContained ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              THREAT CONTAINED (V3 ISOLATED)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              MONITORING • NOMINAL
            </span>
          )}
        </div>
      </div>

      {/* 6-Stage Progress Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 my-4">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isPassed = idx <= activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={st.id}
              className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center relative ${
                isCurrent && isLeak
                  ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-400/30'
                  : isCurrent && isContained
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-400/20'
                    : isPassed
                      ? 'bg-cyan-50/50 border-[#00A8C6]/40'
                      : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${
                isCurrent && isLeak
                  ? 'bg-red-600 text-white animate-pulse'
                  : isCurrent && isContained
                    ? 'bg-emerald-600 text-white'
                    : isPassed
                      ? 'bg-[#00A8C6] text-white'
                      : 'bg-slate-200 text-slate-500'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isCurrent ? 'text-[#063B5C]' : 'text-slate-600'
              }`}>
                {st.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                {st.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Decision Summary & Action Callout */}
      <div className={`p-4 rounded-xl border transition-all ${
        isLeak
          ? 'bg-red-50/60 border-red-200'
          : isContained
            ? 'bg-emerald-50/60 border-emerald-200'
            : 'bg-[#F1F7F9] border-[#DCE8ED]'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Possible Issue / Cause
            </span>
            <p className={`text-xs font-bold ${isLeak ? 'text-red-900' : 'text-[#063B5C]'}`}>
              {isLeak
                ? 'Unusual flow-pressure pattern (Major pipe rupture / active leakage in Zone B)'
                : isContained
                  ? 'Zone B pipe burst successfully isolated by Valve V3'
                  : 'All hydraulic parameters within nominal operating baseline.'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Recommended Operator Response
            </span>
            <p className="text-xs font-semibold text-slate-700">
              {isLeak
                ? 'Isolate Zone B and inspect pipeline section.'
                : isContained
                  ? 'Schedule maintenance crew for localized pipe joint repair.'
                  : 'Maintain automated continuous monitoring across all 3 zones.'}
            </p>
          </div>

          {/* Action Trigger Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
            {isLeak && (
              <button
                onClick={() => onCommandValve('V3', 'CLOSED')}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 animate-bounce"
              >
                <span>🚨 EXECUTE: CLOSE V3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {isContained && (
              <div className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>THREAT CONTAINED</span>
              </div>
            )}
            {!isLeak && !isContained && (
              <div className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-mono font-semibold">
                Action: Auto-Supervision Active
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

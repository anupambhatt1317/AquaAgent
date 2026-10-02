import React from 'react';
import { Eye, Search, Cpu, ListOrdered, Wrench, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DecisionSupportPipeline({ status, activeAlert }) {
  const currentStage = status?.decision_stage || 'MONITOR';
  const isAnomaly = status?.status !== 'NORMAL';
  const possibleCause = status?.possible_cause || 'All hydraulic metrics nominal.';
  const recommendedAction = status?.recommended_action || 'Continue routine automated baseline telemetry.';

  const stages = [
    { id: 'MONITOR', label: 'Monitor', icon: Eye, desc: 'Real-time telemetry intake' },
    { id: 'DETECT', label: 'Detect', icon: Search, desc: 'Threshold & gradient checks' },
    { id: 'ANALYZE', label: 'Analyze', icon: Cpu, desc: 'Cross-sensor correlation' },
    { id: 'PRIORITIZE', label: 'Prioritize', icon: ListOrdered, desc: 'Severity classification' },
    { id: 'ACT', label: 'Act', icon: Wrench, desc: 'Actionable response delivery' },
    { id: 'REPORT', label: 'Report', icon: FileText, desc: 'SQLite audit logging' },
  ];

  const getStageIndex = (st) => {
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

  const activeIdx = isAnomaly ? getStageIndex(currentStage) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#DCE8ED] p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-[#063B5C] flex items-center gap-2">
            <span>AquaAgent Decision-Support Pipeline</span>
            <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-[#e0f7fa] text-[#00A8C6] border border-[#00A8C6]/30">
              Closed-Loop Reasoning Engine
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured 6-stage lifecycle for autonomous water anomaly identification and recommended response.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-slate-500">Pipeline State: </span>
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
            isAnomaly ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {isAnomaly ? `ANOMALY IN ${currentStage}` : 'MONITORING (NOMINAL)'}
          </span>
        </div>
      </div>

      {/* 6-Stage Progress Track */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 my-5">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isActive = idx <= activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={st.id}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center relative ${
                isCurrent && isAnomaly
                  ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-400/20'
                  : isCurrent && !isAnomaly
                    ? 'bg-[#e0f7fa] border-[#00A8C6] shadow-sm ring-2 ring-[#00A8C6]/20'
                    : isActive
                      ? 'bg-slate-50 border-slate-300'
                      : 'bg-white border-slate-100 opacity-60'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${
                isCurrent && isAnomaly
                  ? 'bg-red-600 text-white animate-pulse'
                  : isCurrent && !isAnomaly
                    ? 'bg-[#00A8C6] text-white'
                    : isActive
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-slate-100 text-slate-400'
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

      {/* Real-Time Decision Box */}
      <div className={`rounded-xl p-4 border transition-all ${
        isAnomaly ? 'bg-red-50/50 border-red-200' : 'bg-[#F1F7F9] border-[#DCE8ED]'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Diagnosis & Possible Cause
            </span>
            <div className="flex items-start gap-2">
              {isAnomaly ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <p className={`text-xs font-semibold ${isAnomaly ? 'text-red-900' : 'text-[#063B5C]'}`}>
                {possibleCause}
              </p>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Recommended Operator Action
            </span>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00A8C6] mt-1.5 shrink-0"></span>
              <p className="text-xs font-semibold text-slate-800">
                {recommendedAction}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

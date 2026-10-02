import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle, ShieldCheck, Clock, Check } from 'lucide-react';

export default function AlertsPanel({ alerts, onResolveAlert }) {
  const activeAlerts = alerts?.filter(a => a.status === 'ACTIVE' && a.severity !== 'NORMAL') || [];
  const resolvedAlerts = alerts?.filter(a => a.status === 'RESOLVED' || a.severity === 'NORMAL') || [];

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'HIGH':
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
            🔴 HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            🟡 MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            🔵 LOW
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            🟢 NORMAL
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#DCE8ED] p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-[#063B5C]">Alerts & Action Recommendations</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {activeAlerts.length} Active
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-[380px] pr-1">
        {activeAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#F1F7F9] rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">No Active Anomalies</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              All monitored water metrics (flow rate, pressure, reservoir level) are operating within normal baseline ranges.
            </p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50/70 transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {alert.alert_type}
                  </span>
                  {getSeverityBadge(alert.severity)}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              <div className="mt-2 text-xs">
                <span className="font-semibold text-slate-500 block text-[11px]">Possible Cause:</span>
                <p className="text-slate-800 font-medium">{alert.message}</p>
              </div>

              <div className="mt-2 p-2 rounded-lg bg-white border border-red-100 text-xs flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-[#063B5C] text-[11px] block">Recommended Response:</span>
                  <p className="text-slate-700 font-semibold">{alert.recommended_action}</p>
                </div>
                {onResolveAlert && (
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="shrink-0 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                    title="Acknowledge and mark resolved"
                  >
                    <Check className="w-3 h-3" />
                    <span>Resolve</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {resolvedAlerts.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Recently Resolved Alerts (SQLite Record)
            </span>
            <div className="space-y-2">
              {resolvedAlerts.slice(0, 3).map((r) => (
                <div key={r.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between opacity-75">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium text-slate-700">{r.alert_type}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                    <span>{r.timestamp}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      RESOLVED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

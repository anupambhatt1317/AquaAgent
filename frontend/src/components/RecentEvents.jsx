import React from 'react';
import { History, Clock, CheckCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export default function RecentEvents({ events }) {
  const eventList = events || [];

  const getEventIcon = (sev) => {
    switch (sev) {
      case 'HIGH':
      case 'CRITICAL':
        return <AlertOctagon className="w-4 h-4 text-red-600" />;
      case 'MEDIUM':
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#DCE8ED] p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#e0f7fa] text-[#00A8C6] flex items-center justify-center font-bold">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#063B5C]">Recent Monitoring Events</h3>
            <p className="text-[11px] text-slate-500">Live operational event log with system timestamps</p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          {eventList.length} Events Logged
        </span>
      </div>

      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {eventList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No events logged yet.</p>
        ) : (
          eventList.map((evt, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition border border-slate-100 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {getEventIcon(evt.severity)}
                </div>
                <div>
                  <span className="font-bold text-slate-800 font-mono text-[11px] block">
                    {evt.event}
                  </span>
                  <p className="text-slate-600 text-xs mt-0.5">{evt.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 shrink-0">
                <Clock className="w-3 h-3" />
                <span>{evt.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

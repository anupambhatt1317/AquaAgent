import React from 'react';
import { Building, Building2, Factory, Activity, Gauge, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function NetworkZonesPanel({ network, onCommandValve }) {
  const zones = network?.zones || {};
  const isLeak = network?.leak_active && !network?.leak_isolated;
  const isContained = network?.leak_active && network?.leak_isolated;

  const zoneList = [
    {
      id: 'Zone A',
      name: 'Zone A - Commercial Hub',
      desc: 'Civic, Commercial & Retail District',
      icon: Building,
      valveId: 'V2',
      data: zones['Zone A'] || { flow: 16.0, pressure: 3.7, status: 'NORMAL' }
    },
    {
      id: 'Zone B',
      name: 'Zone B - High-Density Residential',
      desc: '3,850 Residential Customer Units',
      icon: Building2,
      valveId: 'V3',
      data: zones['Zone B'] || { flow: 15.0, pressure: 3.8, status: isLeak ? 'CRITICAL' : isContained ? 'ISOLATED' : 'NORMAL' }
    },
    {
      id: 'Zone C',
      name: 'Zone C - Industrial Sector',
      desc: 'Manufacturing & Tech Parks',
      icon: Factory,
      valveId: 'V4',
      data: zones['Zone C'] || { flow: 17.0, pressure: 3.9, status: 'NORMAL' }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {zoneList.map((z) => {
        const Icon = z.icon;
        const isZoneBLeak = z.id === 'Zone B' && isLeak;
        const isZoneBContained = z.id === 'Zone B' && isContained;

        return (
          <div
            key={z.id}
            className={`rounded-2xl p-4 shadow-sm border transition-all ${
              isZoneBLeak
                ? 'bg-red-50/70 border-red-400 ring-2 ring-red-400/30 shadow-md'
                : isZoneBContained
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-white border-[#DCE8ED] hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isZoneBLeak ? 'bg-red-100 text-red-600' : 'bg-cyan-50 text-[#00A8C6]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#063B5C]">{z.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{z.desc}</span>
                </div>
              </div>

              {isZoneBLeak ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                  🔴 CRITICAL
                </span>
              ) : isZoneBContained ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  🟢 ISOLATED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🟢 NORMAL
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 my-2.5 pt-2 border-t border-slate-100 font-mono text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Branch Flow</span>
                <span className={`font-bold ${isZoneBLeak ? 'text-red-600 font-black text-sm' : 'text-[#063B5C]'}`}>
                  {z.data.flow} L/min
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Pressure</span>
                <span className={`font-bold ${isZoneBLeak ? 'text-red-600 font-black text-sm' : 'text-[#063B5C]'}`}>
                  {z.data.pressure} bar
                </span>
              </div>
            </div>

            {/* Valve Quick Action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span className="font-mono text-slate-500">
                Valve {z.valveId}: <strong>{network?.valves?.[z.valveId]?.status || 'OPEN'}</strong>
              </span>
              {isZoneBLeak ? (
                <button
                  onClick={() => onCommandValve('V3', 'CLOSED')}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[10px] shadow-xs animate-bounce"
                >
                  Close V3
                </button>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-600">Active Monitoring</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

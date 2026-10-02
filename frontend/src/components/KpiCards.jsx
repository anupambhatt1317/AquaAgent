import React from 'react';
import { Droplet, Gauge, Activity, Waves, CheckCircle2, AlertOctagon, Sliders } from 'lucide-react';

export default function KpiCards({ status, sensors, network }) {
  const current = sensors?.current || {};
  const flow = current.flow_rate ?? (status?.current_flow_rate ?? 48.0);
  const pressure = current.pressure ?? (status?.current_pressure ?? 3.8);
  const waterLevel = current.water_level ?? (status?.current_water_level ?? 75.0);
  const totalWater = status?.total_water_monitored ? Number(status.total_water_monitored).toLocaleString() : '125,480';
  const activeAlerts = status?.active_alerts_count ?? 0;
  const sysStatus = status?.status || 'NORMAL';
  const isLeak = network?.leak_active && !network?.leak_isolated;

  const valves = network?.valves || {};
  const openValvesCount = Object.values(valves).filter(v => v.status === 'OPEN').length || 4;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Total Water Monitored */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-[#DCE8ED] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Monitored</span>
          <Droplet className="w-3.5 h-3.5 text-[#00A8C6]" />
        </div>
        <div className="mt-1">
          <span className="text-xl font-bold font-mono text-[#063B5C]">{totalWater}</span>
          <span className="text-[10px] font-medium text-slate-400 ml-1">L</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">Continuous Intake</span>
      </div>

      {/* 2. Current Flow Rate */}
      <div className={`rounded-xl p-3 shadow-sm border transition-all flex flex-col justify-between ${
        isLeak
          ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400/20'
          : 'bg-white border-[#DCE8ED]'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Flow</span>
          <Activity className={`w-3.5 h-3.5 ${isLeak ? 'text-red-600 animate-pulse' : 'text-[#43A047]'}`} />
        </div>
        <div className="mt-1">
          <span className={`text-xl font-bold font-mono ${isLeak ? 'text-red-600 font-black' : 'text-[#063B5C]'}`}>
            {flow.toFixed(1)}
          </span>
          <span className="text-[10px] font-medium text-slate-400 ml-1">L/min</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">Norm: 40–60 L/m</span>
      </div>

      {/* 3. Pipeline Pressure */}
      <div className={`rounded-xl p-3 shadow-sm border transition-all flex flex-col justify-between ${
        isLeak
          ? 'bg-red-50/70 border-red-300'
          : 'bg-white border-[#DCE8ED]'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pressure</span>
          <Gauge className={`w-3.5 h-3.5 ${isLeak ? 'text-red-600' : 'text-[#00A8C6]'}`} />
        </div>
        <div className="mt-1">
          <span className={`text-xl font-bold font-mono ${isLeak ? 'text-red-600 font-black' : 'text-[#063B5C]'}`}>
            {pressure.toFixed(2)}
          </span>
          <span className="text-[10px] font-medium text-slate-400 ml-1">bar</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">Norm: 3.0–4.5 bar</span>
      </div>

      {/* 4. Reservoir Level */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-[#DCE8ED] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reservoir Level</span>
          <Waves className="w-3.5 h-3.5 text-[#00A8C6]" />
        </div>
        <div className="mt-1">
          <span className="text-xl font-bold font-mono text-[#063B5C]">{waterLevel.toFixed(1)}%</span>
        </div>
        <span className="text-[10px] text-emerald-600 font-medium mt-0.5">Capacity: 75%</span>
      </div>

      {/* 5. Active Alerts */}
      <div className={`rounded-xl p-3 shadow-sm border transition-all flex flex-col justify-between ${
        isLeak || activeAlerts > 0
          ? 'bg-red-500 text-white border-red-600'
          : 'bg-white border-[#DCE8ED]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isLeak ? 'text-white' : 'text-slate-500'}`}>
            Active Alerts
          </span>
          {isLeak ? (
            <AlertOctagon className="w-3.5 h-3.5 text-white animate-bounce" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          )}
        </div>
        <div className="mt-1">
          <span className={`text-xl font-bold font-mono ${isLeak ? 'text-white' : 'text-[#063B5C]'}`}>
            {isLeak ? '1 CRITICAL' : `${activeAlerts}`}
          </span>
        </div>
        <span className={`text-[10px] ${isLeak ? 'text-red-100 font-bold' : 'text-slate-400'} mt-0.5`}>
          {isLeak ? 'Zone B Rupture' : 'Zero Active Threats'}
        </span>
      </div>

      {/* 6. Smart Valves Status */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-[#DCE8ED] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Smart Valves</span>
          <Sliders className="w-3.5 h-3.5 text-[#00A8C6]" />
        </div>
        <div className="mt-1">
          <span className="text-xl font-bold font-mono text-[#063B5C]">
            {openValvesCount} / 4
          </span>
          <span className="text-[10px] font-semibold text-emerald-600 ml-1">ONLINE</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">V1, V2, V3, V4 Ready</span>
      </div>
    </div>
  );
}

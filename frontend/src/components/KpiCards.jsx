import React from 'react';
import { Droplet, Gauge, Activity, Waves, Clock, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function KpiCards({ status, sensors }) {
  const current = sensors?.current || {};
  const flow = current.flow_rate ?? (status?.current_flow_rate ?? 48.0);
  const pressure = current.pressure ?? (status?.current_pressure ?? 3.8);
  const waterLevel = current.water_level ?? (status?.current_water_level ?? 75.0);
  const totalWater = status?.total_water_monitored ? Number(status.total_water_monitored).toLocaleString() : '125,480';
  const usageToday = status?.water_usage ? Number(status.water_usage).toLocaleString() : '34,200';
  const timestamp = current.timestamp || status?.timestamp || '--:--:--';
  const sysStatus = status?.status || 'NORMAL';

  const isFlowNormal = flow >= 40.0 && flow <= 60.0;
  const isFlowHigh = flow > 60.0;
  
  const isPressureNormal = pressure >= 3.0 && pressure <= 4.5;
  const isPressureLow = pressure < 3.0;

  const isLevelNormal = waterLevel >= 60.0 && waterLevel <= 85.0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Water Monitored */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DCE8ED] hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Monitored</span>
          <div className="w-8 h-8 rounded-lg bg-[#e0f7fa] flex items-center justify-center text-[#00A8C6]">
            <Droplet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono text-[#063B5C]">{totalWater}</span>
          <span className="text-xs font-semibold text-slate-500">Liters</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
          <span>Today's Usage:</span>
          <span className="font-semibold text-slate-700 font-mono">{usageToday} L</span>
        </div>
      </div>

      {/* 2. Current Flow Rate */}
      <div className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
        isFlowNormal 
          ? 'border-[#DCE8ED]' 
          : isFlowHigh 
            ? 'border-red-300 bg-red-50/30' 
            : 'border-amber-300 bg-amber-50/30'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Flow Rate</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isFlowNormal ? 'bg-[#e8f5e9] text-[#43A047]' : isFlowHigh ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`text-2xl font-bold font-mono ${
            isFlowNormal ? 'text-[#063B5C]' : isFlowHigh ? 'text-red-600 font-black' : 'text-amber-600 font-black'
          }`}>
            {flow.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-slate-500">L/min</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2">
          <span className="text-slate-500">Normal Range:</span>
          <span className={`font-medium ${isFlowNormal ? 'text-emerald-600' : 'text-red-600 font-semibold'}`}>
            40 – 60 L/min
          </span>
        </div>
      </div>

      {/* 3. Current Pressure */}
      <div className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
        isPressureNormal 
          ? 'border-[#DCE8ED]' 
          : isPressureLow 
            ? 'border-red-300 bg-red-50/30' 
            : 'border-amber-300 bg-amber-50/30'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Pressure</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isPressureNormal ? 'bg-[#e0f7fa] text-[#00A8C6]' : isPressureLow ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`text-2xl font-bold font-mono ${
            isPressureNormal ? 'text-[#063B5C]' : isPressureLow ? 'text-red-600 font-black' : 'text-amber-600 font-black'
          }`}>
            {pressure.toFixed(2)}
          </span>
          <span className="text-xs font-semibold text-slate-500">bar</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2">
          <span className="text-slate-500">Normal Range:</span>
          <span className={`font-medium ${isPressureNormal ? 'text-emerald-600' : 'text-red-600 font-semibold'}`}>
            3.0 – 4.5 bar
          </span>
        </div>
      </div>

      {/* 4. Current Water Level */}
      <div className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
        isLevelNormal ? 'border-[#DCE8ED]' : 'border-amber-300 bg-amber-50/30'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Level</span>
          <div className="w-8 h-8 rounded-lg bg-[#e0f7fa] flex items-center justify-center text-[#00A8C6]">
            <Waves className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono text-[#063B5C]">{waterLevel.toFixed(1)}</span>
          <span className="text-xs font-semibold text-slate-500">%</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2">
          <span className="text-slate-500">Operating Range:</span>
          <span className="font-medium text-emerald-600">60 – 85%</span>
        </div>
      </div>

      {/* 5. System Status Indicator */}
      <div className={`rounded-xl p-4 shadow-sm border transition-all ${
        sysStatus === 'CRITICAL'
          ? 'bg-red-600 text-white border-red-700 shadow-red-200'
          : sysStatus === 'WARNING'
            ? 'bg-amber-500 text-white border-amber-600'
            : 'bg-gradient-to-br from-[#063B5C] to-[#04273e] text-white border-[#063B5C]'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-200">System Status</span>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            {sysStatus === 'CRITICAL' ? (
              <AlertOctagon className="w-4 h-4 text-white animate-bounce" />
            ) : sysStatus === 'WARNING' ? (
              <AlertTriangle className="w-4 h-4 text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            )}
          </div>
        </div>
        <div className="mt-2">
          <span className="text-lg font-bold font-sans tracking-wide">
            {sysStatus === 'CRITICAL' ? '🔴 CRITICAL ANOMALY' : sysStatus === 'WARNING' ? '🟡 WARNING' : '🟢 SYSTEM NORMAL'}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-200/90 border-t border-white/10 pt-2">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-cyan-300" />
            {timestamp}
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
            {status?.system_mode || 'SIMULATED'}
          </span>
        </div>
      </div>
    </div>
  );
}

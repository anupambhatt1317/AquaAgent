import React, { useState } from 'react';
import {
  Waves,
  Building,
  Building2,
  Factory,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  Activity,
  Droplets,
  Power,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

export default function NetworkVisualization({
  network,
  status,
  onCommandValve,
  onSimulateLeak,
  onResolveLeak
}) {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const valves = network?.valves || {
    V1: { id: 'V1', name: 'Main Feeder Valve', status: 'OPEN', mode: 'AUTO', flow: 48.0, pressure: 3.8 },
    V2: { id: 'V2', name: 'Zone A Valve', status: 'OPEN', mode: 'AUTO', flow: 16.0, pressure: 3.7 },
    V3: { id: 'V3', name: 'Zone B Valve', status: 'OPEN', mode: 'AUTO', flow: 15.0, pressure: 3.8 },
    V4: { id: 'V4', name: 'Zone C Valve', status: 'OPEN', mode: 'AUTO', flow: 17.0, pressure: 3.9 }
  };

  const zones = network?.zones || {
    'Zone A': { status: 'NORMAL', flow: 16.0, pressure: 3.7 },
    'Zone B': { status: 'NORMAL', flow: 15.0, pressure: 3.8 },
    'Zone C': { status: 'NORMAL', flow: 17.0, pressure: 3.9 }
  };

  const reservoir = network?.reservoir || {
    level: 75.0,
    capacity: 125480,
    name: 'Main City Reservoir'
  };

  const isLeak = network?.leak_active && !network?.leak_isolated;
  const isContained = network?.leak_active && network?.leak_isolated;

  const getValveStatusColor = (vStatus, isV3Leak = false) => {
    if (isV3Leak && isLeak) return 'ring-4 ring-red-500 bg-red-50 text-red-600 animate-pulse border-red-500';
    if (vStatus === 'CLOSED') return 'bg-slate-200 text-slate-700 border-slate-400';
    if (vStatus === 'OPEN') return 'bg-emerald-50 text-emerald-700 border-emerald-400 ring-2 ring-emerald-400/20';
    return 'bg-cyan-50 text-[#00A8C6] border-[#00A8C6] ring-2 ring-[#00A8C6]/20';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#DCE8ED] overflow-hidden">
      {/* Top Header of Digital Twin */}
      <div className="bg-[#063B5C] text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#04273e]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00A8C6] to-[#43A047] flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2 text-white">
              <span>Smart Water Distribution Network</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Interactive Digital Twin
              </span>
            </h2>
            <p className="text-[11px] text-slate-300">
              Real-time hydraulic routing, smart valve actuator control & autonomous leak containment
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-cyan-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A8C6] animate-pulse"></span>
            Nominal Flow
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Surge / Throttle
          </span>
          <span className="flex items-center gap-1.5 text-red-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            Active Leak
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="p-6 relative bg-radial from-slate-50 to-[#F1F7F9] min-h-[640px] flex flex-col items-center justify-between">
        
        {/* ================= LEVEL 1: WATER SOURCE / RESERVOIR ================= */}
        <div className="w-full max-w-md relative z-10 flex flex-col items-center">
          <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#00A8C6]/40 hover:border-[#00A8C6] transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#e0f7fa] flex items-center justify-center text-[#00A8C6]">
                  <Waves className="w-5 h-5 text-[#00A8C6] animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#063B5C] uppercase tracking-wider block">
                    Main City Reservoir (Source)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Capacity: {Number(reservoir.capacity).toLocaleString()} L
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-bold font-mono text-[#063B5C]">
                  {reservoir.level.toFixed(1)}%
                </span>
                <span className="block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {reservoir.level < 30 ? 'CRITICAL LOW' : reservoir.level > 90 ? 'HIGH LEVEL' : 'NORMAL (60-85%)'}
                </span>
              </div>
            </div>

            {/* Animated Water Tank Level Gauge */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  reservoir.level < 30
                    ? 'bg-red-500'
                    : reservoir.level < 60
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-[#00A8C6] to-[#43A047]'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, reservoir.level))}%` }}
              ></div>
            </div>

            {/* Sensor Tag */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
              <span className="flex items-center gap-1 text-[#00A8C6]">
                <Activity className="w-3.5 h-3.5" /> Sensor L1 (Ultrasonic): {reservoir.level.toFixed(1)}%
              </span>
              <span className="text-slate-400">Head: 14.2m WS</span>
            </div>
          </div>
        </div>

        {/* ================= CONNECTING PIPE 1: RESERVOIR -> V1 ================= */}
        <div className="flex flex-col items-center my-1 relative">
          <div className="w-4 h-12 bg-cyan-100 border-x-2 border-[#00A8C6] relative overflow-hidden flex items-center justify-center">
            {valves.V1.status !== 'CLOSED' && (
              <div className="w-2 h-full bg-[#00A8C6] opacity-70 animate-pulse"></div>
            )}
          </div>
          {/* Main Sensor Tag */}
          <div className="bg-white shadow-xs px-2.5 py-0.5 rounded-full border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center gap-2">
            <span className="text-[#00A8C6] font-bold">F1: {valves.V1.flow} L/m</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#063B5C] font-bold">P1: {valves.V1.pressure} bar</span>
          </div>
        </div>

        {/* ================= LEVEL 2: MAIN VALVE V1 ================= */}
        <div className="w-full max-w-xs relative z-10">
          <div className={`rounded-xl p-3 shadow-sm border transition-all ${getValveStatusColor(valves.V1.status)}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Valve Node
                </span>
                <span className="text-xs font-bold font-mono text-slate-800">
                  V1 • Main Inflow Feeder
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                valves.V1.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {valves.V1.status}
              </span>
            </div>

            {/* Quick Valve Actions */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <button
                onClick={() => onCommandValve('V1', 'OPEN')}
                className={`flex-1 py-1 rounded text-[11px] font-bold transition ${
                  valves.V1.status === 'OPEN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                OPEN
              </button>
              <button
                onClick={() => onCommandValve('V1', 'CLOSED')}
                className={`flex-1 py-1 rounded text-[11px] font-bold transition ${
                  valves.V1.status === 'CLOSED'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                CLOSE
              </button>
              <button
                onClick={() => onCommandValve('V1', 'AUTO')}
                className={`flex-1 py-1 rounded text-[11px] font-bold transition ${
                  valves.V1.mode === 'AUTO' && valves.V1.status === 'OPEN'
                    ? 'bg-[#00A8C6] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                AUTO
              </button>
            </div>
          </div>
        </div>

        {/* ================= CONNECTING PIPE 2: V1 -> MANIFOLD ================= */}
        <div className="w-4 h-8 bg-cyan-100 border-x-2 border-[#00A8C6] relative overflow-hidden my-1">
          {valves.V1.status !== 'CLOSED' && (
            <div className="w-2 h-full bg-[#00A8C6] opacity-70 animate-pulse"></div>
          )}
        </div>

        {/* Central Distribution Node / Manifold Ring */}
        <div className="bg-[#063B5C] text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-md border border-[#00A8C6] flex items-center gap-2">
          <Droplets className="w-4 h-4 text-[#00A8C6]" />
          <span>CENTRAL DISTRIBUTION MANIFOLD NODE</span>
        </div>

        {/* ================= SVG BRANCH PIPELINES TO 3 ZONES ================= */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 my-4 relative">
          
          {/* BRANCH 1: ZONE A */}
          <div className="flex flex-col items-center">
            {/* Pipe descent */}
            <div className="w-3.5 h-10 bg-cyan-100 border-x-2 border-[#00A8C6] relative overflow-hidden">
              {valves.V1.status !== 'CLOSED' && valves.V2.status !== 'CLOSED' && (
                <div className="w-2 h-full bg-[#00A8C6] opacity-75 animate-pulse"></div>
              )}
            </div>

            {/* Valve V2 Box */}
            <div className={`w-full bg-white rounded-xl p-3.5 shadow-sm border transition-all ${getValveStatusColor(valves.V2.status)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">ZONE A VALVE</span>
                  <span className="text-xs font-bold text-slate-800">V2 • Commercial Feed</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  valves.V2.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {valves.V2.status}
                </span>
              </div>

              {/* Sensor stats */}
              <div className="mt-2 text-[11px] font-mono flex justify-between text-slate-600 bg-slate-50 p-1.5 rounded">
                <span>F2: {valves.V2.flow} L/m</span>
                <span>P2: {valves.V2.pressure} bar</span>
              </div>

              {/* Valve action toggles */}
              <div className="mt-2.5 flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => onCommandValve('V2', 'OPEN')}
                  className={`flex-1 py-1 rounded font-bold ${valves.V2.status === 'OPEN' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  OPEN
                </button>
                <button
                  onClick={() => onCommandValve('V2', 'CLOSED')}
                  className={`flex-1 py-1 rounded font-bold ${valves.V2.status === 'CLOSED' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  CLOSE
                </button>
                <button
                  onClick={() => onCommandValve('V2', 'AUTO')}
                  className={`flex-1 py-1 rounded font-bold ${valves.V2.mode === 'AUTO' && valves.V2.status === 'OPEN' ? 'bg-[#00A8C6] text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  AUTO
                </button>
              </div>
            </div>

            {/* Pipe to endpoint */}
            <div className="w-3.5 h-10 bg-cyan-100 border-x-2 border-[#00A8C6] relative overflow-hidden">
              {valves.V2.status !== 'CLOSED' && (
                <div className="w-2 h-full bg-[#00A8C6] opacity-75 animate-pulse"></div>
              )}
            </div>

            {/* Zone A Endpoint Card */}
            <div className="w-full bg-white rounded-xl p-3.5 shadow-sm border border-slate-200 text-center hover:shadow-md transition">
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-50 flex items-center justify-center text-[#00A8C6] mb-1.5">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#063B5C]">Zone A - Commercial Hub</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Civic, Shopping & Retail District</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                NORMAL DEMAND
              </div>
            </div>
          </div>

          {/* BRANCH 2: ZONE B (TARGET OF LEAK SIMULATION) */}
          <div className="flex flex-col items-center">
            {/* Pipe descent with dynamic leak rendering */}
            <div className={`w-4 h-10 border-x-2 relative overflow-hidden transition-colors ${
              isLeak ? 'bg-red-200 border-red-600 animate-pulse' : 'bg-cyan-100 border-[#00A8C6]'
            }`}>
              {valves.V1.status !== 'CLOSED' && valves.V3.status !== 'CLOSED' && (
                <div className={`w-2 h-full opacity-80 ${isLeak ? 'bg-red-600 animate-ping' : 'bg-[#00A8C6] animate-pulse'}`}></div>
              )}
            </div>

            {/* Valve V3 Box */}
            <div className={`w-full bg-white rounded-xl p-3.5 shadow-md border transition-all ${getValveStatusColor(valves.V3.status, true)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">ZONE B VALVE</span>
                  <span className="text-xs font-bold text-slate-800">V3 • Residential Isolation</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isLeak
                    ? 'bg-red-600 text-white animate-pulse'
                    : valves.V3.status === 'OPEN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                }`}>
                  {isLeak ? 'BURST TARGET' : valves.V3.status}
                </span>
              </div>

              {/* Sensor stats */}
              <div className={`mt-2 text-[11px] font-mono flex justify-between p-1.5 rounded ${
                isLeak ? 'bg-red-100 text-red-900 font-bold' : 'bg-slate-50 text-slate-600'
              }`}>
                <span>F3: {valves.V3.flow} L/m</span>
                <span>P3: {valves.V3.pressure} bar</span>
              </div>

              {/* Valve action toggles */}
              <div className="mt-2.5 flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => onCommandValve('V3', 'OPEN')}
                  className={`flex-1 py-1 rounded font-bold ${valves.V3.status === 'OPEN' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  OPEN
                </button>
                <button
                  onClick={() => onCommandValve('V3', 'CLOSED')}
                  className={`flex-1 py-1 rounded font-bold transition shadow-xs ${
                    valves.V3.status === 'CLOSED'
                      ? 'bg-red-600 text-white'
                      : isLeak
                        ? 'bg-red-600 text-white ring-2 ring-red-400 animate-bounce'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isLeak ? '🚨 CLOSE V3' : 'CLOSE'}
                </button>
                <button
                  onClick={() => onCommandValve('V3', 'AUTO')}
                  className={`flex-1 py-1 rounded font-bold ${valves.V3.mode === 'AUTO' && valves.V3.status === 'OPEN' ? 'bg-[#00A8C6] text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  AUTO
                </button>
              </div>
            </div>

            {/* Pipe to endpoint with Leak Indicator Callout */}
            <div className={`w-4 h-12 border-x-2 relative flex items-center justify-center my-0.5 ${
              isLeak
                ? 'bg-red-300 border-red-600 animate-pulse'
                : isContained
                  ? 'bg-slate-200 border-slate-400'
                  : 'bg-cyan-100 border-[#00A8C6]'
            }`}>
              {isLeak && (
                <div className="absolute -right-28 bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1 z-30 animate-bounce">
                  <Flame className="w-3.5 h-3.5" />
                  <span>BURST DETECTED!</span>
                </div>
              )}
              {isContained && (
                <div className="absolute -right-24 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md z-30">
                  <span>ISOLATED</span>
                </div>
              )}
            </div>

            {/* Zone B Endpoint Card */}
            <div className={`w-full rounded-xl p-3.5 shadow-sm border text-center transition ${
              isLeak
                ? 'bg-red-50 border-red-300'
                : isContained
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-1.5 ${
                isLeak ? 'bg-red-100 text-red-600' : 'bg-cyan-50 text-[#00A8C6]'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#063B5C]">Zone B - Residential Towers</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">3,850 Residential Customer Units</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {isLeak ? (
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-300 animate-pulse">
                    🔴 PIPE BURST (CLOSE V3)
                  </span>
                ) : isContained ? (
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                    🟢 ISOLATED & CONTAINED
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    🟢 NORMAL DEMAND
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* BRANCH 3: ZONE C */}
          <div className="flex flex-col items-center">
            {/* Pipe descent */}
            <div className="w-3.5 h-10 bg-cyan-100 border-x-2 border-[#00A8C6] relative overflow-hidden">
              {valves.V1.status !== 'CLOSED' && valves.V4.status !== 'CLOSED' && (
                <div className="w-2 h-full bg-[#00A8C6] opacity-75 animate-pulse"></div>
              )}
            </div>

            {/* Valve V4 Box */}
            <div className={`w-full bg-white rounded-xl p-3.5 shadow-sm border transition-all ${getValveStatusColor(valves.V4.status)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">ZONE C VALVE</span>
                  <span className="text-xs font-bold text-slate-800">V4 • Industrial Feed</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  valves.V4.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {valves.V4.status}
                </span>
              </div>

              {/* Sensor stats */}
              <div className="mt-2 text-[11px] font-mono flex justify-between text-slate-600 bg-slate-50 p-1.5 rounded">
                <span>F4: {valves.V4.flow} L/m</span>
                <span>P4: {valves.V4.pressure} bar</span>
              </div>

              {/* Valve action toggles */}
              <div className="mt-2.5 flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => onCommandValve('V4', 'OPEN')}
                  className={`flex-1 py-1 rounded font-bold ${valves.V4.status === 'OPEN' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  OPEN
                </button>
                <button
                  onClick={() => onCommandValve('V4', 'CLOSED')}
                  className={`flex-1 py-1 rounded font-bold ${valves.V4.status === 'CLOSED' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  CLOSE
                </button>
                <button
                  onClick={() => onCommandValve('V4', 'AUTO')}
                  className={`flex-1 py-1 rounded font-bold ${valves.V4.mode === 'AUTO' && valves.V4.status === 'OPEN' ? 'bg-[#00A8C6] text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  AUTO
                </button>
              </div>
            </div>

            {/* Pipe to endpoint */}
            <div className="w-3.5 h-10 bg-cyan-100 border-x-2 border-[#00A8C6] relative overflow-hidden">
              {valves.V4.status !== 'CLOSED' && (
                <div className="w-2 h-full bg-[#00A8C6] opacity-75 animate-pulse"></div>
              )}
            </div>

            {/* Zone C Endpoint Card */}
            <div className="w-full bg-white rounded-xl p-3.5 shadow-sm border border-slate-200 text-center hover:shadow-md transition">
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-50 flex items-center justify-center text-[#00A8C6] mb-1.5">
                <Factory className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#063B5C]">Zone C - Industrial Sector</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Manufacturing & Tech Parks</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                NORMAL DEMAND
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

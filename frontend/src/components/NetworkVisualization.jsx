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
  Info,
  X,
  Radio,
  Sliders,
  Timer,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ArrowDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function NetworkVisualization({
  network,
  status,
  onCommandValve,
  onSimulateLeak,
  onResolveLeak,
  onRunFullDemo
}) {
  const [selectedSensor, setSelectedSensor] = useState(null);

  const valves = network?.valves || {
    V1: { id: 'V1', name: 'Main Feeder Inflow Valve', status: 'OPEN', mode: 'AUTO', flow: 48.0, pressure: 3.8 },
    V2: { id: 'V2', name: 'Zone A Distribution Valve', status: 'OPEN', mode: 'AUTO', flow: 16.0, pressure: 3.7 },
    V3: { id: 'V3', name: 'Zone B Isolation Valve', status: 'OPEN', mode: 'AUTO', flow: 15.0, pressure: 3.8 },
    V4: { id: 'V4', name: 'Zone C Industrial Valve', status: 'OPEN', mode: 'AUTO', flow: 17.0, pressure: 3.9 }
  };

  const zones = network?.zones || {
    'Zone A': { name: 'Zone A - Commercial Hub', status: 'NORMAL', flow: 16.0, pressure: 3.7, valve: 'V2' },
    'Zone B': { name: 'Zone B - Residential Sector', status: 'NORMAL', flow: 15.0, pressure: 3.8, valve: 'V3' },
    'Zone C': { name: 'Zone C - Industrial Complex', status: 'NORMAL', flow: 17.0, pressure: 3.9, valve: 'V4' }
  };

  const reservoir = network?.reservoir || {
    level: 75.0,
    capacity: 125480,
    name: 'Main City Reservoir'
  };

  const isLeak = network?.leak_active && !network?.leak_isolated;
  const isContained = network?.leak_active && network?.leak_isolated;
  const isV3Closed = valves.V3?.status === 'CLOSED';
  const isV1Closed = valves.V1?.status === 'CLOSED';

  // Sensor definitions with diagnostic metadata
  const sensorConfigs = {
    F1: {
      id: 'F1',
      name: 'Main Feeder Flow Sensor',
      type: 'Electromagnetic Flowmeter (DN80)',
      location: 'Main Reservoir Inflow Line (Prior to V1)',
      reading: `${(network?.flow_rate || 48.0).toFixed(1)} L/min`,
      normalRange: '40.0 – 60.0 L/min',
      unit: 'L/min',
      currentVal: network?.flow_rate || 48.0,
      status: isLeak ? 'CRITICAL SURGE' : isV1Closed ? 'OFFLINE' : 'NORMAL',
      protocol: 'Modbus RTU over RS-485 / 4-20mA loop',
      health: isV1Closed ? 'Standby' : '100% Calibrated'
    },
    P1: {
      id: 'P1',
      name: 'Main Manifold Pressure Transducer',
      type: 'Piezoresistive Pressure Sensor (0-10 bar)',
      location: 'Central Distribution Manifold',
      reading: `${(network?.pressure || 3.8).toFixed(2)} bar`,
      normalRange: '3.20 – 4.50 bar',
      unit: 'bar',
      currentVal: network?.pressure || 3.8,
      status: isLeak ? 'CRITICAL DROP' : isV1Closed ? 'DEPRESSURIZED' : 'NORMAL',
      protocol: 'Analog 4-20mA Current Loop',
      health: '99.8% Online'
    },
    L1: {
      id: 'L1',
      name: 'Reservoir Ultrasonic Level Sensor',
      type: 'Ultrasonic Time-of-Flight (0-5m)',
      location: 'Main Storage Reservoir Top Flange',
      reading: `${(reservoir?.level || 75.0).toFixed(1)}%`,
      normalRange: '60.0 – 85.0%',
      unit: '%',
      currentVal: reservoir?.level || 75.0,
      status: reservoir?.level < 30 ? 'CRITICAL LOW' : 'NORMAL',
      protocol: 'Modbus RS-485 (Address 0x01)',
      health: '100% Online'
    },
    F2: {
      id: 'F2',
      name: 'Zone A Branch Flow Sensor',
      type: 'Turbine Pulse Flowmeter',
      location: 'Zone A Sub-feeder line',
      reading: `${(zones['Zone A']?.flow || 16.0).toFixed(1)} L/min`,
      normalRange: '12.0 – 20.0 L/min',
      unit: 'L/min',
      currentVal: zones['Zone A']?.flow || 16.0,
      status: valves.V2?.status === 'CLOSED' ? 'ISOLATED' : 'NORMAL',
      protocol: 'Pulse Output / IoT Node A',
      health: '100% Calibrated'
    },
    P2: {
      id: 'P2',
      name: 'Zone A Terminal Pressure Sensor',
      type: 'Silicon Diaphragm Pressure Sensor',
      location: 'Zone A Commercial Hub Feeder',
      reading: `${(zones['Zone A']?.pressure || 3.7).toFixed(2)} bar`,
      normalRange: '3.00 – 4.20 bar',
      unit: 'bar',
      currentVal: zones['Zone A']?.pressure || 3.7,
      status: valves.V2?.status === 'CLOSED' ? 'ISOLATED' : 'NORMAL',
      protocol: '4-20mA Telemetry Loop',
      health: '100% Online'
    },
    F3: {
      id: 'F3',
      name: 'Zone B High-Density Flow Sensor',
      type: 'Ultrasonic Clamp-On Flowmeter',
      location: 'Zone B Residential Branch (Post-V3)',
      reading: `${(zones['Zone B']?.flow || (isLeak ? 62.0 : 15.0)).toFixed(1)} L/min`,
      normalRange: '10.0 – 20.0 L/min',
      unit: 'L/min',
      currentVal: zones['Zone B']?.flow || (isLeak ? 62.0 : 15.0),
      status: isV3Closed ? 'ISOLATED (0.0 L/min)' : isLeak ? 'CRITICAL BURST' : 'NORMAL',
      protocol: 'Modbus RTU / Smart IoT Node B',
      health: isLeak ? 'ANOMALOUS SPIKE' : '100% Online'
    },
    P3: {
      id: 'P3',
      name: 'Zone B Pipeline Pressure Transducer',
      type: 'Stainless Steel Piezoresistive Transducer',
      location: 'Zone B Residential Intake Header',
      reading: `${(zones['Zone B']?.pressure || (isLeak ? 2.0 : 3.8)).toFixed(2)} bar`,
      normalRange: '3.20 – 4.20 bar',
      unit: 'bar',
      currentVal: zones['Zone B']?.pressure || (isLeak ? 2.0 : 3.8),
      status: isV3Closed ? 'ISOLATED' : isLeak ? 'CRITICAL LEAK DROP' : 'NORMAL',
      protocol: '4-20mA Current Loop',
      health: isLeak ? 'HYDRAULIC COLLAPSE' : '100% Online'
    },
    F4: {
      id: 'F4',
      name: 'Zone C Industrial Flow Sensor',
      type: 'Electromagnetic Flow Sensor',
      location: 'Zone C Industrial Feeder Line',
      reading: `${(zones['Zone C']?.flow || 17.0).toFixed(1)} L/min`,
      normalRange: '12.0 – 22.0 L/min',
      unit: 'L/min',
      currentVal: zones['Zone C']?.flow || 17.0,
      status: valves.V4?.status === 'CLOSED' ? 'ISOLATED' : 'NORMAL',
      protocol: 'Modbus RTU over RS-485',
      health: '100% Calibrated'
    },
    P4: {
      id: 'P4',
      name: 'Zone C Header Pressure Sensor',
      type: 'Industrial Ceramic Pressure Transducer',
      location: 'Zone C Tech Park Header',
      reading: `${(zones['Zone C']?.pressure || 3.9).toFixed(2)} bar`,
      normalRange: '3.20 – 4.50 bar',
      unit: 'bar',
      currentVal: zones['Zone C']?.pressure || 3.9,
      status: valves.V4?.status === 'CLOSED' ? 'ISOLATED' : 'NORMAL',
      protocol: '4-20mA Current Loop',
      health: '100% Online'
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#DCE8ED] overflow-hidden">
      {/* Top Header of Digital Twin */}
      <div className="bg-[#063B5C] text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#04273e]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00A8C6] to-[#43A047] flex items-center justify-center shadow-xs">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-wide uppercase text-white">
                Smart Water Distribution Network Digital Twin
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping"></span>
                LIVE HYDRAULICS
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Interactive multi-zone simulation with real-time sensor feedback & autonomous valve actuators
            </p>
          </div>
        </div>

        {/* Dynamic Network Status Indicator */}
        <div className="flex items-center gap-2">
          {isLeak ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 animate-pulse font-mono text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>NETWORK STATUS: 🔴 CRITICAL (ZONE B LEAK)</span>
            </div>
          ) : isContained ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-cyan-300 font-mono text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>NETWORK STATUS: 🔵 CONTAINED (ZONE B ISOLATED)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>NETWORK STATUS: 🟢 NORMAL BASELINE</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="p-6 relative bg-gradient-to-b from-slate-50 via-[#F8FBFC] to-[#F1F7F9] flex flex-col items-center justify-between min-h-[720px] select-none">

        {/* ---------------- LEVEL 1: SOURCE RESERVOIR ---------------- */}
        <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
          <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#00A8C6]/40 hover:border-[#00A8C6] transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e0f7fa] flex items-center justify-center text-[#00A8C6]">
                  <Waves className="w-5 h-5 text-[#00A8C6] animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#063B5C] uppercase tracking-wider block">
                    Main City Reservoir (Primary Supply Source)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Storage Capacity: {Number(reservoir.capacity).toLocaleString()} Liters
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-[#063B5C]">
                  {reservoir.level.toFixed(1)}%
                </span>
                <span className="block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {reservoir.level < 30 ? 'CRITICAL LOW' : reservoir.level > 90 ? 'HIGH LEVEL' : 'NORMAL (60-85%)'}
                </span>
              </div>
            </div>

            {/* Animated Water Level Bar */}
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
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

            {/* Clickable Sensor L1 Tag */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
              <button
                onClick={() => setSelectedSensor(sensorConfigs.L1)}
                className="flex items-center gap-1.5 text-[#00A8C6] hover:bg-cyan-50 px-2 py-0.5 rounded transition font-bold"
                title="Click for Ultrasonic Sensor L1 Diagnostics"
              >
                <Activity className="w-3.5 h-3.5" /> Sensor L1 (Ultrasonic): {reservoir.level.toFixed(1)}%
                <span className="text-[9px] bg-[#00A8C6] text-white px-1 rounded font-normal">DIAGNOSTICS</span>
              </button>
              <span className="text-slate-400">Piezometric Head: ~14.2m WS</span>
            </div>
          </div>
        </div>

        {/* ---------------- LEVEL 2: MAIN FEEDER PIPELINE & VALVE V1 ---------------- */}
        <div className="flex flex-col items-center my-1 relative z-10 w-full max-w-md">
          {/* Animated Pipe from Reservoir to V1 */}
          <div className="w-6 h-14 relative flex items-center justify-center">
            <div className="w-4 h-full bg-slate-200 border-x-2 border-[#00A8C6] relative overflow-hidden rounded-xs">
              {!isV1Closed && (
                <div className="w-full h-full flex flex-col justify-around items-center">
                  <div className="w-2.5 h-3 rounded-full bg-[#00A8C6] opacity-80 animate-bounce"></div>
                  <div className="w-2.5 h-3 rounded-full bg-[#00A8C6] opacity-80 animate-bounce delay-150"></div>
                </div>
              )}
            </div>
            {/* Flow Direction Indicator */}
            <div className="absolute -right-28 flex items-center gap-1 text-[10px] font-mono text-[#00A8C6] font-bold bg-white/90 px-2 py-0.5 rounded-full border border-cyan-200 shadow-xs">
              <ArrowDown className="w-3 h-3 animate-bounce" />
              <span>MAIN FEEDER INFLOW</span>
            </div>
          </div>

          {/* Interactive Flow Sensor F1 Badge */}
          <button
            onClick={() => setSelectedSensor(sensorConfigs.F1)}
            className={`px-3 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-105 ${
              isLeak
                ? 'bg-red-50 text-red-700 border-red-400 animate-pulse'
                : 'bg-white text-slate-700 border-[#00A8C6]'
            }`}
            title="Click for Flow Sensor F1 telemetry"
          >
            <Gauge className="w-3.5 h-3.5 text-[#00A8C6]" />
            <span>FLOW SENSOR F1: {(network?.flow_rate || 48.0).toFixed(1)} L/min</span>
            <span className={`w-2 h-2 rounded-full ${isLeak ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
          </button>

          {/* Smart Valve V1 Container */}
          <div className="mt-2 w-full bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                isV1Closed ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                V1
              </div>
              <div>
                <span className="text-xs font-bold text-[#063B5C] block">Main Feeder Inlet Valve</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  State: <strong className={isV1Closed ? 'text-red-600' : 'text-emerald-600'}>{valves.V1?.status}</strong> • Mode: {valves.V1?.mode}
                </span>
              </div>
            </div>

            {/* Quick Valve Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onCommandValve('V1', 'OPEN')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                  valves.V1?.status === 'OPEN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                }`}
              >
                OPEN
              </button>
              <button
                onClick={() => onCommandValve('V1', 'CLOSED')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                  valves.V1?.status === 'CLOSED'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-red-50'
                }`}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- LEVEL 3: CENTRAL DISTRIBUTION MANIFOLD ---------------- */}
        <div className="w-full max-w-2xl relative my-2 z-10 flex flex-col items-center">
          {/* Manifold Junction Box */}
          <div className="bg-[#063B5C] text-white px-5 py-2.5 rounded-xl shadow-md border border-[#04273e] flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider">
                Central Distribution Manifold (3-Way Split)
              </span>
            </div>

            {/* Clickable Pressure Sensor P1 */}
            <button
              onClick={() => setSelectedSensor(sensorConfigs.P1)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition font-bold"
              title="Click for Pressure Sensor P1 telemetry"
            >
              <Gauge className="w-3.5 h-3.5 text-cyan-300" />
              <span>SENSOR P1: {(network?.pressure || 3.8).toFixed(2)} bar</span>
              <span className={`w-2 h-2 rounded-full ${isLeak ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`}></span>
            </button>
          </div>
        </div>

        {/* ---------------- LEVEL 4: 3-BRANCH DISTRIBUTION ZONES (A, B, C) ---------------- */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mt-2">

          {/* ================= ZONE A: COMMERCIAL HUB ================= */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-[#00A8C6] transition-all flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Branch Pipe Visualization */}
              <div className="h-6 w-full bg-slate-100 border-y-2 border-cyan-500 rounded-sm mb-3 relative overflow-hidden flex items-center">
                {valves.V2?.status !== 'CLOSED' && (
                  <div className="w-full h-2 bg-[#00A8C6]/40 flex items-center justify-around animate-pulse">
                    <span className="text-[9px] font-mono text-[#00A8C6] font-bold">→ → → Flow Nominal</span>
                  </div>
                )}
                {valves.V2?.status === 'CLOSED' && (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    ✕ ISOLATED / NO FLOW
                  </div>
                )}
              </div>

              {/* Zone Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#00A8C6] flex items-center justify-center font-bold">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#063B5C]">ZONE A</h4>
                    <span className="text-[10px] text-slate-500">Commercial & Civic</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {valves.V2?.status === 'CLOSED' ? 'ISOLATED' : 'NORMAL'}
                </span>
              </div>

              {/* Live Sensor Strip for Zone A */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <button
                  onClick={() => setSelectedSensor(sensorConfigs.F2)}
                  className="bg-slate-50 hover:bg-cyan-50 p-2 rounded-lg border border-slate-200 text-left transition"
                >
                  <span className="text-[10px] text-slate-500 font-mono block">Flow F2</span>
                  <span className="text-xs font-bold font-mono text-[#063B5C]">
                    {(zones['Zone A']?.flow || 16.0).toFixed(1)} L/min
                  </span>
                </button>
                <button
                  onClick={() => setSelectedSensor(sensorConfigs.P2)}
                  className="bg-slate-50 hover:bg-cyan-50 p-2 rounded-lg border border-slate-200 text-left transition"
                >
                  <span className="text-[10px] text-slate-500 font-mono block">Press P2</span>
                  <span className="text-xs font-bold font-mono text-[#063B5C]">
                    {(zones['Zone A']?.pressure || 3.7).toFixed(2)} bar
                  </span>
                </button>
              </div>
            </div>

            {/* Smart Valve V2 Control */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 font-mono">Valve V2</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onCommandValve('V2', 'OPEN')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    valves.V2?.status === 'OPEN' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  OPEN
                </button>
                <button
                  onClick={() => onCommandValve('V2', 'CLOSED')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    valves.V2?.status === 'CLOSED' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>

          {/* ================= ZONE B: HIGH-DENSITY RESIDENTIAL (LEAK ZONE) ================= */}
          <div className={`rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between relative overflow-hidden ${
            isLeak
              ? 'bg-red-50/90 border-2 border-red-500 ring-4 ring-red-500/20 shadow-lg animate-pulse'
              : isContained
                ? 'bg-slate-100 border-2 border-slate-400'
                : 'bg-white border border-slate-200 hover:border-[#00A8C6]'
          }`}>
            <div>
              {/* Branch Pipe with Animated Leak or Isolation */}
              <div className={`h-8 w-full rounded-sm mb-3 relative overflow-hidden flex items-center justify-center border-y-2 ${
                isLeak
                  ? 'bg-red-100 border-red-500'
                  : isV3Closed
                    ? 'bg-slate-300 border-slate-500'
                    : 'bg-slate-100 border-cyan-500'
              }`}>
                {isLeak && (
                  <div className="w-full h-full flex items-center justify-between px-2 bg-red-500/20">
                    <span className="text-[10px] font-mono font-bold text-red-700 flex items-center gap-1 animate-bounce">
                      <Flame className="w-3.5 h-3.5 text-red-600" />
                      💧 PIPE RUPTURE ACTIVE • WATER SPRAY ESCAPING
                    </span>
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                  </div>
                )}
                {isV3Closed && (
                  <div className="w-full h-full bg-slate-300 flex items-center justify-center text-[10px] font-mono font-bold text-slate-700 gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                    <span>🔒 VALVE V3 CLOSED • ZONE B ISOLATED (FLOW STOPPED)</span>
                  </div>
                )}
                {!isLeak && !isV3Closed && (
                  <div className="w-full h-2 bg-[#00A8C6]/40 flex items-center justify-around animate-pulse">
                    <span className="text-[9px] font-mono text-[#00A8C6] font-bold">→ → → Flow Nominal</span>
                  </div>
                )}
              </div>

              {/* Zone Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    isLeak ? 'bg-red-100 text-red-600' : isContained ? 'bg-slate-200 text-slate-700' : 'bg-cyan-50 text-[#00A8C6]'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#063B5C] flex items-center gap-1.5">
                      <span>ZONE B (TARGET DEMO)</span>
                      {isLeak && <span className="text-[10px] text-red-600 font-bold animate-ping">● LEAK</span>}
                    </h4>
                    <span className="text-[10px] text-slate-500">Residential Towers (3,850 Units)</span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isLeak
                    ? 'bg-red-600 text-white border-red-700 animate-bounce'
                    : isV3Closed
                      ? 'bg-slate-200 text-slate-800 border-slate-400'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isLeak ? 'CRITICAL LEAK' : isV3Closed ? 'ISOLATED' : 'NORMAL'}
                </span>
              </div>

              {/* Live Sensor Strip for Zone B */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <button
                  onClick={() => setSelectedSensor(sensorConfigs.F3)}
                  className={`p-2 rounded-lg border text-left transition ${
                    isLeak
                      ? 'bg-red-100 border-red-400'
                      : isV3Closed
                        ? 'bg-slate-200 border-slate-300'
                        : 'bg-slate-50 hover:bg-cyan-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 font-mono block">Flow F3</span>
                  <span className={`text-xs font-bold font-mono ${isLeak ? 'text-red-700' : 'text-[#063B5C]'}`}>
                    {(zones['Zone B']?.flow || (isLeak ? 62.0 : 15.0)).toFixed(1)} L/min
                  </span>
                </button>

                <button
                  onClick={() => setSelectedSensor(sensorConfigs.P3)}
                  className={`p-2 rounded-lg border text-left transition ${
                    isLeak
                      ? 'bg-red-100 border-red-400'
                      : isV3Closed
                        ? 'bg-slate-200 border-slate-300'
                        : 'bg-slate-50 hover:bg-cyan-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 font-mono block">Press P3</span>
                  <span className={`text-xs font-bold font-mono ${isLeak ? 'text-red-700' : 'text-[#063B5C]'}`}>
                    {(zones['Zone B']?.pressure || (isLeak ? 2.0 : 3.8)).toFixed(2)} bar
                  </span>
                </button>
              </div>

              {/* Leak Banner Alert if active */}
              {isLeak && (
                <div className="bg-red-600 text-white rounded-lg p-2 mb-2 text-[11px] font-mono flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> AQUAAGENT ADVICE:
                  </span>
                  <strong className="underline decoration-yellow-300">CLOSE VALVE V3</strong>
                </div>
              )}
            </div>

            {/* Smart Valve V3 Control (Key Actuator) */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 font-mono">
                Isolation Valve V3:
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onCommandValve('V3', 'OPEN')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                    valves.V3?.status === 'OPEN'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  OPEN
                </button>
                <button
                  onClick={() => onCommandValve('V3', 'CLOSED')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                    valves.V3?.status === 'CLOSED'
                      ? 'bg-red-600 text-white shadow-xs'
                      : isLeak
                        ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-300 font-extrabold'
                        : 'bg-slate-200 text-slate-700 hover:bg-red-50'
                  }`}
                >
                  {isLeak ? '🚨 CLOSE V3 (ISOLATE)' : 'CLOSE'}
                </button>
              </div>
            </div>
          </div>

          {/* ================= ZONE C: INDUSTRIAL SECTOR ================= */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-[#00A8C6] transition-all flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Branch Pipe Visualization */}
              <div className="h-6 w-full bg-slate-100 border-y-2 border-cyan-500 rounded-sm mb-3 relative overflow-hidden flex items-center">
                {valves.V4?.status !== 'CLOSED' && (
                  <div className="w-full h-2 bg-[#00A8C6]/40 flex items-center justify-around animate-pulse">
                    <span className="text-[9px] font-mono text-[#00A8C6] font-bold">→ → → Flow Nominal</span>
                  </div>
                )}
                {valves.V4?.status === 'CLOSED' && (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    ✕ ISOLATED / NO FLOW
                  </div>
                )}
              </div>

              {/* Zone Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#00A8C6] flex items-center justify-center font-bold">
                    <Factory className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#063B5C]">ZONE C</h4>
                    <span className="text-[10px] text-slate-500">Industrial & Tech Park</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {valves.V4?.status === 'CLOSED' ? 'ISOLATED' : 'NORMAL'}
                </span>
              </div>

              {/* Live Sensor Strip for Zone C */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <button
                  onClick={() => setSelectedSensor(sensorConfigs.F4)}
                  className="bg-slate-50 hover:bg-cyan-50 p-2 rounded-lg border border-slate-200 text-left transition"
                >
                  <span className="text-[10px] text-slate-500 font-mono block">Flow F4</span>
                  <span className="text-xs font-bold font-mono text-[#063B5C]">
                    {(zones['Zone C']?.flow || 17.0).toFixed(1)} L/min
                  </span>
                </button>
                <button
                  onClick={() => setSelectedSensor(sensorConfigs.P4)}
                  className="bg-slate-50 hover:bg-cyan-50 p-2 rounded-lg border border-slate-200 text-left transition"
                >
                  <span className="text-[10px] text-slate-500 font-mono block">Press P4</span>
                  <span className="text-xs font-bold font-mono text-[#063B5C]">
                    {(zones['Zone C']?.pressure || 3.9).toFixed(2)} bar
                  </span>
                </button>
              </div>
            </div>

            {/* Smart Valve V4 Control */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 font-mono">Valve V4</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onCommandValve('V4', 'OPEN')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    valves.V4?.status === 'OPEN' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  OPEN
                </button>
                <button
                  onClick={() => onCommandValve('V4', 'CLOSED')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    valves.V4?.status === 'CLOSED' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ---------------- LEVEL 5: SIMULATED WATER LOSS MONITOR ---------------- */}
        <div className="w-full mt-6 bg-white rounded-xl p-3.5 border border-[#DCE8ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#00A8C6] flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#063B5C] block">
                Simulated Water Loss & Conservation Monitor
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Real-time volumetric loss integration • Prototype Model
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Est. Leak Rate</span>
              <strong className={isLeak ? 'text-red-600 font-bold' : 'text-slate-700'}>
                {isLeak ? '47.0 L/min' : '0.0 L/min'}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Water Lost During Leak</span>
              <strong className={isLeak ? 'text-red-600 font-bold' : 'text-slate-700'}>
                {(network?.leak_loss_liters || 0.0).toFixed(1)} L
              </strong>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Water Saved by AI</span>
              <strong className="text-emerald-600 font-bold">
                +{((network?.water_saved_liters || 1450.0)).toFixed(0)} L
              </strong>
            </div>
          </div>
        </div>

        {/* ---------------- SENSOR NETWORK HEALTH MATRIX ---------------- */}
        <div className="w-full mt-3 bg-slate-100/70 rounded-xl p-2.5 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <span className="font-bold text-[#063B5C] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#00A8C6]" />
            SENSOR NETWORK:
          </span>
          {Object.values(sensorConfigs).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSensor(s)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-cyan-50 border border-slate-200 transition text-[10px]"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                s.status.includes('CRITICAL') ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
              }`}></span>
              <strong>{s.id}</strong> {s.reading}
            </button>
          ))}
        </div>

      </div>

      {/* ================= SENSOR DIAGNOSTIC DETAIL MODAL ================= */}
      {selectedSensor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#063B5C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{selectedSensor.name}</h3>
                  <span className="text-[10px] font-mono text-cyan-200">Tag ID: {selectedSensor.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-mono">Current Live Telemetry</span>
                  <strong className="text-base font-mono text-[#063B5C]">{selectedSensor.reading}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-mono">Calibrated Safe Range</span>
                  <strong className="text-xs font-mono text-slate-700">{selectedSensor.normalRange}</strong>
                </div>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Transducer Technology:</span>
                  <strong className="text-slate-800">{selectedSensor.type}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Pipeline Location:</span>
                  <strong className="text-slate-800">{selectedSensor.location}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Industrial Protocol:</span>
                  <strong className="text-slate-800">{selectedSensor.protocol}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Sensor Diagnostic Health:</span>
                  <strong className={selectedSensor.status.includes('CRITICAL') ? 'text-red-600' : 'text-emerald-600'}>
                    {selectedSensor.health} ({selectedSensor.status})
                  </strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedSensor(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#063B5C] text-white font-bold hover:bg-[#00A8C6] transition"
                >
                  Close Diagnostic View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

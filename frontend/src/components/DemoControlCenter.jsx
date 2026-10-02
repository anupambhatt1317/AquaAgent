import React, { useState } from 'react';
import { Sliders, Play, RefreshCw, AlertTriangle, Droplet, ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function DemoControlCenter({
  activeScenario,
  onGenerateNormal,
  onSimulateLeak,
  onSimulateAbnormalPressure,
  onSimulateDepletion,
  onReset,
  onSubmitManual,
  isExecuting
}) {
  const [manualFlow, setManualFlow] = useState(48.0);
  const [manualPressure, setManualPressure] = useState(3.8);
  const [manualLevel, setManualLevel] = useState(75.0);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onSubmitManual({
      flow_rate: parseFloat(manualFlow),
      pressure: parseFloat(manualPressure),
      water_level: parseFloat(manualLevel)
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#DCE8ED] p-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00A8C6]/10 text-[#00A8C6] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#063B5C]">
              Demonstration & Simulation Control Center
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Interactive Testbench
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate realistic water network scenarios or inject custom sensor telemetry to test AquaAgent's decision support logic.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomOpen(!isCustomOpen)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
            isCustomOpen
              ? 'bg-[#063B5C] text-white border-[#063B5C]'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isCustomOpen ? 'Hide Manual Sliders' : 'Custom Manual Input'}</span>
        </button>
      </div>

      {/* Preset Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
        {/* Button 1: Generate Normal Data */}
        <button
          onClick={onGenerateNormal}
          disabled={isExecuting}
          className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group ${
            activeScenario === 'NORMAL'
              ? 'bg-[#e8f5e9] border-[#43A047] ring-2 ring-[#43A047]/30'
              : 'bg-slate-50 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Generate Normal Data
            </span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Flow: ~48 L/min • Press: ~3.8 bar
          </span>
          <span className="mt-2 text-[10px] font-semibold text-emerald-700 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-emerald-200">
            🟢 Normal Baseline
          </span>
        </button>

        {/* Button 2: Simulate Leak */}
        <button
          onClick={onSimulateLeak}
          disabled={isExecuting}
          className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group ${
            activeScenario === 'LEAK'
              ? 'bg-red-50 border-red-500 ring-2 ring-red-500/30'
              : 'bg-slate-50 border-slate-200 hover:bg-red-50 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Simulate Leak
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Flow: 95 L/min • Press: 2.0 bar
          </span>
          <span className="mt-2 text-[10px] font-semibold text-red-700 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-red-200">
            🔴 High Severity
          </span>
        </button>

        {/* Button 3: Simulate Abnormal Pressure */}
        <button
          onClick={onSimulateAbnormalPressure}
          disabled={isExecuting}
          className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group ${
            activeScenario === 'ABNORMAL_PRESSURE'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30'
              : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Simulate High Pressure
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Flow: 20 L/min • Press: 5.6 bar
          </span>
          <span className="mt-2 text-[10px] font-semibold text-amber-700 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-amber-200">
            🟡 Pressure Surge
          </span>
        </button>

        {/* Button 4: Simulate Low Reservoir */}
        <button
          onClick={onSimulateDepletion}
          disabled={isExecuting}
          className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group ${
            activeScenario === 'DEPLETION'
              ? 'bg-cyan-50 border-[#00A8C6] ring-2 ring-[#00A8C6]/30'
              : 'bg-slate-50 border-slate-200 hover:bg-cyan-50 hover:border-cyan-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-cyan-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A8C6]"></span>
              Simulate Tank Low
            </span>
            <Droplet className="w-3.5 h-3.5 text-[#00A8C6] opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Level: 22% • Outflow: 45 L/m
          </span>
          <span className="mt-2 text-[10px] font-semibold text-cyan-700 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-cyan-200">
            🟡 Supply Depletion
          </span>
        </button>

        {/* Button 5: Reset Baseline */}
        <button
          onClick={onReset}
          disabled={isExecuting}
          className="flex flex-col items-start p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
              Reset System
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Wipe alerts & restore DB
          </span>
          <span className="mt-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-slate-200">
            🔄 Clear State
          </span>
        </button>
      </div>

      {/* Expandable Manual Custom Telemetry Injection Form */}
      {isCustomOpen && (
        <form onSubmit={handleManualSubmit} className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#063B5C] uppercase tracking-wider">
              Manual Custom Telemetry Input (Direct Sensor Simulation)
            </h3>
            <span className="text-[11px] text-slate-500">
              Input custom values to test threshold anomalies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Flow Rate:</span>
                <span className="font-mono text-[#063B5C] font-bold">{manualFlow} L/min</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="0.5"
                value={manualFlow}
                onChange={(e) => setManualFlow(e.target.value)}
                className="w-full accent-[#00A8C6] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 L/min</span>
                <span className="text-emerald-600 font-semibold">Normal: 40-60</span>
                <span>120 L/min</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Pressure:</span>
                <span className="font-mono text-[#063B5C] font-bold">{manualPressure} bar</span>
              </div>
              <input
                type="range"
                min="0"
                max="8.0"
                step="0.1"
                value={manualPressure}
                onChange={(e) => setManualPressure(e.target.value)}
                className="w-full accent-[#00A8C6] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 bar</span>
                <span className="text-emerald-600 font-semibold">Normal: 3.0-4.5</span>
                <span>8.0 bar</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Water Level:</span>
                <span className="font-mono text-[#063B5C] font-bold">{manualLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={manualLevel}
                onChange={(e) => setManualLevel(e.target.value)}
                className="w-full accent-[#00A8C6] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0%</span>
                <span className="text-emerald-600 font-semibold">Normal: 60-85%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isExecuting}
              className="px-4 py-2 bg-[#063B5C] hover:bg-[#04273e] text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-2"
            >
              <span>Inject Telemetry & Run AquaAgent Analysis</span>
              <ArrowRight className="w-4 h-4 text-[#00A8C6]" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

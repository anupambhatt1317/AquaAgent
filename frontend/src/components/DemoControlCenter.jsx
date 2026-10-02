import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  Droplet,
  ArrowRight,
  Zap,
  CheckCircle,
  Sparkles,
  Bot,
  UserCheck,
  Flame,
  ShieldCheck,
  Timer,
  FastForward,
  RotateCcw,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function DemoControlCenter({
  activeScenario,
  onGenerateNormal,
  onSimulateLeak,
  onSimulateLeakStep,
  onSimulateAbnormalPressure,
  onSimulateDepletion,
  onReset,
  onSubmitManual,
  onCommandValve,
  isExecuting,
  isStreaming,
  onToggleStream,
  valves
}) {
  const [manualFlow, setManualFlow] = useState(48.0);
  const [manualPressure, setManualPressure] = useState(3.8);
  const [manualLevel, setManualLevel] = useState(75.0);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Operating Mode: 'OPERATOR' vs 'AI_AUTO'
  const [operatingMode, setOperatingMode] = useState('OPERATOR');
  // Sim Speed: 1x, 2x, 5x
  const [simSpeed, setSimSpeed] = useState(1);

  // Automated Jury Demo Sequence State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoMessage, setDemoMessage] = useState('');
  const [demoProgress, setDemoProgress] = useState(0);
  const demoTimerRef = useRef(null);

  // Clean up demo timer on unmount
  useEffect(() => {
    return () => {
      if (demoTimerRef.current) clearInterval(demoTimerRef.current);
    };
  }, []);

  // AI Auto-Response Watcher: When in AI_AUTO mode and leak occurs, auto-close V3 after 4 seconds
  useEffect(() => {
    if (operatingMode === 'AI_AUTO' && activeScenario === 'LEAK' && valves?.V3?.status === 'OPEN' && !isDemoRunning) {
      const autoTimer = setTimeout(async () => {
        try {
          await onCommandValve('V3', 'CLOSED');
        } catch (e) {
          console.error('AI Auto-close error:', e);
        }
      }, 3500);
      return () => clearTimeout(autoTimer);
    }
  }, [operatingMode, activeScenario, valves, isDemoRunning, onCommandValve]);

  // Execute 25-second One-Click Jury Demo
  const handleStartJuryDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoStep(1);
    setDemoProgress(5);
    setDemoMessage('Step 1/6: Establishing normal baseline telemetry (Flow ~48 L/min, Pressure ~3.8 bar)...');

    // 1. Reset & Normal
    await onGenerateNormal();
    await onCommandValve('V3', 'OPEN');

    // Step 2: Anomaly Develops (3s)
    setTimeout(async () => {
      setDemoStep(2);
      setDemoProgress(25);
      setDemoMessage('Step 2/6: Anomaly developing in Zone B: micro-fissure expanding, flow climbing, pressure falling...');
      if (onSimulateLeakStep) {
        await onSimulateLeakStep(2);
      }
    }, 4000);

    // Step 3: Full Pipe Rupture & Critical Alert (8s)
    setTimeout(async () => {
      setDemoStep(3);
      setDemoProgress(50);
      setDemoMessage('Step 3/6: CRITICAL BURST INJECTED! Flow surges to 95 L/min, Pressure collapses to 2.0 bar. AquaAgent generates critical alert.');
      await onSimulateLeak();
    }, 8000);

    // Step 4: AI Reasoning & Actuator Advisory (13s)
    setTimeout(async () => {
      setDemoStep(4);
      setDemoProgress(70);
      setDemoMessage('Step 4/6: AquaAgent 6-Stage AI Reasoning active. Identifying root cause: Zone B pipeline. Recommending [CLOSE V3]...');
    }, 13000);

    // Step 5: Actuator Response (V3 Closed & Zone B Isolated) (17s)
    setTimeout(async () => {
      setDemoStep(5);
      setDemoProgress(88);
      setDemoMessage('Step 5/6: ACTUATOR RESPONSE: Valve V3 CLOSED! Zone B isolated. Water loss halted, pressure restores across Zones A & C.');
      await onCommandValve('V3', 'CLOSED');
    }, 17000);

    // Step 6: Demo Complete & Threat Contained (22s)
    setTimeout(() => {
      setDemoStep(6);
      setDemoProgress(100);
      setDemoMessage('Step 6/6: DEMO COMPLETE: Threat successfully contained! 350+ Liters saved. Ready for jury review.');
      setTimeout(() => {
        setIsDemoRunning(false);
      }, 5000);
    }, 22000);
  };

  const handleCancelJuryDemo = async () => {
    if (demoTimerRef.current) clearInterval(demoTimerRef.current);
    setIsDemoRunning(false);
    setDemoStep(0);
    setDemoProgress(0);
    setDemoMessage('');
    await onReset();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onSubmitManual({
      flow_rate: parseFloat(manualFlow),
      pressure: parseFloat(manualPressure),
      water_level: parseFloat(manualLevel)
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#DCE8ED] p-5 space-y-4">
      {/* Header & Modes Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00A8C6]/10 text-[#00A8C6] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#063B5C]">
              Simulation Testbench & Jury Demo Center
            </h2>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Interactive Hardware Simulator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trigger simulated physical network anomalies, test AquaAgent's closed-loop reasoning, or launch the automated jury demo.
          </p>
        </div>

        {/* Operating Mode Selector (Operator vs AI Auto-Response) */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setOperatingMode('OPERATOR')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition ${
                operatingMode === 'OPERATOR'
                  ? 'bg-white text-[#063B5C] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Operator Mode</span>
            </button>
            <button
              onClick={() => setOperatingMode('AI_AUTO')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition ${
                operatingMode === 'AI_AUTO'
                  ? 'bg-[#063B5C] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI Auto-Response</span>
            </button>
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
            <span>{isCustomOpen ? 'Hide Sliders' : 'Manual Sliders'}</span>
          </button>
        </div>
      </div>

      {/* ================= ONE-CLICK JURY DEMO HERO BUTTON ================= */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDemoRunning
          ? 'bg-gradient-to-r from-[#063B5C] to-[#00A8C6] text-white border-cyan-400 shadow-md'
          : 'bg-gradient-to-r from-cyan-50 via-slate-50 to-emerald-50 border-cyan-300 hover:border-cyan-400'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
              isDemoRunning ? 'bg-white/20 animate-spin' : 'bg-gradient-to-tr from-[#00A8C6] to-[#43A047]'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDemoRunning ? 'text-white' : 'text-[#063B5C]'}`}>
                {isDemoRunning ? '⚡ AUTOMATED JURY DEMONSTRATION IN PROGRESS' : 'ONE-CLICK JURY DEMONSTRATION'}
              </h3>
              <p className={`text-xs ${isDemoRunning ? 'text-cyan-100' : 'text-slate-600'}`}>
                {isDemoRunning
                  ? demoMessage
                  : 'Executes complete closed-loop cycle: Normal ➔ Leak Develops ➔ AI Detects ➔ V3 Closed ➔ Zone B Isolated ➔ Water Loss Stopped.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isDemoRunning ? (
              <button
                onClick={handleStartJuryDemo}
                disabled={isExecuting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00A8C6] to-[#43A047] text-white font-bold text-xs shadow-md hover:opacity-95 transition flex items-center gap-2 shrink-0 animate-pulse"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>RUN FULL LEAK DEMO</span>
              </button>
            ) : (
              <button
                onClick={handleCancelJuryDemo}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Demo Progress Bar */}
        {isDemoRunning && (
          <div className="mt-3.5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-cyan-100">
              <span>Timeline Progress (Stage {demoStep} of 6)</span>
              <span>{demoProgress}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${demoProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Preset Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Button 1: Normal Baseline */}
        <button
          onClick={onGenerateNormal}
          disabled={isExecuting || isDemoRunning}
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
          <span className="text-[11px] text-slate-500 mt-1 font-mono">
            Flow: ~48 L/m • Press: ~3.8 bar
          </span>
          <span className="mt-2 text-[10px] font-semibold text-emerald-700 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-emerald-200">
            🟢 Normal Baseline
          </span>
        </button>

        {/* Button 2: Simulate Leak */}
        <button
          onClick={onSimulateLeak}
          disabled={isExecuting || isDemoRunning}
          className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group ${
            activeScenario === 'LEAK'
              ? 'bg-red-50 border-red-500 ring-2 ring-red-500/30'
              : 'bg-slate-50 border-slate-200 hover:bg-red-50 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Simulate Zone B Leak
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 font-mono">
            Flow: 95 L/m • Press: 2.0 bar
          </span>
          <span className="mt-2 text-[10px] font-semibold text-red-700 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-red-200">
            🔴 Pipe Rupture
          </span>
        </button>

        {/* Button 3: Simulate Abnormal Pressure */}
        <button
          onClick={onSimulateAbnormalPressure}
          disabled={isExecuting || isDemoRunning}
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
          <span className="text-[11px] text-slate-500 mt-1 font-mono">
            Flow: 20 L/m • Press: 5.6 bar
          </span>
          <span className="mt-2 text-[10px] font-semibold text-amber-700 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-amber-200">
            🟡 Pressure Surge
          </span>
        </button>

        {/* Button 4: Simulate Depletion */}
        <button
          onClick={onSimulateDepletion}
          disabled={isExecuting || isDemoRunning}
          className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group ${
            activeScenario === 'DEPLETION'
              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/30'
              : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Low Reservoir Level
            </span>
            <Droplet className="w-3.5 h-3.5 text-blue-600 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 font-mono">
            Reservoir Level: 22.0%
          </span>
          <span className="mt-2 text-[10px] font-semibold text-blue-700 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-blue-200">
            🔵 Storage Depletion
          </span>
        </button>

        {/* Button 5: Reset System */}
        <button
          onClick={onReset}
          disabled={isExecuting || isDemoRunning}
          className="flex flex-col items-start p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3 text-slate-500" />
              Reset All Telemetry
            </span>
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Clear alerts & reset valves
          </span>
          <span className="mt-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-slate-200">
            Baseline Reset
          </span>
        </button>
      </div>

      {/* Manual Input Sliders Drawer */}
      {isCustomOpen && (
        <form
          onSubmit={handleManualSubmit}
          className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#063B5C]">
              Custom Sensor Telemetry Sliders
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Live Modbus RTU / 4-20mA Signal Generator
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Flow Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-600 mb-1">
                <span>Flow Rate (F1)</span>
                <strong>{manualFlow} L/min</strong>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="0.5"
                value={manualFlow}
                onChange={(e) => setManualFlow(e.target.value)}
                className="w-full accent-[#00A8C6]"
              />
            </div>

            {/* Pressure Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-600 mb-1">
                <span>System Pressure (P1)</span>
                <strong>{manualPressure} bar</strong>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.1"
                value={manualPressure}
                onChange={(e) => setManualPressure(e.target.value)}
                className="w-full accent-[#00A8C6]"
              />
            </div>

            {/* Level Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-600 mb-1">
                <span>Reservoir Level (L1)</span>
                <strong>{manualLevel}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={manualLevel}
                onChange={(e) => setManualLevel(e.target.value)}
                className="w-full accent-[#00A8C6]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="submit"
              disabled={isExecuting}
              className="px-4 py-1.5 rounded-lg bg-[#063B5C] hover:bg-[#00A8C6] text-white font-bold text-xs transition"
            >
              Inject Telemetry to SQLite & AquaAgent
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

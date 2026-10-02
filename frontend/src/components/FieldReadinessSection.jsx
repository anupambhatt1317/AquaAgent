import React from 'react';
import {
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldCheck,
  Radio,
  Server,
  Activity,
  Sliders
} from 'lucide-react';

export default function FieldReadinessSection() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#DCE8ED] p-6 space-y-6">
      
      {/* Top Section 16: Prototype Data Transparency Banner */}
      <div className="p-4 rounded-xl bg-[#063B5C] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00A8C6] flex items-center justify-center font-bold shrink-0">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                Data Transparency Notice
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00A8C6]/20 text-[#00A8C6] border border-[#00A8C6]/40 font-mono">
                PROTOTYPE MODE • SIMULATED IoT TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Current readings (Flow: ~48 L/min, Pressure: ~3.8 bar, Level: 75%) are simulated for prototype demonstration.
            </p>
          </div>
        </div>

        <div className="bg-white/10 px-3 py-1.5 rounded-lg text-[11px] text-cyan-200 font-mono flex items-center gap-1.5 shrink-0">
          <Info className="w-3.5 h-3.5 text-[#00A8C6]" />
          <span>Physical sensors & ESP32 planned for Phase 2</span>
        </div>
      </div>

      {/* Section 17: Visual Architecture Transition: Current vs Future */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-[#00A8C6]" />
          <h3 className="text-xs font-bold text-[#063B5C] uppercase tracking-wider">
            Architecture Evolution: Prototype → Field Deployment
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* CURRENT PROTOTYPE */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200/60">
              <span className="font-bold text-emerald-900 uppercase">Current Working Prototype</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                100% OPERATIONAL
              </span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-white border border-emerald-100 flex items-center justify-between">
                <span>1. Simulated Hydraulic Stream</span>
                <span className="text-emerald-700 font-bold">48 L/m • 3.8 bar</span>
              </div>
              <div className="text-center text-emerald-600 font-black">↓</div>
              <div className="p-2 rounded bg-white border border-emerald-100 flex items-center justify-between">
                <span>2. FastAPI REST Ingest</span>
                <span className="text-[#063B5C] font-bold">Python ASGI</span>
              </div>
              <div className="text-center text-emerald-600 font-black">↓</div>
              <div className="p-2 rounded bg-white border border-emerald-100 flex items-center justify-between">
                <span>3. AquaAgent AI Decision Kernel</span>
                <span className="text-[#00A8C6] font-bold">Rule Anomaly Engine</span>
              </div>
              <div className="text-center text-emerald-600 font-black">↓</div>
              <div className="p-2 rounded bg-white border border-emerald-100 flex items-center justify-between">
                <span>4. React Digital Twin + SQLite</span>
                <span className="text-emerald-700 font-bold">Live UI & Audit DB</span>
              </div>
            </div>
          </div>

          {/* FUTURE FIELD DEPLOYMENT */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-700 uppercase">Future Field Deployment</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                PHASE 2 HARDWARE
              </span>
            </div>

            <div className="space-y-2 font-mono text-[11px] text-slate-600">
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                <span>1. Physical Sensors (Flow, Press, Level)</span>
                <span className="text-slate-400">YF-S201 / Piezo</span>
              </div>
              <div className="text-center text-slate-400 font-black">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                <span>2. ESP32 Microcontroller Gateway</span>
                <span className="text-slate-400">MQTT / LoRaWAN</span>
              </div>
              <div className="text-center text-slate-400 font-black">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                <span>3. AquaAgent Cloud Decision Engine</span>
                <span className="text-slate-400">FastAPI Scale</span>
              </div>
              <div className="text-center text-slate-400 font-black">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                <span>4. Motorized Smart Valves</span>
                <span className="text-slate-400">12V Latching Actuation</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Section 18: Field Integration Readiness Checklist */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#063B5C] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#43A047]" />
            <span>Field Integration Ready Architecture</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Hardware-Agnostic REST Interface
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Flow Sensors</span>
            </div>
            <p className="text-[11px] text-slate-500">API schemas ready for Hall-effect / ultrasonic telemetry</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pressure Sensors</span>
            </div>
            <p className="text-[11px] text-slate-500">Piezoresistive transducer range 0–10 bar calibrated</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Smart Valves</span>
            </div>
            <p className="text-[11px] text-slate-500">V1–V4 control endpoints formatted for relay relays</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Decision Loop</span>
            </div>
            <p className="text-[11px] text-slate-500">Closed loop verified: Anomaly ➔ Suggestion ➔ Isolation</p>
          </div>
        </div>
      </div>

    </div>
  );
}

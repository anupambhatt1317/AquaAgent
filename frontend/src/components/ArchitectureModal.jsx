import React from 'react';
import { X, CheckCircle2, Clock, Cpu, Server, Database, Activity, ShieldCheck } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#DCE8ED] max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#063B5C] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00A8C6] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AquaAgent 2.0 • Architecture & Implementation Alignment</h2>
              <p className="text-xs text-cyan-200">Aligned strictly with the Final PPT Project Specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Current Prototype (Fully Implemented & Operational)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                <span className="font-bold text-[#063B5C] block">Frontend Layer:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">React + Vite with Real-Time KPI telemetry, interactive Recharts, alerts management, and testbench.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                <span className="font-bold text-[#063B5C] block">Backend Layer:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Python + FastAPI REST endpoints for data ingestion, anomaly analysis, system telemetry, and alerts.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                <span className="font-bold text-[#063B5C] block">AquaAgent AI/Decision Layer:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Multi-sensor cross-correlation rule engine for leak & pressure anomalies with prioritized actionable recommendations.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                <span className="font-bold text-[#063B5C] block">Database Persistence:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">SQLite database storing <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">water_readings</code> and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">alerts</code>.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Future Hardware & Scaling Roadmap (Post-Prototype)
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              In accordance with project guidelines, the following physical IoT hardware elements are roadmap items and not claimed as physically connected in this software decision-support prototype:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>ESP32 IoT Node Microcontrollers</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Physical Flow & Ultrasonic Level Sensors</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Motorized Smart Isolation Valves</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>GIS Leak Mapping & City-Scale Deployment</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#e0f7fa] rounded-xl border border-[#00A8C6]/30 text-slate-800 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00A8C6] shrink-0" />
            <span>
              <strong>Closed-Loop Flow:</strong> MONITOR → DETECT → ANALYZE → PRIORITIZE → ACT → REPORT is fully verified and connected end-to-end.
            </span>
          </div>

        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#063B5C] hover:bg-[#04273e] text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

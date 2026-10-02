import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend
} from 'recharts';
import { Activity, Gauge, Droplet } from 'lucide-react';

export default function SensorCharts({ sensors, history }) {
  const chartData = (history && history.length > 0) ? history : (sensors?.history || []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#063B5C] text-white p-2.5 rounded-lg shadow-lg border border-[#00A8C6]/40 text-xs font-mono">
          <p className="font-bold text-cyan-200 border-b border-white/20 pb-1 mb-1">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex justify-between gap-3">
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Water-Flow History Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-[#DCE8ED] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e8f5e9] text-[#43A047] flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#063B5C]">Water Flow Rate History</h3>
              <p className="text-[11px] text-slate-500">Real-time L/min flow trend (Normal Range: 40–60 L/min)</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            L/min
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A8C6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00A8C6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F7F9" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 120]} stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max (60 L/m)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
              <ReferenceLine y={40} stroke="#43A047" strokeDasharray="3 3" label={{ value: 'Min (40 L/m)', fill: '#43A047', fontSize: 10, position: 'insideBottomRight' }} />
              <Area
                type="monotone"
                dataKey="flow_rate"
                name="Flow Rate (L/min)"
                stroke="#00A8C6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#flowGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Pressure History Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-[#DCE8ED] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e0f7fa] text-[#00A8C6] flex items-center justify-center font-bold">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#063B5C]">Pipeline Pressure History</h3>
              <p className="text-[11px] text-slate-500">Real-time bar pressure trend (Normal Range: 3.0–4.5 bar)</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            bar
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#063B5C" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#063B5C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F7F9" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 8]} stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={4.5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max (4.5 bar)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
              <ReferenceLine y={3.0} stroke="#43A047" strokeDasharray="3 3" label={{ value: 'Min (3.0 bar)', fill: '#43A047', fontSize: 10, position: 'insideBottomRight' }} />
              <Area
                type="monotone"
                dataKey="pressure"
                name="Pressure (bar)"
                stroke="#063B5C"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#pressureGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Water Level & Reservoir History Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-[#DCE8ED] p-5 lg:col-span-2">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e0f7fa] text-[#00A8C6] flex items-center justify-center font-bold">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#063B5C]">Storage Water Level & Consumption Stability</h3>
              <p className="text-[11px] text-slate-500">Reservoir storage percentage capacity and steady state</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            % Capacity
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43A047" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#43A047" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F7F9" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={85} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Nominal High (85%)', fill: '#3b82f6', fontSize: 10, position: 'insideTopRight' }} />
              <ReferenceLine y={60} stroke="#43A047" strokeDasharray="3 3" label={{ value: 'Nominal Low (60%)', fill: '#43A047', fontSize: 10, position: 'insideBottomRight' }} />
              <Area
                type="monotone"
                dataKey="water_level"
                name="Water Level (%)"
                stroke="#43A047"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#levelGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import DemoControlCenter from './components/DemoControlCenter';
import DecisionSupportPipeline from './components/DecisionSupportPipeline';
import AlertsPanel from './components/AlertsPanel';
import RecentEvents from './components/RecentEvents';
import SensorCharts from './components/SensorCharts';
import ArchitectureModal from './components/ArchitectureModal';
import { api } from './services/api';
import { CheckCircle, AlertOctagon, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState(null);
  const [sensors, setSensors] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [activeScenario, setActiveScenario] = useState('NORMAL');
  const [isStreaming, setIsStreaming] = useState(true);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  const refreshData = useCallback(async () => {
    try {
      const [sysStatus, waterData, alertsData, eventsData, statsData] = await Promise.all([
        api.getSystemStatus(),
        api.getWaterData(30),
        api.getAlerts(50),
        api.getEvents(),
        api.getStatistics()
      ]);

      setStatus(sysStatus);
      setSensors(waterData);
      setAlerts(alertsData.alerts || []);
      setEvents(eventsData.events || []);
      setStatistics(statsData);
      setIsStreaming(sysStatus.is_streaming);
      if (sysStatus.system_mode) {
        setActiveScenario(sysStatus.system_mode);
      }
    } catch (err) {
      console.warn('Telemetry polling error:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 1500);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleGenerateNormal = async () => {
    setIsExecuting(true);
    try {
      await api.setNormalScenario();
      setActiveScenario('NORMAL');
      setDemoStep(1);
      await refreshData();
    } catch (err) {
      console.error('Normal scenario error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSimulateLeak = async () => {
    setIsExecuting(true);
    try {
      await api.simulateLeak();
      setActiveScenario('LEAK');
      setDemoStep(4);
      await refreshData();
    } catch (err) {
      console.error('Leak scenario error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSimulateAbnormalPressure = async () => {
    setIsExecuting(true);
    try {
      await api.simulateAbnormalPressure();
      setActiveScenario('ABNORMAL_PRESSURE');
      await refreshData();
    } catch (err) {
      console.error('Pressure scenario error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSimulateDepletion = async () => {
    setIsExecuting(true);
    try {
      await api.simulateDepletion();
      setActiveScenario('DEPLETION');
      await refreshData();
    } catch (err) {
      console.error('Depletion scenario error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleManualSubmit = async (data) => {
    setIsExecuting(true);
    try {
      await api.submitManualReading(data);
      setActiveScenario('MANUAL');
      await refreshData();
    } catch (err) {
      console.error('Manual submit error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = async () => {
    setIsExecuting(true);
    try {
      await api.resetSimulation();
      setActiveScenario('NORMAL');
      setDemoStep(1);
      await refreshData();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleToggleStream = async () => {
    try {
      const nextState = !isStreaming;
      await api.toggleStream(nextState);
      setIsStreaming(nextState);
      await refreshData();
    } catch (err) {
      console.error('Toggle stream error:', err);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await api.resolveAlert(alertId);
      await refreshData();
    } catch (err) {
      console.error('Resolve alert error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F7F9] text-slate-800">
      <Header
        status={status}
        isStreaming={isStreaming}
        onToggleStream={handleToggleStream}
        onReset={handleReset}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <KpiCards status={status} sensors={sensors} />

        <DemoControlCenter
          activeScenario={activeScenario}
          onGenerateNormal={handleGenerateNormal}
          onSimulateLeak={handleSimulateLeak}
          onSimulateAbnormalPressure={handleSimulateAbnormalPressure}
          onSimulateDepletion={handleSimulateDepletion}
          onReset={handleReset}
          onSubmitManual={handleManualSubmit}
          isExecuting={isExecuting}
        />

        <DecisionSupportPipeline
          status={status}
          activeAlert={alerts.find(a => a.status === 'ACTIVE')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <AlertsPanel
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
            />
          </div>
          <div className="lg:col-span-5">
            <RecentEvents
              events={events}
            />
          </div>
        </div>

        <SensorCharts
          sensors={sensors}
          history={sensors?.history}
        />

        <div className="bg-white rounded-xl shadow-sm border border-[#DCE8ED] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#e0f7fa] text-[#00A8C6] flex items-center justify-center font-bold">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#063B5C]">
                Final PPT Demonstration Scenario Walkthrough
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              End-to-End Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#063B5C] block mb-1">
                1. Baseline Normal State
              </span>
              <p className="text-slate-600">
                Click <strong>[Generate Normal Data]</strong>. Flow stabilizes at ~48 L/min, Pressure at ~3.8 bar. System status shows 🟢 SYSTEM NORMAL.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-red-50/50 border border-red-200">
              <span className="font-bold text-red-900 block mb-1">
                2. Leak Anomaly Injection
              </span>
              <p className="text-slate-700">
                Click <strong>[Simulate Leak]</strong> (Flow: 95 L/min, Pressure: 2.0 bar). AquaAgent detects cross-sensor surge & pressure collapse, raising 🔴 CRITICAL ANOMALY with recommended response: <em>"Inspect pipeline section for possible leakage."</em>
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#063B5C] block mb-1">
                3. Closed-Loop Recovery
              </span>
              <p className="text-slate-600">
                Alert is recorded in SQLite database. Clicking <strong>[Resolve]</strong> or <strong>[Generate Normal Data]</strong> restores status back to 🟢 SYSTEM NORMAL.
              </p>
            </div>
          </div>
        </div>

      </main>

      <ArchitectureModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      <footer className="border-t border-[#DCE8ED] bg-white py-4 px-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AquaAgent 2.0 • AI-Powered Smart Water Distribution & Conservation System</span>
          <span className="text-[#00A8C6] font-semibold">FastAPI + React + SQLite Prototype Architecture</span>
        </div>
      </footer>

    </div>
  );
}

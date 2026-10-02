import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import NetworkVisualization from './components/NetworkVisualization';
import AIReasoningEngine from './components/AIReasoningEngine';
import NetworkZonesPanel from './components/NetworkZonesPanel';
import DemoControlCenter from './components/DemoControlCenter';
import SensorCharts from './components/SensorCharts';
import AlertsPanel from './components/AlertsPanel';
import RecentEvents from './components/RecentEvents';
import FieldReadinessSection from './components/FieldReadinessSection';
import ArchitectureModal from './components/ArchitectureModal';
import { api } from './services/api';
import { HelpCircle } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState(null);
  const [sensors, setSensors] = useState(null);
  const [network, setNetwork] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [activeScenario, setActiveScenario] = useState('NORMAL');
  const [isStreaming, setIsStreaming] = useState(true);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const controlCenterRef = useRef(null);

  // Data fetching loop
  const refreshData = useCallback(async () => {
    try {
      const [sysStatus, waterData, networkData, alertsData, eventsData, statsData] = await Promise.all([
        api.getSystemStatus(),
        api.getWaterData(30),
        api.getNetwork(),
        api.getAlerts(50),
        api.getEvents(),
        api.getStatistics()
      ]);

      setStatus(sysStatus);
      setSensors(waterData);
      setNetwork(networkData);
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

  // Poll telemetry every 1.2 seconds
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 1200);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Valve Commands
  const handleCommandValve = async (valveId, action) => {
    setIsExecuting(true);
    try {
      await api.commandValve(valveId, action);
      await refreshData();
    } catch (err) {
      console.error('Command valve error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Scenario Handlers
  const handleGenerateNormal = async () => {
    setIsExecuting(true);
    try {
      await api.setNormalScenario();
      setActiveScenario('NORMAL');
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
      await refreshData();
    } catch (err) {
      console.error('Leak scenario error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSimulateLeakStep = async (step) => {
    setIsExecuting(true);
    try {
      await api.simulateLeakStep(step);
      setActiveScenario('LEAK');
      await refreshData();
    } catch (err) {
      console.error('Leak step error:', err);
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

  const handleScrollToControlCenter = () => {
    if (controlCenterRef.current) {
      controlCenterRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F7F9] text-slate-800 selection:bg-[#00A8C6]/30 selection:text-[#063B5C]">
      
      {/* 1. Header & Hero Bar */}
      <Header
        status={status}
        isStreaming={isStreaming}
        onToggleStream={handleToggleStream}
        onReset={handleReset}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onFocusControlCenter={handleScrollToControlCenter}
      />

      {/* Main Mission Control Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* 2. Compact Real-Time KPI Row */}
        <KpiCards
          status={status}
          sensors={sensors}
          network={network}
        />

        {/* 3. HERO DIGITAL TWIN: SMART WATER DISTRIBUTION NETWORK */}
        <NetworkVisualization
          network={network}
          status={status}
          onCommandValve={handleCommandValve}
          onSimulateLeak={handleSimulateLeak}
        />

        {/* 4. AquaAgent AI Decision Engine */}
        <AIReasoningEngine
          status={status}
          network={network}
          onCommandValve={handleCommandValve}
        />

        {/* 5. Distribution Network Zones */}
        <NetworkZonesPanel
          network={network}
          onCommandValve={handleCommandValve}
        />

        {/* 6. Demonstration & Simulation Control Center */}
        <div ref={controlCenterRef}>
          <DemoControlCenter
            activeScenario={activeScenario}
            onGenerateNormal={handleGenerateNormal}
            onSimulateLeak={handleSimulateLeak}
            onSimulateLeakStep={handleSimulateLeakStep}
            onSimulateAbnormalPressure={handleSimulateAbnormalPressure}
            onSimulateDepletion={handleSimulateDepletion}
            onReset={handleReset}
            onSubmitManual={handleManualSubmit}
            onCommandValve={handleCommandValve}
            isExecuting={isExecuting}
            isStreaming={isStreaming}
            onToggleStream={handleToggleStream}
            valves={network?.valves}
          />
        </div>

        {/* 7. Alerts Panel & Live Network Events */}
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

        {/* 8. Sensor History Analytics Charts */}
        <SensorCharts
          sensors={sensors}
          history={sensors?.history}
        />

        {/* 9. Field Integration Readiness & Architecture Transition */}
        <FieldReadinessSection />

        {/* 10. Jury Demo Walkthrough Guide */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#DCE8ED] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#e0f7fa] text-[#00A8C6] flex items-center justify-center font-bold">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#063B5C]">
                Interactive Jury Demonstration Scenario
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Closed-Loop Functional Demo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#063B5C] block mb-1">
                1. Baseline State
              </span>
              <p className="text-slate-600">
                Click <strong>[Generate Normal Data]</strong>. Reservoir at 75%, Flow ~48 L/min, Pressure ~3.8 bar. All valves OPEN.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-50/70 border border-red-200">
              <span className="font-bold text-red-900 block mb-1">
                2. Leak Injected
              </span>
              <p className="text-slate-700">
                Click <strong>[Simulate Leak]</strong>. Zone B pipeline turns flashing red with escaping burst particles. Flow surges to 95 L/m, Pressure drops to 2.0 bar.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-900 block mb-1">
                3. AI Isolation Advisory
              </span>
              <p className="text-slate-700">
                AI Engine detects rupture, ranks threat as CRITICAL, and advises <strong>"CLOSE V3"</strong>. Valve V3 glows red.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1">
                4. Containment Executed
              </span>
              <p className="text-slate-700">
                Click <strong>[Close V3]</strong>. Zone B is isolated, pressure restores across network, AI status updates to <strong>"THREAT CONTAINED"</strong>!
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Architecture Modal Dialog */}
      <ArchitectureModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-[#DCE8ED] bg-white py-4 px-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span>AquaAgent 2.0 • AI-Powered Smart Water Distribution & Conservation System</span>
        </div>
      </footer>

    </div>
  );
}

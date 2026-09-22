// AquaAgent Client-Side Simulation & API Service
// Closed-loop Autonomous State Machine with API fallback

const BASE_URL = '/api';

// ==========================================
// 1. Client-Side Simulation Engine
// ==========================================
class ClientSimulationEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.flowRate = 42.4;
    this.pressure = 3.82;
    this.targetFlow = 42.4;
    this.targetPressure = 3.82;
    this.leakActive = false;
    this.leakSeverity = 'NONE'; // NONE, LOW, MEDIUM, HIGH, CRITICAL
    this.leakZone = 'Zone B';

    // Valve states
    this.valves = {
      valve_1: {
        id: 'valve_1',
        name: 'Zone B Primary Inlet Actuator',
        zone: 'Zone B',
        status: 'OPEN', // OPEN, CLOSED, FAILED, CLOSING
        last_command: 'INITIALIZE',
        last_response_time_ms: 120,
        health: 100,
      },
      valve_2: {
        id: 'valve_2',
        name: 'Zone B Secondary Isolation Valve',
        zone: 'Zone B',
        status: 'OPEN',
        last_command: 'INITIALIZE',
        last_response_time_ms: 140,
        health: 100,
      },
      valve_main: {
        id: 'valve_main',
        name: 'Central Feeder Valve',
        zone: 'Main Pipeline',
        status: 'OPEN',
        last_command: 'INITIALIZE',
        last_response_time_ms: 95,
        health: 100,
      },
    };

    // Fault injection flags
    this.injectValve1Fault = false;
    this.injectValve2Fault = false;

    // Zones
    this.zones = {
      'Zone A': { id: 'Zone A', name: 'Zone A - Commercial Hub', status: 'NORMAL', flow: 12.1, pressure: 3.85, valves: ['valve_main'] },
      'Zone B': { id: 'Zone B', name: 'Zone B - High-Density Residential', status: 'NORMAL', flow: 18.2, pressure: 3.82, valves: ['valve_1', 'valve_2'] },
      'Zone C': { id: 'Zone C', name: 'Zone C - Industrial Sector', status: 'NORMAL', flow: 7.5, pressure: 3.80, valves: [] },
      'Zone D': { id: 'Zone D', name: 'Zone D - Suburban Extension', status: 'NORMAL', flow: 4.6, pressure: 3.79, valves: [] },
    };

    // Water loss & savings
    this.waterLostLiters = 0.0;
    this.waterSavedLiters = 1248.0;
    this.lastTickTime = Date.now();

    // Historical telemetry for charts
    this.history = [];
    const now = Date.now();
    for (let i = 25; i > 0; i--) {
      const d = new Date(now - i * 2000);
      const tStr = d.toTimeString().split(' ')[0];
      this.history.push({
        timestamp: tStr,
        flow_rate: +(42.0 + (Math.random() * 1.2 - 0.6)).toFixed(1),
        pressure: +(3.8 + (Math.random() * 0.08 - 0.04)).toFixed(2),
        expected_flow_min: 40.0,
        expected_flow_max: 45.0,
        expected_pressure_min: 3.5,
        expected_pressure_max: 4.0,
        zone_b_flow: +(18.0 + (Math.random() * 0.6 - 0.3)).toFixed(1),
        zone_b_pressure: +(3.8 + (Math.random() * 0.06 - 0.03)).toFixed(2),
      });
    }
  }

  triggerLeak(severity = 'HIGH') {
    this.leakActive = true;
    this.leakSeverity = severity;
    this.zones['Zone B'].status = 'LEAK DETECTED';
    this.targetFlow = severity === 'HIGH' ? 82.5 : 92.0;
    this.targetPressure = severity === 'HIGH' ? 1.85 : 1.45;
    this.flowRate = this.targetFlow;
    this.pressure = this.targetPressure;
  }

  setValve1Fault(isFaulty = true) {
    this.injectValve1Fault = isFaulty;
  }

  setValve2Fault(isFaulty = true) {
    this.injectValve2Fault = isFaulty;
  }

  commandValve(valveId, action) {
    if (!this.valves[valveId]) return false;
    const valve = this.valves[valveId];
    valve.last_command = action;

    // Simulated actuator faults
    if (valveId === 'valve_1' && this.injectValve1Fault && action === 'CLOSE') {
      valve.status = 'FAILED';
      valve.last_response_time_ms = 3500;
      valve.health = 15;
      return false;
    }

    if (valveId === 'valve_2' && this.injectValve2Fault && action === 'CLOSE') {
      valve.status = 'FAILED';
      valve.last_response_time_ms = 3800;
      valve.health = 10;
      return false;
    }

    // Success
    valve.status = action === 'CLOSE' ? 'CLOSED' : (action === 'OPEN' ? 'OPEN' : action);
    valve.last_response_time_ms = Math.floor(Math.random() * 240 + 180);
    valve.health = 100;

    if (action === 'CLOSE' && (valveId === 'valve_1' || valveId === 'valve_2')) {
      this.zones['Zone B'].status = 'ISOLATED';
      this.leakActive = false;
      this.targetFlow = 42.1;
      this.targetPressure = 3.82;
      this.flowRate = 42.1;
      this.pressure = 3.82;
      this.waterSavedLiters += 450.0;
    } else if (action === 'OPEN' && (valveId === 'valve_1' || valveId === 'valve_2')) {
      if (this.leakActive) {
        this.zones['Zone B'].status = 'LEAK DETECTED';
        this.targetFlow = 82.5;
        this.targetPressure = 1.85;
      } else {
        this.zones['Zone B'].status = 'NORMAL';
        this.targetFlow = 42.4;
        this.targetPressure = 3.82;
      }
    }

    return true;
  }

  markZoneResolved(zoneName = 'Zone B') {
    if (this.zones[zoneName]) {
      this.zones[zoneName].status = 'RESOLVED';
      this.leakActive = false;
      this.targetFlow = 42.1;
      this.targetPressure = 3.82;
      this.flowRate = 42.1;
      this.pressure = 3.82;
    }
  }

  tick() {
    const now = Date.now();
    const dt = (now - this.lastTickTime) / 1000;
    this.lastTickTime = now;

    const alpha = 0.35;
    this.flowRate = +(this.flowRate + alpha * (this.targetFlow - this.flowRate) + (Math.random() * 0.7 - 0.35)).toFixed(1);
    this.pressure = +(this.pressure + alpha * (this.targetPressure - this.pressure) + (Math.random() * 0.04 - 0.02)).toFixed(2);

    if (this.leakActive) {
      const excessFlow = Math.max(0.0, this.flowRate - 42.0);
      this.waterLostLiters = +(this.waterLostLiters + (excessFlow / 60.0) * Math.max(0.2, dt)).toFixed(1);
    }

    const zbFlow = !(this.valves.valve_1.status === 'CLOSED' || this.valves.valve_2.status === 'CLOSED')
      ? +(this.flowRate * 0.43).toFixed(1)
      : +(1.2 + (Math.random() * 0.2 - 0.1)).toFixed(1);

    this.zones['Zone B'].flow = zbFlow;
    this.zones['Zone B'].pressure = this.pressure;

    const d = new Date();
    const tStr = d.toTimeString().split(' ')[0];
    this.history.push({
      timestamp: tStr,
      flow_rate: this.flowRate,
      pressure: this.pressure,
      expected_flow_min: 40.0,
      expected_flow_max: 45.0,
      expected_pressure_min: 3.5,
      expected_pressure_max: 4.0,
      zone_b_flow: zbFlow,
      zone_b_pressure: this.pressure,
    });
    if (this.history.length > 30) {
      this.history.shift();
    }
  }
}

// ==========================================
// 2. Client-Side Agent Decision Engine
// ==========================================
class ClientAgentDecisionEngine {
  constructor(simEngine) {
    this.sim = simEngine;
    this.reset();
  }

  reset() {
    this.mode = 'AUTONOMOUS'; // AUTONOMOUS, HUMAN_OVERRIDE, ESCALATED
    this.stage = 'IDLE'; // IDLE, OBSERVE, ANALYZE, PLAN, ACT, VERIFY, ADAPT, ESCALATE, RESOLVED
    this.currentObjective = 'Continuous baseline monitoring, leak prevention, and pressure stability.';
    this.latestThought = 'System nominal. Monitoring flow (40-45 L/min) and pressure (3.5-4.0 bar) across all 4 zones.';
    this.currentIncidentId = null;
    this.incidents = [];
    this.logs = [];
    this.timeline = [];
    this.activeDecisionExplanation = null;
    this.retries = 0;
    this.targetValveAttempted = 'valve_1';
    this.scenario = 'NORMAL';

    this.addLog('SYSTEM_BOOT', 'INFO', 'AGENT_ENGINE', 'AquaAgent Autonomous Decision Kernel v2.4 initialized in AUTONOMOUS mode.');
    this.addLog('BASELINE_VERIFIED', 'INFO', 'SENSOR_MONITOR', 'Hydraulic baseline verified: Flow 42.4 L/min (+/-1.5%), Pressure 3.82 bar. All 4 zones healthy.');
  }

  addLog(event, severity, source, details) {
    const tStr = new Date().toTimeString().split(' ')[0];
    const entry = {
      id: `LOG-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
      timestamp: tStr,
      event,
      severity,
      source,
      details,
    };
    this.logs.unshift(entry);
    if (this.logs.length > 120) {
      this.logs.pop();
    }
    return entry;
  }

  addTimelineStep(stage, message, details = {}) {
    const tStr = new Date().toTimeString().split(' ')[0];
    const entry = {
      timestamp: tStr,
      stage,
      message,
      details,
    };
    this.timeline.push(entry);
    this.latestThought = message;
  }

  autonomousStep() {
    if (this.mode === 'HUMAN_OVERRIDE') {
      this.stage = 'IDLE';
      this.latestThought = 'Human operator is in direct control. Autonomous actuation paused.';
      return;
    }

    const flow = this.sim.flowRate;
    const pressure = this.sim.pressure;

    // 1. Anomaly detection: IDLE / RESOLVED -> OBSERVE
    if (this.stage === 'IDLE' || this.stage === 'RESOLVED') {
      if (flow > 55.0 || pressure < 2.9 || this.sim.leakActive) {
        this.stage = 'OBSERVE';
        this.currentObjective = 'Contain detected hydraulic burst in Zone B and prevent network pressure collapse.';
        this.currentIncidentId = `INC-${String(this.incidents.length + 1).padStart(3, '0')}`;
        this.timeline = [];
        this.retries = 0;
        this.targetValveAttempted = 'valve_1';

        this.addLog('FLOW_ANOMALY_DETECTED', 'WARNING', 'SENSOR_MONITOR', `Flow surge detected: ${flow} L/min (Expected: 40-45 L/min).`);
        this.addLog('PRESSURE_DROP_DETECTED', 'WARNING', 'SENSOR_MONITOR', `Pressure plummeted: ${pressure} bar (Expected: 3.5-4.0 bar).`);
        this.addTimelineStep('OBSERVE', `Sensor anomaly detected. Flow=${flow} L/min, Pressure=${pressure} bar.`);
        return;
      }
    }

    // 2. OBSERVE -> ANALYZE
    if (this.stage === 'OBSERVE') {
      this.stage = 'ANALYZE';
      const flowPct = Math.round(((flow - 42.0) / 42.0) * 100);
      const presPct = Math.round(((3.8 - pressure) / 3.8) * 100);
      this.addLog('CROSS_SENSOR_CORRELATION', 'ERROR', 'AGENT_ENGINE', `Cross-sensor correlation indicates probable pipeline leakage (+${flowPct}% Flow, -${presPct}% Pressure).`);
      this.addLog('SEVERITY_CLASSIFIED_HIGH', 'ERROR', 'AGENT_ENGINE', 'Severity classified as HIGH. Affected zone: Zone B.');
      this.addTimelineStep('ANALYZE', `Cross-sensor correlation confirms pipeline leakage in Zone B (+${flowPct}% Flow, -${presPct}% Pressure). Severity: HIGH.`);
      return;
    }

    // 3. ANALYZE -> PLAN
    if (this.stage === 'ANALYZE') {
      this.stage = 'PLAN';
      const targetValve = this.retries === 0 ? 'valve_1' : 'valve_2';
      this.targetValveAttempted = targetValve;
      const valveName = this.sim.valves[targetValve].name;
      this.addLog('ISOLATION_PLAN_SELECTED', 'INFO', 'AGENT_ENGINE', `Selecting safe isolation action: Command ${valveName} (${targetValve}) to CLOSE.`);
      this.addTimelineStep('PLAN', `Selecting safe isolation action: Preparing command for ${valveName} (${targetValve}).`);
      return;
    }

    // 4. PLAN -> ACT (Deterministic PLAN -> ACT Transition)
    if (this.stage === 'PLAN') {
      this.stage = 'ACT';
      const targetValve = this.targetValveAttempted;
      const valveName = this.sim.valves[targetValve].name;

      this.addLog(`${targetValve.toUpperCase()}_COMMAND_SENT`, 'INFO', 'AGENT_ENGINE', `Command sent to ${valveName} (${targetValve}).`);
      this.addTimelineStep('ACT', `Command sent to ${valveName} (${targetValve}). Awaiting actuator response.`);

      const success = this.sim.commandValve(targetValve, 'CLOSE');
      if (success) {
        this.stage = 'VERIFY';
        const respMs = this.sim.valves[targetValve].last_response_time_ms;
        this.addLog(`${targetValve.toUpperCase()}_CONFIRMED_CLOSED`, 'SUCCESS', `ACTUATOR_${targetValve.toUpperCase()}`, `${valveName} response confirmed in ${respMs}ms.`);
        this.addTimelineStep('ACT', `${valveName} activated successfully. Initiating verification.`);
      } else {
        this.stage = 'ADAPT';
        this.addLog(`${targetValve.toUpperCase()}_RESPONSE_NOT_DETECTED`, 'CRITICAL', `ACTUATOR_${targetValve.toUpperCase()}`, `${valveName} response not detected (Actuator fault/timeout).`);
        this.addTimelineStep('ADAPT', `${valveName} response not detected. Replanning response.`);
      }
      return;
    }

    // Direct ACT execution fallback if stage was set to ACT
    if (this.stage === 'ACT') {
      const targetValve = this.targetValveAttempted;
      const valveName = this.sim.valves[targetValve].name;
      const success = this.sim.commandValve(targetValve, 'CLOSE');
      if (success) {
        this.stage = 'VERIFY';
        const respMs = this.sim.valves[targetValve].last_response_time_ms;
        this.addLog(`${targetValve.toUpperCase()}_CONFIRMED_CLOSED`, 'SUCCESS', `ACTUATOR_${targetValve.toUpperCase()}`, `${valveName} response confirmed in ${respMs}ms.`);
        this.addTimelineStep('ACT', `${valveName} activated successfully. Initiating verification.`);
      } else {
        this.stage = 'ADAPT';
        this.addLog(`${targetValve.toUpperCase()}_RESPONSE_NOT_DETECTED`, 'CRITICAL', `ACTUATOR_${targetValve.toUpperCase()}`, `${valveName} response not detected (Actuator fault/timeout).`);
        this.addTimelineStep('ADAPT', `${valveName} response not detected. Replanning response.`);
      }
      return;
    }

    // 5. ADAPT
    if (this.stage === 'ADAPT') {
      if (this.retries === 0) {
        this.retries += 1;
        this.stage = 'PLAN';
        this.targetValveAttempted = 'valve_2';
        this.addLog('AGENT_REPLAN_TRIGGERED', 'WARNING', 'AGENT_ENGINE', 'Primary isolation path unavailable. Replanning response: Selecting Valve 2 as alternate isolation point.');
        this.addTimelineStep('ADAPT', 'Primary isolation path unavailable. Valve 2 selected as alternate isolation point.');
      } else {
        this.stage = 'ESCALATE';
        this.mode = 'ESCALATED';
        this.addLog('AUTONOMOUS_LIMIT_EXCEEDED', 'CRITICAL', 'AGENT_ENGINE', 'Both automated isolation paths (Valve 1 & Valve 2) failed. Autonomous response exhausted.');
        this.addTimelineStep('ESCALATE', 'Autonomous response exhausted. Both valves unavailable. Emergency escalation to human operator!');
        this.activeDecisionExplanation = {
          title: 'Dual-Actuator Critical Fault - Human Escalation',
          timestamp: new Date().toTimeString().split(' ')[0],
          observations: {
            flow_rate: `${flow} L/min (Expected: 40-45 L/min)`,
            pressure: `${pressure} bar (Expected: 3.5-4.0 bar)`,
            valve_1: this.sim.valves.valve_1.status,
            valve_2: this.sim.valves.valve_2.status,
          },
          reasoning: 'High flow + severe pressure drop indicates ongoing pipeline burst. Both Valve 1 and Valve 2 failed actuation attempts. System cannot safely self-heal without physical technician intervention.',
          selected_action: 'EMERGENCY_HUMAN_ESCALATION',
          expected_outcome: 'Field technician dispatch alert; audible control-room alarm.',
          verification_status: 'UNRESOLVED_AUTONOMOUS_LIMIT',
          decision_result: 'HUMAN_INTERVENTION_REQUIRED',
        };
        this.recordIncident('ESCALATED_TO_HUMAN', 'Escalated to human operator (Dual Actuator Fault)');
      }
      return;
    }

    // 6. VERIFY
    if (this.stage === 'VERIFY') {
      if (flow <= 46.0 && pressure >= 3.5) {
        this.stage = 'RESOLVED';
        this.sim.markZoneResolved('Zone B');
        this.addLog('FLOW_RETURNED_TO_NORMAL', 'SUCCESS', 'SENSOR_MONITOR', `Flow returned to normal range (${flow} L/min).`);
        this.addLog('PRESSURE_STABILIZED', 'SUCCESS', 'SENSOR_MONITOR', `Pressure stabilized (${pressure} bar).`);
        this.addLog('INCIDENT_RESOLVED', 'SUCCESS', 'AGENT_ENGINE', 'Incident successfully resolved autonomously. Network integrity confirmed.');
        this.addTimelineStep('RESOLVED', `Flow returned to normal range (${flow} L/min). Pressure stabilized (${pressure} bar). Incident resolved.`);

        const valveLabel = this.retries > 0 ? 'Valve 2 (Alternate after Actuator Fault)' : 'Valve 1 (Primary)';
        this.activeDecisionExplanation = {
          title: `Autonomous Closed-Loop Containment (${valveLabel})`,
          timestamp: new Date().toTimeString().split(' ')[0],
          observations: {
            flow_rate: `${flow} L/min (Expected: 40-45 L/min)`,
            pressure: `${pressure} bar (Expected: 3.5-4.0 bar)`,
            valve_1: this.sim.valves.valve_1.status,
            valve_2: this.sim.valves.valve_2.status,
          },
          reasoning: `High flow + low pressure indicated a probable leakage event. ${this.retries > 0 ? 'Primary isolation attempt failed on Valve 1. Valve 2 was dynamically selected as permitted alternate.' : 'Valve 1 was commanded to isolate Zone B.'}`,
          selected_action: `${this.targetValveAttempted.toUpperCase()} -> CLOSE`,
          expected_outcome: 'Zone B isolated, pressure restored to 3.8 bar across network.',
          verification_status: 'Flow normalized. Pressure stabilized.',
          decision_result: 'Incident resolved.',
        };
        this.recordIncident('RESOLVED', `Auto-resolved via ${valveLabel}`);
      } else {
        this.addTimelineStep('VERIFY', `Post-action verification active. Current flow: ${flow} L/min, pressure: ${pressure} bar...`);
      }
      return;
    }
  }

  recordIncident(status, resolution) {
    if (!this.currentIncidentId) return;

    const actions = [];
    if (this.sim.valves.valve_1.status === 'CLOSED' || this.sim.valves.valve_1.status === 'FAILED') {
      actions.push(`Valve 1 (${this.sim.valves.valve_1.status})`);
    }
    if (this.sim.valves.valve_2.status === 'CLOSED' || this.sim.valves.valve_2.status === 'FAILED') {
      actions.push(`Valve 2 (${this.sim.valves.valve_2.status})`);
    }
    if (actions.length === 0) {
      actions.push('Telemetry Audit');
    }

    const incident = {
      id: this.currentIncidentId,
      timestamp: new Date().toTimeString().split(' ')[0],
      zone: 'Zone B',
      type: 'Pipeline Leakage',
      severity: status !== 'ESCALATED_TO_HUMAN' ? 'HIGH' : 'CRITICAL',
      status,
      actions_taken: actions,
      resolution,
      water_lost_liters: this.sim.waterLostLiters,
      water_saved_liters: this.sim.waterSavedLiters,
      timeline: [...this.timeline],
      explanation: this.activeDecisionExplanation,
    };

    const existingIdx = this.incidents.findIndex((inc) => inc.id === this.currentIncidentId);
    if (existingIdx !== -1) {
      this.incidents[existingIdx] = incident;
    } else {
      this.incidents.unshift(incident);
    }
  }

  triggerReplanManual() {
    this.stage = 'ADAPT';
    this.autonomousStep();
  }

  triggerVerifyManual() {
    this.stage = 'VERIFY';
    this.addLog('POST_ACTION_VERIFICATION_ACTIVE', 'INFO', 'AGENT_ENGINE', 'Post-action verification active. Monitoring flow and pressure stabilization.');
    this.addTimelineStep('VERIFY', `Post-action verification active. Current flow: ${this.sim.flowRate} L/min, pressure: ${this.sim.pressure} bar...`);
  }

  setHumanOverride(enabled) {
    if (enabled) {
      this.mode = 'HUMAN_OVERRIDE';
      this.addLog('HUMAN_OVERRIDE_ENGAGED', 'WARNING', 'HUMAN_OPERATOR', 'Operator engaged MANUAL OVERRIDE. Agent autonomous control paused.');
    } else {
      this.mode = 'AUTONOMOUS';
      this.addLog('AUTONOMOUS_MODE_RESTORED', 'INFO', 'HUMAN_OPERATOR', 'Operator restored AUTONOMOUS mode. Closed-loop AI agent re-armed.');
    }
  }

  acknowledgeIncident() {
    this.addLog('INCIDENT_ACKNOWLEDGED', 'INFO', 'HUMAN_OPERATOR', `Incident ${this.currentIncidentId} acknowledged by human operator.`);
    if (this.mode === 'ESCALATED') {
      this.mode = 'HUMAN_OVERRIDE';
    }
  }
}

// ==========================================
// 3. Global Simulation State Instance
// ==========================================
class GlobalSimulationState {
  constructor() {
    this.sim = new ClientSimulationEngine();
    this.agent = new ClientAgentDecisionEngine(this.sim);
    this.autoLoop = true;
    this.tickCount = 0;
    this.scenarioName = 'NORMAL';

    // Auto tick interval for simulation loop
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.sim.tick();
        this.tickCount++;
        if (this.autoLoop && this.agent.mode === 'AUTONOMOUS') {
          if (this.tickCount % 2 === 0 && this.agent.stage !== 'IDLE' && this.agent.stage !== 'RESOLVED' && this.agent.stage !== 'ESCALATE') {
            this.agent.autonomousStep();
          }
        }
      }, 1000);
    }
  }

  resetAll() {
    this.sim.reset();
    this.agent.reset();
    this.scenarioName = 'NORMAL';
    this.autoLoop = true;
  }

  setScenario(scenario) {
    this.scenarioName = scenario;
    if (scenario === 'NORMAL') {
      this.sim.reset();
      this.agent.reset();
    } else if (scenario === 'LEAK') {
      this.sim.setValve1Fault(false);
      this.sim.setValve2Fault(false);
      this.sim.triggerLeak('HIGH');
    } else if (scenario === 'VALVE1_FAILURE') {
      this.sim.setValve1Fault(true);
      this.sim.setValve2Fault(false);
      this.sim.triggerLeak('HIGH');
    } else if (scenario === 'ADAPT_RECOVER') {
      this.sim.setValve1Fault(true);
      this.sim.setValve2Fault(false);
      // Advance to VERIFY state
      let maxSteps = 10;
      while (this.agent.stage !== 'VERIFY' && this.agent.stage !== 'RESOLVED' && maxSteps-- > 0) {
        this.agent.autonomousStep();
      }
    } else if (scenario === 'BOTH_FAILED') {
      this.sim.setValve1Fault(true);
      this.sim.setValve2Fault(true);
      this.sim.triggerLeak('HIGH');
      // Step through until ESCALATE
      let maxSteps = 10;
      while (this.agent.stage !== 'ESCALATE' && maxSteps-- > 0) {
        this.agent.autonomousStep();
      }
    }
  }

  getSystemStatusPayload() {
    const flow = this.sim.flowRate;
    const pressure = this.sim.pressure;

    let sysStatus = 'SYSTEM OPERATIONAL';
    if (this.agent.mode === 'ESCALATED') {
      sysStatus = 'CRITICAL ALERT - ESCALATED';
    } else if (this.agent.mode === 'HUMAN_OVERRIDE') {
      sysStatus = 'MANUAL OVERRIDE ACTIVE';
    } else if (this.sim.leakActive) {
      sysStatus = `ANOMALY CONTAINMENT IN PROGRESS (${this.agent.stage})`;
    } else if (this.agent.stage === 'RESOLVED') {
      sysStatus = 'SYSTEM OPERATIONAL - RECENTLY CONTAINED';
    }

    const activeIncidents = (this.sim.leakActive || (this.agent.stage !== 'IDLE' && this.agent.stage !== 'RESOLVED')) ? 1 : 0;

    return {
      app_name: 'AquaAgent',
      subtitle: 'Autonomous AI for Smarter Water Networks',
      system_status: sysStatus,
      current_flow_rate: flow,
      current_pressure: pressure,
      active_zones_count: '4 / 4',
      water_saved_liters: Math.round(this.sim.waterSavedLiters * 10) / 10,
      water_lost_liters: Math.round(this.sim.waterLostLiters * 10) / 10,
      active_incidents_count: activeIncidents,
      agent_status: this.agent.mode,
      current_objective: this.agent.currentObjective,
      current_stage: this.agent.stage,
      scenario: this.scenarioName,
      auto_loop_enabled: this.autoLoop,
      latest_thought: this.agent.latestThought,
    };
  }

  getSensorsPayload() {
    const lastPoint = this.sim.history[this.sim.history.length - 1];
    return {
      current: {
        timestamp: lastPoint ? lastPoint.timestamp : '00:00:00',
        flow_rate: this.sim.flowRate,
        pressure: this.sim.pressure,
        expected_flow_min: 40.0,
        expected_flow_max: 45.0,
        expected_pressure_min: 3.5,
        expected_pressure_max: 4.0,
        zone_b_flow: this.sim.zones['Zone B'].flow,
        zone_b_pressure: this.sim.zones['Zone B'].pressure,
      },
      history: this.sim.history,
    };
  }

  getNetworkPayload() {
    return {
      zones: this.sim.zones,
      valves: this.sim.valves,
      leak_zone: this.sim.leakActive ? this.sim.leakZone : null,
      leak_active: this.sim.leakActive,
      leak_severity: this.sim.leakSeverity,
    };
  }

  getAgentStatePayload() {
    return {
      mode: this.agent.mode,
      stage: this.agent.stage,
      current_objective: this.agent.currentObjective,
      latest_thought: this.agent.latestThought,
      current_incident_id: this.agent.currentIncidentId,
      timeline: this.agent.timeline,
      active_decision_explanation: this.agent.activeDecisionExplanation,
      retries: this.agent.retries,
      target_valve_attempted: this.agent.targetValveAttempted,
      auto_loop: this.autoLoop,
    };
  }
}

const localState = new GlobalSimulationState();

// ==========================================
// 4. API Request Handler with Fallback
// ==========================================
async function fetchJson(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API Error ${res.status}: ${err}`);
    }
    return await res.json();
  } catch (err) {
    // Graceful fallback to client-side local simulation
    return handleLocalFallback(endpoint, options);
  }
}

function handleLocalFallback(endpoint, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};

  // GET endpoints
  if (method === 'GET') {
    if (endpoint === '/system/status') return localState.getSystemStatusPayload();
    if (endpoint === '/sensors') return localState.getSensorsPayload();
    if (endpoint === '/network') return localState.getNetworkPayload();
    if (endpoint === '/agent/state') return localState.getAgentStatePayload();
    if (endpoint === '/incidents') return localState.agent.incidents;
    if (endpoint.startsWith('/incidents/')) {
      const id = endpoint.split('/incidents/')[1];
      const inc = localState.agent.incidents.find((i) => i.id === id);
      if (!inc) throw new Error('Incident not found');
      return inc;
    }
    if (endpoint === '/logs') return localState.agent.logs;
  }

  // POST simulation scenarios
  if (method === 'POST') {
    if (endpoint === '/simulation/normal') {
      localState.setScenario('NORMAL');
      localState.agent.addLog('SCENARIO_NORMAL', 'INFO', 'AGENT_ENGINE', 'Scenario [NORMAL] activated: baseline 42 L/min, 3.8 bar.');
      return { status: 'ok', scenario: 'NORMAL' };
    }
    if (endpoint === '/simulation/leak') {
      localState.setScenario('LEAK');
      localState.agent.addLog('SCENARIO_LEAK_TRIGGERED', 'WARNING', 'HUMAN_OPERATOR', 'Scenario [SIMULATE LEAK] activated: High-flow pipe rupture injected into Zone B.');
      localState.agent.autonomousStep();
      return { status: 'ok', scenario: 'LEAK' };
    }
    if (endpoint === '/simulation/valve1-failure') {
      localState.setScenario('VALVE1_FAILURE');
      localState.agent.addLog('SCENARIO_V1_FAILURE', 'ERROR', 'HUMAN_OPERATOR', 'Scenario [VALVE 1 FAILURE] activated: Primary Actuator fault injected.');
      // Execute through PLAN -> ACT (failure) -> ADAPT
      if (localState.agent.stage === 'ANALYZE' || localState.agent.stage === 'OBSERVE') {
        if (localState.agent.stage === 'OBSERVE') localState.agent.autonomousStep(); // OBSERVE -> ANALYZE
        localState.agent.autonomousStep(); // ANALYZE -> PLAN
        localState.agent.autonomousStep(); // PLAN -> ACT (fails) -> ADAPT
      } else if (localState.agent.stage === 'PLAN') {
        localState.agent.autonomousStep(); // PLAN -> ACT (fails) -> ADAPT
      } else {
        localState.agent.autonomousStep();
      }
      return { status: 'ok', scenario: 'VALVE1_FAILURE' };
    }
    if (endpoint === '/simulation/adapt-recover') {
      localState.setScenario('ADAPT_RECOVER');
      localState.agent.addLog('SCENARIO_ADAPT_RECOVER', 'SUCCESS', 'AGENT_ENGINE', 'Scenario [ADAPT & RECOVER] completed: Replan to Valve 2 succeeded. Verification passed.');
      return { status: 'ok', scenario: 'ADAPT_RECOVER' };
    }
    if (endpoint === '/simulation/both-valves-failed') {
      localState.setScenario('BOTH_FAILED');
      localState.agent.addLog('SCENARIO_BOTH_FAILED', 'CRITICAL', 'AGENT_ENGINE', 'Scenario [BOTH VALVES FAILED]: Primary & Secondary isolation failed. Escalated to human operator.');
      return { status: 'ok', scenario: 'BOTH_FAILED' };
    }
    if (endpoint === '/simulation/reset') {
      localState.resetAll();
      localState.agent.addLog('SYSTEM_RESET', 'INFO', 'HUMAN_OPERATOR', 'System state reset to baseline operational parameters.');
      return { status: 'ok', scenario: 'NORMAL' };
    }
    if (endpoint === '/simulation/step') {
      localState.agent.autonomousStep();
      return {
        status: 'ok',
        stage: localState.agent.stage,
        thought: localState.agent.latestThought,
      };
    }

    // Manual valve commands
    const openMatch = endpoint.match(/\/valves\/(.+)\/open/);
    if (openMatch) {
      const valveId = openMatch[1];
      const res = localState.sim.commandValve(valveId, 'OPEN');
      const valveName = localState.sim.valves[valveId]?.name || valveId;
      localState.agent.addLog('MANUAL_VALVE_OPEN', 'INFO', 'HUMAN_OPERATOR', `Manual command dispatched: OPEN ${valveName} (${valveId}).`);
      return { valve_id: valveId, status: 'OPEN', success: res };
    }

    const closeMatch = endpoint.match(/\/valves\/(.+)\/close/);
    if (closeMatch) {
      const valveId = closeMatch[1];
      const res = localState.sim.commandValve(valveId, 'CLOSE');
      const valveName = localState.sim.valves[valveId]?.name || valveId;
      localState.agent.addLog('MANUAL_VALVE_CLOSE', 'INFO', 'HUMAN_OPERATOR', `Manual command dispatched: CLOSE ${valveName} (${valveId}).`);
      return { valve_id: valveId, status: localState.sim.valves[valveId]?.status, success: res };
    }

    // Agent operations
    if (endpoint === '/agent/replan') {
      localState.agent.triggerReplanManual();
      return { status: 'ok', stage: localState.agent.stage };
    }
    if (endpoint === '/agent/verify') {
      localState.agent.triggerVerifyManual();
      return { status: 'ok', stage: localState.agent.stage };
    }
    if (endpoint === '/agent/override') {
      localState.agent.setHumanOverride(body.enabled);
      return { mode: localState.agent.mode };
    }
    if (endpoint === '/agent/acknowledge') {
      localState.agent.acknowledgeIncident();
      return { status: 'acknowledged', mode: localState.agent.mode };
    }
    if (endpoint === '/agent/toggle-auto-loop') {
      localState.autoLoop = body.enabled;
      return { auto_loop: localState.autoLoop };
    }
  }

  return { status: 'ok' };
}

// ==========================================
// 5. Export API Surface
// ==========================================
export const api = {
  // System & Telemetry
  getSystemStatus: () => fetchJson('/system/status'),
  getSensors: () => fetchJson('/sensors'),
  getNetwork: () => fetchJson('/network'),
  getAgentState: () => fetchJson('/agent/state'),
  getIncidents: () => fetchJson('/incidents'),
  getIncidentById: (id) => fetchJson(`/incidents/${id}`),
  getLogs: () => fetchJson('/logs'),

  // Demo Scenarios
  triggerNormal: () => fetchJson('/simulation/normal', { method: 'POST' }),
  triggerLeak: () => fetchJson('/simulation/leak', { method: 'POST' }),
  triggerValve1Failure: () => fetchJson('/simulation/valve1-failure', { method: 'POST' }),
  triggerAdaptRecover: () => fetchJson('/simulation/adapt-recover', { method: 'POST' }),
  triggerBothValvesFailed: () => fetchJson('/simulation/both-valves-failed', { method: 'POST' }),
  resetSimulation: () => fetchJson('/simulation/reset', { method: 'POST' }),
  stepSimulation: () => fetchJson('/simulation/step', { method: 'POST' }),

  // Manual Valve Actuation
  openValve: (valveId) => fetchJson(`/valves/${valveId}/open`, { method: 'POST' }),
  closeValve: (valveId) => fetchJson(`/valves/${valveId}/close`, { method: 'POST' }),

  // Agent Operations
  triggerReplan: () => fetchJson('/agent/replan', { method: 'POST' }),
  triggerVerify: () => fetchJson('/agent/verify', { method: 'POST' }),
  toggleOverride: (enabled) => fetchJson('/agent/override', {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  }),
  acknowledgeIncident: () => fetchJson('/agent/acknowledge', { method: 'POST' }),
  toggleAutoLoop: (enabled) => fetchJson('/agent/toggle-auto-loop', {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  }),
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  // 1. Water telemetry
  async getWaterData(limit = 30) {
    const res = await fetch(`${API_BASE_URL}/water-data?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch water telemetry');
    return res.json();
  },

  async postWaterData(reading) {
    const res = await fetch(`${API_BASE_URL}/water-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reading)
    });
    if (!res.ok) throw new Error('Failed to post water telemetry');
    return res.json();
  },

  // 2. Digital Twin Network & Valves
  async getNetwork() {
    const res = await fetch(`${API_BASE_URL}/network`);
    if (!res.ok) throw new Error('Failed to fetch network state');
    return res.json();
  },

  async commandValve(valveId, action) {
    const res = await fetch(`${API_BASE_URL}/valves/${valveId}/${action}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Failed to command valve ${valveId}`);
    return res.json();
  },

  // 3. Alerts
  async getAlerts(limit = 50, status = null) {
    const url = status ? `${API_BASE_URL}/alerts?limit=${limit}&status=${status}` : `${API_BASE_URL}/alerts?limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async resolveAlert(alertId) {
    const res = await fetch(`${API_BASE_URL}/alerts/${alertId}/resolve`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return res.json();
  },

  // 4. Direct Anomaly Analysis
  async analyzeReading(data) {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to analyze reading');
    return res.json();
  },

  // 5. System Status
  async getSystemStatus() {
    const res = await fetch(`${API_BASE_URL}/system-status`);
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  // 6. Statistics
  async getStatistics() {
    const res = await fetch(`${API_BASE_URL}/statistics`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  // 7. Events Feed
  async getEvents() {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  // 8. Simulation Scenarios & Demo Controls
  async setNormalScenario() {
    const res = await fetch(`${API_BASE_URL}/simulation/normal`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to set normal scenario');
    return res.json();
  },

  async simulateLeak() {
    const res = await fetch(`${API_BASE_URL}/simulation/leak`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to simulate leak');
    return res.json();
  },

  async simulateAbnormalPressure() {
    const res = await fetch(`${API_BASE_URL}/simulation/abnormal-pressure`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to simulate abnormal pressure');
    return res.json();
  },

  async simulateDepletion() {
    const res = await fetch(`${API_BASE_URL}/simulation/depletion`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to simulate reservoir depletion');
    return res.json();
  },

  async submitManualReading(reading) {
    const res = await fetch(`${API_BASE_URL}/simulation/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reading)
    });
    if (!res.ok) throw new Error('Failed to submit manual reading');
    return res.json();
  },

  async resetSimulation() {
    const res = await fetch(`${API_BASE_URL}/simulation/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset simulation');
    return res.json();
  },

  async toggleStream(enabled) {
    const res = await fetch(`${API_BASE_URL}/simulation/toggle-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled })
    });
    if (!res.ok) throw new Error('Failed to toggle stream');
    return res.json();
  }
};

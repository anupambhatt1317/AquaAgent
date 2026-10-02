# AquaAgent 2.0
## AI-Powered Smart Water Distribution & Conservation System
### Prototype Architecture & Implementation (Aligned with Final PPT Specifications)

---

## 1. Project Overview
**AquaAgent 2.0** is an AI-powered smart water distribution and conservation platform designed to monitor hydraulic telemetry, detect pipeline anomalies (such as ruptures, abnormal pressure surges, and reservoir depletion), and deliver prioritized, actionable decision support for operators in real time.

> [!NOTE]
> **Prototype Scope Notice:** This implementation delivers the **Current Software Prototype** featuring the React + Vite dashboard, Python + FastAPI backend, AquaAgent anomaly detection logic, and SQLite database storage. Physical IoT hardware (ESP32 microcontrollers, physical flow/pressure sensors, motorized smart valves, GIS leak mapping) are scheduled for future deployment phases.

---

## 2. Architecture & Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + Vite + Tailwind CSS** | Professional Smart City control center dashboard with real-time KPI telemetry, Recharts historical analytics, alerts panel, and interactive testbench. |
| **Backend** | **Python 3.12 + FastAPI + Uvicorn** | REST API handling telemetry ingestion, anomaly analysis, SQLite persistence, and simulation controls. |
| **AI / Decision Layer** | **AquaAgent Anomaly Engine** | Multi-sensor cross-correlation rule heuristics that classify anomalies by severity (Normal, Low, Medium, High) and provide root-cause diagnoses & recommended actions. |
| **Database** | **SQLite (`aquaagent.db`)** | Stores `water_readings` and `alerts` tables with complete historical logging and statistics calculation. |
| **Telemetry Layer** | **Hydraulic Simulation Engine** | Realistic simulated sensor stream (Flow: 40–60 L/min, Pressure: 3.0–4.5 bar, Water Level: 60–85%) with natural noise and scenario injection. |

---

## 3. SQLite Database Schema

### Table: `water_readings`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `timestamp` (TEXT)
- `flow_rate` (REAL)
- `pressure` (REAL)
- `water_level` (REAL)
- `created_at` (TIMESTAMP)

### Table: `alerts`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `timestamp` (TEXT)
- `alert_type` (TEXT)
- `severity` (TEXT: `NORMAL`, `LOW`, `MEDIUM`, `HIGH`)
- `message` (TEXT - Diagnosis / possible cause)
- `recommended_action` (TEXT - Response advice)
- `status` (TEXT: `ACTIVE`, `RESOLVED`)
- `created_at` (TIMESTAMP)

---

## 4. FastAPI Backend Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/water-data` | Returns recent water readings from SQLite and current live reading |
| `POST` | `/water-data` | Ingests water monitoring data, analyzes via AquaAgent, and logs alert to SQLite if abnormal |
| `GET` | `/alerts` | Returns generated alerts from SQLite |
| `POST` | `/alerts/{alert_id}/resolve` | Marks an alert as resolved in SQLite |
| `POST` | `/analyze` | Direct AquaAgent decision-support analysis endpoint |
| `GET` | `/system-status` | Returns system overview (Total water monitored, current flow, pressure, level, status) |
| `GET` | `/statistics` | Returns aggregated metrics from SQLite (total water monitored, averages, peaks) |
| `GET` | `/events` | Returns recent monitoring events with timestamps |
| `POST` | `/simulation/normal` | Generates normal telemetry (Flow: ~48 L/min, Pressure: ~3.8 bar) |
| `POST` | `/simulation/leak` | Simulates high-flow pipe rupture (Flow: 95 L/min, Pressure: 2.0 bar) |
| `POST` | `/simulation/abnormal-pressure` | Simulates high-pressure surge (Flow: 20 L/min, Pressure: 5.6 bar) |
| `POST` | `/simulation/depletion` | Simulates low reservoir storage (Level: 22%) |
| `POST` | `/simulation/manual` | Dispatches custom manual sensor readings |
| `POST` | `/simulation/reset` | Resets state and baseline in SQLite |
| `POST` | `/simulation/toggle-stream` | Toggles live simulation stream on/off |

---

## 5. Decision Support Lifecycle

```
MONITOR ➔ DETECT ➔ ANALYZE ➔ PRIORITIZE ➔ ACT ➔ REPORT
```

1. **MONITOR**: Continuous ingestion of flow rate, pressure, and water level metrics.
2. **DETECT**: Real-time evaluation against operating thresholds (Flow: 40–60 L/min, Pressure: 3.0–4.5 bar, Level: 60–85%).
3. **ANALYZE**: Cross-sensor gradient correlation (e.g., flow spike + pressure collapse = pipe rupture).
4. **PRIORITIZE**: Severity classification (`HIGH`, `MEDIUM`, `LOW`, `NORMAL`).
5. **ACT**: Delivering precise operator recommendations (e.g., *"Inspect pipeline section for possible leakage and isolate suspect sector immediately"*).
6. **REPORT**: Persistent logging of telemetry and alert items in SQLite.

---

## 6. How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Run the Backend
```bash
cd C:\Users\Asus\Desktop\AquaAgent\backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: `http://127.0.0.1:8000/docs`

### Step 2: Run the Frontend
```bash
cd C:\Users\Asus\Desktop\AquaAgent\frontend
npm run dev
```
Dashboard will be available at: `http://localhost:5173`

---

## 7. Complete Demo Scenario Execution (Step-by-Step)

1. **STEP 1 (Normal State):** Click **[Generate Normal Data]**. Dashboard displays:
   - Status: `🟢 SYSTEM NORMAL`
   - Flow: `~48 L/min` (Normal: 40–60 L/min)
   - Pressure: `~3.8 bar` (Normal: 3.0–4.5 bar)
   - Water Level: `~75%`
2. **STEP 2 (Leak Injection):** Click **[Simulate Leak]** (Flow: 95 L/min, Pressure: 2.0 bar).
3. **STEP 3 (AquaAgent Analysis):** AquaAgent detects cross-sensor surge and pressure drop.
4. **STEP 4 (Alert Display):** Dashboard displays:
   - Status: `🔴 CRITICAL ANOMALY`
   - Severity: `HIGH`
   - Possible Cause: `Unusual flow-pressure pattern`
   - Recommended Response: `Inspect pipeline section for possible leakage.`
5. **STEP 5 (SQLite Storage):** Alert and reading are automatically saved to SQLite tables (`water_readings` & `alerts`).
6. **STEP 6 (Dashboard & Charts Update):** Recharts graphs reflect the flow spike and pressure drop in real time.
7. **STEP 7 (Recovery):** Click **[Resolve]** or **[Generate Normal Data]**. Dashboard returns to:
   - Status: `🟢 SYSTEM NORMAL`

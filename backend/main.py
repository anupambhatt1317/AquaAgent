import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from datetime import datetime

import database as db
from agent.anomaly_detector import agent_engine
from simulation.engine import sim_engine
from models.schemas import (
    WaterReadingCreate,
    WaterReadingResponse,
    AnalyzeRequest,
    AnalyzeResponse,
    AlertItem,
    SystemStatusResponse,
    StatisticsResponse,
    ManualReadingRequest,
    ToggleStreamRequest
)

# Background loop for continuous simulated stream and SQLite logging
async def background_simulation_loop():
    while True:
        try:
            if sim_engine.is_streaming:
                sim_data = sim_engine.tick()
                analysis = agent_engine.analyze(
                    flow_rate=sim_data["flow_rate"],
                    pressure=sim_data["pressure"],
                    water_level=sim_data["water_level"]
                )
                db.insert_reading(
                    flow_rate=sim_data["flow_rate"],
                    pressure=sim_data["pressure"],
                    water_level=sim_data["water_level"],
                    timestamp=sim_data["timestamp"]
                )
                if analysis["is_anomaly"]:
                    recent_alerts = db.get_alerts(limit=1, status_filter="ACTIVE")
                    if not recent_alerts or recent_alerts[0]["alert_type"] != analysis["alert_type"]:
                        db.insert_alert(
                            alert_type=analysis["alert_type"],
                            severity=analysis["severity"],
                            message=analysis["possible_cause"],
                            recommended_action=analysis["recommended_action"],
                            status="ACTIVE",
                            timestamp=sim_data["timestamp"]
                        )
                        sim_engine.add_event(
                            event_name=f"ALERT_{analysis['severity']}",
                            severity=analysis["severity"],
                            details=f"{analysis['alert_type']}: {analysis['possible_cause']}"
                        )
        except Exception as e:
            print(f"Error in background simulation loop: {e}")
            
        await asyncio.sleep(2.0)

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    task = asyncio.create_task(background_simulation_loop())
    yield
    task.cancel()

app = FastAPI(
    title="AquaAgent 2.0 API",
    description="AI-Powered Smart Water Distribution & Conservation System (Prototype Backend)",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- 1. WATER DATA ENDPOINTS ----------------- #

@app.get("/water-data")
@app.get("/api/water-data")
def get_water_data(limit: int = Query(30, ge=1, le=100)):
    readings = db.get_readings(limit=limit)
    current_reading = {
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "flow_rate": sim_engine.flow_rate,
        "pressure": sim_engine.pressure,
        "water_level": sim_engine.water_level,
        "normal_flow_range": [40.0, 60.0],
        "normal_pressure_range": [3.0, 4.5],
        "normal_level_range": [60.0, 85.0]
    }
    return {
        "current": current_reading,
        "history": readings,
        "count": len(readings)
    }

@app.post("/water-data")
@app.post("/api/water-data")
def ingest_water_data(reading: WaterReadingCreate):
    timestamp = reading.timestamp or datetime.now().strftime("%H:%M:%S")
    analysis = agent_engine.analyze(
        flow_rate=reading.flow_rate,
        pressure=reading.pressure,
        water_level=reading.water_level or 75.0
    )
    saved_reading = db.insert_reading(
        flow_rate=reading.flow_rate,
        pressure=reading.pressure,
        water_level=reading.water_level or 75.0,
        timestamp=timestamp
    )
    sim_engine.set_manual(
        flow=reading.flow_rate,
        pressure=reading.pressure,
        level=reading.water_level or 75.0
    )
    alert_record = None
    if analysis["is_anomaly"]:
        alert_record = db.insert_alert(
            alert_type=analysis["alert_type"],
            severity=analysis["severity"],
            message=analysis["possible_cause"],
            recommended_action=analysis["recommended_action"],
            status="ACTIVE",
            timestamp=timestamp
        )
        sim_engine.add_event(
            event_name=f"INGEST_ALERT_{analysis['severity']}",
            severity=analysis["severity"],
            details=f"{analysis['alert_type']}: {analysis['possible_cause']}"
        )
    else:
        sim_engine.add_event(
            event_name="NORMAL_INGEST",
            severity="NORMAL",
            details=f"Telemetry received within normal thresholds ({reading.flow_rate} L/min, {reading.pressure} bar)."
        )

    return {
        "reading": saved_reading,
        "analysis": analysis,
        "alert": alert_record,
        "status": analysis["status"]
    }

# ----------------- 2. ALERTS ENDPOINTS ----------------- #

@app.get("/alerts")
@app.get("/api/alerts")
def get_alerts(limit: int = Query(50, ge=1, le=200), status: Optional[str] = None):
    alerts = db.get_alerts(limit=limit, status_filter=status)
    return {
        "alerts": alerts,
        "total": len(alerts)
    }

@app.post("/alerts/{alert_id}/resolve")
@app.post("/api/alerts/{alert_id}/resolve")
def resolve_alert_endpoint(alert_id: int):
    success = db.resolve_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    sim_engine.add_event("ALERT_RESOLVED", "NORMAL", f"Alert #{alert_id} resolved by operator.")
    return {"status": "ok", "alert_id": alert_id, "resolved": True}

# ----------------- 3. ANOMALY DETECTION / ANALYZE ----------------- #

@app.post("/analyze", response_model=AnalyzeResponse)
@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_telemetry(req: AnalyzeRequest):
    result = agent_engine.analyze(
        flow_rate=req.flow_rate,
        pressure=req.pressure,
        water_level=req.water_level or 75.0
    )
    return result

# ----------------- 4. SYSTEM STATUS OVERVIEW ----------------- #

@app.get("/system-status", response_model=SystemStatusResponse)
@app.get("/api/system-status", response_model=SystemStatusResponse)
@app.get("/api/system/status", response_model=SystemStatusResponse)
def get_system_status():
    analysis = agent_engine.analyze(
        flow_rate=sim_engine.flow_rate,
        pressure=sim_engine.pressure,
        water_level=sim_engine.water_level
    )
    stats = db.get_statistics()
    return {
        "app_name": "AquaAgent 2.0",
        "subtitle": "AI-Powered Smart Water Distribution & Conservation System",
        "status": analysis["status"],
        "total_water_monitored": round(sim_engine.total_water_monitored, 1),
        "current_flow_rate": round(sim_engine.flow_rate, 1),
        "current_pressure": round(sim_engine.pressure, 2),
        "current_water_level": round(sim_engine.water_level, 1),
        "water_usage": round(sim_engine.water_usage_today, 1),
        "active_alerts_count": stats["active_alerts_count"],
        "system_mode": sim_engine.mode,
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "decision_stage": analysis["decision_stage"],
        "possible_cause": analysis["possible_cause"],
        "recommended_action": analysis["recommended_action"],
        "is_streaming": sim_engine.is_streaming
    }

# ----------------- 5. STATISTICS & METRICS ----------------- #

@app.get("/statistics", response_model=StatisticsResponse)
@app.get("/api/statistics", response_model=StatisticsResponse)
def get_statistics_endpoint():
    stats = db.get_statistics()
    return stats

# ----------------- 6. RECENT EVENTS FEED ----------------- #

@app.get("/events")
@app.get("/api/events")
def get_events():
    return {
        "events": sim_engine.events
    }

# ----------------- 7. DEMONSTRATION & SIMULATION CONTROLS ----------------- #

@app.post("/simulation/normal")
@app.post("/api/simulation/normal")
def set_normal():
    sim_engine.set_normal()
    return {"status": "ok", "mode": "NORMAL", "message": "Normal baseline data activated (Flow: ~48 L/min, Pressure: ~3.8 bar)."}

@app.post("/simulation/leak")
@app.post("/api/simulation/leak")
def simulate_leak():
    sim_engine.simulate_leak(flow=95.0, pressure=2.0, level=65.0)
    analysis = agent_engine.analyze(95.0, 2.0, 65.0)
    db.insert_reading(95.0, 2.0, 65.0)
    alert = db.insert_alert(
        alert_type=analysis["alert_type"],
        severity=analysis["severity"],
        message=analysis["possible_cause"],
        recommended_action=analysis["recommended_action"],
        status="ACTIVE"
    )
    return {
        "status": "ok",
        "mode": "LEAK",
        "flow_rate": 95.0,
        "pressure": 2.0,
        "alert": alert,
        "analysis": analysis
    }

@app.post("/simulation/abnormal-pressure")
@app.post("/api/simulation/abnormal-pressure")
def simulate_abnormal_pressure():
    sim_engine.simulate_abnormal_pressure(flow=20.0, pressure=5.6, level=75.0)
    analysis = agent_engine.analyze(20.0, 5.6, 75.0)
    db.insert_reading(20.0, 5.6, 75.0)
    alert = db.insert_alert(
        alert_type=analysis["alert_type"],
        severity=analysis["severity"],
        message=analysis["possible_cause"],
        recommended_action=analysis["recommended_action"],
        status="ACTIVE"
    )
    return {
        "status": "ok",
        "mode": "ABNORMAL_PRESSURE",
        "flow_rate": 20.0,
        "pressure": 5.6,
        "alert": alert,
        "analysis": analysis
    }

@app.post("/simulation/depletion")
@app.post("/api/simulation/depletion")
def simulate_depletion():
    sim_engine.simulate_depletion(flow=45.0, pressure=3.4, level=22.0)
    analysis = agent_engine.analyze(45.0, 3.4, 22.0)
    db.insert_reading(45.0, 3.4, 22.0)
    alert = db.insert_alert(
        alert_type=analysis["alert_type"],
        severity=analysis["severity"],
        message=analysis["possible_cause"],
        recommended_action=analysis["recommended_action"],
        status="ACTIVE"
    )
    return {
        "status": "ok",
        "mode": "DEPLETION",
        "water_level": 22.0,
        "alert": alert,
        "analysis": analysis
    }

@app.post("/simulation/manual")
@app.post("/api/simulation/manual")
def simulate_manual(req: ManualReadingRequest):
    sim_engine.set_manual(flow=req.flow_rate, pressure=req.pressure, level=req.water_level)
    analysis = agent_engine.analyze(req.flow_rate, req.pressure, req.water_level)
    db.insert_reading(req.flow_rate, req.pressure, req.water_level)
    alert = None
    if analysis["is_anomaly"]:
        alert = db.insert_alert(
            alert_type=analysis["alert_type"],
            severity=analysis["severity"],
            message=analysis["possible_cause"],
            recommended_action=analysis["recommended_action"],
            status="ACTIVE"
        )
    return {
        "status": "ok",
        "mode": "MANUAL",
        "reading": {"flow_rate": req.flow_rate, "pressure": req.pressure, "water_level": req.water_level},
        "analysis": analysis,
        "alert": alert
    }

@app.post("/simulation/reset")
@app.post("/api/simulation/reset")
def reset_all():
    sim_engine.reset()
    db.clear_data()
    return {"status": "ok", "mode": "NORMAL", "message": "System and telemetry reset to baseline."}

@app.post("/simulation/toggle-stream")
@app.post("/api/simulation/toggle-stream")
def toggle_stream(req: ToggleStreamRequest):
    sim_engine.is_streaming = req.enabled
    return {"is_streaming": sim_engine.is_streaming}

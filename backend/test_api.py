import os
import database as db
from agent.anomaly_detector import agent_engine
from simulation.engine import sim_engine
from models.schemas import WaterReadingCreate, AnalyzeRequest

def run_tests():
    print("=== 1. Initializing SQLite Database Schema on Desktop ===")
    db.init_db()
    readings = db.get_readings(limit=10)
    print(f"SQLite water_readings count on init: {len(readings)}")
    assert len(readings) > 0, "Expected baseline readings in SQLite"

    print("\n=== 2. Testing AquaAgent Anomaly Detection Logic ===")
    normal_res = agent_engine.analyze(flow_rate=48.0, pressure=3.8, water_level=75.0)
    print("Normal Evaluation:", normal_res["status"], "| Anomaly:", normal_res["is_anomaly"])
    assert normal_res["is_anomaly"] is False
    assert normal_res["status"] == "NORMAL"
    assert normal_res["severity"] == "NORMAL"

    leak_res = agent_engine.analyze(flow_rate=95.0, pressure=2.0, water_level=65.0)
    print("Leak Evaluation:", leak_res["status"], "| Severity:", leak_res["severity"])
    print("Possible Cause:", leak_res["possible_cause"])
    print("Recommended Action:", leak_res["recommended_action"])
    assert leak_res["is_anomaly"] is True
    assert leak_res["status"] == "CRITICAL"
    assert leak_res["severity"] == "HIGH"
    assert leak_res["alert_type"] == "PIPE_RUPTURE_LEAK"

    surge_res = agent_engine.analyze(flow_rate=20.0, pressure=5.6, water_level=75.0)
    print("Pressure Surge Evaluation:", surge_res["status"], "| Severity:", surge_res["severity"])
    assert surge_res["is_anomaly"] is True
    assert surge_res["status"] == "CRITICAL"
    assert surge_res["alert_type"] == "PRESSURE_SURGE_BLOCKAGE"

    depletion_res = agent_engine.analyze(flow_rate=45.0, pressure=3.5, water_level=22.0)
    print("Depletion Evaluation:", depletion_res["status"], "| Severity:", depletion_res["severity"])
    assert depletion_res["is_anomaly"] is True
    assert depletion_res["severity"] == "MEDIUM"

    print("\n=== 3. Testing SQLite Storage & Alert Generation ===")
    rec = db.insert_reading(flow_rate=95.0, pressure=2.0, water_level=65.0)
    print("Inserted reading:", rec)
    assert rec["id"] is not None

    alert = db.insert_alert(
        alert_type=leak_res["alert_type"],
        severity=leak_res["severity"],
        message=leak_res["possible_cause"],
        recommended_action=leak_res["recommended_action"],
        status="ACTIVE"
    )
    print("Inserted alert in SQLite:", alert)
    assert alert["id"] is not None

    alerts_list = db.get_alerts(limit=10)
    print(f"Total alerts in SQLite: {len(alerts_list)}")
    assert len(alerts_list) > 0

    resolve_success = db.resolve_alert(alert["id"])
    print(f"Alert {alert['id']} resolved: {resolve_success}")
    assert resolve_success is True

    print("\n=== 4. Testing Aggregated Statistics Calculation ===")
    stats = db.get_statistics()
    print("Aggregated Statistics from SQLite:")
    for k, v in stats.items():
        print(f"  - {k}: {v}")
    assert stats["total_samples"] >= len(readings)

    print("\n=== 5. Testing Simulation Engine State Transitions ===")
    sim_engine.simulate_leak(95.0, 2.0, 65.0)
    assert sim_engine.mode == "LEAK"
    assert sim_engine.target_flow == 95.0
    assert sim_engine.target_pressure == 2.0

    sim_engine.set_normal()
    assert sim_engine.mode == "NORMAL"

    print("\n=======================================================")
    print(">>> ALL END-TO-END AQUAAGENT 2.0 TESTS PASSED (100%) <<<")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()

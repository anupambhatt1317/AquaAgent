import random
import time
from datetime import datetime
from typing import Dict, Any, List

class HydraulicSimulation:
    def __init__(self):
        self.reset()

    def reset(self):
        self.mode = "NORMAL" # NORMAL, LEAK, ABNORMAL_PRESSURE, DEPLETION, MANUAL
        self.flow_rate = 48.0
        self.pressure = 3.80
        self.water_level = 75.0
        self.target_flow = 48.0
        self.target_pressure = 3.80
        self.target_level = 75.0
        self.total_water_monitored = 125400.0 # Liters
        self.water_usage_today = 34200.0 # Liters
        self.is_streaming = True
        self.last_tick_time = time.time()
        self.events: List[Dict[str, Any]] = [
            {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "event": "SYSTEM_INITIALIZED",
                "severity": "NORMAL",
                "details": "AquaAgent 2.0 Hydraulic Telemetry Stream Active (Prototype Mode)."
            }
        ]

    def add_event(self, event_name: str, severity: str, details: str):
        entry = {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "event": event_name,
            "severity": severity,
            "details": details
        }
        self.events.insert(0, entry)
        if len(self.events) > 50:
            self.events.pop()

    def set_normal(self):
        self.mode = "NORMAL"
        self.target_flow = 48.0
        self.target_pressure = 3.80
        self.target_level = 75.0
        self.flow_rate = 48.0
        self.pressure = 3.80
        self.add_event("NORMAL_DATA_GENERATED", "NORMAL", "Hydraulic baseline restored: Flow ~48 L/min, Pressure ~3.8 bar, Water Level ~75%.")

    def simulate_leak(self, flow: float = 95.0, pressure: float = 2.0, level: float = 65.0):
        self.mode = "LEAK"
        self.target_flow = flow
        self.target_pressure = pressure
        self.target_level = level
        self.flow_rate = flow
        self.pressure = pressure
        self.add_event("LEAK_SIMULATION_TRIGGERED", "HIGH", f"High-flow pipe rupture injected (Flow: {flow} L/min, Pressure: {pressure} bar).")

    def simulate_abnormal_pressure(self, flow: float = 20.0, pressure: float = 5.6, level: float = 75.0):
        self.mode = "ABNORMAL_PRESSURE"
        self.target_flow = flow
        self.target_pressure = pressure
        self.target_level = level
        self.flow_rate = flow
        self.pressure = pressure
        self.add_event("PRESSURE_SURGE_SIMULATED", "HIGH", f"Pressure surge & blockage injected (Flow: {flow} L/min, Pressure: {pressure} bar).")

    def simulate_depletion(self, flow: float = 45.0, pressure: float = 3.4, level: float = 22.0):
        self.mode = "DEPLETION"
        self.target_flow = flow
        self.target_pressure = pressure
        self.target_level = level
        self.water_level = level
        self.add_event("RESERVOIR_DEPLETION_SIMULATED", "MEDIUM", f"Low storage level injected (Water Level: {level}%).")

    def set_manual(self, flow: float, pressure: float, level: float):
        self.mode = "MANUAL"
        self.target_flow = float(flow)
        self.target_pressure = float(pressure)
        self.target_level = float(level)
        self.flow_rate = float(flow)
        self.pressure = float(pressure)
        self.water_level = float(level)
        self.add_event("MANUAL_TELEMETRY_INJECTED", "INFO", f"Manual reading dispatched: Flow={flow} L/min, Pressure={pressure} bar, Level={level}%.")

    def tick(self) -> Dict[str, Any]:
        """Advance physics with realistic sensor noise and inertia."""
        now = time.time()
        dt = min(3.0, now - self.last_tick_time)
        self.last_tick_time = now

        alpha = 0.45
        
        jitter_flow = random.uniform(-0.5, 0.5)
        jitter_pressure = random.uniform(-0.03, 0.03)
        jitter_level = random.uniform(-0.1, 0.1)

        self.flow_rate = round(self.flow_rate + alpha * (self.target_flow - self.flow_rate) + jitter_flow, 1)
        self.pressure = round(self.pressure + alpha * (self.target_pressure - self.pressure) + jitter_pressure, 2)
        self.water_level = round(max(0.0, min(100.0, self.water_level + (self.target_level - self.water_level) * 0.3 + jitter_level)), 1)
        
        liters_increment = (self.flow_rate / 60.0) * max(0.5, dt)
        self.total_water_monitored += liters_increment
        self.water_usage_today += liters_increment

        return {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "flow_rate": self.flow_rate,
            "pressure": self.pressure,
            "water_level": self.water_level,
            "mode": self.mode
        }

sim_engine = HydraulicSimulation()

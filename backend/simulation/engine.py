import random
import time
from datetime import datetime
from typing import Dict, Any, List

class HydraulicSimulation:
    def __init__(self):
        self.reset()

    def reset(self):
        self.mode = "NORMAL" # NORMAL, LEAK, ABNORMAL_PRESSURE, DEPLETION, MANUAL, CONTAINED
        self.total_water_monitored = 125480.0 # Liters
        self.water_usage_today = 34200.0 # Liters
        self.water_saved_liters = 1450.0
        self.is_streaming = True
        self.sim_speed = 1.0 # 1.0x, 2.0x, 5.0x
        self.last_tick_time = time.time()
        
        # Reservoir metrics
        self.reservoir_level = 75.0 # %
        self.reservoir_capacity = 125480.0 # Liters
        self.target_reservoir_level = 75.0
        
        # Main line metrics
        self.flow_rate = 48.0 # L/min
        self.pressure = 3.80 # bar
        self.target_flow = 48.0
        self.target_pressure = 3.80
        
        # Leak & Threat containment flags
        self.leak_active = False
        self.leak_zone = "Zone B"
        self.leak_isolated = False
        self.threat_contained = False
        self.leak_start_time = None
        self.leak_loss_liters = 0.0
        self.estimated_leak_rate = 0.0

        # Smart Valves (V1, V2, V3, V4)
        self.valves: Dict[str, Dict[str, Any]] = {
            "V1": {
                "id": "V1",
                "name": "Main Feeder Inlet Valve",
                "zone": "Main Pipeline",
                "status": "OPEN", # OPEN, CLOSED, AUTO
                "mode": "AUTO",
                "health": 100,
                "flow": 48.0,
                "pressure": 3.80
            },
            "V2": {
                "id": "V2",
                "name": "Zone A Distribution Valve",
                "zone": "Zone A",
                "status": "OPEN",
                "mode": "AUTO",
                "health": 100,
                "flow": 16.0,
                "pressure": 3.70
            },
            "V3": {
                "id": "V3",
                "name": "Zone B Isolation Valve",
                "zone": "Zone B",
                "status": "OPEN",
                "mode": "AUTO",
                "health": 100,
                "flow": 15.0,
                "pressure": 3.80
            },
            "V4": {
                "id": "V4",
                "name": "Zone C Industrial Valve",
                "zone": "Zone C",
                "status": "OPEN",
                "mode": "AUTO",
                "health": 100,
                "flow": 17.0,
                "pressure": 3.90
            }
        }

        # Network Zones (Zone A, Zone B, Zone C)
        self.zones: Dict[str, Dict[str, Any]] = {
            "Zone A": {
                "id": "Zone A",
                "name": "Zone A - Commercial Hub",
                "users": "1,420 Units (Civic & Retail)",
                "status": "NORMAL",
                "flow": 16.0,
                "pressure": 3.70,
                "valve": "V2"
            },
            "Zone B": {
                "id": "Zone B",
                "name": "Zone B - High-Density Residential",
                "users": "3,850 Units (Residential Towers)",
                "status": "NORMAL",
                "flow": 15.0,
                "pressure": 3.80,
                "valve": "V3"
            },
            "Zone C": {
                "id": "Zone C",
                "name": "Zone C - Industrial Sector",
                "users": "840 Units (Manufacturing & Tech)",
                "status": "NORMAL",
                "flow": 17.0,
                "pressure": 3.90,
                "valve": "V4"
            }
        }

        # Event stream
        self.events: List[Dict[str, Any]] = [
            {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "event": "SYSTEM_INITIALIZED",
                "severity": "NORMAL",
                "details": "AquaAgent 2.0 AI Digital Twin & Telemetry Stream Initialized (Prototype Mode)."
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
        if len(self.events) > 60:
            self.events.pop()

    def set_normal(self):
        self.mode = "NORMAL"
        self.leak_active = False
        self.leak_isolated = False
        self.threat_contained = False
        self.leak_start_time = None
        self.estimated_leak_rate = 0.0
        self.target_reservoir_level = 75.0
        self.target_flow = 48.0
        self.target_pressure = 3.80
        self.flow_rate = 48.0
        self.pressure = 3.80
        self.reservoir_level = 75.0
        
        # Reset valves to OPEN / AUTO
        for v in self.valves.values():
            v["status"] = "OPEN"
            v["mode"] = "AUTO"
            
        self.zones["Zone A"]["status"] = "NORMAL"
        self.zones["Zone B"]["status"] = "NORMAL"
        self.zones["Zone C"]["status"] = "NORMAL"
        
        self.add_event("NORMAL_DATA_GENERATED", "NORMAL", "Hydraulic baseline restored: Flow ~48 L/min, Pressure ~3.8 bar, Water Level ~75%.")

    def simulate_leak_step(self, step: int):
        """Simulates gradual developing anomaly in Zone B (steps 1 to 4)."""
        self.mode = "LEAK"
        self.leak_active = True
        self.leak_zone = "Zone B"
        self.leak_isolated = False
        self.threat_contained = False
        if not self.leak_start_time:
            self.leak_start_time = time.time()
            self.leak_loss_liters = 0.0

        if step == 1:
            self.target_flow = 58.0
            self.target_pressure = 3.40
            self.estimated_leak_rate = 10.0
            self.zones["Zone B"]["status"] = "WARNING"
            self.add_event("MICRO_LEAK_DEVELOPING", "MEDIUM", "Zone B: Flow anomaly developing (Flow: 58 L/min, Pressure: 3.4 bar).")
        elif step == 2:
            self.target_flow = 72.0
            self.target_pressure = 2.90
            self.estimated_leak_rate = 24.0
            self.zones["Zone B"]["status"] = "WARNING"
            self.add_event("PRESSURE_DEGRADATION", "HIGH", "Zone B: Pressure dropping, flow accelerating (Flow: 72 L/min, Pressure: 2.9 bar).")
        elif step == 3:
            self.target_flow = 86.0
            self.target_pressure = 2.40
            self.estimated_leak_rate = 38.0
            self.zones["Zone B"]["status"] = "CRITICAL"
            self.add_event("BURST_PROPAGATING", "HIGH", "Zone B: Pipe rupture widening. Flow: 86 L/min, Pressure: 2.4 bar.")
        else: # step >= 4
            self.target_flow = 95.0
            self.target_pressure = 2.00
            self.estimated_leak_rate = 47.0
            self.zones["Zone B"]["status"] = "CRITICAL"
            self.add_event("LEAK_SIMULATION_TRIGGERED", "HIGH", "High-flow pipe rupture fully active in Zone B (Flow: 95 L/min, Pressure: 2.0 bar).")
            self.add_event("ANOMALY_CLASSIFIED", "HIGH", "AquaAgent classified CRITICAL anomaly. Isolation of Valve V3 recommended.")

    def simulate_leak(self, flow: float = 95.0, pressure: float = 2.0, level: float = 65.0):
        self.mode = "LEAK"
        self.leak_active = True
        self.leak_zone = "Zone B"
        self.leak_isolated = False
        self.threat_contained = False
        self.leak_start_time = time.time()
        self.estimated_leak_rate = 47.0
        self.target_flow = flow
        self.target_pressure = pressure
        self.target_reservoir_level = level
        self.flow_rate = flow
        self.pressure = pressure
        
        self.zones["Zone B"]["status"] = "CRITICAL"
        self.add_event("LEAK_SIMULATION_TRIGGERED", "HIGH", f"High-flow pipe rupture injected in Zone B (Flow: {flow} L/min, Pressure: {pressure} bar).")
        self.add_event("ANOMALY_CLASSIFIED", "HIGH", "AquaAgent identified unusual flow-pressure pattern. Recommending isolation of Valve V3.")

    def simulate_abnormal_pressure(self, flow: float = 20.0, pressure: float = 5.6, level: float = 75.0):
        self.mode = "ABNORMAL_PRESSURE"
        self.leak_active = False
        self.leak_isolated = False
        self.threat_contained = False
        self.leak_start_time = None
        self.estimated_leak_rate = 0.0
        self.target_flow = flow
        self.target_pressure = pressure
        self.target_reservoir_level = level
        self.flow_rate = flow
        self.pressure = pressure
        self.zones["Zone B"]["status"] = "WARNING"
        self.add_event("PRESSURE_SURGE_SIMULATED", "HIGH", f"Pressure surge & blockage injected (Flow: {flow} L/min, Pressure: {pressure} bar).")

    def simulate_depletion(self, flow: float = 45.0, pressure: float = 3.4, level: float = 22.0):
        self.mode = "DEPLETION"
        self.leak_active = False
        self.leak_isolated = False
        self.threat_contained = False
        self.leak_start_time = None
        self.estimated_leak_rate = 0.0
        self.target_flow = flow
        self.target_pressure = pressure
        self.target_reservoir_level = level
        self.reservoir_level = level
        self.add_event("RESERVOIR_DEPLETION_SIMULATED", "MEDIUM", f"Low storage level injected (Reservoir Level: {level}%).")

    def set_manual(self, flow: float, pressure: float, level: float):
        self.mode = "MANUAL"
        self.target_flow = float(flow)
        self.target_pressure = float(pressure)
        self.target_reservoir_level = float(level)
        self.flow_rate = float(flow)
        self.pressure = float(pressure)
        self.reservoir_level = float(level)
        self.add_event("MANUAL_TELEMETRY_INJECTED", "INFO", f"Manual reading dispatched: Flow={flow} L/min, Pressure={pressure} bar, Level={level}%.")

    def command_valve(self, valve_id: str, action: str) -> Dict[str, Any]:
        """
        Executes a valve action: OPEN, CLOSED, AUTO.
        Handles dynamic closed-loop isolation physics.
        """
        if valve_id not in self.valves:
            return {"success": False, "message": f"Valve {valve_id} not found"}
        
        valve = self.valves[valve_id]
        valve["status"] = action
        if action in ["OPEN", "CLOSED"]:
            valve["mode"] = "MANUAL"
        elif action == "AUTO":
            valve["mode"] = "AUTO"
            valve["status"] = "OPEN"

        # Action logic for Zone B Isolation (V3)
        if valve_id == "V3":
            if valve["status"] == "CLOSED":
                self.zones["Zone B"]["status"] = "ISOLATED"
                if self.leak_active:
                    self.leak_isolated = True
                    self.threat_contained = True
                    self.estimated_leak_rate = 0.0
                    self.target_flow = 33.0 # Flow drops because Zone B is closed
                    self.target_pressure = 3.82 # Network pressure stabilizes!
                    self.water_saved_liters += 350.0
                    self.add_event("VALVE_V3_CLOSED", "SUCCESS", "Valve V3 set to CLOSED. Zone B successfully isolated.")
                    self.add_event("THREAT_CONTAINED", "SUCCESS", "Leakage contained! Water loss stopped and pressure restored.")
                else:
                    self.add_event("VALVE_V3_CLOSED", "INFO", "Valve V3 closed manually. Zone B offline.")
            elif valve["status"] == "OPEN":
                if self.leak_active:
                    self.leak_isolated = False
                    self.threat_contained = False
                    self.estimated_leak_rate = 47.0
                    self.zones["Zone B"]["status"] = "CRITICAL"
                    self.target_flow = 95.0
                    self.target_pressure = 2.0
                    self.add_event("VALVE_V3_OPENED", "HIGH", "Valve V3 re-opened. Active leak in Zone B resumed.")
                else:
                    self.zones["Zone B"]["status"] = "NORMAL"
                    self.add_event("VALVE_V3_OPENED", "NORMAL", "Valve V3 opened. Zone B online.")

        # Action logic for Main Inflow Valve (V1)
        elif valve_id == "V1":
            if valve["status"] == "CLOSED":
                self.target_flow = 0.0
                self.target_pressure = 0.0
                self.zones["Zone A"]["status"] = "OFFLINE"
                self.zones["Zone B"]["status"] = "OFFLINE"
                self.zones["Zone C"]["status"] = "OFFLINE"
                self.add_event("VALVE_V1_CLOSED", "WARNING", "Main Inflow Valve V1 CLOSED. Entire distribution network shutdown.")
            elif valve["status"] == "OPEN":
                self.target_flow = 48.0 if not self.leak_active else 95.0
                self.target_pressure = 3.80 if not self.leak_active else 2.0
                self.zones["Zone A"]["status"] = "NORMAL"
                self.zones["Zone B"]["status"] = "CRITICAL" if self.leak_active and not self.leak_isolated else "NORMAL"
                self.zones["Zone C"]["status"] = "NORMAL"
                self.add_event("VALVE_V1_OPENED", "NORMAL", "Main Inflow Valve V1 OPENED. Network feeder pressurized.")

        # Action logic for Zone A (V2) or Zone C (V4)
        elif valve_id == "V2":
            self.zones["Zone A"]["status"] = "ISOLATED" if valve["status"] == "CLOSED" else "NORMAL"
            self.add_event(f"VALVE_V2_{valve['status']}", "INFO", f"Valve V2 {valve['status']}.")
        elif valve_id == "V4":
            self.zones["Zone C"]["status"] = "ISOLATED" if valve["status"] == "CLOSED" else "NORMAL"
            self.add_event(f"VALVE_V4_{valve['status']}", "INFO", f"Valve V4 {valve['status']}.")

        return {
            "success": True,
            "valve_id": valve_id,
            "status": valve["status"],
            "mode": valve["mode"],
            "leak_isolated": self.leak_isolated,
            "threat_contained": self.threat_contained
        }

    def tick(self) -> Dict[str, Any]:
        """Advance physics with realistic sensor noise and inertia."""
        now = time.time()
        dt = min(3.0, now - self.last_tick_time) * self.sim_speed
        self.last_tick_time = now

        alpha = 0.45
        
        jitter_flow = random.uniform(-0.4, 0.4)
        jitter_pressure = random.uniform(-0.02, 0.02)
        jitter_level = random.uniform(-0.05, 0.05)

        self.flow_rate = round(max(0.0, self.flow_rate + alpha * (self.target_flow - self.flow_rate) + jitter_flow), 1)
        self.pressure = round(max(0.0, self.pressure + alpha * (self.target_pressure - self.pressure) + jitter_pressure), 2)
        self.reservoir_level = round(max(0.0, min(100.0, self.reservoir_level + (self.target_reservoir_level - self.reservoir_level) * 0.2 + jitter_level)), 1)
        
        # Calculate zone branch flows
        if self.valves["V1"]["status"] == "CLOSED":
            za_flow = zb_flow = zc_flow = 0.0
            za_pres = zb_pres = zc_pres = 0.0
        else:
            za_flow = round(16.0 + random.uniform(-0.3, 0.3), 1) if self.valves["V2"]["status"] != "CLOSED" else 0.0
            zc_flow = round(17.0 + random.uniform(-0.3, 0.3), 1) if self.valves["V4"]["status"] != "CLOSED" else 0.0
            
            if self.valves["V3"]["status"] == "CLOSED":
                zb_flow = 0.0
                zb_pres = 0.0
            elif self.leak_active and not self.leak_isolated:
                zb_flow = round(max(15.0, self.flow_rate - za_flow - zc_flow), 1)
                zb_pres = round(self.pressure * 0.9, 2)
            else:
                zb_flow = round(15.0 + random.uniform(-0.3, 0.3), 1)
                zb_pres = self.pressure
                
            za_pres = self.pressure
            zc_pres = self.pressure

        self.zones["Zone A"]["flow"] = za_flow
        self.zones["Zone A"]["pressure"] = za_pres
        self.zones["Zone B"]["flow"] = zb_flow
        self.zones["Zone B"]["pressure"] = zb_pres
        self.zones["Zone C"]["flow"] = zc_flow
        self.zones["Zone C"]["pressure"] = zc_pres
        
        self.valves["V1"]["flow"] = self.flow_rate
        self.valves["V1"]["pressure"] = self.pressure
        self.valves["V2"]["flow"] = za_flow
        self.valves["V2"]["pressure"] = za_pres
        self.valves["V3"]["flow"] = zb_flow
        self.valves["V3"]["pressure"] = zb_pres
        self.valves["V4"]["flow"] = zc_flow
        self.valves["V4"]["pressure"] = zc_pres

        # Accumulate water volume
        liters_increment = (self.flow_rate / 60.0) * max(0.5, dt)
        self.total_water_monitored += liters_increment
        self.water_usage_today += liters_increment

        # Calculate leak loss duration & volume
        leak_duration_sec = 0.0
        if self.leak_active and self.leak_start_time:
            if not self.leak_isolated:
                leak_duration_sec = round(now - self.leak_start_time, 1)
                self.leak_loss_liters += round((self.estimated_leak_rate / 60.0) * max(0.5, dt), 2)
            else:
                leak_duration_sec = round(now - self.leak_start_time, 1)

        return {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "flow_rate": self.flow_rate,
            "pressure": self.pressure,
            "water_level": self.reservoir_level,
            "reservoir_capacity": self.reservoir_capacity,
            "valves": self.valves,
            "zones": self.zones,
            "leak_active": self.leak_active,
            "leak_zone": self.leak_zone,
            "leak_isolated": self.leak_isolated,
            "threat_contained": self.threat_contained,
            "leak_duration_sec": leak_duration_sec,
            "estimated_leak_rate": self.estimated_leak_rate if (self.leak_active and not self.leak_isolated) else 0.0,
            "leak_loss_liters": round(self.leak_loss_liters, 1),
            "water_saved_liters": round(self.water_saved_liters, 1),
            "mode": self.mode
        }

sim_engine = HydraulicSimulation()

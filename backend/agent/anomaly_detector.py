from typing import Dict, Any, Optional
from datetime import datetime

class AquaAgentDecisionEngine:
    """
    AquaAgent 2.0 Decision-Support & Anomaly Detection Layer.
    Implements rule-based hydraulic anomaly detection and prioritized decision support:
    MONITOR -> DETECT -> ANALYZE -> PRIORITIZE -> ACT -> REPORT
    """

    # Configurable operational baseline thresholds
    NORMAL_FLOW_MIN = 40.0
    NORMAL_FLOW_MAX = 60.0
    NORMAL_PRESSURE_MIN = 3.0
    NORMAL_PRESSURE_MAX = 4.5
    NORMAL_LEVEL_MIN = 60.0
    NORMAL_LEVEL_MAX = 85.0

    def analyze(self, flow_rate: float, pressure: float, water_level: float = 75.0) -> Dict[str, Any]:
        """
        Evaluates current flow, pressure, and water level against normal operating ranges.
        Returns anomaly classification, severity, root cause diagnosis, and prioritized recommendation.
        """
        anomalies_detected = []
        severity = "NORMAL"
        status = "NORMAL"
        alert_type = "NOMINAL_TELEMETRY"
        possible_cause = "All hydraulic metrics within nominal operating baseline."
        recommended_action = "Maintain continuous automated monitoring."
        confidence = 0.98
        decision_stage = "MONITOR"

        # Check for Critical Anomaly: High Flow + Low Pressure (Major Pipe Rupture / Leak)
        if flow_rate > 75.0 or (flow_rate > 60.0 and pressure < 2.9):
            severity = "HIGH"
            status = "CRITICAL"
            alert_type = "PIPE_RUPTURE_LEAK"
            possible_cause = "Unusual flow-pressure pattern"
            recommended_action = "Inspect pipeline section for possible leakage."
            anomalies_detected.append("SURGE_FLOW_WITH_PRESSURE_COLLAPSE")
            confidence = 0.96
            decision_stage = "PRIORITIZE"

        # Check for High Pressure / Blockage (Low Flow + High Pressure)
        elif pressure > 4.8 or (flow_rate < 30.0 and pressure > 4.2):
            severity = "HIGH"
            status = "CRITICAL"
            alert_type = "PRESSURE_SURGE_BLOCKAGE"
            possible_cause = "Abnormal pressure surge / downstream valve obstruction detected."
            recommended_action = "Check downstream control valves and open pressure relief bypass."
            anomalies_detected.append("HYDRAULIC_PRESSURE_OVERLOAD")
            confidence = 0.93
            decision_stage = "PRIORITIZE"

        # Check for Reservoir Depletion
        elif water_level < 30.0:
            severity = "MEDIUM"
            status = "WARNING"
            alert_type = "RESERVOIR_LOW_LEVEL"
            possible_cause = "Reservoir storage critically low / upstream supply interruption."
            recommended_action = "Switch to secondary auxiliary reservoir and throttle non-essential outflow."
            anomalies_detected.append("WATER_LEVEL_DEPLETION")
            confidence = 0.95
            decision_stage = "ANALYZE"

        # Check for Tank High Level / Overflow Risk
        elif water_level > 92.0:
            severity = "LOW"
            status = "WARNING"
            alert_type = "TANK_OVERFLOW_RISK"
            possible_cause = "Storage tank approaching maximum overflow threshold."
            recommended_action = "Throttle main inlet valve or divert overflow line to auxiliary storage."
            anomalies_detected.append("HIGH_WATER_LEVEL_WARNING")
            confidence = 0.92
            decision_stage = "ANALYZE"

        # Check for Moderate Flow or Pressure Deviation
        elif flow_rate > 60.0:
            severity = "MEDIUM"
            status = "WARNING"
            alert_type = "HIGH_FLOW_WARNING"
            possible_cause = "Flow rate exceeds upper normal threshold (40-60 L/min)."
            recommended_action = "Verify downstream consumption patterns and check for localized leaks."
            anomalies_detected.append("ELEVATED_FLOW_RATE")
            confidence = 0.88
            decision_stage = "DETECT"

        elif pressure < 2.9:
            severity = "MEDIUM"
            status = "WARNING"
            alert_type = "LOW_PRESSURE_WARNING"
            possible_cause = "Distribution line pressure below normal operating threshold (3.0-4.5 bar)."
            recommended_action = "Check booster pump output and inspect feeder manifold for pressure loss."
            anomalies_detected.append("DEPRESSED_PRESSURE")
            confidence = 0.89
            decision_stage = "DETECT"

        elif flow_rate < 38.0:
            severity = "LOW"
            status = "WARNING"
            alert_type = "LOW_FLOW_WARNING"
            possible_cause = "Flow rate below standard baseline demand."
            recommended_action = "Monitor supply intake and check for partial pipeline constriction."
            anomalies_detected.append("REDUCED_CONSUMPTION_FLOW")
            confidence = 0.85
            decision_stage = "DETECT"

        is_anomaly = (severity != "NORMAL")

        return {
            "is_anomaly": is_anomaly,
            "status": status,  # NORMAL, WARNING, CRITICAL
            "severity": severity,  # NORMAL, LOW, MEDIUM, HIGH
            "alert_type": alert_type,
            "possible_cause": possible_cause,
            "recommended_action": recommended_action,
            "confidence": confidence,
            "decision_stage": decision_stage if is_anomaly else "MONITOR",
            "anomalies": anomalies_detected,
            "evaluated_metrics": {
                "flow_rate": flow_rate,
                "flow_range": f"{self.NORMAL_FLOW_MIN} - {self.NORMAL_FLOW_MAX} L/min",
                "pressure": pressure,
                "pressure_range": f"{self.NORMAL_PRESSURE_MIN} - {self.NORMAL_PRESSURE_MAX} bar",
                "water_level": water_level,
                "water_level_range": f"{self.NORMAL_LEVEL_MIN} - {self.NORMAL_LEVEL_MAX} %"
            },
            "timestamp": datetime.now().strftime("%H:%M:%S")
        }

# Singleton instance
agent_engine = AquaAgentDecisionEngine()

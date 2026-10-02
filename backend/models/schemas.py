from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class WaterReadingCreate(BaseModel):
    flow_rate: float = Field(..., description="Flow rate in Liters per minute (L/min)")
    pressure: float = Field(..., description="Pipeline pressure in bar")
    water_level: Optional[float] = Field(75.0, description="Reservoir or tank water level in %")
    timestamp: Optional[str] = None

class WaterReadingResponse(BaseModel):
    id: int
    timestamp: str
    flow_rate: float
    pressure: float
    water_level: float

class AnalyzeRequest(BaseModel):
    flow_rate: float
    pressure: float
    water_level: Optional[float] = 75.0

class AnalyzeResponse(BaseModel):
    is_anomaly: bool
    status: str
    severity: str
    alert_type: str
    possible_cause: str
    recommended_action: str
    confidence: float
    decision_stage: str
    anomalies: List[str]
    evaluated_metrics: Dict[str, Any]
    timestamp: str

class AlertItem(BaseModel):
    id: int
    timestamp: str
    alert_type: str
    severity: str
    message: str
    recommended_action: str
    status: str

class SystemStatusResponse(BaseModel):
    app_name: str = "AquaAgent 2.0"
    subtitle: str = "AI-Powered Smart Water Distribution & Conservation System"
    status: str # NORMAL, WARNING, CRITICAL
    total_water_monitored: float
    current_flow_rate: float
    current_pressure: float
    current_water_level: float
    water_usage: float
    active_alerts_count: int
    system_mode: str
    timestamp: str
    decision_stage: str
    possible_cause: str
    recommended_action: str
    is_streaming: bool

class StatisticsResponse(BaseModel):
    total_water_monitored_liters: float
    total_samples: int
    avg_flow_rate: float
    peak_flow_rate: float
    min_flow_rate: float
    avg_pressure: float
    peak_pressure: float
    avg_water_level: float
    active_alerts_count: int
    total_alerts_count: int
    water_saved_estimated_liters: float
    efficiency_score: float

class ManualReadingRequest(BaseModel):
    flow_rate: float
    pressure: float
    water_level: float = 75.0

class ToggleStreamRequest(BaseModel):
    enabled: bool

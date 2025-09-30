from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from simulation.calculations import ImpactCalculator

app = FastAPI(title="Impactor-2025 API", version="1.0.0")

# CORS middleware - UPDATED to allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only - allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class ImpactRequest(BaseModel):
    diameter: float  # meters
    velocity: float  # km/s
    density: float   # kg/m³
    lat: Optional[float] = None
    lon: Optional[float] = None

class MitigationRequest(BaseModel):
    diameter: float
    velocity: float
    density: float
    delta_v: float  # velocity change in m/s
    time_before_impact: float  # days
    lat: float
    lon: float

@app.get("/")
def read_root():
    return {"message": "Impactor-2025 Simulation API", "status": "active"}

@app.post("/simulate")
def simulate_impact(impact: ImpactRequest):
    try:
        # Convert velocity from km/s to m/s for calculations
        velocity_ms = impact.velocity * 1000
        
        # Calculate kinetic energy
        kinetic_energy = ImpactCalculator.calculate_kinetic_energy(
            impact.diameter, velocity_ms, impact.density
        )
        
        # Calculate crater dimensions
        crater = ImpactCalculator.calculate_crater_size(kinetic_energy)
        
        # Calculate seismic magnitude
        magnitude = ImpactCalculator.calculate_seismic_magnitude(kinetic_energy)
        
        # Energy comparisons
        comparisons = ImpactCalculator.energy_comparisons(kinetic_energy)
        
        return {
            "kinetic_energy_joules": kinetic_energy,
            "kinetic_energy_megatons": kinetic_energy / (4.184e15),
            "crater_diameter_km": crater['diameter'] / 1000,
            "crater_depth_km": crater['depth'] / 1000,
            "crater_radius_km": crater['radius'] / 1000,
            "seismic_magnitude": magnitude,
            "comparisons": comparisons,
            "impact_location": {
                "lat": impact.lat,
                "lon": impact.lon
            } if impact.lat and impact.lon else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@app.post("/simulate-mitigation")
def simulate_mitigation(mitigation: MitigationRequest):
    try:
        # Simple orbital deflection calculation
        # Δx = Δv * (time_before_impact) * conversion_factor
        time_seconds = mitigation.time_before_impact * 24 * 3600  # Convert days to seconds
        
        # Simple linear approximation for deflection distance
        # In reality, this would require complex orbital mechanics
        deflection_distance_km = (mitigation.delta_v * time_seconds) / 1000  # km
        
        # Original impact point
        original_lat = mitigation.lat
        original_lon = mitigation.lon
        
        # Calculate new impact point (simplified - just offset)
        # In a real system, this would involve orbital mechanics
        new_lat = original_lat + (deflection_distance_km / 111) * 0.1  # Rough approximation
        new_lon = original_lon + (deflection_distance_km / 111) * 0.1
        
        # Check if deflection is sufficient to miss Earth
        earth_radius_km = 6371
        miss_distance_km = deflection_distance_km
        
        impact_avoided = miss_distance_km > 1000  # Arbitrary threshold
        
        return {
            "deflection_distance_km": deflection_distance_km,
            "miss_distance_km": miss_distance_km,
            "impact_avoided": impact_avoided,
            "original_impact": {"lat": original_lat, "lon": original_lon},
            "new_impact": {"lat": new_lat, "lon": new_lon} if not impact_avoided else None,
            "delta_v_applied": mitigation.delta_v,
            "time_before_impact_days": mitigation.time_before_impact
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mitigation calculation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
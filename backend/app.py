# backend/app.py
import os
import math
import requests
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from simulation.calculations import ImpactCalculator, run_simulation

# Load .env if present
load_dotenv()

NASA_API_KEY = os.getenv("NASA_API_KEY", "RKXMM4oRmVRK0efpUqkbcg38cf1fLMJaRDtKGgYJ")
NASA_NEO_BASE = "https://api.nasa.gov/neo/rest/v1"

app = FastAPI(title="Impactor-2025 API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
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

class ManualImpactInput(BaseModel):
    diameter: float
    velocity: float
    density: float = 3000.0
    angle: float = 45.0

class NasaAsteroid(BaseModel):
    id: str
    name: str
    diameter: float
    velocity: float
    miss_distance: float
    date: str

# --- Helper Functions ---
def simulate_impact_basic(diameter_m: float, velocity_ms: float, density_kgm3: float = 3000.0, angle_deg: float = 45.0):
    """
    Approximate impact calculator (fallback). Returns dict with mass, energy, crater, seismic magnitude.
    Note: approximate — replace with more robust model / Holsapple scaling for production.
    """
    # radius
    r = diameter_m / 2.0
    volume = (4.0/3.0) * math.pi * (r**3)               # m^3
    mass = volume * density_kgm3                        # kg

    # kinetic energy
    energy_joules = 0.5 * mass * (velocity_ms**2)       # J

    # convert to TNT equivalents
    # 1 megaton TNT = 4.184e15 J
    energy_megatons = energy_joules / 4.184e15

    # crude crater scaling (very approximate)
    # using a power-law from earlier examples — results are illustrative
    crater_diameter_km = 1.161 * (energy_joules ** (1.0/3.4)) / 1000.0
    crater_diameter_km = max(0.001, crater_diameter_km)

    # seismic magnitude approx (very rough)
    # magnitude = a * log10(E) + b ; constants chosen for demonstration
    if energy_joules > 0:
        magnitude = 0.67 * math.log10(energy_joules) - 5.87
    else:
        magnitude = 0.0

    # simple impact classification
    if diameter_m < 25:
        impact_type = "airburst / local"
    elif diameter_m < 100:
        impact_type = "regional"
    elif diameter_m < 1000:
        impact_type = "continental"
    else:
        impact_type = "global"

    return {
        "diameter_m": diameter_m,
        "density_kgm3": density_kgm3,
        "velocity_ms": velocity_ms,
        "mass_kg": mass,
        "energy_joules": energy_joules,
        "energy_megatons": energy_megatons,
        "crater_diameter_km": crater_diameter_km,
        "crater_radius_km": crater_diameter_km / 2.0,
        "seismic_magnitude": magnitude,
        "impact_type": impact_type,
        "notes": "Approximate model — for demonstration only"
    }

# --- Core Endpoints ---
@app.get("/")
def read_root():
    return {
        "message": "Impactor-2025 Simulation API with NASA Integration", 
        "status": "active",
        "version": "2.0.0",
        "data_sources": ["NASA NEO API", "Scientific Impact Models"]
    }

@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat() + "Z"}

@app.post("/simulate")
def simulate_impact(impact: ImpactRequest):
    """
    Main simulation endpoint using ImpactCalculator
    """
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
        
        # Calculate impact zones
        impact_zones = ImpactCalculator.calculate_impact_zones(
            crater['radius'] / 1000,  # Convert to km
            kinetic_energy / (4.184e15)  # Convert to megatons
        )
        
        return {
            "kinetic_energy_joules": kinetic_energy,
            "kinetic_energy_megatons": kinetic_energy / (4.184e15),
            "crater_diameter_km": crater['diameter'] / 1000,
            "crater_depth_km": crater['depth'] / 1000,
            "crater_radius_km": crater['radius'] / 1000,
            "seismic_magnitude": magnitude,
            "comparisons": comparisons,
            "impact_zones": impact_zones,
            "impact_location": {
                "lat": impact.lat,
                "lon": impact.lon
            } if impact.lat and impact.lon else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@app.post("/simulate-mitigation")
def simulate_mitigation(mitigation: MitigationRequest):
    """
    Mitigation/deflection simulation
    """
    try:
        # Simple orbital deflection calculation
        time_seconds = mitigation.time_before_impact * 24 * 3600
        
        deflection_distance_km = (mitigation.delta_v * time_seconds) / 1000
        
        original_lat = mitigation.lat
        original_lon = mitigation.lon
        
        # Calculate new impact point
        new_lat = original_lat + (deflection_distance_km / 111) * 0.1
        new_lon = original_lon + (deflection_distance_km / 111) * 0.1
        
        # Check if deflection is sufficient to miss Earth
        earth_radius_km = 6371
        miss_distance_km = deflection_distance_km
        
        impact_avoided = miss_distance_km > 1000
        
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

# --- NASA NEO Integration Endpoints ---
@app.get("/nasa-asteroids")
def get_nasa_asteroids():
    """
    Get list of near-Earth objects from NASA API - Enhanced version
    """
    try:
        # First try the enhanced version with date range
        url = f"{NASA_NEO_BASE}/feed"
        params = {
            'start_date': datetime.now().strftime('%Y-%m-%d'),
            'end_date': (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
            'api_key': NASA_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()

        neos = []
        for date, objs in data.get("near_earth_objects", {}).items():
            for obj in objs:
                # Get close approach data
                close_approach = obj.get("close_approach_data", [{}])[0]
                
                neos.append({
                    "id": obj["id"],
                    "name": obj["name"],
                    "diameter": obj["estimated_diameter"]["meters"]["estimated_diameter_max"],
                    "velocity": float(close_approach.get("relative_velocity", {}).get("kilometers_per_second", 20)),
                    "miss_distance": float(close_approach.get("miss_distance", {}).get("kilometers", 10000000)),
                    "date": close_approach.get("close_approach_date", ""),
                    "hazardous": obj.get("is_potentially_hazardous_asteroid", False)
                })

        return {"neos": neos, "source": "NASA NEO API"}
        
    except Exception as e:
        # Fallback to simple version if enhanced fails
        try:
            print(f"Enhanced NASA API failed, trying simple version: {e}")
            url = f"https://api.nasa.gov/neo/rest/v1/feed?api_key={NASA_API_KEY}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()

            asteroids = []
            for date in data["near_earth_objects"]:
                for asteroid in data["near_earth_objects"][date]:
                    asteroids.append({
                        "id": asteroid["id"],
                        "name": asteroid["name"],
                        "diameter_min": asteroid["estimated_diameter"]["meters"]["estimated_diameter_min"],
                        "diameter_max": asteroid["estimated_diameter"]["meters"]["estimated_diameter_max"],
                        "velocity": float(asteroid["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"]),
                        "miss_distance": float(asteroid["close_approach_data"][0]["miss_distance"]["kilometers"]),
                        "approach_date": asteroid["close_approach_data"][0]["close_approach_date_full"],
                        "hazardous": asteroid.get("is_potentially_hazardous_asteroid", False)
                    })

            return {"neos": asteroids, "source": "NASA NEO API (Simple)"}
        except Exception as fallback_error:
            # Return sample data if both API calls fail
            print(f"Both NASA API calls failed: {fallback_error}")
            return {
                "neos": [
                    {
                        "id": "2000433",
                        "name": "433 Eros (A898 PA)",
                        "diameter": 16800,
                        "velocity": 24.3,
                        "miss_distance": 26700000,
                        "date": "2024-01-15",
                        "hazardous": False
                    },
                    {
                        "id": "2001862", 
                        "name": "1862 Apollo (1932 HA)",
                        "diameter": 1500,
                        "velocity": 22.5,
                        "miss_distance": 4500000,
                        "date": "2024-02-20",
                        "hazardous": True
                    }
                ],
                "source": "Sample Data (API Unavailable)"
            }

@app.post("/simulate-impact-nasa")
def simulate_impact_nasa(asteroid: NasaAsteroid):
    """
    Simulate impact using NASA asteroid data
    """
    try:
        # Use the run_simulation function from calculations
        result = run_simulation(
            diameter=asteroid.diameter,
            velocity=asteroid.velocity,
            density=3000,
            lat=0,
            lon=0
        )

        return {
            "source": "NASA",
            "asteroid": asteroid.dict(),
            "simulation": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NASA simulation error: {str(e)}")

@app.get("/nasa-neo-feed")
def nasa_neo_feed(start_date: str = None, end_date: str = None):
    """
    Alternative NASA feed endpoint with date range
    """
    if not start_date:
        start = datetime.utcnow().date()
        start_date = start.isoformat()
    if not end_date:
        end = datetime.utcnow().date() + timedelta(days=1)
        end_date = end.isoformat()

    try:
        url = f"{NASA_NEO_BASE}/feed"
        params = {
            'start_date': start_date,
            'end_date': end_date,
            'api_key': NASA_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()

        # Parse and format NEO data
        neos = []
        neo_by_date = data.get("near_earth_objects", {})
        for date_str, objs in neo_by_date.items():
            for o in objs:
                cad = o.get("close_approach_data", [])
                cad0 = cad[0] if len(cad) > 0 else None
                diameter_max = o.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max")
                diameter_min = o.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_min")
                
                neos.append({
                    "id": o.get("id"),
                    "name": o.get("name"),
                    "nasa_jpl_url": o.get("nasa_jpl_url"),
                    "diameter_min_m": diameter_min,
                    "diameter_max_m": diameter_max,
                    "close_approach_date": cad0.get("close_approach_date") if cad0 else None,
                    "relative_velocity_km_s": float(cad0["relative_velocity"]["kilometers_per_second"]) if cad0 and "relative_velocity" in cad0 else None,
                    "miss_distance_km": float(cad0["miss_distance"]["kilometers"]) if cad0 and "miss_distance" in cad0 else None,
                    "hazardous": o.get("is_potentially_hazardous_asteroid", False)
                })
        
        # Sort by approach date
        neos_sorted = sorted(neos, key=lambda x: (x["close_approach_date"] or "9999-12-31"))
        return {
            "start_date": start_date,
            "end_date": end_date, 
            "count": len(neos_sorted),
            "neos": neos_sorted
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NASA feed fetch failed: {str(e)}")

@app.get("/simulate-impact-nasa/{asteroid_id}")
def simulate_impact_nasa_by_id(asteroid_id: str, density: float = 3000.0, angle: float = 45.0):
    """
    Fetch asteroid by NASA ID and run simulation
    """
    try:
        url = f"{NASA_NEO_BASE}/neo/{asteroid_id}"
        params = {'api_key': NASA_API_KEY}
        
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()

        # Extract diameter
        diameters = data.get("estimated_diameter", {}).get("meters", {})
        diameter_max = diameters.get("estimated_diameter_max")
        diameter_min = diameters.get("estimated_diameter_min")
        
        if diameter_max:
            diameter_m = diameter_max
        elif diameter_min:
            diameter_m = diameter_min
        else:
            raise HTTPException(status_code=400, detail="No diameter available in NASA record")

        # Get velocity from close approach data
        cad = data.get("close_approach_data", [])
        if len(cad) == 0:
            raise HTTPException(status_code=400, detail="No close-approach data available")

        cad0 = cad[0]
        try:
            velocity_km_s = float(cad0["relative_velocity"]["kilometers_per_second"])
        except Exception:
            velocity_km_s = 20.0  # Default fallback

        # Run simulation using ImpactCalculator
        velocity_ms = velocity_km_s * 1000.0
        
        kinetic_energy = ImpactCalculator.calculate_kinetic_energy(diameter_m, velocity_ms, density)
        crater = ImpactCalculator.calculate_crater_size(kinetic_energy)
        magnitude = ImpactCalculator.calculate_seismic_magnitude(kinetic_energy)
        comparisons = ImpactCalculator.energy_comparisons(kinetic_energy)
        impact_zones = ImpactCalculator.calculate_impact_zones(
            crater['radius'] / 1000,
            kinetic_energy / (4.184e15)
        )

        # Impact classification
        if diameter_m < 25:
            impact_type = "airburst / local"
        elif diameter_m < 100:
            impact_type = "regional"
        elif diameter_m < 1000:
            impact_type = "continental"
        else:
            impact_type = "global"

        result = {
            "diameter_m": diameter_m,
            "density_kgm3": density,
            "velocity_ms": velocity_ms,
            "mass_kg": (4.0/3.0) * math.pi * ((diameter_m/2.0)**3) * density,
            "energy_joules": kinetic_energy,
            "energy_megatons": kinetic_energy / (4.184e15),
            "crater_diameter_km": crater['diameter'] / 1000,
            "crater_radius_km": crater['radius'] / 1000,
            "seismic_magnitude": magnitude,
            "impact_type": impact_type,
            "comparisons": comparisons,
            "impact_zones": impact_zones
        }

        return {
            "asteroid": {
                "id": data.get("id"),
                "name": data.get("name"),
                "nasa_jpl_url": data.get("nasa_jpl_url"),
                "diameter_m_used": diameter_m,
                "close_approach_date": cad0.get("close_approach_date"),
                "miss_distance_km": float(cad0["miss_distance"]["kilometers"]) if "miss_distance" in cad0 else None,
                "velocity_km_s_used": velocity_km_s
            },
            "simulation": result,
            "source": "ImpactCalculator"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NASA asteroid simulation failed: {str(e)}")

@app.post("/simulate-impact")
def simulate_impact_manual(inp: ManualImpactInput):
    """
    Alternative simulation endpoint with angle parameter
    """
    try:
        velocity_ms = inp.velocity * 1000
        
        kinetic_energy = ImpactCalculator.calculate_kinetic_energy(
            inp.diameter, velocity_ms, inp.density
        )
        
        crater = ImpactCalculator.calculate_crater_size(kinetic_energy)
        magnitude = ImpactCalculator.calculate_seismic_magnitude(kinetic_energy)
        comparisons = ImpactCalculator.energy_comparisons(kinetic_energy)
        impact_zones = ImpactCalculator.calculate_impact_zones(
            crater['radius'] / 1000,
            kinetic_energy / (4.184e15)
        )

        # Impact classification
        if inp.diameter < 25:
            impact_type = "airburst / local"
        elif inp.diameter < 100:
            impact_type = "regional"
        elif inp.diameter < 1000:
            impact_type = "continental"
        else:
            impact_type = "global"

        result = {
            "diameter_m": inp.diameter,
            "density_kgm3": inp.density,
            "velocity_ms": velocity_ms,
            "mass_kg": (4.0/3.0) * math.pi * ((inp.diameter/2.0)**3) * inp.density,
            "energy_joules": kinetic_energy,
            "energy_megatons": kinetic_energy / (4.184e15),
            "crater_diameter_km": crater['diameter'] / 1000,
            "crater_radius_km": crater['radius'] / 1000,
            "seismic_magnitude": magnitude,
            "impact_type": impact_type,
            "comparisons": comparisons,
            "impact_zones": impact_zones,
            "notes": "Using ImpactCalculator model"
        }
        
        return {"input": inp.dict(), "result": result, "source": "ImpactCalculator"}
        
    except Exception as e:
        # Fallback to basic simulation
        result = simulate_impact_basic(inp.diameter, inp.velocity * 1000, inp.density, inp.angle)
        return {"input": inp.dict(), "result": result, "source": "basic_model_fallback"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
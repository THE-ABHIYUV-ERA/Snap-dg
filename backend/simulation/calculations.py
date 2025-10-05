import numpy as np

class ImpactCalculator:
    @staticmethod
    def calculate_kinetic_energy(diameter: float, velocity: float, density: float) -> float:
        """Calculate kinetic energy in joules"""
        radius = diameter / 2  # meters
        volume = (4/3) * np.pi * (radius ** 3)  # m³
        mass = density * volume  # kg
        kinetic_energy = 0.5 * mass * (velocity ** 2)  # joules
        return kinetic_energy

    @staticmethod
    def calculate_crater_size(kinetic_energy: float, target_density: float = 2500) -> dict:
        """Calculate crater dimensions using Pi-group scaling"""
        energy_kt = kinetic_energy / (4.184e12)  # Convert to kilotons of TNT
        
        # For simple craters (small impacts)
        diameter_m = 0.8 * (energy_kt ** 0.294) * 1000  # meters
        depth_m = diameter_m / 5  # Simple depth estimate
        
        return {
            'diameter': diameter_m,
            'depth': depth_m,
            'radius': diameter_m / 2
        }

    @staticmethod
    def calculate_seismic_magnitude(kinetic_energy: float) -> float:
        """Convert impact energy to seismic magnitude"""
        energy_joules = kinetic_energy
        if energy_joules <= 0:
            return 0
        
        magnitude = (2/3) * np.log10(energy_joules) - 5.87
        return round(magnitude, 1)

    @staticmethod
    def energy_comparisons(kinetic_energy: float) -> dict:
        """Compare impact energy to known events - ENHANCED VERSION"""
        hiroshima_bomb = 6.3e13  # joules (15 kilotons)
        megaton_bomb = 4.184e15  # joules
        krakatoa_eruption = 8.4e17  # joules (200 megatons)
        chicxulub_impact = 4.2e23  # joules (100 teratons)
        tsar_bomba = 2.1e17  # joules (50 megatons - largest nuke)
        annual_energy_consumption = 5.8e20  # joules (global, 2020)
        
        hiroshima_equivalent = kinetic_energy / hiroshima_bomb
        
        # Severity classification
        if hiroshima_equivalent < 10:
            severity = "MINOR"
            risk_level = "Low"
            description = "Local damage only"
        elif hiroshima_equivalent < 1000:
            severity = "MODERATE" 
            risk_level = "Medium"
            description = "City-level destruction"
        elif hiroshima_equivalent < 100000:
            severity = "MAJOR"
            risk_level = "High" 
            description = "Regional catastrophe"
        elif hiroshima_equivalent < 1000000:
            severity = "CATASTROPHIC"
            risk_level = "Extreme"
            description = "Continental-scale disaster"
        else:
            severity = "EXTINCTION LEVEL"
            risk_level = "Maximum"
            description = "Global mass extinction event"
        
        return {
            'hiroshima_bombs': hiroshima_equivalent,
            'megaton_bombs': kinetic_energy / megaton_bomb,
            'krakatoa_eruptions': kinetic_energy / krakatoa_eruption,
            'tsar_bombas': kinetic_energy / tsar_bomba,
            'chicxulub_fraction': kinetic_energy / chicxulub_impact,
            'global_energy_seconds': kinetic_energy / (annual_energy_consumption / (365*24*3600)),
            'severity_level': severity,
            'risk_level': risk_level,
            'description': description,
            'hiroshima_equivalent': hiroshima_equivalent
        }

    @staticmethod
    def calculate_impact_zones(crater_radius_km: float, energy_mt: float) -> dict:
        """Calculate different impact damage zones"""
        base_radius = crater_radius_km
        
        # Zone calculations based on empirical data
        thermal_radius = base_radius * 50  # Fireball/thermal radiation
        shockwave_radius = base_radius * 25  # Destructive shockwave
        earthquake_radius = base_radius * 15  # Significant seismic effects
        ejecta_radius = base_radius * 8  # Debris and ejecta
        
        return {
            'epicenter': base_radius,
            'thermal_radius': thermal_radius,
            'shockwave_radius': shockwave_radius, 
            'earthquake_radius': earthquake_radius,
            'ejecta_radius': ejecta_radius,
            'crater_zone': {
                'radius': base_radius,
                'description': 'Complete destruction - vaporization',
                'color': '#ff0000',
                'intensity': 1.0
            },
            'thermal_zone': {
                'radius': thermal_radius,
                'description': 'Fireball & thermal radiation - everything burns',
                'color': '#ff4400', 
                'intensity': 0.8
            },
            'shockwave_zone': {
                'radius': shockwave_radius,
                'description': 'Destructive shockwave - buildings destroyed',
                'color': '#ff8800',
                'intensity': 0.6
            },
            'earthquake_zone': {
                'radius': earthquake_radius,
                'description': 'Severe earthquakes - widespread damage',
                'color': '#ffaa00',
                'intensity': 0.4
            },
            'ejecta_zone': {
                'radius': ejecta_radius,
                'description': 'Debris fallout - moderate damage',
                'color': '#ffff00',
                'intensity': 0.2
            }
        }


# Add the missing run_simulation function for NASA asteroid simulations
def run_simulation(diameter: float, velocity: float, density: float, lat: float, lon: float):
    """Compatibility function for NASA asteroid simulations"""
    velocity_ms = velocity * 1000
    
    kinetic_energy = ImpactCalculator.calculate_kinetic_energy(diameter, velocity_ms, density)
    crater = ImpactCalculator.calculate_crater_size(kinetic_energy)
    magnitude = ImpactCalculator.calculate_seismic_magnitude(kinetic_energy)
    comparisons = ImpactCalculator.energy_comparisons(kinetic_energy)
    impact_zones = ImpactCalculator.calculate_impact_zones(
        crater['radius'] / 1000,
        kinetic_energy / (4.184e15)
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
            "lat": lat,
            "lon": lon
        }
    }
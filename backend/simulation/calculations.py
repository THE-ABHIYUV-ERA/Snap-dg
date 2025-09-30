import numpy as np

class ImpactCalculator:
    @staticmethod
    def calculate_kinetic_energy(diameter: float, velocity: float, density: float) -> float:
        """Calculate kinetic energy in joules"""
        # Volume of sphere = (4/3) * π * r^3
        radius = diameter / 2  # meters
        volume = (4/3) * np.pi * (radius ** 3)  # m³
        mass = density * volume  # kg
        kinetic_energy = 0.5 * mass * (velocity ** 2)  # joules
        return kinetic_energy

    @staticmethod
    def calculate_crater_size(kinetic_energy: float, target_density: float = 2500) -> dict:
        """Calculate crater dimensions using Pi-group scaling"""
        # Simple empirical model for crater diameter
        # Based on geological observations
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
        # Empirical relationship between energy and magnitude
        energy_joules = kinetic_energy
        if energy_joules <= 0:
            return 0
        
        # Mw = (2/3) * log10(E) - 5.87 (where E is in joules)
        magnitude = (2/3) * np.log10(energy_joules) - 5.87
        return round(magnitude, 1)

    @staticmethod
    def energy_comparisons(kinetic_energy: float) -> dict:
        """Compare impact energy to known events"""
        hiroshima_bomb = 6.3e13  # joules (15 kilotons)
        megaton_bomb = 4.184e15  # joules
        krakatoa_eruption = 8.4e17  # joules (200 megatons)
        chicxulub_impact = 4.2e23  # joules (100 teratons)
        
        return {
            'hiroshima_bombs': kinetic_energy / hiroshima_bomb,
            'megaton_bombs': kinetic_energy / megaton_bomb,
            'krakatoa_eruptions': kinetic_energy / krakatoa_eruption,
            'chicxulub_fraction': kinetic_energy / chicxulub_impact
        }
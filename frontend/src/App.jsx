import React, { useState } from 'react';
import axios from 'axios';
import ImpactMap from './components/ImpactMap';
import MitigationPanel from './components/MitigationPanel';
import './index.css';

const API_BASE = 'http://localhost:8000';

// Configure axios
axios.defaults.baseURL = API_BASE;

function App() {
  const [parameters, setParameters] = useState({
    diameter: 100, // meters
    velocity: 20,  // km/s
    density: 3000, // kg/m³
  });

  const [impactLocation, setImpactLocation] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('impact'); // 'impact' or 'mitigation'

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: parseFloat(value) || 0
    }));
  };

  const handleMapClick = (lat, lon) => {
    setImpactLocation({ lat, lon });
    setError(null);
  };

  const runSimulation = async () => {
    if (!impactLocation) {
      setError('Please select an impact location on the map first!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/simulate', {
        ...parameters,
        lat: impactLocation.lat,
        lon: impactLocation.lon
      });

      setSimulationResult(response.data);
      setActiveTab('results');
      
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err.response?.data?.detail || 'Failed to run simulation. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const resetSimulation = () => {
    setSimulationResult(null);
    setImpactLocation(null);
    setActiveTab('impact');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🌍 Impactor-2025</h1>
        <p>Asteroid Impact Simulator & Planetary Defense</p>
      </header>

      <div className="main-content">
        {/* Left Panel - Controls */}
        <div className="controls-panel">
          {/* Navigation Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'impact' ? 'active' : ''}`}
              onClick={() => setActiveTab('impact')}
            >
              🚀 Impact Simulation
            </button>
            <button 
              className={`tab ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
              disabled={!simulationResult}
            >
              📊 Results
            </button>
          </div>

          {/* Impact Simulation Tab */}
          {activeTab === 'impact' && (
            <div className="tab-content">
              <div className="parameter-group">
                <h3>Asteroid Parameters</h3>
                
                <div className="parameter">
                  <label>Diameter: {parameters.diameter} m</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="10"
                      value={parameters.diameter}
                      onChange={(e) => handleParameterChange('diameter', e.target.value)}
                    />
                    <input
                      type="number"
                      value={parameters.diameter}
                      onChange={(e) => handleParameterChange('diameter', e.target.value)}
                    />
                  </div>
                  <div className="parameter-help">
                    Typical: 10m (small) to 1000m (city-killer)
                  </div>
                </div>

                <div className="parameter">
                  <label>Velocity: {parameters.velocity} km/s</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="0.5"
                      value={parameters.velocity}
                      onChange={(e) => handleParameterChange('velocity', e.target.value)}
                    />
                    <input
                      type="number"
                      value={parameters.velocity}
                      onChange={(e) => handleParameterChange('velocity', e.target.value)}
                    />
                  </div>
                  <div className="parameter-help">
                    Earth impact: 11-30 km/s (orbital velocity + Earth's gravity)
                  </div>
                </div>

                <div className="parameter">
                  <label>Density: {parameters.density} kg/m³</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="1000"
                      max="8000"
                      step="100"
                      value={parameters.density}
                      onChange={(e) => handleParameterChange('density', e.target.value)}
                    />
                    <input
                      type="number"
                      value={parameters.density}
                      onChange={(e) => handleParameterChange('density', e.target.value)}
                    />
                  </div>
                  <div className="parameter-help">
                    Ice: 1000, Rock: 3000, Iron: 8000 kg/m³
                  </div>
                </div>
              </div>

              <div className="impact-instructions">
                <h4>🎯 Instructions:</h4>
                <ol>
                  <li>Adjust asteroid parameters above</li>
                  <li>Click on the map to select impact location</li>
                  <li>Click "Simulate Impact" to see results</li>
                </ol>
              </div>

              <button 
                className="impact-button"
                onClick={runSimulation}
                disabled={loading || !impactLocation}
              >
                {loading ? '🔄 Simulating Impact...' : '💥 Simulate Impact'}
              </button>

              {impactLocation && (
                <div className="location-card">
                  <h4>📍 Selected Impact Location</h4>
                  <div>Latitude: {impactLocation.lat.toFixed(4)}°</div>
                  <div>Longitude: {impactLocation.lon.toFixed(4)}°</div>
                </div>
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && simulationResult && (
            <div className="tab-content">
              <div className="results-header">
                <h3>Impact Analysis</h3>
                <button className="reset-button" onClick={resetSimulation}>
                  🔄 New Simulation
                </button>
              </div>

              <div className="results-grid">
                <div className="result-card primary">
                  <h4>💥 Kinetic Energy</h4>
                  <div className="result-value">
                    {formatNumber(simulationResult.kinetic_energy_megatons)} MT
                  </div>
                  <div className="result-description">
                    {simulationResult.kinetic_energy_joules?.toExponential(2)} Joules
                  </div>
                </div>

                <div className="result-card">
                  <h4>🕳️ Crater Diameter</h4>
                  <div className="result-value">
                    {simulationResult.crater_diameter_km?.toFixed(2)} km
                  </div>
                </div>

                <div className="result-card">
                  <h4>🌋 Seismic Magnitude</h4>
                  <div className="result-value">
                    M{simulationResult.seismic_magnitude}
                  </div>
                </div>

                <div className="result-card">
                  <h4>⛰️ Crater Depth</h4>
                  <div className="result-value">
                    {simulationResult.crater_depth_km?.toFixed(2)} km
                  </div>
                </div>
              </div>

              <div className="comparisons-section">
                <h4>Energy Comparisons</h4>
                <div className="comparisons-grid">
                  <div className="comparison-item">
                    <span className="comparison-icon">💣</span>
                    <span className="comparison-label">Hiroshima Bombs:</span>
                    <span className="comparison-value">{formatNumber(simulationResult.comparisons?.hiroshima_bombs)}</span>
                  </div>
                  <div className="comparison-item">
                    <span className="comparison-icon">☢️</span>
                    <span className="comparison-label">Megaton Bombs:</span>
                    <span className="comparison-value">{formatNumber(simulationResult.comparisons?.megaton_bombs)}</span>
                  </div>
                  <div className="comparison-item">
                    <span className="comparison-icon">🌋</span>
                    <span className="comparison-label">Krakatoa Eruptions:</span>
                    <span className="comparison-value">{simulationResult.comparisons?.krakatoa_eruptions?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Mitigation Panel in Results */}
              <MitigationPanel
                parameters={parameters}
                impactLocation={impactLocation}
                onDeflectionCalculated={setSimulationResult}
              />
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Right Panel - Map Visualization */}
        <div className="visualization-panel">
          <ImpactMap
            impactLocation={impactLocation}
            craterRadius={simulationResult?.crater_radius_km}
            onMapClick={handleMapClick}
          />
          
          {simulationResult && (
            <div className="map-info">
              <h4>Map Legend</h4>
              <div className="legend-item">
                <div className="legend-color crater"></div>
                <span>Red Circle: Impact Crater Zone</span>
              </div>
              <div className="legend-item">
                <div className="legend-color marker"></div>
                <span>Marker: Impact Epicenter</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
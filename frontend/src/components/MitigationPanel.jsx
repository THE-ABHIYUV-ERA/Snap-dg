import React, { useState } from 'react';
import axios from 'axios';

const MitigationPanel = ({ parameters, impactLocation, onDeflectionCalculated }) => {
  const [mitigationParams, setMitigationParams] = useState({
    strategy: 'kinetic_impactor', // 'kinetic_impactor', 'gravity_tractor', 'nuclear'
    delta_v: 0.01, // m/s
    time_before_impact: 365, // days
    spacecraft_mass: 1000 // kg
  });
  
  const [mitigationResult, setMitigationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMitigationChange = (param, value) => {
    setMitigationParams(prev => ({
      ...prev,
      [param]: param === 'strategy' ? value : parseFloat(value) || 0
    }));
  };

  const runMitigationSimulation = async () => {
    if (!impactLocation) {
      setError('Please set an impact location first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/simulate-mitigation', {
        ...parameters,
        ...mitigationParams,
        lat: impactLocation.lat,
        lon: impactLocation.lon
      });
      
      setMitigationResult(response.data);
    } catch (err) {
      console.error('Mitigation simulation failed:', err);
      setError('Failed to run mitigation simulation: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getStrategyInfo = (strategy) => {
    const strategies = {
      kinetic_impactor: {
        name: 'Kinetic Impactor',
        description: 'Spacecraft crashes into asteroid to change velocity',
        effectiveness: 'Medium',
        cost: 'Low',
        readiness: 'Ready now',
        icon: '🚀'
      },
      gravity_tractor: {
        name: 'Gravity Tractor', 
        description: 'Spacecraft uses gravity to slowly pull asteroid',
        effectiveness: 'Low',
        cost: 'High',
        readiness: 'Near future',
        icon: '🛰️'
      },
      nuclear: {
        name: 'Nuclear Deflection',
        description: 'Nuclear explosion near asteroid surface',
        effectiveness: 'High', 
        cost: 'Medium',
        readiness: 'Emergency only',
        icon: '☢️'
      }
    };
    return strategies[strategy] || strategies.kinetic_impactor;
  };

  const currentStrategy = getStrategyInfo(mitigationParams.strategy);

  return (
    <div style={{ 
      marginTop: '2rem', 
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      borderRadius: '10px',
      border: '1px solid rgba(0, 212, 255, 0.3)'
    }}>
      <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>🛡️ Planetary Defense</h3>
      
      {/* Strategy Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ color: '#88ffff', display: 'block', marginBottom: '0.5rem' }}>
          Defense Strategy:
        </label>
        <select
          value={mitigationParams.strategy}
          onChange={(e) => handleMitigationChange('strategy', e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: '1px solid #00d4ff',
            borderRadius: '5px'
          }}
        >
          <option value="kinetic_impactor">🚀 Kinetic Impactor (DART Mission)</option>
          <option value="gravity_tractor">🛰️ Gravity Tractor</option>
          <option value="nuclear">☢️ Nuclear Deflection</option>
        </select>
        
        {/* Strategy Info */}
        <div style={{
          background: 'rgba(0, 212, 255, 0.1)',
          padding: '0.75rem',
          borderRadius: '5px',
          marginTop: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <div><strong>{currentStrategy.icon} {currentStrategy.name}</strong></div>
          <div>{currentStrategy.description}</div>
          <div>Effectiveness: {currentStrategy.effectiveness} • Cost: {currentStrategy.cost}</div>
          <div>Readiness: {currentStrategy.readiness}</div>
        </div>
      </div>

      {/* Strategy-specific parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ color: '#88ffff', display: 'block', marginBottom: '0.5rem' }}>
            Δv (Velocity Change): {mitigationParams.delta_v} m/s
          </label>
          <input
            type="range"
            min="0.001"
            max="1"
            step="0.001"
            value={mitigationParams.delta_v}
            onChange={(e) => handleMitigationChange('delta_v', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ color: '#88ffff', display: 'block', marginBottom: '0.5rem' }}>
            Time Before Impact: {mitigationParams.time_before_impact} days
          </label>
          <input
            type="range"
            min="30"
            max="1000"
            step="10"
            value={mitigationParams.time_before_impact}
            onChange={(e) => handleMitigationChange('time_before_impact', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {mitigationParams.strategy === 'kinetic_impactor' && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#88ffff', display: 'block', marginBottom: '0.5rem' }}>
            Spacecraft Mass: {mitigationParams.spacecraft_mass} kg
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={mitigationParams.spacecraft_mass}
            onChange={(e) => handleMitigationChange('spacecraft_mass', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      )}
      
      <button 
        onClick={runMitigationSimulation}
        disabled={loading || !impactLocation}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '1rem',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? '🔄 Calculating Deflection...' : `🚀 Deploy ${currentStrategy.name}`}
      </button>
      
      {error && (
        <div style={{
          background: 'rgba(255, 0, 0, 0.2)',
          color: '#ff8888',
          padding: '0.75rem',
          borderRadius: '5px',
          marginBottom: '1rem',
          border: '1px solid #ff4444'
        }}>
          {error}
        </div>
      )}
      
      {mitigationResult && (
        <div>
          <h4 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>Deflection Results</h4>
          
          {mitigationResult.impact_avoided ? (
            <div style={{
              background: 'rgba(0, 255, 0, 0.2)',
              color: '#88ff88',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #00ff00',
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              ✅ MISSION SUCCESS!<br />
              Impact avoided by {mitigationResult.miss_distance_km?.toFixed(2)} km<br />
              <small>Earth is safe! 🌍</small>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255, 255, 0, 0.2)',
              color: '#ffff88',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #ffff00',
              marginBottom: '1rem'
            }}>
              ⚠️ Partial deflection achieved<br />
              Miss distance: {mitigationResult.miss_distance_km?.toFixed(2)} km<br />
              <small>Larger deflection needed for complete safety</small>
            </div>
          )}
          
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1rem',
            borderRadius: '5px',
            fontSize: '0.9rem'
          }}>
            <div><strong>Strategy:</strong> {currentStrategy.name}</div>
            <div><strong>Δv Applied:</strong> {mitigationResult.delta_v_applied} m/s</div>
            <div><strong>Time Before Impact:</strong> {mitigationResult.time_before_impact_days} days</div>
            <div><strong>Deflection Distance:</strong> {mitigationResult.deflection_distance_km?.toFixed(2)} km</div>
            {mitigationResult.new_impact && (
              <div>
                <strong>New Impact Point:</strong><br />
                Lat: {mitigationResult.new_impact.lat?.toFixed(4)}°, 
                Lon: {mitigationResult.new_impact.lon?.toFixed(4)}°
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MitigationPanel;
import React, { useState } from 'react';
import axios from 'axios';

const MitigationPanel = ({ parameters, impactLocation, onDeflectionCalculated }) => {
  const [mitigationParams, setMitigationParams] = useState({
    delta_v: 0.01, // m/s
    time_before_impact: 365 // days
  });
  
  const [mitigationResult, setMitigationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMitigationChange = (param, value) => {
    setMitigationParams(prev => ({
      ...prev,
      [param]: parseFloat(value) || 0
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

  return (
    <div style={{ 
      marginTop: '2rem', 
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      borderRadius: '10px',
      border: '1px solid rgba(0, 212, 255, 0.3)'
    }}>
      <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>🛡️ Planetary Defense</h3>
      
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
            min="1"
            max="1000"
            step="1"
            value={mitigationParams.time_before_impact}
            onChange={(e) => handleMitigationChange('time_before_impact', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>
      
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
        {loading ? '🔄 Calculating...' : '🚀 Apply Deflection'}
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
              ✅ SUCCESS! Impact avoided by {mitigationResult.miss_distance_km?.toFixed(2)} km
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
              ⚠️ Partial deflection: {mitigationResult.deflection_distance_km?.toFixed(2)} km
              <br />
              New impact point calculated
            </div>
          )}
          
          <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            <div>Deflection Distance: {mitigationResult.deflection_distance_km?.toFixed(2)} km</div>
            <div>Δv Applied: {mitigationResult.delta_v_applied} m/s</div>
            <div>Time Before Impact: {mitigationResult.time_before_impact_days} days</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitigationPanel;
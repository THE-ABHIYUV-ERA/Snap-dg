import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `<div style="
    background: #ff4444; 
    width: 20px; 
    height: 20px; 
    border-radius: 50%; 
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  "></div>`
});

L.Marker.prototype.options.icon = DefaultIcon;

const ImpactMap = ({ impactLocation, craterRadius, onMapClick }) => {
  const defaultCenter = [20, 0];
  
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    onMapClick(lat, lng);
  };

  return (
    <div style={{ 
      height: '100%', 
      borderRadius: '10px', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <MapContainer
        center={defaultCenter}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {impactLocation && (
          <Marker position={[impactLocation.lat, impactLocation.lon]}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>Impact Point</strong><br />
                Latitude: {impactLocation.lat.toFixed(4)}°<br />
                Longitude: {impactLocation.lon.toFixed(4)}°
              </div>
            </Popup>
          </Marker>
        )}
        
        {impactLocation && craterRadius && (
          <Circle
            center={[impactLocation.lat, impactLocation.lon]}
            radius={craterRadius * 1000} // Convert km to meters
            pathOptions={{
              color: 'red',
              fillColor: '#ff4444',
              fillOpacity: 0.2,
              weight: 2
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>Crater Zone</strong><br />
                Radius: {craterRadius.toFixed(2)} km<br />
                Diameter: {(craterRadius * 2).toFixed(2)} km
              </div>
            </Popup>
          </Circle>
        )}
      </MapContainer>
      
      <div style={{ 
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '5px',
        fontSize: '0.9rem',
        zIndex: 1000
      }}>
        🗺️ Click anywhere on the map to set impact location
      </div>
    </div>
  );
};

export default ImpactMap;
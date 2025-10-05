// frontend/src/components/ImpactMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      console.log('Map clicked at:', e.latlng);
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const ImpactMap = ({ impactLocation, craterRadius, onMapClick, impactZones }) => {
  const defaultCenter = [20, 0];
  
  console.log('ImpactMap props:', { impactLocation, craterRadius });

  return (
    <div className="map-container" style={{ 
      height: '100%', 
      borderRadius: '10px', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <MapContainer
        center={defaultCenter}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        doubleClickZoom={false}
      >
        {/* Add click handler */}
        <MapClickHandler onMapClick={onMapClick} />
        
        <LayersControl position="topright">
          {/* Base Layers */}
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
              maxZoom={17}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Dark Map">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {/* Impact Point Marker */}
        {impactLocation && (
          <Marker position={[impactLocation.lat, impactLocation.lon]}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>💥 Impact Epicenter</strong><br />
                Latitude: {impactLocation.lat.toFixed(4)}°<br />
                Longitude: {impactLocation.lon.toFixed(4)}°
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Crater Zone */}
        {impactLocation && craterRadius && (
          <Circle
            center={[impactLocation.lat, impactLocation.lon]}
            radius={craterRadius * 1000}
            pathOptions={{
              color: 'red',
              fillColor: '#ff4444',
              fillOpacity: 0.3,
              weight: 2
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>Crater Zone</strong><br />
                Radius: {craterRadius.toFixed(2)} km
              </div>
            </Popup>
          </Circle>
        )}
        
        {/* Impact Zones if available */}
        {impactLocation && impactZones && (
          <>
            {/* Ejecta Zone */}
            <Circle
              center={[impactLocation.lat, impactLocation.lon]}
              radius={impactZones.ejecta_radius * 1000}
              pathOptions={{
                color: '#ffff00',
                fillColor: '#ffff00',
                fillOpacity: 0.1,
                weight: 1
              }}
            />
            
            {/* Earthquake Zone */}
            <Circle
              center={[impactLocation.lat, impactLocation.lon]}
              radius={impactZones.earthquake_radius * 1000}
              pathOptions={{
                color: '#ffaa00',
                fillColor: '#ffaa00',
                fillOpacity: 0.15,
                weight: 1
              }}
            />
            
            {/* Shockwave Zone */}
            <Circle
              center={[impactLocation.lat, impactLocation.lon]}
              radius={impactZones.shockwave_radius * 1000}
              pathOptions={{
                color: '#ff8800',
                fillColor: '#ff8800',
                fillOpacity: 0.2,
                weight: 2
              }}
            />
            
            {/* Thermal Zone */}
            <Circle
              center={[impactLocation.lat, impactLocation.lon]}
              radius={impactZones.thermal_radius * 1000}
              pathOptions={{
                color: '#ff4400',
                fillColor: '#ff4400',
                fillOpacity: 0.25,
                weight: 2
              }}
            />
          </>
        )}
      </MapContainer>
      
      {/* Enhanced Instructions Panel */}
      <div style={{ 
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '0.9rem',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <strong>🗺️ Click anywhere on the map to set impact location</strong>
        {impactLocation && (
          <div style={{ 
            marginTop: '5px', 
            fontSize: '0.8rem',
            padding: '5px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px'
          }}>
            📍 Selected: {impactLocation.lat.toFixed(4)}°, {impactLocation.lon.toFixed(4)}°
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '0.8rem',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <strong>Impact Zones Legend</strong>
        <div style={{ marginTop: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
            <div style={{ width: '12px', height: '12px', background: 'red', borderRadius: '50%', marginRight: '5px' }}></div>
            <span>Impact Epicenter</span>
          </div>
          {craterRadius && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
              <div style={{ width: '12px', height: '12px', background: '#ff4444', borderRadius: '50%', marginRight: '5px', opacity: 0.3 }}></div>
              <span>Crater Zone</span>
            </div>
          )}
          {impactZones && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '12px', height: '12px', background: '#ffff00', borderRadius: '50%', marginRight: '5px', opacity: 0.1 }}></div>
                <span>Ejecta Zone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '12px', height: '12px', background: '#ffaa00', borderRadius: '50%', marginRight: '5px', opacity: 0.15 }}></div>
                <span>Earthquake Zone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '12px', height: '12px', background: '#ff8800', borderRadius: '50%', marginRight: '5px', opacity: 0.2 }}></div>
                <span>Shockwave Zone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '12px', height: '12px', background: '#ff4400', borderRadius: '50%', marginRight: '5px', opacity: 0.25 }}></div>
                <span>Thermal Zone</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImpactMap;
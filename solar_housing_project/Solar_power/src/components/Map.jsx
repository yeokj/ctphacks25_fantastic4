import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

const Map = () => {

  const nycPosition = [40.7128, -74.0060];
  
  const zoomLevel = 7; 

  return (
    <MapContainer 
      center={nycPosition} 
      zoom={zoomLevel} 
      scrollWheelZoom={true} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={nycPosition}>
        <Popup>
          New York City
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
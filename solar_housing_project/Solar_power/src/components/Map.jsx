import React, { useEffect } from 'react'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

const UpdateMapView = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], map.getZoom());
    }
  }, [location, map]);
  return null;
};

const Map = ({ location }) => {
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
      
      {}
      <UpdateMapView location={location} />
      
      {}
      {location && (
        <Marker position={[location.lat, location.lng]}>
          <Popup>You searched for this location.</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;

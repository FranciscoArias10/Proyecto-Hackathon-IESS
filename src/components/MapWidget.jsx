import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons not displaying in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapWidget = () => {
    // Coordinates for IESS Quito (approximate)
    const position = [-0.19830872688086056, -78.49479383615569];

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-slate-700 shadow-xl relative z-0">
            <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <strong className="text-slate-900">Edificio Matriz IESS</strong><br />
                        <span className="text-slate-700">Av. 10 de Agosto y Bogotá</span>
                    </Popup>
                </Marker>
            </MapContainer>
            <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-lg shadow-lg z-[1000] text-slate-800 text-xs font-semibold backdrop-blur-sm">
                Oficina más cercana
            </div>
        </div>
    );
};

export default MapWidget;

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const MapPicker = ({ onLocationSelect, initialPosition }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const defaultCenter = [7.8731, 80.7718]; // Sri Lanka
    const [coords, setCoords] = useState(initialPosition || defaultCenter);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapContainerRef.current).setView(initialPosition || defaultCenter, 8);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapInstanceRef.current);

            // Add marker
            markerRef.current = L.marker(initialPosition || defaultCenter, {
                icon: DefaultIcon,
                draggable: true
            }).addTo(mapInstanceRef.current);

            // Click listener
            mapInstanceRef.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                updateLocation(lat, lng);
            });

            // Drag listener
            markerRef.current.on('dragend', (e) => {
                const { lat, lng } = e.target.getLatLng();
                updateLocation(lat, lng);
            });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const updateLocation = (lat, lng) => {
        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        }
        setCoords([lat, lng]);
        onLocationSelect(lat, lng);
    };

    return (
        <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
            <div
                ref={mapContainerRef}
                className="w-full h-full rounded-2xl overflow-hidden border border-white/10"
                style={{ height: '400px', zIndex: 1 }}
            />

            {/* Visual feedback overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] glass-effect p-4 rounded-2xl border border-white/10 shadow-xl pointer-events-none">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Selected Location</span>
                    <div className="flex gap-3 text-xs font-bold text-primary">
                        <span>LAT: {coords[0].toFixed(5)}</span>
                        <span>LNG: {coords[1].toFixed(5)}</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-[1000] glass-effect px-4 py-2 rounded-xl border border-white/10 shadow-lg pointer-events-none">
                <p className="text-[10px] font-black uppercase tracking-widest text-success flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    Click or Drag Pin
                </p>
            </div>
        </div>
    );
};

export default MapPicker;

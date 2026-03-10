import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Loader2, X } from 'lucide-react';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const MapPicker = ({ onLocationSelect, onAddressUpdate, initialPosition }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const defaultCenter = [7.8731, 80.7718]; // Sri Lanka
    const [coords, setCoords] = useState(initialPosition || defaultCenter);

    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Watch for external coordinate changes (e.g. from form fields)
    useEffect(() => {
        if (mapInstanceRef.current && initialPosition) {
            const [lat, lng] = initialPosition;
            if (lat !== coords[0] || lng !== coords[1]) {
                updateLocation(lat, lng, null, false); // Don't trigger reverse geocoding back
            }
        }
    }, [initialPosition]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapContainerRef.current, {
                zoomControl: false
            }).setView(initialPosition || defaultCenter, 8);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapInstanceRef.current);

            // Add zoom control to bottom right
            L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);

            // Add marker
            markerRef.current = L.marker(initialPosition || defaultCenter, {
                icon: DefaultIcon,
                draggable: true
            }).addTo(mapInstanceRef.current);

            // Click listener
            mapInstanceRef.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                updateLocation(lat, lng, null, true);
            });

            // Drag listener
            markerRef.current.on('dragend', (e) => {
                const { lat, lng } = e.target.getLatLng();
                updateLocation(lat, lng, null, true);
            });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const updateLocation = async (lat, lng, zoom = null, triggerReverse = true) => {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
        }

        if (zoom && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], zoom, {
                animate: true,
                duration: 1.5
            });
        } else if (mapInstanceRef.current && !zoom) {
            // Just center if no specific zoom
            mapInstanceRef.current.panTo([latitude, longitude]);
        }

        setCoords([latitude, longitude]);
        onLocationSelect(latitude, longitude);

        // Reverse Geocoding: Get address from coordinates
        if (triggerReverse && onAddressUpdate) {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                const data = await res.json();
                if (data && data.address) {
                    const city = data.address.city || data.address.town || data.address.village || data.address.suburb || '';
                    const fullAddress = data.display_name;
                    onAddressUpdate(city, fullAddress);
                }
            } catch (error) {
                console.error('Reverse geocoding error:', error);
            }
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            );
            const data = await response.json();
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectResult = (result) => {
        const { lat, lon, display_name, address } = result;
        updateLocation(lat, lon, 15, false); // Move map but don't re-trigger reverse geocoding
        setSearchQuery(display_name);
        setShowResults(false);

        // Update form fields directly from search result if callback exists
        if (onAddressUpdate) {
            const city = (address && (address.city || address.town || address.village || address.suburb)) || '';
            const fullAddress = display_name;
            onAddressUpdate(city, fullAddress);
        }
    };

    return (
        <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
            {/* Search Bar UI */}
            <div className="absolute top-6 left-6 right-6 z-[2000] flex flex-col gap-2 max-w-md mx-auto sm:mx-0">
                <div className="relative group/search">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted transition-colors group-focus-within/search:text-primary">
                        {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search for a location or address..."
                        className="w-full bg-deep shadow-2xl border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white font-bold text-sm focus:border-primary/50 outline-none transition-all glass-effect"
                        onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false); }}
                            className="absolute inset-y-0 right-4 flex items-center text-muted hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="bg-deep border border-white/10 rounded-2xl overflow-hidden glass-effect shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        {searchResults.map((result, idx) => (
                            <button
                                key={idx}
                                onClick={() => selectResult(result)}
                                className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex items-start gap-4"
                            >
                                <div className="mt-1 text-primary">
                                    <MapPin size={16} />
                                </div>
                                <span className="text-xs font-bold text-white/80 line-clamp-2 leading-relaxed">
                                    {result.display_name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

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


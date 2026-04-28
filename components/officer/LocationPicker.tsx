'use client';

import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useCallback } from 'react';

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number, address?: string) => void;
}

const DEFAULT_CENTER = { lat: 30.3165, lng: 78.0322 }; // Dehradun, Uttarakhand

function MapHandler({ pos }: { pos: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && pos) {
      map.panTo(pos);
    }
  }, [map, pos]);
  return null;
}

export default function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const geocoding = useMapsLibrary('geocoding');
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null
  );

  // Sync internal marker position with props
  useEffect(() => {
    if (lat && lng) {
      setMarkerPos({ lat, lng });
    }
  }, [lat, lng]);

  const handleLocationChange = useCallback(async (newLat: number, newLng: number) => {
    setMarkerPos({ lat: newLat, lng: newLng });
    
    let addressString: string | undefined = undefined;
    
    if (geocoding) {
      const geocoder = new geocoding.Geocoder();
      try {
        const response = await geocoder.geocode({ location: { lat: newLat, lng: newLng } });
        if (response.results[0]) {
          addressString = response.results[0].formatted_address;
        }
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
      }
    }
    
    onChange(newLat, newLng, addressString);
  }, [geocoding, onChange]);

  if (!apiKey) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-map-marked-alt text-amber-600 text-2xl" />
        </div>
        <h4 className="text-lg font-bold text-gray-700">Google Maps API Key Missing</h4>
        <p className="text-sm text-gray-500 max-w-sm mt-2">
          Please add <code className="bg-gray-200 px-1 rounded text-red-600">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-gray-200 px-1 rounded">.env</code> file to enable the location picker.
        </p>
      </div>
    );
  }

  const handleMapClick = (e: any) => {
    const newLat = e.detail.latLng.lat;
    const newLng = e.detail.latLng.lng;
    handleLocationChange(newLat, newLng);
  };

  return (
    <APIProvider apiKey={apiKey}>
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative group">
      <Map
        defaultCenter={markerPos || DEFAULT_CENTER}
        defaultZoom={12}
        onClick={handleMapClick}
        mapId="INFRA_LOCATION_PICKER"
        gestureHandling={'greedy'}
        disableDefaultUI={false}
      >
        <MapHandler pos={markerPos} />
        {markerPos && (
          <Marker 
            position={markerPos} 
            draggable={true}
            onDragEnd={(e: any) => {
              const newLat = e.latLng.lat();
              const newLng = e.latLng.lng();
              handleLocationChange(newLat, newLng);
            }}
          />
        )}
      </Map>
        
        {/* Helper overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-gray-100 pointer-events-auto">
            <p className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider mb-1">Current Coordinates</p>
            <div className="flex gap-4">
              <div>
                <span className="text-[9px] text-gray-400 block uppercase">Latitude</span>
                <span className="text-xs font-mono font-bold text-gray-700">{markerPos?.lat.toFixed(6) || '—'}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase">Longitude</span>
                <span className="text-xs font-mono font-bold text-gray-700">{markerPos?.lng.toFixed(6) || '—'}</span>
              </div>
            </div>
          </div>
          <div className="bg-[#1e3a8a] text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg">
            <i className="fas fa-mouse-pointer mr-2" /> Click to set location
          </div>
        </div>
      </div>
    </APIProvider>
  );
}

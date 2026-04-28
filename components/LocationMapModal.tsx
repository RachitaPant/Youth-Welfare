'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface LocationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  name: string;
}

export default function LocationMapModal({ isOpen, onClose, lat, lng, name }: LocationMapModalProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div>
            <h2 className="text-xl font-bold text-[#1e3a8a]">{name}</h2>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <i className="fas fa-location-dot" /> Geographic Location on Google Maps
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 transition-all shadow-sm"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Map Body */}
        <div className="h-[450px] relative">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={{ lat, lng }}
                defaultZoom={15}
                mapId="INFRA_VIEWER"
                gestureHandling={'greedy'}
                disableDefaultUI={false}
              >
                <Marker position={{ lat, lng }} />
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-center p-10">
               <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-triangle-exclamation text-amber-600 text-2xl" />
              </div>
              <p className="text-gray-600 font-bold">Google Maps API Key Missing</p>
              <p className="text-sm text-gray-400 mt-1">Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 flex justify-between items-center">
          <div className="flex gap-4">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Latitude</span>
              <span className="text-sm font-mono font-bold text-gray-700">{lat.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Longitude</span>
              <span className="text-sm font-mono font-bold text-gray-700">{lng.toFixed(6)}</span>
            </div>
          </div>
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#1e40af] transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
          >
            <i className="fas fa-directions" /> Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}

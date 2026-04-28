'use client';

import { useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface InfraDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    location?: string | null;
    districtName: string;
    facilities?: string | null;
    pocName?: string | null;
    pocPhone?: string | null;
    pocEmail?: string | null;
    imageUrls?: string[] | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
}

export default function InfraDetailModal({ isOpen, onClose, data }: InfraDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!isOpen || !data) return null;

  const images = data.imageUrls && data.imageUrls.length > 0 
    ? data.imageUrls 
    : ['/images/placeholder-infra.jpg']; // Fallback if no images

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-5xl h-[90vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative animate-in zoom-in slide-in-from-bottom-8 duration-500">
        
        {/* Close Button (Mobile) */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg lg:hidden">
          <i className="fas fa-times text-gray-800" />
        </button>

        {/* Left Side: Visuals (Images + Map) */}
        <div className="w-full lg:w-3/5 h-1/2 lg:h-full bg-gray-100 flex flex-col border-r border-gray-100">
          {/* Image Gallery */}
          <div className="flex-1 relative group overflow-hidden">
            <img 
              src={images[activeImageIdx]} 
              alt={data.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gallery Controls */}
            {images.length > 1 && (
              <>
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button 
                    onClick={() => setActiveImageIdx(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center pointer-events-auto hover:bg-white/40 transition-all border border-white/30"
                  >
                    <i className="fas fa-chevron-left" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIdx(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center pointer-events-auto hover:bg-white/40 transition-all border border-white/30"
                  >
                    <i className="fas fa-chevron-right" />
                  </button>
                </div>
                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImageIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${i === activeImageIdx ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Badge */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-[#1e3a8a] text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
              <i className="fas fa-camera mr-2" /> {activeImageIdx + 1} / {images.length} Photos
            </div>
          </div>

          {/* Map Preview */}
          <div className="h-1/3 min-h-[200px] border-t-4 border-white relative">
            {apiKey && data.latitude && data.longitude ? (
              <APIProvider apiKey={apiKey}>
                <Map
                  defaultCenter={{ lat: data.latitude, lng: data.longitude }}
                  defaultZoom={15}
                  mapId="INFRA_MODAL_VIEW"
                  disableDefaultUI={true}
                >
                  <Marker position={{ lat: data.latitude, lng: data.longitude }} />
                </Map>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-xl text-[10px] font-bold text-[#1e3a8a] shadow-lg flex items-center gap-2 hover:bg-[#1e3a8a] hover:text-white transition-all border border-gray-100"
                >
                  <i className="fas fa-location-arrow" /> Get Directions
                </a>
              </APIProvider>
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs italic">
                Map location not available
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-2/5 h-1/2 lg:h-full bg-white p-8 lg:p-12 overflow-y-auto flex flex-col custom-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h2 className="text-3xl font-black text-[#1e293b] leading-tight mb-2">{data.name}</h2>
              <div className="flex items-center gap-2 text-[#64748b]">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1e3a8a]">
                  <i className="fas fa-map-marker-alt text-sm" />
                </div>
                <span className="text-sm font-medium">{data.location}, {data.districtName}</span>
              </div>
            </div>
            <button onClick={onClose} className="hidden lg:flex w-12 h-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100">
              <i className="fas fa-times text-lg" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Facilities Section */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-blue-100" /> Core Facilities
              </h4>
              <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                <p className="text-sm text-[#475569] leading-relaxed italic">
                  "{data.facilities || 'No specific facilities listed.'}"
                </p>
              </div>
            </div>

            {/* POC Section */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-blue-100" /> Administrative Contact
              </h4>
              <div className="grid gap-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-blue-50/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-user-tie" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Point of Contact</p>
                    <p className="text-sm font-bold text-[#1e293b]">{data.pocName || 'Not available'}</p>
                  </div>
                </div>

                {data.pocPhone && (
                  <a href={`tel:${data.pocPhone}`} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-green-50/30 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-phone-alt" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Phone Number</p>
                      <p className="text-sm font-bold text-[#1e293b]">{data.pocPhone}</p>
                    </div>
                    <i className="fas fa-arrow-right ml-auto text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                )}

                {data.pocEmail && (
                  <a href={`mailto:${data.pocEmail}`} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-purple-50/30 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-envelope" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                      <p className="text-sm font-bold text-[#1e293b] truncate max-w-[200px]">{data.pocEmail}</p>
                    </div>
                    <i className="fas fa-arrow-right ml-auto text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Footer Footer */}
          <div className="mt-auto pt-10 text-center">
            <p className="text-[10px] text-gray-300 font-medium">Department of Youth Welfare and PRD, Uttarakhand</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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

        {/* Left Side: Visuals (Image Gallery) */}
        <div className="w-full lg:w-1/2 h-[40%] lg:h-full bg-gray-100 relative group overflow-hidden border-r border-gray-100">
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

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2 h-[60%] lg:h-full bg-white p-8 lg:p-12 overflow-y-auto flex flex-col custom-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-4xl font-black text-[#1e293b] leading-tight mb-3 tracking-tight">{data.name}</h2>
              <div className="flex items-start gap-3 text-[#64748b]">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1e3a8a] shrink-0 border border-blue-100 shadow-sm">
                  <i className="fas fa-map-marker-alt text-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1e293b] leading-relaxed">
                    {data.location || 'Address not available'}
                  </p>
                  <p className="text-xs font-medium text-[#64748b] mt-1 uppercase tracking-widest">
                    {data.districtName}, Uttarakhand
                  </p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="hidden lg:flex w-12 h-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 shadow-sm">
              <i className="fas fa-times text-lg" />
            </button>
          </div>

          {/* Map Preview - Now below address */}
          <div className="mb-8 group">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-6 h-[2px] bg-blue-100" /> Geographic Location
                </h4>
                {apiKey && data.latitude && data.longitude && (
                   <a 
                     href={`https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[10px] font-black text-[#1e3a8a] uppercase tracking-wider hover:underline"
                   >
                     Open in Google Maps
                   </a>
                )}
             </div>
             
             <div className="relative h-48 lg:h-56 rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-lg transition-all duration-500">
               {apiKey && data.latitude && data.longitude ? (
                 <a 
                   href={`https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="block w-full h-full relative cursor-pointer"
                   title="Click to get directions"
                 >
                   <APIProvider apiKey={apiKey}>
                     <Map
                       defaultCenter={{ lat: data.latitude, lng: data.longitude }}
                       defaultZoom={15}
                       mapId="INFRA_MODAL_VIEW"
                       disableDefaultUI={true}
                       gestureHandling="none"
                     >
                       <Marker position={{ lat: data.latitude, lng: data.longitude }} />
                     </Map>
                   </APIProvider>
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border border-white">
                         <i className="fas fa-location-arrow mr-2" /> Get Directions
                      </div>
                   </div>
                 </a>
               ) : (
                 <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-300 gap-3">
                   <i className="fas fa-map-marked-alt text-3xl" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Map location not available</span>
                 </div>
               )}
             </div>
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

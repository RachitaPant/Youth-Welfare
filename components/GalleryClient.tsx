'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import PhotoSubmissionModal from '@/components/PhotoSubmissionModal';

interface GalleryImage {
  id: string;
  fullName: string;
  description: string;
  mediaUrls: string[];
  district?: { name: string } | null;
  createdAt: string;
}

interface GalleryClientProps {
  /** Static seed images shown before API data loads */
  images?: { src: string; alt: string; description: string }[];
}

export default function GalleryClient({ images = [] }: GalleryClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['gallery', 'approved'],
    queryFn: () =>
      fetch('/api/gallery?limit=50')
        .then((r) => r.json())
        .then((d) => d.data as GalleryImage[]),
    staleTime: 60 * 1000,
  });

  // Approved gallery items from API merged with static seeds
  const apiImages = (data ?? []).flatMap((item) =>
    item.mediaUrls.map((src) => ({
      src,
      alt: item.fullName,
      description: `${item.description}${item.district ? ` · ${item.district.name}` : ''}`,
    }))
  );

  const allImages = [...apiImages, ...images];

  return (
    <>
      <div className="bg-[#1e3a8a] text-white py-12 px-5 mb-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Share Your Achievement!</h2>
            <p className="text-blue-100/80 max-w-[500px]">Did you participate in a competition? Upload your photo and details to be featured in our official gallery.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-[#10b981] hover:bg-[#059669] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <i className="fas fa-camera text-xl" />
            Submit Your Photo
          </button>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-5 py-12">
        {allImages.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <i className="fas fa-images text-5xl mb-4 text-gray-200" />
            <p className="text-lg font-medium">No approved photos yet.</p>
            <p className="text-sm mt-1">Be the first to submit!</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {allImages.map((img, i) => (
              <div
                key={i}
                className="relative break-inside-avoid overflow-hidden rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-[#e2e8f0] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white text-sm font-medium leading-relaxed drop-shadow-lg">{img.description}</p>
                    <div className="w-8 h-1 bg-[#10b981] mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <PhotoSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

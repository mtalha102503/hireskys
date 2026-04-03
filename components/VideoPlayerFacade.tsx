'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function VideoPlayerFacade({ videoId, companyName }: { videoId: string, companyName: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe 
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`} 
        title={`${companyName} Company Culture`}
        className="absolute top-0 left-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  // YouTube ki High-Res thumbnail ka exact URL
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center group"
      onClick={() => setIsPlaying(true)}
    >
      {/* 🚀 SEO Hack: Native Next.js Image for blazing fast placeholder */}
      <Image 
        src={thumbnailUrl} 
        alt={`${companyName} Culture Video`} 
        fill 
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 800px"
        unoptimized // YouTube images don't need Next.js optimization processing
      />
      
      {/* Dark Overlay so play button pops out */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
      
      {/* 🎬 Sexy Custom Play Button */}
      <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
        <svg 
          className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 group-hover:text-white ml-1.5 transition-colors" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

const stats = [
  { label: 'Youth Registered',    value: '1258635' },
  { label: 'Listed Youth Schemes', value: '118' },
  { label: 'Student Schemes',      value: '26' },
];

export default function FloatingSearchUI() {
  return (
    <div className="w-full px-5 py-2 mt-8 relative z-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="bg-white rounded-3xl p-4 lg:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col lg:flex-row items-center gap-6">
          
          {/* Marquee Section */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 pr-6 border border-gray-100 group">
              <div className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 shadow-lg shadow-blue-900/20">
                Latest Updates
              </div>
              <div className="flex-1 overflow-hidden whitespace-nowrap py-1 relative">
                <span
                  className="text-sm font-bold text-[#1e293b] inline-block hover:[animation-play-state:paused]"
                  style={{ animation: 'scroll-text 40s linear infinite' }}
                >
                  Single Platform for Youth of Uttarakhand to get information related to Jobs, Skill development,
                  Vocational Training, Employment, Self-Employment, Higher Education, Competitive Examination,
                  Carrier Counselling, Sports, Health, Secondary Education, Start-Up, Sewayojan etc.
                </span>
                {/* Fade effects for the marquee edges */}
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Vertical Divider (Hidden on mobile) */}
          <div className="hidden lg:block w-[1px] h-12 bg-gray-100" />

          {/* Stats Dashboard */}
          <div className="flex-shrink-0 w-full lg:w-auto">
             <div className="grid grid-cols-3 gap-6 lg:gap-10">
                {[
                  { label: 'Youth Registered',     value: '12,58,635', icon: 'fa-users' },
                  { label: 'Listed Schemes',       value: '118',       icon: 'fa-file-invoice' },
                  { label: 'Student Schemes',      value: '26',        icon: 'fa-graduation-cap' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3 lg:gap-4 group cursor-default">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1e3a8a] group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                       <i className={`fas ${s.icon} text-sm lg:text-base`} />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">{s.label}</div>
                      <div className="text-sm lg:text-lg font-black text-[#1e293b] leading-none">{s.value}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

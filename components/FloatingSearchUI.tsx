'use client';

import { InfraStats } from '@/lib/api/infrastructure';

function fmt(n: number): string {
  return n.toLocaleString('en-IN');
}

const STAT_CARDS = [
  { label: 'Mahila Mangal Dal',  key: 'mahilaMangalDal'   as keyof InfraStats, icon: 'fa-female',   color: 'bg-rose-50 text-rose-600',       fallback: '15,284' },
  { label: 'Yuvak Mangal Dal',   key: 'yuvakMangalDal'    as keyof InfraStats, icon: 'fa-male',     color: 'bg-blue-50 text-blue-600',       fallback: '11,462' },
  { label: 'Multipurpose Halls', key: 'multipurposeHalls' as keyof InfraStats, icon: 'fa-building', color: 'bg-emerald-50 text-emerald-600', fallback: '118' },
  { label: 'Mini Stadiums',      key: 'miniStadiums'      as keyof InfraStats, emoji: '🏟️',         color: 'bg-amber-50 text-amber-600',     fallback: '94' },
  { label: 'Youth Hostels',      key: 'youthHostels'      as keyof InfraStats, icon: 'fa-hotel',    color: 'bg-purple-50 text-purple-600',   fallback: '26' },
  { label: 'Other Infra',        key: 'otherInfra'        as keyof InfraStats, icon: 'fa-dumbbell', color: 'bg-indigo-50 text-indigo-600',   fallback: '190' },
];

interface Props {
  stats?: InfraStats | null;
}

export default function FloatingSearchUI({ stats }: Props) {
  return (
    <div className="w-full px-5 py-4 mt-8 relative z-10">
      <div className="max-w-[1280px] mx-auto space-y-6">

        {/* Latest Updates Card */}
        <div className="bg-white rounded-2xl p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-center gap-4 bg-gray-50/50 rounded-xl p-1.5 pr-6 border border-gray-100 group">
            <div className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 shadow-lg shadow-blue-900/10">
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
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Stats Dashboard Card */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4 items-center">
            {STAT_CARDS.map(s => (
              <div key={s.label} className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4 group cursor-default text-center lg:text-left">
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ${s.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm shrink-0`}>
                  {s.emoji ? (
                    <span className="text-xl lg:text-2xl">{s.emoji}</span>
                  ) : (
                    <i className={`fas ${s.icon} text-lg lg:text-xl`} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1.5 truncate">{s.label}</div>
                  <div className="text-sm lg:text-xl font-black text-[#1e293b] leading-none">
                    {stats != null ? fmt(stats[s.key]) : s.fallback}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

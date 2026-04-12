'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/officer/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch(`/api/officer/logout`, { method: 'POST' });
    router.push('/officer/login');
  };

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          active
            ? 'bg-teal-700 text-white'
            : 'text-teal-100 hover:bg-teal-700 hover:text-white'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-teal-800 text-white flex flex-col">
        <div className="px-4 py-5 border-b border-teal-700">
          <h1 className="text-lg font-bold leading-tight">Officer Portal</h1>
          <p className="text-xs text-teal-300 mt-0.5">Yuva Shakti Portal</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            {navLink('/officer/dashboard', 'Dashboard')}
          </div>

          <div className="space-y-1">
            <h3 className="px-4 text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2">Mangal Dal</h3>
            {navLink('/officer/mahila-mangal-dal', 'Mahila Mangal Dal')}
            {navLink('/officer/yuvak-mangal-dal', 'Yuvak Mangal Dal')}
          </div>

          <div className="space-y-1">
            <h3 className="px-4 text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2">Infrastructure</h3>
            {navLink('/officer/multipurpose-halls', 'Multipurpose Halls')}
            {navLink('/officer/mini-stadiums', 'Mini Stadiums')}
            {navLink('/officer/youth-hostels', 'Youth Hostels')}
            {navLink('/officer/vocational-training-centers', 'Vocational Training Centers')}
            {navLink('/officer/indoor-gym', 'Indoor Gym')}
            {navLink('/officer/open-gym', 'Open Gym')}
            {navLink('/officer/khel-maidaan', 'Khel Maidaan')}
          </div>
        </nav>
        <div className="px-2 py-4 border-t border-teal-700">
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 rounded-md text-sm font-medium text-teal-100 hover:bg-teal-700 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}

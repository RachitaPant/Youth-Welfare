'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/about', label: t('nav_about') },
    { href: '/gallery', label: t('nav_gallery') },
    { href: '#', label: t('nav_rti') },
    { href: '/downloads', label: t('nav_downloads') },
    { href: '/contact', label: t('nav_contact') },
  ];

  return (
    <header className="relative bg-white shadow-[0_2px_15px_rgba(0,0,0,0.08)] w-full z-[100]">
      <div className="max-w-[1500px] mx-auto flex justify-between items-center py-3 lg:py-4 px-4 sm:px-10 gap-4">
        {/* Left: Logos + title */}
        <div className="flex items-center gap-3 lg:gap-5 flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative w-10 h-10 lg:w-[60px] lg:h-[60px]">
              <Image src="/images/gov-logo.png" alt="Ashoka Chakra" fill className="object-contain" />
            </div>
            <div className="relative w-12 h-12 lg:w-[70px] lg:h-[70px]">
              <Image src="/images/logo.png" alt="Youth Welfare Logo" fill className="object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-sm lg:text-xl font-extrabold text-[#1e3a8a] m-0 leading-tight">
              {t('dept_name')}
            </h1>
            <p className="text-[9px] lg:text-xs text-[#666] m-0 font-medium uppercase tracking-tight">{t('dept_sub')}</p>
          </div>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="list-none p-0 m-0 flex gap-6 xl:gap-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="no-underline text-[#2c3e50] font-bold text-[13px] uppercase tracking-tight py-2 hover:text-[#1e3a8a] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 lg:gap-5 flex-shrink-0">
          {/* Login Dropdown */}
          <div className="relative group">
            <button className="bg-[#1e3a8a] text-white font-bold text-[9px] lg:text-sm py-1.5 lg:py-2.5 px-3 lg:px-6 rounded-xl hover:bg-[#1e40af] transition-all flex items-center gap-1 lg:gap-2 shadow-lg shadow-blue-900/20">
              Login <i className="fas fa-chevron-down text-[7px] lg:text-[10px] group-hover:rotate-180 transition-transform duration-300" />
            </button>

            <div className="absolute top-full right-0 mt-2 w-48 lg:w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl">
              <div className="px-4 py-2 mb-2 border-b border-gray-50">
                <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Portal</p>
              </div>
              <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 text-xs lg:text-sm font-bold text-[#1e293b] hover:bg-blue-50 hover:text-[#1e3a8a] transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1e3a8a]"><i className="fas fa-user text-xs" /></div>
                Public Login
              </Link>
              <Link href="/officer/login" className="flex items-center gap-3 px-4 py-2.5 text-xs lg:text-sm font-bold text-[#1e293b] hover:bg-green-50 hover:text-green-600 transition-all">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><i className="fas fa-user-shield text-xs" /></div>
                Officer Login
              </Link>
            </div>
          </div>

          <button className="hidden lg:block text-gray-600 hover:text-[#1e3a8a] transition-colors p-1 lg:p-2">
            <i className="fas fa-search text-base lg:text-lg" />
          </button>

          {/* Mobile Hamburger */}
          <button
            id="menuToggle"
            onClick={() => setMenuOpen(o => !o)}
            className="text-xl lg:hidden z-[110] p-1 text-[#1e3a8a]"
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay & Drawer (unchanged logic) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setMenuOpen(false)} />
      )}
      <nav className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[105] transform transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 pt-24">
          <ul className="list-none p-0 m-0 flex flex-col gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} onClick={() => setMenuOpen(false)} className="no-underline text-[#1e293b] font-bold text-lg block py-2 border-b border-gray-50 hover:text-[#1e3a8a]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

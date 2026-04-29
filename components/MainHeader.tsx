'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: '/',          label: t('nav_home') },
    { href: '/about',     label: t('nav_about') },
    { href: '/gallery',   label: t('nav_gallery') },
    { href: '#',          label: t('nav_rti') },
    { href: '/downloads', label: t('nav_downloads') },
    { href: '/contact',   label: t('nav_contact') },
  ];

  return (
    <header className="flex justify-between items-center py-5 px-10 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] w-full box-border">
      {/* Left: Logos + title */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4">
          <Image
            src="/images/gov-logo.png"
            alt="Ashoka Chakra"
            width={70}
            height={70}
            className="object-contain"
          />
          <Image
            src="/images/logo.png"
            alt="Youth Welfare Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a8a] m-0 leading-tight">
            {t('dept_name').includes('and') ? (
              <>
                {t('dept_name').split(' and ')[0]} <br />and {t('dept_name').split(' and ')[1]}
              </>
            ) : (
              t('dept_name')
            )}
          </h1>
          <p className="text-sm text-[#666] m-0 font-medium">{t('dept_sub')}</p>
        </div>
      </div>

      {/* Right: Nav + actions */}
      <div className="flex items-center gap-8">
        {/* Hamburger — mobile only */}
        <button
          id="menuToggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
          className="text-2xl bg-none border-none cursor-pointer lg:hidden"
        >
          &#9776;
        </button>

        {/* Nav */}
        <nav className={`${menuOpen ? 'flex' : 'hidden'} lg:flex`}>
          <ul className="list-none p-0 m-0 flex gap-10 justify-center flex-col lg:flex-row absolute lg:static top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none px-5 lg:px-0 pb-4 lg:pb-0 z-50">
            {navLinks.map(({ href, label }) => (
              <li key={href} className="inline-block">
                <Link
                  href={href}
                  className="no-underline text-[#2c3e50] font-medium text-sm py-2 inline-block hover:text-[#0066cc] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Login Dropdown */}
          <div className="relative group">
            <button className="bg-[#1e3a8a] text-white font-bold text-sm py-2.5 px-6 rounded-xl hover:bg-[#1e40af] transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95">
              Login <i className="fas fa-chevron-down text-[10px] group-hover:rotate-180 transition-transform duration-300" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl">
              <div className="px-4 py-2 mb-2 border-b border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Portal</p>
              </div>
              <Link 
                href="/login" 
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#1e293b] hover:bg-blue-50 hover:text-[#1e3a8a] transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1e3a8a]">
                  <i className="fas fa-user text-xs" />
                </div>
                Public Login
              </Link>
              <Link 
                href="/officer/login" 
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#1e293b] hover:bg-green-50 hover:text-green-600 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <i className="fas fa-user-shield text-xs" />
                </div>
                Officer Login
              </Link>
              <Link 
                href="/admin/login" 
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#1e293b] hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <i className="fas fa-user-cog text-xs" />
                </div>
                Admin Login
              </Link>
            </div>
          </div>
          <button className="bg-none border-none text-lg text-[#666] cursor-pointer p-2 rounded-full hover:bg-[#f0f0f0] hover:text-[#1e3a8a] transition-all">
            <i className="fas fa-search" />
          </button>
        </div>
      </div>
    </header>
  );
}

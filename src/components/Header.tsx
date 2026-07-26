'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretDown, List, X, CalendarCheck, PhoneCall } from '@phosphor-icons/react';
import { LOCAL_NAP } from '../data/siteData';
import { useBooking } from '../context/BookingContext';

export const Header: React.FC = () => {
  const currentPath = usePathname() || '/';
  const { openBookingModal } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const isServicesActive = currentPath.startsWith('/services');

  return (
    <header className="sticky top-0 z-40 bg-[#FBF6EF]/90 backdrop-blur-md border-b border-[#EFD4CE]/40 transition-all">
      {/* Top micro bar with location and phone */}
      <div className="bg-[#423341] text-[#FBF6EF] text-xs py-1.5 px-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto font-body">
        <div className="flex items-center gap-2">
          <span>📍 {LOCAL_NAP.address}</span>
          <span className="hidden sm:inline text-[#EFD4CE]">•</span>
          <span className="hidden sm:inline">56 Five-Star Google Reviews</span>
        </div>
        <div className="flex items-center gap-4 mt-1 sm:mt-0">
          <a
            href={`tel:${LOCAL_NAP.phone_clean}`}
            className="hover:text-[#EFD4CE] transition-colors flex items-center gap-1"
          >
            <PhoneCall size={14} weight="regular" />
            <span>{LOCAL_NAP.phone}</span>
          </a>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#EFD4CE]/60 flex items-center justify-center text-[#423341] group-hover:bg-[#A7B596]/30 transition-colors">
            <svg width="22" height="22" viewBox="0 0 64 64" fill="none" stroke="#423341" strokeWidth="2">
              <path d="M32 16C28 12 22 14 20 18C18 22 20 28 24 30C22 34 26 40 32 40C38 40 42 34 40 30C44 28 46 22 44 18C42 14 36 12 32 16Z" />
              <path d="M32 40V56" />
            </svg>
          </div>
          <div>
            <span className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#423341] block leading-none">
              Falguni's Photography
            </span>
            <span className="font-body text-[11px] text-[#423341]/70 tracking-widest uppercase block mt-0.5">
              Northfield Studio • Adelaide
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-body text-sm font-medium text-[#423341]">
          <Link
            href="/"
            className={`transition-colors hover:text-[#A7B596] ${
              currentPath === '/' ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
            }`}
          >
            Home
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <Link
              href="/services"
              className={`flex items-center gap-1 transition-colors hover:text-[#A7B596] py-2 ${
                isServicesActive ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
              }`}
            >
              Services
              <CaretDown size={14} weight="regular" className="mt-0.5" />
            </Link>

            {servicesDropdownOpen && (
              <div className="absolute left-0 top-full pt-1 w-64 z-50">
                <div className="bg-[#FBF6EF] border border-[#EFD4CE] rounded-2xl shadow-lg p-2 space-y-1">
                  <Link
                    href="/services"
                    className="block px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold text-[#423341]/60 hover:bg-[#EFD4CE]/30 transition-colors"
                  >
                    All Services Overview
                  </Link>
                  <hr className="border-[#EFD4CE]/50 my-1" />
                  <Link
                    href="/services/newborn-photography"
                    className="block px-3 py-2 rounded-xl text-sm text-[#423341] hover:bg-[#EFD4CE]/40 transition-colors"
                  >
                    Newborn Photography
                  </Link>
                  <Link
                    href="/services/maternity-photography"
                    className="block px-3 py-2 rounded-xl text-sm text-[#423341] hover:bg-[#EFD4CE]/40 transition-colors"
                  >
                    Maternity Photography
                  </Link>
                  <Link
                    href="/services/family-photography"
                    className="block px-3 py-2 rounded-xl text-sm text-[#423341] hover:bg-[#EFD4CE]/40 transition-colors"
                  >
                    Family Photography
                  </Link>
                  <Link
                    href="/services/cake-smash-photography"
                    className="block px-3 py-2 rounded-xl text-sm text-[#423341] hover:bg-[#EFD4CE]/40 transition-colors"
                  >
                    Cake Smash Photography
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/gallery"
            className={`transition-colors hover:text-[#A7B596] ${
              currentPath === '/gallery' ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
            }`}
          >
            Gallery
          </Link>

          <Link
            href="/about"
            className={`transition-colors hover:text-[#A7B596] ${
              currentPath === '/about' ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
            }`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`transition-colors hover:text-[#A7B596] ${
              currentPath === '/contact' ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => openBookingModal()}
            className="bg-[#A7B596] hover:bg-[#95a384] text-[#423341] font-body font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarCheck size={18} weight="regular" />
            Book Session
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => openBookingModal()}
            className="bg-[#A7B596] text-[#423341] font-body text-xs font-semibold px-3.5 py-2 rounded-full cursor-pointer"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#423341] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <List size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF6EF] border-b border-[#EFD4CE] px-6 py-6 space-y-4 font-body animate-fade-in">
          <Link
            href="/"
            className="block text-base font-medium text-[#423341] py-1 border-b border-[#EFD4CE]/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <div className="space-y-2 pl-2">
            <Link
              href="/services"
              className="block text-sm font-semibold text-[#423341]/70 uppercase tracking-wider py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services Overview
            </Link>
            <Link
              href="/services/newborn-photography"
              className="block text-sm text-[#423341] py-1 pl-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Newborn Photography
            </Link>
            <Link
              href="/services/maternity-photography"
              className="block text-sm text-[#423341] py-1 pl-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Maternity Photography
            </Link>
            <Link
              href="/services/family-photography"
              className="block text-sm text-[#423341] py-1 pl-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Family Photography
            </Link>
            <Link
              href="/services/cake-smash-photography"
              className="block text-sm text-[#423341] py-1 pl-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Cake Smash Photography
            </Link>
          </div>
          <Link
            href="/gallery"
            className="block text-base font-medium text-[#423341] py-1 border-b border-[#EFD4CE]/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            href="/about"
            className="block text-base font-medium text-[#423341] py-1 border-b border-[#EFD4CE]/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block text-base font-medium text-[#423341] py-1 border-b border-[#EFD4CE]/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full bg-[#A7B596] text-[#423341] font-semibold py-3 rounded-full text-center cursor-pointer"
            >
              Book Your Session Online
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

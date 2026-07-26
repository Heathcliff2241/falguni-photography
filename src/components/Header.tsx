// Header Component - Pure React Navigation
import React, { useState } from 'react';
import { CaretDown, List, X, CalendarCheck, PhoneCall } from '@phosphor-icons/react';
import { LOCAL_NAP } from '../data/siteData';
import { BotanicalRose } from './BotanicalAccents';

interface HeaderProps {
  currentPath: string;
  onOpenBooking: (service?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const isServicesActive = currentPath.startsWith('/services');

  return (
    <header className="sticky top-0 z-40 bg-[#FBF6EF]/90 backdrop-blur-md border-b border-[#EFD4CE]/40 transition-all">
      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EFD4CE]/60 flex items-center justify-center text-[#423341] group-hover:bg-[#A7B596]/30 transition-colors shadow-sm">
            <BotanicalRose color="blush" size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#423341] block leading-none">
                Falguni's Photography
              </span>
              <BotanicalRose color="sage" size={20} className="hidden sm:inline-block text-[#A7B596] opacity-90" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#423341]/70 font-body tracking-wider mt-1">
              <span>Northfield Studio</span>
              <span className="text-[#A7B596]">•</span>
              <span>Adelaide SA</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-body text-sm font-medium text-[#423341]">
          <a
            href="/"
            className={`transition-colors hover:text-[#A7B596] ${
              currentPath === '/' ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
            }`}
          >
            Home
          </a>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <a
              href="/services"
              className={`flex items-center gap-1 transition-colors hover:text-[#A7B596] py-2 ${
                isServicesActive ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
              }`}
            >
              Services
              <CaretDown size={14} weight="regular" className="mt-0.5" />
            </a>

            {servicesDropdownOpen && (
              <div className="absolute left-0 top-full pt-1 w-64 z-50">
                <div className="bg-[#FBF6EF] border border-[#EFD4CE] rounded-2xl shadow-lg p-2 space-y-1">
                  <a
                    href="/services"
                    className="block px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold text-[#423341]/60 hover:bg-[#EFD4CE]/30 transition-colors"
                  >
                    All Services Overview
                  </a>
                  <hr className="border-[#EFD4CE]/50 my-1" />
                  <a
                    href="/services/newborn-photography"
                    className="block px-3 py-2 rounded-xl text-sm text-[#423341] hover:bg-[#EFD4CE]/40 transition-colors"
                  >
                    Newborn Photography
                  </a>
                  <a
                    href="/services/maternity-photography"
                    className="block px-3 py-2 rounded-xl text-sm text-[#423341] hover:bg-[#EFD4CE]/40 transition-colors"
                  >
                    Maternity Photography
                  </a>
                  <a
                    href="/services/family-photography"
                    className="block px-3 py-2 rounded-xl text-sm text-[#423341] hover:bg-[#EFD4CE]/40 transition-colors"
                  >
                    Family Photography
                  </a>
                  <a
                    href="/services/cake-smash-photography"
                    className="block px-3 py-2 rounded-xl text-sm text-[#423341] hover:bg-[#EFD4CE]/40 transition-colors"
                  >
                    Cake Smash Photography
                  </a>
                </div>
              </div>
            )}
          </div>

          <a
            href="/gallery"
            className={`transition-colors hover:text-[#A7B596] ${
              currentPath === '/gallery' ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
            }`}
          >
            Gallery
          </a>

          <a
            href="/about"
            className={`transition-colors hover:text-[#A7B596] ${
              currentPath === '/about' ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
            }`}
          >
            About
          </a>

          <a
            href="/contact"
            className={`transition-colors hover:text-[#A7B596] ${
              currentPath === '/contact' ? 'text-[#423341] font-semibold border-b-2 border-[#A7B596] pb-1' : 'text-[#423341]/80'
            }`}
          >
            Contact
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => onOpenBooking()}
            className="bg-[#A7B596] hover:bg-[#95a384] text-[#423341] font-body font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <CalendarCheck size={18} weight="regular" />
            Book Session
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => onOpenBooking()}
            className="bg-[#A7B596] text-[#423341] font-body text-xs font-semibold px-3.5 py-2 rounded-full"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#423341] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <List size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF6EF] border-b border-[#EFD4CE] px-6 py-6 space-y-4 font-body animate-fade-in">
          <a
            href="/"
            className="block text-base font-medium text-[#423341] py-1 border-b border-[#EFD4CE]/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <div className="space-y-2 pl-2">
            <a
              href="/services"
              className="block text-sm font-semibold text-[#423341]/70 uppercase tracking-wider py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services Overview
            </a>
            <a
              href="/services/newborn-photography"
              className="block text-sm text-[#423341] py-1 pl-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Newborn Photography
            </a>
            <a
              href="/services/maternity-photography"
              className="block text-sm text-[#423341] py-1 pl-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Maternity Photography
            </a>
            <a
              href="/services/family-photography"
              className="block text-sm text-[#423341] py-1 pl-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Family Photography
            </a>
            <a
              href="/services/cake-smash-photography"
              className="block text-sm text-[#423341] py-1 pl-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Cake Smash Photography
            </a>
          </div>
          <a
            href="/gallery"
            className="block text-base font-medium text-[#423341] py-1 border-b border-[#EFD4CE]/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Gallery
          </a>
          <a
            href="/about"
            className="block text-base font-medium text-[#423341] py-1 border-b border-[#EFD4CE]/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="/contact"
            className="block text-base font-medium text-[#423341] py-1 border-b border-[#EFD4CE]/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#A7B596] text-[#423341] font-semibold py-3 rounded-full text-center"
            >
              Book Your Session Online
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Footer Component - Pure React Layout
import React from 'react';
import { LOCAL_NAP } from '../data/siteData';
import { BotanicalRose } from './BotanicalAccents';
import { PhoneCall, MapPin, EnvelopeSimple, InstagramLogo, FacebookLogo, Heart } from '@phosphor-icons/react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#423341] text-[#FBF6EF] font-body pt-16 pb-12 border-t border-[#EFD4CE]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#EFD4CE]/20">
          {/* Studio NAP & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BotanicalRose color="blush" size={32} />
              <span className="font-display text-2xl font-medium tracking-tight text-[#EFD4CE]">
                Falguni's Photography
              </span>
            </div>
            <p className="text-sm text-[#FBF6EF]/80 leading-relaxed">
              Husband-and-wife newborn, maternity, and family photography studio in Northfield, Adelaide.
              Gentle, unhurried sessions paced around your baby's needs.
            </p>
            <div className="bg-[#EFD4CE]/10 p-3 rounded-2xl border border-[#EFD4CE]/20 inline-block">
              <div className="flex items-center gap-1.5 text-xs text-[#EFD4CE] font-semibold">
                <span>★★★★★ 5.0 Rating</span>
                <span className="text-[#FBF6EF]/60">•</span>
                <span className="text-[#FBF6EF]">56 Google Reviews</span>
              </div>
            </div>
          </div>

          {/* Quick NAP Contact Info */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-medium text-[#EFD4CE] tracking-wide">
              Studio Location
            </h3>
            <ul className="space-y-3 text-sm text-[#FBF6EF]/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-[#EFD4CE] shrink-0 mt-0.5" />
                <span>{LOCAL_NAP.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall size={18} className="text-[#EFD4CE] shrink-0" />
                <a href={`tel:${LOCAL_NAP.phone_clean}`} className="hover:text-[#EFD4CE] transition-colors">
                  {LOCAL_NAP.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <EnvelopeSimple size={18} className="text-[#EFD4CE] shrink-0" />
                <a href="mailto:cesaresmero2@gmail.com" className="hover:text-[#EFD4CE] transition-colors">
                  Contact Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Photography Services */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-medium text-[#EFD4CE] tracking-wide">
              Photography Sessions
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FBF6EF]/80">
              <li>
                <a href="/services/newborn-photography" className="hover:text-[#EFD4CE] transition-colors">
                  Newborn Photography (5-14 days)
                </a>
              </li>
              <li>
                <a href="/services/maternity-photography" className="hover:text-[#EFD4CE] transition-colors">
                  Maternity Photography (28-34 weeks)
                </a>
              </li>
              <li>
                <a href="/services/family-photography" className="hover:text-[#EFD4CE] transition-colors">
                  Family Photography
                </a>
              </li>
              <li>
                <a href="/services/cake-smash-photography" className="hover:text-[#EFD4CE] transition-colors">
                  Cake Smash & First Birthday
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-[#EFD4CE] transition-colors text-xs uppercase tracking-wider text-[#A7B596]">
                  View All Packages →
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Navigation & Socials */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-medium text-[#EFD4CE] tracking-wide">
              Explore & Connect
            </h3>
            <ul className="space-y-2 text-sm text-[#FBF6EF]/80">
              <li><a href="/gallery" className="hover:text-[#EFD4CE] transition-colors">Portfolio Gallery</a></li>
              <li><a href="/about" className="hover:text-[#EFD4CE] transition-colors">About Falguni & Team</a></li>
              <li><a href="/contact" className="hover:text-[#EFD4CE] transition-colors">Contact & Directions</a></li>
              <li><a href="/admin/leads" className="hover:text-[#EFD4CE] transition-colors text-xs text-[#EFD4CE]/70">Admin Lead Log</a></li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#EFD4CE]/20 flex items-center justify-center text-[#EFD4CE] hover:bg-[#EFD4CE] hover:text-[#423341] transition-all"
                aria-label="Instagram Profile"
              >
                <InstagramLogo size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#EFD4CE]/20 flex items-center justify-center text-[#EFD4CE] hover:bg-[#EFD4CE] hover:text-[#423341] transition-all"
                aria-label="Facebook Page"
              >
                <FacebookLogo size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FBF6EF]/60 gap-4">
          <p>© {new Date().getFullYear()} {LOCAL_NAP.business_name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart size={14} weight="fill" className="text-[#EFD4CE]" /> for Adelaide families in Northfield, Lightsview & Klemzig.
          </p>
        </div>
      </div>
    </footer>
  );
};

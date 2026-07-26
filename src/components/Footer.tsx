// Footer Component - Pure React Layout
import React from 'react';
import { LOCAL_NAP } from '../data/siteData';
import { BotanicalRose } from './BotanicalAccents';
import { PhoneCall, MapPin, EnvelopeSimple, InstagramLogo, FacebookLogo, Heart } from '@phosphor-icons/react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C121B] text-[#FBF6EF] font-body pt-16 pb-12 border-t-2 border-[#D8C2B8]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#D8C2B8]/30">
          {/* Studio NAP & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BotanicalRose color="blush" size={32} />
              <span className="font-display text-2xl font-bold tracking-tight text-[#FBF6EF]">
                Falguni's Photography
              </span>
            </div>
            <p className="text-sm text-[#FBF6EF] font-medium leading-relaxed">
              Boutique newborn, maternity, and family photography studio in Northfield, Adelaide.
              Gentle, unhurried sessions paced around your baby's needs.
            </p>
            <div className="bg-[#2D1D2C] p-3 rounded-2xl border border-[#EFD4CE]/40 inline-block shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-[#FBF6EF] font-bold">
                <span className="text-[#F59E0B]">★ 5.0 Rating</span>
                <span className="text-[#FBF6EF]/60">•</span>
                <span className="text-[#FBF6EF]">56 Google Reviews</span>
              </div>
            </div>
          </div>

          {/* Studio Location & Interactive Map */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-[#FBF6EF] tracking-wide flex items-center gap-2">
              <MapPin size={20} className="text-[#C2D1B2]" weight="bold" />
              Studio Location
            </h3>
            <ul className="space-y-2 text-sm text-[#FBF6EF]">
              <li>
                <span className="font-bold text-[#FBF6EF]">{LOCAL_NAP.address}</span>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <PhoneCall size={18} className="text-[#C2D1B2] shrink-0" weight="bold" />
                <a href={`tel:${LOCAL_NAP.phone_clean}`} className="font-bold underline hover:text-[#C2D1B2] transition-colors">
                  {LOCAL_NAP.phone}
                </a>
              </li>
            </ul>

            {/* Google Map Embed Frame */}
            <div className="rounded-2xl overflow-hidden border-2 border-[#D8C2B8]/40 bg-[#2D1D2C] shadow-md">
              <iframe
                title="Falguni's Photography Studio Location - Northfield SA"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3274.288210344234!2d138.62272507647248!3d-34.85692697286469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0c92fb3874d15%3A0x6b6cddb32267b2d5!2s26%20South%20Pkwy%2C%20Northfield%20SA%205085!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-[140px] opacity-95 hover:opacity-100 transition-opacity"
              ></iframe>
              <a
                href="https://maps.app.goo.gl/Yif226m28rnSjBNq9"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-bold py-2.5 bg-[#2D1D2C] hover:bg-[#3D293B] text-[#FBF6EF] transition-all border-t border-[#D8C2B8]/40"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Photography Services */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-[#FBF6EF] tracking-wide">
              Photography Sessions
            </h3>
            <ul className="space-y-2.5 text-sm font-medium text-[#FBF6EF]">
              <li>
                <a href="/services/newborn-photography" className="hover:text-[#C2D1B2] transition-colors">
                  Newborn Photography (5-14 days)
                </a>
              </li>
              <li>
                <a href="/services/maternity-photography" className="hover:text-[#C2D1B2] transition-colors">
                  Maternity Photography (28-34 weeks)
                </a>
              </li>
              <li>
                <a href="/services/family-photography" className="hover:text-[#C2D1B2] transition-colors">
                  Family Photography
                </a>
              </li>
              <li>
                <a href="/services/cake-smash-photography" className="hover:text-[#C2D1B2] transition-colors">
                  Cake Smash & First Birthday
                </a>
              </li>
              <li className="pt-1">
                <a href="/services" className="hover:text-[#C2D1B2] transition-colors text-xs font-bold uppercase tracking-wider text-[#C2D1B2] underline">
                  View All Packages →
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Navigation & Socials */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-[#FBF6EF] tracking-wide">
              Explore & Connect
            </h3>
            <ul className="space-y-2 text-sm font-medium text-[#FBF6EF]">
              <li><a href="/gallery" className="hover:text-[#C2D1B2] transition-colors">Portfolio Gallery</a></li>
              <li><a href="/about" className="hover:text-[#C2D1B2] transition-colors">About Falguni & Team</a></li>
              <li><a href="/contact" className="hover:text-[#C2D1B2] transition-colors">Contact & Directions</a></li>
              <li><a href="/admin/leads" className="hover:text-[#C2D1B2] transition-colors text-xs text-[#FBF6EF]/70">Admin Lead Log</a></li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2D1D2C] flex items-center justify-center text-[#FBF6EF] border border-[#D8C2B8]/40 hover:bg-[#FBF6EF] hover:text-[#1C121B] transition-all"
                aria-label="Instagram Profile"
              >
                <InstagramLogo size={22} weight="bold" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2D1D2C] flex items-center justify-center text-[#FBF6EF] border border-[#D8C2B8]/40 hover:bg-[#FBF6EF] hover:text-[#1C121B] transition-all"
                aria-label="Facebook Page"
              >
                <FacebookLogo size={22} weight="bold" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FBF6EF]/80 font-medium gap-4">
          <p>© {new Date().getFullYear()} {LOCAL_NAP.business_name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart size={14} weight="fill" className="text-[#EFD4CE]" /> for Adelaide families in Northfield, Lightsview & Klemzig.
          </p>
        </div>
      </div>
    </footer>
  );
};

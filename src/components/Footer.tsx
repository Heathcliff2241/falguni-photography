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
              Boutique newborn, maternity, and family photography studio in Northfield, Adelaide.
              Gentle, unhurried sessions paced around your baby's needs.
            </p>
            <div className="bg-[#EFD4CE]/10 p-3 rounded-2xl border border-[#EFD4CE]/20 inline-block">
              <div className="flex items-center gap-1.5 text-xs text-[#EFD4CE] font-semibold">
                <span>5.0 Rating</span>
                <span className="text-[#FBF6EF]/60">•</span>
                <span className="text-[#FBF6EF]">56 Google Reviews</span>
              </div>
            </div>
          </div>

          {/* Studio Location & Interactive Map */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-medium text-[#EFD4CE] tracking-wide flex items-center gap-2">
              <MapPin size={20} className="text-[#EFD4CE]" />
              Studio Location
            </h3>
            <ul className="space-y-2 text-sm text-[#FBF6EF]/80">
              <li>
                <span className="font-semibold text-[#FBF6EF]">{LOCAL_NAP.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall size={16} className="text-[#EFD4CE] shrink-0" />
                <a href={`tel:${LOCAL_NAP.phone_clean}`} className="hover:text-[#EFD4CE] transition-colors">
                  {LOCAL_NAP.phone}
                </a>
              </li>
            </ul>

            {/* Google Map Embed Frame */}
            <div className="rounded-2xl overflow-hidden border border-[#EFD4CE]/30 bg-[#322631] shadow-inner">
              <iframe
                title="Falguni's Photography Studio Location - Northfield SA"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3274.288210344234!2d138.62272507647248!3d-34.85692697286469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0c92fb3874d15%3A0x6b6cddb32267b2d5!2s26%20South%20Pkwy%2C%20Northfield%20SA%205085!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-[140px] opacity-90 hover:opacity-100 transition-opacity"
              ></iframe>
              <a
                href="https://maps.app.goo.gl/Yif226m28rnSjBNq9"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-semibold py-2 bg-[#EFD4CE]/10 hover:bg-[#EFD4CE] text-[#EFD4CE] hover:text-[#423341] transition-all border-t border-[#EFD4CE]/20"
              >
                Open in Google Maps
              </a>
            </div>
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

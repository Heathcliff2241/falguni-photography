'use client';

import React, { useState } from 'react';
import { SITE_PAGES, LOCAL_NAP } from '../../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../../components/BotanicalAccents';
import { PhoneCall, MapPin, EnvelopeSimple, CalendarCheck, CheckCircle, Spinner } from '@phosphor-icons/react';

export default function ContactPage() {
  const page = SITE_PAGES.contact;
  const hero = page.sections[0];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('newborn');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMsg('Please enter your name, phone, and email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          serviceRequested: service,
          notes: message
        })
      });

      const data = await res.json();
      if (data.status === 'ok') {
        setSubmitted(true);
      } else {
        setErrorMsg('Something went wrong. Please call +61 469 753 238.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please call +61 469 753 238.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[#FBF6EF] space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BotanicalRose color="sage" size={32} />
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-[#A7B596]">
              Direct Studio Contact • Northfield SA
            </span>
            <BotanicalRose color="blush" size={32} />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-[#423341] font-medium tracking-tight">
            {hero.headline}
          </h1>

          <p className="font-display text-xl text-[#423341]/90 italic">
            {hero.subheadline}
          </p>

          <p className="font-body text-base text-[#423341]/80 leading-relaxed">
            {hero.body_copy}
          </p>
        </div>

        <BotanicalVineDivider />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          
          {/* Left Column: NAP Block & Map Info */}
          <div className="lg:col-span-5 space-y-6 font-body">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFD4CE] shadow-[0_8px_30px_rgba(66,51,65,0.06)] space-y-6">
              <h2 className="font-display text-2xl text-[#423341] font-medium border-b border-[#EFD4CE]/60 pb-3">
                Studio Contact Details
              </h2>

              <ul className="space-y-4 text-sm text-[#423341]">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EFD4CE]/50 flex items-center justify-center text-[#423341] shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="font-semibold text-xs uppercase tracking-wider text-[#A7B596] block">Studio Address</span>
                    <span className="font-medium text-base">{LOCAL_NAP.address}</span>
                    <p className="text-xs text-[#423341]/70 mt-0.5">Serving Northfield, Lightsview, Klemzig & Northern Adelaide</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EFD4CE]/50 flex items-center justify-center text-[#423341] shrink-0 mt-0.5">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <span className="font-semibold text-xs uppercase tracking-wider text-[#A7B596] block">Direct Phone</span>
                    <a href={`tel:${LOCAL_NAP.phone_clean}`} className="font-medium text-base hover:text-[#A7B596] transition-colors">
                      {LOCAL_NAP.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EFD4CE]/50 flex items-center justify-center text-[#423341] shrink-0 mt-0.5">
                    <EnvelopeSimple size={20} />
                  </div>
                  <div>
                    <span className="font-semibold text-xs uppercase tracking-wider text-[#A7B596] block">Email Inquiries</span>
                    <a href="mailto:cesaresmero2@gmail.com" className="font-medium text-base hover:text-[#A7B596] transition-colors">
                      cesaresmero2@gmail.com
                    </a>
                  </div>
                </li>
              </ul>

              <div className="bg-[#EFD4CE]/30 p-4 rounded-2xl border border-[#EFD4CE] space-y-1">
                <span className="font-semibold text-xs text-[#423341]">💬 Instant Booking with Poppy</span>
                <p className="text-xs text-[#423341]/80 leading-relaxed">
                  Click the floating "Chat with Poppy" button at the bottom right to check availability and book interactively 24/7!
                </p>
              </div>
            </div>

            {/* Studio Photo */}
            <div className="bg-white p-3 rounded-3xl border border-[#EFD4CE] shadow-sm">
              <img
                src={typeof hero.image_source === 'string' ? hero.image_source : hero.image_source?.src || hero.image_source}
                alt={hero.image_alt_text}
                className="w-full h-48 object-cover rounded-2xl"
              />
              <p className="text-center font-display text-sm text-[#423341] mt-2 font-medium">
                Northfield Studio Interior • Organic Props & Wraps
              </p>
            </div>
          </div>

          {/* Right Column: Direct Contact & Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFD4CE] shadow-[0_12px_40px_rgba(66,51,65,0.08)] font-body">
              {!submitted ? (
                <div>
                  <h2 className="font-display text-2xl text-[#423341] font-medium mb-1">
                    Send Falguni a Message
                  </h2>
                  <p className="text-xs text-[#423341]/70 mb-6">
                    Fill out the form below or chat with Poppy. Falguni confirms all inquiries within 24 hours.
                  </p>

                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 text-xs rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 text-sm text-[#423341]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jessica Miller"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full bg-[#FBF6EF] border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0412 345 678"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full bg-[#FBF6EF] border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. jessica@example.com.au"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-[#FBF6EF] border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                        Service Requested
                      </label>
                      <select
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="w-full bg-[#FBF6EF] border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                      >
                        <option value="newborn">Newborn Photography (5-14 days)</option>
                        <option value="maternity">Maternity Photography (28-34 weeks)</option>
                        <option value="family">Family Photography</option>
                        <option value="cake-smash">Cake Smash & First Birthday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                        Your Message / Preferred Dates / Due Date
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your baby's due date, preferred session time, or any questions..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full bg-[#FBF6EF] border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#A7B596] hover:bg-[#96a585] text-[#423341] font-semibold text-base py-3.5 rounded-full shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <Spinner size={20} className="animate-spin" />
                      ) : (
                        <>
                          <CalendarCheck size={20} /> Send Inquiry
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={56} weight="fill" className="text-[#A7B596] mx-auto mb-3" />
                  <h3 className="font-display text-2xl font-medium text-[#423341] mb-2">
                    Message Received!
                  </h3>
                  <p className="text-sm text-[#423341]/90 leading-relaxed max-w-md mx-auto mb-6 bg-[#EFD4CE]/30 p-4 rounded-2xl border border-[#EFD4CE]">
                    Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours. If your dates are flexible, mention that and she'll do her best to work around them.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-[#A7B596] text-[#423341] font-semibold text-sm px-6 py-2 rounded-full cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { SITE_PAGES, LOCAL_NAP } from '../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../components/BotanicalAccents';
import { TapeStrip } from '../components/TapeStrip';
import { PhoneCall, MapPin, EnvelopeSimple, CalendarCheck, CheckCircle, Spinner } from '@phosphor-icons/react';

interface ContactViewProps {
  onOpenBooking: (service?: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onOpenBooking }) => {
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
          <h1 className="font-display text-4xl sm:text-5xl text-[#1C121B] font-bold tracking-tight">
            {hero.headline}
          </h1>

          <p className="font-display text-xl text-[#2D1D2C] font-semibold italic">
            {hero.subheadline}
          </p>

          <p className="font-body text-base sm:text-lg text-[#1C121B] font-medium leading-relaxed">
            {hero.body_copy}
          </p>
        </div>

        <BotanicalVineDivider />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          
          {/* Left Column: NAP Block & Map Info */}
          <div className="lg:col-span-5 space-y-6 font-body">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#D8C2B8] shadow-md space-y-6">
              <h2 className="font-display text-2xl text-[#1C121B] font-bold border-b-2 border-[#D8C2B8] pb-3">
                Studio Contact Details
              </h2>

              <ul className="space-y-5 text-sm text-[#1C121B]">
                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E1E7D8] flex items-center justify-center text-[#2E4323] shrink-0 mt-0.5 border border-[#A7B596]">
                    <MapPin size={20} weight="bold" />
                  </div>
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[#2E4323] block">Studio Address</span>
                    <span className="font-bold text-base text-[#1C121B]">{LOCAL_NAP.address}</span>
                    <p className="text-xs font-semibold text-[#231522]/80 mt-0.5">Serving Northfield, Lightsview, Klemzig & Northern Adelaide</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E1E7D8] flex items-center justify-center text-[#2E4323] shrink-0 mt-0.5 border border-[#A7B596]">
                    <PhoneCall size={20} weight="bold" />
                  </div>
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[#2E4323] block">Direct Phone</span>
                    <a href={`tel:${LOCAL_NAP.phone_clean}`} className="font-bold text-base text-[#1C121B] underline hover:text-[#2E4323] transition-colors">
                      {LOCAL_NAP.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E1E7D8] flex items-center justify-center text-[#2E4323] shrink-0 mt-0.5 border border-[#A7B596]">
                    <EnvelopeSimple size={20} weight="bold" />
                  </div>
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[#2E4323] block">Email Inquiries</span>
                    <a href="mailto:cesaresmero2@gmail.com" className="font-bold text-base text-[#1C121B] underline hover:text-[#2E4323] transition-colors">
                      cesaresmero2@gmail.com
                    </a>
                  </div>
                </li>
              </ul>

              <div className="bg-[#E1E7D8]/60 p-4 rounded-2xl border-2 border-[#A7B596] space-y-1">
                <span className="font-bold text-sm text-[#1C121B]">Instant Booking with Poppy</span>
                <p className="text-xs sm:text-sm text-[#1C121B] font-medium leading-relaxed">
                  Click the floating "Chat with Poppy" button at the bottom right to check availability and book interactively 24/7!
                </p>
              </div>
            </div>

            {/* Studio Photo */}
            <div className="relative bg-white p-3.5 pt-4 pb-6 rounded-none shadow-md border border-neutral-300">
              <TapeStrip variant="classic" />
              <div className="relative aspect-[4/3] rounded-none overflow-hidden bg-[#FBF6EF] border border-neutral-300">
                <img
                  src={hero.image_source}
                  alt={hero.image_alt_text}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center font-display text-sm text-[#1C121B] mt-3 font-bold">
                Northfield Studio Interior • Organic Props & Wraps
              </p>
            </div>
          </div>

          {/* Right Column: Direct Contact & Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#D8C2B8] shadow-lg font-body">
              {!submitted ? (
                <div>
                  <h2 className="font-display text-2xl text-[#1C121B] font-bold mb-1">
                    Send Falguni a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-[#231522] font-semibold mb-6">
                    Fill out the form below or chat with Poppy. Falguni confirms all inquiries within 24 hours.
                  </p>

                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-900 font-bold text-xs rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 text-sm text-[#1C121B]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1C121B] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jessica Miller"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full bg-[#FBF6EF] border-2 border-[#D8C2B8] text-[#1C121B] font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2D1D2C]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1C121B] mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0412 345 678"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full bg-[#FBF6EF] border-2 border-[#D8C2B8] text-[#1C121B] font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2D1D2C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1C121B] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. jessica@example.com.au"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-[#FBF6EF] border-2 border-[#D8C2B8] text-[#1C121B] font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2D1D2C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1C121B] mb-1">
                        Service Requested
                      </label>
                      <select
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="w-full bg-[#FBF6EF] border-2 border-[#D8C2B8] text-[#1C121B] font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2D1D2C]"
                      >
                        <option value="newborn">Newborn Photography (5-14 days)</option>
                        <option value="maternity">Maternity Photography (28-34 weeks)</option>
                        <option value="family">Family Photography</option>
                        <option value="cake-smash">Cake Smash & First Birthday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1C121B] mb-1">
                        Your Message / Preferred Dates / Due Date
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your baby's due date, preferred session time, or any questions..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full bg-[#FBF6EF] border-2 border-[#D8C2B8] text-[#1C121B] font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2D1D2C]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#2D1D2C] hover:bg-[#1E121D] text-[#FBF6EF] font-bold text-base py-3.5 rounded-full shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <Spinner size={20} className="animate-spin" />
                      ) : (
                        <>
                          <CalendarCheck size={20} weight="bold" /> Send Inquiry
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={56} weight="fill" className="text-[#2E4323] mx-auto mb-3" />
                  <h3 className="font-display text-2xl font-bold text-[#1C121B] mb-2">
                    Message Received!
                  </h3>
                  <p className="text-sm text-[#1C121B] font-medium leading-relaxed max-w-md mx-auto mb-6 bg-[#E1E7D8]/60 p-4 rounded-2xl border-2 border-[#A7B596]">
                    Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours. If your dates are flexible, mention that and she'll do her best to work around them.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-[#2D1D2C] hover:bg-[#1E121D] text-[#FBF6EF] font-bold text-sm px-6 py-2.5 rounded-full cursor-pointer shadow-md"
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
};

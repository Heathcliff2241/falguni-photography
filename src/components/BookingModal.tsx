'use client';

import React, { useState } from 'react';
import { X, CalendarCheck, CheckCircle, Spinner } from '@phosphor-icons/react';
import { BotanicalRose } from './BotanicalAccents';
import { useBooking } from '../context/BookingContext';

export const BookingModal: React.FC = () => {
  const { isBookingOpen, closeBookingModal, selectedService } = useBooking();

  const [service, setService] = useState(selectedService || 'newborn');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [dueDateOrBirthDate, setDueDateOrBirthDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isBookingOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMsg('Please fill in your name, phone, and email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          serviceRequested: service,
          preferredDate,
          babyDueDateOrBirthDate: dueDateOrBirthDate,
          notes,
          source: 'direct_form'
        })
      });

      const data = await res.json();
      if (data.status === 'ok') {
        setSubmitted(true);
      } else {
        setErrorMsg('Something went wrong. Please call +61 469 753 238 or try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please call +61 469 753 238 to book directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMsg('');
    closeBookingModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#423341]/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={closeBookingModal}
    >
      <div
        className="bg-[#FBF6EF] max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-[#EFD4CE] my-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={closeBookingModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EFD4CE]/60 text-[#423341] flex items-center justify-center hover:bg-[#EFD4CE] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BotanicalRose color="sage" size={28} />
              <h2 className="font-display text-2xl font-medium text-[#423341]">
                Book Your Studio Session
              </h2>
            </div>
            <p className="font-body text-xs text-[#423341]/80 mb-6">
              Falguni's Photography • 26 South Pkwy, Northfield SA. Sessions start at $250.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 text-xs rounded-xl font-body">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-body text-sm text-[#423341]">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                  Select Service
                </label>
                <select
                  value={service}
                  onChange={e => setService(e.target.value)}
                  className="w-full bg-white border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                >
                  <option value="newborn">Newborn Photography (5-14 days)</option>
                  <option value="maternity">Maternity Photography (28-34 weeks)</option>
                  <option value="family">Family Photography</option>
                  <option value="cake-smash">Cake Smash & First Birthday</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-white border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
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
                    className="w-full bg-white border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
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
                  placeholder="e.g. sarah@example.com.au"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full bg-white border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                  />
                </div>

                {service === 'newborn' || service === 'maternity' ? (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                      Baby's Due Date / Birth Date
                    </label>
                    <input
                      type="date"
                      value={dueDateOrBirthDate}
                      onChange={e => setDueDateOrBirthDate(e.target.value)}
                      className="w-full bg-white border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                    />
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#423341]/70 mb-1">
                  Questions or Color Theme Preferences
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Prefer pastel blue wraps, dates are flexible..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#EFD4CE] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#A7B596]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#A7B596] hover:bg-[#96a585] text-[#423341] font-semibold text-base py-3.5 rounded-full shadow-sm transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <Spinner size={20} className="animate-spin" />
                ) : (
                  <>
                    <CalendarCheck size={20} />
                    Submit Booking Request
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 font-body">
            <CheckCircle size={56} weight="fill" className="text-[#A7B596] mx-auto mb-3" />
            <h3 className="font-display text-2xl font-medium text-[#423341] mb-2">
              Booking Submitted!
            </h3>
            <p className="text-sm text-[#423341]/90 leading-relaxed max-w-md mx-auto mb-6 bg-[#EFD4CE]/30 p-4 rounded-2xl border border-[#EFD4CE]">
              Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours. If your dates are flexible, mention that and she'll do her best to work around them.
            </p>
            <button
              onClick={handleReset}
              className="bg-[#A7B596] text-[#423341] font-semibold text-sm px-6 py-2.5 rounded-full cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

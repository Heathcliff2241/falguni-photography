import React, { useEffect, useState } from 'react';
import { BookingLead } from '../types';
import { BotanicalRose } from '../components/BotanicalAccents';
import { ChatTeardropText, Calendar, Phone, Envelope, User, CaretDown, CaretUp, Spinner } from '@phosphor-icons/react';

export const AdminLeadsView: React.FC = () => {
  const [leads, setLeads] = useState<BookingLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        if (data.leads) {
          setLeads(data.leads);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 bg-[#FBF6EF] min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between border-b border-[#EFD4CE] pb-6 mb-8 font-body">
          <div>
            <div className="flex items-center gap-2">
              <BotanicalRose color="sage" size={28} />
              <h1 className="font-display text-3xl text-[#423341] font-medium">
                Studio Lead Dashboard
              </h1>
            </div>
            <p className="text-xs text-[#423341]/70 mt-1">
              Captured bookings & Poppy AI Assistant conversation transcripts
            </p>
          </div>
          <span className="bg-[#423341] text-[#FBF6EF] text-xs px-3 py-1.5 rounded-full font-semibold">
            {leads.length} Saved Leads
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#A7B596]">
            <Spinner size={32} className="animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#EFD4CE] text-center font-body text-[#423341]">
            <ChatTeardropText size={48} className="text-[#EFD4CE] mx-auto mb-3" />
            <h3 className="font-display text-xl font-medium mb-1">No leads captured yet</h3>
            <p className="text-sm text-[#423341]/70">
              When visitors chat with Poppy or submit booking requests, they will appear here along with full transcripts.
            </p>
          </div>
        ) : (
          <div className="space-y-4 font-body">
            {leads.map(lead => {
              const isExpanded = expandedId === lead.id;

              return (
                <div
                  key={lead.id}
                  className="bg-white rounded-2xl border border-[#EFD4CE] overflow-hidden shadow-sm transition-all"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#EFD4CE]/20 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xl font-medium text-[#423341]">
                          {lead.fullName || 'Anonymous Visitor'}
                        </span>
                        <span className="bg-[#A7B596]/30 text-[#423341] text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full">
                          {lead.serviceRequested || 'General'}
                        </span>
                        <span className="bg-[#EFD4CE]/40 text-[#423341] text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full">
                          {lead.source}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#423341]/80">
                        {lead.phone && <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>}
                        {lead.email && <span className="flex items-center gap-1"><Envelope size={12} /> {lead.email}</span>}
                        {lead.preferredDate && <span className="flex items-center gap-1"><Calendar size={12} /> Date: {lead.preferredDate}</span>}
                        {lead.babyDueDateOrBirthDate && <span className="text-[#A7B596] font-semibold">Due/Birth: {lead.babyDueDateOrBirthDate}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs text-[#423341]/60">
                      <span>{new Date(lead.timestamp).toLocaleString()}</span>
                      <button className="w-8 h-8 rounded-full bg-[#EFD4CE]/40 flex items-center justify-center text-[#423341]">
                        {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Transcript drawer */}
                  {isExpanded && (
                    <div className="border-t border-[#EFD4CE]/60 bg-[#FBF6EF] p-6 space-y-4 text-xs">
                      {lead.notes && (
                        <div className="bg-white p-3 rounded-xl border border-[#EFD4CE]">
                          <span className="font-semibold block text-[#423341] mb-1">Lead Notes:</span>
                          <p className="text-[#423341]/80">{lead.notes}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-display text-base font-medium text-[#423341] mb-2 flex items-center gap-1.5">
                          <ChatTeardropText size={18} /> Conversation Transcript with Poppy
                        </h4>
                        {lead.transcript && lead.transcript.length > 0 ? (
                          <div className="space-y-2 bg-white p-4 rounded-xl border border-[#EFD4CE] max-h-80 overflow-y-auto">
                            {lead.transcript.map((t, idx) => (
                              <div
                                key={idx}
                                className={`p-2.5 rounded-xl ${
                                  t.sender === 'user' ? 'bg-[#423341] text-[#FBF6EF] ml-8' : 'bg-[#EFD4CE]/30 text-[#423341] mr-8'
                                }`}
                              >
                                <span className="font-semibold block text-[10px] opacity-80 uppercase">
                                  {t.sender === 'user' ? 'Lead' : 'Poppy (AI)'} • {t.time}
                                </span>
                                <p className="text-xs mt-0.5">{t.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[#423341]/60 italic">No transcript recorded for this lead.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

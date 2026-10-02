import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Tag,
  ShieldCheck,
  Download,
  Send,
  Ticket,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const CustomerDetailDrawer: React.FC = () => {
  const {
    selectedCustomerId,
    setSelectedCustomerId,
    customers,
    bookings,
    setSelectedBookingId,
    showToast,
    language,
  } = useApp();

  const [newNote, setNewNote] = useState<string>('');

  if (!selectedCustomerId) return null;

  const customer = customers.find((c) => c.id === selectedCustomerId);
  if (!customer) return null;

  const customerBookings = bookings.filter(
    (b) => b.customerId === customer.id || b.customerEmail === customer.email
  );

  const handleExportCustomerRecord = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Customer ID,Name,Email,Phone,Total Bookings,Total Spent,Lifetime Commission Saved,Consent Marketing,Last Booking',
        `"${customer.id}","${customer.name}","${customer.email}","${customer.phone}",${customer.totalBookings},${customer.totalSpent},${customer.lifetimeCommissionSaved},${customer.consentMarketing},"${customer.lastBookingDate}"`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_${customer.name.toLowerCase().replace(/\s+/g, '_')}_record.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`GDPR customer record exported for ${customer.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0F2A3D]/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-md h-full overflow-y-auto flex flex-col rounded-l-3xl border-l border-white/95 shadow-[0_0_60px_rgba(15,42,61,0.25)]">
        {/* Header */}
        <div className="p-6 border-b border-[#A0BDDB]/25 bg-white/70 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1EC1CB] to-[#0F7682] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A3D]">{language === 'bn' && customer.nameBn ? customer.nameBn : customer.name}</h2>
              <span className="text-[11px] text-[#5B7184]">{customer.email}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedCustomerId(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/80 border border-white text-center">
              <span className="text-lg font-bold text-[#0F2A3D] block tabular-nums">
                ${customer.totalSpent}
              </span>
              <span className="text-[10px] text-[#5B7184]">Lifetime Spent</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 border border-white text-center">
              <span className="text-lg font-bold text-[#0F2A3D] block tabular-nums">
                {customer.totalBookings}
              </span>
              <span className="text-[10px] text-[#5B7184]">Tours Booked</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#DCFCE7]/70 border border-[#86EFAC] text-center">
              <span className="text-lg font-bold text-[#14532D] block tabular-nums">
                +${customer.lifetimeCommissionSaved.toFixed(0)}
              </span>
              <span className="text-[10px] text-[#166534]">Fees Saved</span>
            </div>
          </div>

          {/* Data Ownership Reassurance */}
          <div className="p-3.5 rounded-2xl bg-[#1EC1CB]/10 border border-[#1EC1CB]/30 flex items-center justify-between text-xs text-[#0F2A3D]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1EC1CB] shrink-0" />
              <span className="text-[11px] font-semibold text-[#0A6C74]">
                You own 100% of this guest's data. Zero lock-in.
              </span>
            </div>
            <button
              onClick={handleExportCustomerRecord}
              className="flex items-center gap-1 text-[11px] font-bold text-[#0F2A3D] bg-white px-2.5 py-1 rounded-lg border border-white shadow-xs hover:bg-gray-50 cursor-pointer shrink-0"
            >
              <Download className="w-3 h-3 text-[#1EC1CB]" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
              Customer Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {customer.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 text-[#0F2A3D] border border-white/90 shadow-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Preferences */}
          {customer.preferences.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/70 border border-white/90 space-y-2">
              <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
                Paddling & Tour Preferences
              </h3>
              <ul className="space-y-1 text-xs text-[#0F2A3D]">
                {customer.preferences.map((pref, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1EC1CB]" />
                    <span>{pref}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking History */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
              Booking History
            </h3>
            {customerBookings.length > 0 ? (
              <div className="space-y-2">
                {customerBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedCustomerId(null);
                      setSelectedBookingId(b.id);
                    }}
                    className="p-3 rounded-2xl bg-white/70 border border-white/90 hover:bg-white transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0F2A3D] block">
                        {b.tripTitle}
                      </span>
                      <span className="text-[11px] text-[#5B7184]">
                        {b.tripDate} · {b.guestsCount} guests · ${b.totalAmount}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#1EC1CB] hover:underline">
                      View
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#5B7184] italic">
                First booking logged directly into system.
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 space-y-2">
            <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
              Operator Notes
            </h3>
            <p className="text-xs text-[#0F2A3D]">{customer.notes || 'No notes added yet.'}</p>
          </div>

          {/* Consent Status */}
          <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/60 border border-white">
            <span className="text-[#5B7184]">Marketing SMS & Email Consent:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full ${
                customer.consentMarketing
                  ? 'bg-[#DCFCE7] text-[#14532D]'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {customer.consentMarketing ? 'Opted-in (Explicit)' : 'Transactional Only'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#A0BDDB]/25 bg-white/80 sticky bottom-0 z-10 backdrop-blur-md flex items-center justify-end">
          <button
            onClick={() => setSelectedCustomerId(null)}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F2A3D] text-white hover:bg-[#1A3E56] shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

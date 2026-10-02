import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, PaymentRecord } from '../../types';
import { TODAY_DATE } from '../../data/mockData';
import {
  X,
  Plus,
  Users,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

export const NewBookingModal: React.FC = () => {
  const {
    showNewBookingModal,
    setShowNewBookingModal,
    trips,
    setTrips,
    bookings,
    setBookings,
    payments,
    setPayments,
    customers,
    setCustomers,
    showToast,
  } = useApp();

  const [tripId, setTripId] = useState<string>(trips[0]?.id || 'trip-1');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [source, setSource] = useState<'Phone' | 'Walk-in' | 'Direct Widget'>('Phone');
  const [paymentMethod, setPaymentMethod] = useState<'Direct Hosted Card' | 'Walk-in Cash' | 'Direct Apple Pay'>(
    'Direct Hosted Card'
  );
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!showNewBookingModal) return null;

  const selectedTrip = trips.find((t) => t.id === tripId) || trips[0];
  const totalPrice = (selectedTrip?.pricePerPerson || 65) * guestsCount;
  const commissionSaved = totalPrice * 0.25; // 25% kept by operator!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newBookingId = `bk-${Date.now().toString().slice(-4)}`;
      const newBookingCode = `TW-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCustomerId = `cust-${Date.now().toString().slice(-4)}`;

      const newBooking: Booking = {
        id: newBookingId,
        bookingCode: newBookingCode,
        customerId: newCustomerId,
        customerName,
        customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        customerPhone: customerPhone || '+880 1712-345678',
        tripId: selectedTrip.id,
        tripTitle: selectedTrip.title,
        tripDate: selectedTrip.date || TODAY_DATE,
        tripTime: selectedTrip.startTime,
        guestsCount,
        totalAmount: totalPrice,
        commissionSaved,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod,
        waiverSignedCount: 0, // Fresh booking, waiver link sent
        notes: notes || undefined,
        source,
        messagesTimeline: [
          {
            id: `msg-${Date.now()}`,
            timestamp: 'Just now',
            type: 'sms',
            title: 'Booking Confirmed & Digital Waiver Link',
            content: `Reservation ${newBookingCode} confirmed for ${guestsCount} guests. Digital waiver link dispatched.`,
            status: 'delivered',
          },
        ],
      };

      // Update trips booked count
      setTrips((prev) =>
        prev.map((t) =>
          t.id === selectedTrip.id
            ? { ...t, bookedCount: Math.min(t.capacity, t.bookedCount + guestsCount) }
            : t
        )
      );

      // Add to bookings list
      setBookings((prev) => [newBooking, ...prev]);

      // Add payment record
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now().toString().slice(-4)}`,
        date: '2026-09-30 Just now',
        customerName,
        tripTitle: `${selectedTrip.title} (${guestsCount} guests)`,
        grossAmount: totalPrice,
        processingFee: Number((totalPrice * 0.029 + 0.3).toFixed(2)),
        netPayout: Number((totalPrice - (totalPrice * 0.029 + 0.3)).toFixed(2)),
        commissionSavedVsMarketplace: commissionSaved,
        status: 'succeeded',
        method: paymentMethod,
        marketplaceRate: 0.25,
      };
      setPayments((prev) => [newPayment, ...prev]);

      // Add/update customer in CRM
      setCustomers((prev) => [
        {
          id: newCustomerId,
          name: customerName,
          email: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          phone: customerPhone || '+880 1712-345678',
          totalBookings: 1,
          totalSpent: totalPrice,
          lifetimeCommissionSaved: commissionSaved,
          tags: [source === 'Walk-in' ? 'Walk-in Guest' : 'Direct Booking'],
          preferences: [],
          notes: notes || 'Booked directly via Tidewise operator desk.',
          consentMarketing: true,
          lastBookingDate: TODAY_DATE,
        },
        ...prev,
      ]);

      setIsSubmitting(false);
      setShowNewBookingModal(false);
      showToast(
        `Booking ${newBookingCode} created! Saved $${commissionSaved.toFixed(0)} vs 25% marketplace.`
      );
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A3D]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-lg overflow-hidden rounded-3xl border border-white/90 shadow-[0_24px_64px_rgba(15,42,61,0.22)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#A0BDDB]/25 flex items-center justify-between bg-white/70">
          <div>
            <h2 className="text-base font-bold text-[#0F2A3D]">
              New Direct Booking (Phone / Walk-in)
            </h2>
            <p className="text-xs text-[#5B7184]">
              Zero marketplace commissions · Instant digital waiver link
            </p>
          </div>
          <button
            onClick={() => setShowNewBookingModal(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Select Trip */}
          <div>
            <label className="block text-xs font-bold text-[#0F2A3D] mb-1.5 uppercase tracking-wide">
              Select Tour / Slot:
            </label>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
            >
              {trips.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.startTime} – {tr.title} (${tr.pricePerPerson}/ea · {tr.bookedCount}/{tr.capacity} booked)
                </option>
              ))}
            </select>
          </div>

          {/* Guest Name & Guests Count */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1.5 uppercase tracking-wide">
                Primary Guest Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Miller"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1.5 uppercase tracking-wide">
                Headcount:
              </label>
              <input
                type="number"
                min={1}
                max={selectedTrip.capacity - selectedTrip.bookedCount || 10}
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB] tabular-nums"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1.5 uppercase tracking-wide">
                Mobile Phone:
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5B7184]" />
                <input
                  type="tel"
                  placeholder="+880 1712-345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1.5 uppercase tracking-wide">
                Email Address:
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5B7184]" />
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
                />
              </div>
            </div>
          </div>

          {/* Source & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1.5 uppercase tracking-wide">
                Booking Source:
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              >
                <option value="Phone">Phone Call Inquiry</option>
                <option value="Walk-in">Walk-in at Dock</option>
                <option value="Direct Widget">Direct Website</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1.5 uppercase tracking-wide">
                Payment Settled:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              >
                <option value="Direct Hosted Card">Card (Hosted Terminal)</option>
                <option value="Walk-in Cash">Cash at Dock</option>
                <option value="Direct Apple Pay">Apple Pay / Contactless</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#0F2A3D] mb-1.5 uppercase tracking-wide">
              Operator Notes / Special Needs:
            </label>
            <input
              type="text"
              placeholder="e.g. Needs tandem kayak, anniversary celebration, beginner paddler"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
            />
          </div>

          {/* Commission Transparency Box */}
          <div className="p-3.5 rounded-2xl bg-[#DCFCE7]/70 border border-[#86EFAC] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#14532D] block">
                Total Charge: ${totalPrice} · 100% Yours
              </span>
              <span className="text-[11px] text-[#166534]">
                Marketplace fee avoided: ~${commissionSaved.toFixed(0)} (25% rate)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#16A34A] text-white">
                +$0 Broker Cut
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewBookingModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Confirming...' : 'Save Booking'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

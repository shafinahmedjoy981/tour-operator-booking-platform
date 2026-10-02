import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  User,
  Users,
  CreditCard,
  FileCheck2,
  Send,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Copy,
  Check,
  Phone,
  Mail,
  RefreshCw,
} from 'lucide-react';

export const BookingDetailDrawer: React.FC = () => {
  const {
    selectedBookingId,
    setSelectedBookingId,
    bookings,
    setBookings,
    payments,
    setPayments,
    showToast,
    language,
  } = useApp();

  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState<boolean>(false);

  if (!selectedBookingId) return null;

  const booking = bookings.find((b) => b.id === selectedBookingId);
  if (!booking) return null;

  const handleResendWaiver = () => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === booking.id) {
          return {
            ...b,
            messagesTimeline: [
              ...b.messagesTimeline,
              {
                id: `msg-${Date.now()}`,
                timestamp: 'Just now',
                type: 'sms',
                title: 'Waiver Reminder Dispatched',
                content:
                  'Digital waiver signing link resent to customer phone with 1-tap mobile signature.',
                status: 'delivered',
              },
            ],
          };
        }
        return b;
      })
    );
    showToast(`Waiver signing link sent to ${booking.customerPhone}`);
  };

  const handleProcessRefund = () => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              status: 'refunded',
              paymentStatus: 'refunded',
              messagesTimeline: [
                ...b.messagesTimeline,
                {
                  id: `msg-${Date.now()}`,
                  timestamp: 'Just now',
                  type: 'email',
                  title: 'Full 100% Refund Processed',
                  content: `Refund of $${booking.totalAmount.toFixed(2)} initiated back to ${booking.paymentMethod}. $0 penalty fees charged.`,
                  status: 'delivered',
                },
              ],
            }
          : b
      )
    );

    // Update payment record
    setPayments((prev) =>
      prev.map((p) =>
        p.customerName === booking.customerName
          ? { ...p, status: 'refunded' }
          : p
      )
    );

    setShowRefundConfirm(false);
    showToast(`100% refund of $${booking.totalAmount} processed for ${booking.customerName}.`);
  };

  const handleCopyWaiverLink = () => {
    navigator.clipboard?.writeText(
      `https://book.tidewise.app/waiver/${booking.bookingCode.toLowerCase()}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast('Direct waiver link copied to clipboard.');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0F2A3D]/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-md h-full overflow-y-auto flex flex-col rounded-l-3xl border-l border-white/95 shadow-[0_0_60px_rgba(15,42,61,0.25)]">
        {/* Header */}
        <div className="p-6 border-b border-[#A0BDDB]/25 bg-white/70 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0A6C74] bg-[#1EC1CB]/15 px-2 py-0.5 rounded-full">
                {booking.bookingCode}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  booking.status === 'confirmed'
                    ? 'bg-[#DCFCE7] text-[#14532D]'
                    : booking.status === 'weather_hold'
                    ? 'bg-[#FFE4E6] text-[#9F1239]'
                    : booking.status === 'needs_waiver'
                    ? 'bg-[#FEF3C7] text-[#92400E]'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#0F2A3D] mt-1">
              {language === 'bn' && booking.customerNameBn ? booking.customerNameBn : booking.customerName}
            </h2>
          </div>
          <button
            onClick={() => setSelectedBookingId(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Trip Summary Card */}
          <div className="p-4 rounded-2xl bg-white/80 border border-white/90 space-y-2">
            <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
              Trip Details
            </h3>
            <p className="text-sm font-bold text-[#0F2A3D]">{booking.tripTitle}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#5B7184] pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1EC1CB]" />
                <span className="text-[#0F2A3D] font-medium">{booking.tripDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1EC1CB]" />
                <span className="text-[#0F2A3D] font-medium">{booking.tripTime} EDT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1EC1CB]" />
                <span className="text-[#0F2A3D] font-medium">{booking.guestsCount} Guests</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#1EC1CB]" />
                <span className="text-[#0F2A3D] font-medium">${booking.totalAmount} Total</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 space-y-2">
            <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
              Customer Contact
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#0F2A3D]">
                <Phone className="w-3.5 h-3.5 text-[#5B7184]" />
                <span className="font-semibold">{booking.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#0F2A3D]">
                <Mail className="w-3.5 h-3.5 text-[#5B7184]" />
                <span className="font-semibold">{booking.customerEmail}</span>
              </div>
              <div className="pt-1 text-[11px] text-[#5B7184]">
                Source: <span className="font-semibold text-[#0F2A3D]">{booking.source}</span>
              </div>
            </div>
          </div>

          {/* Digital Waiver State */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#1EC1CB]" />
                <span>Digital Waiver & Safety Acknowledgment</span>
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0F2A3D] block">
                  {booking.waiverSignedCount} of {booking.guestsCount} Waivers Signed
                </span>
                <span className="text-[11px] text-[#5B7184]">
                  {booking.waiverSignedTimestamp
                    ? `Last signed: ${booking.waiverSignedTimestamp}`
                    : 'Pending signatures'}
                </span>
              </div>
              <button
                onClick={handleCopyWaiverLink}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#0A6C74] bg-[#1EC1CB]/15 px-2.5 py-1 rounded-lg hover:bg-[#1EC1CB]/25 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
              </button>
            </div>

            {booking.waiverSignedCount < booking.guestsCount && (
              <button
                onClick={handleResendWaiver}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] hover:bg-[#FDE68A] transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS Waiver Reminder</span>
              </button>
            )}
          </div>

          {/* Payment & Zero-Commission Guarantee */}
          <div className="p-4 rounded-2xl bg-[#DCFCE7]/70 border border-[#86EFAC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#14532D]">
                Payment Status: {booking.paymentStatus.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A] text-white">
                Zero Commission
              </span>
            </div>
            <p className="text-xs text-[#166534]">
              Paid via {booking.paymentMethod}. You kept{' '}
              <span className="font-bold text-[#14532D]">
                +${booking.commissionSaved.toFixed(2)}
              </span>{' '}
              that third-party broker sites would have charged.
            </p>
          </div>

          {/* Notes & Special Requests */}
          {(booking.notes || booking.specialRequests) && (
            <div className="p-4 rounded-2xl bg-white/70 border border-white/90 space-y-1.5">
              <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
                Special Requests & Notes
              </h3>
              {booking.specialRequests && (
                <p className="text-xs text-[#E11D48] font-semibold bg-[#FFE4E6]/50 p-2 rounded-lg border border-[#FDA4AF]/50">
                  {booking.specialRequests}
                </p>
              )}
              {booking.notes && (
                <p className="text-xs text-[#5B7184] italic">"{booking.notes}"</p>
              )}
            </div>
          )}

          {/* Timeline of Messages */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 space-y-3">
            <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#1EC1CB]" />
              <span>Automated Notification Timeline</span>
            </h3>
            <div className="space-y-2.5">
              {booking.messagesTimeline.map((msg) => (
                <div key={msg.id} className="text-xs border-l-2 border-[#1EC1CB] pl-3 py-0.5">
                  <div className="flex items-center justify-between text-[11px] text-[#5B7184]">
                    <span className="font-bold text-[#0F2A3D]">{msg.title}</span>
                    <span className="tabular-nums">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#5B7184] mt-0.5">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer / Destructive Actions */}
        <div className="p-4 border-t border-[#A0BDDB]/25 bg-white/80 sticky bottom-0 z-10 backdrop-blur-md">
          {showRefundConfirm ? (
            <div className="p-3 rounded-2xl bg-[#FFE4E6] border border-[#FDA4AF] space-y-2">
              <p className="text-xs font-bold text-[#9F1239]">
                Are you sure you want to refund ${booking.totalAmount}?
              </p>
              <p className="text-[11px] text-[#881337]">
                Funds will be returned to the guest’s card immediately. No broker penalty.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowRefundConfirm(false)}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-white text-[#5B7184] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessRefund}
                  className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-[#E11D48] text-white hover:bg-[#BE123C]"
                >
                  Yes, Process Refund
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              {booking.paymentStatus !== 'refunded' ? (
                <button
                  onClick={() => setShowRefundConfirm(true)}
                  className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer"
                >
                  Cancel & Full Refund
                </button>
              ) : (
                <span className="text-xs font-bold text-[#5B7184]">Refund Completed</span>
              )}
              <button
                onClick={() => setSelectedBookingId(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F2A3D] text-white hover:bg-[#1A3E56] shadow-sm cursor-pointer ml-auto"
              >
                Close Drawer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileCheck2,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Phone,
  ArrowUpDown,
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const {
    bookings,
    setSelectedBookingId,
    setShowNewBookingModal,
    language,
    t,
    formatNumber,
    formatCurrency,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.customerNameBn && b.customerNameBn.includes(searchTerm)) ||
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm) ||
      b.tripTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || b.status === statusFilter;

    const matchesSource =
      sourceFilter === 'all' || b.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusLabel = (status: string) => {
    if (status === 'confirmed') return t('status.confirmed');
    if (status === 'weather_hold') return t('status.weatherHold');
    if (status === 'needs_waiver') return t('status.needsWaiver');
    if (status === 'cancelled') return t('status.cancelled');
    if (status === 'paid') return t('status.paid');
    return status;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar: Search, Filters & Single Primary Button */}
      <div className="glass-raised p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-[#5B7184] absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('bookings.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/70 rounded-xl border border-white overflow-x-auto">
            {[
              { id: 'all', label: t('bookings.tabAll') },
              { id: 'confirmed', label: t('bookings.tabConfirmed') },
              { id: 'needs_waiver', label: t('bookings.tabNeedsWaiver') },
              { id: 'weather_hold', label: t('bookings.tabWeatherHold') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                    : 'text-[#5B7184] hover:text-[#0F2A3D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Source Dropdown */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB] cursor-pointer"
          >
            <option value="all">{t('bookings.filterAllSources')}</option>
            <option value="Direct Widget">{t('bookings.sourceDirect')}</option>
            <option value="Walk-in">{t('bookings.sourceWalkIn')}</option>
            <option value="Phone">{t('bookings.sourcePhone')}</option>
          </select>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setShowNewBookingModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('bookings.addBookingBtn')}</span>
        </button>
      </div>

      {/* Bookings Table / List */}
      <div className="glass-base overflow-hidden border border-white/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#A0BDDB]/25 bg-white/50 text-[#5B7184] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">{t('bookings.thCode')}</th>
                <th className="py-3 px-4">{t('bookings.thGuest')}</th>
                <th className="py-3 px-4">{t('bookings.thTour')}</th>
                <th className="py-3 px-4 text-center">{t('bookings.thGuests')}</th>
                <th className="py-3 px-4">{t('bookings.thStatus')}</th>
                <th className="py-3 px-4">{t('bookings.thWaiver')}</th>
                <th className="py-3 px-4 text-right">{t('bookings.thPaid')}</th>
                <th className="py-3 px-4 text-right">{t('bookings.thFeeSaved')}</th>
                <th className="py-3 px-4 text-center">{t('bookings.thAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A0BDDB]/15">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBookingId(b.id)}
                  className="hover:bg-white/70 transition-colors cursor-pointer group"
                >
                  {/* Code */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0A6C74]">
                    {b.bookingCode}
                  </td>

                  {/* Guest */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0F2A3D] block text-xs">
                      {language === 'bn' && b.customerNameBn ? b.customerNameBn : b.customerName}
                    </span>
                    <span className="text-[11px] text-[#5B7184] block">{b.customerPhone}</span>
                  </td>

                  {/* Tour */}
                  <td className="py-3.5 px-4 max-w-xs truncate">
                    <span className="font-semibold text-[#0F2A3D] block truncate">
                      {b.tripTitle}
                    </span>
                    <span className="text-[11px] text-[#5B7184]">
                      {b.tripDate} · {b.tripTime} EDT
                    </span>
                  </td>

                  {/* Guests */}
                  <td className="py-3.5 px-4 text-center font-bold text-[#0F2A3D] tabular-nums">
                    {formatNumber(b.guestsCount)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-[10px] px-2 py-0.5 rounded-full border ${
                        b.status === 'confirmed'
                          ? 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]'
                          : b.status === 'weather_hold'
                          ? 'bg-[#FFE4E6] text-[#9F1239] border-[#FDA4AF]'
                          : b.status === 'needs_waiver'
                          ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {b.status === 'confirmed' && <CheckCircle2 className="w-2.5 h-2.5 text-[#16A34A]" />}
                      {b.status === 'weather_hold' && <AlertTriangle className="w-2.5 h-2.5 text-[#E11D48]" />}
                      {b.status === 'needs_waiver' && <AlertOctagon className="w-2.5 h-2.5 text-[#D97706]" />}
                      <span>{getStatusLabel(b.status)}</span>
                    </span>
                  </td>

                  {/* Waiver */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <FileCheck2
                        className={`w-3.5 h-3.5 ${
                          b.waiverSignedCount >= b.guestsCount
                            ? 'text-[#16A34A]'
                            : 'text-[#D97706]'
                        }`}
                      />
                      <span className="text-xs font-medium text-[#0F2A3D] tabular-nums">
                        {formatNumber(b.waiverSignedCount)}/{formatNumber(b.guestsCount)}
                      </span>
                    </div>
                  </td>

                  {/* Total Paid */}
                  <td className="py-3.5 px-4 text-right font-bold text-[#0F2A3D] tabular-nums">
                    {formatCurrency(b.totalAmount)}
                  </td>

                  {/* Fee Saved */}
                  <td className="py-3.5 px-4 text-right tabular-nums">
                    <span className="font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded-full text-[11px]">
                      +{formatCurrency(b.commissionSaved, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button className="text-[#5B7184] group-hover:text-[#1EC1CB] transition-colors p-1" aria-label={t('common.viewDetails')}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-[#0F2A3D]">
                {t('bookings.emptyTitle')}
              </p>
              <p className="text-xs text-[#5B7184]">
                {t('bookings.emptyDesc')}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSourceFilter('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#0A6C74] border border-[#1EC1CB] hover:bg-[#1EC1CB]/10 cursor-pointer"
              >
                {t('bookings.resetFilters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

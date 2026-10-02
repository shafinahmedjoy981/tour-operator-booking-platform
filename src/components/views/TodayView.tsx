import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeatherBadge } from '../common/WeatherBadge';
import {
  Compass,
  DollarSign,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Clock,
  CheckCircle2,
  Calendar,
  Waves,
  ChevronRight,
  Send,
  CloudLightning,
  Check,
  Smartphone,
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    trips,
    bookings,
    totalCommissionSavedMonth,
    todayRevenue,
    todayBookedGuests,
    setActiveScreen,
    setDockModeActive,
    setShowWeatherRescheduleModal,
    setShowNewBookingModal,
    showToast,
    language,
    t,
    formatNumber,
    formatCurrency,
    formatPlural,
  } = useApp();

  const [checklistDismissed, setChecklistDismissed] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<{ [k: string]: boolean }>({
    step1: true,
    step2: true,
    step3: false,
  });

  const stopTrip = trips.find((t) => t.weatherRisk === 'stop');
  const needsWaiverBookings = bookings.filter((b) => b.status === 'needs_waiver');

  const toggleChecklistStep = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendAllWaiverReminders = () => {
    showToast(t('today.smsReminderToast'));
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Hero Bento Header: Stats & Commission Saved */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Card 1: Commission Saved (The Core Value Proposition) */}
        <div className="glass-raised p-5 relative overflow-hidden flex flex-col h-full border-t-2 border-t-[#1EC1CB]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B7184]">
              {t('today.commissionSavedTitle')}
            </span>
            <span className="w-8 h-8 rounded-full bg-[#1EC1CB]/15 flex items-center justify-center text-[#0A6C74] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-extrabold text-[#0F2A3D] tabular-nums tracking-tight">
              {formatCurrency(totalCommissionSavedMonth, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
              {t('today.hundredPercentYours')}
            </span>
          </div>

          <p className="text-xs text-[#5B7184] mt-2">
            {t('today.commissionSavedDesc')}
          </p>

          <div className="mt-auto pt-3 border-t border-[#A0BDDB]/25 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveScreen('payments')}
              className="font-bold text-[#0A6C74] hover:text-[#0F2A3D] flex items-center gap-1 cursor-pointer"
            >
              <span>{t('today.viewFeeBreakdown')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Today's Revenue */}
        <div className="glass-base p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B7184]">
              {t('today.directRevenueTitle')}
            </span>
            <span className="w-8 h-8 rounded-full bg-[#A0BDDB]/20 flex items-center justify-center text-[#0F2A3D] shrink-0">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-extrabold text-[#0F2A3D] tabular-nums tracking-tight">
              {formatCurrency(todayRevenue)}
            </span>
            <span className="text-xs text-[#5B7184]">{t('common.gross')}</span>
          </div>

          <p className="text-xs text-[#5B7184] mt-2">
            {t('today.paidToStripeDesc')}
          </p>

          <div className="mt-auto pt-3 border-t border-[#A0BDDB]/25 flex items-center justify-between text-xs text-[#5B7184]">
            <span>{t('today.nextDeposit')}</span>
          </div>
        </div>

        {/* Card 3: Guests Booked Today */}
        <div className="glass-base p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B7184]">
              {t('today.guestsOnWaterTitle')}
            </span>
            <span className="w-8 h-8 rounded-full bg-[#1EC1CB]/15 flex items-center justify-center text-[#0A6C74] shrink-0">
              <Users className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-extrabold text-[#0F2A3D] tabular-nums tracking-tight">
              {formatNumber(todayBookedGuests)}
            </span>
            <span className="text-xs text-[#5B7184]">{t('common.booked')}</span>
          </div>

          <p className="text-xs text-[#5B7184] mt-2">
            {t('today.acrossSlots')}
          </p>

          <div className="mt-auto pt-3 border-t border-[#A0BDDB]/25 flex items-center justify-between text-xs">
            <span className="text-[#5B7184]">{t('today.utilization')}</span>
            <button
              onClick={() => setActiveScreen('calendar')}
              className="text-xs font-bold text-[#0A6C74] hover:underline cursor-pointer"
            >
              {t('today.manageSlots')}
            </button>
          </div>
        </div>
      </div>

      {/* Weather Alert Banner (Prominent Single Focus when trip is at risk) */}
      {stopTrip && (
        <div className="glass-raised p-5 border-l-4 border-l-[#E11D48] bg-[#FFE4E6]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#E11D48] shrink-0 border border-[#FDA4AF]">
              <CloudLightning className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-[#9F1239]">
                  {t('today.weatherAlertPrefix')} {stopTrip.startTime} {stopTrip.title}
                </span>
                <WeatherBadge level="stop" size="sm" />
              </div>
              <p className="text-xs text-[#881337] mt-0.5">
                {stopTrip.weatherRiskReason} · {t('today.guestsWaiting', { count: formatNumber(stopTrip.bookedCount) })}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveScreen('weather');
              setShowWeatherRescheduleModal(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            {t('today.moveGuestsBtn')}
          </button>
        </div>
      )}

      {/* First-Run Setup Checklist (Collapsible) */}
      {!checklistDismissed && (
        <div className="glass-base p-4 relative border-l-4 border-l-[#1EC1CB]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
              {t('today.checklistTitle')}
            </h2>
            <button
              onClick={() => setChecklistDismissed(true)}
              className="text-xs text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
            >
              {t('today.hide')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div
              onClick={() => toggleChecklistStep('step1')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-white cursor-pointer hover:bg-white transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  completedSteps.step1 ? 'bg-[#16A34A] text-white' : 'border border-gray-300'
                }`}
              >
                {completedSteps.step1 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#0F2A3D] block">{t('today.checklistStep1Title')}</span>
                <span className="text-[10px] text-[#5B7184]">{t('today.checklistStep1Desc')}</span>
              </div>
            </div>

            <div
              onClick={() => toggleChecklistStep('step2')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-white cursor-pointer hover:bg-white transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  completedSteps.step2 ? 'bg-[#16A34A] text-white' : 'border border-gray-300'
                }`}
              >
                {completedSteps.step2 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#0F2A3D] block">{t('today.checklistStep2Title')}</span>
                <span className="text-[10px] text-[#5B7184]">{t('today.checklistStep2Desc')}</span>
              </div>
            </div>

            <div
              onClick={() => {
                toggleChecklistStep('step3');
                setActiveScreen('widget');
              }}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-white cursor-pointer hover:bg-white transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  completedSteps.step3 ? 'bg-[#16A34A] text-white' : 'border border-[#1EC1CB]'
                }`}
              >
                {completedSteps.step3 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#0F2A3D] block">{t('today.checklistStep3Title')}</span>
                <span className="text-[10px] text-[#0A6C74] font-semibold">{t('today.checklistStep3Desc')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Today's Schedule + Needs Attention Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Today's Trips (2 cols) */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F2A3D]">{t('today.scheduledDepartures')}</h2>
                <p className="text-xs text-[#5B7184]">
                  {t('today.departuresSubtitle')}
                </p>
              </div>
              <button
                onClick={() => setShowNewBookingModal(true)}
                className="text-xs font-bold text-[#0A6C74] bg-[#1EC1CB]/15 hover:bg-[#1EC1CB]/25 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                {t('today.quickReservation')}
              </button>
            </div>

            <div className="space-y-3">
              {trips.slice(0, 4).map((trip) => {
                const fillPercent = Math.min(100, Math.round((trip.bookedCount / trip.capacity) * 100));
                const isFull = trip.bookedCount >= trip.capacity;

                return (
                  <div
                    key={trip.id}
                    className={`glass-base p-4 relative border transition-all ${
                      trip.weatherRisk === 'stop'
                        ? 'border-[#FDA4AF] bg-white/80'
                        : 'hover:border-[#1EC1CB]/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-sm font-bold text-[#0F2A3D]">
                            {trip.startTime} – {trip.endTime}
                          </span>
                          <span className="text-xs text-[#5B7184]">({formatNumber(trip.durationMinutes)} {t('common.min')})</span>
                          <WeatherBadge level={trip.weatherRisk} size="sm" />
                        </div>

                        <h3 className="text-sm font-bold text-[#0F2A3D] mt-1 truncate">
                          {trip.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-[#5B7184] mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-[#0F2A3D] font-medium">
                            <UserCheck className="w-3.5 h-3.5 text-[#1EC1CB]" />
                            {(language === 'bn' && trip.guideNameBn ? trip.guideNameBn : trip.guideName) || t('common.unassigned')}
                          </span>
                          <span>·</span>
                          <span>{trip.dockLocation}</span>
                          <span>·</span>
                          <span>{formatCurrency(trip.pricePerPerson)}{t('common.perPerson')}</span>
                        </div>
                      </div>

                      {/* Capacity & Headcount Bar */}
                      <div className="sm:w-44 shrink-0 flex flex-col justify-end">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#5B7184]">{t('common.headcount')}</span>
                          <span className="font-bold text-[#0F2A3D] tabular-nums">
                            {formatNumber(trip.bookedCount)} / {formatNumber(trip.capacity)} {isFull ? `(${t('common.full')})` : ''}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#A0BDDB]/30 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isFull
                                ? 'bg-[#1EC1CB]'
                                : fillPercent > 60
                                ? 'bg-[#1EC1CB]'
                                : 'bg-[#A0BDDB]'
                            }`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Weather note footer */}
                    <div className="mt-3 pt-2.5 border-t border-[#A0BDDB]/20 flex items-center justify-between text-xs text-[#5B7184]">
                      <div className="flex items-center gap-2 truncate">
                        <Waves className="w-3.5 h-3.5 text-[#1EC1CB] shrink-0" />
                        <span className="truncate">{trip.weatherRiskReason}</span>
                      </div>

                      {trip.weatherRisk === 'stop' && (
                        <button
                          onClick={() => {
                            setActiveScreen('weather');
                            setShowWeatherRescheduleModal(true);
                          }}
                          className="text-xs font-bold text-[#E11D48] hover:underline cursor-pointer shrink-0 ml-2"
                        >
                          {t('today.rescheduleNow')}
                        </button>
                      )}
                    </div>

                    {/* Active trip guest check-in */}
                    {trip.id === 'trip-2' && (
                      <div className="mt-3 pt-2.5 border-t border-[#A0BDDB]/20">
                        <button
                          onClick={() => {
                            setActiveScreen('guides');
                            setDockModeActive(true);
                          }}
                          className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.3)] transition-all cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4 text-[#0F2A3D]" />
                          <span>{t('today.checkInGuests')}</span>
                        </button>
                        <p className="text-[11px] text-[#5B7184] text-center mt-1.5">
                          {t('today.tapToMarkArrived')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* View all trips link at the bottom of middle column */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setActiveScreen('calendar')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A6C74] hover:text-[#0F2A3D] hover:underline cursor-pointer py-1 px-3"
            >
              <span>{t('today.viewAllTrips')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Needs Attention & Dock Activity */}
        <div className="flex flex-col h-full space-y-4">
          <h2 className="text-base font-bold text-[#0F2A3D]">{t('today.needsAttention')}</h2>

          {/* Action 1: Weather Reschedule required */}
          {stopTrip && (
            <div className="glass-raised p-4 border border-[#FDA4AF] bg-white/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#9F1239]">
                <AlertTriangle className="w-4 h-4 text-[#E11D48]" />
                <span>{t('today.tripOnWeatherHold')}</span>
              </div>
              <p className="text-xs text-[#881337]">
                {t('today.weatherHoldTripDesc', { count: formatNumber(stopTrip.bookedCount) })}
              </p>
              <button
                onClick={() => {
                  setActiveScreen('weather');
                  setShowWeatherRescheduleModal(true);
                }}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[#E11D48] text-white hover:bg-[#BE123C] cursor-pointer"
              >
                {t('today.openWeatherRescheduler')}
              </button>
            </div>
          )}

          {/* Action 2: Unsigned Waivers - Fixed plural bug! */}
          <div className="glass-base p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
                {t('today.digitalWaiversPending')}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                {formatPlural(needsWaiverBookings.length, 'group', 'groups')}
              </span>
            </div>
            <p className="text-xs text-[#5B7184]">
              {t('today.waiverGuestDesc')}
            </p>
            <button
              onClick={handleSendAllWaiverReminders}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-white text-[#0F2A3D] border border-white hover:bg-gray-50 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#1EC1CB]" />
              <span>{t('today.sendSmsWaiverReminder')}</span>
            </button>
          </div>

          {/* Guide Certification Expiry Warning */}
          <div className="glass-base p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F2A3D]">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span>{t('today.guideCertReminder')}</span>
            </div>
            <p className="text-xs text-[#5B7184]">
              {t('today.guideCertDesc')}
            </p>
            <button
              onClick={() => setActiveScreen('guides')}
              className="text-xs font-bold text-[#0A6C74] hover:underline cursor-pointer"
            >
              {t('today.manageGuideCreds')}
            </button>
          </div>

          {/* Quick Share Widget Link - Last card stretched so right column ends on the same line */}
          <div className="glass-base p-4 bg-[#1EC1CB]/10 border-[#1EC1CB]/30 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-[#0F2A3D] block">{t('today.directBookingLink')}</span>
              <p className="text-[11px] text-[#5B7184] mt-0.5">
                {t('today.directLinkDesc')}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <input
                readOnly
                value="https://book.tidewise.app/harbor-kayak"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white text-xs font-mono text-[#0F2A3D] border border-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('https://book.tidewise.app/harbor-kayak');
                  showToast(t('today.directLinkCopiedToast'));
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1EC1CB] text-[#0F2A3D] hover:bg-[#18AEB7] cursor-pointer shrink-0"
              >
                {t('common.copy')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

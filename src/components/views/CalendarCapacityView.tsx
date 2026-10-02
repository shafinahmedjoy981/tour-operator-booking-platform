import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_SEASONS, TODAY_DATE } from '../../data/mockData';
import { WeatherBadge } from '../common/WeatherBadge';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Users,
  Sun,
  CloudSun,
  Snowflake,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ShieldAlert,
  Sliders,
  DollarSign,
} from 'lucide-react';

export const CalendarCapacityView: React.FC = () => {
  const {
    trips,
    setShowQuickSlotModal,
    setSelectedBookingId,
    language,
    t,
    formatDate,
    formatNumber,
    formatCurrency,
  } = useApp();

  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<string>(TODAY_DATE);
  const [activeSeasonTab, setActiveSeasonTab] = useState<string>('season-shoulder');

  // Days for the week view strip
  const weekDays = [
    { date: '2026-09-28', dayNameEn: 'Mon', dayNameBn: 'সোম', dayNum: '28', tripCount: 4, hasStop: false },
    { date: '2026-09-29', dayNameEn: 'Tue', dayNameBn: 'মঙ্গল', dayNum: '29', tripCount: 5, hasStop: false },
    { date: '2026-09-30', dayNameEn: 'Wed', dayNameBn: 'বুধ', dayNum: '30', tripCount: 6, hasStop: true, isToday: true },
    { date: '2026-10-01', dayNameEn: 'Thu', dayNameBn: 'বৃহঃ', dayNum: '01', tripCount: 4, hasStop: false },
    { date: '2026-10-02', dayNameEn: 'Fri', dayNameBn: 'শুক্র', dayNum: '02', tripCount: 6, hasStop: false },
    { date: '2026-10-03', dayNameEn: 'Sat', dayNameBn: 'শনি', dayNum: '03', tripCount: 8, hasStop: false },
    { date: '2026-10-04', dayNameEn: 'Sun', dayNameBn: 'রবি', dayNum: '04', tripCount: 7, hasStop: false },
  ];

  const currentSeason = INITIAL_SEASONS.find((s) => s.id === activeSeasonTab) || INITIAL_SEASONS[1];

  const getSeasonName = (name: string) => {
    if (name.includes('High')) return t('calendar.seasonButton', { season: language === 'bn' ? 'গ্রীষ্মকালীন' : 'High' });
    if (name.includes('Shoulder')) return t('calendar.seasonButton', { season: language === 'bn' ? 'শরতের' : 'Shoulder' });
    return t('calendar.seasonButton', { season: language === 'bn' ? 'বসন্তকালীন' : 'Low' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls: View Toggle & Primary Add Button */}
      <div className="glass-raised p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white/70 rounded-xl border border-white">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                  : 'text-[#5B7184] hover:text-[#0F2A3D]'
              }`}
            >
              {t('calendar.weekView')}
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                  : 'text-[#5B7184] hover:text-[#0F2A3D]'
              }`}
            >
              {t('calendar.monthView')}
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#0F2A3D] font-bold">
            <button className="p-1.5 rounded-lg hover:bg-white text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer" aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>{t('calendar.dateRangeLabel')}</span>
            <button className="p-1.5 rounded-lg hover:bg-white text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer" aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The single primary button */}
        <button
          onClick={() => setShowQuickSlotModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('calendar.addTripSlot')}</span>
        </button>
      </div>

      {/* Week Day Picker Strip */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((d) => {
          const isSelected = selectedDate === d.date;
          return (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'glass-modal border-[#1EC1CB] ring-2 ring-[#1EC1CB]/30'
                  : 'glass-base hover:bg-white'
              } ${d.isToday ? 'relative' : ''}`}
            >
              {d.isToday && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1EC1CB] text-[#0F2A3D]">
                  {t('calendar.todayBadge')}
                </span>
              )}
              <span className="text-[11px] font-semibold text-[#5B7184] block">
                {language === 'bn' ? d.dayNameBn : d.dayNameEn}
              </span>
              <span className="text-lg font-bold text-[#0F2A3D] block tabular-nums my-0.5">
                {formatNumber(d.dayNum)}
              </span>
              <span className="text-[10px] text-[#5B7184] block">
                {t('calendar.slotsCount', { count: formatNumber(d.tripCount) })}
              </span>
              {d.hasStop && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E11D48] mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Slots List with Per-Slot Capacity Bars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F2A3D]">
              {t('calendar.departureSlotsTitle')}
            </h2>
            <p className="text-xs text-[#5B7184]">
              {t('calendar.tideSunset')}
            </p>
          </div>
          <span className="text-xs text-[#5B7184]">
            {t('calendar.totalDayCapacity')}{' '}
            <span className="font-bold text-[#0F2A3D]">
              {t('calendar.bookedRatio', { booked: formatNumber(53), max: formatNumber(72) })}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip) => {
            const booked = trip.bookedCount;
            const max = trip.capacity;
            const pct = Math.round((booked / max) * 100);

            return (
              <div
                key={trip.id}
                className="glass-base p-4 border hover:border-[#1EC1CB]/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0F2A3D] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#1EC1CB]" />
                        {trip.startTime} – {trip.endTime}
                      </span>
                      <WeatherBadge level={trip.weatherRisk} size="sm" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0F2A3D] mt-1 truncate">
                      {trip.title}
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-[#0F2A3D] bg-white/70 px-2 py-1 rounded-lg border border-white shrink-0">
                    {formatCurrency(trip.pricePerPerson)}{t('common.perGuest')}
                  </span>
                </div>

                {/* Per-Slot Capacity Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5B7184]">{t('calendar.capacityBar')}</span>
                    <span className="font-bold text-[#0F2A3D] tabular-nums">
                      {t('calendar.bookedPct', {
                        booked: formatNumber(booked),
                        max: formatNumber(max),
                        pct: formatNumber(pct),
                      })}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#A0BDDB]/25 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 100
                          ? 'bg-[#1EC1CB]'
                          : pct >= 70
                          ? 'bg-[#1EC1CB]'
                          : 'bg-[#A0BDDB]'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-[#5B7184] border-t border-[#A0BDDB]/20">
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#1EC1CB]" />
                    <span>{(language === 'bn' && trip.guideNameBn ? trip.guideNameBn : trip.guideName) || t('calendar.noGuideAssigned')}</span>
                  </div>
                  <span className="text-[11px]">{trip.dockLocation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Season Rules Panel: High / Shoulder / Low Season */}
      <div className="glass-raised p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#A0BDDB]/25 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#1EC1CB]" />
              <h2 className="text-base font-bold text-[#0F2A3D]">
                {t('calendar.seasonRulesTitle')}
              </h2>
            </div>
            <p className="text-xs text-[#5B7184] mt-0.5">
              {t('calendar.seasonRulesSubtitle')}
            </p>
          </div>

          {/* Season Segmented Switch */}
          <div className="flex items-center gap-1 p-1 bg-white/70 rounded-xl border border-white">
            {INITIAL_SEASONS.map((season) => (
              <button
                key={season.id}
                onClick={() => setActiveSeasonTab(season.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSeasonTab === season.id
                    ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                    : 'text-[#5B7184] hover:text-[#0F2A3D]'
                }`}
              >
                {getSeasonName(season.name)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Season Details Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-white/70 border border-white">
            <span className="text-[11px] font-bold text-[#5B7184] uppercase tracking-wider block">
              {t('calendar.activeDateRange')}
            </span>
            <span className="text-sm font-bold text-[#0F2A3D] mt-1 block">
              {currentSeason.dates}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-white">
            <span className="text-[11px] font-bold text-[#5B7184] uppercase tracking-wider block">
              {t('calendar.capacityMultiplier')}
            </span>
            <span className="text-sm font-bold text-[#0A6C74] mt-1 block">
              {t('calendar.maxSlots', { pct: formatNumber(currentSeason.capacityMultiplier * 100) })}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-white">
            <span className="text-[11px] font-bold text-[#5B7184] uppercase tracking-wider block">
              {t('calendar.pricingAdjustment')}
            </span>
            <span className="text-sm font-bold text-[#0F2A3D] mt-1 block">
              {currentSeason.priceModifier}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-white">
            <span className="text-[11px] font-bold text-[#5B7184] uppercase tracking-wider block">
              {t('calendar.operatingWindow')}
            </span>
            <span className="text-sm font-bold text-[#0F2A3D] mt-1 block">
              {currentSeason.operatingHours}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#5B7184] bg-white/50 p-3 rounded-xl border border-white">
          <span className="font-semibold text-[#0F2A3D]">{t('calendar.seasonNote')} </span>
          {currentSeason.description}
          {currentSeason.blackoutDates.length > 0 && (
            <span className="ml-2 font-semibold text-[#E11D48]">
              {t('calendar.blackoutDatesLabel')} {currentSeason.blackoutDates.join(', ')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

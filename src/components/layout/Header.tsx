import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import {
  Globe,
  Clock,
  Plus,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    language,
    setLanguage,
    setShowNewBookingModal,
    setShowWeatherRescheduleModal,
    trips,
    t,
  } = useApp();

  const currentTitle = t(`nav.${activeScreen}`);
  const currentSubtitle = t(`subtitles.${activeScreen}`);

  const stopTrip = trips.find((tr) => tr.weatherRisk === 'stop');

  return (
    <div className="sticky top-0 z-30 pt-4 w-full">
      {/* 16px background strip behind the top gap so scrolling cards never show above the bar */}
      <div
        className="absolute top-0 left-0 right-0 h-4 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #F0F6FA 0%, #FFFFFF 40%, #E8F2FA 100%)',
        }}
        aria-hidden="true"
      />

      {/* Floating Glass Top Bar Card */}
      <header className="glass-raised rounded-[24px] min-h-[72px] sm:min-h-[88px] sm:h-[88px] px-4 sm:px-6 flex items-center justify-between gap-3 w-full select-none">
        {/* Left: Title + Badge, Subtitle under */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#0F2A3D] font-display leading-tight whitespace-nowrap">
              {currentTitle}
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1EC1CB]/15 text-[#0A6C74] border border-[#1EC1CB]/30 whitespace-nowrap shrink-0">
              <ShieldCheck className="w-3 h-3 text-[#1EC1CB] shrink-0" />
              <span className="hidden sm:inline">{t('zeroCommissionDirect')}</span>
              <span className="sm:hidden">{t('zeroPercentFee')}</span>
            </span>
          </div>
          <p className="text-xs text-[#5B7184] mt-0.5 leading-normal truncate max-w-[210px] sm:max-w-md lg:max-w-none">
            {currentSubtitle}
          </p>
        </div>

        {/* Right: Single non-wrapping row with 12px gaps */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          {/* Timezone / Location (Place name stays as is: Bar Harbor, ME) */}
          <div className="hidden xl:flex flex-row items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/80 border border-white/90 text-xs text-[#5B7184] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#1EC1CB] shrink-0" />
            <span className="font-medium text-[#0F2A3D]">Bar Harbor, ME</span>
            <span className="text-[#A0BDDB]" aria-hidden="true">·</span>
            <span className="tabular-nums">EDT (UTC-4)</span>
          </div>
          <div className="hidden md:flex xl:hidden flex-row items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/80 border border-white/90 text-xs text-[#5B7184] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#1EC1CB] shrink-0" />
            <span className="tabular-nums">EDT (UTC-4)</span>
          </div>

          {/* Weather Alert Pill */}
          {stopTrip && activeScreen !== 'weather' && (
            <button
              onClick={() => {
                setActiveScreen('weather');
                setShowWeatherRescheduleModal(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-[#FFE4E6] text-[#9F1239] border border-[#FDA4AF] hover:bg-[#FEE2E2] transition-colors cursor-pointer animate-pulse shrink-0 min-h-[38px]"
              title={t('oneWeatherHold')}
            >
              <AlertTriangle className="w-4 h-4 text-[#E11D48] sm:hidden" />
              <span className="hidden sm:inline">{t('oneWeatherHold')}</span>
              <span className="hidden sm:inline text-[10px] underline ml-0.5">{t('review')}</span>
            </button>
          )}

          {/* Language Toggle (shows language you can switch TO: "বাংলা" when in English, "English" when in Bangla) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            aria-label={t('switchLanguage')}
            className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-white/70 hover:bg-white text-[#0F2A3D] border border-white/90 shadow-xs transition-all cursor-pointer min-h-[38px] min-w-[38px] shrink-0"
          >
            <Globe className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#1EC1CB] shrink-0" />
            <span className="hidden sm:inline font-bold">{language === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

          {/* Primary Quick-Add Booking Button */}
          <button
            onClick={() => setShowNewBookingModal(true)}
            className="flex items-center justify-center gap-1.5 p-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer min-h-[38px] min-w-[38px] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span className="hidden sm:inline">{t('addBooking')}</span>
          </button>
        </div>
      </header>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeatherBadge } from '../common/WeatherBadge';
import {
  CloudLightning,
  Wind,
  Waves,
  CloudRain,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  Gift,
  ShieldCheck,
  Send,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const WeatherWatchView: React.FC = () => {
  const {
    trips,
    weatherSettings,
    setWeatherSettings,
    setShowWeatherRescheduleModal,
    weatherRescheduleStats,
    showToast,
    language,
    t,
    formatNumber,
    formatTime,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'thresholds' | 'policy'>('monitoring');

  // Find stop trip
  const stopTrip = trips.find((t) => t.weatherRisk === 'stop');

  // 72-hour outlook hourly forecast for Casco Bay
  const hourlyOutlook = [
    { timeEn: '12 PM', timeBn: '১২ অপরাহ্ন', tempEn: '66°F', tempBn: '৬৬°F', windEn: '11 kts', windBn: '১১ নট', waveEn: '0.6 m', waveBn: '০.৬ মি', rainEn: '10%', rainBn: '১০%', risk: 'go' as const },
    { timeEn: '01 PM', timeBn: '০১ অপরাহ্ন', tempEn: '67°F', tempBn: '৬৭°F', windEn: '14 kts', windBn: '১৪ নট', waveEn: '0.8 m', waveBn: '০.৮ মি', rainEn: '20%', rainBn: '২০%', risk: 'go' as const },
    { timeEn: '02 PM', timeBn: '০২ অপরাহ্ন', tempEn: '65°F', tempBn: '৬৫°F', windEn: '16 kts', windBn: '১৬ নট', waveEn: '0.9 m', waveBn: '০.৯ মি', rainEn: '30%', rainBn: '৩০%', risk: 'caution' as const },
    { timeEn: '03 PM', timeBn: '০৩ অপরাহ্ন', tempEn: '62°F', tempBn: '৬২°F', windEn: '22 kts', windBn: '২২ নট', waveEn: '1.4 m', waveBn: '১.৪ মি', rainEn: '65%', rainBn: '৬৫%', risk: 'caution' as const },
    { timeEn: '04 PM', timeBn: '০৪ অপরাহ্ন', tempEn: '59°F', tempBn: '৫৯°F', windEn: '28 kts', windBn: '২৮ নট', waveEn: '1.8 m', waveBn: '১.৮ মি', rainEn: '85%', rainBn: '৮৫%', risk: 'stop' as const, isPeak: true },
    { timeEn: '05 PM', timeBn: '০৫ অপরাহ্ন', tempEn: '58°F', tempBn: '৫৮°F', windEn: '26 kts', windBn: '২৬ নট', waveEn: '1.7 m', waveBn: '১.৭ মি', rainEn: '80%', rainBn: '৮০%', risk: 'stop' as const },
    { timeEn: '06 PM', timeBn: '০৬ অপরাহ্ন', tempEn: '59°F', tempBn: '৫৯°F', windEn: '20 kts', windBn: '২০ নট', waveEn: '1.3 m', waveBn: '১.৩ মি', rainEn: '55%', rainBn: '৫৫%', risk: 'caution' as const },
    { timeEn: '07 PM', timeBn: '০৭ অপরাহ্ন', tempEn: '58°F', tempBn: '৫৮°F', windEn: '15 kts', windBn: '১৫ নট', waveEn: '0.9 m', waveBn: '০.৯ মি', rainEn: '30%', rainBn: '৩০%', risk: 'caution' as const },
    { timeEn: '08 PM', timeBn: '০৮ অপরাহ্ন', tempEn: '56°F', tempBn: '৫৬°F', windEn: '10 kts', windBn: '১০ নট', waveEn: '0.5 m', waveBn: '০.৫ মি', rainEn: '15%', rainBn: '১৫%', risk: 'go' as const },
    { timeEn: 'Tomorrow 9 AM', timeBn: 'আগামীকাল ০৯ পূর্বাহ্ণ', tempEn: '64°F', tempBn: '৬৪°F', windEn: '8 kts', windBn: '৮ নট', waveEn: '0.4 m', waveBn: '০.৪ মি', rainEn: '5%', rainBn: '৫%', risk: 'go' as const },
    { timeEn: 'Tomorrow 2 PM', timeBn: 'আগামীকাল ০২ অপরাহ্ন', tempEn: '68°F', tempBn: '৬৮°F', windEn: '9 kts', windBn: '৯ নট', waveEn: '0.5 m', waveBn: '০.৫ মি', rainEn: '10%', rainBn: '১০%', risk: 'go' as const },
  ];

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t('weatherWatch.thresholdsSavedToast'));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation tabs within Weather Watch */}
      <div className="glass-raised p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-white/70 rounded-xl border border-white">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'monitoring'
                ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                : 'text-[#5B7184] hover:text-[#0F2A3D]'
            }`}
          >
            {t('weatherWatch.tabMonitoring')}
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'thresholds'
                ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                : 'text-[#5B7184] hover:text-[#0F2A3D]'
            }`}
          >
            {t('weatherWatch.tabThresholds')}
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'policy'
                ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                : 'text-[#5B7184] hover:text-[#0F2A3D]'
            }`}
          >
            {t('weatherWatch.tabPolicy')}
          </button>
        </div>

        <span className="text-xs text-[#5B7184]">
          {t('weatherWatch.stationId')}
        </span>
      </div>

      {activeTab === 'monitoring' && (
        <>
          {/* Hero Banner: Single Primary Action when risk is STOP */}
          {stopTrip ? (
            <div className="glass-modal p-6 border-l-4 border-l-[#E11D48] bg-white/90 shadow-[0_16px_40px_rgba(225,29,72,0.14)] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#E11D48] shrink-0 border border-[#FDA4AF]">
                    <CloudLightning className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-[#9F1239]">
                        {t('weatherWatch.alertTitle')}
                      </h2>
                      <WeatherBadge level="stop" size="sm" />
                    </div>
                    <p className="text-xs text-[#881337] mt-1 max-w-2xl leading-relaxed">
                      {t('weatherWatch.alertDesc', {
                        time: stopTrip.startTime,
                        title: stopTrip.title,
                        count: formatNumber(stopTrip.bookedCount),
                        reason: stopTrip.weatherRiskReason,
                      })}
                    </p>
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  onClick={() => setShowWeatherRescheduleModal(true)}
                  className="px-6 py-3 rounded-2xl text-sm font-bold bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-[0_4px_20px_rgba(225,29,72,0.38)] transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
                >
                  {t('weatherWatch.moveGuestsBtn')}
                </button>
              </div>

              {/* Resolution Live Tracker Pill */}
              <div className="pt-3 border-t border-[#FDA4AF]/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#881337] flex-wrap">
                  <span className="font-bold">{t('weatherWatch.trackerTitle')}</span>
                  <span className="bg-white/80 px-2.5 py-0.5 rounded-full font-semibold border border-white">
                    {t('weatherWatch.choseNewDate', { count: formatNumber(weatherRescheduleStats.choseNewDate) })}
                  </span>
                  <span className="bg-white/80 px-2.5 py-0.5 rounded-full font-semibold border border-white">
                    {t('weatherWatch.refundsProcessed', { count: formatNumber(weatherRescheduleStats.refunded) })}
                  </span>
                  <span className="bg-[#FFE4E6] px-2.5 py-0.5 rounded-full font-semibold border border-[#FDA4AF]">
                    {t('weatherWatch.awaitingResponse', { count: formatNumber(weatherRescheduleStats.waitingResponse) })}
                  </span>
                </div>

                <span className="text-[11px] text-[#5B7184]">
                  {t('weatherWatch.zeroPenalties')}
                </span>
              </div>
            </div>
          ) : (
            <div className="glass-base p-4 border border-[#86EFAC] bg-[#DCFCE7]/30 flex items-center justify-between text-xs text-[#14532D]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="font-semibold">{t('weatherWatch.safeBanner')}</span>
              </div>
              <span>{t('weatherWatch.nextRadarCheck')}</span>
            </div>
          )}

          {/* 72-Hour Outlook Strip */}
          <div className="glass-base p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F2A3D] uppercase tracking-wide">
                  {t('weatherWatch.outlookTitle')}
                </h3>
                <p className="text-xs text-[#5B7184]">
                  {t('weatherWatch.outlookSubtitle')}
                </p>
              </div>
              <span className="text-[11px] text-[#5B7184]">{t('weatherWatch.scrollPrompt')}</span>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-2.5 min-w-max">
                {hourlyOutlook.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-center min-w-[105px] transition-all ${
                      item.risk === 'stop'
                        ? 'bg-[#FFE4E6] border-[#FDA4AF] shadow-xs'
                        : item.risk === 'caution'
                        ? 'bg-[#FEF3C7]/70 border-[#FDE68A]'
                        : 'bg-white/70 border-white hover:bg-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-[#5B7184] block">
                      {language === 'bn' ? item.timeBn : item.timeEn}
                    </span>
                    <span className="text-sm font-bold text-[#0F2A3D] block my-1">
                      {language === 'bn' ? item.tempBn : item.tempEn}
                    </span>

                    <div className="space-y-1 text-[10px] text-[#5B7184]">
                      <div className="flex items-center justify-center gap-1">
                        <Wind className="w-3 h-3 text-[#1EC1CB]" />
                        <span className="font-semibold text-[#0F2A3D]">
                          {language === 'bn' ? item.windBn : item.windEn}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Waves className="w-3 h-3 text-[#1EC1CB]" />
                        <span className="font-semibold text-[#0F2A3D]">
                          {language === 'bn' ? item.waveBn : item.waveEn}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <CloudRain className="w-3 h-3 text-[#1EC1CB]" />
                        <span className="font-semibold text-[#0F2A3D]">
                          {language === 'bn' ? item.rainBn : item.rainEn}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <WeatherBadge level={item.risk} size="sm" showIconOnly />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Scheduled Trips Condition Matrix */}
          <div className="glass-base p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#0F2A3D] uppercase tracking-wide">
              {t('weatherWatch.matrixTitle')}
            </h3>

            <div className="space-y-3">
              {trips.map((tr) => (
                <div
                  key={tr.id}
                  className="p-4 rounded-2xl bg-white/70 border border-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#0F2A3D]">
                        {tr.startTime} · {tr.title}
                      </span>
                      <WeatherBadge level={tr.weatherRisk} size="sm" />
                    </div>
                    <p className="text-xs text-[#5B7184] mt-1">{tr.weatherRiskReason}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 flex-wrap">
                    <div className="text-center">
                      <span className="text-[10px] text-[#5B7184] block">{t('weatherWatch.windCol')}</span>
                      <span className="font-bold text-[#0F2A3D]">
                        {formatNumber(tr.windSpeedKnots)} {t('weather.knots')}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-[#5B7184] block">{t('weatherWatch.wavesCol')}</span>
                      <span className="font-bold text-[#0F2A3D]">
                        {formatNumber(tr.waveHeightMeters, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {t('weather.meters')}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-[#5B7184] block">{t('weatherWatch.rainCol')}</span>
                      <span className="font-bold text-[#0F2A3D]">{formatNumber(tr.rainChancePercent)}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-[#5B7184] block">{t('weatherWatch.lightningCol')}</span>
                      <span
                        className={`font-bold ${
                          tr.lightningDetected ? 'text-[#E11D48]' : 'text-[#16A34A]'
                        }`}
                      >
                        {tr.lightningDetected ? t('weatherWatch.detected') : t('weatherWatch.clear')}
                      </span>
                    </div>

                    {tr.weatherRisk === 'stop' && (
                      <button
                        onClick={() => setShowWeatherRescheduleModal(true)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E11D48] text-white hover:bg-[#BE123C] cursor-pointer"
                      >
                        {t('weatherWatch.moveGuestsSmall')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Operator Custom Thresholds */}
      {activeTab === 'thresholds' && (
        <form onSubmit={handleSaveThresholds} className="glass-raised p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#0F2A3D]">
              {t('weatherWatch.thresholdsTitle')}
            </h2>
            <p className="text-xs text-[#5B7184] mt-0.5">
              {t('weatherWatch.thresholdsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-2">
              <label className="block text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
                {t('weatherWatch.windLabel')}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={35}
                  value={weatherSettings.maxWindSpeedKnots}
                  onChange={(e) =>
                    setWeatherSettings({
                      ...weatherSettings,
                      maxWindSpeedKnots: parseInt(e.target.value),
                    })
                  }
                  className="flex-1 accent-[#1EC1CB]"
                />
                <span className="w-16 text-center font-bold text-sm text-[#0F2A3D] tabular-nums">
                  {formatNumber(weatherSettings.maxWindSpeedKnots)} {t('weather.knots')}
                </span>
              </div>
              <p className="text-[11px] text-[#5B7184]">
                {t('weatherWatch.windHint')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-2">
              <label className="block text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
                {t('weatherWatch.waveLabel')}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  value={weatherSettings.maxWaveHeightMeters}
                  onChange={(e) =>
                    setWeatherSettings({
                      ...weatherSettings,
                      maxWaveHeightMeters: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 accent-[#1EC1CB]"
                />
                <span className="w-16 text-center font-bold text-sm text-[#0F2A3D] tabular-nums">
                  {formatNumber(weatherSettings.maxWaveHeightMeters, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {t('weather.meters')}
                </span>
              </div>
              <p className="text-[11px] text-[#5B7184]">
                {t('weatherWatch.waveHint')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-2">
              <label className="block text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
                {t('weatherWatch.rainLabel')}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={20}
                  max={90}
                  value={weatherSettings.maxRainChancePercent}
                  onChange={(e) =>
                    setWeatherSettings({
                      ...weatherSettings,
                      maxRainChancePercent: parseInt(e.target.value),
                    })
                  }
                  className="flex-1 accent-[#1EC1CB]"
                />
                <span className="w-16 text-center font-bold text-sm text-[#0F2A3D] tabular-nums">
                  {formatNumber(weatherSettings.maxRainChancePercent)}%
                </span>
              </div>
              <p className="text-[11px] text-[#5B7184]">
                {t('weatherWatch.rainHint')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-2">
              <label className="block text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
                {t('weatherWatch.lightningLabel')}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={25}
                  value={weatherSettings.lightningRadiusMiles}
                  onChange={(e) =>
                    setWeatherSettings({
                      ...weatherSettings,
                      lightningRadiusMiles: parseInt(e.target.value),
                    })
                  }
                  className="flex-1 accent-[#1EC1CB]"
                />
                <span className="w-16 text-center font-bold text-sm text-[#0F2A3D] tabular-nums">
                  {formatNumber(weatherSettings.lightningRadiusMiles)} {language === 'bn' ? 'মাইল' : 'mi'}
                </span>
              </div>
              <p className="text-[11px] text-[#5B7184]">
                {t('weatherWatch.lightningHint')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1EC1CB] text-[#0F2A3D] hover:bg-[#18AEB7] shadow-sm cursor-pointer"
            >
              {t('weatherWatch.saveThresholdsBtn')}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Weather Policy Settings */}
      {activeTab === 'policy' && (
        <div className="glass-raised p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#0F2A3D]">
              {t('weatherWatch.policyTitle')}
            </h2>
            <p className="text-xs text-[#5B7184] mt-0.5">
              {t('weatherWatch.policySubtitle')}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/70 border border-white flex items-start gap-3">
              <input
                type="radio"
                name="policy"
                defaultChecked
                className="mt-1 accent-[#1EC1CB]"
              />
              <div>
                <span className="text-sm font-bold text-[#0F2A3D] block">
                  {t('weatherWatch.policyOpt1Title')}
                </span>
                <p className="text-xs text-[#5B7184] mt-0.5">
                  {t('weatherWatch.policyOpt1Desc')}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white flex items-start gap-3">
              <input type="radio" name="policy" className="mt-1 accent-[#1EC1CB]" />
              <div>
                <span className="text-sm font-bold text-[#0F2A3D] block">
                  {t('weatherWatch.policyOpt2Title')}
                </span>
                <p className="text-xs text-[#5B7184] mt-0.5">
                  {t('weatherWatch.policyOpt2Desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#DCFCE7]/70 border border-[#86EFAC] text-xs text-[#14532D]">
            <span className="font-bold block mb-1">{t('weatherWatch.zeroPenaltyGuaranteeTitle')}</span>
            {t('weatherWatch.zeroPenaltyGuarantee')}
          </div>
        </div>
      )}
    </div>
  );
};

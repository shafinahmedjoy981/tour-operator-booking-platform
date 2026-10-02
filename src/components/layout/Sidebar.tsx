import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenType } from '../../types';
import { t } from '../../utils/translations';
import {
  Compass,
  Calendar,
  Ticket,
  Users,
  CloudSunRain,
  UserCheck,
  Contact,
  Code2,
  DollarSign,
  Settings,
  AlertCircle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    language,
    trips,
    guides,
    t,
  } = useApp();

  // Check if any trip is at 'stop' risk to show subtle indicator on Weather tab
  const hasWeatherAlert = trips.some((tr) => tr.weatherRisk === 'stop');
  // Check if any guide has expiring certifications
  const hasCertAlert = guides.some((g) =>
    g.certifications.some((c) => c.isExpiringSoon || c.isExpired)
  );

  const navItems: Array<{
    id: ScreenType;
    label: string;
    icon: React.ElementType;
    badge?: string | boolean;
    badgeColor?: string;
  }> = [
    { id: 'today', label: t('nav.today'), icon: Compass },
    { id: 'calendar', label: t('nav.calendar'), icon: Calendar },
    { id: 'bookings', label: t('nav.bookings'), icon: Ticket },
    { id: 'groups', label: t('nav.groups'), icon: Users },
    {
      id: 'weather',
      label: t('nav.weather'),
      icon: CloudSunRain,
      badge: hasWeatherAlert ? (language === 'bn' ? 'সতর্কতা' : 'Action') : undefined,
      badgeColor: 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]',
    },
    {
      id: 'guides',
      label: t('nav.guides'),
      icon: UserCheck,
      badge: hasCertAlert ? (language === 'bn' ? '১ সতর্কতা' : '1 alert') : undefined,
      badgeColor: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
    },
    { id: 'customers', label: t('nav.customers'), icon: Contact },
    { id: 'widget', label: t('nav.widget'), icon: Code2 },
    { id: 'payments', label: t('nav.payments'), icon: DollarSign },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-[100dvh] sticky top-0 pl-4 pt-4 pb-4 pr-0 shrink-0 z-30 select-none">
        <div className="glass-raised flex-1 flex flex-col p-4 h-full rounded-[24px]">
          {/* Brand Wordmark & Business Name (matched to Top Bar height) */}
          <div className="px-3 py-2 mb-3 min-h-[56px] flex flex-col justify-center">
            <span className="text-xl font-bold tracking-tight text-[#0F2A3D] font-display block leading-tight">
              Tidewise
            </span>
            <p className="text-xs text-[#5B7184] whitespace-normal mt-0.5 leading-normal">
              Kayak & Boat Co.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveScreen(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-180 text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1EC1CB] to-[#12A4AD] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] font-bold'
                      : 'text-[#0F2A3D] hover:bg-white/60 hover:text-[#0F2A3D]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#0F2A3D] stroke-[2.5]' : 'text-[#5B7184]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.badgeColor || 'bg-white/80 text-[#0F2A3D]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Bottom: Business Profile & Help Link */}
          <div className="mt-auto pt-3 border-t border-[#A0BDDB]/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-[#1EC1CB]/15 text-[#0A6C74] font-bold text-xs flex items-center justify-center shrink-0 border border-[#1EC1CB]/30">
                KB
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[#0F2A3D] text-xs block truncate">
                  Harbor Dock #2
                </span>
                <span className="text-[10px] text-[#5B7184] block truncate">
                  Casco Bay, ME
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveScreen('settings')}
              className="text-[11px] font-bold text-[#0A6C74] hover:text-[#0F2A3D] hover:underline cursor-pointer shrink-0"
            >
              {t('help')}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Bottom Navigation Glass Card with 16px margin */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 glass-raised rounded-[24px] px-2 py-1.5 shadow-[0_14px_40px_rgba(160,189,219,0.35)]">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { id: 'today' as ScreenType, label: t('nav.today'), icon: Compass },
            { id: 'bookings' as ScreenType, label: t('nav.bookings'), icon: Ticket },
            {
              id: 'weather' as ScreenType,
              label: t('nav.weather'),
              icon: CloudSunRain,
              hasDot: hasWeatherAlert,
            },
            { id: 'guides' as ScreenType, label: t('nav.guides'), icon: UserCheck },
            { id: 'payments' as ScreenType, label: t('nav.payments'), icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveScreen(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] min-h-[44px] rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                  isActive ? 'text-[#0A6C74]' : 'text-[#5B7184] hover:text-[#0F2A3D]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#1EC1CB] stroke-[2.5]' : ''}`} />
                  {tab.hasDot && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-white" />
                  )}
                </div>
                <span className="truncate max-w-[64px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

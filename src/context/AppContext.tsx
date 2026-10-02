import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenType,
  Language,
  Trip,
  Booking,
  GroupBooking,
  Guide,
  Customer,
  PaymentRecord,
  WeatherSettings,
} from '../types';
import {
  INITIAL_TRIPS,
  INITIAL_BOOKINGS,
  INITIAL_GROUPS,
  INITIAL_GUIDES,
  INITIAL_CUSTOMERS,
  INITIAL_PAYMENTS,
  INITIAL_WEATHER_SETTINGS,
  TODAY_DATE,
} from '../data/mockData';
import { getTranslation } from '../utils/translations';
import {
  formatNumber as fmtNumber,
  formatCurrency as fmtCurrency,
  formatDate as fmtDate,
  formatTime as fmtTime,
  formatPlural as fmtPlural,
} from '../utils/formatters';

interface AppContextType {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatNumber: (num: number | string, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => string;
  formatCurrency: (amount: number | string, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => string;
  formatDate: (dateInput: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (timeStr: string) => string;
  formatPlural: (count: number, singularEn: string, pluralEn: string, banglaSuffix?: string) => string;
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  groups: GroupBooking[];
  setGroups: React.Dispatch<React.SetStateAction<GroupBooking[]>>;
  guides: Guide[];
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  payments: PaymentRecord[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  weatherSettings: WeatherSettings;
  setWeatherSettings: React.Dispatch<React.SetStateAction<WeatherSettings>>;
  // Quick Actions & Helper Modals
  dockModeActive: boolean;
  setDockModeActive: (active: boolean) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  showWeatherRescheduleModal: boolean;
  setShowWeatherRescheduleModal: (show: boolean) => void;
  showNewBookingModal: boolean;
  setShowNewBookingModal: (show: boolean) => void;
  showNewGroupModal: boolean;
  setShowNewGroupModal: (show: boolean) => void;
  showQuickSlotModal: boolean;
  setShowQuickSlotModal: (show: boolean) => void;
  // Computed stats
  totalCommissionSavedMonth: number;
  todayRevenue: number;
  todayBookedGuests: number;
  // Weather Reschedule Tracker State
  weatherRescheduleStats: {
    tripId: string;
    totalGuests: number;
    choseNewDate: number;
    refunded: number;
    waitingResponse: number;
    isProcessed: boolean;
  };
  setWeatherRescheduleStats: React.Dispatch<React.SetStateAction<any>>;
  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('today');
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('tidewise_lang');
      if (saved === 'en' || saved === 'bn') return saved;
    } catch {
      // LocalStorage not available
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('tidewise_lang', lang);
    } catch {
      // Storage restricted
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // Ignore
    }
  }, [language]);

  const t = (path: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, path, params);
  };

  const formatNumber = (
    num: number | string,
    options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
  ): string => {
    return fmtNumber(num, language, options);
  };

  const formatCurrency = (
    amount: number | string,
    options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
  ): string => {
    return fmtCurrency(amount, language, options);
  };

  const formatDate = (dateInput: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    return fmtDate(dateInput, language, options);
  };

  const formatTime = (timeStr: string): string => {
    return fmtTime(timeStr, language);
  };

  const formatPlural = (
    count: number,
    singularEn: string,
    pluralEn: string,
    banglaSuffix?: string
  ): string => {
    return fmtPlural(count, singularEn, pluralEn, language, banglaSuffix);
  };

  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [groups, setGroups] = useState<GroupBooking[]>(INITIAL_GROUPS);
  const [guides, setGuides] = useState<Guide[]>(INITIAL_GUIDES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [weatherSettings, setWeatherSettings] = useState<WeatherSettings>(INITIAL_WEATHER_SETTINGS);

  const [dockModeActive, setDockModeActive] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showWeatherRescheduleModal, setShowWeatherRescheduleModal] = useState<boolean>(false);
  const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState<boolean>(false);
  const [showQuickSlotModal, setShowQuickSlotModal] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [weatherRescheduleStats, setWeatherRescheduleStats] = useState({
    tripId: 'trip-4',
    totalGuests: 17,
    choseNewDate: 12,
    refunded: 3,
    waitingResponse: 2,
    isProcessed: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Computed live metrics
  const totalCommissionSavedMonth = payments.reduce(
    (acc, curr) => acc + (curr.commissionSavedVsMarketplace || 0),
    0
  );

  const todayRevenue = payments
    .filter((p) => p.date.includes(TODAY_DATE))
    .reduce((acc, curr) => acc + curr.grossAmount, 0);

  const todayBookedGuests = trips
    .filter((t) => t.date === TODAY_DATE)
    .reduce((acc, curr) => acc + curr.bookedCount, 0);

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatNumber,
        formatCurrency,
        formatDate,
        formatTime,
        formatPlural,
        trips,
        setTrips,
        bookings,
        setBookings,
        groups,
        setGroups,
        guides,
        setGuides,
        customers,
        setCustomers,
        payments,
        setPayments,
        weatherSettings,
        setWeatherSettings,
        dockModeActive,
        setDockModeActive,
        selectedBookingId,
        setSelectedBookingId,
        selectedCustomerId,
        setSelectedCustomerId,
        showWeatherRescheduleModal,
        setShowWeatherRescheduleModal,
        showNewBookingModal,
        setShowNewBookingModal,
        showNewGroupModal,
        setShowNewGroupModal,
        showQuickSlotModal,
        setShowQuickSlotModal,
        totalCommissionSavedMonth,
        todayRevenue,
        todayBookedGuests,
        weatherRescheduleStats,
        setWeatherRescheduleStats,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toast } from './components/common/Toast';
import { WeatherRescheduleModal } from './components/modals/WeatherRescheduleModal';
import { NewBookingModal } from './components/modals/NewBookingModal';
import { BookingDetailDrawer } from './components/modals/BookingDetailDrawer';
import { CustomerDetailDrawer } from './components/modals/CustomerDetailDrawer';
import { QuickSlotModal } from './components/modals/QuickSlotModal';
import { NewGroupModal } from './components/modals/NewGroupModal';

// 10 Section Views
import { TodayView } from './components/views/TodayView';
import { CalendarCapacityView } from './components/views/CalendarCapacityView';
import { BookingsView } from './components/views/BookingsView';
import { GroupBookingsView } from './components/views/GroupBookingsView';
import { WeatherWatchView } from './components/views/WeatherWatchView';
import { GuidesView } from './components/views/GuidesView';
import { CustomersView } from './components/views/CustomersView';
import { BookingWidgetView } from './components/views/BookingWidgetView';
import { PaymentsView } from './components/views/PaymentsView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { activeScreen } = useApp();

  return (
    <div className="flex-1 flex flex-col min-w-0 px-4 pb-24 lg:px-0 lg:pr-4 lg:pb-4">
      <Header />
      <main className="flex-1 w-full pt-4">
        {activeScreen === 'today' && <TodayView />}
        {activeScreen === 'calendar' && <CalendarCapacityView />}
        {activeScreen === 'bookings' && <BookingsView />}
        {activeScreen === 'groups' && <GroupBookingsView />}
        {activeScreen === 'weather' && <WeatherWatchView />}
        {activeScreen === 'guides' && <GuidesView />}
        {activeScreen === 'customers' && <CustomersView />}
        {activeScreen === 'widget' && <BookingWidgetView />}
        {activeScreen === 'payments' && <PaymentsView />}
        {activeScreen === 'settings' && <SettingsView />}
      </main>

      {/* Global Modals & Drawers */}
      <WeatherRescheduleModal />
      <NewBookingModal />
      <BookingDetailDrawer />
      <CustomerDetailDrawer />
      <QuickSlotModal />
      <NewGroupModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      {/* Background Crystal Mesh Blobs */}
      <div className="crystal-mesh-bg">
        <div className="crystal-mesh-blob-1" />
        <div className="crystal-mesh-blob-2" />
        <div className="crystal-mesh-blob-3" />
      </div>

      <div className="min-h-screen flex gap-4 text-[#0F2A3D]">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip } from '../../types';
import { TODAY_DATE } from '../../data/mockData';
import { X, Calendar, Clock, Users, Plus, Compass } from 'lucide-react';

export const QuickSlotModal: React.FC = () => {
  const {
    showQuickSlotModal,
    setShowQuickSlotModal,
    trips,
    setTrips,
    guides,
    showToast,
    language,
  } = useApp();

  const [title, setTitle] = useState<string>('Harbor Cove Guided Kayak');
  const [type, setType] = useState<'guided_tour' | 'boat_trip' | 'kayak_rental'>('guided_tour');
  const [startTime, setStartTime] = useState<string>('04:00 PM');
  const [endTime, setEndTime] = useState<string>('06:00 PM');
  const [capacity, setCapacity] = useState<number>(8);
  const [pricePerPerson, setPricePerPerson] = useState<number>(65);
  const [guideId, setGuideId] = useState<string>(guides[0]?.id || 'guide-1');
  const [date, setDate] = useState<string>(TODAY_DATE);

  if (!showQuickSlotModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedGuide = guides.find((g) => g.id === guideId);

    const newTrip: Trip = {
      id: `trip-${Date.now().toString().slice(-4)}`,
      title,
      type,
      startTime,
      endTime,
      durationMinutes: 120,
      capacity,
      bookedCount: 0,
      pricePerPerson,
      guideId: assignedGuide?.id,
      guideName: assignedGuide?.name,
      guideNameBn: assignedGuide?.nameBn,
      status: 'scheduled',
      weatherRisk: 'go',
      weatherRiskReason: 'Forecast favorable for coastal waters',
      waveHeightMeters: 0.4,
      windSpeedKnots: 8,
      rainChancePercent: 10,
      lightningDetected: false,
      minGuests: 2,
      maxGuests: capacity,
      dockLocation: 'North Slip Pier B',
      date,
    };

    setTrips((prev) => [...prev, newTrip]);
    setShowQuickSlotModal(false);
    showToast(`New trip slot "${title}" added for ${startTime}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A3D]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-md overflow-hidden rounded-3xl border border-white/90 shadow-[0_24px_64px_rgba(15,42,61,0.22)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#A0BDDB]/25 flex items-center justify-between bg-white/70">
          <div>
            <h2 className="text-base font-bold text-[#0F2A3D]">Quick-Add Trip Slot</h2>
            <p className="text-xs text-[#5B7184]">
              Instantly open a new departure slot on the calendar
            </p>
          </div>
          <button
            onClick={() => setShowQuickSlotModal(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
              Trip Name:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                Activity Type:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              >
                <option value="guided_tour">Guided Kayak Tour</option>
                <option value="boat_trip">Scenic Boat Trip</option>
                <option value="kayak_rental">Self-Guided Rental</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                Departure Time:
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="04:00 PM"
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                Return Time:
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="06:00 PM"
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                Capacity (Max Guests):
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 8)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                Price Per Guest ($):
              </label>
              <input
                type="number"
                min={10}
                max={500}
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(parseInt(e.target.value) || 65)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
              Assign Lead Guide:
            </label>
            <select
              value={guideId}
              onChange={(e) => setGuideId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
            >
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {language === 'bn' && g.nameBn ? g.nameBn : g.name} ({g.role} · {g.availability})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowQuickSlotModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Slot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

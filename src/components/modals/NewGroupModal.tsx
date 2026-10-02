import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GroupBooking } from '../../types';
import { TODAY_DATE } from '../../data/mockData';
import { X, Users, Calendar, DollarSign, Plus, Link, ShieldCheck } from 'lucide-react';

export const NewGroupModal: React.FC = () => {
  const {
    showNewGroupModal,
    setShowNewGroupModal,
    trips,
    setGroups,
    showToast,
    language,
    formatNumber,
  } = useApp();

  const [groupName, setGroupName] = useState<string>(
    language === 'bn' ? 'উপকূলীয় ওয়াইল্ডলাইফ ফটোগ্রাফি গিল্ড' : 'Coastal Wildlife Photography Guild'
  );
  const [leaderName, setLeaderName] = useState<string>(
    language === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed'
  );
  const [leaderEmail, setLeaderEmail] = useState<string>('tanvir.ahmed@example.com');
  const [leaderPhone, setLeaderPhone] = useState<string>('+880 1819-234567');
  const [targetSize, setTargetSize] = useState<number>(12);
  const [tripId, setTripId] = useState<string>(trips[1]?.id || 'trip-2');
  const [tripDate, setTripDate] = useState<string>('2026-10-05');
  const [tripTime, setTripTime] = useState<string>('10:00 AM');
  const [isPrivateTrip, setIsPrivateTrip] = useState<boolean>(true);
  const [depositAmount, setDepositAmount] = useState<number>(250);
  const [discountPercent, setDiscountPercent] = useState<number>(10);

  if (!showNewGroupModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const selectedTrip = trips.find((t) => t.id === tripId);

    const newGroup: GroupBooking = {
      id: `grp-${Date.now().toString().slice(-4)}`,
      groupName,
      leaderName,
      leaderNameBn: 'তানভীর আহমেদ',
      leaderEmail,
      leaderPhone,
      tripId,
      tripTitle: selectedTrip?.title || 'Private Group Tour',
      tripDate,
      tripTime,
      targetSize,
      confirmedGuests: 1,
      minRequired: 8,
      maxAllowed: targetSize + 4,
      depositAmount,
      depositPaid: true,
      balanceAmount: targetSize * 65 * (1 - discountPercent / 100) - depositAmount,
      balanceDueDate: '2026-10-03',
      splitPaymentLink: `https://book.tidewise.app/split/${slug}`,
      isPrivateTrip,
      discountTierPercent: discountPercent,
      waiverSignedCount: 1,
      guestRoster: [
        {
          id: `gr-${Date.now()}`,
          name: leaderName,
          nameBn: 'তানভীর আহমেদ',
          email: leaderEmail,
          waiverSigned: true,
          waiverSignedAt: TODAY_DATE,
        },
      ],
    };

    setGroups((prev) => [newGroup, ...prev]);
    setShowNewGroupModal(false);
    showToast(
      language === 'bn'
        ? `গ্রুপ চার্টার "${groupName}" তৈরি হয়েছে! স্প্লিট পেমেন্ট লিংক প্রস্তুত।`
        : `Group Charter "${groupName}" created! Split payment link ready.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A3D]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-lg overflow-hidden rounded-3xl border border-white/90 shadow-[0_24px_64px_rgba(15,42,61,0.22)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#A0BDDB]/25 flex items-center justify-between bg-white/70">
          <div>
            <h2 className="text-base font-bold text-[#0F2A3D]">
              {language === 'bn' ? 'নতুন গ্রুপ চার্টার' : 'New Group Charter'}
            </h2>
            <p className="text-xs text-[#5B7184]">
              {language === 'bn'
                ? 'ডিপোজিট শিডিউলিং, স্বয়ংক্রিয় স্প্লিট পেমেন্ট এবং ওয়েভার ট্র্যাকিং'
                : 'Deposit scheduling, automated split payments, and waiver tracking'}
            </p>
          </div>
          <button
            onClick={() => setShowNewGroupModal(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
              {language === 'bn' ? 'গ্রুপ / প্রতিষ্ঠানের নাম:' : 'Group / Organization Name:'}
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                {language === 'bn' ? 'গ্রুপ লিডারের নাম:' : 'Group Leader Name:'}
              </label>
              <input
                type="text"
                required
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                {language === 'bn' ? 'মোবাইল ফোন:' : 'Leader Mobile Phone:'}
              </label>
              <input
                type="tel"
                required
                value={leaderPhone}
                onChange={(e) => setLeaderPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
              {language === 'bn' ? 'লিডার ইমেইল:' : 'Leader Email:'}
            </label>
            <input
              type="email"
              required
              value={leaderEmail}
              onChange={(e) => setLeaderEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                {language === 'bn' ? 'প্রত্যাশিত সদস্য সংখ্যা:' : 'Expected Group Size:'}
              </label>
              <input
                type="number"
                min={5}
                max={30}
                value={targetSize}
                onChange={(e) => setTargetSize(parseInt(e.target.value) || 10)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB] tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                {language === 'bn' ? 'গৃহীত ডিপোজিট ($):' : 'Deposit Collected ($):'}
              </label>
              <input
                type="number"
                min={50}
                max={2000}
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseInt(e.target.value) || 200)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB] tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                {language === 'bn' ? 'তারিখ:' : 'Target Date:'}
              </label>
              <input
                type="date"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1 uppercase tracking-wide">
                {language === 'bn' ? 'ডিসকাউন্ট স্তর:' : 'Group Discount Tier:'}
              </label>
              <select
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
              >
                <option value={0}>0% ({language === 'bn' ? 'স্ট্যান্ডার্ড রেট' : 'Standard Rates'})</option>
                <option value={10}>10% ({language === 'bn' ? '৮+ অতিথি' : '8+ guests'})</option>
                <option value={15}>15% ({language === 'bn' ? '১২+ অতিথি' : '12+ guests'})</option>
                <option value={20}>20% ({language === 'bn' ? '২০+ অতিথি' : '20+ guests'})</option>
              </select>
            </div>
          </div>

          {/* Private Trip Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/70 border border-white/90">
            <div>
              <span className="text-xs font-bold text-[#0F2A3D] block">
                {language === 'bn' ? 'প্রাইভেট চার্টার লক' : 'Private Charter Lock'}
              </span>
              <span className="text-[11px] text-[#5B7184]">
                {language === 'bn'
                  ? 'বহিরাগত জনসাধারণের এই স্লটে যুক্ত হওয়ার সুযোগ বন্ধ রাখুন'
                  : 'Do not allow external public guests to join this departure'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={isPrivateTrip}
              onChange={(e) => setIsPrivateTrip(e.target.checked)}
              className="w-4 h-4 accent-[#1EC1CB] cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewGroupModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'bn' ? 'গ্রুপ চার্টার তৈরি করুন' : 'Create Group Charter'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

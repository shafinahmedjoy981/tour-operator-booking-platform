import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Guide } from '../../types';
import {
  UserCheck,
  Award,
  AlertTriangle,
  Clock,
  Users,
  Smartphone,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const GuidesView: React.FC = () => {
  const {
    guides,
    setGuides,
    trips,
    setTrips,
    dockModeActive,
    setDockModeActive,
    showToast,
    language,
    t,
    formatNumber,
  } = useApp();

  const [selectedGuideId, setSelectedGuideId] = useState<string>(guides[0]?.id || 'guide-1');
  const [checkedInGuests, setCheckedInGuests] = useState<{ [bookingCode: string]: boolean }>({
    'TW-8921': true,
    'TW-8922': true,
  });

  const selectedGuide = guides.find((g) => g.id === selectedGuideId) || guides[0];
  const assignedTrips = trips.filter((t) => t.guideId === selectedGuide?.id);

  // Auto-suggest best guide logic
  const handleAutoAssign = () => {
    setTrips((prev) =>
      prev.map((t) => {
        if (!t.guideId) {
          const bestGuide =
            t.type === 'boat_trip' ? guides[2] : guides[0];
          return {
            ...t,
            guideId: bestGuide.id,
            guideName: bestGuide.name,
          };
        }
        return t;
      })
    );
    showToast(t('guides.autoAssignToast'));
  };

  const toggleCheckIn = (code: string) => {
    setCheckedInGuests((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
    showToast(t('guides.guestManifestUpdatedToast', { code }));
  };

  const handleCheckInAll = () => {
    setCheckedInGuests({
      'TW-8921': true,
      'TW-8922': true,
      'TW-8923': true,
      'TW-8924': true,
      'TW-8925': true,
      'TW-8926': true,
      'TW-8927': true,
      'TW-8928': true,
    });
    showToast(t('guides.checkInAllToast'));
  };

  const getAvailabilityLabel = (availability: string) => {
    if (availability === 'available') return language === 'bn' ? 'উপলব্ধ' : 'AVAILABLE';
    if (availability === 'on_trip') return language === 'bn' ? 'যাত্রায় ব্যস্ত' : 'ON TRIP';
    return language === 'bn' ? 'ছুটিতে' : 'OFF';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Switch between Roster and Mobile Dock Manifest */}
      <div className="glass-raised p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F2A3D]">
            {dockModeActive ? t('guides.mobilePageTitle') : t('guides.pageTitle')}
          </h2>
          <p className="text-xs text-[#5B7184]">
            {dockModeActive
              ? t('guides.mobilePageSubtitle')
              : t('guides.pageSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Dock Mobile Mode Toggle */}
          <button
            onClick={() => setDockModeActive(!dockModeActive)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dockModeActive
                ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-sm'
                : 'bg-white text-[#0F2A3D] border border-white hover:bg-gray-50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#0F2A3D]" />
            <span>{dockModeActive ? t('guides.exitMobileView') : t('guides.openMobileView')}</span>
          </button>

          {!dockModeActive && (
            <button
              onClick={handleAutoAssign}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{t('guides.autoAssignBtn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: GUIDE DOCK MOBILE MANIFEST */}
      {dockModeActive ? (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="glass-modal p-5 space-y-4 border border-white/95 shadow-[0_16px_40px_rgba(15,42,61,0.18)]">
            <div className="flex items-center justify-between border-b border-[#A0BDDB]/25 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1EC1CB] to-[#0F7682] text-white flex items-center justify-center font-bold text-sm">
                  {selectedGuide.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F2A3D]">
                    {t('guides.manifestHeader', { name: language === 'bn' && selectedGuide.nameBn ? selectedGuide.nameBn : selectedGuide.name })}
                  </h3>
                  <p className="text-[11px] text-[#5B7184]">{selectedGuide.role}</p>
                </div>
              </div>

              <select
                value={selectedGuideId}
                onChange={(e) => setSelectedGuideId(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-[#0F2A3D] border border-gray-200"
              >
                {guides.map((g) => (
                  <option key={g.id} value={g.id}>
                    {language === 'bn' && g.nameBn ? g.nameBn : g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Next Departure Glance */}
            <div className="p-4 rounded-2xl bg-[#1EC1CB]/15 border border-[#1EC1CB]/30 space-y-1">
              <span className="text-[10px] font-bold text-[#0A6C74] uppercase tracking-wider block">
                {t('guides.nextDepartureLabel')}
              </span>
              <h4 className="text-base font-bold text-[#0F2A3D]">
                {assignedTrips[0]?.title || 'Sea Caves & Harbor Seal Eco-Paddle'}
              </h4>
              <p className="text-xs text-[#5B7184]">
                {assignedTrips[0]?.startTime || '10:30 AM'} EDT · North Slip Pier B ·{' '}
                <span className="font-bold text-[#0F2A3D]">
                  {t('guides.guestsBookedLabel', { count: formatNumber(assignedTrips[0]?.bookedCount || 8) })}
                </span>
              </p>
            </div>

            {/* One-Tap Check-In All Button */}
            <button
              onClick={handleCheckInAll}
              className="w-full py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-[#1EC1CB] text-[#0F2A3D] hover:bg-[#18AEB7] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>{t('guides.checkInAllBtn')}</span>
            </button>

            {/* Passenger Manifest Checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide block">
                {t('guides.safetyRosterHeading')}
              </span>

              {[
                {
                  code: 'TW-8924',
                  name: 'Imran Chowdhury (2 guests)',
                  nameBn: 'ইমরান চৌধুরী (২ জন অতিথি)',
                  notes: 'First-time kayaker · Requested double tandem',
                  notesBn: 'প্রথমবার কায়াকিং · ডাবল ট্যান্ডেম অনুরোধ করেছেন',
                  phone: '+880 1612-987654',
                },
                {
                  code: 'TW-8926',
                  name: 'Rafiqul Hasan (4 guests)',
                  nameBn: 'রফিকুল হাসান (৪ জন অতিথি)',
                  notes: 'Expert paddler · Brought own dry bags',
                  notesBn: 'অভিজ্ঞ প্যাডলার · নিজস্ব ড্রাই ব্যাগ এনেছেন',
                  phone: '+880 1814-567890',
                },
                {
                  code: 'TW-8927',
                  name: 'Tasnim Rahman (2 guests)',
                  nameBn: 'তাসনিম রহমান (২ জন অতিথি)',
                  notes: 'Photo permit verified',
                  notesBn: 'ছবি তোলার অনুমতি যাচাই করা হয়েছে',
                  phone: '+880 1913-456789',
                },
              ].map((g) => {
                const isChecked = checkedInGuests[g.code];
                return (
                  <div
                    key={g.code}
                    onClick={() => toggleCheckIn(g.code)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isChecked
                        ? 'bg-[#DCFCE7]/70 border-[#86EFAC]'
                        : 'bg-white/80 border-white hover:bg-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0F2A3D]">
                          {language === 'bn' ? g.nameBn : g.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#5B7184]">{g.code}</span>
                      </div>
                      <p className="text-[11px] text-[#5B7184] mt-0.5">
                        {language === 'bn' ? g.notesBn : g.notes}
                      </p>
                      <span className="text-[10px] text-[#0A6C74] block mt-1">{g.phone}</span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                        isChecked ? 'bg-[#16A34A] text-white' : 'border-2 border-gray-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Emergency & Radio Dock Call */}
            <div className="p-3 rounded-2xl bg-white/60 border border-white text-xs text-[#5B7184] flex items-center justify-between">
              <span>{language === 'bn' ? 'ডক ভিএইচএফ চ্যানেল:' : 'Dock VHF Channel:'} <strong className="text-[#0F2A3D]">Ch 16 / Ch 68</strong></span>
              <span>{language === 'bn' ? 'হারবারমাস্টার:' : 'Harbormaster:'} <strong className="text-[#0F2A3D]">207-555-0191</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: GUIDE ROSTER & ASSIGNMENT DESK */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Guide Cards List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#5B7184] uppercase tracking-wider block px-1">
              {language === 'bn' ? `সক্রিয় গাইডবৃন্দ (${formatNumber(guides.length)})` : `Active Guide Staff (${guides.length})`}
            </span>

            {guides.map((g) => {
              const isSelected = selectedGuideId === g.id;
              const hasExpiring = g.certifications.some((c) => c.isExpiringSoon);

              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGuideId(g.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'glass-modal border-[#1EC1CB] ring-2 ring-[#1EC1CB]/30'
                      : 'glass-base hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1EC1CB] to-[#0F7682] text-white font-bold flex items-center justify-center text-sm">
                        {g.avatar}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0F2A3D]">
                          {language === 'bn' && g.nameBn ? g.nameBn : g.name}
                        </h3>
                        <p className="text-[11px] text-[#5B7184]">{g.role}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        g.availability === 'available'
                          ? 'bg-[#DCFCE7] text-[#14532D]'
                          : g.availability === 'on_trip'
                          ? 'bg-[#1EC1CB]/15 text-[#0A6C74]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getAvailabilityLabel(g.availability)}
                    </span>
                  </div>

                  {/* Cert Warning Badge if expiring */}
                  {hasExpiring && (
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FEF3C7] text-[#92400E] text-[11px] font-semibold border border-[#FDE68A]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#D97706]" />
                      <span>{language === 'bn' ? 'সনদের মেয়াদ আগামী ১২ দিনে শেষ (CPR)' : 'Cert renewal due in 12 days (CPR)'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#5B7184] pt-1 border-t border-[#A0BDDB]/20">
                    <span>{t('guides.assignedToursToday')}:</span>
                    <span className="font-bold text-[#0F2A3D]">
                      {formatNumber(g.assignedTripIds.length)} / {formatNumber(g.maxToursPerDay)} {language === 'bn' ? 'সর্বোচ্চ' : 'tours max'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Guide Credentials & Safe Ratio Monitor */}
          {selectedGuide && (
            <div className="lg:col-span-2 space-y-5">
              {/* Profile Card */}
              <div className="glass-raised p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#1EC1CB] to-[#0F7682] text-white font-extrabold flex items-center justify-center text-xl shadow-md">
                      {selectedGuide.avatar}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#0F2A3D]">
                        {language === 'bn' && selectedGuide.nameBn ? selectedGuide.nameBn : selectedGuide.name}
                      </h2>
                      <p className="text-xs text-[#5B7184]">{selectedGuide.role}</p>
                      <div className="flex items-center gap-3 text-xs text-[#5B7184] mt-1">
                        <span>{selectedGuide.phone}</span>
                        <span>·</span>
                        <span>{selectedGuide.email}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#0A6C74] bg-[#1EC1CB]/15 px-3 py-1.5 rounded-xl border border-[#1EC1CB]/30 shrink-0">
                    {language === 'bn' ? `দৈনিক সর্বোচ্চ: ${formatNumber(selectedGuide.maxToursPerDay)} সফর` : `Max: ${selectedGuide.maxToursPerDay} tours/day`}
                  </span>
                </div>

                <p className="text-xs text-[#5B7184] leading-relaxed bg-white/60 p-3 rounded-xl border border-white">
                  {selectedGuide.bio}
                </p>

                {/* Skill Tags & Languages */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedGuide.skillTags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 text-[#0F2A3D] border border-white shadow-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {selectedGuide.languages.map((lang, i) => (
                    <span
                      key={`lang-${i}`}
                      className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#A0BDDB]/20 text-[#0F2A3D]"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications Card with Expiry Warnings */}
              <div className="glass-base p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F2A3D] uppercase tracking-wide flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#1EC1CB]" />
                    <span>{t('guides.safetyCertsHeading')}</span>
                  </h3>
                  <span className="text-xs text-[#5B7184]">USCG & ACA Compliant</span>
                </div>

                <div className="space-y-2.5">
                  {selectedGuide.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/70 border border-white flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0F2A3D]">
                            {cert.name}
                          </span>
                          {cert.isExpiringSoon && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                              {t('guides.expiringSoonBadge')}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#5B7184] block mt-0.5">
                          {language === 'bn' ? `ইস্যুকারী: ${cert.issuer}` : `Issued by ${cert.issuer}`}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-semibold text-[#0F2A3D] tabular-nums block">
                          {language === 'bn' ? 'মেয়াদ:' : 'Expires:'} {cert.expiryDate}
                        </span>
                        <span className="text-[10px] text-[#16A34A] font-bold">
                          {t('guides.verifiedBadge')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Ratio & Conflict Monitor */}
              <div className="p-4 rounded-2xl bg-[#DCFCE7]/70 border border-[#86EFAC] text-xs text-[#14532D] space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  <span>{language === 'bn' ? 'নিরাপত্তা অনুপাত যাচাই: সফল' : 'Safety Ratio Check: Passed'}</span>
                </div>
                <p className="text-[#166534]">
                  {language === 'bn'
                    ? 'সকল নির্ধারিত ট্যুর ACA ৮:১ অতিথি-গাইড অনুপাত অনুসরণ করছে। কোনো শিডিউল সংঘর্ষ বা অতিরিক্ত কাজের ঝুঁকি নেই।'
                    : 'All assigned tours comply with the ACA 8:1 guest-to-guide ratio. No schedule overlaps or overwork limits exceeded.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

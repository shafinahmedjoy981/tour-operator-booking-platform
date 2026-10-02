import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CloudLightning,
  Calendar,
  Send,
  CheckCircle2,
  Users,
  RefreshCw,
  Gift,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Mail,
  AlertTriangle,
  Globe,
} from 'lucide-react';

export const WeatherRescheduleModal: React.FC = () => {
  const {
    showWeatherRescheduleModal,
    setShowWeatherRescheduleModal,
    trips,
    setTrips,
    bookings,
    setBookings,
    weatherRescheduleStats,
    setWeatherRescheduleStats,
    showToast,
    language,
    t,
    formatNumber,
    formatCurrency,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTripId, setSelectedTripId] = useState<string>('trip-4');
  const [refundPolicy, setRefundPolicy] = useState<'free_reschedule_or_full_refund' | 'voucher_bonus'>(
    'free_reschedule_or_full_refund'
  );
  const [previewChannel, setPreviewChannel] = useState<'sms' | 'email'>('sms');
  const [previewLang, setPreviewLang] = useState<'en' | 'bn' | 'customer'>(
    language === 'bn' ? 'bn' : 'en'
  );
  const [isSending, setIsSending] = useState<boolean>(false);

  if (!showWeatherRescheduleModal) return null;

  const targetTrip = trips.find((t) => t.id === selectedTripId) || trips[3];
  const affectedBookings = bookings.filter((b) => b.tripId === targetTrip?.id);
  const totalGuests = targetTrip?.bookedCount || 17;

  const handleSendRescheduleOffers = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      // Update trip status
      setTrips((prev) =>
        prev.map((t) =>
          t.id === targetTrip?.id ? { ...t, status: 'weather_hold' } : t
        )
      );

      // Update affected bookings with notification timeline
      setBookings((prev) =>
        prev.map((b) => {
          if (b.tripId === targetTrip?.id) {
            return {
              ...b,
              status: 'weather_hold',
              messagesTimeline: [
                ...b.messagesTimeline,
                {
                  id: `msg-${Date.now()}`,
                  timestamp: language === 'bn' ? 'এইমাত্র' : 'Just now',
                  type: 'sms',
                  title: language === 'bn' ? 'আবহাওয়া পুনঃনির্ধারণ লিংক প্রেরিত' : 'Weather Reschedule Link Sent',
                  content: language === 'bn'
                    ? 'স্বয়ংক্রিয় ১-ক্লিক অপশন লিংক পাঠানো হয়েছে (নতুন তারিখ / ১১০% ভাউচার / ১০০% রিফান্ড)'
                    : 'Automated 1-click option link sent (Pick New Date / 110% Voucher / 100% Refund)',
                  status: 'delivered',
                },
              ],
            };
          }
          return b;
        })
      );

      setWeatherRescheduleStats((prev: any) => ({
        ...prev,
        isProcessed: true,
        tripId: targetTrip.id,
        totalGuests,
        choseNewDate: 12,
        refunded: 3,
        waitingResponse: 2,
      }));

      setStep(3);
      showToast(
        language === 'bn'
          ? `সকল ${formatNumber(totalGuests)} জন অতিথির কাছে আবহাওয়া রিশিডিউল অফার পাঠানো হয়েছে।`
          : `Weather reschedule offers dispatched to all ${totalGuests} guests.`
      );
    }, 800);
  };

  const isBnPreview = previewLang === 'bn' || (previewLang === 'customer' && language === 'bn');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A3D]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-2xl overflow-hidden rounded-3xl border border-white/90 shadow-[0_24px_64px_rgba(15,42,61,0.22)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#A0BDDB]/25 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#E11D48] border border-[#FDA4AF]">
              <CloudLightning className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A3D]">
                {language === 'bn' ? 'আবহাওয়া পুনঃনির্ধারণ ও রিফান্ড প্রবাহ' : 'Weather Reschedule & Refund Flow'}
              </h2>
              <p className="text-xs text-[#5B7184]">
                {language === 'bn'
                  ? `ধাপ ${formatNumber(step)} / ${formatNumber(3)}: ${
                      step === 1
                        ? 'স্থগিত ট্যুর নির্বাচন'
                        : step === 2
                        ? 'অতিথি বার্তা প্রিভিউ'
                        : 'লাইভ সমাধান ট্র্যাকার'
                    }`
                  : `Step ${step} of 3: ${
                      step === 1
                        ? 'Choose affected trip'
                        : step === 2
                        ? 'Preview guest options'
                        : 'Live response tracker'
                    }`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWeatherRescheduleModal(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#5B7184] hover:text-[#0F2A3D] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Step 1: Select Affected Trip */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFE4E6]/60 border border-[#FDA4AF] text-xs text-[#881337]">
                <div className="flex items-center gap-2 font-bold mb-1 text-sm">
                  <AlertTriangle className="w-4 h-4 text-[#E11D48]" />
                  <span>
                    {language === 'bn' ? 'প্রতিকূল আবহাওয়া শনাক্ত · পদক্ষেপ প্রয়োজন' : 'Severe Weather Detected · Action Required'}
                  </span>
                </div>
                <p>
                  {language === 'bn'
                    ? '২৮ নটিক্যাল মাইল বেগে দমকা বাতাস এবং উপকূলের ৪ মাইল দূরে বজ্রঝড় সক্রিয় রয়েছে। অতিথিদের নিরাপত্তা ও ব্যবসায়িক সুনাম রক্ষার্থে বিনামূল্যে পুনঃনির্ধারণ অথবা রিফান্ড অফার দিন।'
                    : 'Gale warning with 28 kts wind gusts and an active thunderstorm cell 4 miles offshore. Protect your guests and your business by offering free rebooking or refund.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2A3D] mb-2 uppercase tracking-wide">
                  {language === 'bn' ? 'ঝুঁকিপূর্ণ ট্যুর নির্বাচন করুন:' : 'Select Trip at Risk:'}
                </label>
                <div className="space-y-2">
                  {trips.map((tr) => (
                    <div
                      key={tr.id}
                      onClick={() => setSelectedTripId(tr.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedTripId === tr.id
                          ? 'bg-[#1EC1CB]/10 border-[#1EC1CB] shadow-sm ring-2 ring-[#1EC1CB]/30'
                          : 'bg-white/60 border-white/80 hover:bg-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0F2A3D]">
                            {tr.startTime} · {tr.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              tr.weatherRisk === 'stop'
                                ? 'bg-[#FFE4E6] text-[#9F1239]'
                                : tr.weatherRisk === 'caution'
                                ? 'bg-[#FEF3C7] text-[#92400E]'
                                : 'bg-[#DCFCE7] text-[#14532D]'
                            }`}
                          >
                            {tr.weatherRisk.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5B7184] mt-0.5 truncate">
                          {tr.weatherRiskReason}
                        </p>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        <span className="text-xs font-bold text-[#0F2A3D]">
                          {formatNumber(tr.bookedCount)} / {formatNumber(tr.capacity)} {language === 'bn' ? 'অতিথি' : 'guests'}
                        </span>
                        <p className="text-[10px] text-[#5B7184]">
                          {(language === 'bn' && tr.guideNameBn ? tr.guideNameBn : tr.guideName) || (language === 'bn' ? 'অনির্ধারিত' : 'Unassigned')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-white/90">
                <span className="text-xs font-bold text-[#0F2A3D] block mb-1">
                  {language === 'bn' ? 'অপারেটর আবহাওয়া পলিসি কার্যকর:' : 'Operator Weather Policy in Effect:'}
                </span>
                <p className="text-xs text-[#5B7184]">
                  {language === 'bn'
                    ? 'অতিথিরা ১০০% পূর্ণ রিফান্ড অথবা শূন্য জরিমানা ফিতে যে কোনো তারিখে বিনামূল্যে রিশিডিউলের সুবিধা পাবেন। টাইডওয়াইজ কোনো বাতিল ফি কাটে না।'
                    : 'Guests receive full 100% refund OR free reschedule to any date with zero penalty fees. Tidewise never charges cancellation or booking fees.'}
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Preview What Guests Will Receive */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
                    {language === 'bn' ? 'লাইভ অতিথি বার্তা প্রিভিউ' : 'Live Guest Message Preview'}
                  </h3>
                  <p className="text-[11px] text-[#5B7184]">
                    {language === 'bn'
                      ? `বুক করা সকল ${formatNumber(totalGuests)} জন অতিথির কাছে SMS ও ইমেইলে পৌঁছাবে`
                      : `Dispatched instantly via SMS & Email to all ${totalGuests} booked guests`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Language Selector */}
                  <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-white">
                    <span className="text-[10px] font-bold text-[#5B7184] px-1.5 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#1EC1CB]" />
                      <span>{language === 'bn' ? 'প্রেরণ ভাষা:' : 'Send in:'}</span>
                    </span>
                    <button
                      onClick={() => setPreviewLang('en')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        previewLang === 'en'
                          ? 'bg-[#1EC1CB] text-[#0F2A3D]'
                          : 'text-[#5B7184] hover:text-[#0F2A3D]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setPreviewLang('bn')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        previewLang === 'bn'
                          ? 'bg-[#1EC1CB] text-[#0F2A3D]'
                          : 'text-[#5B7184] hover:text-[#0F2A3D]'
                      }`}
                    >
                      বাংলা
                    </button>
                    <button
                      onClick={() => setPreviewLang('customer')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        previewLang === 'customer'
                          ? 'bg-[#1EC1CB] text-[#0F2A3D]'
                          : 'text-[#5B7184] hover:text-[#0F2A3D]'
                      }`}
                    >
                      {language === 'bn' ? "গ্রাহকের ভাষা" : "Customer's language"}
                    </button>
                  </div>

                  {/* Channel Toggle */}
                  <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-white">
                    <button
                      onClick={() => setPreviewChannel('sms')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        previewChannel === 'sms'
                          ? 'bg-[#1EC1CB] text-[#0F2A3D]'
                          : 'text-[#5B7184]'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>SMS</span>
                    </button>
                    <button
                      onClick={() => setPreviewChannel('email')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        previewChannel === 'email'
                          ? 'bg-[#1EC1CB] text-[#0F2A3D]'
                          : 'text-[#5B7184]'
                      }`}
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Simulator Box */}
              <div className="p-5 rounded-2xl bg-white/90 border border-[#A0BDDB]/40 shadow-inner space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-xs text-[#5B7184]">
                  <span className="font-bold text-[#0F2A3D]">{language === 'bn' ? 'প্রেরক:' : 'From:'}</span> Harbor Kayak & Boat Co.
                  <span className="ml-auto text-[10px] text-[#1EC1CB] font-bold">
                    {previewChannel === 'sms' ? (language === 'bn' ? 'যাচাইকৃত SMS' : 'Verified SMS') : (language === 'bn' ? 'যাচাইকৃত ইমেইল' : 'Verified Email')}
                  </span>
                </div>

                {isBnPreview ? (
                  <p className="text-xs text-[#0F2A3D] leading-relaxed">
                    আসসালামু আলাইকুম <span className="font-semibold text-[#0A6C74]">{'{Guest_Name}'}</span>, আপনার নিরাপত্তার স্বার্থে আজ{' '}
                    <span className="font-semibold">{targetTrip.startTime}</span> এর{' '}
                    <span className="font-semibold">{targetTrip.title}</span> সফরটি আকস্মিক বৈরী আবহাওয়ার কারণে স্থগিত করা হয়েছে।
                  </p>
                ) : (
                  <p className="text-xs text-[#0F2A3D] leading-relaxed">
                    Hi <span className="font-semibold text-[#0A6C74]">{'{Guest_Name}'}</span>, for your safety, our{' '}
                    <span className="font-semibold">{targetTrip.title}</span> at {targetTrip.startTime} today is held due to sudden gale gusts.
                  </p>
                )}

                <p className="text-xs text-[#0F2A3D]">
                  {isBnPreview
                    ? 'নিচের ১-ক্লিক লিংকে ট্যাপ করে অনুগ্রহ করে আপনার সিদ্ধান্ত জানান:'
                    : 'Please tap your personalized 1-click link to choose your preference:'}
                </p>

                {/* 3 Simple Action Buttons as the guest will see them */}
                <div className="space-y-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#1EC1CB]/15 border border-[#1EC1CB]/40 flex items-center justify-between text-xs font-bold text-[#0F2A3D]">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[#0A6C74]" />
                      <span>{isBnPreview ? 'অপশন ১: নতুন তারিখ নির্বাচন (বিনামূল্যে)' : 'Option 1: Pick a New Date (Free)'}</span>
                    </div>
                    <span className="text-[10px] text-[#0A6C74] font-semibold">
                      {isBnPreview ? 'তাৎক্ষণিক নিশ্চিতকরণ' : 'Immediate confirmation'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#A0BDDB]/20 border border-[#A0BDDB]/40 flex items-center justify-between text-xs font-bold text-[#0F2A3D]">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#0F2A3D]" />
                      <span>{isBnPreview ? 'অপশন ২: ১১০% ভাউচার ক্রেডিট' : 'Option 2: 110% Voucher Credit'}</span>
                    </div>
                    <span className="text-[10px] text-[#5B7184] font-semibold">
                      {isBnPreview ? 'মেয়াদ ২ বছর' : 'Valid 2 years'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs font-bold text-[#0F2A3D]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                      <span>{isBnPreview ? 'অপশন ৩: ১০০% সম্পূর্ণ রিফান্ড' : 'Option 3: 100% Full Refund'}</span>
                    </div>
                    <span className="text-[10px] text-[#5B7184] font-semibold">
                      {isBnPreview ? '২৪ ঘন্টায় স্বয়ংক্রিয়' : 'Auto-processed in 24 hrs'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#5B7184] pt-1">
                  {isBnPreview
                    ? 'কোনো অপেক্ষা বা সাপোর্টের প্রয়োজন নেই। অতিথিরা ৫ সেকেন্ডে মোবাইলে পছন্দ নির্বাচন করতে পারেন।'
                    : 'No hold music, no support ticket required. Guests choose on their phone in 5 seconds.'}
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#A0BDDB]/15 border border-[#A0BDDB]/30 text-xs text-[#0F2A3D]">
                <ShieldCheck className="w-4 h-4 text-[#1EC1CB] shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'রিফান্ড বা পুনঃনির্ধারিত স্লটে কখনোই কোনো কমিশন কাটা হয় না। ১০০% আস্থা বজায় থাকে।'
                    : 'No commission is ever charged on refunds or rescheduled slots. You retain 100% goodwill.'}
                </span>
              </div>
            </div>
          )}

          {/* Step 3: Live Response Tracker */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#DCFCE7]/70 border border-[#86EFAC] text-center">
                <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#14532D]">
                  {language === 'bn' ? 'পুনঃনির্ধারণ লিংক সফলভাবে প্রেরিত হয়েছে!' : 'Reschedule Links Successfully Dispatched!'}
                </h3>
                <p className="text-xs text-[#166534] mt-0.5">
                  {language === 'bn'
                    ? `${targetTrip.title} এর সকল ${formatNumber(totalGuests)} জন অতিথির কাছে SMS ও ইমেইল পাঠানো হয়েছে।`
                    : `SMS and Email notifications delivered to all ${totalGuests} guests for ${targetTrip.title}.`}
                </p>
              </div>

              {/* Real-time stats bento */}
              <div>
                <h4 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide mb-3">
                  {language === 'bn' ? 'লাইভ সমাধান ট্র্যাকার' : 'Live Guest Resolution Tracker'}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/70 border border-white text-center">
                    <span className="text-2xl font-extrabold text-[#0A6C74] tabular-nums block">
                      {formatNumber(weatherRescheduleStats.choseNewDate)}
                    </span>
                    <span className="text-xs font-semibold text-[#0F2A3D] block mt-0.5">
                      {language === 'bn' ? 'নতুন তারিখ নিয়েছেন' : 'Picked New Date'}
                    </span>
                    <span className="text-[10px] text-[#5B7184]">
                      {language === 'bn' ? '২ বা ৩ অক্টোবরে স্থানান্তরিত' : 'Moved to Oct 2 or 3'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 border border-white text-center">
                    <span className="text-2xl font-extrabold text-[#16A34A] tabular-nums block">
                      {formatNumber(weatherRescheduleStats.refunded)}
                    </span>
                    <span className="text-xs font-semibold text-[#0F2A3D] block mt-0.5">
                      {language === 'bn' ? 'রিফান্ড অনুরোধ' : 'Refunds Requested'}
                    </span>
                    <span className="text-[10px] text-[#5B7184]">
                      {language === 'bn' ? '$২০৪ মোট প্রক্রিয়াকৃত' : '$204 total processed'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 border border-white text-center">
                    <span className="text-2xl font-extrabold text-[#D97706] tabular-nums block">
                      {formatNumber(weatherRescheduleStats.waitingResponse)}
                    </span>
                    <span className="text-xs font-semibold text-[#0F2A3D] block mt-0.5">
                      {language === 'bn' ? 'সিদ্ধান্তের অপেক্ষায়' : 'Awaiting Choice'}
                    </span>
                    <span className="text-[10px] text-[#5B7184]">
                      {language === 'bn' ? '২ ঘণ্টায় স্বয়ংক্রিয় রিমাইন্ডার' : 'Auto-reminder in 2h'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resolution breakdown list - All Bangladeshi names */}
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 space-y-2">
                <span className="text-[11px] font-bold text-[#5B7184] uppercase tracking-wider block">
                  {language === 'bn' ? 'গ্রাহক স্ট্যাটাস ম্যানিফেস্ট:' : 'Customer Status Manifest:'}
                </span>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                  <span className="font-semibold text-[#0F2A3D]">
                    {language === 'bn' ? 'নুসরাত জাহান (৪ জন অতিথি)' : 'Nusrat Jahan (4 guests)'}
                  </span>
                  <span className="text-xs font-bold text-[#0A6C74] bg-[#1EC1CB]/15 px-2 py-0.5 rounded-full">
                    {language === 'bn' ? '২ অক্টোবর, ০৩:৩০ অপরাহ্নে পুনঃনির্ধারিত' : 'Rescheduled to Oct 2, 03:30 PM'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                  <span className="font-semibold text-[#0F2A3D]">
                    {language === 'bn' ? 'ফারহানা আক্তার (৭ জন অতিথি)' : 'Farhana Akter (7 guests)'}
                  </span>
                  <span className="text-xs font-bold text-[#0A6C74] bg-[#1EC1CB]/15 px-2 py-0.5 rounded-full">
                    {language === 'bn' ? '৩ অক্টোবর, ০১:৩০ অপরাহ্নে পুনঃনির্ধারিত' : 'Rescheduled to Oct 3, 01:30 PM'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                  <span className="font-semibold text-[#0F2A3D]">
                    {language === 'bn' ? 'তানভীর আহমেদ (৬ জন অতিথি)' : 'Tanvir Ahmed (6 guests)'}
                  </span>
                  <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                    {language === 'bn' ? 'সম্পূর্ণ রিফান্ড সম্পন্ন ($৪০৮)' : 'Full Refund Processed ($408)'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#A0BDDB]/25 bg-white/70 flex items-center justify-between">
          {step > 1 && step < 3 && (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5B7184] hover:text-[#0F2A3D] hover:bg-white/80 cursor-pointer"
            >
              {language === 'bn' ? 'ফিরে যান' : 'Back'}
            </button>
          )}

          {step === 1 && (
            <button
              onClick={() => setShowWeatherRescheduleModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
          )}

          <div className="ml-auto">
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-sm transition-all cursor-pointer"
              >
                <span>{language === 'bn' ? 'প্রিভিউতে যান' : 'Continue to Preview'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handleSendRescheduleOffers}
                disabled={isSending}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {isSending
                    ? (language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Dispatching...')
                    : (language === 'bn'
                        ? `সকল ${formatNumber(totalGuests)} জন অতিথিকে পাঠান`
                        : `Send to All ${totalGuests} Guests`)}
                </span>
              </button>
            )}

            {step === 3 && (
              <button
                onClick={() => setShowWeatherRescheduleModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F2A3D] text-white hover:bg-[#1A3E56] shadow-sm cursor-pointer"
              >
                {language === 'bn' ? 'সম্পন্ন' : 'Done'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

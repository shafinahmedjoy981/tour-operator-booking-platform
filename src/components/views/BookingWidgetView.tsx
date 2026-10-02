import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Calendar,
  Clock,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Globe,
  Sliders,
} from 'lucide-react';

export const BookingWidgetView: React.FC = () => {
  const { trips, showToast, language, t, formatNumber, formatCurrency } = useApp();

  // Customizer state
  const [primaryColor, setPrimaryColor] = useState<string>('#1EC1CB');
  const [surfaceTint, setSurfaceTint] = useState<string>('#A0BDDB');
  const [buttonText, setButtonText] = useState<string>(
    language === 'bn' ? 'সরাসরি বুক করুন (০% ফি)' : 'Book Tour Now (Zero Fees)'
  );
  const [requireDepositOnly, setRequireDepositOnly] = useState<boolean>(false);
  const [depositPct, setDepositPct] = useState<number>(30);
  const [widgetLang, setWidgetLang] = useState<'en' | 'bn'>(language);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Interactive Guest Flow Simulator inside widget preview
  const [simStep, setSimStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [simTripId, setSimTripId] = useState<string>(trips[0]?.id || 'trip-1');
  const [simDate, setSimDate] = useState<string>('2026-10-02');
  const [simGuests, setSimGuests] = useState<number>(2);
  const [simGuestName, setSimGuestName] = useState<string>(
    language === 'bn' ? 'নুসরাত জাহান' : 'Nusrat Jahan'
  );
  const [simGuestEmail, setSimGuestEmail] = useState<string>('nusrat.jahan@example.com');
  const [simGuestPhone, setSimGuestPhone] = useState<string>('+880 1712-345678');

  const selectedTrip = trips.find((t) => t.id === simTripId) || trips[0];
  const totalAmount = selectedTrip.pricePerPerson * simGuests;
  const payAmount = requireDepositOnly ? Math.round(totalAmount * (depositPct / 100)) : totalAmount;

  const embedCode = `<!-- Tidewise Commission-Free Direct Booking Widget -->
<div id="tidewise-widget" data-operator="harbor-kayak"></div>
<script src="https://widget.tidewise.app/v1/embed.js" 
  data-primary="${primaryColor}" 
  data-button="${buttonText}" 
  data-lang="${widgetLang}" 
  async></script>`;

  const directLink = 'https://book.tidewise.app/harbor-kayak';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(embedCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
    showToast(language === 'bn' ? 'এম্বেড কোড কপি হয়েছে! আপনার ওয়েবসাইটে পেস্ট করুন।' : 'Embed code copied! Paste onto your Squarespace, WordPress, or Wix site.');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(directLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast(language === 'bn' ? 'সরাসরি বুকিং লিংক ক্লিপবোর্ডে কপি করা হয়েছে।' : 'Direct booking link copied to clipboard.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Links */}
      <div className="glass-raised p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F2A3D]">
            {t('widget.pageTitle')}
          </h2>
          <p className="text-xs text-[#5B7184]">
            {t('widget.pageSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-gray-50 text-[#0F2A3D] border border-white shadow-xs cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? t('widget.linkCopied') : t('widget.copyDirectLink')}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer whitespace-nowrap"
          >
            {copiedSnippet ? <Check className="w-4 h-4 text-[#14532D]" /> : <Code2 className="w-4 h-4 stroke-[2.5]" />}
            <span>{copiedSnippet ? t('widget.codeCopied') : t('widget.copyEmbedCode')}</span>
          </button>
        </div>
      </div>

      {/* Studio Grid: Builder Options (Left) + Interactive Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Customizer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-raised p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#A0BDDB]/25 pb-3">
              <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#1EC1CB]" />
                <span>{t('widget.customizerHeading')}</span>
              </h3>
              <span className="text-[10px] font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                0% OTA Fee
              </span>
            </div>

            {/* Brand Colors */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F2A3D]">
                {t('widget.primaryColorLabel')}:
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl border border-white shadow-sm shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/80 border border-white text-xs font-mono font-bold text-[#0F2A3D]"
                />
                <button
                  onClick={() => setPrimaryColor('#1EC1CB')}
                  className="text-[10px] font-bold text-[#0A6C74] bg-[#1EC1CB]/15 px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer"
                >
                  Aqua
                </button>
              </div>
            </div>

            {/* Button Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0F2A3D]">
                {t('widget.buttonTextLabel')}:
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/80 border border-white text-xs font-semibold text-[#0F2A3D]"
              />
            </div>

            {/* Language & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0F2A3D] mb-1">
                  {t('widget.widgetLangLabel')}:
                </label>
                <select
                  value={widgetLang}
                  onChange={(e) => setWidgetLang(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-white text-xs font-semibold text-[#0F2A3D]"
                >
                  <option value="en">English (US)</option>
                  <option value="bn">বাংলা (Bangla)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F2A3D] mb-1">
                  {t('widget.requireDepositLabel')}:
                </label>
                <select
                  value={requireDepositOnly ? 'deposit' : 'full'}
                  onChange={(e) => setRequireDepositOnly(e.target.value === 'deposit')}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-white text-xs font-semibold text-[#0F2A3D]"
                >
                  <option value="full">{language === 'bn' ? '১০০% এককালীন' : '100% Upfront'}</option>
                  <option value="deposit">{language === 'bn' ? 'ডিপোজিট (৩০%)' : 'Deposit (30%)'}</option>
                </select>
              </div>
            </div>

            {/* QR Code generator */}
            <div className="p-4 rounded-2xl bg-white/80 border border-white flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white p-1.5 border border-gray-200 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#0F2A3D]">
                  <rect width="100" height="100" fill="#ffffff" />
                  <path
                    fill="currentColor"
                    d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z"
                  />
                  <path
                    fill="currentColor"
                    d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z"
                  />
                  <path
                    fill="currentColor"
                    d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z"
                  />
                  <rect x="45" y="15" width="8" height="8" fill="currentColor" />
                  <rect x="45" y="30" width="8" height="8" fill="currentColor" />
                  <rect x="45" y="45" width="12" height="12" fill="#1EC1CB" />
                  <rect x="65" y="55" width="8" height="8" fill="currentColor" />
                  <rect x="75" y="65" width="12" height="12" fill="currentColor" />
                  <rect x="55" y="75" width="10" height="10" fill="currentColor" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-bold text-[#0F2A3D] block">
                  {t('widget.qrCodeTitle')}
                </span>
                <p className="text-[11px] text-[#5B7184] mt-0.5">
                  {t('widget.qrCodeDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Guest Experience Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Device Frame Switcher */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#5B7184] uppercase tracking-wide">
              {t('widget.livePreviewHeading')}
            </span>

            <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-white">
              <button
                onClick={() => setDevicePreview('desktop')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  devicePreview === 'desktop'
                    ? 'bg-[#1EC1CB] text-[#0F2A3D]'
                    : 'text-[#5B7184]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ডেস্কটপ' : 'Desktop'}</span>
              </button>
              <button
                onClick={() => setDevicePreview('mobile')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  devicePreview === 'mobile'
                    ? 'bg-[#1EC1CB] text-[#0F2A3D]'
                    : 'text-[#5B7184]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'মোবাইল' : 'Mobile'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Frame */}
          <div
            className={`mx-auto transition-all ${
              devicePreview === 'mobile'
                ? 'max-w-sm rounded-[32px] p-4 bg-gray-900 border-4 border-gray-700 shadow-2xl'
                : 'w-full rounded-3xl p-1 bg-white/30 border border-white shadow-xl'
            }`}
          >
            <div className="glass-modal p-6 rounded-2xl space-y-4">
              {/* Header inside simulator */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0F2A3D]">
                    Harbor Kayak & Boat Co.
                  </h3>
                  <span className="text-[10px] text-[#16A34A] font-bold">
                    {language === 'bn' ? '✓ অফিসিয়াল সরাসরি বুকিং · সেরা রেট' : '✓ Official Direct Reservation · Best Price'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#5B7184] block">
                    {language === 'bn' ? `ধাপ ${formatNumber(simStep)} / ${formatNumber(5)}` : `Step ${simStep} of 5`}
                  </span>
                  <span className="text-xs font-bold text-[#0A6C74]">
                    {simStep === 1
                      ? (language === 'bn' ? 'ট্যুর বাছাই' : 'Pick Date')
                      : simStep === 2
                      ? (language === 'bn' ? 'অতিথি সংখ্যা' : 'Group Size')
                      : simStep === 3
                      ? (language === 'bn' ? 'অতিথির তথ্য' : 'Guest Details')
                      : simStep === 4
                      ? (language === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Hosted Checkout')
                      : (language === 'bn' ? 'বুকিং নিশ্চিত!' : 'Confirmed!')}
                  </span>
                </div>
              </div>

              {/* Step 1: Pick Date & Trip */}
              {simStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F2A3D] mb-1">
                      {language === 'bn' ? 'ট্যুর অভিজ্ঞতা নির্বাচন করুন:' : 'Choose Tour Experience:'}
                    </label>
                    <select
                      value={simTripId}
                      onChange={(e) => setSimTripId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#0F2A3D] bg-white"
                    >
                      {trips.map((tr) => (
                        <option key={tr.id} value={tr.id}>
                          {tr.title} ({formatCurrency(tr.pricePerPerson)}/ea)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F2A3D] mb-1">
                      {language === 'bn' ? 'তারিখ নির্বাচন করুন:' : 'Select Date:'}
                    </label>
                    <input
                      type="date"
                      value={simDate}
                      onChange={(e) => setSimDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#0F2A3D] bg-white"
                    />
                  </div>

                  <button
                    onClick={() => setSimStep(2)}
                    style={{ backgroundColor: primaryColor }}
                    className="w-full py-3 rounded-xl text-xs font-bold text-[#0F2A3D] shadow-sm hover:opacity-90 cursor-pointer"
                  >
                    {language === 'bn' ? 'অতিথি সংখ্যা নির্বাচন করুন →' : 'Select Group Size →'}
                  </button>
                </div>
              )}

              {/* Step 2: Group Size */}
              {simStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F2A3D] mb-1">
                      {t('widget.numberOfGuests')}
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 4, 6, 8].map((num) => (
                        <button
                          key={num}
                          onClick={() => setSimGuests(num)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                            simGuests === num
                              ? 'bg-[#1EC1CB] text-[#0F2A3D] border-[#1EC1CB]'
                              : 'bg-white text-[#5B7184] border-gray-200'
                          }`}
                        >
                          {formatNumber(num)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                    <span>
                      {selectedTrip.title} ({formatNumber(simGuests)}x {formatCurrency(selectedTrip.pricePerPerson)})
                    </span>
                    <span className="font-bold text-[#0F2A3D]">{formatCurrency(totalAmount)}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setSimStep(1)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-[#5B7184] cursor-pointer"
                    >
                      {language === 'bn' ? 'ফিরে যান' : 'Back'}
                    </button>
                    <button
                      onClick={() => setSimStep(3)}
                      style={{ backgroundColor: primaryColor }}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#0F2A3D] cursor-pointer"
                    >
                      {language === 'bn' ? 'অতিথির তথ্য দিন →' : 'Enter Guest Details →'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Guest Details */}
              {simStep === 3 && (
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F2A3D] mb-1">
                      {t('widget.primaryGuestName')}
                    </label>
                    <input
                      type="text"
                      value={simGuestName}
                      onChange={(e) => setSimGuestName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F2A3D] mb-1">
                      {t('widget.emailAddress')}
                    </label>
                    <input
                      type="email"
                      value={simGuestEmail}
                      onChange={(e) => setSimGuestEmail(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F2A3D] mb-1">
                      {t('widget.mobilePhone')}
                    </label>
                    <input
                      type="tel"
                      value={simGuestPhone}
                      onChange={(e) => setSimGuestPhone(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setSimStep(2)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-[#5B7184] cursor-pointer"
                    >
                      {language === 'bn' ? 'ফিরে যান' : 'Back'}
                    </button>
                    <button
                      onClick={() => setSimStep(4)}
                      style={{ backgroundColor: primaryColor }}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#0F2A3D] cursor-pointer"
                    >
                      {language === 'bn' ? `পেমেন্টে এগিয়ে যান (${formatCurrency(payAmount)})` : `Proceed to Secure Pay (${formatCurrency(payAmount)})`}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Hosted Payment Provider Mock (PCI Compliant) */}
              {simStep === 4 && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#0F2A3D] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#1EC1CB]" />
                      <span>{language === 'bn' ? 'এনক্রিপ্টেড পেমেন্ট চেকআউট (স্ট্রাইপ)' : 'Hosted Checkout Provider (Stripe Encrypted)'}</span>
                    </div>
                    <p className="text-[11px] text-[#5B7184]">
                      {language === 'bn'
                        ? 'কার্ডের তথ্য সরাসরি গেটওয়েতে সুরক্ষিত। কোনো সংবেদনশীল তথ্য সংরক্ষণ করা হয় না।'
                        : 'Card data is tokenized directly by provider. Operator never handles raw PAN.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">{language === 'bn' ? 'কার্ড প্রিভিউ' : 'Simulated Card'}</span>
                      <span className="text-gray-400">•••• 4242</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold pt-1 border-t">
                      <span>{t('widget.depositDueToday')}</span>
                      <span className="text-[#0A6C74] text-sm">{formatCurrency(payAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSimStep(3)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-[#5B7184] cursor-pointer"
                    >
                      {language === 'bn' ? 'ফিরে যান' : 'Back'}
                    </button>
                    <button
                      onClick={() => setSimStep(5)}
                      style={{ backgroundColor: primaryColor }}
                      className="flex-1 py-3 rounded-xl text-xs font-bold text-[#0F2A3D] shadow-md cursor-pointer"
                    >
                      {buttonText} ({formatCurrency(payAmount)})
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Instant Booking Confirmation */}
              {simStep === 5 && (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h4 className="text-base font-bold text-[#0F2A3D]">
                    {t('widget.step5Success')}
                  </h4>
                  <p className="text-xs text-[#5B7184]">
                    {language === 'bn' ? 'কোড:' : 'Code:'} <strong className="text-[#0A6C74]">TW-9418</strong> · {language === 'bn' ? `রশিদ পাঠানো হয়েছে ${simGuestEmail}` : `Receipt sent to ${simGuestEmail}`}
                  </p>

                  <div className="p-3 rounded-xl bg-[#DCFCE7]/70 border border-[#86EFAC] text-xs text-[#14532D]">
                    {language === 'bn'
                      ? 'ডিজিটাল সেফটি ওয়েভার লিংক SMS এর মাধ্যমে পাঠানো হয়েছে।'
                      : 'Digital safety waiver link sent via SMS.'}
                  </div>

                  <button
                    onClick={() => setSimStep(1)}
                    className="text-xs font-bold text-[#0A6C74] hover:underline pt-2 cursor-pointer block mx-auto"
                  >
                    {language === 'bn' ? 'রিসেট করে আবার পরীক্ষা করুন' : 'Reset & Test Again'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

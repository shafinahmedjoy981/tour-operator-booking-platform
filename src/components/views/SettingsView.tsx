import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  ShieldCheck,
  Lock,
  Users,
  Bell,
  Sliders,
  Download,
  Trash2,
  CheckCircle2,
  Key,
  Globe,
  Radio,
  FileCheck2,
  CreditCard,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { showToast, language, t } = useApp();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'team' | 'security' | 'notifications' | 'data'
  >('security');

  const [businessName, setBusinessName] = useState<string>('Harbor Kayak & Boat Co.');
  const [businessEmail, setBusinessEmail] = useState<string>('info@harborkayak.com');
  const [businessPhone, setBusinessPhone] = useState<string>('+880 1711-001122');
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(true);
  const [allowedOrigins, setAllowedOrigins] = useState<string>(
    'https://harborkayak.com, https://www.harborkayak.com'
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const securityAssurances = [
    {
      title: t('settings.secItem1Title'),
      desc: t('settings.secItem1Desc'),
      status: t('settings.statusActiveVerified'),
    },
    {
      title: t('settings.secItem2Title'),
      desc: t('settings.secItem2Desc'),
      status: t('settings.statusEnforced'),
    },
    {
      title: t('settings.secItem3Title'),
      desc: t('settings.secItem3Desc'),
      status: t('settings.statusIsolated'),
    },
    {
      title: t('settings.secItem4Title'),
      desc: t('settings.secItem4Desc'),
      status: t('settings.statusPciCompliant'),
    },
    {
      title: t('settings.secItem5Title'),
      desc: t('settings.secItem5Desc'),
      status: t('settings.statusProtected'),
    },
    {
      title: t('settings.secItem6Title'),
      desc: t('settings.secItem6Desc'),
      status: t('settings.statusYours'),
    },
    {
      title: t('settings.secItem7Title'),
      desc: t('settings.secItem7Desc'),
      status: t('settings.statusProtected'),
    },
    {
      title: t('settings.secItem8Title'),
      desc: t('settings.secItem8Desc'),
      status: t('settings.statusLegallyBinding'),
    },
  ];

  const notificationTriggers = [
    {
      title: language === 'bn' ? 'সরাসরি বুকিং নিশ্চিতকরণ' : 'Direct Booking Confirmation',
      desc: language === 'bn' ? 'ডিজিটাল ওয়েভার লিংক ও ডকের দিকনির্দেশনাসহ তাৎক্ষণিক SMS ও ইমেইল।' : 'Instant SMS & Email with signed digital waiver link and dock directions.',
      active: true,
    },
    {
      title: language === 'bn' ? 'আবহাওয়া মনিটরিং ও প্ররোচক পুনঃনির্ধারণ সতর্কতা' : 'Weather Watch Proactive Reschedule Alert',
      desc: language === 'bn' ? 'সফর স্থগিত হলে ১-ক্লিকে নতুন তারিখ বা রিফান্ড বাছাই লিংক পাঠানো।' : 'Auto-dispatched when a trip is held. Provides 1-click date choice or refund.',
      active: true,
    },
    {
      title: language === 'bn' ? '২৪-ঘন্টা পূর্বের ট্রিপ রিমাইন্ডার ও জোয়ার বিবরণ' : '24-Hour Trip Reminder & Tide Briefing',
      desc: language === 'bn' ? 'যাত্রার আগের দিন সকাল ৮টায় পার্কিং ও প্রয়োজনীয় সামগ্রীর পরামর্শ পাঠানো।' : 'Sent at 08:00 AM the day before departure with parking and footwear tips.',
      active: true,
    },
    {
      title: language === 'bn' ? 'ট্যুর পরবর্তী ছবি ও রিভিউ ধন্যবাদবার্তা' : 'Post-Trip Photo & Review Thank You',
      desc: language === 'bn' ? 'ডকে ফিরে আসার ২ ঘন্টা পর ধন্যবাদ ও গুগল ম্যাপস রিভিউ লিংক প্রেরণ।' : 'Sent 2 hours after return to dock. Directs guests to your Google Maps listing.',
      active: true,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Settings Navigation */}
      <div className="glass-raised p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F2A3D]">{t('settings.pageTitle')}</h2>
          <p className="text-xs text-[#5B7184]">
            {t('settings.pageSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white/70 rounded-xl border border-white overflow-x-auto">
          {[
            { id: 'security', label: t('settings.tabSecurity'), icon: ShieldCheck },
            { id: 'profile', label: t('settings.tabProfile'), icon: Globe },
            { id: 'team', label: t('settings.tabTeam'), icon: Users },
            { id: 'notifications', label: t('settings.tabNotifications'), icon: Bell },
            { id: 'data', label: t('settings.tabData'), icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                    : 'text-[#5B7184] hover:text-[#0F2A3D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SECURITY & PRIVACY CENTER */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="glass-modal p-6 border-l-4 border-l-[#16A34A] bg-white/90 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#14532D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                {language === 'bn' ? 'সকল ৮টি নিরাপত্তা মানদণ্ড সক্রিয় ও যাচাইকৃত' : 'All 8 Security Standards Verified Active'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#0F2A3D]">
              {t('settings.securityTrustTitle')}
            </h2>
            <p className="text-xs text-[#5B7184] max-w-2xl">
              {language === 'bn'
                ? 'টাইডওয়াইজ ট্যুর অপারেটরদের সরাসরি পেমেন্ট এবং জরুরি ডক নিরাপত্তা নিশ্চিত করতে বিশেষভাবে তৈরি।'
                : 'Tidewise is engineered from the ground up for tour operators handling customer payments and emergency dock safety.'}
            </p>
          </div>

          {/* Grid of Security Assurances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityAssurances.map((item, idx) => (
              <div
                key={idx}
                className="glass-base p-4 border border-white/80 hover:border-[#1EC1CB]/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0F2A3D] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    <span>{item.title}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]/60">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-[#5B7184] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Active Sessions & Security Audit Log */}
          <div className="glass-raised p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F2A3D] uppercase tracking-wide">
                  {language === 'bn' ? 'সাম্প্রতিক অ্যাকাউন্ট লগইন ও সেশন' : 'Recent Account Login Activity & Sessions'}
                </h3>
                <p className="text-xs text-[#5B7184]">
                  {language === 'bn' ? 'প্রতিটি লগইন অডিট করা হয় এবং সুরক্ষিত আইপি ট্র্যাক করা থাকে' : 'Every login is audited and tied to verified IP locations'}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                {language === 'bn' ? 'MFA সক্রিয়' : 'MFA Enforced'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white/70 border border-white flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F2A3D] block">
                    {language === 'bn' ? 'বর্তমান ডিভাইস (MacBook Pro · Chrome 134)' : 'Current Device (MacBook Pro · Chrome 134)'}
                  </span>
                  <span className="text-[#5B7184] text-[11px]">
                    Bar Harbor, Maine · IP: 24.198.42.11 · {language === 'bn' ? 'এখন সক্রিয়' : 'Active now'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  {language === 'bn' ? 'বর্তমান সেশন' : 'Current Session'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/70 border border-white flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F2A3D] block">
                    {language === 'bn' ? 'ডক আইপ্যাড প্রো (মোবাইল ম্যানিফেস্ট স্টাফ)' : 'Dock iPad Pro (Mobile Manifest Staff)'}
                  </span>
                  <span className="text-[#5B7184] text-[11px]">
                    Bar Harbor Marina Marina Wi-Fi · IP: 24.198.42.12 · {language === 'bn' ? '২ ঘন্টা আগে' : '2 hours ago'}
                  </span>
                </div>
                <span className="text-[10px] text-[#5B7184]">{language === 'bn' ? 'অনুমোদিত ডক স্টাফ' : 'Authorized Dock Staff'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUSINESS PROFILE */}
      {activeTab === 'profile' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast(t('settings.profileSavedToast'));
          }}
          className="glass-raised p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-[#0F2A3D]">{t('settings.profileTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1">{t('settings.companyLegalName')}:</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white text-xs font-semibold text-[#0F2A3D]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1">{t('settings.businessEmail')}:</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white text-xs font-semibold text-[#0F2A3D]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1">{t('settings.dockPhone')}:</label>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white text-xs font-semibold text-[#0F2A3D]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2A3D] mb-1">{t('settings.allowedOrigins')}:</label>
              <input
                type="text"
                value={allowedOrigins}
                onChange={(e) => setAllowedOrigins(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-white text-xs font-mono font-semibold text-[#0F2A3D]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1EC1CB] text-[#0F2A3D] hover:bg-[#18AEB7] shadow-sm cursor-pointer"
            >
              {t('settings.saveProfileBtn')}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: TEAM & ROLES (RBAC) */}
      {activeTab === 'team' && (
        <div className="glass-raised p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F2A3D]">{t('settings.teamTitle')}</h2>
              <p className="text-xs text-[#5B7184]">
                {t('settings.teamDesc')}
              </p>
            </div>
            <button
              onClick={() => showToast(language === 'bn' ? 'নতুন টিম মেম্বারের জন্য ইনভাইট লিংক তৈরি হয়েছে।' : 'Invite link generated for new team member.')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1EC1CB] text-[#0F2A3D] hover:bg-[#18AEB7] cursor-pointer"
            >
              {language === 'bn' ? '+ টিম মেম্বার আমন্ত্রণ' : '+ Invite Team Member'}
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white/70 border border-white">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-[#5B7184] bg-white/80">
                  <th className="py-3 px-4">{t('settings.thRole')}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'রাজস্ব ও পে-আউট' : 'Revenue & Payouts'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'গ্রাহক যোগাযোগ ও তথ্য' : 'Customer Contact PII'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'ম্যানিফেস্ট চেক-ইন' : 'Manifest Check-in'}</th>
                  <th className="py-3 px-4">{t('settings.thMember')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#0F2A3D]">{language === 'bn' ? 'মালিক (Owner)' : 'Owner'}</td>
                  <td className="py-3 px-4 text-[#16A34A] font-bold">{language === 'bn' ? 'সম্পূর্ণ নিয়ন্ত্রণ' : 'Full Access'}</td>
                  <td className="py-3 px-4 text-[#16A34A] font-bold">{language === 'bn' ? 'সম্পূর্ণ এক্সপোর্ট ও সম্পাদনা' : 'Full Export & Edit'}</td>
                  <td className="py-3 px-4 text-[#16A34A] font-bold">{language === 'bn' ? 'হ্যাঁ' : 'Yes'}</td>
                  <td className="py-3 px-4 text-[#5B7184]">{language === 'bn' ? 'আপনি (মালিক)' : 'You (Owner)'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#0F2A3D]">{language === 'bn' ? 'ডক ম্যানেজার' : 'Dock Manager'}</td>
                  <td className="py-3 px-4 text-[#D97706] font-medium">{language === 'bn' ? 'শুধুমাত্র দৈনিক মোট' : 'Daily Totals Only'}</td>
                  <td className="py-3 px-4 text-[#16A34A] font-bold">{language === 'bn' ? 'শুধু দেখার অনুমতি' : 'Read-Only'}</td>
                  <td className="py-3 px-4 text-[#16A34A] font-bold">{language === 'bn' ? 'হ্যাঁ' : 'Yes'}</td>
                  <td className="py-3 px-4 text-[#5B7184]">{language === 'bn' ? 'ক্যাপ্টেন রাশেদ করিম' : 'Capt. Rashed Karim'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#0F2A3D]">{language === 'bn' ? 'গাইড (ডক স্টাফ)' : 'Guide (Dock Staff)'}</td>
                  <td className="py-3 px-4 text-[#E11D48] font-bold">{language === 'bn' ? 'কোনো অনুমতি নেই' : 'No Access (Hidden)'}</td>
                  <td className="py-3 px-4 text-[#5B7184]">{language === 'bn' ? 'শুধু নাম ও স্বাস্থ্য নোট' : 'First Name & Medical Notes only'}</td>
                  <td className="py-3 px-4 text-[#16A34A] font-bold">{language === 'bn' ? 'শুধু নির্ধারিত ট্যুর' : 'Assigned Tours Only'}</td>
                  <td className="py-3 px-4 text-[#5B7184]">
                    {language === 'bn' ? 'শিরিন আক্তার, আরিফ মাহমুদ, নাবিলা হোসেন' : 'Shirin Akter, Arif Mahmud, Nabila Hossain'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="glass-raised p-6 space-y-4">
          <h2 className="text-base font-bold text-[#0F2A3D]">{language === 'bn' ? 'স্বয়ংক্রিয় নোটিফিকেশন ট্রিগার' : 'Automated Notification Triggers'}</h2>
          <div className="space-y-3">
            {notificationTriggers.map((n, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white/70 border border-white flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[#0F2A3D] block">{n.title}</span>
                  <span className="text-[11px] text-[#5B7184]">{n.desc}</span>
                </div>
                <input type="checkbox" defaultChecked={n.active} className="w-4 h-4 accent-[#1EC1CB] cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DATA PURGE & ACCOUNT DELETION */}
      {activeTab === 'data' && (
        <div className="glass-raised p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#0F2A3D]">{t('settings.dataTitle')}</h2>
            <p className="text-xs text-[#5B7184]">
              {t('settings.dataDesc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-3">
            <span className="text-xs font-bold text-[#0F2A3D] block">{language === 'bn' ? 'সম্পূর্ণ ব্যবসায়িক আর্কাইভ:' : 'Complete Business Archive:'}</span>
            <p className="text-xs text-[#5B7184]">
              {language === 'bn'
                ? 'সমস্ত বুকিং, গ্রাহক তালিকা, পেমেন্ট রসিদ, ওয়েভার অডিট লগ এবং গাইড আওয়ার অন্তর্ভুক্ত।'
                : 'Includes all bookings, customers, payment receipts, waiver audit logs, and guide hours.'}
            </p>
            <button
              onClick={() => showToast(t('settings.archiveExportToast'))}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F2A3D] text-white hover:bg-[#1A3E56] cursor-pointer"
            >
              {t('settings.exportAllArchiveBtn')}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFE4E6]/50 border border-[#FDA4AF] space-y-2">
            <span className="text-xs font-bold text-[#9F1239] block">{t('settings.dangerZone')}</span>
            <p className="text-xs text-[#881337]">
              {language === 'bn'
                ? '৩০ দিনের মধ্যে সার্ভার থেকে আপনার সমস্ত ডেটা, গ্রাহক প্রোফাইল ও উইজেট স্থায়ীভাবে মুছে ফেলা হবে।'
                : 'Permanently purges all business data, customer profiles, and active widgets from servers within 30 days.'}
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E11D48] text-white hover:bg-[#BE123C] cursor-pointer"
            >
              {t('settings.purgeAccountBtn')}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A3D]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-modal w-full max-w-md p-6 rounded-3xl space-y-4 border border-[#FDA4AF]">
            <div className="flex items-center gap-3 text-[#E11D48]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold">{t('settings.purgeModalTitle')}</h3>
            </div>
            <p className="text-xs text-[#5B7184] leading-relaxed">
              {t('settings.purgeModalDesc')}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5B7184] cursor-pointer"
              >
                {t('settings.cancelBtn')}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  showToast(language === 'bn' ? 'মুছে ফেলার আবেদন গৃহীত হয়েছে। নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে।' : 'Deletion request received. Confirmation sent to owner email.');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E11D48] text-white cursor-pointer"
              >
                {t('settings.confirmPurgeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

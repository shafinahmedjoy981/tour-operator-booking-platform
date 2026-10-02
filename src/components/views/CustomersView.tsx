import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Download,
  Search,
  Filter,
  ShieldCheck,
  Send,
  Phone,
  Mail,
  DollarSign,
  ChevronRight,
  MessageSquare,
  Gift,
  CheckCircle2,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, setSelectedCustomerId, showToast, language, t, formatNumber, formatCurrency } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [showCampaignComposer, setShowCampaignComposer] = useState<boolean>(false);
  const [campaignMessage, setCampaignMessage] = useState<string>(
    language === 'bn'
      ? 'নমস্কার {Guest_Name}! সম্প্রতি আবহাওয়া স্থগিতের কারণে আমরা আপনাকে মিস করেছি। আপনার পরবর্তী সরাসরি বুকিংয়ে ১৫% ডিসকাউন্ট পেতে কোড FALLPADDLE ব্যবহার করুন।'
      : 'Hi {Guest_Name}! We missed you on the water during our recent weather hold. Use code FALLPADDLE for 15% off your next direct booking.'
  );

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.nameBn && c.nameBn.includes(searchTerm)) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (selectedSegment === 'returning') return c.totalBookings > 1;
    if (selectedSegment === 'group_leaders') return c.tags.includes('Group Leader');
    if (selectedSegment === 'weather_affected') return c.weatherAffectedNotRebooked;
    if (selectedSegment === 'vip') return c.totalSpent > 600;

    return true;
  });

  const handleExportAllData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Customer ID,Name,Email,Phone,Total Bookings,Total Spent,Lifetime Commission Saved,Tags,Marketing Consent,Last Booking Date',
        ...customers.map(
          (c) =>
            `"${c.id}","${c.name}","${c.email}","${c.phone}",${c.totalBookings},${c.totalSpent},${c.lifetimeCommissionSaved},"${c.tags.join('; ')}",${c.consentMarketing},"${c.lastBookingDate}"`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tidewise_all_guests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(t('customers.exportToast', { count: formatNumber(customers.length) }));
  };

  const handleSendCampaign = () => {
    setShowCampaignComposer(false);
    showToast(t('customers.campaignDispatchedToast', { count: formatNumber(filteredCustomers.length) }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Operator Data Ownership Guarantee Banner */}
      <div className="glass-modal p-5 border-l-4 border-l-[#1EC1CB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1EC1CB]/15 flex items-center justify-center text-[#0A6C74] shrink-0 border border-[#1EC1CB]/30">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0F2A3D]">
              {t('customers.ownershipTitle')}
            </h2>
            <p className="text-xs text-[#5B7184] mt-0.5">
              {t('customers.ownershipDesc')}
            </p>
          </div>
        </div>

        {/* The prominent Export all my data (CSV) button */}
        <button
          onClick={handleExportAllData}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F2A3D] hover:bg-[#1A3E56] text-white shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 text-[#1EC1CB]" />
          <span>{t('customers.exportAllBtn')}</span>
        </button>
      </div>

      {/* Search, Segments & Campaign Action */}
      <div className="glass-raised p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#5B7184] absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('customers.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#0F2A3D] focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
            />
          </div>

          {/* Customer Segments */}
          <div className="flex items-center gap-1 p-1 bg-white/70 rounded-xl border border-white overflow-x-auto">
            {[
              { id: 'all', label: `${t('customers.segmentAll')} (${formatNumber(customers.length)})` },
              { id: 'returning', label: t('customers.segmentReturning') },
              { id: 'weather_affected', label: t('customers.segmentWeatherAffected') },
              { id: 'group_leaders', label: t('customers.segmentGroupLeaders') },
              { id: 'vip', label: t('customers.segmentVip') },
            ].map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(seg.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSegment === seg.id
                    ? 'bg-[#1EC1CB] text-[#0F2A3D] shadow-xs'
                    : 'text-[#5B7184] hover:text-[#0F2A3D]'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Composer Trigger */}
        <button
          onClick={() => setShowCampaignComposer(!showCampaignComposer)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t('customers.campaignBtn')}</span>
        </button>
      </div>

      {/* Quick Campaign Composer (Inline Drawer) */}
      {showCampaignComposer && (
        <div className="glass-modal p-5 border border-[#1EC1CB]/40 rounded-3xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
              {t('customers.campaignModalTitle')}
            </h3>
            <span className="text-xs font-semibold text-[#0A6C74]">
              {language === 'bn'
                ? `টার্গেটিং: বর্তমান সেগমেন্টে ${formatNumber(filteredCustomers.length)} জন অতিথি`
                : `Targeting: ${filteredCustomers.length} guests in current segment`}
            </span>
          </div>

          <textarea
            rows={3}
            value={campaignMessage}
            onChange={(e) => setCampaignMessage(e.target.value)}
            className="w-full p-3 rounded-2xl bg-white/90 border border-white text-xs text-[#0F2A3D] font-medium focus:outline-none focus:ring-2 focus:ring-[#1EC1CB]"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#5B7184]">
              {language === 'bn'
                ? 'গোপনীয়তা ও টেলিযোগাযোগ নিয়ম রক্ষার্থে স্বয়ংক্রিয় ১-ট্যাপ আনসাবস্ক্রাইব সুবিধা যুক্ত থাকবে।'
                : 'Includes automatic 1-tap unsubscribe to respect privacy and carrier regulations.'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCampaignComposer(false)}
                className="px-3 py-1.5 rounded-lg text-[#5B7184] hover:text-[#0F2A3D] cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSendCampaign}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#1EC1CB] text-[#0F2A3D] hover:bg-[#18AEB7] shadow-sm cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{t('customers.sendBroadcastBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer CRM Directory Table */}
      <div className="glass-base overflow-hidden border border-white/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#A0BDDB]/25 bg-white/50 text-[#5B7184] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">{t('customers.thName')}</th>
                <th className="py-3 px-4">{t('customers.thContact')}</th>
                <th className="py-3 px-4">{t('customers.thTags')}</th>
                <th className="py-3 px-4 text-center">{t('customers.thTours')}</th>
                <th className="py-3 px-4 text-right">{t('customers.thSpend')}</th>
                <th className="py-3 px-4 text-right">{t('today.commissionSavedTitle')}</th>
                <th className="py-3 px-4">{t('customers.thConsent')}</th>
                <th className="py-3 px-4 text-center">{t('customers.thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A0BDDB]/15">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className="hover:bg-white/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-bold text-[#0F2A3D]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#1EC1CB]/20 text-[#0A6C74] font-bold text-xs flex items-center justify-center">
                        {cust.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span>{language === 'bn' && cust.nameBn ? cust.nameBn : cust.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-xs text-[#0F2A3D] block">{cust.phone}</span>
                    <span className="text-[11px] text-[#5B7184] block">{cust.email}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cust.tags.map((tItem, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-[#0F2A3D] border border-white"
                        >
                          {tItem}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-[#0F2A3D] tabular-nums">
                    {formatNumber(cust.totalBookings)}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-[#0F2A3D] tabular-nums">
                    {formatCurrency(cust.totalSpent)}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-[#14532D] tabular-nums">
                    +{formatCurrency(cust.lifetimeCommissionSaved, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cust.consentMarketing
                          ? 'bg-[#DCFCE7] text-[#14532D]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cust.consentMarketing ? t('customers.optedIn') : (language === 'bn' ? 'শুধুমাত্র লেনদেন' : 'Transactional')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button className="text-[#5B7184] group-hover:text-[#1EC1CB] p-1" aria-label={t('common.viewDetails')}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

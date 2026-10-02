import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Link,
  Copy,
  Check,
  Calendar,
  DollarSign,
  FileCheck2,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  Send,
  Download,
} from 'lucide-react';

export const GroupBookingsView: React.FC = () => {
  const { groups, setShowNewGroupModal, showToast, language, t, formatNumber, formatCurrency } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'grp-201');

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const handleCopySplitLink = (group: any) => {
    navigator.clipboard?.writeText(group.splitPaymentLink);
    setCopiedId(group.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(t('groups.splitLinkCopiedToast', { name: group.groupName }));
  };

  const handleResendUnsignedWaivers = () => {
    showToast(t('groups.remindPendingToast', { name: selectedGroup.groupName }));
  };

  const handleDownloadRoster = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Name,Email,Waiver Signed,Signed At',
        ...selectedGroup.guestRoster.map(
          (g) => `"${g.name}","${g.email}",${g.waiverSigned},"${g.waiverSignedAt || 'Pending'}"`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedGroup.groupName.toLowerCase().replace(/\s+/g, '_')}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(t('groups.rosterDownloadedToast', { name: selectedGroup.groupName }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Single Primary Action */}
      <div className="glass-raised p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F2A3D]">
            {t('groups.pageTitle')}
          </h2>
          <p className="text-xs text-[#5B7184]">
            {t('groups.pageSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowNewGroupModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1EC1CB] hover:bg-[#18AEB7] text-[#0F2A3D] shadow-[0_4px_16px_rgba(30,193,203,0.35)] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('groups.newGroupBtn')}</span>
        </button>
      </div>

      {/* Main Grid: Groups List (Left) + Detailed Group Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Group Cards Selector */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#5B7184] uppercase tracking-wider block px-1">
            {t('groups.activeChartersHeading', { count: formatNumber(groups.length) })}
          </span>

          {groups.map((group) => {
            const isSelected = selectedGroupId === group.id;
            const rosterPct = Math.round(
              (group.waiverSignedCount / (group.confirmedGuests || 1)) * 100
            );

            return (
              <div
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'glass-modal border-[#1EC1CB] ring-2 ring-[#1EC1CB]/30'
                    : 'glass-base hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F2A3D] leading-snug">
                      {group.groupName}
                    </h3>
                    <p className="text-xs text-[#5B7184] mt-0.5">
                      {t('groups.leaderLabel')} <span className="font-semibold text-[#0F2A3D]">{language === 'bn' && group.leaderNameBn ? group.leaderNameBn : group.leaderName}</span>
                    </p>
                  </div>
                  {group.isPrivateTrip && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1EC1CB]/15 text-[#0A6C74] border border-[#1EC1CB]/30 shrink-0">
                      <Lock className="w-2.5 h-2.5" />
                      {t('groups.privateBadge')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#5B7184] pt-1 border-t border-[#A0BDDB]/20">
                  <div>
                    <span>{t('common.date')}: </span>
                    <span className="font-semibold text-[#0F2A3D]">{group.tripDate}</span>
                  </div>
                  <div className="text-right">
                    <span>{t('groups.targetSizeLabel')} </span>
                    <span className="font-bold text-[#0F2A3D] tabular-nums">
                      {formatNumber(group.confirmedGuests)}/{formatNumber(group.targetSize)}
                    </span>
                  </div>
                </div>

                {/* Progress bar of signed waivers */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#5B7184]">{t('groups.waiversSignedLabel')}</span>
                    <span className="font-bold text-[#0F2A3D] tabular-nums">
                      {formatNumber(group.waiverSignedCount)}/{formatNumber(group.confirmedGuests)} ({formatNumber(rosterPct)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#A0BDDB]/25 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1EC1CB]"
                      style={{ width: `${Math.min(100, rosterPct)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Group Deep Dossier (2 Cols) */}
        {selectedGroup && (
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="glass-raised p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-[#0F2A3D]">
                      {selectedGroup.groupName}
                    </h2>
                    {selectedGroup.isPrivateTrip && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1EC1CB]/15 text-[#0A6C74]">
                        {t('groups.privateLocked')}
                      </span>
                    )}
                    {selectedGroup.discountTierPercent > 0 && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D]">
                        {t('groups.tierDiscount', { pct: formatNumber(selectedGroup.discountTierPercent) })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5B7184] mt-1">
                    {selectedGroup.tripTitle} · {selectedGroup.tripDate} {selectedGroup.tripTime} EDT
                  </p>
                </div>

                {/* Split Link Button */}
                <button
                  onClick={() => handleCopySplitLink(selectedGroup)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1EC1CB] text-[#0F2A3D] hover:bg-[#18AEB7] shadow-sm transition-all cursor-pointer shrink-0"
                >
                  {copiedId === selectedGroup.id ? (
                    <Check className="w-3.5 h-3.5 text-[#14532D]" />
                  ) : (
                    <Link className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === selectedGroup.id ? t('groups.linkCopied') : t('groups.copySplitLink')}</span>
                </button>
              </div>

              {/* Group Leader Contact Strip */}
              <div className="p-3.5 rounded-2xl bg-white/70 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-[#5B7184] block">{t('groups.leaderContactHeading')}</span>
                  <span className="font-bold text-[#0F2A3D] text-sm">{language === 'bn' && selectedGroup.leaderNameBn ? selectedGroup.leaderNameBn : selectedGroup.leaderName}</span>
                </div>
                <div className="flex items-center gap-4 text-[#5B7184]">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#1EC1CB]" />
                    <span className="text-[#0F2A3D] font-medium">{selectedGroup.leaderPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#1EC1CB]" />
                    <span className="text-[#0F2A3D] font-medium">{selectedGroup.leaderEmail}</span>
                  </div>
                </div>
              </div>

              {/* Deposit & Balance Schedule Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white/70 border border-white">
                  <span className="text-[10px] font-bold text-[#5B7184] uppercase tracking-wider block">
                    {t('groups.depositStatus')}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base font-bold text-[#14532D] tabular-nums">
                      {formatCurrency(selectedGroup.depositAmount)}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D]">
                      {t('status.paid')}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#5B7184]">{t('groups.lockedReservation')}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/70 border border-white">
                  <span className="text-[10px] font-bold text-[#5B7184] uppercase tracking-wider block">
                    {t('groups.balanceRemaining')}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base font-bold text-[#0F2A3D] tabular-nums">
                      {formatCurrency(selectedGroup.balanceAmount)}
                    </span>
                    <span className="text-[10px] text-[#5B7184]">{t('groups.dueOct01')}</span>
                  </div>
                  <span className="text-[10px] text-[#0A6C74] font-medium">{t('groups.splitAcrossGuests')}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#DCFCE7]/70 border border-[#86EFAC]">
                  <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
                    {t('groups.commissionKept')}
                  </span>
                  <span className="text-base font-bold text-[#14532D] mt-1 block tabular-nums">
                    +{formatCurrency(((selectedGroup.depositAmount + selectedGroup.balanceAmount) * 0.25), { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[10px] text-[#166534]">{t('groups.zeroBrokerCuts')}</span>
                </div>
              </div>
            </div>

            {/* Guest Roster & Digital Waivers Collection */}
            <div className="glass-base p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0F2A3D] uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1EC1CB]" />
                    <span>{t('groups.manifestHeading', { count: formatNumber(selectedGroup.guestRoster.length) })}</span>
                  </h3>
                  <p className="text-xs text-[#5B7184]">
                    {t('groups.manifestSubtitle')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResendUnsignedWaivers}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-gray-50 text-[#0F2A3D] border border-white shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#1EC1CB]" />
                    <span>{t('groups.remindPendingBtn')}</span>
                  </button>
                  <button
                    onClick={handleDownloadRoster}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-gray-50 text-[#0F2A3D] border border-white shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#5B7184]" />
                    <span>{t('groups.downloadCsvBtn')}</span>
                  </button>
                </div>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto rounded-2xl bg-white/70 border border-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-[#5B7184] bg-white/80">
                      <th className="py-2.5 px-4">{t('groups.thName')}</th>
                      <th className="py-2.5 px-4">{t('groups.thEmail')}</th>
                      <th className="py-2.5 px-4">{t('groups.thWaiverStatus')}</th>
                      <th className="py-2.5 px-4">{t('groups.thDateSigned')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedGroup.guestRoster.map((guest) => (
                      <tr key={guest.id} className="hover:bg-white/90">
                        <td className="py-2.5 px-4 font-bold text-[#0F2A3D]">{language === 'bn' && guest.nameBn ? guest.nameBn : guest.name}</td>
                        <td className="py-2.5 px-4 text-[#5B7184]">{guest.email}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                              guest.waiverSigned
                                ? 'bg-[#DCFCE7] text-[#14532D]'
                                : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}
                          >
                            {guest.waiverSigned ? (
                              <Check className="w-3 h-3 text-[#16A34A]" />
                            ) : null}
                            <span>{guest.waiverSigned ? t('groups.signedVerified') : t('groups.awaitingSignature')}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[#5B7184] tabular-nums">
                          {guest.waiverSignedAt || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  Lock,
  ExternalLink,
  Info,
} from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const {
    payments,
    setPayments,
    totalCommissionSavedMonth,
    showToast,
    language,
    t,
    formatCurrency,
    formatNumber,
  } = useApp();

  const [confirmRefundId, setConfirmRefundId] = useState<string | null>(null);

  const totalGross = payments.reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalFees = payments.reduce((acc, curr) => acc + curr.processingFee, 0);
  const totalNet = payments.reduce((acc, curr) => acc + curr.netPayout, 0);

  const handleRefund = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'refunded' } : p))
    );
    setConfirmRefundId(null);
    showToast(t('payments.refundIssuedToast'));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Commission Transparency Hero Banner */}
      <div className="glass-modal p-6 border-l-4 border-l-[#1EC1CB] bg-white/90 shadow-[0_16px_40px_rgba(30,193,203,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A6C74] bg-[#1EC1CB]/15 px-2.5 py-0.5 rounded-full">
              {t('payments.marginTransparencyBadge')}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F2A3D] mt-2 tracking-tight">
            {t('payments.savedThisMonth', { amount: formatNumber(Math.round(totalCommissionSavedMonth)) })}
          </h2>
          <p className="text-xs text-[#5B7184] mt-1 max-w-2xl leading-relaxed">
            {t('payments.savedSubtitle')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#DCFCE7]/70 border border-[#86EFAC] text-center shrink-0">
          <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
            {t('payments.keepRateLabel')}
          </span>
          <span className="text-3xl font-extrabold text-[#14532D] tabular-nums block mt-0.5">
            {language === 'bn' ? '৯৭.১%' : '97.1%'}
          </span>
          <span className="text-[10px] text-[#166534]">{t('payments.keepRateVs')}</span>
        </div>
      </div>

      {/* Financial Overview Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-base p-5">
          <span className="text-xs font-bold text-[#5B7184] uppercase tracking-wider block mb-1">
            {t('payments.totalGross')}
          </span>
          <span className="text-3xl font-extrabold text-[#0F2A3D] tabular-nums tracking-tight">
            {formatCurrency(totalGross)}
          </span>
          <span className="text-xs text-[#5B7184] block mt-1">{t('payments.grossSubtitle')}</span>
        </div>

        <div className="glass-base p-5">
          <span className="text-xs font-bold text-[#5B7184] uppercase tracking-wider block mb-1">
            {t('payments.processingCost')}
          </span>
          <span className="text-3xl font-extrabold text-[#5B7184] tabular-nums tracking-tight">
            {formatCurrency(totalFees)}
          </span>
          <span className="text-xs text-[#5B7184] block mt-1">{t('payments.processingSubtitle')}</span>
        </div>

        <div className="glass-raised p-5 border-t-2 border-t-[#1EC1CB]">
          <span className="text-xs font-bold text-[#0A6C74] uppercase tracking-wider block mb-1">
            {t('payments.netPayout')}
          </span>
          <span className="text-3xl font-extrabold text-[#0F2A3D] tabular-nums tracking-tight">
            {formatCurrency(totalNet)}
          </span>
          <span className="text-xs text-[#16A34A] font-semibold block mt-1">
            {t('payments.payoutSubtitle')}
          </span>
        </div>
      </div>

      {/* Comparison Transparency Table */}
      <div className="glass-base p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0F2A3D] uppercase tracking-wide">
            {t('payments.feeComparisonTitle')}
          </h3>
          <p className="text-xs text-[#5B7184]">
            {language === 'bn' ? 'প্রতি $১,০০০ ট্যুর বিক্রয়ে সঠিক তুলনামূলক হিসাব' : 'Transparent apples-to-apples breakdown on every $1,000 in tour sales'}
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white/70 border border-white">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-[#5B7184] bg-white/80">
                <th className="py-3 px-4">{language === 'bn' ? 'চ্যানেল' : 'Channel'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'মোট বিক্রয়' : 'Gross Sales'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'কমিশন কর্তন' : 'Commission Cut'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'পেমেন্ট ফি' : 'Payment Fee'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'আপনার নিট আয়' : 'What You Take Home'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'গ্রাহকের ডেটার মালিকানা?' : 'Customer Data Owned?'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-[#1EC1CB]/10 font-semibold">
                <td className="py-3 px-4 font-bold text-[#0F2A3D] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1EC1CB]" />
                  <span>{language === 'bn' ? 'টাইডওয়াইজ ডিরেক্ট উইজেট' : 'Tidewise Direct Widget'}</span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">{formatCurrency(1000)}</td>
                <td className="py-3 px-4 text-right text-[#16A34A] font-bold tabular-nums">$0.00 (0%)</td>
                <td className="py-3 px-4 text-right text-[#5B7184] tabular-nums">~{formatCurrency(29.3)}</td>
                <td className="py-3 px-4 text-right text-[#14532D] font-extrabold text-sm tabular-nums">
                  {formatCurrency(970.7)}
                </td>
                <td className="py-3 px-4 text-[#16A34A] font-bold">{language === 'bn' ? '১০০% সরাসরি আপনার' : '100% Direct Access'}</td>
              </tr>
              <tr className="text-[#5B7184]">
                <td className="py-3 px-4">Viator / TripAdvisor Experiences</td>
                <td className="py-3 px-4 text-right tabular-nums">{formatCurrency(1000)}</td>
                <td className="py-3 px-4 text-right text-[#E11D48] font-bold tabular-nums">-{formatCurrency(250)} (25%)</td>
                <td className="py-3 px-4 text-right tabular-nums">{language === 'bn' ? 'অন্তর্ভুক্ত' : 'Included'}</td>
                <td className="py-3 px-4 text-right font-bold text-[#0F2A3D] tabular-nums">{formatCurrency(750)}</td>
                <td className="py-3 px-4 text-[#E11D48]">{language === 'bn' ? 'মাক্সড রিলে ইমেইল' : 'Masked Relay Emails'}</td>
              </tr>
              <tr className="text-[#5B7184]">
                <td className="py-3 px-4">GetYourGuide</td>
                <td className="py-3 px-4 text-right tabular-nums">{formatCurrency(1000)}</td>
                <td className="py-3 px-4 text-right text-[#E11D48] font-bold tabular-nums">-{formatCurrency(280)} (28%)</td>
                <td className="py-3 px-4 text-right tabular-nums">{language === 'bn' ? 'অন্তর্ভুক্ত' : 'Included'}</td>
                <td className="py-3 px-4 text-right font-bold text-[#0F2A3D] tabular-nums">{formatCurrency(720)}</td>
                <td className="py-3 px-4 text-[#E11D48]">{language === 'bn' ? 'কোনো সরাসরি অ্যাক্সেস নেই' : 'Zero Direct Access'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="glass-base overflow-hidden border border-white/80">
        <div className="p-4 border-b border-[#A0BDDB]/25 bg-white/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0F2A3D] uppercase tracking-wide">
            {t('payments.recentTransactions')}
          </h3>
          <span className="text-xs text-[#5B7184]">{language === 'bn' ? 'হোস্টেড চেকআউট প্রোভাইডার: সংযুক্ত' : 'Hosted Checkout Provider: Connected'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#A0BDDB]/20 text-[10px] uppercase font-bold text-[#5B7184] bg-white/40">
                <th className="py-3 px-4">{t('payments.thDate')}</th>
                <th className="py-3 px-4">{t('payments.thCustomer')}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'ট্যুর বিবরণ' : 'Tour Item'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}</th>
                <th className="py-3 px-4 text-right">{t('payments.thGross')}</th>
                <th className="py-3 px-4 text-right">{t('payments.thFee')}</th>
                <th className="py-3 px-4 text-right">{t('payments.thNet')}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'কমিশন সাশ্রয়' : 'Commission Saved'}</th>
                <th className="py-3 px-4">{t('payments.thStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A0BDDB]/15">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3 px-4 text-[#5B7184] tabular-nums">{p.date}</td>
                  <td className="py-3 px-4 font-bold text-[#0F2A3D]">
                    {language === 'bn' && p.customerNameBn ? p.customerNameBn : p.customerName}
                  </td>
                  <td className="py-3 px-4 text-[#5B7184]">{p.tripTitle}</td>
                  <td className="py-3 px-4 text-xs text-[#0F2A3D]">{p.method}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#0F2A3D] tabular-nums">
                    {formatCurrency(p.grossAmount)}
                  </td>
                  <td className="py-3 px-4 text-right text-[#5B7184] tabular-nums">
                    {formatCurrency(p.processingFee)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#0F2A3D] tabular-nums">
                    {formatCurrency(p.netPayout)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className="font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded-full text-[11px]">
                      +{formatCurrency(p.commissionSavedVsMarketplace)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'succeeded'
                          ? 'bg-[#DCFCE7] text-[#14532D]'
                          : 'bg-[#FFE4E6] text-[#9F1239]'
                      }`}
                    >
                      {p.status === 'succeeded' ? (language === 'bn' ? 'সফল' : 'SUCCEEDED') : p.status.toUpperCase()}
                    </span>
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

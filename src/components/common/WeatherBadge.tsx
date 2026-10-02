import React from 'react';
import { WeatherRiskLevel } from '../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WeatherBadgeProps {
  level: WeatherRiskLevel;
  showIconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = ({
  level,
  showIconOnly = false,
  size = 'md',
}) => {
  const { t } = useApp();

  if (level === 'go') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3.5 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        } bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]/70`}
      >
        <CheckCircle2 className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#16A34A] shrink-0`} />
        {!showIconOnly && <span>{size === 'sm' ? t('weather.safeBadge') : t('weather.go')}</span>}
      </span>
    );
  }

  if (level === 'caution') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3.5 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        } bg-[#FEF3C7] text-[#78350F] border-[#FDE68A]/80`}
      >
        <AlertTriangle className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#D97706] shrink-0`} />
        {!showIconOnly && <span>{size === 'sm' ? t('weather.cautionBadge') : t('weather.caution')}</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${
        size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : size === 'lg'
          ? 'px-3.5 py-1.5 text-sm'
          : 'px-2.5 py-1 text-xs'
      } bg-[#FFE4E6] text-[#881337] border-[#FDA4AF]`}
    >
      <AlertOctagon className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#E11D48] shrink-0`} />
      {!showIconOnly && <span>{size === 'sm' ? t('weather.stopBadge') : t('weather.stop')}</span>}
    </span>
  );
};

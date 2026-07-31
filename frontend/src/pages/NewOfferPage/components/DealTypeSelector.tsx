import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { formStyle } from '@app/styles/form';
import type { OfferType } from '@/types/entities/Offer.d.ts';

interface DealTypeSelectorProps {
  value: OfferType;
  onChange: (value: OfferType) => void;
}

const DEAL_TYPES = [
  {
    value: 'SELL' as OfferType,
    labelKey: 'typeOfDeal.purchaseOnly',
  },
  {
    value: 'EXCHANGE' as OfferType,
    labelKey: 'typeOfDeal.exchangeOnly',
  },
  {
    value: 'SELL_EXCHANGE' as OfferType,
    labelKey: 'typeOfDeal.both',
  },
];

const labelStyle = clsx('flex items-center px-[8px] text-[#676767]');

export const DealTypeSelector: React.FC<DealTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="font-kyiv text-h6m mb-[10px]">
        {t('titles.typeOfDeal')}
        {'*'}
      </h3>

      <div className="space-y-3 lg:space-y-4">
        {DEAL_TYPES.map((type) => (
          <label key={type.value} className={`${labelStyle} group`}>
            <input
              type="radio"
              name="dealType"
              value={type.value}
              checked={value === type.value}
              onChange={(e) => onChange(e.target.value as OfferType)}
              className={`${formStyle.radio} peer`}
              required
            />
            <p
              className="font-kyiv text-h6m 
               peer-checked:text-aquamarine-950"
            >
              {t(type.labelKey)}
            </p>
          </label>
        ))}
      </div>
    </div>
  );
};

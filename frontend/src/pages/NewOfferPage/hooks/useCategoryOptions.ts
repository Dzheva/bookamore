import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { categories } from '@/shared/constants/categories.ts';
import type { CategoryOption } from '../types';

export const useCategoryOptions = (): CategoryOption[] => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      categories.map((category) => ({
        value: category,
        label: t(`categories.${category}`),
      })),
    [t]
  );
};

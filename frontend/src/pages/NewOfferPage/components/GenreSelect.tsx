import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { formStyle } from '@app/styles/form';
import { useCategoryOptions } from '../hooks/useCategoryOptions';
import type { CategoryOption } from '../types';

interface GenreSelectProps {
  value: string[];
  onChange: (genres: string[]) => void;
}

const animatedComponents = makeAnimated();

export const GenreSelect: React.FC<GenreSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const categoryOptions = useCategoryOptions();

  return (
    <div className={formStyle.container}>
      <h2 className={formStyle.title}>{t('sellBook.genres')}</h2>
      <Select<CategoryOption, true>
        className="
          w-full
          text-gray-500
          text-sm
          sm:text-base
          font-kyiv
        "
        id="genres"
        options={categoryOptions}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        placeholder={t('sellBook.genresPlaceholder')}
        name="genres"
        classNamePrefix="select"
        onChange={(selectedOptions) => {
          onChange(selectedOptions.map((opt) => opt.value));
        }}
        value={categoryOptions.filter((genre) => value.includes(genre.value))}
      />
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { formStyle } from '@app/styles/form';
import UploadPhoto from '@/shared/components/UploadPhoto/UploadPhoto';
import { Button } from '@/shared/ui/Button/Button';
import type { image as BookImage } from '@/types/entities/Book.d.ts';
import type { OfferFormData } from '../types';
import { DealTypeSelector } from './DealTypeSelector';
import { GenreSelect } from './GenreSelect';
import { ConditionPriceFields } from './ConditionPriceFields';

interface OfferFormProps {
  formData: OfferFormData;
  onChange: <K extends keyof OfferFormData>(
    field: K,
    value: OfferFormData[K]
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  existingImages: BookImage[];
  onPhotosChange: (photos: File[]) => void;
  onExistingImagesChange: (images: BookImage[]) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
  offerId?: string;
}

export const OfferForm: React.FC<OfferFormProps> = ({
  formData,
  onChange,
  onSubmit,
  existingImages,
  onPhotosChange,
  onExistingImagesChange,
  isSubmitting,
  mode,
  offerId,
}) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      {/* Book Title */}
      <div className={formStyle.container}>
        <label htmlFor="title" className={formStyle.title}>
          {t('sellBook.bookTitle')}
          {'*'}
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Babel"
          className={formStyle.input}
          required
        />
      </div>

      {/* Author */}
      <div className={formStyle.container}>
        <label htmlFor="author" className={formStyle.title}>
          {t('sellBook.author')}
          {'*'}
        </label>
        <input
          id="author"
          name="author"
          type="text"
          value={formData.author}
          onChange={(e) => onChange('author', e.target.value)}
          placeholder="Rebecca Kuang"
          className={formStyle.input}
          required
        />
      </div>

      {/* Upload Photo */}
      <UploadPhoto
        key={offerId || 'new'}
        onPhotosChange={onPhotosChange}
        initialExistingImages={existingImages}
        onExistingImagesChange={onExistingImagesChange}
      />

      {/* Genres Select */}
      <GenreSelect
        value={formData.genres}
        onChange={(genres) => onChange('genres', genres)}
      />

      {/* Deal Type Selection */}
      <DealTypeSelector
        value={formData.dealType}
        onChange={(dealType) => onChange('dealType', dealType)}
      />

      {/* Condition & Price */}
      <ConditionPriceFields
        condition={formData.condition}
        price={formData.price}
        onConditionChange={(condition) => onChange('condition', condition)}
        onPriceChange={(price) => onChange('price', price)}
      />

      {/* Description */}
      <div className="flex flex-col mb-5">
        <label htmlFor="desc" className="text-h4m mb-1 block">
          {t('sellBook.description')}
        </label>
        <textarea
          id="desc"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder={t('sellBook.descriptionPlaceholder')}
          rows={4}
          className="w-full px-[10px] py-[14px] rounded-lg lg:py-4
          border border-gray-400
          text-sm sm:text-base"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" isLoading={isSubmitting} className="mb-[40px]">
        {isSubmitting
          ? t(`sellBook.${mode}.loading`)
          : t(`sellBook.${mode}.submit`)}
      </Button>
    </form>
  );
};

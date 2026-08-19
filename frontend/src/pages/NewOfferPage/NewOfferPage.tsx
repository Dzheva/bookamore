import React from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import HeaderTitle from '@/shared/ui/HeaderTitle';
import { BottomNav } from '@shared/ui/BottomNav';
import { useOfferForm } from './hooks/useOfferForm';
import { OfferForm } from './components/OfferForm';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

const NewOfferPage: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const { t } = useTranslation();
  const {
    mode,
    formData,
    existingImages,
    isLoading,
    error,
    offer,
    isSubmitting,
    handleInputChange,
    handlePhotosChange,
    handleExistingImagesChange,
    handleSubmit,
  } = useOfferForm();

  if (isLoading) return <div>Loading...</div>;
  if (offerId && (error || !offer)) return <NotFoundPage />;

  return (
    <>
      <Toaster />

      <HeaderTitle title={t(`sellBook.${mode}.title`)} />

      <main className="mx-auto mb-[65px] w-full space-y-5 lg:max-w-6xl xl:max-w-7xl">
        <OfferForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          existingImages={existingImages}
          onPhotosChange={handlePhotosChange}
          onExistingImagesChange={handleExistingImagesChange}
          isSubmitting={isSubmitting}
          mode={mode}
          offerId={offerId}
        />
      </main>
      <BottomNav />
    </>
  );
};

export { NewOfferPage };

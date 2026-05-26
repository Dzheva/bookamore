import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAddOfferWithBookMutation } from '@app/store/api/OffersApi';
import { useUploadImageMutation } from '@app/store/api/ImagesApi';
import { BottomNav } from '@shared/ui/BottomNav';
import type { OfferType, OfferStatus } from '@/types/entities/Offer.d.ts';
import type { OfferWithBookRequest } from '@/types/entities/OfferWithBook.d.ts';
import type { BookCondition } from '@/types/entities/Book.d.ts';
import { formStyle } from '@app/styles/form';
import clsx from 'clsx';
import HeaderTitle from '@/shared/ui/HeaderTitle';
import { toast, Toaster } from 'react-hot-toast';
import UploadPhoto from '@/shared/components/UploadPhoto/UploadPhoto';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store/store';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useTranslation } from 'react-i18next';
import { categories, type Category } from '@/shared/constants/categories.ts';
import { Button } from '@/shared/ui/Button/Button';

type CategoryOption = {
  value: Category;
  label: string;
};

const animatedComponents = makeAnimated();

const NewOfferPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [addOfferWithBook, { isLoading: isSubmitting }] =
    useAddOfferWithBookMutation();
  const [uploadImage] = useUploadImageMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const categoryOptions: CategoryOption[] = categories.map((category) => ({
    value: category,
    label: t(`categories.${category}`),
  }));

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'NEW' as BookCondition,
    dealType: 'SELL' as OfferType,
    price: '',
    description: '',
    photos: [] as File[],
    genres: [] as string[],
  });

  const handlePhotosChange = React.useCallback((photos: File[]) => {
    setFormData((prev) => ({ ...prev, photos }));
  }, []);

  const handleInputChange = (
    field: string,
    value: string | BookCondition | OfferType | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.author || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const offerWithBookRequest: OfferWithBookRequest = {
        type: formData.dealType,
        status: 'OPEN' as OfferStatus,
        description: formData.description,
        price: parseFloat(formData.price),
        previewImage: formData.photos[0] || null,
        book: {
          title: formData.title,
          yearOfRelease: new Date().getFullYear(), // Default to current year
          description: formData.description,
          isbn: '',
          condition: formData.condition,
          authors: [formData.author],
          genres: formData.genres,
          images: [],
        },
        sellerId: user.id,
      };

      const result = await addOfferWithBook(offerWithBookRequest).unwrap();

      if (formData.photos.length > 0) {
        let failedImages = 0;
        for (const photo of formData.photos) {
          try {
            await uploadImage({
              file: photo,
              entityType: 'BOOK',
              entityId: result.book.id,
            }).unwrap();
          } catch (error) {
            console.error('Failed to upload image:', error);
            failedImages++;
          }
        }

        if (failedImages > 0) {
          toast.error(
            `Offer created but ${failedImages} image(s) failed to upload`
          );
        } else {
          toast.success('Offer published with images!');
        }
      } else {
        toast.success('Offer published!');
      }

      navigate(`/offers/${result.id}`);
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Failed to create offer. Please try again.');
    }
  };

  const labelStyle = clsx('flex items-center px-[8px] text-[#676767]    ');

  return (
    <div className="min-h-screen">
      <Toaster />

      <HeaderTitle title={t('sellBook.title')} />

      <div className="w-full  max-w-md mx-auto lg:max-w-2xl xl:max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
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
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Babel"
              className={formStyle.input}
              required
            />
          </div>

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
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Rebecca Kuang"
              className={formStyle.input}
              required
            />
          </div>
          <UploadPhoto onPhotosChange={handlePhotosChange} />
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
                handleInputChange(
                  'genres',
                  selectedOptions.map((opt) => opt.value)
                );
              }}
              value={categoryOptions.filter((genre) =>
                formData.genres.includes(genre.value)
              )}
            />
          </div>

          <div>
            <h3 className="font-kyiv text-h6m mb-[10px] ">
              {t('titles.typeOfDeal')}
              {'*'}
            </h3>

            <div className="space-y-3 lg:space-y-4">
              <label className={`${labelStyle} group`}>
                <input
                  type="radio"
                  name="dealType"
                  value="SELL"
                  checked={formData.dealType === 'SELL'}
                  onChange={(e) =>
                    handleInputChange('dealType', e.target.value as OfferType)
                  }
                  className={`${formStyle.radio} peer`}
                  required
                />
                <p
                  className="font-kyiv text-h6m 
              peer-checked:text-aquamarine-950"
                >
                  {t('typeOfDeal.purchaseOnly')}
                </p>
              </label>

              <label className={`${labelStyle} group`}>
                <input
                  type="radio"
                  name="dealType"
                  value="EXCHANGE"
                  checked={formData.dealType === 'EXCHANGE'}
                  onChange={(e) =>
                    handleInputChange('dealType', e.target.value as OfferType)
                  }
                  className={`${formStyle.radio} peer`}
                  required
                />
                <p
                  className="font-kyiv text-h6m 
              peer-checked:text-aquamarine-950"
                >
                  {t('typeOfDeal.exchangeOnly')}
                </p>
              </label>

              <label className={`${labelStyle} group`}>
                <input
                  type="radio"
                  name="dealType"
                  value="SELL_EXCHANGE"
                  checked={formData.dealType === 'SELL_EXCHANGE'}
                  onChange={(e) =>
                    handleInputChange('dealType', e.target.value as OfferType)
                  }
                  className={`${formStyle.radio} peer`}
                  required
                />
                <p
                  className="font-kyiv text-h6m 
              peer-checked:text-aquamarine-950"
                >
                  {t('typeOfDeal.both')}
                </p>
              </label>
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div
              className="w-[164px] 
               flex flex-col gap-1
            "
            >
              <label
                htmlFor="condition"
                className="text-h6m text-aquamarine-950 py-[4px] px-[12px] "
              >
                {t('titles.condition')}
                {'*'}
              </label>
              <select
                name="condition"
                id="condition"
                value={formData.condition}
                onChange={(e) =>
                  handleInputChange(
                    'condition',
                    e.target.value as BookCondition
                  )
                }
                className="min-w-[163px] h-[44px] text-h6m               
                border-[0.4px] border-gray-400 border-solid rounded-xl
                px-[10px] py-[12px]
                bg-no-repeat  bg-[url('/down.png')]
                bg-[right_10px_center]
                focus:outline-none focus:ring-0 appearance-none 
                 "
              >
                <option value="NEW">{t('condition.NEW')}</option>
                <option value="AS_NEW">{t('condition.AS_NEW')}</option>
                <option value="USED">{t('condition.USED')}</option>
              </select>
            </div>

            <div className="w-[164px]  flex flex-col gap-1">
              <label
                htmlFor="price"
                className="text-h6m text-aquamarine-950 py-[4px] px-[12px]"
              >
                {`${t('titles.price')}, UAH`}
              </label>

              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="300"
                className="min-w-[163px] h-[44px] text-h6m text-black               
                border-[0.4px] border-gray-400 border-solid rounded-xl
                px-[10px] py-[12px]
                focus:outline-none focus:ring-0
                focus:text-
                "
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label htmlFor="desc" className="text-h4m mb-1    ">
              {t('sellBook.description')}
            </label>
            <textarea
              id="desc"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('sellBook.descriptionPlaceholder')}
              rows={4}
              className="w-full px-[10px] py-[14px] 
              rounded-lg  lg:py-4
              border-[0.4px] border-gray-400 border-solid 
              focus:outline-none focus:ring-0
              resize-none text-sm sm:text-base"
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="mb-[78px]">
            {isSubmitting ? t('sellBook.publishing') : t('sellBook.publish')}
          </Button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export { NewOfferPage };

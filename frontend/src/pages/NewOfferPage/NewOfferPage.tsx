import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAddOfferWithBookMutation } from '@app/store/api/OffersApi';
import { BottomNav } from '@shared/ui/BottomNav';
import type { OfferType, OfferStatus } from '@/types/entities/Offer.d.ts';
import type { OfferWithBookRequest } from '@/types/entities/OfferWithBook.d.ts';
import type { BookCondition } from '@/types/entities/Book.d.ts';
import { formStyle } from '@app/styles/form';
// import { AddPhotoBook } from '@/shared/ui/icons/AddPhotoBookSvg';
// import { NoImgAddPhoto } from '@/shared/ui/icons/NoImgAddSvg';
import clsx from 'clsx';
import HeaderTitle from '@/shared/ui/HeaderTitle';
// import { SelectMenu } from '@/shared/ui/icons/ SelectMenuSvg';
import { toast, Toaster } from 'react-hot-toast';
import UploadPhoto from '@/shared/components/UploadPhoto/UploadPhoto';

const NewOfferPage: React.FC = () => {
  const navigate = useNavigate();
  const [addOfferWithBook, { isLoading: isSubmitting }] =
    useAddOfferWithBookMutation();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'NEW' as BookCondition,
    dealType: 'SELL' as OfferType,
    price: '',
    description: '',
    photos: [] as File[],
  });

  const handleInputChange = (
    field: string,
    value: string | BookCondition | OfferType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handlePhotosChange = (files: FileList | null) => {
  //   if (files) {
  //     setFormData((prev) => ({ ...prev, photos: Array.from(files) }));
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          isbn: '', // Optional
          condition: formData.condition,
          authors: [formData.author],
          genres: [], // Empty for now
          images: formData.photos,
        },
        sellerId: 1, // TODO: Get from auth context
      };

      const result = await addOfferWithBook(offerWithBookRequest).unwrap();
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

      <HeaderTitle title="Sell book" />

      {/* <div>
        <button
          onClick={() => {
            toast.success('success');
          }}
        >
          test
        </button>
      </div> */}

      <div className="w-full  max-w-md mx-auto lg:max-w-2xl xl:max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          <div className={formStyle.container}>
            <label htmlFor="title" className={formStyle.title}>
              Book Title*
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
              Author*
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
          <UploadPhoto />
          {/* <div
            className="flex flex-col 
          border-[0.4px] border-solid border-[#B6B6B6] rounded-xl 
          min-h-[201px] 
          "
          >
            <h3 className="font-kyiv text-h3m   p-[8px]">Upload photo</h3>

            <div className="flex">
              <div
                className="min-w-[104px] h-[144px]  bg-[#F7F8F2] 
              mt-[6px] mr-[16px] mb-[6px] ml-[8px]
              flex items-center justify-center
              "
              >
                <label className="">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotosChange(e.target.files)}
                    className="hidden"
                  />

                  <AddPhotoBook />
                </label>
              </div>

              <div
                className="min-w-[191px] h-[156px] 
              flex justify-center gap-[12px]  flex-wrap 
              px-[33.5px]
              "
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-[#F7F8F2] w-[56px] h-[72px] rounded-[10px]
                    flex items-center justify-center
                    "
                  >
                    <NoImgAddPhoto />
                  </div>
                ))}

                {formData.photos.length > 0 && (
                  <p>{formData.photos.length} photo(s) selected</p>
                )}
              </div>
            </div>
          </div> */}
          <div>
            <h3 className="font-kyiv text-h6m mb-[10px] ">Type of deal*</h3>

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
                  Purchase only
                </p>
              </label>

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
                  Exchange only
                </p>
              </label>

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
                  Both
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
                Condition*
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
                <option value="NEW">New</option>
                <option value="AS_NEW">As New</option>
                <option value="USED">Used</option>
              </select>
            </div>

            <div className="w-[164px]  flex flex-col gap-1">
              <label
                htmlFor="price"
                className="text-h6m text-aquamarine-950 py-[4px] px-[12px]"
              >
                Price, UAH
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
              Add description
            </label>
            <textarea
              id="desc"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Used, in good condition."
              rows={4}
              className="w-full px-[10px] py-[14px] 
              rounded-lg  lg:py-4
              border-[0.4px] border-gray-400 border-solid 
              focus:outline-none focus:ring-0
              resize-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 sm:py-4 lg:py-5 mb-[78px]
            bg-[#033F63] text-white
             font-semibold rounded-lg
             transition-colors disabled:bg-gray-400 
             disabled:cursor-not-allowed text-base sm:text-lg lg:text-xl"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export { NewOfferPage };

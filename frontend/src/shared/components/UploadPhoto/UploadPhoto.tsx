import { AddPhotoBook } from '@/shared/ui/icons/AddPhotoBookSvg';
import { NoImgAddPhoto } from '@/shared/ui/icons/NoImgAddSvg';
import { useState, type ChangeEvent, useEffect } from 'react';
import { DeletePhotoSvg } from '@/shared/ui/icons/DeletePhotoSvg';
import { useTranslation } from 'react-i18next';

interface ExistingImage {
  id: string;
  path: string;
}

const IMAGE_HOST = import.meta.env.VITE_IMAGE_HOST || '';

const getImagePreviewUrl = (path?: string) => {
  if (!path) return '';

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${IMAGE_HOST}${normalizedPath}`;
};

interface UploadPhotoProps {
  onPhotosChange?: (photos: File[]) => void;
  initialPhotos?: File[];
  initialExistingImages?: ExistingImage[];
  onExistingImagesChange?: (images: ExistingImage[]) => void;
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({
  onPhotosChange,
  initialExistingImages = [],
  onExistingImagesChange,
}) => {
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newPhotos, setNewPhotos] = useState<
    Array<{ file: File; previewUrl: string }>
  >([]);
  const { t } = useTranslation();

  useEffect(() => {
    setExistingImages(initialExistingImages);
  }, [initialExistingImages]);

  useEffect(() => {
    onPhotosChange?.(newPhotos.map(({ file }) => file));
  }, [newPhotos, onPhotosChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const remainingSlots = 4 - (existingImages.length + newPhotos.length);
    if (remainingSlots <= 0) return;

    const selectedFiles = Array.from(e.target.files).slice(0, remainingSlots);
    const newItems = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewPhotos((prev) => [...prev, ...newItems]);
  };

  const handleDeleteExisting = (index: number) => {
    setExistingImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onExistingImagesChange?.(next);
      return next;
    });
  };

  const handleDeleteNew = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const displayItems = [
    ...existingImages.map((image) => ({
      type: 'existing' as const,
      previewUrl: getImagePreviewUrl(image.path),
      id: image.id,
    })),
    ...newPhotos.map((photo, index) => ({
      type: 'new' as const,
      previewUrl: photo.previewUrl,
      id: `new-${index}`,
    })),
  ];

  return (
    <div>
      <h3 className="text-h3m p-[10px]">{t('sellBook.uploadPhoto')}</h3>

      {displayItems.length < 4 ? (
        <div className="flex">
          <div>
            <label className="w-[104px] h-[144px] bg-[#F7F8F2] mt-[6px] mr-[16px] mb-[6px] ml-[8px] flex items-center justify-center">
              <input
                id="fileItem"
                onChange={handleChange}
                type="file"
                accept="image/*"
                className="hidden"
                multiple
              />

              <AddPhotoBook />
            </label>
          </div>

          <div>
            <ul className="min-w-[191px] h-[156px] grid grid-cols-2 gap-[12px] px-[33.5px]">
              {Array.from({ length: 4 }).map((_, i) => {
                const item = displayItems[i];

                return (
                  <li
                    key={i}
                    className="bg-[#F7F8F2] w-[56px] h-[72px] rounded-[10px] flex items-center justify-center"
                  >
                    {item ? (
                      <div className="relative w-full h-full">
                        <img
                          src={item.previewUrl}
                          alt={`photo-${i}`}
                          className="w-full h-full object-cover rounded-[10px]"
                        />

                        <button
                          className="absolute inset-0 flex items-center justify-center"
                          onClick={() => {
                            if (item.type === 'existing') {
                              handleDeleteExisting(i);
                            } else {
                              const newIndex = displayItems
                                .slice(0, i)
                                .filter((entry) => entry.type === 'new').length;
                              handleDeleteNew(newIndex);
                            }
                          }}
                          type="button"
                        >
                          <DeletePhotoSvg />
                        </button>
                      </div>
                    ) : (
                      <NoImgAddPhoto />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="w-[104px] h-[144px] bg-[#F7F8F2] flex items-center justify-center mt-[6px] mr-[16px] mb-[6px] ml-[8px]">
            {displayItems[0] && (
              <img
                src={displayItems[0].previewUrl}
                alt="photo"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <ul className="min-w-[191px] h-[156px] grid grid-cols-2 gap-[12px] px-[33.5px]">
            {displayItems.map((item, i) => (
              <li
                key={`${item.type}-${i}`}
                className="bg-[#F7F8F2] w-[56px] h-[72px] rounded-[10px] flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <img
                    src={item.previewUrl}
                    alt={`photo-${i}`}
                    className="w-full h-full object-cover rounded-[10px]"
                  />

                  <button
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={() => {
                      if (item.type === 'existing') {
                        handleDeleteExisting(i);
                      } else {
                        const newIndex = displayItems
                          .slice(0, i)
                          .filter((entry) => entry.type === 'new').length;
                        handleDeleteNew(newIndex);
                      }
                    }}
                    type="button"
                  >
                    <DeletePhotoSvg />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPhoto;

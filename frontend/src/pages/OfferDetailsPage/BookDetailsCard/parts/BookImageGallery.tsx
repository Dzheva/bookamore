import { ArrowLeft, ArrowRight } from '@/shared/ui/icons/Arrows';
import { Badge } from '@/shared/ui/icons/Badge';
import { useCallback } from 'react';
import type { image } from '@/types/entities/Book';

import noImages from '@/assest/images/noImage.jpg';

const IMAGE_HOST = import.meta.env.VITE_IMAGE_HOST || '';

export const BookImageGallery = ({
  images,
  index,
  setIndex,
  title,
  condition,
}: {
  images: image[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  condition?: string;
}) => {
  const hasMultiple = images.length > 1;

  const prev = useCallback(() => {
    setIndex((p) => (p > 0 ? p - 1 : images.length - 1));
  }, [images.length, setIndex]);

  const next = useCallback(() => {
    setIndex((p) => (p < images.length - 1 ? p + 1 : 0));
  }, [images.length, setIndex]);

  return (
    <div className="flex items-center gap-2">
      {hasMultiple && (
        <button onClick={prev} className="p-4">
          <ArrowLeft />
        </button>
      )}

      <div className="relative w-[164px] h-[230px] md:w-[214px] md:h-[300px] lg:w-[264px] lg:h-[370px] xl:w-[314px] xl:h-[440px] rounded-xl overflow-hidden">
        {images[index] ? (
          <img
            src={`${IMAGE_HOST}${images[index].path}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={noImages}
            alt="no image"
            className="w-full h-full object-cover"
          />
        )}

        {condition === 'NEW' && (
          <div className="absolute bottom-2 right-2">
            <Badge className="lg:w-7 lg:h-7" />
          </div>
        )}
      </div>

      {hasMultiple && (
        <button onClick={next} className="p-4">
          <ArrowRight />
        </button>
      )}
    </div>
  );
};

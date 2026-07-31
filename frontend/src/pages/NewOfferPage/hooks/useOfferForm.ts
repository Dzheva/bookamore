import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  useAddOfferWithBookMutation,
  useGetOfferWithBookByIdQuery,
  useUpdateOfferByIdMutation,
  OffersApi,
} from '@app/store/api/OffersApi';
import { useUpdateBookByIdMutation } from '@app/store/api/BooksApi';
import {
  useDeleteImageByIdMutation,
  useUploadImageMutation,
} from '@app/store/api/ImagesApi';
import type { RootState } from '@/app/store/store';
import type {
  BookCondition,
  image as BookImage,
} from '@/types/entities/Book.d.ts';
import type { OfferType, OfferStatus } from '@/types/entities/Offer.d.ts';
import type { OfferWithBookRequest } from '@/types/entities/OfferWithBook.d.ts';
import type { OfferFormData } from '../types';

export const createInitialFormData = (): OfferFormData => ({
  title: '',
  author: '',
  condition: 'NEW' as BookCondition,
  dealType: 'SELL' as OfferType,
  price: '',
  description: '',
  photos: [],
  genres: [],
});

export const useOfferForm = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const {
    data: offer,
    isLoading,
    error,
  } = useGetOfferWithBookByIdQuery(offerId || '', { skip: !offerId });

  const mode: 'edit' | 'create' = offerId ? 'edit' : 'create';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addOfferWithBook, { isLoading: isCreatingOffer }] =
    useAddOfferWithBookMutation();
  const [updateOfferById, { isLoading: isUpdatingOffer }] =
    useUpdateOfferByIdMutation();
  const [updateBookById] = useUpdateBookByIdMutation();
  const [uploadImage] = useUploadImageMutation();
  const [deleteImageById] = useDeleteImageByIdMutation();

  const user = useSelector((state: RootState) => state.auth.user);
  const isSubmitting = isCreatingOffer || isUpdatingOffer;

  const [formData, setFormData] = useState<OfferFormData>(
    createInitialFormData()
  );
  const [existingImages, setExistingImages] = useState<BookImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (offerId && offer) {
      setFormData({
        title: offer.book.title,
        author: offer.book.authors[0] || '',
        condition: offer.book.condition,
        dealType: offer.type,
        price: offer.price.toString(),
        description: offer.book.description,
        photos: [],
        genres: offer.book.genres,
      });
      setExistingImages(offer.book.images || []);
      setRemovedImageIds([]);
    } else if (!offerId) {
      setFormData(createInitialFormData());
      setExistingImages([]);
      setRemovedImageIds([]);
    }
  }, [offer, offerId]);

  const handleInputChange = useCallback(
    <K extends keyof OfferFormData>(field: K, value: OfferFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handlePhotosChange = useCallback((photos: File[]) => {
    setFormData((prev) => ({ ...prev, photos }));
  }, []);

  const handleExistingImagesChange = useCallback((images: BookImage[]) => {
    setExistingImages((prevImages) => {
      const removedIds = prevImages
        .filter(
          (image) => !images.some((nextImage) => nextImage.id === image.id)
        )
        .map((image) => image.id);

      setRemovedImageIds((prevRemoved) => {
        const merged = [...prevRemoved];
        removedIds.forEach((id) => {
          if (!merged.includes(id)) {
            merged.push(id);
          }
        });
        return merged;
      });

      return images;
    });
  }, []);

  const uploadBookImages = async (photos: File[], bookId: string) => {
    const results = await Promise.allSettled(
      photos.map((photo) =>
        uploadImage({
          file: photo,
          entityType: 'BOOK',
          entityId: bookId,
        }).unwrap()
      )
    );
    return results;
  };

  const removeBookImages = async (imageIds: string[]) => {
    await Promise.allSettled(
      imageIds.map((id) => deleteImageById(id).unwrap())
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.author || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (offerId && offer) {
        // Edit Mode
        await updateOfferById({
          id: offer.id,
          offer: {
            type: formData.dealType,
            status: offer.status,
            description: formData.description,
            price: parseFloat(formData.price),
            previewImage: formData.photos[0] || null,
            bookId: offer.book.id,
            sellerId: user.id,
          },
        }).unwrap();

        await updateBookById({
          id: offer.book.id,
          book: {
            title: formData.title,
            yearOfRelease: offer.book.yearOfRelease || new Date().getFullYear(),
            description: formData.description,
            isbn: offer.book.isbn || '',
            condition: formData.condition,
            authors: [formData.author],
            genres: formData.genres,
            images: [],
          },
        }).unwrap();

        await removeBookImages(removedImageIds);

        if (formData.photos.length > 0) {
          const uploadResults = await uploadBookImages(
            formData.photos,
            offer.book.id
          );

          const failedImages = uploadResults.filter(
            (result) => result.status === 'rejected'
          ).length;

          if (failedImages > 0) {
            toast.error(
              `Offer updated but ${failedImages} image(s) failed to upload`
            );
          } else {
            toast.success('Offer updated with images!');
          }
        } else {
          toast.success('Offer updated!');
        }

        dispatch(
          OffersApi.util.invalidateTags([
            { type: 'Offer', id: offer.id },
            { type: 'Offer', id: 'LIST' },
          ])
        );

        navigate(`/offers/${offer.id}`);
        return;
      }

      // Create Mode
      const offerWithBookRequest: OfferWithBookRequest = {
        type: formData.dealType,
        status: 'OPEN' as OfferStatus,
        description: formData.description,
        price: parseFloat(formData.price),
        previewImage: formData.photos[0] || null,
        book: {
          title: formData.title,
          yearOfRelease: new Date().getFullYear(),
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
        const uploadResults = await uploadBookImages(
          formData.photos,
          result.book.id
        );

        const failedImages = uploadResults.filter(
          (result) => result.status === 'rejected'
        ).length;

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

      dispatch(
        OffersApi.util.invalidateTags([
          { type: 'Offer', id: result.id },
          { type: 'Offer', id: 'LIST' },
        ])
      );

      navigate(`/offers/${result.id}`);
    } catch (err) {
      console.error('Error saving offer:', err);
      toast.error(
        offerId
          ? 'Failed to update offer. Please try again.'
          : 'Failed to create offer. Please try again.'
      );
    }
  };

  return {
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
  };
};

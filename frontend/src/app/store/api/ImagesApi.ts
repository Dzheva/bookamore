import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface UploadImageRequest {
  file: File;
  entityType: 'BOOK' | 'OFFER';
  entityId: number | string;
  description?: string;
}

export interface ImageResponse {
  id: number;
  url: string;
  description?: string;
}

export const ImagesApi = createApi({
  reducerPath: 'imagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/images`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    uploadImage: build.mutation<ImageResponse, UploadImageRequest>({
      query: (request) => {
        const formData = new FormData();
        formData.append('file', request.file);
        formData.append('entityType', request.entityType);
        formData.append('entityId', String(request.entityId));

        if (request.description) {
          formData.append('description', request.description);
        }

        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
    deleteImageById: build.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useUploadImageMutation, useDeleteImageByIdMutation } = ImagesApi;

type RawImage = { id: string; path: string };

export const extractImagePaths = (images: RawImage[] | undefined): string[] =>
  images?.map((image) => image.path) ?? [];

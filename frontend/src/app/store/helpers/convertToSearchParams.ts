export function convertObjectToSearchParams<T extends object>(
  params: T
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'number') {
        value = value.toString();
      }
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

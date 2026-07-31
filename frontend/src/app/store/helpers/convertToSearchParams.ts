export function convertObjectToSearchParams<T extends object>(
  params: T
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            searchParams.append(key, String(item));
          }
        });
      } else {
        if (typeof value === 'number') {
          value = value.toString();
        }
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

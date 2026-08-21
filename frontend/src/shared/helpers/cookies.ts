/**
 * Sets a cookie in the browser.
 * @param name Cookie name
 * @param value Cookie value
 * @param days Expiration in days (default 7 days)
 */
export const setCookie = (name: string, value: string, days = 7): void => {
  try {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (error) {
    console.error('Failed to set cookie:', error);
  }
};

/**
 * Gets a cookie value by name.
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  try {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Removes a cookie by name.
 * @param name Cookie name
 */
export const removeCookie = (name: string): void => {
  try {
    document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
  } catch (error) {
    console.error('Failed to remove cookie:', error);
  }
};

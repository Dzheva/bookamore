const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validators = {
  email: (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  },

  password: (password: string): boolean => {
    return password.length >= 6;
  },

  name: (name: string): boolean => {
    const trimmedName = name.trim();
    return trimmedName.length >= 2;
  },

  passwordsMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  },
};

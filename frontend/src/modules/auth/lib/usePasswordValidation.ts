export const usePasswordValidation = (password: string) => {
  const validations = {
    isLongEnough: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
  };

  const isPasswordValid = Object.values(validations).every(Boolean);

  return { ...validations, isPasswordValid };
};
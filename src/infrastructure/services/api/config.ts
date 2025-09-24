// src/infrastructure/services/api/config.ts
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL;
};

export const getSecretKey = (): string => {
  return import.meta.env.VITE_SECRET_KEY;
};
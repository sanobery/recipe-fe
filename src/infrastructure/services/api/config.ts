// src/infrastructure/services/api/config.ts
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL;
};

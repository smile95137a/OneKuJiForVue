// src/config/appEnv.ts
export const AppEnv = {
  PAYMENT_GATEWAY_URL: import.meta.env.VITE_PAYMENT_GATEWAY_URL || '',
  PAYMENT_CUSTOMER_ID: import.meta.env.VITE_PAYMENT_CUSTOMER_ID || '',
  AFTEE_API_URL: import.meta.env.VITE_AFTEE_API_URL || '',
  AFTEE_PUB_KEY: import.meta.env.VITE_AFTEE_PUB_KEY || '',
  AFTEE_SECRET_KEY: import.meta.env.VITE_AFTEE_SECRET_KEY || '',
};

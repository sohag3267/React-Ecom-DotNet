export const API_CONFIG = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  API_BASE_URL: process.env.API_BASE_URL || "/api",
  API_BASE_URL_V1: process.env.API_BASE_URL_V1 || "/api/v1",
  NODE_ENV: process.env.NODE_ENV || "development",
};

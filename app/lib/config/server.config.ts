import { API_CONFIG } from "./api.config";

type CookieConfig = {
  path?: string;
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  priority?: "low" | "medium" | "high";
  maxAge?: number;
};

export const getCookieConfig = (
  config?: Partial<CookieConfig>
): CookieConfig => {
  const isProduction = API_CONFIG.SITE_URL === "production";

  return {
    path: "/",
    // Only set domain in production, omit in development
    ...(isProduction && API_CONFIG.SITE_URL
      ? {
          domain: new URL(API_CONFIG.SITE_URL).hostname.replace(/^www\./, ""),
        }
      : {}),
    // Enable secure cookies in production
    secure: isProduction,
    // Use 'lax' for better compatibility with redirects
    sameSite: "lax" as const,
    ...config,
  };
};

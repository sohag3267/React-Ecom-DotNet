import { atomWithStorage } from "jotai/utils";

export type CookieCategory =
  | "necessary"
  | "functional"
  | "analytics"
  | "marketing";

export interface CookiePreferences {
  necessary: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  consentGiven: boolean;
  consentDate?: string;
}

export const defaultCookiePreferences: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  consentGiven: false,
};

// Cookie consent atom with localStorage persistence
export const cookieConsentAtom = atomWithStorage<CookiePreferences>(
  "debuggermind-cookie-consent",
  defaultCookiePreferences,
  {
    getItem: (key: string, initialValue: CookiePreferences) => {
      if (typeof window === "undefined") return initialValue;
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : initialValue;
      } catch {
        return initialValue;
      }
    },
    setItem: (key: string, value: CookiePreferences) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Ignore localStorage errors
      }
    },
    removeItem: (key: string) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore localStorage errors
      }
    },
  },
  { getOnInit: true }
);

"use client";

import { useAtomValue } from "jotai";
import { cookieConsentAtom, CookieCategory } from "@/store/cookie-consent.atom";

/**
 * Hook to check if a specific cookie category is enabled
 * Use this before initializing analytics, marketing, or other cookie-dependent features
 * 
 * @example
 * const { canUseAnalytics, canUseMarketing } = useCookieConsent();
 * 
 * useEffect(() => {
 *   if (canUseAnalytics) {
 *     // Initialize Google Analytics
 *   }
 * }, [canUseAnalytics]);
 */
export function useCookieConsent() {
  const cookieConsent = useAtomValue(cookieConsentAtom);

  return {
    preferences: cookieConsent,
    consentGiven: cookieConsent.consentGiven,
    canUseNecessary: cookieConsent.necessary, // Always true
    canUseFunctional: cookieConsent.functional,
    canUseAnalytics: cookieConsent.analytics,
    canUseMarketing: cookieConsent.marketing,
    hasConsent: (category: CookieCategory) => cookieConsent[category],
  };
}

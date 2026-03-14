"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// RTL languages
const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

export function RTLProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentLang = i18n.language;
    const isRTL = RTL_LANGUAGES.includes(currentLang);

    // Update document direction
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;

    // Update body class for RTL-specific styles
    if (isRTL) {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [i18n.language]);

  return <>{children}</>;
}

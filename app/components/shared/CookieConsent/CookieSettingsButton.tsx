"use client";

import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { CookieIcon } from "lucide-react";
import { CookiePreferencesDialog } from "./CookiePreferencesDialog";
import { useTranslation } from "react-i18next";

/**
 * Floating button to reopen cookie preferences
 * Can be placed in footer or as a floating button
 */
export function CookieSettingsButton() {
  const { t } = useTranslation();
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPreferences(true)}
        className="gap-2"
      >
        <CookieIcon className="h-4 w-4" />
        {t("cookies.settings", "Cookie Settings")}
      </Button>

      <CookiePreferencesDialog
        open={showPreferences}
        onOpenChange={setShowPreferences}
      />
    </>
  );
}

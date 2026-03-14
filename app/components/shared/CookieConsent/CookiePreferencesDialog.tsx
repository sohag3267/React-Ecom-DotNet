"use client";

import { useAtom } from "jotai";
import { cookieConsentAtom, CookiePreferences } from "@/store/cookie-consent.atom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog";
import { Button } from "@/components/shared/ui/button";
import { Switch } from "@/components/shared/ui/switch";
import { Label } from "@/components/shared/ui/label";
import { useTranslation } from "react-i18next";
import { Shield, BarChart3, Target, Wrench } from "lucide-react";

interface CookiePreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export function CookiePreferencesDialog({
  open,
  onOpenChange,
  onSave,
}: CookiePreferencesDialogProps) {
  const { t } = useTranslation();
  const [cookieConsent, setCookieConsent] = useAtom(cookieConsentAtom);

  const handleToggle = (category: keyof Omit<CookiePreferences, "consentGiven" | "consentDate">) => {
    if (category === "necessary") return; // Cannot disable necessary cookies

    setCookieConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    setCookieConsent((prev) => ({
      ...prev,
      consentGiven: true,
      consentDate: new Date().toISOString(),
    }));
    onSave?.();
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    setCookieConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      consentGiven: true,
      consentDate: new Date().toISOString(),
    });
    onSave?.();
    onOpenChange(false);
  };

  const cookieCategories = [
    {
      id: "necessary" as const,
      icon: Shield,
      title: t("cookies.necessary.title", "Necessary Cookies"),
      description: t(
        "cookies.necessary.description",
        "These cookies are essential for the website to function properly. They enable basic features like page navigation, shopping cart, and secure access to your account."
      ),
      required: true,
    },
    {
      id: "functional" as const,
      icon: Wrench,
      title: t("cookies.functional.title", "Functional Cookies"),
      description: t(
        "cookies.functional.description",
        "These cookies enable enhanced functionality and personalization, such as remembering your preferences, language selection, and region."
      ),
      required: false,
    },
    {
      id: "analytics" as const,
      icon: BarChart3,
      title: t("cookies.analytics.title", "Analytics Cookies"),
      description: t(
        "cookies.analytics.description",
        "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services."
      ),
      required: false,
    },
    {
      id: "marketing" as const,
      icon: Target,
      title: t("cookies.marketing.title", "Marketing Cookies"),
      description: t(
        "cookies.marketing.description",
        "These cookies are used to track visitors across websites to display relevant advertisements and encourage you to buy products. They may be set by us or third-party advertisers."
      ),
      required: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("cookies.preferences.title", "Cookie Preferences")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "cookies.preferences.description",
              "Manage your cookie settings. You can enable or disable different types of cookies below. Note that blocking some types of cookies may impact your experience on our website."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {cookieCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={category.id}
                      className="text-base font-semibold cursor-pointer"
                    >
                      {category.title}
                    </Label>
                    <Switch
                      id={category.id}
                      checked={cookieConsent[category.id]}
                      onCheckedChange={() => handleToggle(category.id)}
                      disabled={category.required}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  {category.required && (
                    <p className="text-xs text-muted-foreground italic">
                      {t("cookies.alwaysActive", "Always Active")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button variant="secondary" onClick={handleAcceptAll}>
            {t("cookies.acceptAll", "Accept All")}
          </Button>
          <Button onClick={handleSave}>
            {t("cookies.savePreferences", "Save Preferences")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

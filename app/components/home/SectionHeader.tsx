"use client";

import { useTranslation } from "react-i18next";

interface SectionHeaderProps {
  titleKey: string;
  descriptionKey: string;
}

export function SectionHeader({
  titleKey,
  descriptionKey,
}: SectionHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl lg:text-4xl font-bold mb-4">
        {t(titleKey)}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t(descriptionKey)}
      </p>
    </div>
  );
}

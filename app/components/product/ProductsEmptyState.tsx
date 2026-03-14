"use client";

import { useTranslation } from "react-i18next";

export function ProductsEmptyState() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">
        {t("products.noProductsFound")}
      </p>
    </div>
  );
}

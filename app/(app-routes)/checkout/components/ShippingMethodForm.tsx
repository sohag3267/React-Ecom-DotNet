"use client";

import type { ShippingMethod } from "@/(app-routes)/checkout/model";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { Label } from "@/components/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/shared/ui/radio-group";
import { Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ShippingMethodFormProps {
  shippingMethod: ShippingMethod;
  onShippingMethodChange: (method: ShippingMethod) => void;
}

export function ShippingMethodForm({
  shippingMethod,
  onShippingMethodChange,
}: ShippingMethodFormProps) {
  const { t } = useTranslation();

  const shippingOptions = [
    {
      value: "standard",
      label: t("checkout.shippingMethodStandard") || "Standard Shipping",
      description: t("checkout.shippingMethodStandardDesc") || "3-7 business days",
      days: 5,
    },
    {
      value: "express",
      label: t("checkout.shippingMethodExpress") || "Express Shipping",
      description: t("checkout.shippingMethodExpressDesc") || "2-3 business days",
      days: 2,
    },
    {
      value: "overnight",
      label: t("checkout.shippingMethodOvernight") || "Overnight Shipping",
      description: t("checkout.shippingMethodOvernightDesc") || "Next business day",
      days: 1,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          {t("checkout.shippingMethod") || "Shipping Method"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={shippingMethod}
          onValueChange={(value: ShippingMethod) =>
            onShippingMethodChange(value)
          }
        >
          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-start space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={option.value}
                    className="font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

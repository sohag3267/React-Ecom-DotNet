"use client";

import { BusinessSettingsModel } from "./types/BusinessSettingModel";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface MaintenancePageContentProps {
  businessSettings: BusinessSettingsModel;
}

export const MaintenancePageContent = ({ businessSettings }: MaintenancePageContentProps) => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        {/* Main Container */}
        <div className="text-center space-y-8">
          {/* Header Logo/Site Name */}
          <div className="space-y-4">
            {businessSettings.header_logo ? (
              <Image
                src={businessSettings.header_logo}
                alt={businessSettings.site_name}
                width={64}
                height={64}
                className="h-16 mx-auto object-contain"
              />
            ) : null}
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {businessSettings.site_name}
            </h1>
          </div>

          {/* Maintenance Message */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 mx-auto">
              <svg
                className="w-10 h-10 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold text-white">
              {t("maintenance.title")}
            </h2>
            <p className="text-lg text-gray-300 max-w-md mx-auto">
              {t("maintenance.description")}
            </p>
            <p className="text-md text-gray-400">
              {t("maintenance.message")}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
            <h3 className="text-white font-semibold text-lg">
              {t("orderDetails.needHelp")}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              {businessSettings.contact_email && (
                <a
                  href={`mailto:${businessSettings.contact_email}`}
                  className="flex items-center justify-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors text-gray-200 hover:text-white"
                >
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">{businessSettings.contact_email}</span>
                </a>
              )}

              {/* Phone */}
              {businessSettings.contact_phone && (
                <a
                  href={`tel:${businessSettings.contact_phone}`}
                  className="flex items-center justify-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors text-gray-200 hover:text-white"
                >
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="text-sm">{businessSettings.contact_phone}</span>
                </a>
              )}

              {/* Support Time */}
              {businessSettings.support_time && (
                <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-slate-700/50 text-gray-200">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">{businessSettings.support_time}</span>
                </div>
              )}

              {/* Address */}
              {businessSettings.address && (
                <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-slate-700/50 text-gray-200">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span className="text-sm">{businessSettings.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm text-yellow-200">
                {t("maintenance.estimatedTime")}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-slate-700/50 space-y-2">
            <p className="text-sm text-gray-400">
              {businessSettings.site_name}{" "}
              <span className="text-primary">©</span> {currentYear}
            </p>
            {businessSettings.copyright_text && (
              <p className="text-xs text-gray-500">
                {businessSettings.copyright_text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

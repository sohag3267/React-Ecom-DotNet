import { useTransition } from "react";
import { toast } from "@/components/shared/ui/sonner";
import { useTranslation } from "react-i18next";

interface FileValidationOptions {
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

/**
 * Custom hook for handling file uploads with validation
 * Provides reusable file handling, validation, and error management
 */
export const useFileUpload = (
  onFileSelected: (file: File) => Promise<void>,
  options: FileValidationOptions = {}
) => {
  const { t } = useTranslation();
  const [loading, startTransition] = useTransition();

  const maxSizeMB = options.maxSizeMB || 5;
  const acceptedTypes = options.acceptedTypes || ["image/"];

  /**
   * Validates file before upload
   */
  const validateFile = (file: File): boolean => {
    // Check file type
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/")) {
        return file.type.startsWith(type);
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast.error(
        t("file.selectValidFile") || "Please select a valid file"
      );
      return false;
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(
        t("file.sizeLimitExceeded", { max: maxSizeMB }) ||
        `File size should be less than ${maxSizeMB}MB`
      );
      return false;
    }

    return true;
  };

  /**
   * Handles file selection and upload
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    startTransition(async () => {
      await onFileSelected(file);
    });
  };

  return {
    loading,
    handleFileChange,
    validateFile,
  };
};

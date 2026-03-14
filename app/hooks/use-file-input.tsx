import { useRef } from "react";

/**
 * Custom hook for managing file input references
 * Provides a reusable way to handle file input clicks and selections
 */
export const useFileInput = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Trigger the hidden file input click
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    triggerFileInput,
  };
};

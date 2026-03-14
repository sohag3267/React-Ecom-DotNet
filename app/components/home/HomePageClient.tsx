"use client";

import { useEffect } from "react";

export const HomePageClient = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Handle hash navigation when coming from other pages
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  return <>{children}</>;
};

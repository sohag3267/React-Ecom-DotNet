"use client";

import React, { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  className?: string;
  targetId: string;
} & PropsWithChildren;

export default function DynamicPortal({
  className,
  targetId: childId,
  children,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === "undefined") return null;

  const container = document.getElementById(childId);
  if (className && container) {
    container.classList.add(...className.split(" "));
  }

  if (!container) {
    return null;
  }

  return <>{container ? createPortal(children, container) : null}</>;
}

"use client";

import { ChatButton } from "./ChatButton";
import { ChatPopup } from "./ChatPopup";

/**
 * Chat feature wrapper component
 * Combines button and popup in one component for cleaner integration
 */
export function ChatWidget() {
  return (
    <>
      <ChatButton />
      <ChatPopup />
    </>
  );
}

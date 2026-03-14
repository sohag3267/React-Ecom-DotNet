import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ChatMessage } from "@/lib/chat/model";

/**
 * Chat messages stored in localStorage with persistence
 */
export const chatMessagesAtom = atomWithStorage<ChatMessage[]>(
  "chat-messages",
  []
);

/**
 * Chat popup open/close state
 */
export const chatOpenAtom = atom<boolean>(false);

/**
 * Chat loading state (when waiting for AI response)
 */
export const chatLoadingAtom = atom<boolean>(false);

/**
 * Chat API request interface
 */
export interface ChatRequest {
  question: string;
}

/**
 * Chat API response interface
 */
export interface ChatResponse {
  Answer: string;
}

/**
 * Chat message interface for UI
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/**
 * Chat state interface
 */
export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
}

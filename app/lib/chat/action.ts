"use server";

import { ApiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/api-route";
import { ChatRequest, ChatResponse } from "./model";

/**
 * Send a question to the AI assistant
 * @param question - The user's question
 * @returns The AI assistant's answer
 */
export async function askQuestion(question: string): Promise<ChatResponse> {
  try {
    const response = await new ApiClient(API_ROUTES.CHAT.ASK)
      .withMethod("POST")
      .withBody<ChatRequest>({ question })
      .execute<ChatResponse>();

    // The API returns { Answer: string } directly
    if (!response || !response.Answer) {
      throw new Error("Invalid response from AI service");
    }

    return response;
  } catch (error) {
    console.error("Error asking question:", error);

    // Return a friendly error message instead of throwing
    return {
      Answer:
        "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment. If the problem persists, you can contact our support team for assistance.",
    };
  }
}

"use server";

import { ApiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/api-route";
import type { SubscribeNewsletterResponse } from "@/lib/models/newsletter.model";

export async function subscribeNewsletter(email: string) {
  try {
    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        data: null,
      };
    }

    const response = await ApiClient.create(API_ROUTES.NEWSLETTER.SUBSCRIBE)
      .withMethod("POST")
      .withBody({ email })
      .execute<SubscribeNewsletterResponse>();

    return response;
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "An error occurred while subscribing. Please try again.",
      data: null,
    };
  }
}

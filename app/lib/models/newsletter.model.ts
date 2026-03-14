import { z } from "zod";

export const SubscribeNewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SubscribeNewsletterRequest = z.infer<
  typeof SubscribeNewsletterSchema
>;

export interface SubscribeNewsletterResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

import { z } from "zod";

export const RegisterUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  password: z.string().min(6).max(20),
  password_confirmation: z.string().min(6).max(20),
});

export type RegisterUserModel = z.infer<typeof RegisterUserSchema>;

export type UserMiniProfileModel = {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  email_verified_at?: string;
  phone?: string;
  user_type?: string;
  is_banned?: string;
  status?: string;
};

export type UserResponseModel = {
  expires_in?: number;
  token?: string;
  token_type?: string;
  user?: UserMiniProfileModel;
};

export type AuthUserResponseModel = {
  message?: string;
  success?: boolean;
  data?: UserResponseModel;
};

export type LoginCredentialsModel = {
  email?: string;
  phone?: string;
  password: string;
  rememberMe?: boolean;
};

"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME } from "@/lib/config/auth.config";

/**
 * Handle authentication errors from API responses
 * Clears auth cookie and redirects to login if needed
 */
export async function handleAuthError(
	error: { needsLogin?: boolean; message?: string },
	currentPath?: string
): Promise<never> {
	if (error.needsLogin) {
		// Clear the auth cookie
		const cookieStore = await cookies();
		cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);

		// Redirect to login with return URL
		const loginUrl = currentPath
			? `/login?redirect=${encodeURIComponent(currentPath)}`
			: "/login";

		redirect(loginUrl);
	}

	// If not an auth error, throw the error
	throw new Error(error.message || "Unknown error");
}

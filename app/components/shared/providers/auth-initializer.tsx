"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { miniProfileAtom } from "@/store/mini-profile.atom";
import { getUserProfile } from "@/(app-routes)/profile/actions";
import { useAuthErrorHandler } from "@/lib/utils/client-auth-handler";

export function AuthInitializer() {
	const setMiniProfile = useSetAtom(miniProfileAtom);
	const { handleAuthError } = useAuthErrorHandler();

	useEffect(() => {
		// Initialize user profile from server
		const initializeAuth = async () => {
			try {
				const response = await getUserProfile();

				// Handle auth errors (token expired/refresh failed)
				if (
					!response.success &&
					"needsLogin" in response &&
					response.needsLogin
				) {
					handleAuthError(
						response as { needsLogin: boolean; message?: string }
					);
					return;
				}

				if (response.success && response.data) {
					setMiniProfile({
						id: response.data.id?.toString(),
						name: response.data.name,
						email: response.data.email,
						avatar: response.data.avatar,
						phone: response.data.phone,
					});
				} else {
					// User is not authenticated
					setMiniProfile(null);
					if (typeof window !== "undefined") {
						localStorage.removeItem("mini-profile");
					}
				}
			} catch (error) {
				// Silent fail - user is not authenticated
				console.error("Auth initialization failed:", error);
				setMiniProfile(null);
				if (typeof window !== "undefined") {
					localStorage.removeItem("mini-profile");
				}
			}
		};

		initializeAuth();
	}, [setMiniProfile, handleAuthError]);

	return null; // This component doesn't render anything
}

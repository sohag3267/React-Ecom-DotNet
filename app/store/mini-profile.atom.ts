import { UserMiniProfileModel } from "@/(app-routes)/(auth)/model";
import { atomWithStorage } from "jotai/utils";

// Use atomWithStorage to persist state across route changes
export const miniProfileAtom = atomWithStorage<UserMiniProfileModel | null>(
	"mini-profile",
	null,
	undefined,
	{ getOnInit: true }
);

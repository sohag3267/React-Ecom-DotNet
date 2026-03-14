import { UserMiniProfileModel } from "../(auth)/model";

export type UserProfileModel = {
	success?: boolean;
	message?: string;
	data: UserMiniProfileModel;
	error?: Error | null;
};

export type UserProfileTabModel = {
	tabTriggerId: string;
	tabTitle: string;
	tabContent: React.ReactNode;
	onClick?: () => void;
};

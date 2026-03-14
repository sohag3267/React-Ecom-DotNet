import DynamicPortal from "@/components/shared/DynamicPortal";
import { Button } from "@/components/shared/ui/button";
import { Edit2Icon } from "lucide-react";
import { useState } from "react";
import { UserMiniProfileModel } from "../../(auth)/model";
import PersonalInfo from "./personal-info";
import RecentOrders from "./recent-orders";
import { OrderResponseModel } from "../orders/model";
import { useTranslation } from "react-i18next";

type Props = {
	model: UserMiniProfileModel;
	orderHistoryResponse: OrderResponseModel;
};

export default function ProfileOverView({
	model,
	orderHistoryResponse,
}: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const { t } = useTranslation();

	const handleEditComplete = () => {
		setIsEditing(false);
	};

	return (
		<>
			<DynamicPortal targetId="update-profile-button">
				<Button
					variant="outline"
					onClick={() => setIsEditing(!isEditing)}
					className="flex items-center gap-2"
				>
					<Edit2Icon className="w-4 h-4" />
					{isEditing ? t("profile.cancel") || "Cancel" : t("profile.editProfileButton") || "Edit Profile"}
				</Button>
			</DynamicPortal>
			<div className="grid gap-6 md:grid-cols-2">
				<PersonalInfo
					model={model}
					isEditing={isEditing}
					onEditComplete={handleEditComplete}
				/>
				<RecentOrders orderHistoryResponse={orderHistoryResponse} />
			</div>
		</>
	);
}

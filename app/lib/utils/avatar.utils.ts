import { toast } from "@/components/shared/ui/sonner";
import { updateAvatar as updateAvatarAction } from "@/(app-routes)/profile/actions";
import { TFunction } from "i18next";

/**
 * Handle avatar upload with error handling and notifications
 */
export const handleAvatarUpload = async (file: File, t: TFunction) => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await updateAvatarAction(formData);

    if (response.success) {
      toast.success(
        t("profile.avatarUpdated") || "Avatar updated successfully"
      );
      return true;
    } else {
      toast.error(
        response.message ||
          t("profile.avatarUpdateFailed") ||
          "Failed to update avatar"
      );
      return false;
    }
  } catch {
    toast.error(t("profile.avatarUpdateFailed") || "Failed to update avatar");
    return false;
  }
};

/**
 * Get avatar initials from name
 */
export const getAvatarInitials = (name?: string): string => {
  return name?.charAt(0).toUpperCase() || "U";
};

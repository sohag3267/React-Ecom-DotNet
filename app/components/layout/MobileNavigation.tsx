import { getAllCategories } from "@/components/shared/actions/categories";
import { MobileNavigationClient } from "./MobileNavigationClient";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation = async ({ isOpen, onClose }: MobileNavigationProps) => {
  if (!isOpen) return null;

  const response = await getAllCategories();

  if (!response.success || !response.data.categories) {
    return null;
  }

  // Only get parent categories (those with parent_id === null)
  const parentCategories = response.data.categories.filter(
    (cat) => cat.parent_id === null
  );

  if (parentCategories.length === 0) {
    return null;
  }

  return (
    <div className="lg:hidden border-t bg-background/95 backdrop-blur">
      <MobileNavigationClient categories={parentCategories} onClose={onClose} />
    </div>
  );
};


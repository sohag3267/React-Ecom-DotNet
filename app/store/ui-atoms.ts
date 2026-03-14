import { Category } from "@/components/shared/models/category";
import { BusinessSettingsModel } from "@/components/shared/types/BusinessSettingModel";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const businessSettingsAtom =
  atomWithStorage<BusinessSettingsModel | null>(
    "business-settings",
    null,
    undefined,
    { getOnInit: true }
  );

export const categoryAtom = atomWithStorage<Category[]>(
  "categories",
  [],
  undefined,
  { getOnInit: true }
);

// Filter drawer state for mobile
export const filterDrawerOpenAtom = atom(false);

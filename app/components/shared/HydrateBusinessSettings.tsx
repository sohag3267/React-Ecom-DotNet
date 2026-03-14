"use client";

import { businessSettingsAtom } from "@/store/ui-atoms";
import { BusinessSettingsModel } from "./types/BusinessSettingModel";
import { useHydrateAtoms } from "jotai/utils";

type Props = {
	businessSettings?: BusinessSettingsModel;
};

export const HydrateBusinessSettings = ({ businessSettings }: Props) => {
	useHydrateAtoms([[businessSettingsAtom, businessSettings ?? null]]);
	return null;
};

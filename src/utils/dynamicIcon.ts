import { setAppIcon } from "@howincodes/expo-dynamic-app-icon";

const ACCENT_TO_ICON: Record<string, string> = {
  "#ED225D": "icon-ed225d",
  "#9C27B0": "icon-9c27b0",
  "#2196F3": "icon-2196f3",
  "#009688": "icon-009688",
  "#FF9800": "icon-ff9800",
  "#3F51B5": "icon-3f51b5",
  "#00BCD4": "icon-00bcd4",
  "#FF5722": "icon-ff5722",
  "#4CAF50": "icon-4caf50",
  "#E91E63": "icon-e91e63",
};

export async function applyAccentIcon(ctaColor: string): Promise<void> {
  const iconName = ACCENT_TO_ICON[ctaColor.toUpperCase()];
  if (iconName) {
    try {
      await setAppIcon(iconName);
    } catch {}
  }
}

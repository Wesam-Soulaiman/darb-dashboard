import type { SvgIconComponent } from "@mui/icons-material";

export type MenuItemType = "group" | "item" | "collapse";

export type AppMenuItem = {
  id?: string;
  title: string;
  type: MenuItemType;
  path?: string;
  icon?: SvgIconComponent;
  external?: boolean;
  target?: "_blank" | "_self";
  permission?: string;
  children?: AppMenuItem[];
};

import { Box, Typography } from "@mui/material";

import type { AppMenuItem } from "../../menu-items/menu.types";
import CollapseItem from "./CollapseItem";
import NavGroup from "./NavGroup";
import NavItem from "./NavItem";

type NavItemsRendererProps = {
  items: AppMenuItem[];
  forceOpen?: boolean;
};

export default function NavItemsRenderer({
  items,
  forceOpen = false,
}: NavItemsRendererProps) {
  return (
    <Box>
      {items.map((item) => {
        switch (item.type) {
          case "group":
            return (
              <NavGroup
                key={item.title}
                item={item}
                forceOpen={forceOpen}
              />
            );

          case "item":
            return (
              <NavItem
                key={item.id || item.path || item.title}
                item={item}
                forceOpen={forceOpen}
              />
            );

          case "collapse":
            return (
              <CollapseItem
                key={item.id || item.title}
                item={item}
                forceOpen={forceOpen}
              />
            );

          default:
            return (
              <Typography key={item.title} color="error">
                Invalid menu item type
              </Typography>
            );
        }
      })}
    </Box>
  );
}
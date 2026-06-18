import {
  alpha,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { createElement } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation } from "react-router-dom";

import type { AppMenuItem } from "../../menu-items/menu.types";
import { useSidebarStore } from "../../store/sidebarStore";

type NavItemProps = {
  item: AppMenuItem;
  level?: number;
  forceOpen?: boolean;
};

export default function NavItem({ item, level = 0, forceOpen = false }: NavItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();

  const desktopOpen = useSidebarStore((state) => state.desktopOpen);
  const setSelected = useSidebarStore((state) => state.setSelected);

  const isOpen = forceOpen || desktopOpen;
  const isSelected = Boolean(item.path && pathname === item.path);
  const Icon = item.icon;

  const button = (
    <ListItemButton
      component={RouterLink}
      to={item.path || "#"}
      target={item.target || "_self"}
      selected={isSelected}
      onClick={() => setSelected(item.id)}
      sx={(theme) => ({
        minHeight: 46,
        my: 0.35,
        px: isOpen ? 1.5 : 1.25,
        mx: 0.25,
        borderRadius: 3,
        justifyContent: isOpen ? "flex-start" : "center",
        color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
        backgroundColor: isSelected
          ? alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.1)
          : "transparent",
        "&:hover": {
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
        "&.Mui-selected": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === "dark" ? 0.18 : 0.1,
          ),
        },
        "&.Mui-selected:hover": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === "dark" ? 0.24 : 0.14,
          ),
        },
      })}
    >
      {Icon ? (
        <ListItemIcon
          sx={{
            minWidth: isOpen ? 38 : 0,
            color: "inherit",
            justifyContent: "center",
          }}
        >
          {createElement(Icon, { fontSize: "medium" })}
        </ListItemIcon>
      ) : null}

      {isOpen ? (
        <ListItemText
          primary={
            <Typography
              variant="body2"
              sx={{
                fontWeight: isSelected ? 900 : 700,
                ps: level > 0 ? 1 : 0,
              }}
            >
              {t(`sidebar.${item.title}`)}
            </Typography>
          }
        />
      ) : null}
    </ListItemButton>
  );

  if (!isOpen) {
    return (
      <Tooltip
        title={t(`sidebar.${item.title}`)}
        placement={theme.direction === "rtl" ? "left" : "right"}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
}

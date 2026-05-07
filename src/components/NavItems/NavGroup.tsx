import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { AppMenuItem } from "../../menu-items/menu.types";
import { useSidebarStore } from "../../store/sidebarStore";
import NavItemsRenderer from ".";

type NavGroupProps = {
  item: AppMenuItem;
  forceOpen?: boolean;
};

export default function NavGroup({ item, forceOpen = false }: NavGroupProps) {
  const { t } = useTranslation();

  const desktopOpen = useSidebarStore((state) => state.desktopOpen);
  const isOpen = forceOpen || desktopOpen;

  if (!item.children?.length) return null;

  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        title={t(`sidebar.${item.title}`)}
        sx={{
          display: "block",
          px: isOpen ? 1.5 : 0.5,
          py: isOpen ? 1.25 : 0.75,
          mx: isOpen ? 0 : 0.25,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: isOpen ? "0.08em" : "0.02em",
          fontSize: isOpen ? "1rem" : "0.6875rem",
          lineHeight: 1.2,
          textAlign: isOpen ? "start" : "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          opacity: isOpen ? 0.9 : 0.75,
          userSelect: "none",
        }}
      >
        {t(`sidebar.${item.title}`)}
      </Typography>

      <NavItemsRenderer items={item.children} forceOpen={forceOpen} />
    </Box>
  );
}
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import { appBarHeight } from "../../config/layout";
import { useSidebarStore } from "../../store/sidebarStore";
import Logo from "../Logo";

type SidebarHeaderProps = {
  forceOpen?: boolean;
};

const headerSx = {
  height: appBarHeight,
  minHeight: appBarHeight,
  maxHeight: appBarHeight,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid",
  borderBottomColor: "divider",
} as const;

export default function SidebarHeader({ forceOpen = false }: SidebarHeaderProps) {
  const { t } = useTranslation();

  const desktopOpen = useSidebarStore((state) => state.desktopOpen);
  const toggleDesktopSidebar = useSidebarStore((state) => state.toggleDesktopSidebar);

  const isOpen = forceOpen || desktopOpen;

  if (!isOpen) {
    return (
      <Box
        sx={{
          ...headerSx,
          justifyContent: "center",
          px: 1,
        }}
      >
        <Tooltip title={t("layout.expandSidebar")}>
          <Box
            onClick={toggleDesktopSidebar}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Logo collapsed />
          </Box>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...headerSx,
        justifyContent: "space-between",
        px: 2,
      }}
    >
      <Logo collapsed={false} />

      {!forceOpen ? (
        <Tooltip title={t("layout.collapseSidebar")}>
          <IconButton color="primary" onClick={toggleDesktopSidebar}>
            <MenuOpenRoundedIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  );
}

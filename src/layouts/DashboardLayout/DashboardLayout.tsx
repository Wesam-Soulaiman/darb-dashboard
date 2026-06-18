import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  alpha,
  Box,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import FullscreenButton from "../../components/FullscreenButton";
import LangSwitch from "../../components/LangSwitch";
import Logo from "../../components/Logo";
import ModeSwitch from "../../components/ModeSwitch";
import Sidebar from "../../components/Navigations/Sidebar";
import NotificationMenu from "../../components/NotificationMenu";
import ProfileSection from "../../components/ProfileSection";
import { appBarHeight } from "../../config/layout";
import type { AppMenuItem } from "../../menu-items/menu.types";
import { useSidebarStore } from "../../store/sidebarStore";

type DashboardLayoutProps = {
  children: ReactNode;
  sidebarItems?: AppMenuItem[];
};

export default function DashboardLayout({
  children,
  sidebarItems = [],
}: DashboardLayoutProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));

  const desktopOpen = useSidebarStore((state) => state.desktopOpen);
  const toggleDesktopSidebar = useSidebarStore((state) => state.toggleDesktopSidebar);
  const openMobileSidebar = useSidebarStore((state) => state.openMobileSidebar);

  const handleMenuClick = () => {
    if (matchDownLg) {
      openMobileSidebar();
      return;
    }

    toggleDesktopSidebar();
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar items={sidebarItems} />

      <Box
        sx={{
          minHeight: "100vh",
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="header"
          sx={(theme) => ({
            height: appBarHeight,
            position: "sticky",
            top: 0,
            zIndex: theme.zIndex.appBar,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 1.5, sm: 2.5, md: 3 },
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.default, 0.86)
                : alpha("#ffffff", 0.86),
            backdropFilter: "blur(14px)",
          })}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Tooltip
              title={
                matchDownLg
                  ? t("layout.openSidebar")
                  : desktopOpen
                    ? t("layout.collapseSidebar")
                    : t("layout.expandSidebar")
              }
            >
              <IconButton color="primary" onClick={handleMenuClick}>
                <MenuRoundedIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ display: { xs: "none", sm: "block", lg: "none" } }}>
              <Logo />
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: "center",
            }}
          >
            <NotificationMenu />
            <FullscreenButton />
            <ModeSwitch />
            <LangSwitch />
            <ProfileSection />
          </Stack>
        </Box>

        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            p: { xs: 2, sm: 2.5, md: 3 },
            minHeight: `calc(100vh - ${appBarHeight}px)`,
            backgroundColor: alpha(
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.common.black,
              0.025,
            ),
          })}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

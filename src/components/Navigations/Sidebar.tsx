import { Box, SwipeableDrawer, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { drawerWidth, miniDrawerWidth } from "../../config/layout";
import type { AppMenuItem } from "../../menu-items/menu.types";
import { useSidebarStore } from "../../store/sidebarStore";
import NavItemsRenderer from "../NavItems";
import SidebarHeader from "./SidebarHeader";

type SidebarProps = {
  items?: AppMenuItem[];
};

export default function Sidebar({ items = [] }: SidebarProps) {
  const theme = useTheme();
  const location = useLocation();
  const { i18n } = useTranslation();

  const desktopOpen = useSidebarStore((state) => state.desktopOpen);
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const closeMobileSidebar = useSidebarStore(
    (state) => state.closeMobileSidebar,
  );

  const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));

  const language = i18n.resolvedLanguage || i18n.language;
  const isRtl = language.startsWith("ar");
  const drawerAnchor = isRtl ? "right" : "left";
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname, closeMobileSidebar]);

  return (
    <>
      <Box
        component="nav"
        dir={direction}
        sx={(theme) => ({
          display: { xs: "none", lg: "flex" },
          flexShrink: 0,
          width: desktopOpen ? drawerWidth : miniDrawerWidth,
          minHeight: "100vh",
          overflowX: "hidden",
          backgroundColor: theme.palette.custom.sidebar,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: desktopOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        <Box
          sx={{
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <SidebarHeader />

          <Box
            sx={{
              px: desktopOpen ? 1.25 : 0.75,
              pb: 2,
              overflowX: "hidden",
            }}
          >
            <NavItemsRenderer items={items} />
          </Box>
        </Box>
      </Box>

      <SwipeableDrawer
        key={`mobile-${drawerAnchor}-${language}`}
        dir={direction}
        open={mobileOpen && matchDownLg}
        variant="temporary"
        onClose={closeMobileSidebar}
        onOpen={() => undefined}
        disableSwipeToOpen
        ModalProps={{
          keepMounted: true,
        }}
        slotProps={{
          paper: {
            sx: (theme) => ({
                  boxSizing: "border-box",
                borderRadius:0,
                width: drawerWidth,
              backgroundImage: "none",
              backgroundColor: theme.palette.custom.sidebar,
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: 0,
                height: 0,
              },
            }),
          },
        }}
        sx={{
          display: { lg: "none" },
        }}
      >
        <SidebarHeader forceOpen />

        <Box sx={{ px: 1.25, pb: 2 }}>
          <NavItemsRenderer items={items} forceOpen />
        </Box>
      </SwipeableDrawer>
    </>
  );
}
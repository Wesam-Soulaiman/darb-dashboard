import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { createElement } from "react";
import { useTranslation } from "react-i18next";

import type { AppMenuItem } from "../../menu-items/menu.types";
import { useSidebarStore } from "../../store/sidebarStore";
import NavItemsRenderer from ".";

type CollapseItemProps = {
  item: AppMenuItem;
  forceOpen?: boolean;
};

export default function CollapseItem({ item, forceOpen = false }: CollapseItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const desktopOpen = useSidebarStore((state) => state.desktopOpen);
  const isOpen = forceOpen || desktopOpen;

  if (!item.children?.length) return null;

  const Icon = item.icon;

  if (!isOpen) {
    return (
      <Box>
        <Tooltip
          title={t(`sidebar.${item.title}`)}
          placement={theme.direction === "rtl" ? "left" : "right"}
        >
          <ListItemButton
            sx={(theme) => ({
              minHeight: 46,
              my: 0.35,
              px: 1.25,
              mx: 0.25,
              borderRadius: 3,
              justifyContent: "center",
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            })}
          >
            {Icon ? (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color: "inherit",
                  justifyContent: "center",
                }}
              >
                {createElement(Icon, { fontSize: "large" })}
              </ListItemIcon>
            ) : null}
          </ListItemButton>
        </Tooltip>

        <Box sx={{ mt: 0.25 }}>
          <NavItemsRenderer items={item.children} forceOpen={false} />
        </Box>
      </Box>
    );
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        border: "none",
        backgroundImage: "none",
        boxShadow: "none",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRoundedIcon />}
        sx={(theme) => ({
          minHeight: 46,
          my: 0.35,
          mx: 0.25,
          px: 1.5,
          borderRadius: 3,
          color: theme.palette.text.secondary,
          "&:hover": {
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1.5,
            m: 0,
          },
        })}
      >
        {Icon ? (
          <ListItemIcon
            sx={{
              minWidth: 38,
              color: "inherit",
            }}
          >
            {createElement(Icon, { fontSize: "large" })}
          </ListItemIcon>
        ) : null}

        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {t(`sidebar.${item.title}`)}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0, ps: 1.5 }}>
        <NavItemsRenderer items={item.children} forceOpen={forceOpen} />
      </AccordionDetails>
    </Accordion>
  );
}

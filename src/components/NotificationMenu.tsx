import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getFullscreenContainer } from "../utils/getFullscreenContainer";
import { useNotification } from "../contexts/NotificationContext";

export default function NotificationMenu() {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAllAsRead, resetNotifications } =
    useNotification();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="default" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsRoundedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        container={getFullscreenContainer}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              maxWidth: "calc(100vw - 32px)",
              borderRadius: 2,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
            {t("notifications.title")}
          </Typography>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {t("notifications.empty")}
            </Typography>
          </MenuItem>
        ) : (
          notifications.slice(0, 8).map((notification) => (
            <MenuItem key={notification.id} sx={{ alignItems: "flex-start" }}>
              <Stack spacing={0.5} sx={{ py: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: notification.isRead ? 600 : 900,
                    whiteSpace: "normal",
                  }}
                >
                  {notification.title || t("notifications.newNotification")}
                </Typography>

                {notification.body ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: "normal" }}
                  >
                    {notification.body}
                  </Typography>
                ) : null}
              </Stack>
            </MenuItem>
          ))
        )}

        {notifications.length > 0 ? (
          <>
            <Divider />

            <Box sx={{ p: 1.5 }}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  onClick={() => {
                    markAllAsRead();
                    handleClose();
                  }}
                >
                  {t("notifications.markAllAsRead")}
                </Button>

                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    resetNotifications();
                    handleClose();
                  }}
                >
                  {t("notifications.clearAll")}
                </Button>
              </Stack>
            </Box>
          </>
        ) : null}
      </Menu>
    </>
  );
}

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getFullscreenContainer } from "../utils/getFullscreenContainer";
import { useAuthContext } from "../contexts/AuthContext";

export default function ProfileSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.phone ||
    t("common.user");

  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("") || "D";

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tooltip title={t("profile.account")}>
        <IconButton onClick={handleOpen}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 900,
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        container={getFullscreenContainer}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              width: 260,
              borderRadius: 2,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack spacing={0.25}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
              {fullName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {user?.isSuperAdmin ? t("profile.superAdmin") : user?.phone}
            </Typography>
          </Stack>
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            navigate("/admin/dashboard/profile");
          }}
        >
          <ListItemIcon>
            <AccountCircleRoundedIcon fontSize="small" />
          </ListItemIcon>
          {t("profile.my")}
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/admin/dashboard/profile");
          }}
        >
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          {t("profile.settings")}
        </MenuItem>

        <Divider />

        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">{t("profile.logout")}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import type { DialogProps, IconButtonProps } from "@mui/material";

import PopupButton from "../PopupButton";

type UpdatePopupActionProps = {
  title: string;
  tooltip: string;
  children: (args: { handleClose: () => void }) => React.ReactNode;
  icon?: React.ReactNode;
  color?: IconButtonProps["color"];
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
};

const UpdatePopupAction = ({
  title,
  tooltip,
  children,
  icon = <EditRoundedIcon />,
  color = "warning",
  maxWidth = "md",
  fullWidth = true,
}: UpdatePopupActionProps) => {
  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Tooltip title={tooltip}>
          <IconButton
            color={color}
            onClick={(event) => {
              event.currentTarget.blur();

              requestAnimationFrame(() => {
                handleOpen();
              });
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth={maxWidth} fullWidth={fullWidth}>
          <DialogTitle>{title}</DialogTitle>

          <DialogContent dividers>
            {children({
              handleClose,
            })}
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default UpdatePopupAction;
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import type { IconButtonProps } from "@mui/material";

import PopupButton from "../PopupButton";

type DeletePopupActionProps<T> = {
  item: T;
  title: string;
  description: string;
  tooltip: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
  color?: IconButtonProps["color"];
  onConfirm: (item: T) => Promise<void> | void;
};

const DeletePopupAction = <T,>({
  item,
  title,
  description,
  tooltip,
  confirmLabel,
  cancelLabel,
  loading = false,
  color = "error",
  onConfirm,
}: DeletePopupActionProps<T>) => {
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
            <DeleteSweepIcon />
          </IconButton>
        </Tooltip>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="xs" fullWidth>
          <DialogTitle>{title}</DialogTitle>

          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleClose}
              color="inherit"
              variant="outlined"
              disabled={loading}
            >
              {cancelLabel}
            </Button>

            <Button
              onClick={async () => {
                await onConfirm(item);
                handleClose();
              }}
              disabled={loading}
              color="error"
              variant="contained"
            >
              {confirmLabel}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    />
  );
};

export default DeletePopupAction;
import { Button, Slide } from "@mui/material";
import type { ButtonProps, DialogProps, SlideProps } from "@mui/material";
import { forwardRef, useState, type ReactNode } from "react";

const Transition = forwardRef<unknown, SlideProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type PopupDialogProps = DialogProps & {
  slots?: DialogProps["slots"];
  slotProps?: DialogProps["slotProps"];
};

type RenderArgs = {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  props: PopupDialogProps;
};

type PopupButtonProps = {
  title?: string;
  buttonProps?: ButtonProps;
  ButtonComponentRender?: (args: RenderArgs) => ReactNode;
  DialogRender: (args: RenderArgs) => ReactNode;
};

const PopupButton = ({
  title,
  buttonProps,
  ButtonComponentRender,
  DialogRender,
}: PopupButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dialogProps: PopupDialogProps = {
    open,
    onClose: handleClose,
    slots: {
      transition: Transition,
    },
    slotProps: {
      transition: {
        timeout: 300,
      },
    },
  };

  const args: RenderArgs = {
    open,
    handleOpen,
    handleClose,
    props: dialogProps,
  };

  return (
    <>
      {ButtonComponentRender ? (
        ButtonComponentRender(args)
      ) : (
        <Button variant="outlined" onClick={handleOpen} {...buttonProps}>
          {title}
        </Button>
      )}

      {DialogRender(args)}
    </>
  );
};

export default PopupButton;

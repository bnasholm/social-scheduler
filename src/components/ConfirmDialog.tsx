import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

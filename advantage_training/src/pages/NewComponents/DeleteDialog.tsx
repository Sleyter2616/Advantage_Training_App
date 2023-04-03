import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  name: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onClose,
  onDelete,
  name,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete {name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this {name}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;

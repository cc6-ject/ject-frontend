import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core';

const Description = ({ open, onClose }) => (
  <Dialog open={open} scroll="paper" fullWidth>
    <DialogTitle>Title</DialogTitle>
    <DialogContent>Some description.</DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default Description;

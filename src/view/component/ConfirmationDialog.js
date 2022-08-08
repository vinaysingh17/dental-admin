import React from "react";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Dialog,
} from "@material-ui/core";
import { getDialogState } from "../../application/reducers/uiSlice";
import { useSelector } from "react-redux";

export default function ConfirmationDialog() {
  const dialogState = useSelector(getDialogState);

  const handleClose = (accepted) => () => {
    if (accepted) dialogState.promise?.resolve();
    else dialogState.promise?.reject();
  };

  return (
    <Dialog
      open={dialogState.show}
      onClose={handleClose(false)}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {dialogState.display.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {dialogState.display.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose(false)} color="primary">
          Disagree
        </Button>
        <Button onClick={handleClose(true)} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

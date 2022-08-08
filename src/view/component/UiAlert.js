import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { actions, getAlertState } from "../../application/reducers/uiSlice";

export default function UiAlert() {
  const { show, type, message } = useSelector(getAlertState);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    // setOpen(false);
    dispatch(actions.hideAlert());
  };

  return (
    <Snackbar
      open={show}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert severity={type} variant="filled" onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

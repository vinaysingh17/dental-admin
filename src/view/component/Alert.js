import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

function UIAlert({ show = false, message = "dddd" }) {
  const [position, setPosition] = React.useState({
    open: show,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = position;
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setPosition({ ...position, open: false });
      return;
    }
    setPosition({ ...position, open: false });
  };

  return (
    <div>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
      </Alert>
      {/* <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={show}
        onClose={handleClose}
        message={message}
        // key={vertical + horizontal}
        // message={}
      /> */}
    </div>
  );
}

export default UIAlert;

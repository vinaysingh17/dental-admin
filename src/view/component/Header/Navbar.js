import { useState } from "react";
import { AppBar, makeStyles, Toolbar } from "@material-ui/core";
import { useSelector } from "react-redux";
import { getAuth } from "../../../application/reducers/authSlice";
import { Link } from "react-router-dom";
import ProfileButton from "../ProfileButton";
import {
  CircleNotifications,
  KeyboardArrowDown,
  Logout,
} from "@mui/icons-material";
import { Button, Menu, MenuItem, Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    columnGap: "2rem",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
  },
  logo: {
    width: "10rem",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    columnGap: "1rem",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  activeLink: {
    borderBottom: "2px solid white",
  },
}));

export default function Navbar() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      style={{
        boxShadow: "none",
        background: "white",
        borderBottom: "1px solid gray",
      }}
    >
      <Toolbar className={classes.root}>
        <div style={{ flexGrow: 1 }} />

        <CircleNotifications
          sx={{
            color: "#ffedef",
          }}
        />

        <ProfileButton />

        <Button
          id="profile-button"
          aria-controls="profile-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDown />}
          sx={{
            backgroundColor: "#ffffff",
            "&:hover": { backgroundColor: "#ffffff" },
            color: "#787878",
            height: "60%",
            borderLeft: "3px solid #f8f8f8",
            borderRadius: 0,
          }}
        >
          <Typography sx={{ fontStyle: "normal" }}>BOB CHAPARALA</Typography>
        </Button>
        <Menu
          id="profile-menu"
          MenuListProps={{
            "aria-labelledby": "profile-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleClose} disableRipple>
            <Logout />
            Edit
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popover,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, logout } from "../../application/reducers/authSlice";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { DENTAL_ADMIN_TOKEN, DENTAL_ADMIN_USER } from "../utils/formatDate";

const useStyles = makeStyles((theme) => ({
  avatar: {
    background: "#E6E7E8",
    color: "#004a73",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
}));

export default function ProfileButton() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { name: userName, role, token } = useSelector(getAuth);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    localStorage.setItem(DENTAL_ADMIN_USER, null);
    localStorage.setItem(DENTAL_ADMIN_TOKEN, null);
    history.push("/login");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Avatar
        className={classes.avatar}
        aria-describedby={id}
        onClick={handleClick}
      >
        {/* {userName.split(" ").map((word) => word[0])} */}
        Hello
      </Avatar>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: { marginTop: "1rem" },
        }}
      >
        <List component="nav" aria-label="profile options" disablePadding>
          <ListItem
            button
            onClick={() => {
              handleClose();
              dispatch(logout());
            }}
          >
            <ListItemIcon>
              <img src={require("../assets/logout.png").default} alt="" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
}

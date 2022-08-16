import { makeStyles } from "@material-ui/core";
import { Box, styled, Typography, Link } from "@mui/material";
import {
  Dashboard,
  People,
  Task,
  KeyboardArrowDown as DownIcon,
  KeyboardArrowUp as UpIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    minWidth: (props) => props.width,
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    width: "70%",
    maxWidth: 150,
    margin: "2rem 0 3rem",
  },
  itemsCont: {
    width: "calc(100% - 1rem)",
    display: "flex",
    flexDirection: "column",
    rowGap: "1rem",
  },
  drawerButton: {
    color: "white",
    borderRadius: 12,
    cursor: "pointer",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    letterSpacing: 0.5,
    fontWeight: 500,
    "&:hover": {
      boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
    },
  },
  drawerMain: {
    display: "flex",
    alignItems: "center",
    columnGap: "0.75rem",
    color: "white !important",
    textDecoration: "none !important",
  },
  drawerItemCont: {
    paddingLeft: "2rem",
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
  },
  drawerItem: {
    fontSize: "0.8rem",
    "& + &": {
      marginTop: "0.7rem",
    },
  },
}));

const DrawerButton = ({ text, icon: Icon, child, to }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={classes.drawerButton}
      onClick={() => {
        if (Array.isArray(child)) {
          setOpen(!open);
        }
      }}
    >
      <Link
        className={classes.drawerMain}
        component={to ? RouterLink : "div"}
        to={to}
      >
        <Icon style={{ fontSize: "1.2rem" }} />
        <p>{text}</p>
        <Box flex="1" />
        {Array.isArray(child) && (open ? <UpIcon /> : <DownIcon />)}
      </Link>

      {Array.isArray(child) && open && (
        <div className={classes.drawerItemCont}>
          {child.map((item, i) => (
            <div className={classes.drawerItem} key={i}>
              <Link color="inherit" component={RouterLink} to={item.to}>
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const links = [
  {
    to: "https://dental-admin.bobprep.com/",
    name: "Dashboard",
    icon: Dashboard,
  },
  {
    to: "/users",
    name: "Users",
    icon: People,
  },
  {
    name: "Question Bank",
    icon: Task,
    children: [
      {
        to: "/subject",
        name: "Package",
      },
      // {
      //   to: "/topic",
      //   name: "Topic",
      // },
      // {
      //   to: "/subTopic",
      //   name: "Sub-Topic",
      // },
      // {
      //   to: "/question",
      //   name: "Question",
      // },
      {
        to: "/add-mcq",
        name: "Add MCQ",
      },
    ],
  },
];

export default function Drawer({ width }) {
  const classes = useStyles({ width });

  return (
    <div className={classes.root}>
      <img
        className={classes.logo}
        src={require("../../assets/logo.png").default}
        alt=""
      />

      <div className={classes.itemsCont}>
        {links.map((link, i) => (
          <DrawerButton
            key={i}
            text={link.name}
            icon={link.icon}
            child={link.children}
            to={link.to}
          />
        ))}
      </div>
    </div>
  );
}

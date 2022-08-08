import { makeStyles } from "@material-ui/core";
import Drawer from "./Header/Drawer";
import Navbar from "./Header/Navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    maxWidth: "100vw",
  },
  headerNdBody: {
    width: (props) => `calc(100vw - ${props.width}px)`,
    height: "100vh",
    overflow: "hidden",
  },
  overflowBody: {
    height: "calc(100vh - 80px)",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "2rem 0",
  },
}));

const sideDrawerWidth = 250;

export default function Layout({ children }) {
  const classes = useStyles({ width: sideDrawerWidth });

  return (
    <div className={classes.root}>
      <Drawer width={sideDrawerWidth} />
      <div className={classes.headerNdBody}>
        <Navbar />
        <div className={classes.overflowBody}>{children}</div>
      </div>
    </div>
  );
}

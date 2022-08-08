import { Container, Paper, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useState } from "react";
import TopicTable from "./TopicTable";
import TopicForm from "./TopicForm";

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    rowGap: "2rem",
  },
  roundPaper: {
    overflow: "hidden",
  },
  headerDiv: {
    display: "flex",
    alignItems: "center",
    padding: "2rem",
  },
  addNewTopicImg: {
    width: "4rem",
    display: "block",
    margin: "auto",
    marginBottom: 5,
  },
  filtersCont: {
    marginLeft: "auto",
    width: "60%",
  },
  filtersDiv: {
    display: "flex",
    columnGap: "1.5rem",
    "& > div": {
      flex: 1,
    },
  },
  headerLabel: {
    fontSize: "0.9rem",
    color: "#030303",
    fontWeight: 600,
    marginBottom: 2,
  },
  grayColor: {
    color: "#7A899F",
  },
}));

export default function Home() {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editTopicId, setEditTopicId] = useState(null);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setEditTopicId(null);
    setOpenDrawer((open) => !open);
  };

  const editTopic = (id) => {
    toggleDrawer();
    setEditTopicId(id);
  };

  return (
    <Container className={classes.root}>
      <Paper variant="elevation" className={classes.roundPaper}>
        <TopicTable addTopic={toggleDrawer} editTopic={editTopic} />
        <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer}>
          <TopicForm closeForm={toggleDrawer} editTopicId={editTopicId} />
        </Drawer>
      </Paper>
    </Container>
  );
}

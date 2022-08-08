import { Container, Paper, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useState } from "react";
import SubTopicTable from "./SubTopicTable";
import SubTopicForm from "./SubTopicForm";

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
  addNewSubTopicImg: {
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
  const [editSubTopicId, setEditSubTopicId] = useState(null);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setEditSubTopicId(null);
    setOpenDrawer((open) => !open);
  };

  const editSubTopic = (id) => {
    toggleDrawer();
    setEditSubTopicId(id);
  };

  return (
    <Container className={classes.root}>
      <Paper variant="elevation" className={classes.roundPaper}>
        <SubTopicTable addSubTopic={toggleDrawer} editSubTopic={editSubTopic} />
        <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer}>
          <SubTopicForm
            closeForm={toggleDrawer}
            editSubTopicId={editSubTopicId}
          />
        </Drawer>
      </Paper>
    </Container>
  );
}

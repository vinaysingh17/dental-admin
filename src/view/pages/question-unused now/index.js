import { Container, Paper, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useState } from "react";
import QuestionTable from "./QuestionTable";
import QuestionForm from "./QuestionForm";

const useStyles = makeStyles(() => ({
  root: {
    padding: "2rem 0",
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
  addNewQuestionImg: {
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
  const [editQuestionId, setEditQuestionId] = useState(null);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setEditQuestionId(null);
    setOpenDrawer((open) => !open);
  };

  const editQuestion = (id) => {
    toggleDrawer();
    setEditQuestionId(id);
  };

  return (
    <Container className={classes.root}>
      <Paper variant="elevation" className={classes.roundPaper}>
        <QuestionTable addQuestion={toggleDrawer} editQuestion={editQuestion} />
        <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer}>
          <QuestionForm
            closeForm={toggleDrawer}
            editQuestionId={editQuestionId}
          />
        </Drawer>
      </Paper>
    </Container>
  );
}

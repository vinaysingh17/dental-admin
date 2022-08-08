import { Container, Paper, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useState } from "react";
import SubjectTable from "./SubjectTable";
import SubjectForm from "./SubjectForm";

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
  addNewSubjectImg: {
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
  const [editSubjectId, setEditSubjectId] = useState(null);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setEditSubjectId(null);
    setOpenDrawer((open) => !open);
  };

  const editSubject = (id) => {
    toggleDrawer();
    setEditSubjectId(id);
  };

  return (
    <Container className={classes.root}>
      <Paper variant="elevation" className={classes.roundPaper}>
        <SubjectTable addSubject={toggleDrawer} editSubject={editSubject} />
        <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer}>
          <SubjectForm closeForm={toggleDrawer} editSubjectId={editSubjectId} />
        </Drawer>
      </Paper>
    </Container>
  );
}

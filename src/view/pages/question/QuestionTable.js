import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow as MuiTableRow,
  TablePagination,
  Paper,
  withStyles,
  makeStyles,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { Refresh, RemoveRedEye as ViewIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  questionActions,
  questionSelectors,
} from "../../../application/reducers/questionSlice";
import throttle from "lodash.throttle";
import formatDate, { BACKEND_URL } from "../../utils/formatDate";
import { useHistory } from "react-router";
import axios from "axios";

const TableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#F3F2F7",
    color: "#6E6B7B",
    fontWeight: 700,
    borderBottom: "none",
    fontSize: "0.9rem",
  },
  body: {
    fontSize: "0.85rem",
    borderBottom: "none",
    color: "#6E6B7B",
    paddingTop: 10,
    paddingBottom: 10,
  },
}))(MuiTableCell);

const TableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#F8F9FA",
    "&:nth-of-type(odd)": {
      backgroundColor: "#FFFFFF",
    },
  },
}))(MuiTableRow);

const useStyles = makeStyles({
  root: {
    minHeight: "calc(100vh - 81px - 57.6px - 6rem)",
    display: "flex",
    flexDirection: "column",
  },
  profileImage: {
    fontSize: "1rem",
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    columnGap: "1rem",
    justifyContent: "flex-end",
  },
  filterButton: {
    minWidth: 100,
    textTransform: "none",
  },
  centerDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  heading: {
    fontSize: "1.5rem",
    marginRight: "auto",
  },
});

const headings = [
  { id: "profile", label: "" },
  { id: "title", label: "Title" },
  { id: "questionType", label: "Difficulty" },
  { id: "createdAt", label: "Created At" },
  { id: "actions", label: "" },
];

const ActionPopover = ({ editQuestion, deleteQuestion, deleting }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List component="nav" disablePadding style={{ width: 150 }}>
          <ListItem
            button
            onClick={() => {
              editQuestion();
              handleClose();
            }}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem
            button
            disabled={deleting}
            onClick={async () => {
              await deleteQuestion();
              handleClose();
            }}
          >
            <ListItemIcon>
              {deleting ? (
                <CircularProgress size="1.4rem" thickness={5} />
              ) : (
                <DeleteIcon />
              )}
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

const throttledSearch = throttle((func) => func(), 400, { leading: true });

const useQuestionStyles = makeStyles({
  root: {
    border: "1px solid #E7E7E7",
    borderRadius: 14,
    padding: "1.3rem 1rem",
  },
  headerDiv: {
    display: "flex",
    alignItems: "center",
  },
});

export default function QuestionTable({ filter, openFilterDrawer }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [Questions, setQuestions] = useState([]);
  const params = useParams();
  const [refresPage, setRefresPage] = useState(false);
  console.log("params", params, "<<<table");
  const questions = useSelector(questionSelectors.getQuestions);
  const { limit, currentPage, totalEntries, emptyRows } = useSelector(
    questionSelectors.getQuestionPagination
  );
  const { loading } = useSelector(
    questionSelectors.getQuestionUi.fetchQuestions
  );

  useEffect(async () => {
    // dispatch(fetchQuestions({ page: currentPage, limit }));
    const { data } = await axios.get(`${BACKEND_URL}/api/v1/package-question`, {
      params: { package: params.package },
    });
    console.log(data, "<<<<data");
    setQuestions(data.data);
  }, [currentPage, dispatch, limit, refresPage]);

  const handleChangePage = (_, newPage) => {
    dispatch(questionActions.changePage({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      questionActions.changeLimit({ limit: parseInt(event.target.value, 10) })
    );
  };

  const loadingColumnSpan = headings.length;

  const handleQuestionSearch = (e) => {
    throttledSearch(() => {
      dispatch(
        fetchQuestions({
          page: currentPage,
          limit,
          search: e.target.value,
        })
      );
    });
  };

  const deleteThisQue = async (value) => {
    const { data } = await axios.delete(
      `${BACKEND_URL}/api/v1/package-question/delete/${value.id}`
    );
    if (data.statusCode == "200") {
      setRefresPage(!refresPage);
    }
    console.log(data, "<<<<data");
  };

  const Question = ({ data }) => {
    console.log(data, "<<<<question data");
    const classes = useQuestionStyles();
    const history = useHistory();

    console.log(data);
    return (
      <div className={classes.root}>
        <div className={classes.headerDiv}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>
              <Typography variant="h5">Question</Typography>
            </div>
            <div>
              <Typography
                variant="h5"
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => history.push(`/edit-mcq/${data.id}`)}
              >
                Edit
              </Typography>
              <Typography
                variant="h5"
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => deleteThisQue(data)}
              >
                Delete
              </Typography>
            </div>
          </div>
          <Box flex="1" />
          {/* <IconButton onClick={() => history.push(`/question/${data.id}`)}>
            <ViewIcon />
          </IconButton> */}
        </div>
        <Box
          mt="1rem"
          dangerouslySetInnerHTML={{ __html: data.questionTitle }}
        ></Box>
      </div>
    );
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableHeader}>
        <Typography className={classes.heading} variant="h3">
          Question Bank
        </Typography>

        {/* <Button
          variant="contained"
          className={classes.filterButton}
          onClick={openFilterDrawer}
          disableRipple
        >
          Filter
        </Button> */}
      </div>

      <Box flex="1">
        {totalEntries === -1 && loading ? (
          <div className={classes.centerDiv}>
            <CircularProgress size="2rem" thickness={5} />
          </div>
        ) : totalEntries === 0 ? (
          <div className={classes.centerDiv}>No records found.</div>
        ) : (
          <Box
            display="flex"
            gridRowGap="1rem"
            flexDirection="column"
            padding="1rem"
          >
            {Questions?.map((row, i) => (
              <Question data={row} />
            ))}
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="center" pl="1rem">
        {totalEntries !== -1 && loading && (
          <CircularProgress size="1.6rem" thickness={5} />
        )}
        <Box flex="1" />
        <TablePagination
          component="div"
          count={totalEntries}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
}

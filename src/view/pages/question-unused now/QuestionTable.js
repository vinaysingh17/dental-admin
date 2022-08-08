import React, { useEffect } from "react";
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
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
} from "@material-ui/core";

import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteQuestion,
  fetchQuestions,
  questionActions,
  questionSelectors,
} from "../../../application/reducers/questionSlice";
import throttle from "lodash.throttle";
import { globalSelectors } from "../../../application/reducers/globalSlice";
import formatDate from "../../utils/formatDate";

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
  table: {
    minWidth: 700,
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
  addQuestionButton: {
    minWidth: 200,
    textTransform: "none",
  },
  fullWidthSpan: {
    display: "block",
    textAlign: "center",
    padding: "2rem 0",
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

export default function QuestionTable({ addQuestion, editQuestion }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const questions = useSelector(questionSelectors.getQuestions);
  const { limit, currentPage, totalEntries, emptyRows } = useSelector(
    questionSelectors.getQuestionPagination
  );
  const { loading } = useSelector(
    questionSelectors.getQuestionUi.fetchQuestions
  );

  const subTopicId = useSelector(globalSelectors.getGlobals).selectedSubTopic
    .id;

  useEffect(() => {
    dispatch(fetchQuestions({ page: currentPage, limit, subTopicId }));
  }, [currentPage, dispatch, limit, subTopicId]);

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
          subTopicId,
        })
      );
    });
  };

  return (
    <TableContainer component={Paper}>
      <div className={classes.tableHeader}>
        <Typography className={classes.heading} variant="h3">
          Question Details
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
          onChange={handleQuestionSearch}
        />
        <Button
          variant="contained"
          className={classes.addQuestionButton}
          onClick={addQuestion}
          disableRipple
        >
          Add Question
        </Button>
      </div>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <MuiTableRow>
            {headings.map((item) => (
              <TableCell key={item.id}>{item.label}</TableCell>
            ))}
          </MuiTableRow>
        </TableHead>
        <TableBody>
          {totalEntries === -1 && loading ? (
            <TableRow>
              <TableCell colSpan={loadingColumnSpan}>
                <span className={classes.fullWidthSpan}>
                  <CircularProgress size="2rem" thickness={5} />
                </span>
              </TableCell>
            </TableRow>
          ) : totalEntries === 0 ? (
            <TableRow>
              <TableCell colSpan={loadingColumnSpan}>
                <span className={classes.fullWidthSpan}>No records found.</span>
              </TableCell>
            </TableRow>
          ) : (
            questions?.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" align="center">
                  <Avatar className={classes.profileImage}>
                    {row.questionTitle
                      .split(" ")
                      .map((word) => word[0]?.toUpperCase())
                      .slice(0, 2)}
                  </Avatar>
                </TableCell>
                <TableCell>{row.questionTitle}</TableCell>
                <TableCell>{row.questionType}</TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell>
                  {
                    <ActionPopover
                      questionId={row.id}
                      deleting={row.deleting}
                      editQuestion={() => editQuestion(row.id)}
                      deleteQuestion={() =>
                        dispatch(deleteQuestion({ id: row.id }))
                      }
                    />
                  }
                </TableCell>
              </TableRow>
            ))
          )}

          {emptyRows > 0 && (
            <TableRow
              style={{ height: 60 * emptyRows, backgroundColor: "white" }}
            >
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    </TableContainer>
  );
}

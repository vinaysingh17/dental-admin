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
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  Link,
} from "@material-ui/core";

import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTopic,
  fetchTopics,
  topicActions,
  topicSelectors,
} from "../../../application/reducers/topicSlice";
import throttle from "lodash.throttle";
import { Link as RouterLink } from "react-router-dom";
import {
  globalActions,
  globalSelectors,
} from "../../../application/reducers/globalSlice";
import services from '../../../infrastructure/services'

const TableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#f13a5a47",
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
    backgroundColor: "#f13a5a17",
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
  addTopicButton: {
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
  { id: "subject", label: "Subject Name" },
  { id: "actions", label: "" },
];

const ActionPopover = ({ editTopic, deleteTopic, deleting }) => {
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
              editTopic();
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
              await deleteTopic();
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

export default function TopicTable({ addTopic, editTopic }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [topicList, setTopicList] = useState([])
  const [topicPage, setTopicPage] = useState(1)
  const [topicLimit, setTopicLimit] = useState(10)
  const [topicSearch, setTopicSearch] = useState('')

  const topics = useSelector(topicSelectors.getTopics);
  const { limit, currentPage, totalEntries, emptyRows } = useSelector(
    topicSelectors.getTopicPagination
  );
  const { loading } = useSelector(topicSelectors.getTopicUi.fetchTopics);
  const subjectId = useSelector(globalSelectors.getGlobals).selectedSubject.id;

  useEffect(() => {
    dispatch(fetchTopics({ page: currentPage, limit, subjectId }));
  }, [currentPage, dispatch, limit, subjectId]);

  const handleChangePage = (_, newPage) => {
    setTopicPage(newPage + 1)
    dispatch(topicActions.changePage({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setTopicLimit(parseInt(event.target.value, 10))
    dispatch(
      topicActions.changeLimit({ limit: parseInt(event.target.value, 10) })
    );
  };

  const loadingColumnSpan = headings.length;

  const handleTopicSearch = (e) => {
    setTopicSearch(e.target.value)
    throttledSearch(() => {
      dispatch(
        fetchTopics({
          page: currentPage,
          limit,
          search: e.target.value,
          subjectId,
        })
      );
    });
  };

  const selectTopic = (topicInfo) => {
    dispatch(globalActions.setTopic(topicInfo));
  };

  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await services.topic.fetchTopics({ subjectId: subjectId, limit: topicLimit, page: topicPage, search: topicSearch })
        console.log(response)
        setTopicList(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    getTopics()
  }, [subjectId, topicLimit, topicPage, topicSearch])

  return (
    <TableContainer component={Paper}>
      <div className={classes.tableHeader}>
        <Typography className={classes.heading} variant="h3">
          Topic Details
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
          value={topicSearch}
          onChange={handleTopicSearch}
        />
        <Button
          variant="contained"
          className={classes.addTopicButton}
          onClick={addTopic}
          disableRipple
        >
          Add Topic
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
          {topicList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={loadingColumnSpan}>
                <span className={classes.fullWidthSpan}>No records found.</span>
              </TableCell>
            </TableRow>
          ) : (
            topicList?.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" align="center">
                  <Avatar className={classes.profileImage}>
                    {row.title.split(" ").map((word) => word[0]?.toUpperCase())}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <Link
                    component={RouterLink}
                    to={"/subTopic"}
                    onClick={() => selectTopic(row)}
                  >
                    {row.title}
                  </Link>
                </TableCell>
                <TableCell>{row.subject.title}</TableCell>
                <TableCell>
                  {
                    <ActionPopover
                      topicId={row.id}
                      deleting={row.deleting}
                      editTopic={() => editTopic(row.id)}
                      deleteTopic={() => dispatch(deleteTopic({ id: row.id }))}
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
          // count={totalEntries}
          page={topicPage}
          onPageChange={handleChangePage}
          rowsPerPage={topicLimit}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>
  );
}

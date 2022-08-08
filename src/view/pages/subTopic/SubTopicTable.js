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
} from "@material-ui/core";

import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSubTopic,
  fetchSubTopics,
  subTopicActions,
  subTopicSelectors,
} from "../../../application/reducers/subTopicSlice";
import throttle from "lodash.throttle";
import services from '../../../infrastructure/services'
import { globalSelectors } from "../../../application/reducers/globalSlice";

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
  { id: "topic", label: "Topic Name" },
  { id: "actions", label: "" },
];

const ActionPopover = ({ editSubTopic, deleteSubTopic, deleting }) => {
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
              editSubTopic();
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
              await deleteSubTopic();
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

export default function SubTopicTable({ addSubTopic, editSubTopic }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [subTopicList, setSubTopicList] = useState([])
  const [subTopicPage, setSubTopicPage] = useState(1)
  const [subTopicLimit, setSubTopicLimit] = useState(10)
  const [subTopicSearch, setSubTopicSearch] = useState('')

  const subTopics = useSelector(subTopicSelectors.getSubTopics);
  const { limit, currentPage, totalEntries, emptyRows } = useSelector(
    subTopicSelectors.getSubTopicPagination
  );
  const { loading } = useSelector(
    subTopicSelectors.getSubTopicUi.fetchSubTopics
  );

  const topicId = useSelector(globalSelectors.getGlobals).selectedTopic.id;

  useEffect(() => {
    dispatch(fetchSubTopics({ page: currentPage, limit, topicId }));
  }, [currentPage, dispatch, limit, topicId]);

  const handleChangePage = (_, newPage) => {
    setSubTopicPage(newPage + 1)
    dispatch(subTopicActions.changePage({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setSubTopicLimit(parseInt(event.target.value, 10));
    dispatch(
      subTopicActions.changeLimit({ limit: parseInt(event.target.value, 10) })
    );
  };

  const loadingColumnSpan = headings.length;

  const handleSubTopicSearch = (e) => {
    setSubTopicSearch(e.target.value)
    throttledSearch(() => {
      dispatch(
        fetchSubTopics({
          page: currentPage,
          limit,
          search: e.target.value,
          topicId,
        })
      );
    });
  };

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await services.subTopic.fetchSubTopics({ limit: subTopicLimit, page: subTopicPage, topicId, search: subTopicSearch })
        console.log(response)
        setSubTopicList(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    getList();
  }, [topicId, subTopicLimit, subTopicPage, subTopicSearch])

  return (
    <TableContainer component={Paper}>
      <div className={classes.tableHeader}>
        <Typography className={classes.heading} variant="h3">
          SubTopic Details
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
          onChange={handleSubTopicSearch}
        />
        <Button
          variant="contained"
          className={classes.addSubTopicButton}
          onClick={addSubTopic}
          disableRipple
        >
          Add SubTopic
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
          {subTopicList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={loadingColumnSpan}>
                <span className={classes.fullWidthSpan}>No records found.</span>
              </TableCell>
            </TableRow>
          ) : (
            subTopicList?.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" align="center">
                  <Avatar className={classes.profileImage}>
                    {row.title.split(" ").map((word) => word[0]?.toUpperCase())}
                  </Avatar>
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.topic.title}</TableCell>
                <TableCell>
                  {
                    <ActionPopover
                      subTopicId={row.id}
                      deleting={row.deleting}
                      editSubTopic={() => editSubTopic(row.id)}
                      deleteSubTopic={() =>
                        dispatch(deleteSubTopic({ id: row.id }))
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
          // count={totalEntries}
          page={subTopicPage}
          onPageChange={handleChangePage}
          rowsPerPage={subTopicLimit}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>
  );
}

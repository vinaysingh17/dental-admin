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
  deleteSubject,
  fetchSubjects,
  subjectActions,
  subjectSelectors,
} from "../../../application/reducers/subjectSlice";
import throttle from "lodash.throttle";
import formatDate, { BACKEND_URL } from "../../utils/formatDate";
import { Link as RouterLink, useParams } from "react-router-dom";
import { globalActions } from "../../../application/reducers/globalSlice";
import services from "../../../infrastructure/services";
import axios from "axios";

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
  { id: "createdAt", label: "Created At" },
  { id: "updatedAt", label: "Updated At" },
  { id: "actions", label: "" },
];

const ActionPopover = ({ editSubject, deleteSubject, deleting }) => {
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
              editSubject();
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
              await deleteSubject();
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
export default function SubjectTable({ addSubject, editSubject }) {
  const params = useParams();

  const classes = useStyles();
  const dispatch = useDispatch();
  const [subjectList, setSubjectList] = React.useState([]);
  const [subjectPage, setSubjectPage] = React.useState(1);
  const [subjectLimit, setSubjectLimit] = React.useState(10);
  const [subjectSearch, setSubjectSearch] = React.useState("");

  const subjects = useSelector(subjectSelectors.getSubjects);

  const { limit, currentPage, totalEntries, emptyRows } = useSelector(
    subjectSelectors.getSubjectPagination
  );
  const { loading } = useSelector(subjectSelectors.getSubjectUi.fetchSubjects);

  useEffect(() => {
    dispatch(fetchSubjects({ page: currentPage, limit }));
  }, [currentPage, dispatch, limit]);

  const handleChangePage = (_, newPage) => {
    setSubjectPage(newPage + 1);
    dispatch(subjectActions.changePage({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setSubjectLimit(parseInt(event.target.value, 10));
    dispatch(
      subjectActions.changeLimit({ limit: parseInt(event.target.value, 10) })
    );
  };

  const loadingColumnSpan = headings.length;

  const handleSubjectSearch = (e) => {
    setSubjectSearch(e.target.value);
    throttledSearch(() => {
      dispatch(
        fetchSubjects({ page: currentPage, limit, search: e.target.value })
      );
    });
  };

  const selectSubject = (subjectInfo) => {
    dispatch(globalActions.setSubject(subjectInfo));
  };

  useEffect(async () => {
    console.log(params, "<<<params");
    const { data } = await axios.get(`${BACKEND_URL}/api/v1/package`);
    setSubjectList(data.data);
    console.log(data, "<<<<data");
  }, [subjectLimit, subjectPage, subjectSearch]);

  return (
    <TableContainer component={Paper}>
      <div className={classes.tableHeader}>
        <Typography className={classes.heading} variant="h3">
          Subject Details
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
          value={subjectSearch}
          onChange={handleSubjectSearch}
        />
        <Button
          variant="contained"
          className={classes.addSubjectButton}
          onClick={addSubject}
          disableRipple
        >
          Add Subject
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
          {subjectList?.data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={loadingColumnSpan}>
                <span className={classes.fullWidthSpan}>No records found.</span>
              </TableCell>
            </TableRow>
          ) : (
            subjectList?.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" align="center">
                  <Avatar className={classes.profileImage}>
                    {/* {row.title.split(" ").map((word) => word[0]?.toUpperCase())} */}
                    {row.title}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to="/topic"
                    onClick={() => selectSubject(row)}
                  >
                    {row?.title}
                  </Link>
                </TableCell>
                <TableCell>{formatDate(row?.updatedAt)}</TableCell>
                <TableCell>{formatDate(row?.createdAt)}</TableCell>
                {/* <TableCell>
                  {
                    <ActionPopover
                      subjectId={row.id}
                      deleting={row.deleting}
                      editSubject={() => editSubject(row.id)}
                      deleteSubject={() =>
                        dispatch(deleteSubject({ id: row.id }))
                      }
                    />
                  }
                </TableCell> */}
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
          // count={subjectList?.count}
          page={subjectPage}
          onPageChange={handleChangePage}
          rowsPerPage={subjectLimit}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>
  );
}

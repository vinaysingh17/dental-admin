import { makeStyles, Breadcrumbs, Link, Container } from "@material-ui/core";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  globalActions,
  globalSelectors,
} from "../../application/reducers/globalSlice";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "1rem",
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column",
    rowGap: "2rem",
    background: "#FFEDEF",
  },
}));

export default function PaginationBreadcrumbs() {
  const classes = useStyles();
  const { selectedSubject, selectedTopic, selectedSubTopic } = useSelector(
    globalSelectors.getGlobals
  );
  const location = useLocation();
  const dispatch = useDispatch();

  const isSubjectTopicSubTopic = useMemo(
    () =>
      [
        "/subject",
        "/subject/",
        "/topic",
        "/topic/",
        "/subTopic",
        "/subTopic/",
      ].filter((path) => path === location.pathname).length !== 0,
    [location.pathname]
  );

  // code for resetting global state according to pathname...
  useEffect(() => {
    switch (location.pathname) {
      case "/subject":
      case "/subject/":
        dispatch(
          globalActions.resetGlobals({
            subject: true,
            topic: true,
            subTopic: true,
          })
        );
        break;

      case "/topic":
      case "/topic/":
        dispatch(
          globalActions.resetGlobals({
            subject: false,
            topic: true,
            subTopic: true,
          })
        );
        break;

      case "/subTopic":
      case "/subTopic/":
        dispatch(
          globalActions.resetGlobals({
            subject: false,
            topic: false,
            subTopic: true,
          })
        );
        break;

      default:
        break;
    }
  }, [dispatch, location]);

  // if page is subject, topic or subtopic then show this Breadcrumb...
  if (isSubjectTopicSubTopic) {
    return (
      <Container className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/question-bank"
          >
            Question Bank
          </Link>
          {selectedSubject && (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to="/subject"
            >
              {selectedSubject.title}
            </Link>
          )}
          {selectedTopic && (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to="/topic"
            >
              {selectedTopic.title}
            </Link>
          )}
          {selectedSubTopic && (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to="/subTopic"
            >
              {selectedSubTopic.title}
            </Link>
          )}
        </Breadcrumbs>
      </Container>
    );
  } else {
    // else show this breadcrumb...
    return (
      <Container className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/question-bank"
          >
            Question Bank
          </Link>
          {selectedSubTopic && (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to="/subTopic"
            >
              {selectedSubTopic.title}
            </Link>
          )}
        </Breadcrumbs>
      </Container>
    );
  }
}

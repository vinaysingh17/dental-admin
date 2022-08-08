import {
  makeStyles,
  Typography,
  TextField,
  Button as MuiButton,
  Box,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { Formik } from "formik";
import * as yup from "yup";
import { Close as CloseIcon } from "@material-ui/icons";
import styled from "styled-components";
import { spacing } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import {
  createTopic,
  updateTopic,
  topicSelectors,
} from "../../../application/reducers/topicSlice";
import { useMemo } from "react";
import SubjectAutocomplete from "../subject/SubjectAutocomplete";
import { globalSelectors } from "../../../application/reducers/globalSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    flex: 1,
    overflow: "hidden",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#F3F2F7",
    color: "#6E6B7B",
    padding: "0.5rem 1rem",
  },
  formBody: {
    padding: "1.5rem 1.5rem 1rem",
    display: "flex",
    flexDirection: "column",
    rowGap: "1rem",
    overflow: "auto",
    maxHeight: "calc(100% - 64px)",
  },
}));

const Button = styled(MuiButton)(spacing);

const useSelectedTopic = (id) => {
  const topics = useSelector(topicSelectors.getTopics);

  const selectedTopic = useMemo(() => {
    return topics.filter((topic) => topic.id === id);
  }, [id, topics]);

  return selectedTopic[0] ? selectedTopic[0] : null;
};

const addInitialValues = {
  title: "",
};

const validationSchema = yup.object({
  title: yup.string().required().label("Topic Title"),
});

export default function TopicForm({ closeForm, editTopicId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedTopic = useSelectedTopic(editTopicId);

  const { loading } = useSelector(topicSelectors.getTopicUi.form);
  const { selectedSubject } = useSelector(globalSelectors.getGlobals);

  const handleAddSubmit = async (values, { resetForm }) => {
    const payload = { ...values, subject: selectedSubject.id };

    const result = await dispatch(createTopic({ topicData: payload }));

    if (result.type === "topic/createTopic/fulfilled") {
      resetForm();
      closeForm();
    }
  };

  const handleEditSubmit = async (values) => {
    const payload = { ...values };
    if (payload.password?.length === 0) delete payload.password;

    const result = await dispatch(updateTopic({ topicData: payload }));
    if (result.type === "topic/updateTopic/fulfilled") {
      closeForm();
    }
  };

  const editInitialValues = {
    id: selectedTopic?.id,
    name: selectedTopic?.name,
    mobile: selectedTopic?.mobile,
    department: selectedTopic?.department,
    password: selectedTopic?.password,
  };
  return (
    <Formik
      initialValues={
        Boolean(editTopicId) ? editInitialValues : addInitialValues
      }
      validationSchema={validationSchema}
      onSubmit={Boolean(editTopicId) ? handleEditSubmit : handleAddSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Box component={"form"} className={classes.root}>
          <div className={classes.formHeader}>
            <Typography color="inherit" variant="h4" align="center" mb="2rem">
              {Boolean(editTopicId) ? "Edit Topic" : "Add New Topic"}
            </Typography>
            <IconButton onClick={closeForm}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className={classes.formBody}>
            <TextField
              aria-readonly
              InputProps={{ readOnly: true }}
              variant="outlined"
              label="Subject"
              value={selectedSubject.title}
            />

            <TextField
              variant="outlined"
              id="title"
              label="Topic Title"
              name={"title"}
              placeholder="Anatomy"
              value={values.title}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <Button
              type="submit"
              onClick={handleSubmit}
              mt="2rem"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size="1.45rem" thickness={5} />
              ) : Boolean(editTopicId) ? (
                "Edit Topic"
              ) : (
                "Add Topic"
              )}
            </Button>
          </div>
        </Box>
      )}
    </Formik>
  );
}

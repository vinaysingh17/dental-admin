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
  createSubTopic,
  updateSubTopic,
  subTopicSelectors,
} from "../../../application/reducers/subTopicSlice";
import { useMemo } from "react";
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
  label: {
    fontSize: "0.95rem",
    color: "#030303",
    fontWeight: 600,
    marginBottom: 5,
  },
  input: {
    "& + $label": {
      marginTop: "1.5rem",
    },
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

const useSelectedSubTopic = (id) => {
  const subTopics = useSelector(subTopicSelectors.getSubTopics);

  const selectedSubTopic = useMemo(() => {
    return subTopics.filter((subTopic) => subTopic.id === id);
  }, [id, subTopics]);

  return selectedSubTopic[0] ? selectedSubTopic[0] : null;
};

const addInitialValues = {
  title: "",
};

const validationSchema = yup.object({
  title: yup.string().required().label("SubTopic Title"),
});

export default function SubTopicForm({ closeForm, editSubTopicId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedSubTopic = useSelectedSubTopic(editSubTopicId);

  const { loading } = useSelector(subTopicSelectors.getSubTopicUi.form);
  const { selectedSubject, selectedTopic } = useSelector(
    globalSelectors.getGlobals
  );

  const handleAddSubmit = async (values, { resetForm }) => {
    const payload = { ...values, topic: selectedTopic.id };

    const result = await dispatch(createSubTopic({ subTopicData: payload }));

    if (result.type === "subTopic/createSubTopic/fulfilled") {
      resetForm();
      closeForm();
    }
  };

  const handleEditSubmit = async (values) => {
    const payload = { ...values };
    if (payload.password?.length === 0) delete payload.password;

    const result = await dispatch(updateSubTopic({ subTopicData: payload }));
    if (result.type === "subTopic/updateSubTopic/fulfilled") {
      closeForm();
    }
  };

  const editInitialValues = {
    id: selectedSubTopic?.id,
    name: selectedSubTopic?.name,
    mobile: selectedSubTopic?.mobile,
    department: selectedSubTopic?.department,
    password: selectedSubTopic?.password,
  };
  return (
    <Formik
      initialValues={
        Boolean(editSubTopicId) ? editInitialValues : addInitialValues
      }
      validationSchema={validationSchema}
      onSubmit={Boolean(editSubTopicId) ? handleEditSubmit : handleAddSubmit}
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
              {Boolean(editSubTopicId) ? "Edit SubTopic" : "Add New SubTopic"}
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
              aria-readonly
              InputProps={{ readOnly: true }}
              variant="outlined"
              label="Topic"
              value={selectedTopic.title}
            />

            <TextField
              variant="outlined"
              id="title"
              label="SubTopic Title"
              name={"title"}
              className={classes.input}
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
              ) : Boolean(editSubTopicId) ? (
                "Edit SubTopic"
              ) : (
                "Add SubTopic"
              )}
            </Button>
          </div>
        </Box>
      )}
    </Formik>
  );
}

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
  createSubject,
  updateSubject,
  subjectSelectors,
} from "../../../application/reducers/subjectSlice";
import { useMemo, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/formatDate";

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

const useSelectedSubject = (id) => {
  const subjects = useSelector(subjectSelectors.getSubjects);

  const selectedSubject = useMemo(() => {
    return subjects?.filter((subject) => subject.id === id);
  }, [id, subjects]);

  return selectedSubject[0] ? selectedSubject[0] : null;
};

const addInitialValues = {
  title: "",
};

const validationSchema = yup.object({
  title: yup.string().required().label("Subject Title"),
});

export default function SubjectForm({ closeForm, editSubjectId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const selectedSubject = useSelectedSubject(editSubjectId);

  const { loading } = useSelector(subjectSelectors.getSubjectUi.form);
  const [handleForm, setHandleForm] = useState({
    title: "",
  });
  const handleAddSubmit = async (values, { resetForm }) => {
    const payload = { ...values };

    const result = await dispatch(createSubject({ subjectData: payload }));

    if (result.type === "subject/createSubject/fulfilled") {
      resetForm();
      closeForm();
    }
  };

  const handleEditSubmit = async (values) => {
    const payload = { ...values };

    const result = await dispatch(updateSubject({ subjectData: payload }));
    if (result.type === "subject/updateSubject/fulfilled") {
      closeForm();
    }
  };

  const editInitialValues = {
    // id: selectedSubject?.id,
    // name: selectedSubject?.name,
    // mobile: selectedSubject?.mobile,
    // department: selectedSubject?.department,
    // password: selectedSubject?.password,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, "<<<name targeet", value);
    setHandleForm({ ...handleForm, [name]: value });
  };
  const onsubmitForm = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/v1/package`, {
        title: handleForm.title,
      });
      if (data.success) {
        closeForm();
      }
      console.log(data, "<<<<");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={Boolean(editSubjectId) ? handleEditSubmit : handleAddSubmit}
    >
      {({
        values,
        errors,
        touched,
        // handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Box component={"form"} className={classes.root}>
          <div className={classes.formHeader}>
            <Typography color="inherit" variant="h4" align="center" mb="2rem">
              {Boolean(editSubjectId) ? "Edit Subject" : "Add New Subject"}
            </Typography>
            <IconButton onClick={closeForm}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className={classes.formBody}>
            <TextField
              variant="outlined"
              id="title"
              label="Subject Title"
              name={"title"}
              className={classes.input}
              placeholder="Title"
              value={handleForm?.title}
              // error={Boolean(touched.title && errors.title)}
              // helperText={touched.title && errors.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <Button
              type="submit"
              onClick={onsubmitForm}
              mt="2rem"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size="1.45rem" thickness={5} />
              ) : Boolean(editSubjectId) ? (
                "Edit Subject"
              ) : (
                "Add Subject"
              )}
            </Button>
          </div>
        </Box>
      )}
    </Formik>
  );
}

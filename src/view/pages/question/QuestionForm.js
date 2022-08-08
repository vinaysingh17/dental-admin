import {
  makeStyles,
  Typography,
  Button as MuiButton,
  Box,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from "@material-ui/core";
import { Formik } from "formik";
import * as yup from "yup";
import { Close as CloseIcon } from "@material-ui/icons";
import styled from "styled-components";
import { spacing } from "@material-ui/system";
import SubjectAutocomplete from "../subject/SubjectAutocomplete";
import TopicAutocomplete from "../topic/TopicAutocomplete";
import SubTopicAutocomplete from "../subTopic/SubTopicAutocomplete";
import { BACKEND_URL } from "../../utils/formatDate";
import axios from "axios";
import { useEffect, useState } from "react";

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
    rowGap: "1.5rem",
    overflow: "auto",
    maxHeight: "calc(100% - 40px)",
  },
  formItem: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.35rem",
  },
  radioGroup: {
    columnGap: "2rem",
    "& .MuiTypography-body1": {
      fontWeight: 400,
    },
  },
}));

const Button = styled(MuiButton)(spacing);
const GrayTypography = styled(Typography)({
  color: "#5d5d5d",
});

const initialValues = {
  subject: null,
  topic: null,
  subtopic: null,
  questionType: "EASY",
};

const validationSchema = yup.object({
  subject: yup.string().nullable().required().label("Subject"),
  topic: yup.string().nullable().required().label("Topic"),
  subtopic: yup.string().nullable().required().label("SubTopic"),
  questionType: yup.string().required(),
});

export default function QuestionForm({ closeForm, filterState }) {
  const classes = useStyles();
  const [filter, setFilter] = filterState;
  const [Packages, setPackages] = useState([]);
  const [formData, setFormData] = useState();

  const handleFilter = (values) => {
    setFilter({ ...values });
    closeForm();
  };
  useEffect(async () => {
    const { data } = await axios.get(BACKEND_URL + "/api/v1/package");
    setPackages(data.data);
    console.log(data, "<<<<packages");
  }, []);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    console.log(name, value, "<<<<name value");
    // setShowAlert({ open: false });
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFilter}
    >
      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <Box component={"form"} className={classes.root}>
          <div className={classes.formHeader}>
            <Typography color="inherit" variant="h4" align="center" mb="2rem">
              Filter Question
            </Typography>
            <IconButton onClick={closeForm}>
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{ overflow: "hidden", height: "calc(100vh - 64px)" }}>
            <div className={classes.formBody}>
              <div className={classes.formItem}>
                <GrayTypography>Subject</GrayTypography>
                {/* <SubjectAutocomplete
                  name="subject"
                  error={Boolean(touched.subject && errors.subject)}
                  helperText={touched.subject && errors.subject}
                /> */}
                <SubjectAutocomplete
                  name="packageName"
                  packages={Packages}
                  // error={Boolean(touched.subject && errors.subject)}
                  // helperText={touched.subject && errors.subject}
                  // subjectId={values.topic}
                  handleFormData={handleFormData}
                />
              </div>
              {values.subject && (
                <div className={classes.formItem}>
                  <GrayTypography>Topic</GrayTypography>
                  <TopicAutocomplete
                    name="topic"
                    error={Boolean(touched.topic && errors.topic)}
                    helperText={touched.topic && errors.topic}
                    subjectId={values.subject}
                  />
                </div>
              )}
              {values.topic && (
                <div className={classes.formItem}>
                  <GrayTypography>Sub-Topic</GrayTypography>
                  <SubTopicAutocomplete
                    name="subtopic"
                    error={Boolean(touched.subtopic && errors.subtopic)}
                    helperText={touched.subtopic && errors.subtopic}
                    topicId={values.topic}
                  />
                </div>
              )}

              <FormControl component="fieldset">
                <GrayTypography>Difficulty</GrayTypography>
                <RadioGroup
                  row
                  aria-label="question type"
                  value={values.questionType}
                  name="questionType"
                  onChange={(e) => {
                    handleFormData(e);
                    handleChange(e);
                  }}
                  className={classes.radioGroup}
                >
                  <FormControlLabel
                    value="EASY"
                    control={<Radio color="primary" />}
                    label="Easy"
                  />
                  <FormControlLabel
                    value="MEDIUM"
                    control={<Radio color="primary" />}
                    label="Medium"
                  />
                  <FormControlLabel
                    value="HARD"
                    control={<Radio color="primary" />}
                    label="Hard"
                  />
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                onClick={handleSubmit}
                mt="2rem"
                variant="contained"
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </Box>
      )}
    </Formik>
  );
}

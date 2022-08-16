import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import {
  Container,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
  styled,
  Button,
  RadioGroup,
  FormLabel as MuiFormLabel,
  FormControlLabel,
  Radio,
  FormControl,
  Box,
  Tooltip,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import DraftEditor from "../../component/Editor";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Formik } from "formik";
import * as yup from "yup";
import SubjectAutocomplete from "../subject/SubjectAutocomplete";
import TopicAutocomplete from "../topic/TopicAutocomplete";
import SubTopicAutocomplete from "../subTopic/SubTopicAutocomplete";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuestion,
  questionSelectors,
} from "../../../application/reducers/questionSlice";
import axios from "axios";
import { BACKEND_URL } from "../../utils/formatDate";
import InputDropDown from "../../component/SelectInput";
import UIAlert from "../../component/Alert";
import { useNavigate, useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2rem",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: "1.5rem",
  },
  formItem: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.35rem",
  },
}));

const GrayTypography = styled(Typography)({
  color: "#5d5d5d",
});

const FormLabel = styled(MuiFormLabel)({
  fontSize: "0.95rem",
});

const DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
};

const initialValues = {
  subject: null,
  topic: null,
  subtopic: null,
  questionTitle: null,
  questionType: DIFFICULTY.MEDIUM,
  options: [
    {
      option: "",
      isCorrect: true,
    },
    {
      option: "",
      isCorrect: false,
    },
    {
      option: "",
      isCorrect: false,
    },
    {
      option: "",
      isCorrect: false,
    },
  ],
  explaination: null,
};
const validationSchema = yup.object({
  subject: yup.string().nullable().required().label("Subject"),
  topic: yup.string().nullable().required().label("Topic"),
  subtopic: yup.string().nullable().required().label("Sub-Topic"),
  questionTitle: yup.string().required().label("Question Title"),
  questionType: yup.string().required().label("Difficulty"),
  options: yup.array().of(
    yup.object({
      option: yup.string().required().label("Option"),
      isCorrect: yup.boolean().required().default(false),
    })
  ),
  explaination: yup.string().required().label("Explaination"),
});

export default function AddMCQ() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [Packages, setPackages] = useState([]);
  const [showAlert, setShowAlert] = useState({ open: false, message: "" });
  useEffect(async () => {
    const { data } = await axios.get(BACKEND_URL + "/api/v1/package");
    setPackages(data.data);
    console.log(data, "<<<<packages");
  }, []);

  const { loading } = useSelector(questionSelectors.getQuestionUi.form);

  const [formData, setFormData] = useState({
    package: "",
    questionTitle: "",
    questionType: DIFFICULTY.MEDIUM,
    options: [
      {
        option: "",
        isCorrect: true,
      },
      {
        option: "",
        isCorrect: false,
      },
      {
        option: "",
        isCorrect: false,
      },
      {
        option: "",
        isCorrect: false,
      },
    ],
    explaination: "",
  });
  const onSubmit = async (values, { resetForm }) => {
    console.log(values, "<<<<<values");
    return null;
    const result = await dispatch(createQuestion({ questionData: values }));

    if (result.type === "question/createQuestion/fulfilled") {
      resetForm();
    }
  };

  const handleOptionChange = ({
    newValue,
    i,
    name,
    setFieldValue,
    options,
  }) => {
    setFieldValue(name, newValue);
    console.log(name, newValue, "<<<<< ");
    let prevOptions = formData.options;
    const updatedOptions = formData.options.map((item, index) => {
      if (index == i) {
        return { ...item, isCorrect: true };
      } else return { ...item, isCorrect: false };
    });
    console.log(prevOptions, "<<<<prevoptions", updatedOptions);
    setFormData({ ...formData, options: updatedOptions });
    // handleFormData({ target: { name: "options", value: updatedOptions } });

    // formData.options.forEach((option, optionI) => {
    //   const optionName = `options.${optionI}.isCorrect`;

    //   // if not the option that we changed and is checked then uncheckit
    //   if (optionName !== name && option?.isCorrect) {
    //     setFieldValue(optionName, false);
    //     handleFormData({
    //       target: { name: "options", value: [...formData.options] },
    //     });
    //   }
    // });
  };

  const validation = (data) => {
    const { questionTitle, questionType, options, explaination } = data;
    console.log(questionTitle, explaination, "<<<<title and explanation");

    if (questionTitle == "") {
      console.log("if part");
      setShowAlert({ open: true, message: "Title is required" });
      return false;
    }
    if (explaination == "") {
      console.log("if part");
      setShowAlert({ open: true, message: "Explanation is required" });
      return false;
    }
    const checkOption = options.filter((item) => {
      console.log(item.option);
      if (
        item.option.trim() == "" ||
        item.option == "" ||
        item.option == null ||
        item.option == "<p></p>"
      )
        return true;
      else return false;
    });
    console.log(checkOption, "<<<checkOptions");
    if (checkOption.length) return false;
    else return true;
  };

  const handleFormData = (e) => {
    const { name, value } = e.target;
    console.log(name, value, "<<<<name value");
    setShowAlert({ open: false });
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionsName = (i, content) => {
    let prevOptions = formData.options;
    setShowAlert({ open: false });

    const updatedOptions = formData.options.map((item, index) => {
      if (index == i) {
        return { ...item, option: content };
      } else return { ...item };
    });
    console.log(prevOptions, "<<<<prevoptions", updatedOptions);
    setFormData({ ...formData, options: updatedOptions });
    // handleFormData({ target: { name: "options", value: updatedOptions } });
  };

  const handleSubmitForm = async () => {
    // const {packageName}=formData
    console.log(formData, "<<<<formData");

    if (validation(formData)) {
      const { questionTitle, questionType, options, explaination } = formData;
      const bodyData = {
        package: formData.package,
        questionTitle: questionTitle,
        questionType: questionType,
        options,
        explaination,
      };
      console.log(bodyData, "<<<,body data to send");
      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/package-question`,
        { ...bodyData }
      );
      console.log(data, "<<<<data");
      if (data.success) {
        history.push(`/question/${bodyData.package}`);
      }
    }
  };

  return (
    <Container
      className={classes.root}
      component={Paper}
      style={{ padding: "4rem" }}
    >
      <Typography variant="h3" className={classes.heading}>
        Add Multiple Choice Questions
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <div className={classes.form}>
            <div className={classes.formItem}>
              <GrayTypography>Packages</GrayTypography>
              {/* <InputDropDown
                options={Packages}
                // setSelectedValue={setFormData}
                handleFormData={handleFormData}
                name="package"
              /> */}
              <SubjectAutocomplete
                name="packageName"
                packages={Packages}
                error={Boolean(touched.subject && errors.subject)}
                helperText={touched.subject && errors.subject}
                subjectId={values.topic}
                handleFormData={handleFormData}
              />
            </div>

            {/* <div className={classes.formItem}>
              <GrayTypography>Topic</GrayTypography>
              <TopicAutocomplete
                name="topic"
                error={Boolean(touched.topic && errors.topic)}
                helperText={touched.topic && errors.topic}
                subjectId={Packages}
              />
            </div> */}

            {/* {values.topic && (
              <div className={classes.formItem}>
                <GrayTypography>Sub-Topic</GrayTypography>
                <SubTopicAutocomplete
                  name="subtopic"
                  error={Boolean(touched.subtopic && errors.subtopic)}
                  helperText={touched.subtopic && errors.subtopic}
                  topicId={values.topic}
                />
              </div>
            )} */}
            <div className={classes.formItem}>
              <FormControl component="fieldset" style={{ marginTop: "0.5rem" }}>
                <GrayTypography>Difficulty</GrayTypography>
                <RadioGroup
                  style={{ columnGap: "2rem" }}
                  row
                  aria-label="question type"
                  value={values.questionType}
                  name="questionType"
                  // onChange={handleFormData}
                  onChange={(e) => {
                    handleFormData(e);
                    handleChange(e);
                    // handleFormData();
                  }}
                >
                  <FormControlLabel
                    value={DIFFICULTY.EASY}
                    control={<Radio color="primary" />}
                    label="Easy"
                  />

                  <FormControlLabel
                    value={DIFFICULTY.MEDIUM}
                    control={<Radio color="primary" />}
                    label="Medium"
                  />
                  <FormControlLabel
                    value={DIFFICULTY.HARD}
                    control={<Radio color="primary" />}
                    label="Hard"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div
              className={classes.formItem}
              style={{
                border: "1px solid 	#C0C0C0",
                borderRadius: "10px",
                padding: "25px",
              }}
            >
              <GrayTypography>Question</GrayTypography>
              <DraftEditor
                placeholder="Enter question here..."
                initialValue={values.questionTitle}
                name="questionTitle"
                // setFieldValue={setFieldValue}
                handleQuestion={handleFormData}
                error={touched.questionTitle && errors.questionTitle}
              />
            </div>

            <div className={classes.formItem}>
              <GrayTypography>Options</GrayTypography>
              {["", "", "", ""].map((option, i) => (
                <Box display="flex" alignItems="center" ml={"-10px"} key={i}>
                  <Tooltip
                    title={
                      values.options[i]?.isCorrect
                        ? "Correct Option"
                        : "Incorrect Option"
                    }
                  >
                    <Checkbox
                      color="primary"
                      name={`options.${i}.isCorrect`}
                      checked={formData.options[i]?.isCorrect}
                      onChange={(e) =>
                        handleOptionChange({
                          newValue: e.target.checked,
                          i,
                          // name: `options.${i}.isCorrect`,
                          name: i,
                          setFieldValue,
                          options: values.options,
                        })
                      }
                    />
                  </Tooltip>
                  <span
                    style={{
                      border: "1px solid 	#C0C0C0",
                      borderRadius: "10px",
                      padding: "25px",
                    }}
                  >
                    <DraftEditor
                      placeholder="Enter option here..."
                      initialValue={values.options[i]?.option}
                      name={`options.${i}.option`}
                      handleFormData={handleOptionsName}
                      index={i}
                      // setFieldValue={setFieldValue}
                      error={
                        touched?.options?.[i]?.option &&
                        errors?.options?.[i]?.option
                      }
                    />
                  </span>
                </Box>
              ))}
            </div>

            <div
              className={classes.formItem}
              style={{
                border: "1px solid 	#C0C0C0",
                borderRadius: "10px",
                padding: "25px",
              }}
            >
              <GrayTypography>Explaination</GrayTypography>

              <DraftEditor
                placeholder="Enter explaination about question's answer here..."
                initialValue={values.explaination}
                handleQuestion={handleFormData}
                name="explaination"
                setFieldValue={setFieldValue}
                error={touched.explaination && errors.explaination}
              />
            </div>
            {showAlert.open && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {showAlert.message}
              </Alert>
            )}
            <Button
              // disabled={loading}
              onClick={handleSubmitForm}
              variant="contained"
            >
              {loading ? (
                <CircularProgress size="1.4rem" thickness={5} />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        )}
      </Formik>
    </Container>
  );
}

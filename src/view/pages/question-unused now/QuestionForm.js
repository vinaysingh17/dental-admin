import {
  makeStyles,
  Typography,
  TextField,
  Button as MuiButton,
  Box,
  IconButton,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel as MuiFormLabel,
  FormControl,
  Checkbox,
  Tooltip,
} from "@material-ui/core";
import { Formik } from "formik";
import * as yup from "yup";
import { Close as CloseIcon } from "@material-ui/icons";
import styled from "styled-components";
import { spacing } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuestion,
  updateQuestion,
  questionSelectors,
} from "../../../application/reducers/questionSlice";
import { useMemo } from "react";
import { globalSelectors } from "../../../application/reducers/globalSlice";

const FormLabel = styled(MuiFormLabel)({
  fontSize: "0.95rem",
});

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
    maxHeight: "calc(100% - 40px)",
  },
}));

const Button = styled(MuiButton)(spacing);

const useSelectedQuestion = (id) => {
  const questions = useSelector(questionSelectors.getQuestions);

  const selectedQuestion = useMemo(() => {
    return questions.filter((question) => question.id === id);
  }, [id, questions]);

  return selectedQuestion[0] ? selectedQuestion[0] : null;
};

const addInitialValues = {
  // subject: "61586d91f8b2c54a2432c130",
  // topic: "61586dce8b53164a7fc5882f",
  // subtopic: "61586df996f3034ab3f2ab1e",
  questionTitle: "What is Anatomy?",
  questionType: "MEDIUM",
  options: [
    {
      option: "Science Subject",
      isCorrect: true,
    },
    {
      option: "Account Subject",
      isCorrect: false,
    },
    {
      option: "Computer Subject",
      isCorrect: false,
    },
    {
      option: "Dark Subject",
      isCorrect: false,
    },
  ],
  explaination: "Anatomy is something that you do not perform yourself.",
};

const validationSchema = yup.object({
  questionTitle: yup.string().required().label("Question Title"),
  questionType: yup.string().required(),
  options: yup.array().of(
    yup.object({
      option: yup.string().required().label("Option Name"),
      isCorrect: yup.boolean().required(),
    })
  ),
  explaination: yup.string().required().label("Explaination"),
});

export default function QuestionForm({ closeForm, editQuestionId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedQuestion = useSelectedQuestion(editQuestionId);

  const { loading } = useSelector(questionSelectors.getQuestionUi.form);
  const { selectedSubject, selectedTopic, selectedSubTopic } = useSelector(
    globalSelectors.getGlobals
  );

  const handleAddSubmit = async (values, { resetForm }) => {
    const payload = {
      ...values,
      subject: selectedSubject.id,
      topic: selectedTopic.id,
      subtopic: selectedSubTopic.id,
    };

    const result = await dispatch(createQuestion({ questionData: payload }));

    if (result.type === "question/createQuestion/fulfilled") {
      resetForm();
      closeForm();
    }
  };

  const handleEditSubmit = async (values) => {
    const payload = { ...values };
    if (payload.password?.length === 0) delete payload.password;

    const result = await dispatch(updateQuestion({ questionData: payload }));
    if (result.type === "question/updateQuestion/fulfilled") {
      closeForm();
    }
  };

  const editInitialValues = {
    id: selectedQuestion?.id,
    name: selectedQuestion?.name,
    mobile: selectedQuestion?.mobile,
    department: selectedQuestion?.department,
    password: selectedQuestion?.password,
  };
  return (
    <Formik
      initialValues={
        Boolean(editQuestionId) ? editInitialValues : addInitialValues
      }
      validationSchema={validationSchema}
      onSubmit={Boolean(editQuestionId) ? handleEditSubmit : handleAddSubmit}
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
              {Boolean(editQuestionId) ? "Edit Question" : "Add New Question"}
            </Typography>
            <IconButton onClick={closeForm}>
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{ overflow: "hidden", height: "calc(100vh - 64px)" }}>
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
                aria-readonly
                InputProps={{ readOnly: true }}
                variant="outlined"
                label="Sub-Topic"
                value={selectedSubTopic.title}
              />

              <TextField
                variant="outlined"
                id="questionTitle"
                label="Question Title"
                name={"questionTitle"}
                placeholder="Anatomy"
                value={values.questionTitle}
                error={Boolean(touched.questionTitle && errors.questionTitle)}
                helperText={touched.questionTitle && errors.questionTitle}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <FormControl component="fieldset" style={{ marginTop: "0.5rem" }}>
                <FormLabel component="legend">Difficulty</FormLabel>
                <RadioGroup
                  row
                  aria-label="question type"
                  value={values.questionType}
                  name="questionType"
                  onChange={handleChange}
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

              <FormLabel component="legend">Options</FormLabel>
              {values.options.map((option, i) => (
                <Box display="flex" alignItems="center" key={i}>
                  <Tooltip title="Title">
                    <Checkbox
                      name={`options.${i}.isCorrect`}
                      checked={option.isCorrect}
                      onChange={handleChange}
                    />
                  </Tooltip>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={`options.${i}.option`}
                    placeholder="Anatomy"
                    value={values.options?.[i]?.option}
                    error={Boolean(
                      touched.options?.[i]?.option &&
                        errors.options?.[i]?.option
                    )}
                    helperText={
                      touched.options?.[i]?.option &&
                      errors.options?.[i]?.option
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Box>
              ))}

              <TextField
                multiline
                minRows={2}
                maxRows={4}
                variant="outlined"
                id="explaination"
                label="Explaination"
                name={"explaination"}
                placeholder="Anatomy"
                value={values.explaination}
                error={Boolean(touched.explaination && errors.explaination)}
                helperText={touched.explaination && errors.explaination}
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
                ) : Boolean(editQuestionId) ? (
                  "Edit Question"
                ) : (
                  "Add Question"
                )}
              </Button>
            </div>
          </div>
        </Box>
      )}
    </Formik>
  );
}

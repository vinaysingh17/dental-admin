import { useCallback, useEffect, useRef, useState } from "react";
import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete as MuiAutocomplete } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { useFormikContext } from "formik";
import axios from "axios";
import { fetchSearchTopics } from "../../../application/reducers/topicSlice";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-root": {
      padding: "3px 9px",
    },
  },
}));

export default function TopicAutocomplete({
  name,
  error,
  helperText,
  subjectId,
  label,
}) {
  const classes = useStyles();
  const {
    // values,
    // errors,
    // touched: formikTouched,
    handleBlur,
    setFieldValue,
  } = useFormikContext();
  const dispatch = useDispatch();

  const [autoCompleteState, _setState] = useState({
    value: null,
    options: [],
    loading: false,
  });

  const setState = useCallback((newState) => {
    if (newState.options)
      // if you have options in newState then it will map them to mappedOptions and then set state
      _setState((state) => ({
        ...state,
        ...newState,
        options: newState.options,
      }));
    else _setState((state) => ({ ...state, ...newState })); // otherwise just set state.
  }, []);

  const handleChange = useCallback(
    async (_, option) => {
      setState({ value: option });
      setFieldValue(name, option.id);
    },
    [name, setFieldValue, setState]
  );

  const cancelTokenSource = useRef(null);
  const handleInputChange = async (e) => {
    if (cancelTokenSource.current) {
      // means there is a source for previous request so cancel that req. and set loading false
      cancelTokenSource.current.cancel();
    }

    // set a cancelToken
    cancelTokenSource.current = axios.CancelToken.source();

    const newValue = e.target.value;
    setState({ loading: true });
    const { payload } = await dispatch(
      fetchSearchTopics({
        search: newValue,
        cancelToken: cancelTokenSource.current?.token,
        subjectId,
      })
    );
    if (!payload)
      // do nothing if you do not get appropriate data
      return;

    setState({ loading: false, options: payload });
  };

  useEffect(() => {
    (async () => {
      // NEW CASE: fetch 5 top options to prefill the list.
      setFieldValue(name, null);
      setState({ loading: true, value: null, options: [] });
      const { payload } = await dispatch(
        fetchSearchTopics({ search: "", subjectId })
      );

      if (!payload || payload?.length === 0)
        // do nothing if you do not get appropriate data
        return setState({ loading: false });

      setState({ loading: false, options: payload });
    })();
  }, [dispatch, name, setFieldValue, setState, subjectId]);

  return (
    <MuiAutocomplete
      id={name}
      disableClearable
      name={name}
      options={autoCompleteState.options}
      filterOptions={(x) => x}
      className={classes.root}
      getOptionSelected={(option, value) => option.id === value.id}
      getOptionLabel={(option) => `${option.title} (${option.subject.title})`}
      value={autoCompleteState.value}
      loading={autoCompleteState.loading}
      onChange={handleChange}
      onBlur={handleBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          onChange={handleInputChange}
          error={error}
          helperText={helperText}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {autoCompleteState.loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

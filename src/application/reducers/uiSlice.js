const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const getDialogState = (state) => state.ui.dialog;
const getAlertState = (state) => state.ui.alert;

const askConfirmation = createAsyncThunk(
  "ui/askConfirmation",
  async ({ title, description }, { rejectWithValue, dispatch }) => {
    await new Promise((resolve, reject) => {
      dispatch(
        actions.showDialog({ title, description, promise: { resolve, reject } })
      );
    }).finally((_) => {
      dispatch(actions.hideDialog());
    });
  }
);

const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    dialog: {
      show: false,
      display: {
        title: "",
        description: "",
      },
      promise: null,
    },
    alert: {
      show: false,
      type: ALERT_TYPES.SUCCESS,
      message: "",
    },
  },
  reducers: {
    showDialog: (state, { payload: { title, description, promise } }) => {
      state.dialog.show = true;
      state.dialog.display = {
        title: title,
        description: description,
      };
      state.dialog.promise = promise;
    },
    hideDialog: (state) => {
      state.dialog.show = false;
      state.dialog.promise = null;
    },

    showAlert: (state, { payload }) => {
      state.alert = {
        show: true,
        type: payload.type,
        message: payload.message,
      };
    },
    hideAlert: (state) => {
      state.alert.show = false;
    },
  },
});

export default uiSlice.reducer;

const { ...actions } = uiSlice.actions;
export { actions, getDialogState, askConfirmation, getAlertState, ALERT_TYPES };

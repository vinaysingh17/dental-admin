const { createSlice } = require("@reduxjs/toolkit");

const globalSelectors = {
  getGlobals: (state) => state.global,
};

const globalSlice = createSlice({
  name: "global",
  initialState: {
    selectedSubject: null,
    selectedTopic: null,
  },
  reducers: {
    resetGlobals: (state, { payload }) => {
      if (payload.subject) state.selectedSubject = null;
      if (payload.topic) state.selectedTopic = null;
    },
    setSubject: (state, { payload }) => {
      state.selectedSubject = {
        id: payload.id,
        title: payload.title,
      };
      state.selectedTopic = null;
    },

    setTopic: (state, { payload }) => {
      state.selectedTopic = {
        id: payload.id,
        title: payload.title,
      };
    },
  },
});

const globalActions = globalSlice.actions;

export { globalSelectors, globalActions };

export default globalSlice.reducer;

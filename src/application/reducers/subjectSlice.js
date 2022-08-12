import { askConfirmation, actions as uiActions, ALERT_TYPES } from "./uiSlice";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const subjectSelectors = {
  getSubjects: (state) => state.subject.entities,
  getSubjectUi: {
    fetchSubjects: (state) => state.subject.ui.fetchSubjects,
    form: (state) => state.subject.ui.form,
  },
  getSubjectPagination: (state) => state.subject.pagination,
};

const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",
  async ({ limit, page, search }, { extra: api }) => {
    const data = await api.subject.fetchSubjects({
      limit,
      page,
      search,
    });

    data.page = page;
    data.limit = limit;

    return data;
  }
);

const fetchSearchSubjects = createAsyncThunk(
  // "subject/fetchSubjectsForSearch",
  "package",
  async ({ search, cancelToken }, { extra: api }) => {
    const data = await api.subject.fetchSubjectsForSearch({
      limit: 10,
      cancelToken,
      search,
    });

    return data.data;
  }
);

const createSubject = createAsyncThunk(
  "subject/createSubject",
  async ({ subjectData }, { extra: api, dispatch, getState }) => {
    const data = await api.subject.createSubject(subjectData);
    const { limit, currentPage: page } = subjectSelectors.getSubjectPagination(
      getState()
    );

    if (data.success) {
      dispatch(fetchSubjects({ limit, page }));
    }
    return data.data;
  }
);
const deleteSubject = createAsyncThunk(
  "subject/deleteSubject",
  async ({ id }, { extra: api, dispatch, getState, rejectWithValue }) => {
    const { type } = await dispatch(
      askConfirmation({
        title: "Delete Subject",
        description: "Are you sure that you want to delete this subject?",
      })
    );

    if (type === "ui/askConfirmation/rejected") {
      return rejectWithValue("Deletion cancelled.");
    }

    const data = await api.subject.deleteSubject(id);
    const { limit, currentPage: page } = subjectSelectors.getSubjectPagination(
      getState()
    );

    if (data.success) {
      dispatch(
        uiActions.showAlert({
          type: ALERT_TYPES.SUCCESS,
          message: "Subject deleted successfully.",
        })
      );
      dispatch(fetchSubjects({ limit, page }));
    }
    return data.data;
  }
);

const updateSubject = createAsyncThunk(
  "subject/updateSubject",
  async ({ subjectData }, { extra: api, dispatch, getState }) => {
    const data = await api.subject.updateSubject(subjectData);

    const { limit, currentPage: page } = subjectSelectors.getSubjectPagination(
      getState()
    );

    if (data.success) {
      dispatch(fetchSubjects({ limit, page }));
    }
    return data.data;
  }
);

const limitInitVal = 10;

const subjectSlice = createSlice({
  name: "subject",
  initialState: {
    entities: null,
    pagination: {
      limit: limitInitVal,
      currentPage: 1,
      totalEntries: -1,
      emptyRows: limitInitVal,
    },
    ui: {
      fetchSubjects: {},
      form: {},
    },
  },
  reducers: {
    changePage: (state, { payload }) => {
      state.pagination.currentPage = payload.page;
    },
    changeLimit: (state, { payload }) => {
      state.pagination.currentPage = 1;
      state.pagination.limit = payload.limit;
    },
  },
  extraReducers: {
    [fetchSubjects.pending]: (state, action) => {
      state.ui.fetchSubjects.loading = true;
      state.ui.fetchSubjects.error = null;
    },
    [fetchSubjects.fulfilled]: (state, { payload }) => {
      state.ui.fetchSubjects.loading = false;
      state.entities = payload.data;
      state.pagination.totalEntries = payload.count;

      const { limit, totalEntries, currentPage } = state.pagination;
      state.pagination.emptyRows =
        limit - Math.min(limit, totalEntries - (currentPage - 1) * limit);
    },
    [fetchSubjects.rejected]: (state, action) => {
      state.ui.fetchSubjects.loading = false;
      state.ui.fetchSubjects.error = action.error.message;
    },
    [createSubject.pending]: (state, action) => {
      state.ui.form.loading = true;
      state.ui.form.error = null;
    },
    [createSubject.fulfilled]: (state) => {
      state.ui.form.loading = false;
    },
    [createSubject.rejected]: (state, action) => {
      state.ui.form.loading = false;
      state.ui.form.error = "Failed to create new subject.";
    },
    [updateSubject.pending]: (state, action) => {
      state.ui.form.loading = true;
      state.ui.form.error = null;
    },
    [updateSubject.fulfilled]: (state) => {
      state.ui.form.loading = false;
    },
    [updateSubject.rejected]: (state, action) => {
      state.ui.form.loading = false;
      state.ui.form.error = "Failed to edit subject.";
    },
    [deleteSubject.pending]: (state, action) => {
      const index = state.entities.findIndex(
        (subject) => subject.id === action.meta.arg.id
      );
      state.entities[index].deleting = true;
    },
    [deleteSubject.rejected]: (state, action) => {
      const index = state.entities.findIndex(
        (subject) => subject.id === action.meta.arg.id
      );
      delete state.entities[index].deleting;
    },
  },
});

const subjectActions = subjectSlice.actions;

export {
  subjectSelectors,
  subjectActions,
  fetchSubjects,
  fetchSearchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};

export default subjectSlice.reducer;

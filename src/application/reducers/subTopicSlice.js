import { globalSelectors } from "./globalSlice";
import { askConfirmation, actions as uiActions, ALERT_TYPES } from "./uiSlice";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const subTopicSelectors = {
  getSubTopics: (state) => state.subTopic.entities,
  getTopicId: (state) => state.subTopic.topicId,
  getSubTopicUi: {
    fetchSubTopics: (state) => state.subTopic.ui.fetchSubTopics,
    form: (state) => state.subTopic.ui.form,
  },
  getSubTopicPagination: (state) => state.subTopic.pagination,
};

const fetchSubTopics = createAsyncThunk(
  "subTopic/fetchSubTopics",
  async ({ limit, page, search }, { extra: api, getState }) => {
    const topicId = globalSelectors.getGlobals(getState()).selectedTopic.id;

    const data = await api.subTopic.fetchSubTopics({
      limit,
      page,
      search,
      topicId,
    });

    data.page = page;
    data.limit = limit;

    return data;
  }
);

const fetchSearchSubTopics = createAsyncThunk(
  "subTopic/fetchSubTopicsForSearch",
  async ({ search, cancelToken, topicId }, { extra: api, getState }) => {
    const data = await api.subTopic.fetchSubTopicsForSearch({
      limit: 10,
      cancelToken,
      search,
      topicId,
    });

    return data.data;
  }
);

const createSubTopic = createAsyncThunk(
  "subTopic/createSubTopic",
  async ({ subTopicData }, { extra: api, dispatch, getState }) => {
    const data = await api.subTopic.createSubTopic(subTopicData);

    const { limit, currentPage: page } =
      subTopicSelectors.getSubTopicPagination(getState());
    const topicId = globalSelectors.getGlobals(getState()).selectedTopic.id;

    if (data.success) {
      dispatch(fetchSubTopics({ limit, page, topicId }));
    }
    return data.data;
  }
);

const deleteSubTopic = createAsyncThunk(
  "subTopic/deleteSubTopic",
  async ({ id }, { extra: api, dispatch, getState, rejectWithValue }) => {
    const { type } = await dispatch(
      askConfirmation({
        title: "Delete SubTopic",
        description: "Are you sure that you want to delete this subTopic?",
      })
    );

    if (type === "ui/askConfirmation/rejected") {
      return rejectWithValue("Deletion cancelled.");
    }

    const data = await api.subTopic.deleteSubTopic(id);
    const { limit, currentPage: page } =
      subTopicSelectors.getSubTopicPagination(getState());
    const topicId = globalSelectors.getGlobals(getState()).selectedTopic.id;

    if (data.success) {
      dispatch(
        uiActions.showAlert({
          type: ALERT_TYPES.SUCCESS,
          message: "SubTopic deleted successfully.",
        })
      );
      dispatch(fetchSubTopics({ limit, page, topicId }));
    }
    return data.data;
  }
);

const updateSubTopic = createAsyncThunk(
  "subTopic/updateSubTopic",
  async ({ subTopicData }, { extra: api, dispatch, getState }) => {
    const data = await api.subTopic.updateSubTopic(subTopicData);

    const { limit, currentPage: page } =
      subTopicSelectors.getSubTopicPagination(getState());
    const topicId = globalSelectors.getGlobals(getState()).selectedTopic.id;

    if (data.success) {
      dispatch(fetchSubTopics({ limit, page, topicId }));
    }
    return data.data;
  }
);

const limitInitVal = 10;

const subTopicSlice = createSlice({
  name: "subTopic",
  initialState: {
    entities: null,
    topicId: null, // only for resetting data in fetchSubTopics
    pagination: {
      limit: limitInitVal,
      currentPage: 1,
      totalEntries: -1,
      emptyRows: limitInitVal,
    },
    ui: {
      fetchSubTopics: {},
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
    [fetchSubTopics.pending]: (state, action) => {
      state.ui.fetchSubTopics.loading = true;
      state.ui.fetchSubTopics.error = null;

      if (state.topicId !== action.meta.arg.topicId) {
        state.entities = null;
        state.pagination = {
          limit: limitInitVal,
          currentPage: 1,
          totalEntries: -1,
          emptyRows: limitInitVal,
        };
      }
    },
    [fetchSubTopics.fulfilled]: (state, { payload, meta }) => {
      state.ui.fetchSubTopics.loading = false;
      state.entities = payload.data;
      state.pagination.totalEntries = payload.count;
      state.topicId = meta.arg.topicId;

      const { limit, totalEntries, currentPage } = state.pagination;
      state.pagination.emptyRows =
        limit - Math.min(limit, totalEntries - (currentPage - 1) * limit);
    },
    [fetchSubTopics.rejected]: (state, action) => {
      state.ui.fetchSubTopics.loading = false;
      state.ui.fetchSubTopics.error = action.error.message;
    },
    [createSubTopic.pending]: (state, action) => {
      state.ui.form.loading = true;
      state.ui.form.error = null;
    },
    [createSubTopic.fulfilled]: (state) => {
      state.ui.form.loading = false;
    },
    [createSubTopic.rejected]: (state, action) => {
      state.ui.form.loading = false;
      state.ui.form.error = "Failed to create new subTopic.";
    },
    [updateSubTopic.pending]: (state, action) => {
      state.ui.form.loading = true;
      state.ui.form.error = null;
    },
    [updateSubTopic.fulfilled]: (state) => {
      state.ui.form.loading = false;
    },
    [updateSubTopic.rejected]: (state, action) => {
      state.ui.form.loading = false;
      state.ui.form.error = "Failed to edit subTopic.";
    },
    [deleteSubTopic.pending]: (state, action) => {
      const index = state.entities.findIndex(
        (subTopic) => subTopic.id === action.meta.arg.id
      );
      state.entities[index].deleting = true;
    },
    [deleteSubTopic.rejected]: (state, action) => {
      const index = state.entities.findIndex(
        (subTopic) => subTopic.id === action.meta.arg.id
      );
      delete state.entities[index].deleting;
    },
  },
});

const subTopicActions = subTopicSlice.actions;

export {
  subTopicSelectors,
  subTopicActions,
  fetchSubTopics,
  createSubTopic,
  updateSubTopic,
  deleteSubTopic,
  fetchSearchSubTopics,
};

export default subTopicSlice.reducer;

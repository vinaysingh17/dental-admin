import { globalSelectors } from "./globalSlice";
import { askConfirmation, actions as uiActions, ALERT_TYPES } from "./uiSlice";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const topicSelectors = {
  getTopics: (state) => state.topic.entities,
  getSubjectId: (state) => state.topic.subjectId,
  getTopicUi: {
    fetchTopics: (state) => state.topic.ui.fetchTopics,
    form: (state) => state.topic.ui.form,
  },
  getTopicPagination: (state) => state.topic.pagination,
};

const fetchTopics = createAsyncThunk(
  "topic/fetchTopics",
  async ({ limit, page, search }, { extra: api, getState }) => {
    const subjectId = globalSelectors.getGlobals(getState()).selectedSubject.id;

    const data = await api.topic.fetchTopics({
      limit,
      page,
      search,
      subjectId,
    });

    data.page = page;
    data.limit = limit;

    return data;
  }
);

const fetchSearchTopics = createAsyncThunk(
  "topic/fetchTopicsForSearch",
  async ({ search, cancelToken, subjectId }, { extra: api, getState }) => {
    const data = await api.topic.fetchTopicsForSearch({
      limit: 10,
      cancelToken,
      search,
      subjectId,
    });

    return data.data;
  }
);

const createTopic = createAsyncThunk(
  "topic/createTopic",
  async ({ topicData }, { extra: api, dispatch, getState }) => {
    const data = await api.topic.createTopic(topicData);

    const { limit, currentPage: page } = topicSelectors.getTopicPagination(
      getState()
    );
    const subjectId = globalSelectors.getGlobals(getState()).selectedSubject.id;

    if (data.success) {
      dispatch(fetchTopics({ limit, page, subjectId }));
    }
    return data.data;
  }
);

const deleteTopic = createAsyncThunk(
  "topic/deleteTopic",
  async ({ id }, { extra: api, dispatch, getState, rejectWithValue }) => {
    const { type } = await dispatch(
      askConfirmation({
        title: "Delete Topic",
        description: "Are you sure that you want to delete this topic?",
      })
    );

    if (type === "ui/askConfirmation/rejected") {
      return rejectWithValue("Deletion cancelled.");
    }

    const data = await api.topic.deleteTopic(id);
    const { limit, currentPage: page } = topicSelectors.getTopicPagination(
      getState()
    );
    const subjectId = globalSelectors.getGlobals(getState()).selectedSubject.id;

    if (data.success) {
      dispatch(
        uiActions.showAlert({
          type: ALERT_TYPES.SUCCESS,
          message: "Topic deleted successfully.",
        })
      );
      dispatch(fetchTopics({ limit, page, subjectId }));
    }
    return data.data;
  }
);

const updateTopic = createAsyncThunk(
  "topic/updateTopic",
  async ({ topicData }, { extra: api, dispatch, getState }) => {
    const data = await api.topic.updateTopic(topicData);

    const { limit, currentPage: page } = topicSelectors.getTopicPagination(
      getState()
    );
    const subjectId = globalSelectors.getGlobals(getState()).selectedSubject.id;

    if (data.success) {
      dispatch(fetchTopics({ limit, page, subjectId }));
    }
    return data.data;
  }
);

const limitInitVal = 10;

const topicSlice = createSlice({
  name: "topic",
  initialState: {
    entities: null,
    subjectId: null, // only for resetting data in fetchTopics
    pagination: {
      limit: limitInitVal,
      currentPage: 1,
      totalEntries: -1,
      emptyRows: limitInitVal,
    },
    ui: {
      fetchTopics: {},
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
    [fetchTopics.pending]: (state, action) => {
      state.ui.fetchTopics.loading = true;
      state.ui.fetchTopics.error = null;
      if (state.subjectId !== action.meta.arg.subjectId) {
        state.entities = null;
        state.pagination = {
          limit: limitInitVal,
          currentPage: 1,
          totalEntries: -1,
          emptyRows: limitInitVal,
        };
      }
    },
    [fetchTopics.fulfilled]: (state, { payload, meta }) => {
      state.ui.fetchTopics.loading = false;
      state.entities = payload.data;
      state.pagination.totalEntries = payload.count;
      const { limit, totalEntries, currentPage } = state.pagination;
      state.pagination.emptyRows =
        limit - Math.min(limit, totalEntries - (currentPage - 1) * limit);

      state.subjectId = meta.arg.subjectId;
    },
    [fetchTopics.rejected]: (state, action) => {
      state.ui.fetchTopics.loading = false;
      state.ui.fetchTopics.error = action.error.message;
    },
    [createTopic.pending]: (state, action) => {
      state.ui.form.loading = true;
      state.ui.form.error = null;
    },
    [createTopic.fulfilled]: (state) => {
      state.ui.form.loading = false;
    },
    [createTopic.rejected]: (state, action) => {
      state.ui.form.loading = false;
      state.ui.form.error = "Failed to create new topic.";
    },
    [updateTopic.pending]: (state, action) => {
      state.ui.form.loading = true;
      state.ui.form.error = null;
    },
    [updateTopic.fulfilled]: (state) => {
      state.ui.form.loading = false;
    },
    [updateTopic.rejected]: (state, action) => {
      state.ui.form.loading = false;
      state.ui.form.error = "Failed to edit topic.";
    },
    [deleteTopic.pending]: (state, action) => {
      const index = state.entities.findIndex(
        (topic) => topic.id === action.meta.arg.id
      );
      state.entities[index].deleting = true;
    },
    [deleteTopic.rejected]: (state, action) => {
      const index = state.entities.findIndex(
        (topic) => topic.id === action.meta.arg.id
      );
      delete state.entities[index].deleting;
    },
  },
});

const topicActions = topicSlice.actions;

export {
  topicSelectors,
  topicActions,
  fetchTopics,
  fetchSearchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
};

export default topicSlice.reducer;

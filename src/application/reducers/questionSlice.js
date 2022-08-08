import { globalSelectors } from "./globalSlice";
import { askConfirmation, actions as uiActions, ALERT_TYPES } from "./uiSlice";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const questionSelectors = {
  getQuestions: (state) => state.question.entities,
  getTopicId: (state) => state.question.subTopicId,
  getQuestionUi: {
    fetchQuestions: (state) => state.question.ui.fetchQuestions,
    form: (state) => state.question.ui.form,
  },
  getQuestionPagination: (state) => state.question.pagination,
};

const fetchQuestions = createAsyncThunk(
  // "question/fetchQuestions",
  "package-question/user",
  async ({ limit, page, search }, { extra: api, getState }) => {
    // const subTopicId = globalSelectors.getGlobals(getState()).selectedSubTopic
    //   .id;

    const data = await api.question.fetchQuestions({
      limit,
      page,
      search,
    });

    data.page = page;
    data.limit = limit;

    return data;
  }
);

const createQuestion = createAsyncThunk(
  "question/createQuestion",
  async ({ questionData }, { extra: api, dispatch, getState }) => {
    const data = await api.question.createQuestion(questionData);

    // const { limit, currentPage: page } =
    //   questionSelectors.getQuestionPagination(getState());

    dispatch(
      uiActions.showAlert({
        type: ALERT_TYPES.SUCCESS,
        message: "Question created successfully!",
      })
    );

    // if (data.success) {
    //   dispatch(fetchQuestions({ limit, page, subTopicId }));
    // }
    return data.data;
  }
);

const deleteQuestion = createAsyncThunk(
  "question/deleteQuestion",
  async ({ id }, { extra: api, dispatch, getState, rejectWithValue }) => {
    const { type } = await dispatch(
      askConfirmation({
        title: "Delete Question",
        description: "Are you sure that you want to delete this question?",
      })
    );

    if (type === "ui/askConfirmation/rejected") {
      return rejectWithValue("Deletion cancelled.");
    }

    const data = await api.question.deleteQuestion(id);
    const { limit, currentPage: page } =
      questionSelectors.getQuestionPagination(getState());
    const subTopicId = globalSelectors.getGlobals(getState()).selectedSubTopic
      .id;

    if (data.success) {
      dispatch(
        uiActions.showAlert({
          type: ALERT_TYPES.SUCCESS,
          message: "Question deleted successfully.",
        })
      );
      dispatch(fetchQuestions({ limit, page, subTopicId }));
    }
    return data.data;
  }
);

const updateQuestion = createAsyncThunk(
  "question/updateQuestion",
  async ({ questionData }, { extra: api, dispatch, getState }) => {
    const data = await api.question.updateQuestion(questionData);

    const { limit, currentPage: page } =
      questionSelectors.getQuestionPagination(getState());
    const subTopicId = globalSelectors.getGlobals(getState()).selectedSubTopic
      .id;

    if (data.success) {
      dispatch(fetchQuestions({ limit, page, subTopicId }));
    }
    return data.data;
  }
);

const limitInitVal = 10;

const questionSlice = createSlice({
  name: "question",
  initialState: {
    entities: null,
    subTopicId: null, // only for resetting data in fetchQuestions
    pagination: {
      limit: limitInitVal,
      currentPage: 1,
      totalEntries: -1,
      emptyRows: limitInitVal,
    },
    ui: {
      fetchQuestions: {},
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
    [fetchQuestions.pending]: (state, action) => {
      state.ui.fetchQuestions.loading = true;
      state.ui.fetchQuestions.error = null;

      // if (state.subTopicId !== action.meta.arg.subTopicId) {
      //   state.entities = null;
      //   state.pagination = {
      //     limit: limitInitVal,
      //     currentPage: 1,
      //     totalEntries: -1,
      //     emptyRows: limitInitVal,
      //   };
      // }
    },
    [fetchQuestions.fulfilled]: (state, { payload, meta }) => {
      state.ui.fetchQuestions.loading = false;
      state.entities = payload.data;
      state.pagination.totalEntries = payload.count;
      state.subTopicId = meta.arg.subTopicId;

      const { limit, totalEntries, currentPage } = state.pagination;
      state.pagination.emptyRows =
        limit - Math.min(limit, totalEntries - (currentPage - 1) * limit);
    },
    [fetchQuestions.rejected]: (state, action) => {
      state.ui.fetchQuestions.loading = false;
      state.ui.fetchQuestions.error = action.error.message;
    },
    [createQuestion.pending]: (state, action) => {
      state.ui.form.loading = true;
      state.ui.form.error = null;
    },
    [createQuestion.fulfilled]: (state) => {
      state.ui.form.loading = false;
    },
    [createQuestion.rejected]: (state, action) => {
      state.ui.form.loading = false;
      state.ui.form.error = "Failed to create new question.";
    },
    [updateQuestion.pending]: (state, action) => {
      state.ui.form.loading = true;
      state.ui.form.error = null;
    },
    [updateQuestion.fulfilled]: (state) => {
      state.ui.form.loading = false;
    },
    [updateQuestion.rejected]: (state, action) => {
      state.ui.form.loading = false;
      state.ui.form.error = "Failed to edit question.";
    },
    [deleteQuestion.pending]: (state, action) => {
      const index = state.entities.findIndex(
        (question) => question.id === action.meta.arg.id
      );
      state.entities[index].deleting = true;
    },
    [deleteQuestion.rejected]: (state, action) => {
      const index = state.entities.findIndex(
        (question) => question.id === action.meta.arg.id
      );
      delete state.entities[index].deleting;
    },
  },
});

const questionActions = questionSlice.actions;

export {
  questionSelectors,
  questionActions,
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

export default questionSlice.reducer;

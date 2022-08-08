import api from "../utils/axios";

const questionService = {
  fetchQuestions: ({ limit, page, search, subTopicId }) =>
    api.get("/question", { params: { limit, page, search, subTopicId } }),
  fetchQuestionById: (id) => api.get(`/question/${id}`),
  createQuestion: (payload) => api.post("/question", payload),
  updateQuestion: (payload) => api.put(`/question/${payload.id}`, payload),
  deleteQuestion: (id) => api.delete(`/question/${id}`),
};

export default questionService;

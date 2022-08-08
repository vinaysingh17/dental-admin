import api from "../utils/axios";

const topicService = {
  fetchTopics: ({ limit, page, search, subjectId }) =>
    api.get("/topic", { params: { limit, page, search, subjectId } }),
  fetchTopicsForSearch: ({ limit, search, cancelToken, subjectId }) =>
    api.get("/topic", { params: { limit, search, subjectId }, cancelToken }),
  fetchTopicById: (id) => api.get(`/topic/${id}`),
  createTopic: (payload) => api.post("/topic", payload),
  updateTopic: (payload) => api.put(`/topic/${payload.id}`, payload),
  deleteTopic: (id) => api.delete(`/topic/${id}`),
};

export default topicService;

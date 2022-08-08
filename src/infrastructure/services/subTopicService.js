import api from "../utils/axios";

const subTopicService = {
  fetchSubTopics: ({ limit, page, search, topicId }) =>
    api.get("/subtopic", { params: { limit, page, search, topicId } }),
  fetchSubTopicsForSearch: ({ limit, search, cancelToken, topicId }) =>
    api.get("/subtopic", { params: { limit, search, topicId }, cancelToken }),
  fetchSubTopicById: (id) => api.get(`/subtopic/${id}`),
  createSubTopic: (payload) => api.post("/subtopic", payload),
  updateSubTopic: (payload) => api.put(`/subtopic/${payload.id}`, payload),
  deleteSubTopic: (id) => api.delete(`/subtopic/${id}`),
};

export default subTopicService;

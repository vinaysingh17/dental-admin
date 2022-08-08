import api from "../utils/axios";

const subjectService = {
  fetchSubjects: ({ limit, page, search }) =>
    api.get("/subject", { params: { limit, page, search } }),
  fetchSubjectsForSearch: ({ limit, search, cancelToken }) =>
    api.get("/subject", { params: { limit, search }, cancelToken }),
  fetchSubjectById: (id) => api.get(`/subject/${id}`),
  createSubject: (payload) => api.post("/subject", payload),
  updateSubject: (payload) => api.put(`/subject/${payload.id}`, payload),
  deleteSubject: (id) => api.delete(`/subject/${id}`),
};

export default subjectService;

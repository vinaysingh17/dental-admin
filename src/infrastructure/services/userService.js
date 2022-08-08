import api from '../utils/axios';

const userService = {
    fetchUsers: ({ limit, page, search }) => api.get("profile/all/user", { params: { limit, page, search } }),
    fetchProfile: ({ id }) => api.get(`profile/${id}`),
    fetchDashboardUserData: ({ id }) => api.get(`dashboard/getusedinfo/${id}`),
}

export default userService;

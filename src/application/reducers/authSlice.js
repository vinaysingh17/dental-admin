const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const getAuth = (state) => state.auth;
const getAuthUI = {
  login: (state) => state.auth.ui.login,
  signup: (state) => state.auth.ui.signup,
  refreshToken: (state) => state.auth.ui.refreshToken,
};

const login = createAsyncThunk(
  "auth/login",
  async ({ payload }, { extra: api }) => {
    console.log(payload, "<<<<payload");
    const { data } = await api.auth.login(payload);
    return data;
  }
);

// const refreshToken = createAsyncThunk(
//   "auth/refreshToken",
//   async (_, { extra: api, dispatch, rejectWithValue, getState }) => {
//     try {
//       const role = getAuth(getState()).role;

//       let route = null;
//       switch (role) {
//         case ROLE.COMPANY:
//           route = "company";
//           break;
//         case ROLE.USER:
//           route = "user";
//           break;

//         default:
//           break;
//       }

//       const data = await api.auth[route].refreshToken();
//       return data;
//     } catch (error) {
//       dispatch(logout());
//       return rejectWithValue("Failed to refresh token.");
//     }
//   }
// );

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false,
    token: "",
    name: "",
    email: "",
    ui: {
      login: {},
    },
  },
  reducers: {
    logout: () => {
      // just so that we have an action type to dispatch in our root reducer.
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.ui.login.loading = true;
    },
    [login.fulfilled]: (state, { payload }) => {
      console.log(payload);
      state.ui.login.loading = false;

      state.isAuth = true;
      state.token = payload.tokenRes.access_token;
      state.name = `${payload.user.firstName} ${payload.user.lastName}`;
      state.email = payload.user.email;
    },
    [login.rejected]: (state) => {
      state.ui.login.loading = false;
    },
  },
});

const { logout } = authSlice.actions;

export { getAuth, getAuthUI, login, logout };

export default authSlice.reducer;

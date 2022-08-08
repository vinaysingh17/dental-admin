import { configureStore, combineReducers } from "@reduxjs/toolkit";
import services from "../../infrastructure/services";
import reducers from "../reducers";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["auth", "global"],
};

// This is the combined reducer
const combinedReducer = combineReducers(reducers);

// here we add one more action to our combined reducer (logout action)
const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

// we pass root reducer to combined reducer
const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: services },
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "ui/showDialog",
        ],
      },
    }),
});

const persistor = persistStore(store);

export { persistor };
export default store;

// store.js

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createPostApi } from "./APISlice";

import pagesReducer from "./pageSlice";
const store = configureStore({
  reducer: {
    [createPostApi.reducerPath]: createPostApi.reducer,

    presentation: pagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      createPostApi.middleware
    ),
});
setupListeners(store.dispatch);

export default store;

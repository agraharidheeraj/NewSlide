// store.js

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createPostApi } from "./APISlice";
import textAreasReducer from "./textAreasSlice";
import imagesReducer from "./imageSlice";
import pagesReducer from "./pageSlice";
const store = configureStore({
  reducer: {
    [createPostApi.reducerPath]: createPostApi.reducer,
    textAreas: textAreasReducer,
    images: imagesReducer,
    presentation: pagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      createPostApi.middleware
    ),
});
setupListeners(store.dispatch);

export default store;

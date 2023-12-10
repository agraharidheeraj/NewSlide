// store.js
import { configureStore } from "@reduxjs/toolkit";
import textAreasReducer from "./textAreasSlice";
import imagesReducer from "./imageSlice";
import pagesReducer from "./pageSlice";

const store = configureStore({
  reducer: {
    textAreas: textAreasReducer,
    images: imagesReducer,
    pages: pagesReducer,
  },
});

export default store;

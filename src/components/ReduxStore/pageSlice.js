import { createSlice } from "@reduxjs/toolkit";
import { serverTimestamp } from "firebase/firestore";

const initialState = {
  presentation: {
    id: Date.now(),
    title: "",
    slides: [
      {
        id: Date.now(),
        elements: [
          {
            bgColor: "",
            color: "",
            content: "Add Text",
            fontSize: 32,
            opacity: "",
            position: {
              x: 282.98333740234375,
              y: 66,
            },
            type: "text",
            zIndex: 1,
            id: Date.now(),
          },
        ],
      },
    ],
    selectedPage: Date.now(),
  },
};

const pageSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    addPage: (state) => {
      const newPage = {
        id: Date.now(),
        elements: [],
      };
      newPage.createdAt = serverTimestamp();
      state.presentation.slides.push(newPage);
      state.presentation.selectedPage = newPage.id;
    },
    
    selectPage: (state, action) => {
      state.presentation.selectedPage = action.payload;
    },
    addElementToPage: (state, action) => {
      const { id, elements } = action.payload;

      const page = state.presentation.slides.find((p) => p.id === id);
      if (page) {
        page.elements = elements;
      } else {
        state.presentation.slides.push();
      }
    },
    deletePage: (state) => {
      const selectedPageIndex = state.presentation.slides.findIndex(
        (page) => page.id === state.presentation.selectedPage
      );

      if (selectedPageIndex !== -1) {
        state.presentation.slides.splice(selectedPageIndex, 1);

        if (state.presentation.slides.length > 0) {
          // If there are remaining pages, select the first one
          state.presentation.selectedPage = state.presentation.slides[0].id;
        } else {
          // If no pages are left, clear the selectedPage
          state.presentation.selectedPage = null;
        }
      }
    },
    changeTitle: (state,action) => {
        state.presentation.title = action.payload.title;
    },
    currentPresentation: (state, action) => {
      state.presentation = action.payload;
    },
  },
});

export const {
  addPage,
  selectPage,
  addElementToPage,
  deletePage,
  currentPresentation,
  changeTitle
} = pageSlice.actions;
export default pageSlice.reducer;

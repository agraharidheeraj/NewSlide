import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  presentation: {
    id: Date.now(),
    slides: [
      {
        id: Date.now(),
        elements: [],
      },
    ],
  },
  selectedPage: Date.now(),
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
      state.presentation.slides.push(newPage);
      state.selectedPage = newPage.id;
    },
    selectPage: (state, action) => {
      state.selectedPage = action.payload;
    },
    addElementToPage: (state, action) => {
      const { pageId, elements } = action.payload;

      const page = state.presentation.slides.find((p) => p.id === pageId);
      if (page) {
        page.elements.push(...elements);
      }
    },
    deletePage: (state) => {
      const selectedPageIndex = state.presentation.slides.findIndex(
        (page) => page.id === state.selectedPage
      );

      if (selectedPageIndex !== -1) {
        state.presentation.slides.splice(selectedPageIndex, 1);

        if (state.presentation.slides.length > 0) {
          // If there are remaining pages, select the first one
          state.selectedPage = state.pages[0].id;
        } else {
          // If no pages are left, clear the selectedPage
          state.selectedPage = null;
        }
      }
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
} = pageSlice.actions;
export default pageSlice.reducer;

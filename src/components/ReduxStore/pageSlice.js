import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pages: [],
  selectedPage: null,
};

const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    addPage: (state) => {
      const newPage = {
        id: Date.now(),
        elements: [],
      };
      state.pages.push(newPage);
    },
    selectPage: (state, action) => {
      state.selectedPage = action.payload;
    },
    addElementToPage: (state, action) => {
      const { pageId, element } = action.payload;
      const page = state.pages.find((p) => p.id === pageId);
      if (page) {
        page.elements.push(element);
      }
    },
    deletePage: (state) => {
        const selectedPageIndex = state.pages.findIndex(
          (page) => page.id === state.selectedPage
        );
  
        if (selectedPageIndex !== -1) {
          state.pages.splice(selectedPageIndex, 1);
  
          if (state.pages.length > 0) {
            // If there are remaining pages, select the first one
            state.selectedPage = state.pages[0].id;
          } else {
            // If no pages are left, clear the selectedPage
            state.selectedPage = null;
          }
        }
      },
  },
});

export const { addPage, selectPage, addElementToPage,deletePage } = pageSlice.actions;
export default pageSlice.reducer;
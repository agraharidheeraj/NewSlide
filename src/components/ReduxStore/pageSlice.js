import { createSlice } from "@reduxjs/toolkit";
import { serverTimestamp } from "firebase/firestore";

const initialState = {
  presentation: {
    id: Date.now(),
    title: "",
    slides: [
      {
        id: Date.now(),
        elements: [],
      },
    ],
    selectedPage: Date.now(),
    selectedElement: "",
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
      const { element } = action.payload;

      const page = state.presentation.slides.find(
        (p) => p.id === state.presentation.selectedPage
      );
      page.elements.push(element);
    },
    updateElement: (state, action) => {
      const { updatedProperties } = action.payload;
      const currentSlide = state.presentation.slides.find(
        (slide) => slide.id === state.presentation.selectedPage
      );

      if (currentSlide) {
        currentSlide.elements = currentSlide.elements.map((element) =>
          element.id === state.presentation.selectedElement
            ? { ...element, ...updatedProperties }
            : element
        );
      }
      return state;
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
    changeTitle: (state, action) => {
      state.presentation.title = action.payload.title;
    },
    currentPresentation: (state, action) => {
      state.presentation = action.payload;
    },
    selectElement: (state, action) => {
      state.presentation.selectedElement = action.payload;
    },
    deleteElement: (state) => {
      const currentSlide = state.presentation.slides.find(
        (slide) => slide.id === state.presentation.selectedPage
      );

      if (currentSlide) {
        currentSlide.elements = currentSlide.elements.filter(
          (element) => element.id !== state.presentation.selectedElement
        );
      }
      console.log(currentSlide.elenents);
      return state;
    },
  },
});

export const {
  addPage,
  selectPage,
  addElementToPage,
  deletePage,
  currentPresentation,
  changeTitle,
  selectElement,
  updateElement,
  deleteElement,
} = pageSlice.actions;
export default pageSlice.reducer;

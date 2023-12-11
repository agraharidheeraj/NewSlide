import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  textAreas: [],
  selectedTextArea: null,
};

const textAreasSlice = createSlice({
  name: "textAreas",
  initialState,
  reducers: {
    selectTextArea: (state, action) => {
      state.selectedTextArea = action.payload;
    },
    deleteTextArea: (state, action) => {
      state.textAreas = state.textAreas.filter(
        (textArea) => textArea.id !== action.payload
      );
      state.selectedTextArea = null;
    },
    addTextArea: (state) => {
      const newTextArea = {
        id: Date.now(),
        position: { x: 0, y: 40 },
        fontSize: "",
        color: "",
        bgColor: "",
        opacity: "",
        zIndex: 1,
        content: "",
        type: "text",
      };
      state.textAreas.push(newTextArea);
      state.selectedTextArea = newTextArea;
    },
    updateTextArea: (state, action) => {
      const { id, updatedProperties } = action.payload;
      state.textAreas = state.textAreas.map((textArea) =>
        textArea.id === id ? { ...textArea, ...updatedProperties } : textArea
      );
    },

    addNewTextArea: (state, action) => {
      const currentText = action.payload;

      state.textAreas = currentText;
    },

    clearTextArea: (state) => {
      state.textAreas = [];
      state.selectedTextArea = null;
    },
  },
});

export const {
  selectTextArea,
  deleteTextArea,
  addTextArea,
  updateTextArea,
  clearTextArea,
  addNewTextArea,
} = textAreasSlice.actions;
export default textAreasSlice.reducer;

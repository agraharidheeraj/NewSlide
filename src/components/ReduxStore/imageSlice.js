import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [],
  selectedImage: null,
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    selectImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    deleteImage: (state, action) => {
      state.images = state.images.filter(
        (image) => image.id !== action.payload
      );
      state.selectedImage = null;
    },
    addImage: (state, action) => {
      const newImage = {
        id: Date.now(),
        position: { x: 200, y: 100 },
        width: 100,
        height: 100,
        borderRadius: 0,
        zIndex: 1,
        imageUrl: action.payload?.imageUrl || "",
      };
      state.images.push(newImage);
      state.selectedImage = newImage;
    },
    updateImage: (state, action) => {
      const { id, updatedProperties } = action.payload;
      state.images = state.images.map((image) =>
        image.id === id ? { ...image, ...updatedProperties } : image
      );
    },
  },
});

export const { selectImage, deleteImage, addImage, updateImage } =
  imageSlice.actions;
export default imageSlice.reducer;

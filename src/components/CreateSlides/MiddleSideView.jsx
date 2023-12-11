// MiddleSideView.jsx
import React, { useRef, useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTextArea,
  selectTextArea,
  updateTextArea,
} from "../ReduxStore/textAreasSlice";
import { addImage, selectImage, updateImage } from "../ReduxStore/imageSlice";
import DraggableTextarea from "./ResizableTextarea";
import { addElementToPage } from "../ReduxStore/pageSlice";

const MiddleSideView = () => {
  const dispatch = useDispatch();
  const textAreas = useSelector((state) => state.textAreas.textAreas);
  const images = useSelector((state) => state.images.images);
  const selectedPage = useSelector((state) => state.presentation.selectedPage);
  const selectedTextArea = useSelector(
    (state) => state.textAreas.selectedTextArea
  );
  const [draggedItem, setDraggedItem] = useState(null);
  const dragRef = useRef(null);

  const handleTextClick = (id) => {
    dispatch(selectTextArea(id));
  };

  const handleImageClick = (id) => {
    dispatch(selectImage(id));
  };

  const handleAddText = () => {
    dispatch(addTextArea());
  };

  const handleAddImage = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput && fileInput.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(addImage({ imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const { clientX, clientY } = event;
    const { top, left } = dragRef.current.getBoundingClientRect();

    if (draggedItem) {
      const newPosition = {
        x: clientX - left,
        y: clientY - top,
      };

      if (draggedItem.type === "text") {
        dispatch(
          updateTextArea({
            id: draggedItem.id,
            updatedProperties: { position: newPosition },
          })
        );
      } else if (draggedItem.type === "image") {
        dispatch(
          updateImage({
            id: draggedItem.id,
            updatedProperties: { position: newPosition },
          })
        );
      }
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    dispatch(
      updateTextArea({
        id: selectedTextArea,
        updatedProperties: { content: value },
      })
    );
  };

  return (
    <Flex width="100%" direction="column">
      <Box ml={10} mt={2}>
        <Button borderRadius={8} onClick={handleAddText} marginRight="20px">
          Add Text
        </Button>
        <Button borderRadius={8} onClick={handleAddImage}>
          Upload Image
        </Button>
        <input
          id="imageInput"
          type="file"
          hidden
          onChange={handleImageUpload}
          accept="image/*"
        />
      </Box>

      <Box
        height="100%"
        width="100%"
        display="flex"
        padding={5}
        pl={8}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          width="100%"
          maxWidth="900px"
          bg="white"
          boxShadow="outline"
          height="100%"
        >
          <Box position="relative" ref={dragRef}>
            {textAreas.map((textArea) => (
              <Box
                key={textArea.id}
                position="absolute"
                top={`${textArea.position.y}px`}
                left={`${textArea.position.x}px`}
                zIndex={textArea.zIndex}
                draggable
                onDragStart={() =>
                  handleDragStart({ id: textArea.id, type: "text" })
                }
                onDragEnd={handleDragEnd}
              >
                <DraggableTextarea
                  onClick={() => handleTextClick(textArea.id)}
                  fontSize={textArea.fontSize}
                  color={textArea.color}
                  bgColor={textArea.bgColor}
                  opacity={textArea.opacity}
                  zIndex={textArea.zIndex}
                  width="auto"
                  onChange={handleTextChange}
                  value={textArea.content}
                />
              </Box>
            ))}
            {images.map((image) => (
              <Box
                key={image.id}
                position="absolute"
                top={`${image.position.y}px`}
                left={`${image.position.x}px`}
                zIndex={image.zIndex}
                draggable
                onDragStart={() =>
                  handleDragStart({ id: image.id, type: "image" })
                }
                onDragEnd={handleDragEnd}
              >
                <div
                  onClick={() => handleImageClick(image.id)}
                  style={{
                    width: `${image.width}px`,
                    height: `${image.height}px`,
                    borderRadius: `${image.borderRadius}px`,
                    border: "1px dashed",
                    backgroundImage: `url(${image.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default MiddleSideView;

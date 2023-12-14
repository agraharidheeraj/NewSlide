// MiddleSideView.jsx

import React, { useRef, useState } from "react";
import { Box, Button, Flex, Spinner } from "@chakra-ui/react"; // Import the Skeleton component
import { useDispatch, useSelector } from "react-redux";
import "animate.css";
import {
  addTextArea,
  selectTextArea,
  updateTextArea,
} from "../ReduxStore/textAreasSlice";
import { addImage, selectImage, updateImage } from "../ReduxStore/imageSlice";
import DraggableTextarea from "./ResizableTextarea";
import { addElementToPage } from "../ReduxStore/pageSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import {
  useUpdateElementsMutation,
  useSaveImageMutation,
} from "../ReduxStore/APISlice";
import { useAnimation } from "../CustomHook/AnimationContext";

const MiddleSideView = () => {
  const dispatch = useDispatch();
  const [loading,setLoading]= useState(false)
  const textAreas = useSelector((state) => state.textAreas.textAreas);
  const images = useSelector((state) => state.images.images);
  const selectedPage = useSelector(
    (state) => state.presentation.presentation.selectedPage
  );
  const selectedTextArea = useSelector(
    (state) => state.textAreas.selectedTextArea
  );
  const [draggedItem, setDraggedItem] = useState(null);
  const dragRef = useRef(null);
  const presentation = useSelector((state) => state.presentation.presentation);

  const [updateElements] = useUpdateElementsMutation();
  const [user,loadingAuth] = useAuthState(auth);
  const uuid = user?.uid;
  const [saveImage] = useSaveImageMutation();
  const { selectedAnimation, selectedElementType } = useAnimation();
  const [selectedElementId, setSelectedElementId] = useState(null);


  const applyAnimation = (element) => {
    if (selectedAnimation && selectedElementType) {
      const animationClass = `animate__${selectedAnimation}`;
      element.classList.add("animate__animated", animationClass);

      element.addEventListener("animationend", () => {
        element.classList.remove("animate__animated", animationClass);
      });
    }
  };
  
  const handleTextClick = (id) => {
    dispatch(selectTextArea(id));
    setSelectedElementId(id);
  };

  const handleImageClick = (id) => {
    dispatch(selectTextArea(null))
    dispatch(selectImage(id));
    setSelectedElementId(id);
    
  };

  const handleAddText = () => {
    dispatch(addTextArea());
  };

  const getImageFileFromUrl = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a File object from the Blob
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });

    return file;
  };

  const handleAddImage = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput && fileInput.click();
  };

  const handleImageUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];

    if (file) {
      try {
        const imageUrl = URL.createObjectURL(file);

        // Use the getImageFileFromUrl function
        const imageFile = await getImageFileFromUrl(imageUrl);

        // Use the useSaveImageMutation to save the image
        const result = await saveImage({
          id: Date.now(),
          imageFile: imageFile,
        });
        const savedImageUrl = result.data;

        // Dispatch the addImage action with the saved image URL
        dispatch(addImage({ imageUrl: savedImageUrl }));
      } catch (error) {
        console.error("An error occurred:", error);
      }
      setLoading(false)
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

  const handleSave = () => {
    let obj = {
      id: selectedPage,
      elements: [...textAreas, ...images],
    };
    dispatch(addElementToPage(obj));
    updateElements({
      id: presentation.id,
      title: presentation.title,
      slideId: obj.id,
      updatedElements: obj.elements,
      userID: uuid,
    });
    console.log("saved");
    console.log(presentation);
  };

  if (loading || loadingAuth) {
    return (
      <Flex
        height="100vh"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }

  return (
    <Flex bg="#282828" padding="16px 0px" width="100%" direction="column">
      <Flex justifyContent="space-between" alignItems="center">
        <Box ml={10}>
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

        <Box mr={8}>
          <Button borderRadius={8} onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Flex>

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
          maxWidth="1000px"
          bg="white"
          boxShadow="outline"
          maxHeight="750px"
        >
          <Box position="relative" ref={dragRef}>
         
            {textAreas.map((textArea) => (
              <div
              key={textArea.id}
                className={`animate-element animate__animated animate__${
                  selectedElementType === "text" && selectedElementId === textArea.id
                    ? selectedAnimation
                    : ""
                }`}
                style={{
                  position: "absolute",
                  top: `${textArea.position.y}px`,
                  left: `${textArea.position.x}px`,
                  zIndex: textArea.zIndex,
                }}
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
              </div>
            ))}

            {images.map((image) => (
              <div
              key={image.id}
              className={`animate-element animate__animated animate__${
                selectedElementType === "image" && selectedElementId === image.id
                  ? selectedAnimation
                  : ""
              }`}
                style={{
                  position: "absolute",
                  top: `${image.position.y}px`,
                  left: `${image.position.x}px`,
                  zIndex: image.zIndex,
                }}
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
              </div>
            ))}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default MiddleSideView;

// MiddleSideView.jsx

import React, { useRef, useState } from "react";
import { Box, Button, Flex, Spinner, Textarea } from "@chakra-ui/react"; // Import the Skeleton component
import { useDispatch, useSelector } from "react-redux";
import "animate.css";

import {
  addElementToPage,
  selectElement,
  updateElement,
} from "../ReduxStore/pageSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import {
  useUpdateDbMutation,
  useSaveImageMutation,
} from "../ReduxStore/APISlice";
import { useAnimation } from "../CustomHook/AnimationContext";

const MiddleSideView = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const dragRef = useRef(null);
  const presentation = useSelector((state) => state.presentation.presentation);
  const currentSlide = presentation.slides.find(
    (item) => item.id === presentation.selectedPage
  );
  const textAreas = currentSlide.elements.filter(
    (item) => item.type === "text"
  );
  const images = currentSlide.elements.filter((item) => item.type === "image");

  const [updateDb] = useUpdateDbMutation();
  // eslint-disable-next-line
  const [user, loadingAuth] = useAuthState(auth);
  const [saveImage] = useSaveImageMutation();
  const { selectedAnimation, selectedElementType } = useAnimation();
  const [selectedElementId, setSelectedElementId] = useState(null);

 
  const handleTextClick = (id) => {
    dispatch(selectElement(id));
    setSelectedElementId(id);
  };

  const handleImageClick = (id) => {
    dispatch(selectElement(id));
    setSelectedElementId(id);
  };

  const handleAddText = () => {
    const defaultObj = {
      id: Date.now(),
      position: { x: 0, y: 40 },
      fontSize: 16,
      color: "black",
      bgColor: "",
      width: 300,
      height: 100,
      opacity: 1,
      zIndex: 1,
      content: "",
      type: "text",
      animation: "",
    };
    dispatch(addElementToPage({ element: defaultObj }));
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

        const defaultObj = {
          id: Date.now(),
          position: { x: 200, y: 100 },
          width: 100,
          height: 100,
          borderRadius: 0,
          zIndex: 1,
          imageUrl: savedImageUrl || "",
          type: "image",
          animation: "",
        };

        // Dispatch the addImage action with the saved image URL
        dispatch(addElementToPage({ element: defaultObj }));
      } catch (error) {
        console.error("An error occurred:", error);
      }
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    dispatch(
      updateElement({
        updatedProperties: { content: value },
      })
    );
  };

  const handleSave = () => {
    console.log(presentation);
    updateDb(presentation);
    console.log("saved");
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

      <Box height="100%" width="100%" display="flex" padding={5} pl={8}>
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
            {textAreas?.map((textArea) => (
              <div
                key={textArea.id}
                className={`animate-element animate__animated animate__${
                  selectedElementType === "text" &&
                  selectedElementId === textArea.id
                    ? selectedAnimation
                    : ""
                }`}
                style={{
                  position: "absolute",
                  top: `${textArea.position.y}px`,
                  left: `${textArea.position.x}px`,
                  zIndex: textArea.zIndex,
                }}
              >
                <Textarea
                  onClick={() => handleTextClick(textArea.id)}
                  fontSize={textArea.fontSize}
                  color={textArea.color}
                  bgColor={textArea.bgColor}
                  opacity={textArea.opacity}
                  zIndex={textArea.zIndex}
                  onChange={handleTextChange}
                  value={textArea.content}
                  overflow="hidden"
                  minWidth={textArea.width}
                  height={textArea.height}
                  placeholder="Add Text"
                  border="none"
                />
              </div>
            ))}

            {images?.map((image) => (
              <div
                key={image.id}
                className={`animate-element animate__animated animate__${
                  selectedElementType === "image" &&
                  selectedElementId === image.id
                    ? selectedAnimation
                    : ""
                }`}
                style={{
                  position: "absolute",
                  top: `${image.position.y}px`,
                  left: `${image.position.x}px`,
                  zIndex: image.zIndex,
                }}
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

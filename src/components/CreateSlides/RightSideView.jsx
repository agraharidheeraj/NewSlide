// RightSideView.jsx
import React, { useEffect } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTextArea,
  deleteTextArea,
  selectTextArea,
} from "../ReduxStore/textAreasSlice";
import {
  updateImage,
  deleteImage,
  selectImage,
} from "../ReduxStore/imageSlice";

const RightSideView = () => {
  const dispatch = useDispatch();
  const selectedTextArea = useSelector(
    (state) => state.textAreas.selectedTextArea
  );
  const selectedImage = useSelector((state) => state.images.selectedImage);

  const currentTextArea = useSelector((state) =>
    state.textAreas.textAreas.find((item) => item.id === selectedTextArea)
  );

  const currentImage = useSelector((state) =>
    state.images.images.find((item) => item.id === selectedImage)
  );

  const initialArea = {
    fontSize: currentTextArea?.fontSize || 16,
    color: currentTextArea?.color || "black",
    bgColor: currentTextArea?.bgColor || "",
    opacity: currentTextArea?.opacity || 1,
    zIndex: currentTextArea?.zIndex || 1,
    position: currentTextArea?.position || { x: 0, y: 40 },
    width: currentImage?.width || 0,
    height: currentImage?.height || 0,
    borderRadius: currentImage?.borderRadius || 0,
    imagePosition: currentImage?.position || { x: 0, y: 0 },
  };

  const [editedTextArea, setEditedTextArea] = React.useState(initialArea);

// Example: Add more debug logs
useEffect(() => {
  setEditedTextArea((prev) => ({
    ...prev,
    position: currentTextArea?.position || { x: 0, y: 40 },
    imagePosition: currentImage?.position || { x: 0, y: 0 },
  }));
}, [currentTextArea, currentImage]);


  const handleInputChange = (property, value) => {
    setEditedTextArea((prev) => ({ ...prev, [property]: value }));
  };

  const dispatchUpdate = () => {
    if (selectedTextArea) {
      dispatch(
        updateTextArea({
          id: selectedTextArea,
          updatedProperties: {
            fontSize: editedTextArea.fontSize,
            color: editedTextArea.color,
            bgColor: editedTextArea.bgColor,
            opacity: editedTextArea.opacity,
            position: editedTextArea.position,
            zIndex: editedTextArea.zIndex,
          },
        })
      );
    } else if (selectedImage) {
      dispatch(
        updateImage({
          id: selectedImage,
          updatedProperties: {
            width: editedTextArea.width,
            height: editedTextArea.height,
            borderRadius: editedTextArea.borderRadius,
            zIndex: editedTextArea.zIndex,
            position: editedTextArea.imagePosition,
          },
        })
      );
    }
  };

  const dispatchDelete = () => {
    if (selectedTextArea) {
      dispatch(deleteTextArea(selectedTextArea));
    } else if (selectedImage) {
      dispatch(deleteImage(selectedImage));
    }
    setEditedTextArea(initialArea);
  };

  const dispatchSelect = () => {
    if (selectedTextArea) {
      dispatch(selectTextArea(null));
    } else if (selectedImage) {
      dispatch(selectImage(null));
    }
    setEditedTextArea(initialArea);
  };

  const formatPosition = (position) => ({
    x: position.x.toFixed(2),
    y: position.y.toFixed(2),
  });

  const dispatchAttributes = () => {
    if (selectedTextArea) {
      return (
        <Box>
          <Text fontSize="lg">Font Size:</Text>
          <Input
            type="number"
            value={editedTextArea.fontSize}
            onChange={(e) => handleInputChange("fontSize", e.target.value)}
          />
          <Text fontSize="lg">Color:</Text>
          <Input
            type="color"
            value={editedTextArea.color}
            onChange={(e) => handleInputChange("color", e.target.value)}
          />
          <Text fontSize="lg">Background Color:</Text>
          <Input
            type="color"
            value={editedTextArea.bgColor}
            onChange={(e) => handleInputChange("bgColor", e.target.value)}
          />
          <Text fontSize="lg">Opacity:</Text>
          <Input
            type="number"
            value={editedTextArea.opacity}
            onChange={(e) => handleInputChange("opacity", e.target.value)}
          />
          <Text fontSize="lg">Position X:</Text>
          <Input
            type="number"
            value={formatPosition(editedTextArea.position).x}
            onChange={(e) =>
              handleInputChange("position", {
                ...editedTextArea.position,
                x: parseFloat(e.target.value),
              })
            }
          />
          <Text fontSize="lg">Position Y:</Text>
          <Input
            type="number"
            value={formatPosition(editedTextArea.position).y}
            onChange={(e) =>
              handleInputChange("position", {
                ...editedTextArea.position,
                y: parseFloat(e.target.value),
              })
            }
          />
          <Text fontSize="lg">Z-Index:</Text>
          <Input
            type="number"
            value={editedTextArea.zIndex}
            onChange={(e) => handleInputChange("zIndex", e.target.value)}
          />
        </Box>
      );
    } else if (selectedImage) {
      return (
        <Box>
          <Text fontSize="lg">Width:</Text>
          <Input
            type="number"
            value={editedTextArea.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />

          <Text fontSize="lg">Height:</Text>
          <Input
            type="number"
            value={editedTextArea.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />

          <Text fontSize="lg">Border Radius:</Text>
          <Input
            type="number"
            value={editedTextArea.borderRadius}
            onChange={(e) => handleInputChange("borderRadius", e.target.value)}
          />

          <Text fontSize="lg">Position X:</Text>
          <Input
            type="number"
            value={formatPosition(editedTextArea.imagePosition).x}
            onChange={(e) =>
              handleInputChange("imagePosition", {
                ...editedTextArea.imagePosition,
                x: parseFloat(e.target.value),
              })
            }
          />

          <Text fontSize="lg">Position Y:</Text>
          <Input
            type="number"
            value={formatPosition(editedTextArea.imagePosition).y}
            onChange={(e) =>
              handleInputChange("imagePosition", {
                ...editedTextArea.imagePosition,
                y: parseFloat(e.target.value),
              })
            }
          />

          <Text fontSize="lg">Z-Index:</Text>
          <Input
            type="number"
            value={editedTextArea.zIndex}
            onChange={(e) => handleInputChange("zIndex", e.target.value)}
          />
        </Box>
      );
    } else {
      return null;
    }
  };

  return (
    <Box p={4} bg="gray.300" w="100%">
      {dispatchAttributes()}
      <Button mt={4} mr={1} borderRadius={6} onClick={dispatchUpdate}>
        Update
      </Button>
      <Button
        variant="outline"
        mt={4}
        mr={1}
        borderRadius={6}
        onClick={dispatchDelete}
      >
        Delete
      </Button>
      <Button mt={4} borderRadius={6} onClick={dispatchSelect}>
        Unselect
      </Button>
    </Box>
  );
};

export default RightSideView;

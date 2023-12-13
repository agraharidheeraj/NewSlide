// RightSideView.jsx
import React, { useEffect, useState } from "react";
import { Box, Text, Input, Button, Select, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTextArea,
  deleteTextArea
} from "../ReduxStore/textAreasSlice";
import {
  updateImage,
  deleteImage
} from "../ReduxStore/imageSlice";
import { useAnimation } from "../CustomHook/AnimationContext";

const RightSideView = () => {
  const dispatch = useDispatch();
  const { selectedAnimation, setSelectedAnimation } = useAnimation();
  const selectedTextArea = useSelector(
    (state) => state.textAreas.selectedTextArea
  );
  const selectedImage = useSelector((state) => state.images.selectedImage);
  console.log(selectedImage)

  const currentTextArea = useSelector((state) =>
    state.textAreas.textAreas.find((item) => item.id === selectedTextArea)
  );

  const currentImage = useSelector((state) => {

    return state.images.images.find((item) => item.id === selectedImage)

  }
     
  );

  const initialArea = {
    fontSize: currentTextArea?.fontSize || 16,
    color: currentTextArea?.color || "black",
    bgColor: currentTextArea?.bgColor || "",
    opacity: currentTextArea?.opacity || 1,
    zIndex: currentTextArea?.zIndex || 1,
    position: currentTextArea?.position || { x: 0, y: 40 },
    width: currentImage?.width || 100,
    height: currentImage?.height || 100,
    borderRadius: currentImage?.borderRadius || 0,
    imagePosition: currentImage?.position || { x: 0, y: 0 },
  };
  console.log(initialArea)

  const [editedTextArea, setEditedTextArea] = useState(initialArea);
  const [editedImage,setEditedImage] = useState(initialArea);
  const [animationDuration, setAnimationDuration] = useState(1);

  useEffect(() => {
    setEditedTextArea((prev) => ({
      ...prev,
      position: currentTextArea?.position || { x: 50, y: 50 },
     
    }));
  }, [currentTextArea]);

  useEffect(() =>{
    setEditedImage((prev) =>({
      ...prev,
      imagePosition: currentImage?.position || { x: 50, y: 50 },
    }))
  },[currentImage])
  

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

  console.log(editedTextArea)

  const dispatchDelete = () => {
    if (selectedTextArea) {
      dispatch(deleteTextArea(selectedTextArea));
    } else if (selectedImage) {
      dispatch(deleteImage(selectedImage));
    }
    setEditedTextArea(initialArea);
  };



  const formatPosition = (position) => ({
    x: position.x.toFixed(0),
    y: position.y.toFixed(0),
  });

  const { setSelectedElementType } = useAnimation();

  const applyAnimation = () => {
    console.log("Applying animation...");
    let selectedElementType = null;

    if (selectedTextArea) {
      selectedElementType = "text";
    } else if (selectedImage) {
      selectedElementType = "image";
    }

    setSelectedElementType(selectedElementType);

    if (selectedAnimation) {
      setSelectedAnimation(selectedAnimation);
    }
  };

  const dispatchAttributes = () => {
    if (selectedTextArea) {
      return (
        <Box>
          <Text fontSize="lg">Animation:</Text>
          <Select
            value={selectedAnimation}
            onChange={(e) => setSelectedAnimation(e.target.value)}
          >
            <option value="">None</option>
            {[
              "flash",
              "bounce",
              "rubberBand",
              "backInDown",
              "backInLeft",
              "backInUp",
              "bounceInDown",
              "bounceInRight",
              "fadeInRightBig",
              "fadeInTopLeft",
              "fadeInBottomRight",
              "fadeInBottomRight",
            ].map((animation) => (
              <option key={animation} value={animation}>
                {animation}
              </option>
            ))}
          </Select>

          {selectedAnimation && (
            <>
              <Text fontSize="lg">Animation Duration (s):</Text>
              <Input
                type="number"
                value={animationDuration}
                onChange={(e) => setAnimationDuration(e.target.value)}
              />
            </>
          )}

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
          <Flex gap={2}>
            <Flex direction="column">
              <Text fontSize="lg">Opacity:</Text>
              <Input
                type="number"
                value={editedTextArea.opacity}
                onChange={(e) => handleInputChange("opacity", e.target.value)}
              />
            </Flex>

            <Flex direction="column">
              <Text fontSize="lg">Z-Index:</Text>
              <Input
                type="number"
                value={editedTextArea.zIndex}
                onChange={(e) => handleInputChange("zIndex", e.target.value)}
              />
            </Flex>
          </Flex>
          <Flex gap={2}>
            <Flex direction="column">
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
            </Flex>
            <Flex direction="column">
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
            </Flex>
          </Flex>
        </Box>
      );
    } else if (selectedImage) {
      return (
        <Box>
          <Text fontSize="lg">Animation:</Text>
          <Select
            value={selectedAnimation}
            onChange={(e) => setSelectedAnimation(e.target.value)}
          >
            <option value="">None</option>
            {[
              "flash",
              "bounce",
              "rubberBand",
              "backInDown",
              "backInLeft",
              "backInUp",
              "bounceInDown",
              "bounceInRight",
              "fadeInRightBig",
              "fadeInTopLeft",
              "fadeInBottomRight",
              "fadeInBottomRight",
            ].map((animation) => (
              <option key={animation} value={animation}>
                {animation}
              </option>
            ))}
          </Select>

          {selectedAnimation && (
            <>
              <Text fontSize="lg">Animation Duration (s):</Text>
              <Input
                type="number"
                value={animationDuration}
                onChange={(e) => setAnimationDuration(e.target.value)}
              />
            </>
          )}

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
     
      <Button mt={4} borderRadius={6} onClick={applyAnimation}>
        Apply Animation
      </Button>
    </Box>
  );
};

export default RightSideView;

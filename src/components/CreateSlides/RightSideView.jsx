// RightSideView.jsx
import React, { useEffect, useState } from "react";
import { Box, Text, Input, Button, Select, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateTextArea, deleteTextArea } from "../ReduxStore/textAreasSlice";
import { updateImage, deleteImage } from "../ReduxStore/imageSlice";
import { useAnimation } from "../CustomHook/AnimationContext";
import { deleteElement, updateElement } from "../ReduxStore/pageSlice";
import { current } from "@reduxjs/toolkit";

const RightSideView = () => {
  const dispatch = useDispatch();
  const { selectedAnimation, setSelectedAnimation } = useAnimation();
  const presentation = useSelector((state) => state.presentation.presentation);
  const selectedElement = presentation.selectedElement;
  const currentSlide = presentation.slides.find(
    (item) => item.id === presentation.selectedPage
  );

  const element = currentSlide.elements.filter(
    (item) => item.id === selectedElement
  )[0];

  const handleInputChange = (key, value) => {
    dispatch(updateElement({ updatedProperties: { [key]: value } }));
  };
  const { setSelectedElementType } = useAnimation();

  const applyAnimation = async (e) => {
    setSelectedAnimation(e.target.value);

    // Rest of the code will be executed after setSelectedAnimation is done
  };

  useEffect(() => {
    console.log("Applying animation...");
    let selectedElementType = null;

    if (element?.type === "text") {
      selectedElementType = "text";
    } else if (element?.type === "image") {
      selectedElementType = "image";
    }

    setSelectedElementType(selectedElementType);
    dispatch(
      updateElement({ updatedProperties: { animation: selectedAnimation } })
    );
  }, [selectedAnimation]); // Add dependencies as needed

  const dispatchDelete = () => {
    dispatch(deleteElement());
  };

  const dispatchAttributes = () => {
    if (element?.type === "text") {
      return (
        <Box>
          <Text fontSize="lg">Animation:</Text>
          <select
            value={element.animation}
            onChange={(e) => {
              setSelectedAnimation(e.target.value);

              // Assuming you have a function to dispatch an action to update the animation in your state
              dispatch(
                updateElement({
                  updatedProperties: { animation: e.target.value },
                })
              );
            }}
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
            ].map((animation, index) => (
              <option
                key={index}
                selected={element.animation === animation ? "selected" : null}
                value={animation}
              >
                {animation}
              </option>
            ))}
          </select>

          {/* {selectedAnimation && (
            <>
              <Text fontSize="lg">Animation Duration (s):</Text>
              <Input
                type="number"
                value={animationDuration}
                onChange={(e) => setAnimationDuration(e.target.value)}
              />
            </>
          )} */}

          <Text fontSize="lg">Font Size:</Text>
          <Input
            type="number"
            value={element.fontSize}
            onChange={(e) => handleInputChange("fontSize", e.target.value)}
          />
          <Text fontSize="lg">Color:</Text>
          <Input
            type="color"
            value={element.color}
            onChange={(e) => handleInputChange("color", e.target.value)}
          />
          <Text fontSize="lg">Background Color:</Text>
          <Input
            type="color"
            value={element.bgColor}
            onChange={(e) => handleInputChange("bgColor", e.target.value)}
          />
          <Flex gap={2}>
            <Flex direction="column">
              <Text fontSize="lg">Opacity:</Text>
              <Input
                type="number"
                value={element.opacity}
                onChange={(e) => handleInputChange("opacity", e.target.value)}
              />
            </Flex>

            <Flex direction="column">
              <Text fontSize="lg">Z-Index:</Text>
              <Input
                type="number"
                value={element.zIndex}
                onChange={(e) => handleInputChange("zIndex", e.target.value)}
              />
            </Flex>
          </Flex>
          <Flex gap={2}>
            <Flex direction="column">
              <Text fontSize="lg">Position X:</Text>
              <Input
                type="number"
                value={element.position.x}
                onChange={(e) =>
                  handleInputChange("position", {
                    ...element.position,
                    x: parseFloat(e.target.value),
                  })
                }
              />
            </Flex>
            <Flex direction="column">
              <Text fontSize="lg">Position Y:</Text>
              <Input
                type="number"
                value={element.position.y}
                onChange={(e) =>
                  handleInputChange("position", {
                    ...element.position,
                    y: parseFloat(e.target.value),
                  })
                }
              />
            </Flex>
          </Flex>
        </Box>
      );
    } else if (element?.type === "image") {
      return (
        <Box>
          <Text fontSize="lg">Animation:</Text>
          <select
            value={element.animation}
            onChange={(e) => {
              setSelectedAnimation(e.target.value);
              console.log("clicked");

              // Assuming you have a function to dispatch an action to update the animation in your state
              dispatch(
                updateElement({
                  updatedProperties: { animation: e.target.value },
                })
              );
            }}
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
            ].map((animation, index) => (
              <option
                key={index}
                selected={element.animation === animation ? "selected" : null}
                value={animation}
              >
                {animation}
              </option>
            ))}
          </select>

          {/* {selectedAnimation && (
            <>
              <Text fontSize="lg">Animation Duration (s):</Text>
              <Input
                type="number"
                value={animationDuration}
                onChange={(e) => setAnimationDuration(e.target.value)}
              />
            </>
          )} */}

          <Text fontSize="lg">Width:</Text>
          <Input
            type="number"
            value={element.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />

          <Text fontSize="lg">Height:</Text>
          <Input
            type="number"
            value={element.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />

          <Text fontSize="lg">Border Radius:</Text>
          <Input
            type="number"
            value={element.borderRadius}
            onChange={(e) => handleInputChange("borderRadius", e.target.value)}
          />

          <Text fontSize="lg">Position X:</Text>
          <Input
            type="number"
            value={element.position.x}
            onChange={(e) =>
              handleInputChange("position", {
                ...element.position,
                x: parseFloat(e.target.value),
              })
            }
          />

          <Text fontSize="lg">Position Y:</Text>
          <Input
            type="number"
            value={element.position.y}
            onChange={(e) =>
              handleInputChange("position", {
                ...element.position,
                y: parseFloat(e.target.value),
              })
            }
          />

          <Text fontSize="lg">Z-Index:</Text>
          <Input
            type="number"
            value={element.zIndex}
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
      <Button
        variant="outline"
        mt={4}
        mr={1}
        borderRadius={6}
        onClick={dispatchDelete}
      >
        Delete
      </Button>
    </Box>
  );
};

export default RightSideView;

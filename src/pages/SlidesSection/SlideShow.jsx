// FullScreenPresentation.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import {
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "animate.css";

const FullScreenPresentation = () => {
  const pages = useSelector((state) => state.presentation.presentation.slides);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const presentationRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const presentation = useSelector((state) => state.presentation.presentation);

  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown, true);

    return () => {
      document.removeEventListener("keydown", detectKeyDown, true);
    };
  }, [pages, currentSlide,isFullScreen]);
  const detectKeyDown = (e) => {
    if (isFullScreen && e.key === "Enter" ) {
      // Start animations when Enter is pressed in fullscreen mode
      startAnimations();
    } else if (e.key === "ArrowUp") {
      setCurrentSlide((prevSlide) => Math.max(0, prevSlide - 1));
    } else if (e.key === "ArrowDown") {
      setCurrentSlide((prevSlide) => Math.min(pages.length - 1, prevSlide + 1));
    }
  };

  const startAnimations = () => {
    // Logic to start animations
    console.log("Starting animations...");
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => Math.max(0, prevSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => Math.min(pages.length, prevSlide + 1));
  };

  const exitFullScreen = () => {
    navigate(`/presentation/${user.uid}/create/${presentation.id}`);
  };

  return (
    <Flex
      ref={presentationRef}
      height="100vh"
      tabIndex={0}
      width="100vw"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {pages.map((page, index) => (
        <Box
          key={page.id}
          width="100%"
          height="100%"
          display={index === currentSlide ? "block" : "none"}
          bg="white"
        >
          {page.elements.map((element, elementIndex) => (
            <RenderElement
              key={element.id}
              {...element}
              animate={index === currentSlide}
              animationDelay={`${elementIndex * 0.5}s`}
            />
          ))}
        </Box>
      ))}
      <Flex
        bg="gray.800"
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        top="0"
        left="0"
        display={currentSlide === pages.length ? "flex" : "none"}
      >
        <Text
          className="animate__animated animate__bounce"
          fontSize="30px"
          onClick={exitFullScreen}
          color="white"
          cursor="pointer"
        >
          End of slide show, Click to exit.
        </Text>
      </Flex>
      <Flex
        mb={2}
        mt={4}
        position="absolute"
        bottom="1"
        left="2"
        gap={5}
        ml={4}
        zIndex={1}
      >
        <Flex
         p={2}
         border='2px solid'
          borderColor='gray.600'
          borderRadius="50%"
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          _hover={{ backgroundColor: "red.500" }}
        >
          <FaArrowLeft />
        </Flex>
        <Flex
        p={2}
          border='2px solid'
          borderColor='gray.600'
          borderRadius="50%"
          onClick={handleNextSlide}
          disabled={currentSlide === pages.length - 1}
          _hover={{ backgroundColor: "red.500" }}
        >
          <FaArrowRight />
        </Flex>
      </Flex>
    </Flex>
  );
};
const RenderElement = ({
  type,
  content,
  imageUrl,
  animate,
  animationDelay,
  ...rest
}) => {
  const commonStyles = {
    position: "absolute",
    zIndex: rest.zIndex,
  };

  const elementStyles = {
    ...commonStyles,
    top: `${rest.position.y}px`,
    left: `${rest.position.x}px`,
    animationDelay: animate ? animationDelay : "2s",
  };

  return (
    <div
      className={`animate__animated ${
        animate ? `animate__${rest.animation}` : ""
      }`}
      style={elementStyles}
    >
      {type === "text" && (
        <div
          style={{
            ...commonStyles,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(20%)",
            fontSize: `${rest.fontSize}px`,
            color: rest.color,
            backgroundColor: rest.bgColor,
            opacity: rest.opacity,
            maxHeight: `${rest.height}px`,
            width: "900px",
            maxHeight: "100%",

            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </div>
      )}

      {type === "image" && (
        <div
          style={{
            ...commonStyles,
            transform: "translate(15%, 10%)",
            width: `1000px`,
            height: `500px`,
            borderRadius: `${rest.borderRadius}px`,
            border: "1px dashed",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      )}
    </div>
  );
};

export default FullScreenPresentation;

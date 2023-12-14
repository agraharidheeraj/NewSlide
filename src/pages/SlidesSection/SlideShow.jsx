import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import "animate.css";

const FullScreenPresentation = () => {
  const pages = useSelector((state) => state.presentation.presentation.slides);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const presentationRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const presentation = useSelector((state) => state.presentation.presentation);

  useEffect(() => {
    document.addEventListener("keydown", detectkeyDown, true);

    return () => {
      document.removeEventListener("keydown", detectkeyDown, true);
    };
  }, [pages, currentSlide]);

  const detectkeyDown = (e) => {
    if (e.key === "ArrowUp") {
      setCurrentSlide((prevSlide) => Math.max(0, prevSlide - 1));
    } else if (e.key === "ArrowDown") {
      setCurrentSlide((prevSlide) => Math.min(pages.length - 1, prevSlide + 1));
    }
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
          {page.elements.map((element) => (
            <RenderElement key={element.id} {...element} />
          ))}
        </Box>
      ))}
      {currentSlide === pages.length && (
        <Flex
          bg="gray.800"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            className="animate__animated animate__bounce"
            fontSize="30px"
            color="white"
          >
            End of Slides! Click On Exit FullScreen
          </Text>
        </Flex>
      )}

      <Flex mb={2} mt={4}>
        <Button
          mr={2}
          borderRadius={14}
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
        >
          Prev
        </Button>
        <Button
          mr={2}
          borderRadius={14}
          onClick={handleNextSlide}
          disabled={currentSlide === pages.length}
        >
          Next
        </Button>
        <Button
          variant="outline"
          borderRadius={14}
          onClick={exitFullScreen}
          ml={4}
        >
          Exit FullScreen
        </Button>
      </Flex>
    </Flex>
  );
};

const RenderElement = ({ type, content, imageUrl, ...rest }) => {
  const commonStyles = {
    position: "absolute",
    zIndex: rest.zIndex,
  };
  if (type === "text") {
    return (
      <div
        style={{
          ...commonStyles,
          top: `${rest.position.y}px`,
          left: `${rest.position.x}px`,
          fontSize: `${rest.fontSize}px`,
          color: rest.color,
          backgroundColor: rest.bgColor,
          opacity: rest.opacity,
          width: "fit-content",
          maxHeight: "100%",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
      </div>
    );
  } else if (type === "image") {
    return (
      <div
        style={{
          ...commonStyles,
          top: `${rest.position.y}px`,
          left: `${rest.position.x}px`,
          transform: "translate(15%, 5%)",
          width: `1000px`,
          height: `500px`,
          borderRadius: `${rest.borderRadius}px`,
          border: "1px dashed",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    );
  }

  return null;
};

export default FullScreenPresentation;

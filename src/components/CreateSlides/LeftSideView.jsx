import React, { useState,useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPage,
  selectPage,
  deletePage,
  currentPresentation,
} from "../ReduxStore/pageSlice";

import { useDeleteSlideMutation } from "../ReduxStore/APISlice";
import { useFetchPostQuery } from "../ReduxStore/APISlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import { serverTimestamp } from "firebase/firestore";

const LeftSideView = ({ id }) => {
  const dispatch = useDispatch();
  const presentation = useSelector((state) => state.presentation.presentation);
  const pages = useSelector((state) => state.presentation.presentation.slides);
  const selectedPage = useSelector(
    (state) => state.presentation.presentation.selectedPage
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPageId, setSelectedPageId] = useState(selectedPage);

  const [deleteSlide] = useDeleteSlideMutation();

  const [user] = useAuthState(auth);

  const handleAddPage = () => {
    dispatch(addPage());
    setSelectedPageId(presentation.selectedPage);
  };

  const handleSelectPage = (pageId) => {
    dispatch(selectPage(pageId));
    setSelectedPageId(pageId);
  };

  const handleDeletePage = async () => {
    if (selectedPageId) {
      dispatch(deletePage(selectedPageId));
      await deleteSlide({ id: presentation.id, slideId: selectedPageId });
      console.log(presentation.slides[0]);
      handleSelectPage(presentation.slides[0].id);
      onClose();
    }
  };

  const { data, error, isLoading } = useFetchPostQuery(`${id}`);

  React.useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error("Error fetching data:", error);
      } else if (data && Array.isArray(data.slides) && data.slides.length > 0) {
        console.log("Fetched data:", data);
        dispatch(currentPresentation(data));
      } else {
        dispatch(
          currentPresentation({
            id: `${id}`,
            title: "Untitled Presentation",
            slides: [
              {
                id: Date.now(),
                elements: [
                  {
                    animation: "",
                    bgColor: "",
                    color: "black",
                    content: "",
                    fontSize: 16,
                    opacity: "1",
                    position: {
                      x: 100,
                      y: 100,
                    },
                    type: "text",
                    zIndex: 1,
                    id: Date.now(),
                    width: 300,
                    height: 100,
                  },
                ],
              },
            ],
            selectedPage: Date.now(),
            selectedElement: Date.now(),
            userID: user.uid,
            createdAt: serverTimestamp(),
          })
        );
      }
    }
    // eslint-disable-next-line
  }, [isLoading]);


  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      const currentIndex = pages.findIndex((page) => page.id === selectedPageId);
      if (currentIndex > 0) {
        handleSelectPage(pages[currentIndex - 1].id);
      }
    } else if (e.key === "ArrowDown") {
      const currentIndex = pages.findIndex((page) => page.id === selectedPageId);
      if (currentIndex < pages.length - 1) {
        handleSelectPage(pages[currentIndex + 1].id);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [pages, selectedPageId]);


  return (
    <Box
      p={4}
      bg="#333026"
      width="260px"
      height="100%"
      overflowY="auto"
      maxHeight="calc(100vh - 20px)"
      borderRight="1px solid black"
      shadow="lg"
    >
      <Box mb={4}>
        <Button
          borderRadius={8}
          colorScheme="red"
          onClick={handleAddPage}
          mr={2}
        >
          Add Page
        </Button>
        {selectedPage && (
          <Button borderRadius={8} bg="orange.500" onClick={() => onOpen()}>
            Delete Page
          </Button>
        )}
      </Box>
      {pages?.map((page) => (
        <Card
          id={page.id}
          maxW="220px"
          mb={3}
          height="160px"
          borderColor={selectedPage === page.id ? "blue.500" : "transparent"}
          borderRadius={6}
          onClick={() => handleSelectPage(page.id)}
          key={page.id}
        >
          <CardBody>
            {page.elements.map((element) =>
              element.type === "text" ? (
                <Box
                  key={element.id}
                  position="absolute"
                  top={`${element.position.y * 0.3}px`}
                  left={`${element.position.x * 0.5}px`}
                  zIndex={element.zIndex}
                >
                  <div
                    style={{
                      fontSize: `${element.fontSize * 0.2}px`,
                      color: element.color,
                      backgroundColor: element.bgColor,
                      opacity: element.opacity,
                      zIndex: element.zIndex,
                      whiteSpace: "pre-wrap",
                      width: "auto",
                      height: "auto",
                      wordWrap: "break-word",
                      resize: "none",
                    }}
                  >
                    {element.content}
                  </div>
                </Box>
              ) : (
                <Box
                  key={element.id}
                  position="absolute"
                  top={`${element.position.y * 0.25}px`}
                  left={`${element.position.x * 0.4}px`}
                  zIndex={element.zIndex}
                >
                  <div
                    style={{
                      width: `${element.width * 0.25}px`,
                      height: `${element.height * 0.27}px`,
                      borderRadius: `${element.borderRadius * 0.2}px`,
                      border: "1px dashed",
                      backgroundImage: `url(${element.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                </Box>
              )
            )}
          </CardBody>
        </Card>
      ))}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Page</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure you want to delete this page?</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeletePage}>
              Delete
            </Button>
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LeftSideView;

import React, { useState } from "react";
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
  addElementToPage,
  currentPresentation,
} from "../ReduxStore/pageSlice";
import { clearTextArea, addNewTextArea } from "../ReduxStore/textAreasSlice";
import { clearImage, addNewImage } from "../ReduxStore/imageSlice";
import { useAddPostMutation } from "../ReduxStore/APISlice";
import { useFetchPostQuery } from "../ReduxStore/APISlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";

const LeftSideView = () => {
  const dispatch = useDispatch();
  const presentation = useSelector((state) => state.presentation.presentation);
  const pages = useSelector((state) => state.presentation.presentation.slides);
  const selectedPage = useSelector((state) => state.presentation.selectedPage);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPageId, setSelectedPageId] = useState("");
  const textAreas = useSelector((state) => state.textAreas.textAreas);
  const images = useSelector((state) => state.images.images);
  const [addPost] = useAddPostMutation();

  const [user] = useAuthState(auth);
  const uuid = user?.uid;

  const handleAddPage = () => {
    dispatch(addPage());
    let obj = {
      id: selectedPage,
      elements: [...textAreas, ...images],
    };
    dispatch(addElementToPage(obj));
    console.log(presentation.id);
    addPost({ id: presentation.id, slide: obj, userID: uuid });

    dispatch(clearTextArea());
    dispatch(clearImage());
  };

  const handleSelectPage = (pageId) => {
    let currentText = [];
    let currentImage = [];
    dispatch(selectPage(pageId));
    setSelectedPageId(pageId);

    const currentPage = pages.find((item) => item.id === pageId);

    currentPage.elements.forEach((item) => {
      if (item.type === "image") {
        currentImage.push(item);
      } else {
        currentText.push(item);
      }
    });
    console.log(selectedPageId);

    dispatch(addNewTextArea(currentText));
    dispatch(addNewImage(currentImage));
  };

  const handleDeletePage = () => {
    if (selectedPageId) {
      dispatch(deletePage(selectedPageId));
      onClose();
    }
  };

  let id;

  if (localStorage.getItem("currentPresentation")) {
    id = localStorage.getItem("currentPresentation");
  } else {
    localStorage.setItem("currentPresentation", Date.now());
    dispatch(
      currentPresentation({
        id: Date.now(0),
        slides: [
          {
            id: Date.now(),
            elements: [],
          },
        ],

        selectedPage: Date.now(),
      })
    );
  }

  const { data, error, isLoading } = useFetchPostQuery(`${id}`);

  React.useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error("Error fetching data:", error);
      } else if (data && Array.isArray(data.slides) && data.slides.length > 0) {
        console.log("Fetched data:", data);

        dispatch(
          currentPresentation({
            id: `${id}`,
            slides: data.slides,
            selectedPage: data.slides[0].id,
          })
        );
      } else {
        console.warn("Invalid or empty data received:", data);
      }
    }
  }, [isLoading]);

  return (
    <Box
      p={4}
      bg="green.900"
      width="250px"
      height="100%"
      overflowY="auto"
      maxHeight="calc(100vh - 20px)"
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
      {pages.map((page) => (
        <Card
          id={page.id}
          maxW="md"
          mb={3}
          height="120px"
          borderColor={selectedPage === page.id ? "blue.500" : "transparent"}
          borderWidth={2}
          borderRadius={4}
          onClick={() => handleSelectPage(page.id)}
          key={page.id}
        >
          <CardBody></CardBody>
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

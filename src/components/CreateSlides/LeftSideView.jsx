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
import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  addPage,
  selectPage,
  deletePage,
} from "../ReduxStore/pageSlice";


const LeftSideView = () => {
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.pages.pages);
  const selectedPage = useSelector((state) => state.pages.selectedPage);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPageId, setSelectedPageId] = useState("");

  const handleAddPage = () => {
    dispatch(addPage({ elements: [] }));
  };

  const handleSelectPage = (pageId) => {
    dispatch(selectPage(pageId));
    setSelectedPageId(pageId);
  };

  const handleDeletePage = () => {
    if (selectedPageId) {
      dispatch(deletePage(selectedPageId));
      onClose();
    }
  };
  

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
        <Button borderRadius={8} colorScheme="red" onClick={handleAddPage} mr={2}>
          Add Page
        </Button>
        {selectedPage && (
          <Button borderRadius={8} bg='orange.500'  onClick={() => onOpen()}>
            Delete Page
          </Button>
        )}
      </Box>
      {pages.map((page) => (
        <Card
          maxW="md"
          mb={3}
          height="120px"
          borderColor={selectedPage === page.id ? "blue.500" : "transparent"}
          borderWidth={2}
          borderRadius={4}
          onClick={() => handleSelectPage(page.id)}
          key={page.id}
        >
          <CardBody>
           
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
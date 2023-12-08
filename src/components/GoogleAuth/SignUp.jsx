import React, { useEffect } from "react";
import GoogleAuthModal from "./GoogleAuthModal";
import {
  Modal,
  ModalOverlay,
  Center,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Image,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { authModalState } from "../AuthAtom/SignInAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";

const SignUp = () => {

  const [modalState, setModalState] = useRecoilState(authModalState);

  const [user] = useAuthState(auth);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if(user)
    handleClose();
  }, [user]);


  return (
    <Modal size="xl" isOpen={modalState.open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent mt="5rem" >
        <Center mt={4}>
          <Image src="" width="40%" />
        </Center>
        <ModalHeader textAlign="center">Login With Google</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pb={8}
        >
          <Flex direction="column" align="center" justify="center" width="70%">
            <GoogleAuthModal />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignUp;

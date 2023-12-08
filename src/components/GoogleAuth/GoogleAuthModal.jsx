import React from "react";
import { Box, Flex, Button, useToast, Image,Text } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import showToast from "../chakraUi/toastUtils";
import googleImg from '../../assest/google.png'

const GoogleAuthModal = () => {
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showToast(toast, "Logged in with Google successfully", "", "success");
    } catch (error) {
      showToast(toast, "Error logging in with Google", error.message, "error");
    }
  };

  return (
    <Flex flexDirection="column" gap={10}>
    <Flex flexDirection="column" width="md" position="relative">
      <Image
        src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2lnbnVwfGVufDB8fDB8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=60"
        alt="login_img"
        rounded="md"
        objectFit="cover"
        h="full"
        w="full"
      />
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-t, black, transparent)"
        rounded="md"
      />

      <Box
        position="absolute"
        inset={0}
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        p={8}
        pb={10} 
      >
          <Text fontSize="20px" fontWeight="bold" color="white">
              Just Login With Google And Create Your Own Slides !
            </Text>
      </Box>

     
    </Flex>
    <Box maxW="sm" mx="auto" w="full">
          <Text mt={2} fontSize="base" color="gray.600">
            Already have an account?{" "}
            <Text
              as="a"
              href="#"
              fontWeight="medium"
              color="black"
              _hover={{ textDecoration: "underline" }}
            >
              Sign In
            </Text>
          </Text>
       </Box>
        <Button
        ml={7}
          type="button"
          w="90%"
          rounded="md"
          bg="black"
          color="white"
          fontSize="sm"
          _hover={{ bg: "black/80" }}
          onClick={handleGoogleSignIn}
        >
         <Image src={googleImg} alt="googleauth" height="20px" mr={4} />
          Sign in with Google
        </Button>
    </Flex>
  );
};

export default GoogleAuthModal;

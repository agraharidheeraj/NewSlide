import React from "react";
import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../Firebase/firebaseConfig";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../components/AuthAtom/SignInAtom";
import { useNavigate } from "react-router-dom";

const SlidesOverView = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const navigate = useNavigate();

  const handleCreateUser = () => {
    if (user) {
      navigate(`/presentation/${user?.uid}/create`);
    } else {
      setAuthModalState({ open: true, view: "login" });
    }
  };

  const handleViewSlides = () => {
    if (user) {
      navigate("/presentation/view");
    } else {
      setAuthModalState({ open: true, view: "login" });
    }
  };

  return (
    <Flex
      direction={{ base: "column", md: "column", lg: "row" }}
      align="center"
      justify="space-between"
      p="4"
      color="white"
      margin="5rem"
    >
      {/* First Flex Container */}
      <Flex
        width="90%"
        direction="column"
        align={{ base: "center", md: "center", lg: "flex-start" }}
        mb={{ base: "4", md: "0" }}
      >
        <Text
          fontSize={{ base: "50px", md: "60px" }}
          width={{ base: "100%", md: "100%", lg: "70%" }}
          color="gray.900"
          fontWeight={500}
          mb="2"
        >
          Tell impactful stories, with New Slides
        </Text>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          width={{ base: "100%", md: "100%", lg: "60%" }}
          color="gray.600"
          mb="4"
        >
          Create, present, and collaborate on online presentations in real-time
          and from any device.
        </Text>
        <Flex
          mt={6}
          mb={8}
          align={{ base: "center" }}
          direction={{ base: "column", md: "row" }}
        >
          <Button
            colorScheme="green"
            mr={4}
            borderRadius={4}
            width={{ base: "250px", md: "150px" }}
            mb={{ base: "20px", md: "0px" }}
            height="50px"
            onClick={handleCreateUser}
          >
            Create Slides
          </Button>

          <Button
            variant="outline"
            borderColor="gray.400"
            mr={4}
            fontSize="12pt"
            borderRadius={4}
            shadow="md"
            width={{ base: "250px", md: "200px" }}
            height="50px"
            _hover={{
              borderColor: "blue.600",
            }}
            onClick={handleViewSlides}
          >
            View Presentation
          </Button>
        </Flex>

        {user ? (
          <Text color="gray.600" align="center">
            Welcome To New Slides! Create Your Own PPT
          </Text>
        ) : (
          <Box>
            <Text mr={4} color="gray.800" display="inline-block">
              Don't have an account?
            </Text>
            <Box
              as="span"
              padding={3}
              position="relative"
              _hover={{
                cursor: "pointer",
                _before: {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: -1,
                  backgroundColor: "gray.200",
                  borderRadius: "md",
                },
              }}
              display="inline-block"
            >
              <Text
                color="blue.600"
                fontWeight="bold"
                align="center"
                display="inline-block"
                onClick={() => setAuthModalState({ open: true, view: "login" })}
              >
                Sign up for free
              </Text>
            </Box>
          </Box>
        )}
      </Flex>

      {/* Second Flex Container */}
      <Flex width="100%">
        <Image
          src="https://lh3.googleusercontent.com/W3HBkgBOukkuEyRDn0nleMCyB_si5PQqmc51J-isU6gnKyj1m0zlzOAhvxbtfZHgALetXEuqJMi7dnDlQIZgJlTwe6Td-qyEYKBnJ3xiTPHTUodW5Oo=s0"
          alt="Banner Image"
          boxSize={{ base: "100%", md: "100%" }}
          objectFit="cover"
        />
      </Flex>
    </Flex>
  );
};

export default SlidesOverView;

import React from "react";
import { Flex, Button, useBreakpointValue, useToast } from "@chakra-ui/react";
import UserMenu from "./UserMenu";
import SignUp from "../../components/GoogleAuth/SignUp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../components/AuthAtom/SignInAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import showToast from "../../components/chakraUi/toastUtils";
import { useNavigate } from "react-router-dom";

const RightSide = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [user] = useAuthState(auth);
  const toast = useToast();
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleAuthButtonClick = () => {
    if (user) {
      signOut(auth)
        .then(() => {
          showToast(toast, "Logged out successfully", "", "success");
        })
        .catch((error) => {
          showToast(toast, "Error logging out", error.message, "error");
        });
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
      align={isMobile ? "flex-start" : "flex-start"}
      direction={isMobile ? "column" : "row"}
    >
      <Button
        colorScheme="blue"
        mr={isMobile ? 0 : 4}
        mb={isMobile ? 4 : 0}
        fontSize={16}
        variant="outline"
        borderRadius={4}
        width="150px"
        height="50px"
        onClick={handleViewSlides}
      >
        Go to Slide
      </Button>

      {user ? (
        <div></div>
      ) : (
        <Button
          colorScheme="green"
          mr={isMobile ? 0 : 4}
          mb={isMobile ? 4 : 0}
          borderRadius={4}
          width="150px"
          height="50px"
          onClick={() => setAuthModalState({ open: true, view: "login" })}
        >
          Sign Up
        </Button>
      )}

      <SignUp />
      <UserMenu user={user} />

      {isMobile && (
        <Flex>
          <Button
            align="flex-end"
            colorScheme="green"
            mr={isMobile ? 0 : 4}
            mb={isMobile ? 4 : 0}
            borderRadius={4}
            width="150px"
            height="50px"
            onClick={handleAuthButtonClick}
          >
            {user ? "Logout" : "Login"}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default RightSide;

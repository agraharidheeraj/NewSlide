import React,{useEffect,useState} from "react";
import { Flex, Button, useBreakpointValue, useToast } from "@chakra-ui/react";
import UserMenu from "./UserMenu";
import SignUp from "../../components/GoogleAuth/SignUp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../components/AuthAtom/SignInAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import showToast from "../../components/chakraUi/toastUtils";
import { useNavigate,useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearTextArea } from "../../components/ReduxStore/textAreasSlice";
import { clearImage } from "../../components/ReduxStore/imageSlice";

const RightSide = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [user] = useAuthState(auth);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isFullscreenRequested, setIsFullscreenRequested] = useState(false);
  const presentation = useSelector((state)=> state.presentation.presentation)

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
      dispatch(clearTextArea());
      dispatch(clearImage());
    } else {
      setAuthModalState({ open: true, view: "login" });
    }
  };
  const handleSlideshow = () => {
    if (user) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      setIsFullscreenRequested(true);
    } else {
      setAuthModalState({ open: true, view: "login" });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (isFullscreenRequested && document.fullscreenElement) {
        // After entering fullscreen, navigate
        navigate(`/presentation/${user?.uid}/slideshow`);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        // Redirect when the "Escape" key is pressed
        navigate(`/presentation/${user?.uid}/create/${presentation.id}`);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isFullscreenRequested, user, navigate]);


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
        location.pathname !== "/" && (
          <Button
            colorScheme="green"
            mr={isMobile ? 0 : 4}
            mb={isMobile ? 4 : 0}
            borderRadius={4}
            width="150px"
            height="50px"
            onClick={handleSlideshow}
          >
            Slide Show
          </Button>
        )
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
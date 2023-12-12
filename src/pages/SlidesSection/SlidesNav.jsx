import React, { useState } from "react";
import {
  Flex,
  Image,
  Text,
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useBreakpointValue,
  Input
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import slideslogo from "../../assest/slideslogo.png";
import RightSide from "../HeaderSection/RightSide";
import { useDispatch, useSelector } from "react-redux";
import { changeTitle } from "../../components/ReduxStore/pageSlice";

const SlidesNav = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const presentation = useSelector((state) => state.presentation.presentation);
  console.log(presentation.title);
   const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handletitle =(e) => {
      const value = e.target.value;
      dispatch(changeTitle({title:value}));
  }

  const isMobile = useBreakpointValue({ base: true, md: false });


  return (
    <Flex
      bg="white"
      shadow="md"
      borderBottom="1px solid"
      borderColor="gray.300"
      height="70px"
      padding="6px 12px"
      justifyContent="space-between"
    >
      <Flex align="center">
        <Link to="/">
          <Flex align="center" width={{ base: "50px", md: "auto" }} >
            <Image src={slideslogo} height="40px" margin="12px" />
            
          </Flex>
        </Link>

        <Box width='70%' color='black'>
        <Input placeholder="presentation title" 
        value={presentation.title}
        onChange={handletitle}
        />
        </Box>
      </Flex>

      {isMobile ? (
        // Render Hamburger menu for mobile view
        <Box display={{ base: "block", md: "none" }}>
          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Open menu"
            onClick={handleDrawerOpen}
          />
        </Box>
      ) : (
        // Render RightSide for larger screens
        <RightSide />
      )}

      {/* Drawer for mobile view */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={handleDrawerClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Link to="/">
              <Flex
                align="center"
                width={{ base: "50px", md: "auto" }}
                mr="3rem"
              >
                <Image src={slideslogo} height="40px" margin="12px" />
               
              </Flex>
            </Link>
          </DrawerHeader>
          <DrawerBody>

            <RightSide/>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default SlidesNav;

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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import slideslogo from "../../assest/slideslogo.png";
import RightSide from "./RightSide";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

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
          <Flex align="center" width={{ base: "50px", md: "auto" }} mr="3rem">
            <Image
              src={slideslogo}
              height="40px"
              margin="12px"
              marginMd="25px"
            />
            <Text fontSize="18pt" fontWeight={600} mr={2} color="gray.600">
              New
            </Text>
            <Text fontSize="16pt" fontWeight={500} color="#202124">
              Slides
            </Text>
          </Flex>
        </Link>

        {/* Additional text */}
        {!isMobile && (
          <>
            <Text display="block" fontWeight={500} mr={8}>
              Overview
            </Text>
            <Text display="block" fontWeight={500} mr={8}>
              Features
            </Text>
          </>
        )}
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
                <Image
                  src={slideslogo}
                  height="40px"
                  margin="12px"
                  marginMd="25px"
                />
                <Text fontSize="18pt" fontWeight={600} mr={2} color="gray.600">
                  New
                </Text>
                <Text fontSize="16pt" fontWeight={500} color="#202124">
                  Slides
                </Text>
              </Flex>
            </Link>
          </DrawerHeader>
          <DrawerBody>
            {/*  Overview and Features for mobile view */}
         
              {isMobile && (
                <>
                  <Text fontWeight={500} mb={2}>
                    Overview
                  </Text>
                  <Text fontWeight={500} mb={2}>
                    Features
                  </Text>
                </>
              )}
              {/*  right side components here */}
              <RightSide />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Navbar;

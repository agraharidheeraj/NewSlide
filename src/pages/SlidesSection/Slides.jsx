import React from "react";
import { Flex } from "@chakra-ui/react";
import LeftSideView from "../../components/CreateSlides/LeftSideView";
import MiddleSideView from "../../components/CreateSlides/MiddleSideView";
import RightSideView from "../../components/CreateSlides/RightSideView";

const Slides = () => {
  return (
    <Flex justify="space-between" padding="16px 0px">
      <Flex w="20%" border="1px solid red">
        <LeftSideView />
      </Flex>
      <Flex w="60%" border="1px solid green">
        <MiddleSideView />
      </Flex>

      <Flex w="20%" border="1px solid blue">
        <RightSideView />
      </Flex>
    </Flex>
  );
};

export default Slides;

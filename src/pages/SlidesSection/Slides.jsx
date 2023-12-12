import React from "react";
import { Flex } from "@chakra-ui/react";
import LeftSideView from "../../components/CreateSlides/LeftSideView";
import MiddleSideView from "../../components/CreateSlides/MiddleSideView";
import RightSideView from "../../components/CreateSlides/RightSideView";
import { useParams } from "react-router-dom";
import { AnimationProvider } from "../../components/CustomHook/AnimationContext";
import SlidesNav from "./SlidesNav";


const Slides = () => {
  const { id } = useParams();
  return (
    <AnimationProvider>
     <SlidesNav/>
    <Flex bg='gray.800' overflow='hidden' justify="space-between" padding="16px 0px" height='91vh'>
      <Flex w="18%" p={0} >
        <LeftSideView  id={id}/>
      </Flex>
      <Flex w="63%" >
        <MiddleSideView />
      </Flex>

      <Flex w="20%" p={0}>
        <RightSideView />
      </Flex>
    </Flex>
    </AnimationProvider>
  );
};

export default Slides;

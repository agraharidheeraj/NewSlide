import React from 'react'
import {Flex} from '@chakra-ui/react';
import LeftSideView from '../../components/CreateSlides/LeftSideView'
import MiddleSideView from '../../components/CreateSlides/MiddleSideView'
import RightSideView from '../../components/CreateSlides/RightSideView'

const Slides = () => {
  return (
    <Flex>
      <LeftSideView/>
      <MiddleSideView/>
      <RightSideView/>
    </Flex>
  )
}

export default Slides
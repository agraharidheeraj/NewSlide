// SlideList.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Grid,
  Flex,
  Card,
  CardBody,
  Divider,
  Image,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore, auth } from "../../Firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assest/slideslogo.png";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../HeaderSection/Navbar";
import { AddIcon,DeleteIcon } from "@chakra-ui/icons";
import {useDeletePresentationMutation}  from "../../components/ReduxStore/APISlice";
import showToast from "../../components/chakraUi/toastUtils";


const SlideList = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [deletePresentation] = useDeletePresentationMutation()
  const toast = useToast();
   const [refresh,setRefresh] = useState(false);
  function handlePresentationClick(id) {
    navigate(`/presentation/${user.uid}/create/${id}`);
  }

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        // Check if user is null or loading
        if (!user || loadingAuth) {
          return;
        }

        const userId = user.uid;
        const userPresentationsQuery = query(
          collection(firestore, "presentation"),
          where("userID", "==", userId)
        );

        const presentationCollection = await getDocs(userPresentationsQuery);
        const presentationData = presentationCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPresentations(presentationData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPresentations();
  }, [user, loadingAuth,refresh]);


  const handleDeletePresentation = async (event,id) => {
    event.stopPropagation();
    try {
      if(user ){
        await deletePresentation(id);
        setRefresh((prev)=> !prev)
         showToast(toast, "Deleted presentation")
       }
    } catch (error) {
       console.error(error);
       showToast(toast, "error deleting presentation")
    }
       
  }
 

  if (loading || loadingAuth) {
    return (
      <Flex
        height="100vh"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }

  if (error || errorAuth) {
    return <div>Error fetching presentation data: {error || errorAuth}</div>;
  }

  const formatTimestamp = (timestamp) => {
    const distance = formatDistanceToNow(timestamp.toDate(), {
      addSuffix: true,
    });
    return distance;
  };

  return (
    <Box>
      <Navbar />
      <Text fontSize="24px" fontWeight={800} color="gray.600" p={4}>
        Recent Presentations
      </Text>

      <Grid templateColumns="repeat(5, 1fr)" gap={6} p={4}>
        <Link to={`/presentation/${user?.uid}/create/${Date.now()}`}>
          <Card
            border="1px solid"
            borderColor="gray.400"
            w="300px"
            h="280px"
            boxShadow="lg"
          >
            <CardBody
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Icon
                as={AddIcon}
                boxSize={12}
                bgGradient="linear(to-r, teal.500, green.500)"
                borderRadius="full"
                p={2}
                color="white"
              />
              <Text>Blank Presentation</Text>
            </CardBody>
          </Card>
        </Link>

        {presentations.map((presentation) => (
          <Card
            border="1px solid "
            borderColor="gray.400"
            w="300px"
            h="280px"
            cursor="pointer"
            onClick={() => handlePresentationClick(presentation.id)}
          >
            <CardBody key={presentation.id}>

              {/* Display all elements of the first slide */}
              {presentation.slides.length > 0 &&
                presentation.slides[0].elements.map((element) =>
                  element.type === "text" ? (
                    <Box
                      key={element.id}
                      position="absolute"
                      top={`${element.position.y * 0.3}px`}
                      left={`${element.position.x * 0.3}px`}
                      zIndex={element.zIndex}
                    >
                      <div
                        style={{
                          fontSize: `${element.fontSize * 0.3}px`,
                          color: element.color,
                          backgroundColor: element.bgColor,
                          opacity: element.opacity,
                          zIndex: element.zIndex,
                          whiteSpace: "pre-wrap",
                          width: "auto",
                          wordWrap: "break-word",
                        }}
                      >
                        {element.content}
                      </div>
                    </Box>
                  ) : (
                    <Box
                      key={element.id}
                      position="absolute"
                      top={`${element.position.y * 0.3}px`}
                      left={`${element.position.x * 0.3}px`}
                      zIndex={element.zIndex}
                    >
                      <div
                        style={{
                          width: `${element.width * 0.35}px`,
                          height: `${element.height * 0.33}px`,
                          borderRadius: `${element.borderRadius}px`,
                          border: "1px dashed",
                          backgroundImage: `url(${element.imageUrl})`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                    </Box>
                  )
                )}
            </CardBody>
            <Divider />
            {/* Display the title of the presentation */}

            <Flex p={2} direction="column" >
              <Text p={2} fontWeight="semibold">
                {presentation.title}
                
              </Text>
              <Flex align="center" mr={2} justifyContent='space-between'>
                <Flex align='center'>
                <Image ml={1} width="25px" height="25px" src={logo}></Image>
                <Text ml="10px" color="gray.400" fontSize="9pt">
                  Updated By {formatTimestamp(presentation.createdAt)}
                </Text>
                </Flex>
                
                <Flex  align='center'
                   onClick={(event) => handleDeletePresentation(event,presentation.id)}
                >
                <Icon color='red' as={DeleteIcon}></Icon>
                </Flex>
            
              </Flex>
             
            </Flex>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

export default SlideList;

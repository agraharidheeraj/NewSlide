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
} from "@chakra-ui/react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore, auth } from "../../Firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import logo from "../../assest/slideslogo.png";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../HeaderSection/Navbar";

const SlideList = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, loadingAuth, errorAuth] = useAuthState(auth);

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
  }, [user, loadingAuth]);

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
      <Navbar/>
      <Text fontSize="24px" fontWeight={800} color="gray.600" p={4}>
        Recent Presentations
      </Text>
      <Grid templateColumns="repeat(5, 1fr)" gap={6} p={4}>
        {presentations.map((presentation) => (
          <Card border="1px solid " borderColor="gray.400" w="270px" h="290px">
            <CardBody
              key={presentation.id}
              onClick={() => handlePresentationClick(presentation.id)}
              cursor="pointer"
            >
              {/* Display all elements of the first slide */}
              {presentation.slides.length > 0 &&
                presentation.slides[0].elements.map((element) => (
                  <Box key={element.id}>
                    {element.type === "text" ? (
                      <Text>{element.content}</Text>
                    ) : (
                      <img
                        src={element.imageUrl}
                        alt="Slide Element"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Box>
                ))}
            </CardBody>
            <Divider />
            {/* Display the title of the presentation */}

            <Flex p={2} direction="column">
              <Text p={2} fontWeight="semibold">
                {presentation.title}
              </Text>
              <Flex align='center'>
              <Image ml={1} width="25px" height="25px" src={logo}></Image>
              <Text ml='10px'  color="gray.400" fontSize="9pt">
                Updated By {formatTimestamp(presentation.createdAt)}
              </Text>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

export default SlideList;

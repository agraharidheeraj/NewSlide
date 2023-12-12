import React, { useEffect, useState } from "react";
import { Box, Spinner, Text, Grid, Flex } from "@chakra-ui/react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore, auth } from "../../Firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const SlideList = () => {
  const [presentation, setPresentation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, loadingAuth, errorAuth] = useAuthState(auth);

  function handlePresentationClick(id) {
    navigate(`/presentation/:UserId/create/${id}`);
  }

  useEffect(() => {
    const fetchpresentation = async () => {
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
        setPresentation(presentationData);
        console.log(presentationData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchpresentation();
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

  return (
    <Box>
      <Text fontSize="24px" fontWeight={800} color="gray.600" p={4}>
        Recent Presentations
      </Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={4} p={4}>
        {presentation.map((presentation) => (
          <Box
            key={presentation.id}
            border="1px solid"
            borderRadius="md"
            p={4}
            onClick={() => handlePresentationClick(presentation.id)}
            cursor="pointer"
          >
            <Text fontSize="lg" fontWeight="bold">
              Presentation ID: {presentation.id}
            </Text>

            <Text mt={2}></Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default SlideList;
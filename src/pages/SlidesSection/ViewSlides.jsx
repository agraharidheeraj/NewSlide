import React, { useEffect, useState } from "react";
import { Box, Spinner, Text, Grid, Flex } from "@chakra-ui/react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore, auth } from "../../Firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const SlideList = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, loadingAuth, errorAuth] = useAuthState(auth);

  useEffect(() => {
    const fetchSlides = async () => {
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

        const slidesCollection = await getDocs(userPresentationsQuery);
        const slidesData = slidesCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSlides(slidesData);
        console.log(slidesData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSlides();
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
        {slides.map((slide) => (
          <Box key={slide.id} border="1px solid" borderRadius="md" p={4}>
            <Text fontSize="lg" fontWeight="bold">
              Slide ID: {slide.id}
            </Text>

            <Text mt={2}></Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default SlideList;

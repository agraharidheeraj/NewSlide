import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import { firestore } from "../../Firebase/firebaseConfig";
export const createPostApi = createApi({
  reducerPath: "createPostApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["createPost"],
  endpoints: (builder) => ({
    fetchPost: builder.query({
      async queryFn(id) {
        try {
          // If an ID is provided, fetch the specific document
          if (id) {
            const docRef = doc(firestore, "presentation", id);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
              const postData = docSnapshot.data();
              console.log(postData);
              return { data: postData };
            } else {
              console.log("Document not found");
              return { data: null };
            }
          } else {
            // If no ID is provided, fetch the entire collection
            const postSnapShot = await getDocs(
              collection(firestore, "presentation")
            );
            const postData = postSnapShot.docs.map((doc) => doc.data());
            console.log(postData);
            return { data: postData };
          }
        } catch (err) {
          console.log("An error occurred:", err);
          return { error: err };
        }
      },
      providesTags: (result, error, id) => [{ type: "createPost", id }],
    }),

    addPost: builder.mutation({
      async queryFn(data) {
        try {
          const { id, slide, userID } = data;
          console.log(slide);
          const postRef = doc(firestore, "presentation", id.toString());
          const postSnapshot = await getDoc(postRef);

          if (!postSnapshot.exists()) {
            // If the document doesn't exist, include the userID in the data
            const updatedData = { slides: [slide], userID: userID };
            await setDoc(postRef, updatedData);
          } else {
            // If the document already exists, update the slides array
            const existingSlides = postSnapshot.data()?.slides || [];
            const updatedSlides = [...existingSlides, slide];
            await setDoc(postRef, { slides: updatedSlides });
          }

          console.log("ok");
          return { data: "ok" };
        } catch (err) {
          console.log("An error occurred:", err);
          return { error: err };
        }
      },
      invalidatesTags: ["createPost"],
    }),
  }),
});
export const { useFetchPostQuery, useAddPostMutation } = createPostApi;

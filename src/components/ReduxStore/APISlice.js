import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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

    // Update Elements Mutation
    updateDb: builder.mutation({
      async queryFn(data) {
        console.log("updating", data.id);
        try {
          const postRef = doc(firestore, "presentation", data.id.toString());
          await setDoc(postRef, data);
          console.log("Elements updated successfully");
          return { data: "ok" };
        } catch (err) {
          console.error("An error occurred:", err);
          return { error: err };
        }
      },
      invalidatesTags: ["createPost"],
    }),

    // Delete Slide Mutation
    deleteSlide: builder.mutation({
      async queryFn(data) {
        try {
          const { id, slideId } = data;
          const postRef = doc(firestore, "presentation", id.toString());
          const postSnapshot = await getDoc(postRef);

          if (!postSnapshot.exists()) {
            console.error("Document not found");
            return { error: "Document not found" };
          }

          const existingSlides = postSnapshot.data()?.slides || [];
          const updatedSlides = existingSlides.filter((s) => s.id !== slideId);

          await setDoc(postRef, { slides: updatedSlides });

          console.log("Slide deleted successfully");
          return { data: "ok" };
        } catch (err) {
          console.error("An error occurred:", err);
          return { error: err };
        }
      },
      invalidatesTags: ["createPost"],
    }),
    saveImage: builder.mutation({
      async queryFn(data) {
        try {
          const { id, imageFile } = data;
          const storage = getStorage();
          const storageRef = ref(storage, `images/${id}`);
          await uploadBytes(storageRef, imageFile);
          const imageUrl = await getDownloadURL(storageRef);

          console.log("Image saved successfully");
          return { data: imageUrl };
        } catch (err) {
          console.error("An error occurred:", err);
          return { error: err };
        }
      },
    }),

    deletePresentation: builder.mutation({
      async queryFn(data) {
        try {
          const postRef = doc(firestore, "presentation", data.toString());
          const docRef = await getDoc(postRef);
          if (docRef.exists()) {
            await deleteDoc(postRef);
          }
        } catch (error) {
          console.error("An error occurred while deleting :", error);
        }
      },
    }),
  }),
});
export const {
  useFetchPostQuery,
  useUpdateDbMutation,
  useDeleteSlideMutation,
  useSaveImageMutation,
  useDeletePresentationMutation,
} = createPostApi;

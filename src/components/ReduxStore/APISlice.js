import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
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

    // addPost: builder.mutation({
    //   async queryFn(data) {
    //     try {
    //       const { id, slide, userID } = data;
    //       console.log(slide);
    //       const postRef = doc(firestore, "presentation", id.toString());
    //       const postSnapshot = await getDoc(postRef);

    //       if (!postSnapshot.exists()) {
    //         // If the document doesn't exist, include the userID in the data
    //         const updatedData = { slides: [slide], userID: userID };
    //         await setDoc(postRef, updatedData);
    //       } else {
    //         // If the document already exists, update the slides array only if the slide is not present
    //         const existingSlides = postSnapshot.data()?.slides || [];

    //         if (
    //           !existingSlides.some((existingSlide) => existingSlide === slide)
    //         ) {
    //           // If the slide is not present, update the slides array
    //           const updatedSlides = [...existingSlides, slide];
    //           await setDoc(postRef, { slides: updatedSlides, userID: userID });
    //         } else {
    //           console.log("Slide already exists in the presentation.");
    //         }
    //       }

    //       console.log("ok");
    //       return { data: "ok" };
    //     } catch (err) {
    //       console.log("An error occurred:", err);
    //       return { error: err };
    //     }
    //   },
    //   invalidatesTags: ["createPost"],
    // }),

    // Update Elements Mutation
    updateElements: builder.mutation({
      async queryFn(data) {
        console.log("updating", data.id);
        try {
          const { id, slideId,title, updatedElements, userID } = data;
          console.log("title", title);
          const postRef = doc(firestore, "presentation", id.toString());
          const postSnapshot = await getDoc(postRef);

          console.log(postSnapshot.exists());

          let updatedSlides;

          // If the document exists, update the slides array or add a new slide if it doesn't exist
          if (postSnapshot.exists()) {
            const existingSlides = postSnapshot.data()?.slides || [];
            let slideExists = false;

            updatedSlides = existingSlides.map((s) => {
              if (s.id === slideId) {
                // Update the elements if the slide exists
                slideExists = true;
                return { ...s, elements: updatedElements || s.elements };
              }
              console.log(s);
              return s;
            });

            // If the slide doesn't exist, add a new slide to the array
            if (!slideExists) {
              updatedSlides.push({
                id: slideId,
                elements: updatedElements || [],
              });
            }
          } else {
            // If the document doesn't exist, create a new one with the new slide
            console.log("new one");
            updatedSlides = [{ id: slideId, elements: updatedElements || [] }];
          }

          // Set the document with the updated or new slides
          await setDoc(postRef, { slides: updatedSlides,title: title, userID: userID });

          console.log("Elements updated successfully");
          return { data: "ok" };
        } catch (err) {
          console.error("An error occurred:", err);
          return { error: err };
        }
      },
      invalidatesTags: ["createPost"],
    }),

    // Delete Elements Mutation
    deleteElements: builder.mutation({
      async queryFn(data) {
        try {
          const { id, slideId, deletedElementIds } = data;
          const postRef = doc(firestore, "presentation", id.toString());
          const postSnapshot = await getDoc(postRef);

          if (!postSnapshot.exists()) {
            console.error("Document not found");
            return { error: "Document not found" };
          }

          const existingSlides = postSnapshot.data()?.slides || [];
          const updatedSlides = existingSlides.map((s) => {
            if (s.id === slideId) {
              // Filter out elements with matching IDs
              s.elements = s.elements.filter(
                (el) => !deletedElementIds.includes(el.id)
              );
            }
            return s;
          });

          await setDoc(postRef, { slides: updatedSlides });

          console.log("Elements deleted successfully");
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
  }),
});
export const {
  useFetchPostQuery,
  //   useAddPostMutation,
  useUpdateElementsMutation,
  useDeleteElementsMutation,
  useDeleteSlideMutation,
  useSaveImageMutation,
} = createPostApi;

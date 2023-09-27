import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // CREATE COURSE
        createCourse: builder.mutation({
            query: ( data ) => ({
                url: "create-course",
                method: "POST",
                body: data ,
                credentials: 'include' as const
            })
        }),
       // GET ALL COURSES ADMIN
       getAllCourses: builder.query({
        query: () => ({
            url: "get-courses-admin",
            method: "GET",
            credentials: "include" as const
        })
       }),
       // DELETE COURSE
       deleteCourse: builder.mutation({
        query: (id) => ({
            url: `delete-course/${id}`,
            method: "DELETE",
            credentials: "include" as const
        })
       }),
       // EDIT COURSE
       editCourse: builder.mutation({
        query: ({ id, data }) => ({
          url: `edit-course/${id}`,
          method: "PUT",
          body: data,
          credentials: "include" as const,
        }),
      }),
      // GET ALL COURSES
      getUsersAllCourses: builder.query({
        query: () => ({
            url: "get-courses",
            method: "GET",
            credentials: "include" as const
        })
      }),
       // GET COURSE
       getCourseDetails: builder.query({
        query: (id) => ({
            url: `get-course/${id}`,
            method: "GET",
            credentials: "include" as const
        })
      }),
       // GET All The Course Data
       getCourseContent: builder.query({
        query: (id) => ({
            url: `get-course-content/${id}`,
            method: "GET",
            credentials: "include" as const
        })
      }),
      // Create New Qustion
      addNewQuestion: builder.mutation({
        query: ({ question, courseId, contentId }) => ({
            url: 'add-question',
            body: { question, courseId, contentId},
            method: "PUT",
            credentials: "include" as const
        })
      }),
      // Add Answer In Question
      addAnswerInQuestion: builder.mutation({
        query: ({ answer, courseId, contentId, questionId }) => ({
          url: "add-answer",
          body: {
            answer,
            courseId,
            contentId,
            questionId,
          },
          method: "PUT",
          credentials: "include" as const,
        }),
      }),
      // Add Review In Course
      addReviewInCourse: builder.mutation({
        query: ({ review, rating, courseId }: any) => ({
          url: `add-review/${courseId}`,
          body: {
            review,
            rating,
          },
          method: "PUT",
          credentials: "include" as const,
        }),
      }),
      // Add A Reply In Review
      addReplyInReview: builder.mutation({
        query: ({ comment, courseId, reviewId }: any) => ({
          url: `add-reply`,
          body: {
            comment, courseId, reviewId
          },
          method: "PUT",
          credentials: "include" as const,
        }),
      }),
    })
})

export const { useCreateCourseMutation, useGetAllCoursesQuery, useDeleteCourseMutation,
 useEditCourseMutation, useGetUsersAllCoursesQuery, useGetCourseDetailsQuery,
  useGetCourseContentQuery, useAddNewQuestionMutation, useAddAnswerInQuestionMutation,
useAddReplyInReviewMutation, useAddReviewInCourseMutation } = courseApi
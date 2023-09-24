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
       })
    })
})

export const {useCreateCourseMutation, useGetAllCoursesQuery, useDeleteCourseMutation} = courseApi
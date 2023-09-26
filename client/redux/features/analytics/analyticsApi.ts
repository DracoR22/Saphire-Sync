import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET COURSES ANALYTICS
        getCoursesAnalytics: builder.query({
            query: () => ({
                url: 'get-courses-analytics',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
           // GET USERS ANALYTICS
           getUsersAnalytics: builder.query({
            query: () => ({
                url: 'get-users-analytics',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
            // GET USERS ANALYTICS
            getOrdersAnalytics: builder.query({
              query: () => ({
                url: 'get-orders-analytics',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
    })
})

export const { useGetCoursesAnalyticsQuery, useGetUsersAnalyticsQuery, useGetOrdersAnalyticsQuery } = analyticsApi
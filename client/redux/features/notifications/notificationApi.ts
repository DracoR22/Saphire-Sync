import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET NOTIFICATIONS
        getAllNotifications: builder.query({
          query: () => ({
            url: "get-all-notifications",
            method: "GET",
            credentials: "include" as const,
          }),
        }),
        // UPDATE NOTIFICATIONS
        updateNotificationStatus: builder.mutation({
          query: (id) => ({
            url: `/update-notification/${id}`,
            method: "PUT",
            credentials: "include" as const,
          }),
        }),
      }),
})

export const { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } = notificationsApi;
import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // CHANGE USER AVATAR
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: "update-user-avatar",
                method: "PUT",
                body: { avatar },
                credentials: "include" as const
            })
        }),
        // EDIT USER NAME
        editProfile: builder.mutation({
            query: ({name}) => ({
                url: "update-user-info",
                method: "PUT",
                body: { name },
                credentials: "include" as const
            })
        }),
         // UPDATE USER PASSWORD
         updatePassword: builder.mutation({
            query: ({oldPassword, newPassword}) => ({
                url: "update-user-password",
                method: "PUT",
                body: { oldPassword, newPassword },
                credentials: "include" as const
            })
        }),
        // GET ALL USERS
        getAllUsers: builder.query({
            query: () => ({
                url: "get-users",
                method: "GET",
                credentials: "include" as const
            })
        }),
        // UPDATE USER ROLE
        updateUserRole: builder.mutation({
            query: ({ email, role }) => ({
              url: "update-user",
              method: "PUT",
              body: { email, role },
              credentials: "include" as const,
            }),
          }),
          // DELETE USER
          deleteUser: builder.mutation({
            query: (id) => ({
              url: `delete-user/${id}`,
              method: "DELETE",
              credentials: "include" as const,
            }),
          }),
    })
})

export const {useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation,
 useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserRoleMutation} = userApi
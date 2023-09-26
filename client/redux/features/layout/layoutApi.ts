import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET HERO DATA
        getHeroData: builder.query({
            query: (type) =>({
                url: `get-layout/${type}`,
                method: 'GET',
                credentials: "include" as const
            })
        }),
        // EDIT LAYOUT
        editLayout: builder.mutation({
            query: ({ type, image, title, subTitle, faq, categories }) => ({
              url: `edit-layout`,
              body: {
                type,
                image,
                title,
                subTitle,
                faq,
                categories,
              },
              method: "PUT",
              credentials: "include" as const,
            }),
          }),
    })
})

export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi
'use client'

import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./features/api/apiSlice"
import authSlice from "./features/auth/authSlice"

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice
    },
    devTools: false,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})

// Call the refresh function on every page load
const initializeApp = async () => {
    await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }))
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }))
}

initializeApp()
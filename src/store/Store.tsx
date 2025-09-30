import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Uses localStorage
import recipeReducer from './Slice'
import authReducer from './AuthSlice'

//  Configuration for persisting the auth state
const persistConfig = {
    key: 'auth', // Only persist the auth state
    storage, // Saves to localStorage
    whitelist: ['token', 'userId'],
    debug: true, // Enable logs
}

//  Wrap `authReducer` with `persistReducer` to make it persistent
const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
    reducer: {
        recipe: recipeReducer,
        auth: persistedAuthReducer, // Persisted auth state
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }),
})

//  Create the persistor instance
export const persistor = persistStore(store)

//  Type for RootState
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

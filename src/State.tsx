import { configureStore } from '@reduxjs/toolkit'
import DbContextReducer from './ReduxSlice/DatabaseContext.tsx';
import UserContextReducer from './ReduxSlice/UserContext.tsx';

export default configureStore({
    reducer: {
        DatabaseContext: DbContextReducer,
        UserContext: UserContextReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['DatabaseContext.value'],
            },
        }),
});

import { createSlice } from '@reduxjs/toolkit'

export type User = {
    email: string,
    id: string,
    username: string
};

export const UserContextSlice = createSlice({
    name: 'UserContext',
    initialState: {
        value: null
    },
    reducers: {
        set: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { set } = UserContextSlice.actions;
export default UserContextSlice.reducer;

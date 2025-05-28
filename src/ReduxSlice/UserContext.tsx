import { createSlice } from '@reduxjs/toolkit'

export const UserContextSlice = createSlice({
    name: 'UserContext',
    initialState: {
        value: null
    },
    reducers: {
        set: (state, action) => {
            console.log(action.payload);
            state.value = action.payload;
        }
    }
});

export const { set } = UserContextSlice.actions;
export default UserContextSlice.reducer;

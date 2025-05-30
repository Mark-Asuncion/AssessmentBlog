import { createSlice } from '@reduxjs/toolkit'

export type User = {
    email: string,
    id: string,
    username: string
};

function isEqual(state, newU) {
    // console.log(state, newU);
    if (!state || !newU) {
        return false;
    }

    if (state.email != newU.email) {
        return false;
    }
    if (state.id != newU.id) {
        return false;
    }
    if (state.username != newU.username) {
        return false;
    }
    return true;
}

export const UserContextSlice = createSlice({
    name: 'UserContext',
    initialState: {
        value: null
    },
    reducers: {
        set: (state, action) => {
            if (isEqual(state.value, action.payload)) {
                return;
            }
            state.value = action.payload;
        }
    }
});

export const { set } = UserContextSlice.actions;
export default UserContextSlice.reducer;

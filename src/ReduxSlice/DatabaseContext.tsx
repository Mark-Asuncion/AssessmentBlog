import { createSlice } from '@reduxjs/toolkit'
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type DBContext = SupabaseClient<any, "public", any>;

export function toUser(session: any) {
    return {
        email: session.user.email,
        id: session.user.id,
        username: session.user.user_metadata.username
    };
}

export const DatabaseContextSlice = createSlice({
    name: 'DatabaseContext',
    initialState: {
        value: createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
        )
    },
    reducers: { },
});

// export const { } = UserContextSlice.actions;
export default DatabaseContextSlice.reducer;

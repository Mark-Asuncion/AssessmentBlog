import type { NavigateFunction } from "react-router-dom";
import { type DBContext } from "../ReduxSlice/DatabaseContext";
import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { set } from "../ReduxSlice/UserContext";

export async function signOut(
    navigate: NavigateFunction,
    dbContext: DBContext,
    reduxDispatcher: Dispatch<UnknownAction>
) {
    try {
        const res = await dbContext.auth.signOut();
        if (res.error)
            throw res.error;

        reduxDispatcher(set(null));
        navigate("/");
    }
    catch (e) {
        console.log(e);
    }
}

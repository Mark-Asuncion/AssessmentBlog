import type { NavigateFunction } from "react-router-dom";
import { toUser, type DBContext } from "../ReduxSlice/DatabaseContext";
import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { set } from "../ReduxSlice/UserContext";

export async function autoLogin(
    navigate: NavigateFunction,
    dbContext: DBContext,
    reduxDispatcher: Dispatch<UnknownAction>
) {
    try {
        const res = await dbContext.auth.getSession();
        if (res.data.session == null)
                return;

        reduxDispatcher(set(toUser(res.data.session)));
        navigate("/home");
    }
    catch (e) {
        console.log(e);
    }
}

export async function isLoggedIn(dbContext: DBContext): Promise<boolean> {
    try {
        const res = await dbContext.auth.getSession();
        if (res.data.session == null)
                return false;
        return true;
    }
    catch (e) {
        console.log(e);
    }
    return false;
}

import type { NavigateFunction } from "react-router-dom";
import { toUser, type DBContext } from "../ReduxSlice/DatabaseContext";
import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { set } from "../ReduxSlice/UserContext";

export async function autoLogin(
    dbContext: DBContext,
    reduxDispatcher: Dispatch<UnknownAction>,
    navigate?: NavigateFunction,
    successRoute: string = "/home"
) {
    try {
        const res = await dbContext.auth.getSession();
        if (res.data.session == null)
                return;

        // console.log(res);
        if (res.error) {
            if (navigate)
                navigate("/login")
            reduxDispatcher(set(null));
            throw res.error;
        }
        const user = toUser(res.data.session);
        // console.trace("user", user);
        reduxDispatcher(set(user));
        if (navigate && successRoute.length != 0)
            navigate(successRoute);
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

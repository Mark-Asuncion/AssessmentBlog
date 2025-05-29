import { useDispatch, useSelector } from "react-redux";
import { MAppBar } from "../Components/MAppBar";
import { PostEditor } from "../Components/PostEditor";
import type { DBContext } from "../ReduxSlice/DatabaseContext";
import { autoLogin } from "../Utils/AutoLogin";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import type { User } from "../ReduxSlice/UserContext";
import { useNavigate } from "react-router-dom";

export function Post() {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const userInfo = useSelector(state => state["UserContext"].value) as User;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        autoLogin(
            dbContext,
            dispatch,
            navigate,
            ""
        );
    }, [])

    if (userInfo == null) {
        return <div className="h-full w-full flex-col items-center">
            <CircularProgress />
        </div>
    }

    return <>
        <MAppBar title="Create a post" />
        <div className="p-2">
            <PostEditor userInfo={userInfo} />
        </div>
    </>
}

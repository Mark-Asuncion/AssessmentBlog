import { useNavigate, useParams } from "react-router-dom"
import { MAppBar } from "../Components/MAppBar";
import { useEffect, useState } from "react";
import { autoLogin } from "../Utils/AutoLogin";
import { useDispatch, useSelector } from "react-redux";
import type { DBContext } from "../ReduxSlice/DatabaseContext";
import type { User } from "../ReduxSlice/UserContext";
import { getBlog } from "../Utils/Blog";
import { CircularProgress } from "@mui/material";
import { PostEditor } from "../Components/PostEditor";

export function Edit() {
    const { id } = useParams();
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const userInfo = useSelector(state => state["UserContext"].value) as User;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ blog, setBlog ] = useState(null);

    useEffect(() => {
        autoLogin(
            dbContext,
            dispatch,
            navigate,
            ""
        )
    }, [])

    useEffect(() => {
        if (!userInfo)
            return;

        getBlog(dbContext, id)
            .then((blog) => {
                if (blog.user_id !== userInfo.id) {
                    navigate("/");
                    return;
                }
                setBlog(blog);
            })
            .catch((e) => {
                console.log(e);
                navigate("/");
            });
    }, [userInfo])

    if (!userInfo) {
        return <></>;
    }
    console.log(blog);

    return <>
        <MAppBar title="Edit Post" />
        {
            (blog)? 
                <div className="p-2">
                    <PostEditor blog={blog} userInfo={userInfo}/>
                </div>:
                <div className="flex items-center justify-center w-full h-full">
                    <CircularProgress />
                </div>
        }
    </>
}

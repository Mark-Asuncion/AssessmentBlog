import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { autoLogin } from "../Utils/AutoLogin";
import { useDispatch, useSelector } from "react-redux";
import { getUserByUsername, type User } from "../Utils/User";
import type { DBContext } from "../ReduxSlice/DatabaseContext";
import { MAppBar } from "../Components/MAppBar";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { RowAvatar } from "../Components/Avatar";
import { ListBlog } from "../Components/ListBlogs";

export function MyPost() {
    const { username } = useParams();
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const userInfo = useSelector(state => state["UserContext"].value) as User;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ obtUser, setObtUser ] = useState<User | null>(null);

    useEffect(() => {
        autoLogin(
            dbContext,
            dispatch,
            navigate,
            ""
        );
    }, [])

    useEffect(() => {
        getUserByUsername(dbContext, username)
            .then((user) => setObtUser(user))
            .catch((e) => console.log(e));
    },[]);

    if (obtUser == null) {
        return <div className="h-full w-full flex flex-col justify-center items-center">
                <CircularProgress />
        </div>
    }

    return <>
        <MAppBar title={(userInfo)? "My Post":""} />
        <div className="gap-2 flex flex-col justify-center md:w-[60%] m-2 md:m-auto">
            <RowAvatar userInfo={obtUser} subtitle={obtUser.email} />
            <Divider />
            <Typography variant="h3" component="div">Posts</Typography>
            <ListBlog userId={obtUser.id} />
        </div>
    </>
}

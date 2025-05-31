import { Divider } from "@mui/material";
import { useEffect } from "react";
import { OpenPostEditor } from "../Components/PostEditor";
import { MAppBar } from "../Components/MAppBar";
import { autoLogin } from "../Utils/AutoLogin";
import { useDispatch, useSelector } from "react-redux";
import type { DBContext } from "../ReduxSlice/DatabaseContext";
import { ListBlog } from "../Components/ListBlogs";

export function Home() {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const userInfo = useSelector(state => state["UserContext"].value) as User;

    useEffect(() => {
        autoLogin(
            dbContext,
            dispatch
        );
    }, [])

    return <>
        <MAppBar title="Blogs" />
        <div className="gap-2 flex flex-col justify-center md:w-[60%] m-2 md:m-auto">
            <OpenPostEditor />
            <Divider />
            <ListBlog />
        </div>
    </>
}

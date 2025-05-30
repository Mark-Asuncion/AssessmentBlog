import { CircularProgress, Divider, List, ListItem, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { OpenPostEditor } from "../Components/PostEditor";
import { MAppBar } from "../Components/MAppBar";
import { autoLogin } from "../Utils/AutoLogin";
import { useDispatch, useSelector } from "react-redux";
import type { DBContext } from "../ReduxSlice/DatabaseContext";
import { type Blog, deleteBlog, getBlogs } from "../Utils/Blog";
import type { User } from "../ReduxSlice/UserContext";
import { BlogItem } from "../Components/PostItem";
import { useInView } from "react-intersection-observer";

export function Home() {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const userInfo = useSelector(state => state["UserContext"].value) as User;
    const theme = useTheme();
    const isBreakpointMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const [ blogs, setBlogs ] = useState<Blog[]>([]);
    const [ pageOffset, setPageOffset ] = useState(0);

    // pagination
    const [ refLoader, inView, _ ] = useInView()

    useEffect(() => {
        if (!inView) {
            return;
        }
        console.log(pageOffset);
        getBlogs( dbContext, pageOffset+1)
            .then((blogs) => {
                if (blogs.length == 0) {
                    return;
                }
                setPageOffset(pageOffset+1);
                setBlogs((old) => {
                    return [
                        ...old,
                        ...blogs
                    ];
                })
            });
    }, [inView])

    useEffect(() => {
        autoLogin(
            dbContext,
            dispatch
        );

        try {
            getBlogs(
                dbContext,
                pageOffset
            ).then((blogs) => setBlogs(blogs));
        }
        catch (e) {
            console.log(e);
        }

    }, [])

    const deleteBlogById = useCallback(async (blogId: string) => {
        try {
            await deleteBlog(dbContext, blogId);
            setBlogs((blogs) => {
                return [
                    ...blogs.filter(({ id }: Blog) => {
                        return id !== blogId;
                    })
                ];
            });
        }
        catch (e) {
            console.log(e);
        }
    }, []);

    return <>
        <MAppBar title="Blogs" />
        <div className={`p-2 gap-2 flex flex-col justify-center m-auto ${(isBreakpointMdUp)? "w-[60%]":""}`}>
            <OpenPostEditor />
            <Divider />
            <List className="w-[100%]" role="listbox">
                {/* <TransitionGroup> */}
                {/* { */}
                {/*     blogs.map((v) => */}
                {/*         <Collapse key={v.id}> */}
                {/*                 <BlogItem key={v.id} userInfo={userInfo} blog={v}/> */}
                {/*         </Collapse> */}
                {/*     ) */}
                {/* } */}
                {/* </TransitionGroup> */}

                {
                    blogs.map((v) =>
                        <BlogItem key={v.id} userInfo={userInfo} blog={v} deleteBlogById={deleteBlogById}/>
                    )
                }
                { (blogs.length >= 3) &&
                    <ListItem role="listitem" className="w-full" sx={{padding: 0}}>
                        <div ref={refLoader} className="flex justify-center m-auto"><CircularProgress /></div>
                    </ListItem>
                }
            </List>
        </div>
    </>
}

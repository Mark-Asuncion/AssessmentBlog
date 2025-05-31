import { CircularProgress, List, ListItem } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import type { DBContext } from "../ReduxSlice/DatabaseContext";
import { type Blog, deleteBlog, getBlogs } from "../Utils/Blog";
import type { User } from "../Utils/User";
import { BlogItem } from "../Components/PostItem";
import { useInView } from "react-intersection-observer";

export function ListBlog({ userId = undefined }) {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const userInfo = useSelector(state => state["UserContext"].value) as User;
    const [ blogs, setBlogs ] = useState<Blog[]>([]);
    const [ pageOffset, setPageOffset ] = useState(0);
    // pagination
    const [ refLoader, inView, _ ] = useInView()

    useEffect(() => {
        getBlogs(dbContext, pageOffset, userId)
            .then((blogs) => setBlogs(blogs))
            .catch((e) => console.log(e));
    }, [])

    useEffect(() => {
        if (!inView) {
            return;
        }
        // console.log(pageOffset);
        getBlogs(dbContext, pageOffset+1, userId)
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

    const deleteBlogById = useCallback(async (blogId: string) => {
        try {
            await deleteBlog(dbContext, blogId);
            try {
                const blogs = await getBlogs(
                    dbContext, 0,
                    userId
                );
                setPageOffset(0);
                setBlogs(blogs);
            }
            catch (e) {
                console.log(e);
            }
        }
        catch (e) {
            console.log(e);
        }
    }, []);


    return <List className="w-[100%]" role="listbox">
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
}

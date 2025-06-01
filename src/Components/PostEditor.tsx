import { Button, Card, Divider, IconButton, TextField, Tooltip } from "@mui/material";
import { useSelector } from 'react-redux';
import { type User } from "../Utils/User";
import ImageIcon from '@mui/icons-material/Image';
import { MAvatar, RowAvatar } from "./Avatar";
import { useNavigate } from "react-router-dom";
import { BlockTypeSelect, BoldItalicUnderlineToggles, ListsToggle, markdownShortcutPlugin, MDXEditor, thematicBreakPlugin, UndoRedo, type MDXEditorMethods } from '@mdxeditor/editor'
import { headingsPlugin, listsPlugin, quotePlugin, toolbarPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRef, useCallback, useState, useEffect } from "react";
import { ImageGrid } from "./ImageGrid";
import { createBlog, updateBlog, type Blog } from "../Utils/Blog";
import { ErrText } from "./PasswordField";
import type { DBContext } from "../ReduxSlice/DatabaseContext";

import "@mdxeditor/editor/style.css";
import "../Assets/MDXDark.css";

export function PostEditor({ blog = undefined, userInfo }: { blog?: Blog, userInfo: User}) {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;

    const [ images, setImages ] = useState<string[]>((blog)? blog.images:[]);
    const refEditor = useRef<MDXEditorMethods | null>(null);
    const refFileInput = useRef(null);
    const refTitle = useRef(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ err, setErr ] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (blog)
            refTitle.current.value = blog.title;
    }, [refTitle.current])

    const onAttachClick = useCallback((e: any) => {
        e.preventDefault();
        e.stopPropagation();
        refFileInput.current?.click();
    }, []);

    const onPost = useCallback(async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);

        const title = refTitle.current.value;
        const content = refEditor.current.getMarkdown();
        if (content.length == 0 || title.length == 0) {
            setErr("Content or Title cannot be empty");
            setIsLoading(false);
            return;
        }
        try {
            if (!blog) {
                await createBlog(
                    dbContext,
                    userInfo,
                    {
                        updated_at: new Date(Date.now()),
                        title: title,
                        content: content,
                        images: images
                    }
                );
            }
            else {
                await updateBlog(
                    dbContext,
                    {
                        id: blog.id,
                        updated_at: new Date(Date.now()),
                        title: title,
                        content: content,
                        images: images
                    }
                );
            }
        }
        catch(e) {
            console.log(e);
            setErr("Something went wrong. Please try again.");
            setIsLoading(false);
            return;
        }
        setErr("");
        setIsLoading(false);
        navigate("/");
    }, [refEditor, images]);

    const onFileChange = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((v) => {
                    return [
                        ...v,
                        reader.result as string
                    ];
                });
            };
            reader.readAsDataURL(file); // base64 encoding for preview
        }
    }, []);

    return <Card variant="elevation" className="m-auto py-2 px-4 rounded-lg md:w-[60%]">
        <div className="flex flex-col gap-2">
            {(err.length !== 0) && <ErrText value={err} />}
            <TextField inputRef={refTitle} variant="outlined" label="Title" size="small"/>
            <Divider />
            <div>
            <MDXEditor
                className="dark-theme dark-editor"
                markdown={ (blog)? blog.content:""}
                contentEditableClassName="prose dark:prose-invert"
                ref={refEditor}
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    toolbarPlugin({
                        toolbarClassName: 'my-classname',
                        toolbarContents: () => (
                            <>
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                                <BlockTypeSelect />
                                <ListsToggle />
                            </>
                        )
                    })
                ]}
            />
            </div>
            { (images.length > 0) && <ImageGrid images={images} setImages={setImages} edit={true}/> }
            <div className="flex">
                <Tooltip title="Attach an image">
                    <div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={refFileInput}
                        onChange={onFileChange}
                        style={{ display: "none" }}
                    />
                    <IconButton onClick={onAttachClick}><ImageIcon /></IconButton>
                    </div>
                </Tooltip>
                <div className="ml-auto">
                    <Button onClick={onPost} variant="contained" loading={isLoading}>Post</Button>
                </div>
            </div>
        </div>
    </Card>
}

export function OpenPostEditor({ fullInfo = false }) {
    const userInfo = useSelector(state => state["UserContext"].value) as User;
    const navigate = useNavigate();

    if (userInfo == null) {
        return <></>
    }

    return <Card variant="elevation" className="py-2 px-4 rounded-lg hover:brightness-[1.25]" onClick={() => {
        navigate("/post");
    }}>
        <div className="flex gap-2 items-center">
            {
                (!fullInfo)?
                <MAvatar user={userInfo}/>:
                <RowAvatar userInfo={userInfo} subtitle={userInfo.email} />
            }
            <Card variant="elevation" elevation={5} className="flex-grow self-center p-3" sx={{ borderRadius: 999, boxShadow: "none" }}>
                <p>Create a post</p>
            </Card>
        </div>
    </Card>
}


export function MDXNonEditable({ content }) {
    return <MDXEditor
        className="dark-theme rounded-md"
        markdown={content}
        contentEditableClassName="prose dark:prose-invert"
        readOnly
        plugins={[
            headingsPlugin(),
            listsPlugin(),
            thematicBreakPlugin(),
            quotePlugin(),
            markdownShortcutPlugin()
        ]}
    />
}

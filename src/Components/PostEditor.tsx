import { Button, Card, Divider, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { useSelector } from 'react-redux';
import { type User } from "../ReduxSlice/UserContext";
import ImageIcon from '@mui/icons-material/Image';
import { MAvatar } from "./Avatar";
import { useNavigate } from "react-router-dom";

export function PostEditor() {
    const userInfo = useSelector(state => state["UserContext"].value) as User;

    if (userInfo == null) {
        return <></>
    }
    return <Card variant="elevation" className="py-2 px-4 rounded-lg">
        <div className="flex flex-col gap-2">
            <Typography variant="h5" component="div" className="mb-2">Create a post</Typography>
            <TextField variant="outlined" label="Title" size="small"/>
            <Divider />
            <TextField minRows={1} maxRows={7} variant="outlined" multiline size="small"/>
            <div className="flex">
                <Tooltip title="Attach an image">
                    <IconButton><ImageIcon /></IconButton>
                </Tooltip>
                <div className="ml-auto">
                    <Button variant="contained">Post</Button>
                </div>
            </div>
        </div>
    </Card>
}

export function OpenPostEditor() {
    const userInfo = useSelector(state => state["UserContext"].value) as User;
    const navigate = useNavigate();

    if (userInfo == null) {
        return <></>
    }

    return <Card variant="elevation" className="py-2 px-4 rounded-lg hover:brightness-[1.25]" onClick={() => {
        navigate("/post");
    }}>
        <div className="flex gap-2 items-center">
            {/* <Typography variant="h5" component="div" className="mb-2">Create a post</Typography> */}
            <MAvatar user={userInfo}/>
            <Card variant="elevation" elevation={5} className="flex-grow self-center p-3" sx={{ borderRadius: 999, boxShadow: "none" }}>
                <p>Create a post</p>
            </Card>
        </div>
    </Card>
}


import { AppBar, Avatar, Button, Card, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { type DBContext } from '../ReduxSlice/DatabaseContext';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { signOut } from "../Utils/SignOut";
import { type User } from "../ReduxSlice/UserContext";

function MAvatar({ user }) {
    const code = user.username.charCodeAt(0);
    const colors = ["#757575", "#3949ab", "#00897b" ,"#e53935", "#d81b60", "#8e24aa"];
    return <Avatar sx={{
        backgroundColor: colors[code%colors.length]
    }}>{user.username[0]}</Avatar>
}

export function Home() {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector(state => state["UserContext"].value) as User;
    const theme = useTheme();
    const isBreakpointMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return <>
        <AppBar position="static" className="mb-3">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Blogs
                </Typography>
                { ( userInfo )? <div className="ml-auto">
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={handleMenuClick}
                    >
                        <MAvatar user={userInfo}/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            signOut(navigate, dbContext, dispatch);
                        }}>Logout</MenuItem>
                    </Menu>
                </div>: <div className="ml-auto flex gap-1">
                        <Button variant="contained" onClick={() => navigate("/login")} size="small">Log in</Button>
                        <Button variant="outlined" onClick={() => navigate("/register") } size="small">Register</Button>
                    </div>
                }
            </Toolbar>
        </AppBar>
        <div className={`p-4 gap-2 flex flex-col justify-center m-auto${(isBreakpointMdUp)? " w-[60%]":""}`}>
            <PostEditor />
            <Divider />
            <PostItem />
        </div>
    </>
}

import ImageIcon from '@mui/icons-material/Image';
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
function PostEditor() {
    const userInfo = useSelector(state => state["UserContext"].value) as User;

    if (userInfo == null) {
        return <></>
    }
    return <Card variant="elevation" className="py-2 px-4 rounded-lg">
        <div className="flex flex-col gap-2">
            <Typography variant="h5" component="div" className="mb-2">Create a post</Typography>
            {/* <div className="flex items-center gap-2 mb-2"> */}
            {/*     <MAvatar user={userInfo}/> */}
            {/*     <Typography variant="h6" component="div">{userInfo.username}</Typography> */}
            {/* </div> */}
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

function PostItem() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return <Card variant="elevation" className="py-2 px-4 rounded-lg">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
                <MAvatar user={{ id: "sdaskjd", email: "asdas", username: "sakdjask" }}/>
                <div className="flex flex-col">
                    <p className="text-lg">M</p>
                    <p className="text-sm">{new Date(Date.now()).toUTCString()}</p>
                </div>
                <div className="ml-auto">
                    <IconButton onClick={handleMenuClick}><MoreHorizOutlined /></IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                                <EditIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            <Typography variant="h6" component="div">Title</Typography>
            <Divider />
            <p>lorem ipsumasdksajdlaj</p>
            {/* <img></img> */}
        </div>
    </Card>

}

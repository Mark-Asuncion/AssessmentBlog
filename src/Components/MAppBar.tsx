import { AppBar, Button, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { type DBContext } from '../ReduxSlice/DatabaseContext';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { signOut } from "../Utils/SignOut";
import { type User } from "../Utils/User";
import { MAvatar } from "../Components/Avatar";
import { HomeOutlined } from "@mui/icons-material";

export function MAppBar({ title }) {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector(state => state["UserContext"].value) as User;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return <AppBar position="static" className="mb-3">
        <Toolbar>
            <IconButton onClick={() => navigate("/")}><HomeOutlined /></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate("/")}>
                {title}
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
                    <MenuItem onClick={() => {
                        handleMenuClose();
                        navigate(`/user/${userInfo.username}`)
                    }}>{userInfo.username}</MenuItem>
                    <MenuItem onClick={() => {
                        handleMenuClose();
                        navigate("/post");
                    }}>Create a blog</MenuItem>
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
}

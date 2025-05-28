import { AppBar, Button, IconButton, Toolbar } from "@mui/material";
import { type DBContext } from '../ReduxSlice/DatabaseContext';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../Utils/AutoLogin";
import { useEffect } from "react";
import { signOut } from "../Utils/SignOut";
import { AccountCircle } from "@mui/icons-material";

export function Home() {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector(state => state["UserContext"].value);

    // useEffect(() => {
    //     console.log(userInfo);
    //     isLoggedIn(dbContext)
    //         .then((v) => {
    //             if (!v) {
    //                 navigate("/");
    //             }
    //         });
    // });

    return <>
        <AppBar position="static">
            <Toolbar>
                { ( userInfo )? <div className="ml-auto">
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                </div>: <div className="ml-auto">
                        <Button variant="contained" onClick={() => navigate("/login")} size="small">Log in</Button>
                        <Button variant="text" onClick={() => navigate("/register")} size="small">Register</Button>
                </div>
                }
            </Toolbar>
        </AppBar>
        <Button
            onClick={() => signOut(navigate, dbContext, dispatch)}>
            Log out
        </Button>
    </>
}

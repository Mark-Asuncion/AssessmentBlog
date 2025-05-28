import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toUser, type DBContext } from '../ReduxSlice/DatabaseContext';
import { Button, Grid, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ErrText, PasswordField } from '../Components/PasswordField';
import { set } from '../ReduxSlice/UserContext';
import { autoLogin } from '../Utils/AutoLogin';


export function Index() {
    const navigate = useNavigate();
    const refEmail = useRef(null);
    const refPass = useRef(null);
    const theme = useTheme();
    const isBreakpointMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorText, setErrorText ] = useState("");

    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log(dbContext !== null);
        autoLogin(
            navigate,
            dbContext,
            dispatch
        );
    }, []);

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const email = refEmail.current.value;
        const password = refPass.current.value;
        if (email.length == 0 || password.length == 0) {
            setErrorText("Field Cannot be empty");
            setIsLoading(false);
            return;
        }

        try {
            const authToken = await dbContext.auth.signInWithPassword({
                email: refEmail.current.value,
                password: refPass.current.value
            });
            if (authToken.error) {
                setIsLoading(false);
                setErrorText(authToken.error.message);
                return;
            }
            if (authToken.data.user == null) {
                setIsLoading(false);
                setErrorText("Email or Password is wrong");
                return;
            }
            dispatch(set(toUser(authToken.data.session)));
            navigate("/home");
        }
        catch (e) {
            console.log(e);
            setIsLoading(false);
            setErrorText("Email or Password is wrong");
        }

    }, []);

    return <div className="h-[100%] flex flex-col">
        <Grid container size="grow">
            <Grid size={(isBreakpointMdUp)? 8:12}>
                <div className="flex flex-col items-center h-[100%] gap-4 justify-center items-center p-2">
                    <div className="mb-6">
                        <Typography variant="h4" className="text-center"> Login to your Account </Typography>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-100">
                        {(errorText.length !== 0) && <ErrText value={errorText} />}
                        <TextField tabIndex={0} inputRef={refEmail} id="outlined-basic" label="Email" variant="outlined" type="email" />
                        <PasswordField tabIndex={1} ref={refPass} label="Password" />
                        <Button variant="contained" type="submit" loading={isLoading}>Sign in</Button>
                        <p>No account? <span style={{ color: theme.palette.primary.main }}
                            onClick={() => navigate("/register") }>Register</span></p>
                    </form>
                </div>
            </Grid>
            { isBreakpointMdUp &&
            <Grid size={4}>
                <img src="https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg" title="blog"
                    style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover"
                    }}
                />
            </Grid>
            }
        </Grid>
    </div>
}

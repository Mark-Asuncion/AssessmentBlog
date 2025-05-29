import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toUser, type DBContext } from '../ReduxSlice/DatabaseContext';
import { Button, Divider, Grid, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ErrText, PasswordField } from '../Components/PasswordField';
import { set } from '../ReduxSlice/UserContext';
import { autoLogin } from '../Utils/AutoLogin';

type Fields = {
    email: string,
    username: string,
    password: string,
    confirmPassword: string
};

function validate(setErrorText: (Err: string) => void, fields: Fields): boolean {
    if (fields.email.length == 0 || fields.password.length == 0
        || fields.confirmPassword.length == 0 || fields.username.length == 0) {
        setErrorText("Field/s cannot be empty")
        return true;
    }

    if (fields.password !== fields.confirmPassword) {
        setErrorText("Password does not match");
        return true;
    }
    return false;
}

export function Register() {
    const navigate = useNavigate();
    const refEmail = useRef(null);
    const refUsername = useRef(null);
    const refPass = useRef(null);
    const refPassConfirm = useRef(null);
    const theme = useTheme();
    const isBreakpointMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorText, setErrorText ] = useState("");

    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log(dbContext !== null);
        autoLogin(
            dbContext,
            dispatch,
            navigate
        );
    }, []);

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const fields = {
            email: refEmail.current.value,
            username: refUsername.current.value,
            password: refPass.current.value,
            confirmPassword: refPassConfirm.current.value
        };
        if (validate(setErrorText, fields)) {
            setIsLoading(false);
            return;
        }

        try {
            // check if username already exists
            const username = await dbContext.from("Profiles")
                .select("username")
                .eq("username", fields.username);

            console.log(username);

            if (username.data.length > 0) {
                setIsLoading(false);
                setErrorText("Username already exists");
                return;
            }

            const resp = await dbContext.auth.signUp({
                email: fields.email,
                password: fields.password,
                options: {
                    data: {
                        username: fields.username
                    }
                }
            });
            console.log(resp);
            if (resp.error) {
                console.log(resp.error)
                setIsLoading(false);
                setErrorText(resp.error.message);
                return;
            }
            if (resp.data.user == null) {
                setIsLoading(false);
                setErrorText("Unknown error occured");
                return;
            }
            dispatch(set(toUser(resp.data.session)));
            navigate("/home");
        }
        catch (e) {
            console.log(e);
            setIsLoading(false);
            setErrorText(e);
        }

    }, []);

    return <div className="h-[100%] flex flex-col">
        <Grid container size="grow">
            <Grid size={(isBreakpointMdUp)? 8:12}>
                <div className="flex flex-col items-center h-[100%] gap-4 justify-center items-center">
                    <div className="mb-6">
                        <Typography variant="h4" className="text-center"> Create an Account </Typography>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-100 p-4">
                        {(errorText.length !== 0) && <ErrText value={errorText} />}
                        <TextField inputRef={refEmail} tabIndex={0} id="outlined-basic" label="Email" variant="outlined" type="email" autoComplete="email"/>
                        <TextField inputRef={refUsername} tabIndex={1} id="outlined-basic" label="Username" variant="outlined" />
                        <Divider />
                        <PasswordField ref={refPass} label="Password" tabIndex={2} />
                        <PasswordField ref={refPassConfirm} label="Confirm Password" tabIndex={3} />
                        <Button variant="contained" type="submit" loading={isLoading}>Sign up</Button>
                        <p>Already have an account? <span style={{ color: theme.palette.primary.main }}
                            onClick={() => navigate("/login") }>Login</span></p>
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

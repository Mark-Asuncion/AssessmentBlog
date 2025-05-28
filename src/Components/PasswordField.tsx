import { IconButton, InputAdornment, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function PasswordField({ label, ref, onChange=()=>{}, error=false, helperText="" }) {
    const [showPass, setShowPass] = useState(false);
    return <>
        <TextField inputRef={ref} onChange={onChange} id="outlined-basic" label={label} variant="outlined"
            type={(showPass) ? "text" : "password"}
            error={error}
            helperText={helperText}
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label={
                                (showPass) ? 'hide the password' : 'display the password'
                            }
                            onClick={() => setShowPass(i => !i)}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseUp={(e) => e.preventDefault()}
                            edge="end"
                        >
                            {(showPass) ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            }}
        />
    </>
}

export function ErrText({ value }) {
    const theme = useTheme();
    return <span className="text-sm text-center"
        style={{
            color: theme.palette.error.main
        }}
    >{value}</span>
}

import { Avatar } from "@mui/material";

export function MAvatar({ user }) {
    const code = user.username.charCodeAt(0);
    const colors = ["#757575", "#3949ab", "#00897b" ,"#e53935", "#d81b60", "#8e24aa"];
    return <Avatar sx={{
        backgroundColor: colors[code%colors.length]
    }}>{user.username[0]}</Avatar>
}

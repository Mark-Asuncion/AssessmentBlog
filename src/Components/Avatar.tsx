import { Avatar } from "@mui/material";
import type { User } from "../ReduxSlice/UserContext";

export function MAvatar({ user }) {
    const code = user.username.charCodeAt(0);
    const colors = ["#757575", "#3949ab", "#00897b" ,"#e53935", "#d81b60", "#8e24aa"];
    return <Avatar sx={{
        backgroundColor: colors[code%colors.length]
    }}>{user.username[0]}</Avatar>
}

export function RowAvatar({ subtitle, userInfo }) {
    return <div className="flex gap-2 items-center">
        <MAvatar user={userInfo as User}/>
        <div className="flex flex-col">
            <p className="text-lg">{userInfo.username}</p>
            <p className="text-sm">{subtitle}</p>
        </div>
    </div>
}

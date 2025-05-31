import { Avatar, IconButton } from "@mui/material";
import type { User } from "../Utils/User";
import { useNavigate } from "react-router-dom";

export function MAvatar({ user }) {
    const code = user.username.charCodeAt(0);
    const colors = ["#757575", "#3949ab", "#00897b" ,"#e53935", "#d81b60", "#8e24aa"];
    return <Avatar sx={{
        backgroundColor: colors[code%colors.length]
    }}>{user.username[0]}</Avatar>
}

export function RowAvatar({ subtitle, userInfo }: { subtitle: string, userInfo: User }) {
    const navigate = useNavigate();

    return <div className="flex gap-2 items-center" onClick={() => navigate(`/user/${userInfo.username}`)}>
        <IconButton
            size="large">
            <MAvatar user={userInfo as User}/>
        </IconButton>
        <div className="flex flex-col">
            <p className="text-lg">{userInfo.username}</p>
            <p className="text-sm">{subtitle}</p>
        </div>
    </div>
}

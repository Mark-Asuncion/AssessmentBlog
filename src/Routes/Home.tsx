import { Card, Collapse, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { OpenPostEditor } from "../Components/PostEditor";
import { MAvatar } from "../Components/Avatar";
import { MAppBar } from "../Components/MAppBar";

export function Home() {
    // const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const userInfo = useSelector(state => state["UserContext"].value) as User;
    const theme = useTheme();
    const isBreakpointMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [arr, setArr] = useState(new Array(20).fill(null));
    useEffect(() => {
        setArr((v) => {
            return v.map(() => crypto.randomUUID());
        });
    }, [])

    return <>
        <MAppBar title="Blogs" />
        <div className={`p-2 gap-2 flex flex-col justify-center m-auto ${(isBreakpointMdUp)? "w-[60%]":""}`}>
            <OpenPostEditor />
            <Divider />
            <List className="w-[100%]" role="listbox">
                <TransitionGroup>
                {
                    arr.map((v) =>
                        <Collapse key={v}>
                            <div onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setArr((ar) => {
                                        return ar.filter((k) => {
                                            return k !== v;
                                        });
                                    });
                                }}>
                            <ListItem
                                    role="listitem" className="mb-2" sx={{padding: 0}}>
                                <PostItem />
                            </ListItem>
                            </div>
                        </Collapse>
                    )
                }
                </TransitionGroup>
            </List>
        </div>
    </>
}

function PostItem() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return <Card variant="elevation" className="py-2 px-4 rounded-lg w-[100%]">
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

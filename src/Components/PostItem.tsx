import { Button, Card, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Modal, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { RowAvatar } from "../Components/Avatar";
import type { User } from "../Utils/User";
import type { Blog } from "../Utils/Blog";
import { ImageGrid } from "./ImageGrid";
import { MDXNonEditable } from "./PostEditor";
import { CloseSharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function BlogItem({ blog, userInfo, deleteBlogById }: { blog: Blog, userInfo: User, deleteBlogById: (id: string) => void }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const [ openDelModal, setOpenDelModal ] = useState(false);

    let date = "";
    const today = new Date(Date.now());
    if (blog.updated_at.getMonth() == today.getMonth()) {
        if (blog.updated_at.getDay() == today.getDay()) {
            date = "Today";
        }
        else {
            const diff = today.getDay() - blog.updated_at.getDay();
            if (diff == 1) {
                date = "Yesterday";
            }
            else {
                date = blog.updated_at.toDateString();
            }
        }
    }
    else {
        date = blog.updated_at.toDateString();
    }

    const canEdit = userInfo != null && blog.user_id == userInfo.id;

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    // console.log(blog.images);
    return <ListItem role="listitem" className="mb-2" sx={{padding: 0}}>
        <Card variant="elevation" className="py-3 px-4 rounded-lg w-[100%]">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                    <RowAvatar userInfo={blog.Profiles! as User} subtitle={date}/>
                    { canEdit && <div className="ml-auto">
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
                            <MenuItem onClick={() => {
                                handleMenuClose();
                                navigate(`/edit/${blog.id}`);
                            }}>
                                <ListItemIcon>
                                    <EditIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Edit</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleMenuClose();
                                setOpenDelModal(true);
                            }}>
                                <ListItemIcon>
                                    <DeleteIcon fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                    }
                </div>
                <Typography variant="h6" component="div">{blog.title}</Typography>
                <Divider />
                <MDXNonEditable content={blog.content} />
                { blog.images.length > 0 && <ImageGrid images={blog.images}/>}
            </div>
        </Card>
        <Modal
            open={openDelModal}
            onClose={() => setOpenDelModal(false)}
            className="p-2 m-auto md:w-[60%]"
        >
            <div className="flex flex-col items-center justify-center h-full" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenDelModal(false);
            }}>
            <Card className="p-2">
                <div className="flex">
                    <div className="ml-auto"></div>
                    <IconButton><CloseSharp /></IconButton>
                </div>
                <Divider />
                <p className="text-error my-3 p-3">Are you sure you want to delete?</p>
                <div className="flex w-full gap-1">
                        <Button variant="outlined" className="w-full">No</Button>
                        <Button variant="contained" color="error" className="w-full"
                            onClick={() => {
                                deleteBlogById(blog.id);
                            }}>Delete</Button>
                </div>
            </Card>
            </div>
        </Modal>
    </ListItem>
}

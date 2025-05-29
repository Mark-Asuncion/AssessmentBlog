import { ArrowBackIosSharp, ArrowForwardIosSharp, Close } from "@mui/icons-material";
import { Card, IconButton, ImageList, ImageListItem, Modal, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

export function ImageGrid({ images, setImages = undefined, edit = false }) {
    const [ openImgId, setOpenImgId ] = useState(-1);
    const theme = useTheme();
    const isBreakpointMdUp = useMediaQuery(theme.breakpoints.up("md"));

    // const byPair = [];

    return <div>
        <ImageList cols={2} className={`rounded-lg ${(edit)? "h-[300px]":"h-full"}`}>
            {images.map((item: string, i) => (
                <ImageListItem key={`${item}-${crypto.randomUUID()}`}>
                    { edit && <IconButton onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImages((imgs: string[]) => {
                            const newImgs = imgs.filter((v) => v !== item)
                            return [ ...newImgs ];
                        });
                    }}
                        className="!absolute top-2 right-2"
                    ><Close /></IconButton>
                    }
                    <img
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenImgId(i);
                        }}
                        className="h-full w-full object-cover"
                        src={item}
                        alt={`image ${i}`}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
        <Modal
            open={openImgId != -1}
            onClose={() => setOpenImgId(-1)}
            className={`p-2 m-auto ${(isBreakpointMdUp)? "w-[60%]":""}`}
        >
            <Card className="py-2">
                <div className="flex justify-end px-2">
                    <IconButton onClick={() => setOpenImgId(-1)}><Close /></IconButton>
                </div>
                <div className="bg-black">
                <img
                    className="m-auto"
                    src={images[openImgId]}
                    alt={`image ${openImgId}`}
                    loading="lazy"
                />
                </div>
                <div className="flex justify-center mt-2">
                    <IconButton onClick={() => setOpenImgId(openImgId-1)} disabled={openImgId-1 < 0}><ArrowBackIosSharp /></IconButton>
                    <IconButton onClick={() => setOpenImgId(openImgId+1)} disabled={openImgId+1 >= images.length}><ArrowForwardIosSharp /></IconButton>
                </div>
            </Card>
        </Modal>
    </div>
}

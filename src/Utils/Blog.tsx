import type { DBContext } from "../ReduxSlice/DatabaseContext";
import type { User } from "../ReduxSlice/UserContext";
import { Buffer } from 'buffer';

export type CreateBlog = {
    updated_at: Date,
    title: string,
    content: string,
    images: string[]
};

export async function createBlog(
    dbContext: DBContext,
    user: User,
    blog: CreateBlog
) {
    const imgsNames = blog.images.map((im) => {
        return `${btoa(im).substring(0,10)}`;
    });

    // console.log(await dbContext.auth.getSession());
    // console.log(blog.images);
    imgsNames.map(async (fname, i) => {
        const dataUrl = blog.images[i];
        const spl = dataUrl.split(",")
        const contentType = spl[0].split(":")[1].split(";")[0];
        const data = Buffer.from(spl[1], "base64");

        const res = await dbContext.storage.from("media")
            .upload(`public/${fname}`, data, {
                contentType: contentType,
                upsert: true
            });

        if (res.error) {
            throw res.error;
        }
    });

    const res = await dbContext.from("Blogs")
        .insert({
            updated_at: blog.updated_at,
            title: blog.title,
            content: blog.content,
            images: imgsNames,
            user_id: user.id
        });

    if (res.error) {
        throw res.error;
    }
}

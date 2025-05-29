import type { DBContext } from "../ReduxSlice/DatabaseContext";
import type { User } from "../ReduxSlice/UserContext";
import { Buffer } from 'buffer';

export type CreateBlog = {
    updated_at: Date,
    title: string,
    content: string,
    images: string[] // data url of image
};

// images here is the name of the file in the public/bucket_name
export interface Blog extends CreateBlog {
    id: string,
    user_id: string,
    created_at: Date
};

export async function createBlog(
    dbContext: DBContext,
    user: User,
    blog: CreateBlog
) {

    // console.log(await dbContext.auth.getSession());
    // console.log(blog.images);
    const imgsNames = [];

    for (let i=0;i<blog.images.length;i++) {
        const dataUrl = blog.images[i];
        const spl = dataUrl.split(",")
        const contentType = spl[0].split(":")[1].split(";")[0];
        const data = Buffer.from(spl[1], "base64");

        const fname = data.toString("base64").substring(0,10).replace(/\//g, "-");
        imgsNames.push(fname);

        const res = await dbContext.storage.from("media")
        .upload(`public/${fname}`, data, {
            contentType: contentType,
            upsert: true
        });

        if (res.error) {
            throw res.error;
        }
    }

    await dbContext.from("Blogs")
        .insert({
            updated_at: blog.updated_at,
            title: blog.title,
            content: blog.content,
            images: imgsNames,
            user_id: user.id
        }).throwOnError();
}

export async function getBlogs(
    dbContext: DBContext,
    offset: number = 0
) {
    const pageOffset = 5;
    const ofs = offset*pageOffset;
    const res = await dbContext.from("Blogs")
        .select("*")
        .order("updated_at", { ascending: false })
        .range(0+ofs, pageOffset+ofs).throwOnError();
    console.log(res.data);
}

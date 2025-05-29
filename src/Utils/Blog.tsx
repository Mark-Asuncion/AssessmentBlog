import type { DBContext } from "../ReduxSlice/DatabaseContext";
import type { User } from "../ReduxSlice/UserContext";
import { Buffer } from 'buffer';
import { createHash } from "crypto";

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
    created_at: Date,
    Profiles: User
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

        const fname = createHash('sha256').update(data).digest('hex');
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
    const contentHashed = Buffer.from(blog.content).toString("base64");

    await dbContext.from("Blogs")
        .insert({
            updated_at: blog.updated_at,
            title: blog.title,
            content: contentHashed,
            images: imgsNames,
            user_id: user.id
        }).throwOnError();
}

export async function getBlogs(
    dbContext: DBContext,
    offset: number = 0
): Promise<Blog[]> {
    const pageOffset = 3;
    const offs = offset*pageOffset;
    const res = await dbContext.from("Blogs")
        .select("*, Profiles( * )")
        .order("updated_at", { ascending: false })
        .range(offs, offs+(pageOffset-1)).throwOnError();

    const data = res.data as Blog[];
    const blogs = data.map((blog) => ({
        ...blog,
        updated_at: new Date(blog.updated_at),
        created_at: new Date(blog.created_at)
    }));

    for (let i=0;i<blogs.length;i++) {
        const imagesLink = [];
        for (let j=0;j<blogs[i].images.length;j++) {
            const image = blogs[i].images[j];
            const res = dbContext.storage.from("media")
                .getPublicUrl(`public/${image}`);
            if (res.data.publicUrl.length > 0)
                imagesLink.push(res.data.publicUrl);
        }
        blogs[i].content = Buffer.from(blogs[i].content, "base64").toString("utf-8");
        blogs[i].images = imagesLink;
    }
    // console.log(blogs);
    return blogs;
}

export async function deleteBlog(
    dbContext: DBContext,
    blogId: string
) {
    await dbContext.from("Blogs")
        .delete()
        .eq('id', blogId).throwOnError();
}

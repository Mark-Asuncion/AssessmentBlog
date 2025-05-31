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

export interface UpdateBlog extends CreateBlog {
    id: string
}

// images here is the name of the file in the public/bucket_name
export interface Blog extends CreateBlog {
    id: string,
    user_id: string,
    created_at: Date,
    Profiles?: User
};

type CachedLink = {
    link: string,
    created_at: number
};

function getPublicUrl(dbContext: DBContext, name: string): string | null {
    let cached = JSON.parse(window.sessionStorage.getItem(name)) as CachedLink;
    if (cached == null) {
        const res = dbContext.storage.from("media")
        .getPublicUrl(`public/${name}`);

        if (res.data.publicUrl.length > 0) {
            cached = {
                link: res.data.publicUrl,
                created_at: Date.now()
            };
        }
        else {
            return null;
        }

        console.log("returned new link");
        window.sessionStorage.setItem(name, JSON.stringify(cached));
    }
    else {
        const cachedDate = new Date(cached.created_at);
        const now = new Date(Date.now());
        //@ts-ignore
        const timePassed = new Date(now - cachedDate);
        if (timePassed.getMinutes() >= 10) {
            window.sessionStorage.removeItem(name);
            return getPublicUrl(dbContext, name);
        }

        console.log("returned cached link");
    }
    return cached.link;
}

function fromRawBlogtoBlog(dbContext: DBContext, blog: Blog): Blog {
    const links = [];
    // cache url with sessionStorage
    for (let i=0;i<blog.images.length;i++) {
        const image = blog.images[i];
        const link = getPublicUrl(dbContext, image);
        if (link) {
            links.push(link);
        }
    }
    blog.content = Buffer.from(blog.content, "base64").toString("utf-8");
    blog.images = links;
    blog.updated_at = new Date(blog.updated_at);
    blog.created_at = new Date(blog.created_at);
    return blog;
}

function parseDataUrl(dataUrl: string): { contentType: string, data: Buffer } {
    const spl = dataUrl.split(",")
    const contentType = spl[0].split(":")[1].split(";")[0];
    const data = Buffer.from(spl[1], "base64");

    return {
        contentType: contentType,
        data: data
    };
}

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
        const { contentType , data } = parseDataUrl(dataUrl);

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
    offset: number = 0,
    userId?: string
): Promise<Blog[]> {
    const pageOffset = 3;
    const offs = offset*pageOffset;
    const query = dbContext.from("Blogs")
        .select("*, Profiles( * )")
        .order("updated_at", { ascending: false })
        .range(offs, offs+(pageOffset-1))
    if (userId) {
        query.eq("user_id", userId);
    }
    const res = await query.throwOnError();

    if (res.data.length == 0) {
        return [];
    }

    const data = res.data as Blog[];
    const blogs = data.map((blog) => fromRawBlogtoBlog(dbContext, blog));
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

export async function getBlog(
    dbContext: DBContext,
    blogId: string
): Promise<Blog> {
    const res = await dbContext.from("Blogs")
        .select("*")
        .eq("id", blogId).throwOnError();

    if (res.data.length != 1) {
        throw "not found";
    }

    const blog = fromRawBlogtoBlog(dbContext, res.data[0]);
    return blog;
}

// .images is either public urls or base64
export async function updateBlog(dbContext: DBContext, updated: UpdateBlog) {
    dbContext;
    updated;
    const res = await dbContext.from("Blogs")
        .select("images")
        .eq("id", updated.id).throwOnError();

    if (res.data.length != 1) {
        throw "not found";
    }

    const newImages = [];
    for (let i=0;i<updated.images.length;i++) {
        const img = updated.images[i];
        const match = img.match(/public\/media\/public\/([^\?\/]+)/);
        if (match != null) {
            newImages.push(match[1]);
        }
        else {
            try {
                const { contentType, data } = parseDataUrl(img);
                const fname = createHash('sha256').update(data).digest('hex');
                const res = await dbContext.storage.from("media")
                    .upload(`public/${fname}`, data, {
                        contentType: contentType,
                        upsert: true
                    });

                if (res.error) {
                    throw res.error;
                }

                newImages.push(fname);
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    // console.log(updated);
    const newUpdated: CreateBlog = {
        title: updated.title,
        content: Buffer.from(updated.content).toString("base64"),
        updated_at: updated.updated_at,
        images: newImages
    };

    await dbContext.from("Blogs")
        .update(newUpdated)
        .eq("id", updated.id).throwOnError();
}

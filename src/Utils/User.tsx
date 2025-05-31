import type { DBContext } from "../ReduxSlice/DatabaseContext";

export type User = {
    email: string,
    id: string,
    username: string
};

export async function getUserByUsername(dbContext: DBContext, username: string): Promise<User> {
    const res = await dbContext.from("Profiles")
        .select("*")
        .eq("username", username).throwOnError();

    if (res.data.length != 1) {
        throw "User not found";
    }

    return res.data[0] as User;
}

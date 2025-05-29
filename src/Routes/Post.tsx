import { MAppBar } from "../Components/MAppBar";
import { PostEditor } from "../Components/PostEditor";

export function Post() {
    return <>
        <MAppBar title="Create a post" />
        <div className="p-2">
            <PostEditor />
        </div>
    </>
}

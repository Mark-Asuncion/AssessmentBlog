import { Button } from "@mui/material";
import { type DBContext } from '../ReduxSlice/DatabaseContext';
import { useSelector, useDispatch } from 'react-redux';
import { set } from '../ReduxSlice/UserContext';

export function Home() {
    const dbContext = (useSelector(state => state["DatabaseContext"].value)) as DBContext;
    const dispatch = useDispatch();

    return <>
        <h1> hello </h1>
        <Button onClick={() => {
            dbContext.auth.signOut()
                .then((v) => {
                    if (v.error) {
                        throw v.error;
                    }
                    dispatch(set(null))
                })
                .catch((e) => {
                    console.log(e);
                });
        }}>Log out</Button>
    </>
}

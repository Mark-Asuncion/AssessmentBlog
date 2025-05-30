import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from './Routes/Index';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { Register } from "./Routes/Register";
import { Home } from "./Routes/Home";
import { Post } from "./Routes/Post";
import { Edit } from "./Routes/Edit";
import { MyPost } from "./Routes/User";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
    return <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/login" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/post" element={<Post />} />
                <Route path="/edit/:id" element={<Edit />} />
                <Route path="/user/:username" element={<MyPost />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
}

export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from './Routes/Index';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { Register } from "./Routes/Register";
import { Home } from "./Routes/Home";
import { Post } from "./Routes/Post";

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
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
}

export default App

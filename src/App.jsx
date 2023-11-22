import React from "react";
import { Route, Routes } from "react-router-dom";
import Info from "./pages/Info";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Leaderboard/>} />
                <Route path="login" element={<Login/>} />
                <Route path="/info" element={<Info/>} />
            </Routes>
        </>
    )
}

export default App;

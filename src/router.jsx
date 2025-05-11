// src/router.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainGrid from "./maingrid";
import TrainPage from "./trainpage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainGrid />} />
        <Route path="/train/:index" element={<TrainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

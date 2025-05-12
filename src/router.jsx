// src/router.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainGrid from "./maingrid";
import TrainPage from "./trainpage";
import RecordPage from "./recordpage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainGrid />} />
        <Route path="/train/:index" element={<TrainPage />} />
        <Route path="/record/:index" element={<RecordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// src/router.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashPage from "./splashpage.jsx";
import MainGrid from "./maingrid.jsx";
import TrainPage from "./trainpage.jsx";
import RecordPage from "./recordpage.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/grid" element={<MainGrid />} />
        <Route path="/train/:index" element={<TrainPage />} />
        <Route path="/record/:index" element={<RecordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

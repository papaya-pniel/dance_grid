// src/client/router/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashPage from "../pages/SplashPage.jsx";
import GridPattern from "../pages/GridPattern.jsx";
import MainGrid from "../pages/MainGrid.jsx";
import TrainPage from "../pages/TrainPage.jsx";
import RecordPage from "../pages/RecordPage.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/gridpattern" element={<GridPattern />} />
        <Route path="/grid" element={<MainGrid />} />
        <Route path="/train/:index" element={<TrainPage />} />
        <Route path="/record/:index" element={<RecordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

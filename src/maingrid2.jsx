// extra options
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VideoContext } from "./context/VideoContext";

export default function MainGrid() {
  const navigate = useNavigate();
  const { videos } = useContext(VideoContext);
  const [selectedSong, setSelectedSong] = useState("vibe1.mp3");
  const [gridSize, _setGridSize] = useState(() => parseInt(localStorage.getItem("gridSize")) || 2);
  const [pattern, _setPattern] = useState(() => localStorage.getItem("pattern") || "default");

  const setGridSize = (size) => {
    _setGridSize(size);
    localStorage.setItem("gridSize", size.toString());
  };

  const setPattern = (pat) => {
    _setPattern(pat);
    localStorage.setItem("pattern", pat);
  };

  const audioRef = useRef();
  const totalSlots = gridSize * gridSize;
  const paddedVideos = [...videos];
  while (paddedVideos.length < totalSlots) paddedVideos.push(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.load();
      audioRef.current.play().catch((err) => console.warn("Autoplay failed", err));
    }
  }, [selectedSong]);

  useEffect(() => {
    if (pattern === "center-focus") setGridSize(4);
  }, [pattern]);

  useEffect(() => {
    if (pattern === "center-focus" && gridSize !== 4) setPattern("default");
  }, [gridSize, pattern]);

  const handleSlotClick = (index) => {
    navigate(`/train/${index}`);
  };

  return (
    <div
      className="relative min-h-screen text-white overflow-hidden"
      style={{
        background: "linear-gradient(to top, #4466ff, #66bbff)",
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 gap-4">
        <h1 className="text-4xl font-bold text-center">Let's Boogie!</h1>
        <p className="text-gray-200 text-center">Choose a square to learn and record</p>

        {/* Grid Size */}
        <div className="flex gap-2 mb-2">
          {[2, 3, 4, 5].map((size) => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={`px-4 py-2 !rounded-none ${
                gridSize === size
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        {/* Music Dropdown */}
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="song" className="text-sm text-white">🎵 Choose Music:</label>
          <select
            id="song"
            value={selectedSong}
            onChange={(e) => setSelectedSong(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded px-3 py-1"
          >
            {[
              { label: "Rumour Has It", file: "rumour_has_it.mp3" },
              { label: "Tears Dry on Their Own", file: "tears_dry_on_their_own.mp3" },
            ].map((song) => (
              <option key={song.file} value={song.file}>
                {song.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pattern Dropdown */}
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="pattern" className="text-sm text-white">🧩 Choose Pattern:</label>
          <select
            id="pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-none"
          >
            <option value="default">Default Grid</option>
            {gridSize === 4 && <option value="center-focus">Center Focus</option>}
          </select>
        </div>

        {/* Grid */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          {pattern === "center-focus" ? (
            <div className="grid grid-cols-4 grid-rows-4 gap-0" style={{ width: "min(90vw, 90vh)", height: "min(90vw, 90vh)" }}>
              {Array.from({ length: 16 }).map((_, idx) => {
                if ([6, 9, 10].includes(idx)) return null;
                if (idx === 5) {
                  const src = paddedVideos[5];
                  return (
                    <div
                      key="center"
                      onClick={() => handleSlotClick(5)}
                      style={{ gridColumn: "2 / span 2", gridRow: "2 / span 2" }}
                      className="flex items-center justify-center bg-purple-600 cursor-pointer rounded-none overflow-hidden"
                    >
                      {src ? (
                        <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl text-white/40 font-bold">+</span>
                      )}
                    </div>
                  );
                }
                const src = paddedVideos[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleSlotClick(idx)}
                    className="flex items-center justify-center bg-white/10 cursor-pointer rounded-none overflow-hidden"
                  >
                    {src ? (
                      <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-white/40 font-bold">+</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                width: "min(90vw, 90vh)",
                height: "min(90vw, 90vh)"
              }}
            >
              {paddedVideos.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  className="flex items-center justify-center bg-white/10 cursor-pointer rounded-none overflow-hidden"
                >
                  {src ? (
                    <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-white/40 font-bold">+</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audio Player */}
        <audio ref={audioRef} autoPlay loop className="hidden">
          <source src={`/music/${selectedSong}`} type="audio/mp3" />
        </audio>
      </div>
    </div>
  );
}

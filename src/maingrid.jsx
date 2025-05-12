import React, { useContext, useCallback, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./components/ui/card";
import { VideoContext } from "./context/VideoContext";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function MainGrid() {
  const navigate = useNavigate();
  const { videos } = useContext(VideoContext);

  // Read saved settings (or fall back)
  const [gridSize, _setGridSize] = useState(() => {
  const saved = localStorage.getItem("gridSize");
    return saved ? parseInt(saved, 10) : 2;
  });

  const [pattern, _setPattern] = useState(() => {
    return localStorage.getItem("pattern") || "default";
  });

  // Wrap setters so they persist
  const setGridSize = (size) => {
    _setGridSize(size);
    localStorage.setItem("gridSize", size.toString());
  };

  const setPattern = (pat) => {
    _setPattern(pat);
    localStorage.setItem("pattern", pat);
  };


  const totalSlots = gridSize * gridSize;
  const paddedVideos = [...videos];
  while (paddedVideos.length < totalSlots) {
    paddedVideos.push(null);
  }

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const handleSlotClick = (index) => {
    navigate(`/train/${index}`);
  };
  const [selectedSong, setSelectedSong] = useState("vibe1.mp3");

  const songs = [
    { label: "Rumour Has It", file: "rumour_has_it.mp3" },
    { label: "Tears Dry on Their Own", file: "tears_dry_on_their_own.mp3" },
  ];

  const audioRef = useRef();


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.load();
      audioRef.current
        .play()
        .catch((err) => console.warn("Autoplay failed", err));
    }
  }, [selectedSong]);

  // whenever gridSize changes, if it's not 4 and you were on center-focus, reset to default
  useEffect(() => {
    if (pattern === "center-focus") {
      setGridSize(4);
    }
  }, [pattern]);

  useEffect(() => {
    if (pattern === "center-focus" && gridSize !== 4) {
      setPattern("default");
    }
  }, [gridSize, pattern]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden rounded-none">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          background: { color: { value: "#1a0f2f" } },
          particles: {
            color: { value: "#b38aff" },
            links: {
              color: "#cc99ff",
              distance: 120,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: { enable: true, speed: 1.2 },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } },
            shape: { type: "circle" },
            number: { value: 50 },
          },
          fullScreen: { enable: false },
        }}
      />

      {/* Foreground */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 gap-4">
        <h1 className="text-4xl font-bold text-center">Let's Boogie!</h1>
        <p className="text-gray-400 text-center">Choose a square to learn and record</p>

        {/* Grid size selector */}
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
          <label htmlFor="song" className="text-sm text-white">
            🎵 Choose Music:
          </label>
          <select
            id="song"
            value={selectedSong}
            onChange={(e) => setSelectedSong(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded px-3 py-1"
          >
            {songs.map((song) => (
              <option key={song.file} value={song.file}>
                {song.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pattern Selector */}
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="pattern" className="text-sm text-white">
            🧩 Choose Pattern:
          </label>
          <select
            id="pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-none"
          >
            <option value="default">Default Grid</option>
            {gridSize === 4 && (
              <option value="center-focus">Center Focus</option>
            )}
          </select>
        </div>

        {/* Grid Panel */}
        <div className="bg-white/5 backdrop-blur-md p-0 border border-white/10 shadow-xl">
          {pattern === "center-focus" ? (
            // —— Center-Focus 4×4 Pattern ——
            <div
              className="grid grid-cols-4 grid-rows-4 gap-0"
              style={{
                width: "calc(min(90vw, 90vh))",
                height: "calc(min(90vw, 90vh))",
              }}
            >
              {Array.from({ length: 16 }).map((_, idx) => {
                // Skip the 3 extra cells of the merged center
                if ([6, 9, 10].includes(idx)) return null;

                // The one big center tile
                if (idx === 5) {
                  const src = paddedVideos[5];
                  return (
                    <div
                      key="center"
                      onClick={() => handleSlotClick(5)}
                      style={{
                        gridColumn: "2 / span 2",
                        gridRow: "2 / span 2",
                      }}
                      className="flex items-center justify-center bg-purple-600 cursor-pointer rounded-none overflow-hidden"
                    >
                      {src ? (
                        <video
                          src={src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-white/40 font-bold">+</span>
                      )}
                    </div>
                  );
                }

                // All other 12 tiles
                const src = paddedVideos[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleSlotClick(idx)}
                    style={{
                      gridColumn: `${(idx % 4) + 1}`,
                      gridRow: `${Math.floor(idx / 4) + 1}`,
                    }}
                    className="flex items-center justify-center bg-white/10 cursor-pointer rounded-none overflow-hidden"
                  >
                    {src ? (
                      <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-white/40 font-bold">+</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // —— Default N×N Grid ——
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                width: "calc(min(90vw, 90vh))",
                height: "calc(min(90vw, 90vh))",
              }}
            >
              {paddedVideos.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  className="flex items-center justify-center bg-white/10 cursor-pointer rounded-none overflow-hidden"
                >
                  {src ? (
                    <video
                      src={src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-white/40 font-bold">+</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>




        {/* Audio player */}
        <audio
          ref={audioRef}
          autoPlay
          loop
          className="hidden"
        >
          <source src={`/music/${selectedSong}`} type="audio/mp3" />
        </audio>
        
      </div>
    </div>
  );
}

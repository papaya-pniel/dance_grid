import React, { useContext, useCallback, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./components/ui/card";
import { VideoContext } from "./context/VideoContext";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function MainGrid() {
  const navigate = useNavigate();
  const { videos } = useContext(VideoContext);

  const [gridSize, setGridSize] = useState(2); // default 2x2

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


  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
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
              className={`px-4 py-2 rounded ${
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

        {/* Grid Panel */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
          <div
            className={`grid gap-4`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              width: 'calc(min(90vw, 90vh))',
              height: 'calc(min(90vw, 90vh))',
            }}
          >
            {paddedVideos.map((src, idx) => (
              <Card
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => handleSlotClick(idx)}
                className="aspect-square bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 hover:border-white/20"
              >
                <CardContent className="p-0 w-full h-full flex items-center justify-center">
                  {src ? (
                    <video
                      src={src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-4xl text-white/40 font-bold">+</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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

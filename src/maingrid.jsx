import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./components/ui/card";
// import { Button } from "./components/ui/button";
import { VideoContext } from "./context/VideoContext";

export default function MainGrid() {
  const { videos } = useContext(VideoContext);
  const navigate = useNavigate();

  const handleSlotClick = (index) => {
    console.log("Navigating to:", `/train/${index}`);
    navigate(`/train/${index}`);
  };

  return (
    <div className="h-screen bg-gray-100 p-4 animate-fadeIn flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-4">Boogie Square</h1>
      <div className="flex-grow grid grid-cols-4 grid-rows-4 gap-4">
        <div className="grid grid-cols-2 gap-6">
          {videos.map((src, idx) => (
            <Card
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => handleSlotClick(idx)}
              className="aspect-square bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <CardContent className="p-0 w-full h-full flex items-center justify-center">
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
                  <span className="text-4xl text-gray-400 font-bold">+</span>
                )}
              </CardContent>
          </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

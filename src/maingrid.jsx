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
    <div className="min-h-screen bg-gray-100 p-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Dance Video Grid</h1>
        <div className="grid grid-cols-4 gap-6">
          {videos.map((src, idx) => (
            <Card
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => handleSlotClick(idx)}
                className="aspect-square bg-gray-50 hover:bg-gray-100 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
            >
                <CardContent className="w-full h-full flex items-center justify-center p-0">
                {src ? (
                    <video src={src} controls className="w-full h-full object-cover" />
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

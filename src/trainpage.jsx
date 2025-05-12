import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoContext } from "./context/VideoContext";
import { Button } from "./components/ui/button";

export default function TrainPage() {
  const { index } = useParams();
  const { updateVideoAtIndex } = useContext(VideoContext);
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(3);
  const [showTutorial, setShowTutorial] = useState(false);
  const [recordingReady, setRecordingReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);
  const tutorialRef = useRef(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const handleReRecord = () => {
    setRecordedBlobUrl(null);
    setRecordingReady(true);
  };

  const tutorialVideoUrl = "/boogie_square_tutorial.mp4"; // Ensure this is in your /public folder

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setShowTutorial(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    videoRef.current.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedBlobUrl(url);

      // stop webcam
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6">Boogie Square #{index}</h2>

      {countdown > 0 && (
        <div className="text-[5rem] font-bold animate-pulse mb-4">{countdown}</div>
      )}

      {showTutorial && (
        <>
            <video
            ref={tutorialRef}
            src={tutorialVideoUrl}
            controls
            autoPlay
            muted
            className="w-full max-w-xl my-4 rounded-lg shadow-md"
            onEnded={() => setRecordingReady(true)}
            />
            <p className="text-gray-400 mb-4">Watch the tutorial above</p>

            {recordingReady && !recordedBlobUrl && (
            <Button
                onClick={() => {
                if (tutorialRef.current) {
                    tutorialRef.current.currentTime = 0;
                    tutorialRef.current.play();
                }
                }}
                className="mt-2"
            >
                Rewatch Tutorial
            </Button>
            )}
            {recordingReady && (
            <Button
                className="mt-4"
                onClick={() => navigate(`/record/${index}`)}
            >
                Continue to Recording
            </Button>
            )}

        </>
      )}
    </div>
  );
}





















// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "./components/ui/button";

// export default function TrainPage() {
//   const { index } = useParams();
//   const navigate = useNavigate();

//   const [countdown, setCountdown] = useState(3);
//   const [showTutorial, setShowTutorial] = useState(false);
//   const [recordingReady, setRecordingReady] = useState(false);

//   const tutorialRef = useRef(null);
//   const tutorialVideoUrl = "/sample-dance.mp4"; // make sure this exists in /public

//   // Countdown logic
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev === 1) {
//           clearInterval(timer);
//           setShowTutorial(true);
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fadeIn">
//       <h2 className="text-2xl font-semibold mb-6">Tutorial for Slot #{index}</h2>

//       {/* Countdown */}
//       {countdown > 0 && (
//         <div className="text-[5rem] font-bold animate-pulse mb-4">{countdown}</div>
//       )}

//       {/* Tutorial Video + Actions */}
//       {showTutorial && (
//         <>
//           <video
//             ref={tutorialRef}
//             src={tutorialVideoUrl}
//             controls
//             autoPlay
//             muted
//             className="w-full max-w-xl my-4 rounded-lg shadow-md"
//             onEnded={() => setRecordingReady(true)}
//           />

//           <p className="text-gray-400 mb-4">Watch and learn the dance</p>

//           <div className="flex gap-4 mt-2">
//             <Button
//               onClick={() => {
//                 if (tutorialRef.current) {
//                   tutorialRef.current.currentTime = 0;
//                   tutorialRef.current.play();
//                 }
//               }}
//             >
//               Rewatch Tutorial
//             </Button>

//             {recordingReady && (
//               <Button
//                 variant="secondary"
//                 onClick={() => navigate(`/record/${index}`)}
//               >
//                 Continue to Recording
//               </Button>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useRecords } from "@/app/context/RecordersContext";
import { useRef, useState } from "react";

const RecordingsList = () => {
  const { recordings } = useRecords();
  const [playingId, setPlayingId] = useState<string | null>(null);

  function base64ToBlob(base64Data: string): Blob {
    const parts = base64Data.split(",");
    const mimeType = parts[0].match(/:(.*?);/)?.[1];
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: mimeType || "audio/webm" });
  }

  const playRecording = async (id: string | number) => {
    const response = await fetch(`/api/play/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(id),
    });

    const audioBlob = await response.blob();
    return audioBlob;
  };

  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = async (audioId: string) => {
    setPlayingId(audioId);

    const blob = await playRecording(audioId);
    if (!blob) return;

    const audioUrl = URL.createObjectURL(blob);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }

    if (audioRef.current) {
      audioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setPlayingId(null);
      };
    }
  };

  return (
    recordings &&
    recordings?.map(audio => (
      <div
        key={audio.id}
        className="flex justify-center items-center gap-5 space-y-3 mb-3"
      >
        <p className="text-gray-900">{audio.title}</p>
        {playingId === audio.id && <audio ref={audioRef} controls />}
        <button
          className="flex items-center justify-center font-semibold w-20 h-[44px] px-[18px] py-[10px] gap-2 rounded-lg text-white bg-gray-700 hover:bg-gray-800 focus:bg-gray-800"
          onClick={() => handlePlay(audio.id)}
          type="button"
        >
          Play
        </button>
      </div>
    ))
  );
};

export default RecordingsList;

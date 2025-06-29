"use client";

import { useRecords } from "@/app/context/RecordersContext";
import { useState } from "react";

type Record = {
  id: string;
  userId: number;
  blobUrl: string;
};

const RecordingsList = () => {
  const { recordings } = useRecords();
  const [selectedAudio, setSelectedAudio] = useState("");

  const playRecording = async (id: string | number) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`/api/play/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const wantedRecord = recordings.find((rc: Record) => rc.id === id);
    if (!wantedRecord) return;

    const base64Chunks = wantedRecord.audioData;

    const binaryChunks = base64Chunks.map((base64: string) => {
      const base64String = base64.split(",")[1];
      const byteString = atob(base64String);
      const byteArray = new Uint8Array(byteString.length);

      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }

      return byteArray;
    });

    const mergedBlob = new Blob(binaryChunks, { type: "audio/webm" });

    const audioUrl = URL.createObjectURL(mergedBlob);
    setSelectedAudio(audioUrl);
  };

  return (
    recordings &&
    recordings?.map((audio: Record) => (
      <div
        key={audio.id}
        className="flex justify-center items-center gap-5 space-y-3"
      >
        <audio key={audio.id} src={`/api/play/${audio.id}`} controls />
        <button
          className="flex items-center justify-center font-semibold w-20 h-[44px] px-[18px] py-[10px] gap-2 rounded-lg text-white bg-gray-700 hover:bg-gray-800 focus:bg-gray-800"
          onClick={() => playRecording(audio.id)}
          type="button"
        >
          Play
        </button>
      </div>
    ))
  );
};
export default RecordingsList;

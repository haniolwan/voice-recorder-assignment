"use client";

import { recordingsData } from "@/app/lib/recordings";
import { useEffect, useState } from "react";

type Record = {
  id: string;
  userId: number;
  blobUrl: string;
};

const RecordingsList = () => {
  const [recordings, setRecordings] = useState<Record[]>([]);

  const fetchRecordingsApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/recordings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const dataFetch = async () => {
      const { recordings } = await fetchRecordingsApi();
      console.log(recordings);
      setRecordings(recordings);
    };

    dataFetch();
  }, []);

  const playRecording = async (id: string | number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/play/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

  return (
    recordings &&
    recordings?.map((audio: Record) => (
      <div key={audio.id} className="flex justify-center items-center gap-5">
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

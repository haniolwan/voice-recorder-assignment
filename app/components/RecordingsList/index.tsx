"use client";

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
  console.log(recordings);
  return (
    recordings &&
    recordings?.map((audio: Record) => (
      <audio key={audio.id} src={`/api/play/${audio.id}`} controls />
    ))
  );
};
export default RecordingsList;

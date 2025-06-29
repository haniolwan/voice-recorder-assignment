"use client";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AudioRecorder = () => {
  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string>();

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const mimeType = "audio/webm";

  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    if (!stream) {
      alert("No audio stream available. Please allow microphone access.");
      return;
    }

    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start(1000);

    const localAudioChunks: Blob[] = [];

    const token = localStorage.getItem("token");
    const uuid = uuidv4();

    mediaRecorder.current.ondataavailable = async event => {
      if (!event.data || event.data.size === 0) return;

      localAudioChunks.push(event.data);
      setAudioChunks([...localAudioChunks]);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        await fetch("/api/audio-chunk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            audio: base64Audio,
            uniqueId: uuid,
          }),
        });
      };

      reader.readAsDataURL(event.data);
    };
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.current) {
      setRecordingStatus("inactive");
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        setAudioChunks([]);
      };
    }
  };

  useEffect(() => {
    const streamData = async () => {
      if (!stream) return;
      const media = new MediaRecorder(stream);

      mediaRecorder.current = media;
      mediaRecorder.current.start(1000);

      mediaRecorder.current.ondataavailable = async (event: any) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
      };
    };
    streamData();
  }, [stream]);

  return (
    <div>
      <main>
        <div className="audio-controls">
          {!permission ? (
            <button
              className="flex items-center justify-center font-semibold w-full h-[44px] px-[18px] py-[10px] gap-2 rounded-lg mb-6 text-white bg-gray-700 hover:bg-gray-800 focus:bg-gray-800"
              onClick={getMicrophonePermission}
              type="button"
            >
              Get Microphone
            </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <button
              className="flex items-center justify-center font-semibold w-full h-[44px] px-[18px] py-[10px] gap-2 rounded-lg mb-6 text-white bg-gray-700 hover:bg-gray-800 focus:bg-gray-800"
              onClick={startRecording}
              type="button"
            >
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button
              className="flex items-center justify-center font-semibold w-full h-[44px] px-[18px] py-[10px] gap-2 rounded-lg mb-6 text-white bg-gray-700 hover:bg-gray-800 focus:bg-gray-800"
              onClick={stopRecording}
              type="button"
            >
              Stop Recording
            </button>
          ) : null}
        </div>
        {audio ? (
          <div>
            <audio src={audio} controls></audio>
          </div>
        ) : null}
      </main>
    </div>
  );
};
export default AudioRecorder;

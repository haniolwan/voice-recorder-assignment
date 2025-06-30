"use client";
import { useEffect, useRef, useState } from "react";
import RecordingInfo from "./Stats";

const AudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string[]>([]);
  const [audioId, setAudioId] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioSize, setAudioSize] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const mediaRecorder = useRef<MediaRecorder>(null);
  const timerRef = useRef<any>(null);
  const mimeType = "audio/webm";

  const uuidv4 = () => Math.random().toString(36).substring(2, 15);

  useEffect(() => {
    if (recordingStatus === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingStatus]);

  const startRecording = async () => {
    try {
      setErrorMessage("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Recording not supported in this browser");
        return;
      }

      const streamData: any = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      setPermission(true);
      setStream(streamData);
      setRecordingStatus("recording");
      setRecordingTime(0);
      setAudioSize(0);

      const media = new MediaRecorder(streamData, { mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start(1000);

      const localAudioChunks: Blob[] = [];
      const uuid = uuidv4();
      setAudioId(uuid);

      mediaRecorder.current.ondataavailable = async (event: any) => {
        if (!event.data || event.data.size === 0) return;

        localAudioChunks.push(event.data);
        setAudioChunks([...localAudioChunks]);

        const totalSize = localAudioChunks.reduce(
          (sum, chunk) => sum + chunk.size,
          0
        );
        setAudioSize(totalSize);

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          await fetch("/api/audio-chunk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              audio: base64Audio,
              uniqueId: uuid,
            }),
          });
        };
        reader.readAsDataURL(event.data);
      };
    } catch (error) {
      setErrorMessage("check microphone permissions?.");
      console.error("Recording error:", error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause();
      setRecordingStatus("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume();
      setRecordingStatus("recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      setRecordingStatus("processing");
      mediaRecorder.current.stop();

      mediaRecorder.current.onstop = async () => {
        const response = await fetch("/api/save-final-recording", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ uniqueId: audioId }),
        });

        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio((prev: any) => [...prev, audioUrl]);

        setAudioChunks([]);
        setRecordingStatus("inactive");
        setRecordingTime(0);
        setAudioSize(0);

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Audio Recorder
          </h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              {recordingStatus !== "inactive" && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1"></div>
                  <div className="flex items-center gap-1"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={
                recordingStatus === "paused" ? resumeRecording : startRecording
              }
              disabled={
                recordingStatus === "recording" ||
                recordingStatus === "processing"
              }
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {recordingStatus === "paused" ? "Resume" : "Start"}
            </button>

            <button
              onClick={pauseRecording}
              disabled={recordingStatus !== "recording"}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              Pause
            </button>

            <button
              onClick={stopRecording}
              disabled={
                recordingStatus === "inactive" ||
                recordingStatus === "processing"
              }
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              Stop
            </button>
          </div>

          {audio.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Recordings
              </h3>
              <div className="space-y-3">
                {audio.map((src, index) => (
                  <div key={src} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Recording {index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <audio src={src} controls className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <RecordingInfo
          recordingTime={recordingTime}
          audioSize={audioSize}
          audioChunks={audioChunks}
          audio={audio}
          permission={permission}
        />
      </div>
    </div>
  );
};

export default AudioRecorder;

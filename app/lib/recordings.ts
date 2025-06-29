import { User } from "../login/page";

type Record = {
  id: string;
  userId: User["id"];
  audioData: ArrayBuffer;
  size: number;
  type: string;
  timestamp: string;
};

export const recordingsData: Record[] = [
  {
    id: "1",
    userId: 1,
    audioData: new ArrayBuffer(8),
    size: 8000,
    type: "audio/webm",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    userId: 2,
    audioData: new ArrayBuffer(8),
    size: 8000,
    type: "audio/webm",
    timestamp: new Date().toISOString(),
  },
];

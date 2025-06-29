import { User } from "../login/page";

export type Record = {
  id: string;
  title: string;
  userId: User["id"];
  audioData: any;
  duration: number;
  type: string;
  createdAt: string;
};

export const recordingsData: Record[] = [
  {
    id: "1",
    title: "Recording 1",
    userId: 1,
    audioData: new ArrayBuffer(8),
    duration: 8000,
    type: "audio/webm",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Recording 2",
    userId: 2,
    audioData: new ArrayBuffer(8),
    duration: 8000,
    type: "audio/webm",
    createdAt: new Date().toISOString(),
  },
];

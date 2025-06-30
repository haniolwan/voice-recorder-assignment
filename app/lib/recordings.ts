import { User } from "../login/page";

export type Record = {
  id: string;
  title: string;
  userId: User["id"];
  audioData: Blob[];
  duration: number;
  type: string;
  createdAt: string;
};

declare global {
  var recordingsData: Record[] | undefined;
}

if (!globalThis.recordingsData) {
  globalThis.recordingsData = [];
}

export const recordingsData = globalThis.recordingsData;

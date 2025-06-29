"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Record } from "../lib/recordings";

type RecordsContextType = {
  recordings: Record[];
  loading: boolean;
  error: string | null;
  fetchRecordings: () => Promise<void>;
  setRecordings: (recording: Record[]) => void;
};

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [recordings, setRecordings] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecordings() {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/recordings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recordings");
      }

      const json = await res.json();

      if (json.success) {
        setRecordings(json.recordings || []);
      } else {
        setError(json.message || "Unknown error");
      }
    } catch (err: any) {
      setError(err.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecordings();
  }, []);

  return (
    <RecordsContext.Provider
      value={{ recordings, loading, error, fetchRecordings, setRecordings }}
    >
      {children}
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  const context = useContext(RecordsContext);
  if (context === undefined) {
    throw new Error("useRecords must be used within a RecordsProvider");
  }
  return context;
}

import { formatSize, formatTime } from "../../helpers";

type Props = {
  recordingTime: number;
  audioSize: number;
  audioChunks: Blob[];
  audio: any;
  permission: boolean;
};

const RecordingInfo = ({
  recordingTime,
  audioSize,
  audioChunks,
  audio,
  permission,
}: Props) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Recording Info
      </h3>

      <div className="space-y-4">
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700 mb-2">Current Session</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-mono">{formatTime(recordingTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-mono">{formatSize(audioSize)}</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-mono">WebM</span>
            </div>
            <div className="flex justify-between">
              <span>Chunks:</span>
              <span className="font-mono">{audioChunks.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700 mb-2">Session Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Recordings:</span>
              <span className="font-mono">{audio.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Permission:</span>
              <span
                className={`font-mono ${
                  permission ? "text-green-600" : "text-red-600"
                }`}
              >
                {permission ? "Granted" : "Denied"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingInfo;

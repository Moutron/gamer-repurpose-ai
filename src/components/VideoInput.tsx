interface VideoInputProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  onRepurpose: () => void;
  loading: boolean;
}

export default function VideoInput({ 
  videoUrl, 
  setVideoUrl, 
  onRepurpose, 
  loading 
}: VideoInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter YouTube Video URL"
        className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={onRepurpose}
        disabled={loading}
        className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {loading ? "Repurposing..." : "Repurpose"}
      </button>
      
      <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold text-purple-400 mb-2">📋 Video Requirements:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Video must have closed captions/transcripts available</li>
          <li>• Look for the CC icon in the YouTube player</li>
          <li>• Most gaming videos from popular creators work well</li>
          <li>• Videos without captions will show an error message</li>
        </ul>
      </div>
    </div>
  );
} 
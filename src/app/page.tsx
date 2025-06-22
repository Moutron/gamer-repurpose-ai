"use client";

import { useState } from "react";
import { Header, VideoInput, LoadingSpinner, ResultsList } from "../components";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const handleRepurpose = async () => {
    if (!videoUrl) {
      setError("Please enter a YouTube video URL.");
      return;
    }
    
    setLoading(true);
    setResults([]);
    setError("");

    try {
      const response = await fetch("/api/repurpose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResults(data.posts);
    } catch (error: unknown) {
      const err = error as Error;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <main className="w-full max-w-2xl">
        <Header />
        
        <VideoInput
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          onRepurpose={handleRepurpose}
          loading={loading}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {loading && <LoadingSpinner />}

        <ResultsList results={results} />
      </main>
    </div>
  );
}

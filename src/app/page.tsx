"use client";

import { useState } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleRepurpose = async () => {
    if (!videoUrl) {
      alert("Please enter a YouTube video URL.");
      return;
    }
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("/api/repurpose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong.");
      }

      const data = await response.json();
      setResults(data.posts);
    } catch (error: any) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <main className="w-full max-w-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Gamer Content Repurposer AI
          </h1>
          <p className="text-lg text-gray-400">
            Turn your gaming videos into engaging social media posts.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube Video URL"
            className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleRepurpose}
            disabled={loading}
            className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? "Repurposing..." : "Repurpose"}
          </button>
        </div>

        {loading && (
          <div className="text-center mt-8">
            <p>Analyzing video and generating content...</p>
          </div>
        )}

        {results.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Generated Posts:</h2>
            <div className="space-y-4">
              {results.map((post, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg">
                  <p>{post}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

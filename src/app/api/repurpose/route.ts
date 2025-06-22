import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
  console.log("Extracting video ID from URL:", url);
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      console.log("Found video ID:", match[1]);
      return match[1];
    }
  }
  
  console.log("No video ID found in URL");
  return null;
}

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    console.log("Received video URL:", videoUrl);

    if (!videoUrl) {
      return NextResponse.json(
        { error: "YouTube video URL is required" },
        { status: 400 }
      );
    }

    // Extract video ID and validate URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL format. Please provide a valid YouTube video URL." },
        { status: 400 }
      );
    }

    // Construct clean YouTube URL
    const cleanVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log("Clean video URL:", cleanVideoUrl);

    try {
      console.log("Attempting to fetch transcript...");
      const transcript = await YoutubeTranscript.fetchTranscript(cleanVideoUrl);
      console.log("Transcript fetched successfully, length:", transcript?.length);

      if (!transcript || transcript.length === 0) {
        return NextResponse.json(
          { error: "This video doesn't have captions/transcripts available. Please try a different video that has closed captions enabled." },
          { status: 400 }
        );
      }

      const transcriptText = transcript.map((item) => item.text).join(" ");
      console.log("Transcript text length:", transcriptText.length);

      const prompt = `Based on the following transcript from a gaming video, generate 3 engaging and short social media posts (e.g., for Twitter/X). The posts should be exciting, use relevant hashtags, and encourage people to watch the full video.

      Transcript: "${transcriptText.substring(0, 4000)}"

      Generated Posts:`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert social media manager for a video game content creator.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
      });

      const generatedText = response.choices[0]?.message?.content;
      const posts = generatedText?.split('\n').filter(post => post.trim().length > 0) || [];

      return NextResponse.json({ posts });
    } catch (transcriptError: unknown) {
      const error = transcriptError as Error;
      console.error("Transcript error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check if it's a pattern matching error
      if (error.message && error.message.includes("pattern")) {
        return NextResponse.json(
          { error: "Unable to process this YouTube video. Please make sure the video has captions/transcripts available and try again." },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to fetch video transcript: ${error.message || 'Unknown error'}` },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("API error:", err);
    return NextResponse.json(
      { error: `An unexpected error occurred: ${err.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
} 
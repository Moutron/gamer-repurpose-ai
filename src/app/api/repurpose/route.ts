import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: "YouTube video URL is required" },
        { status: 400 }
      );
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: "Could not fetch transcript for this video." },
        { status: 400 }
      );
    }

    const transcriptText = transcript.map((item) => item.text).join(" ");

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
} 
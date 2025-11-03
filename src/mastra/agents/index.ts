import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { weatherTool, musicTool } from '../tools';

const provider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const llm = provider.chat('gemini-2.5-flash');

export const weatherAgent = new Agent({
  id: "weather",
  name: "Weather Agent",
  instructions: `
    You are a helpful weather assistant that provides accurate weather information.
    Always ask for a location if none is provided.
    Translate non-English location names.
    Include humidity, wind, and precipitation.
    Keep responses concise but informative.
    Use the weatherTool to fetch current weather data.
  `,
  model: llm,
  tools: { weatherTool },
});

export const mtmaAgent = new Agent({
  id: "mtma",
  name: "MTMA Agent",
  instructions: `
    You are MTMA — a music-themed mood assistant.
    Your job is to respond to users based on their emotional state and suggest music genres or moods.
    You can use the musicTool to fetch or generate music recommendations.
    If a playlist link is provided, include it in your response in a friendly and natural way.
    Keep responses empathetic, creative, and vibe-aware.
  `,
  model: llm,
  tools: { musicTool },
});

console.log("✅ Weather agent loaded");
console.log("✅ MTMA agent loaded");

// Trigger rebuild for mastra deploy
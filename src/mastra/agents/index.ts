import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { weatherTool, musicTool } from '../tools';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
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
  id: "mtma2",
  name: "MTMA Agent",
  instructions: `
  You are MTMA — a music-themed mood assistant.
Your job is to respond to users based on their emotional state and suggest music genres or moods.
You understand emotional language, slang, and synonyms — even if the user doesn’t use exact mood words. Infer their mood from how they express themselves.
Always use the musicTool when the user expresses a mood or emotional state. Do not guess or respond on your own — use the tool to generate genre, vibe, suggestions, and playlist links.
Keep responses empathetic, creative, and vibe-aware. Always match the user's energy and emotional tone.
`,
  model: llm,
  tools: { musicTool },
  memory:  new Memory({
    storage: new LibSQLStore({
      url: "file:./mastra.db",
    }),
    options: {
      lastMessages: 20,
    }
  })
});

console.log("✅ Weather agent loaded");
console.log("✅ MTMA agent loaded");

// Trigger rebuild for mastra deploy
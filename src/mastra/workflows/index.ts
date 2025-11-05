import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const provider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_aPI_KEY!
});
const llm = provider.chat('gemini-2.5-flash')


// 🎵 MTMA Workflow
const mtmaAgent = new Agent({
  name: 'MTMA Agent',
  model: llm,
  instructions: `
    You are MTMA — a music-themed mood assistant.
    Your job is to respond empathetically to users based on their emotional state and suggest music genres or moods.
    Keep responses creative, vibe-aware, and emotionally intelligent.
    Use the musicTool to generate suggestions when needed.
  `,
});

const receiveMood = createStep({
  id: 'receive-mood',
  description: 'Receives user emotional input',
  inputSchema: z.object({
    mood: z.string().describe('User mood or emotional state'),
  }),
  outputSchema: z.object({
    mood: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData?.mood) throw new Error('Mood not provided');
    return { mood: inputData.mood };
  },
});

const suggestMusic = createStep({
  id: 'suggest-music',
  description: 'Generates music suggestion based on mood',
  inputSchema: z.object({
    mood: z.string(),
  }),
  outputSchema: z.object({
    suggestion: z.string(),
  }),
  execute: async ({ inputData }) => {
    const prompt = `The user is feeling "${inputData.mood}". Suggest a music genre, vibe, and artist or playlist that fits.`;

    const response = await mtmaAgent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let suggestionText = '';
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      suggestionText += chunk;
    }

    return { suggestion: suggestionText };
  },
});

const mtmaWorkflow = createWorkflow({
  id: 'mtma2-workflow',
  inputSchema: z.object({
    mood: z.string().describe('User mood or emotional state'),
  }),
  outputSchema: z.object({
    suggestion: z.string(),
  }),
})
  .then(receiveMood)
  .then(suggestMusic);

mtmaWorkflow.commit();

export { mtmaWorkflow };

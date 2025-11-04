# MTMA — Mood-Themed Music Assistant 🎵

MTMA is an AI-powered agent that recommends music based on your emotional state. It understands slang, tone, and indirect expressions to infer your mood and suggest the perfect vibe.

## Features
- 🎧 Mood inference from expressive language
- 🎵 Genre, vibe, artist, and playlist suggestions
- 🤖 Built with Mastra AI framework
- 🧠 Memory-ready (Turso or other stores)

## How It Works
1. User expresses a mood (e.g. "I'm sha vibing hard")
2. MTMA infers the mood using a shared mood map
3. It invokes the `musicTool` to generate suggestions
4. Returns genre, vibe, artist, and playlist link

## Dev Setup
```bash
npm install
npm run dev

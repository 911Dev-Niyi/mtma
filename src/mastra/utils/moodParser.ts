// utils/moodParser.ts

export const moodMap: Record<string, string[]> = {
  happy: [
    "happy",
    "joyful",
    "excited",
    "glad",
    "cheerful",
    "sha happy",
    "feeling good",
  ],
  sad: ["sad", "down", "blue", "depressed", "low", "not feeling it"],
  energetic: [
    "energetic",
    "hyped",
    "pumped",
    "charged",
    "whip me something good",
    "vibing hard",
  ],
  chill: ["chill", "calm", "relaxed", "easygoing", "cooling off"],
  nostalgic: [
    "nostalgic",
    "sentimental",
    "reflective",
    "old school",
    "thinking back",
  ],
  angry: ["angry", "mad", "frustrated", "heated", "pissed"],
  anxious: ["anxious", "nervous", "tense", "worried", "on edge"],
};

export function parseMood(input: string): string {
  const lower = input.toLowerCase();
  for (const [mood, synonyms] of Object.entries(moodMap)) {
    if (synonyms.some((s) => lower.includes(s))) {
      return mood;
    }
  }
  return "neutral";
}

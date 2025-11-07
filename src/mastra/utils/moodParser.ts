import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export const moodMap: Record<string, string[]> = {
  happy: ['happy', 'joyful', 'excited', 'glad', 'cheerful', 'feeling good'],
  sad: ['sad', 'down', 'blue', 'depressed', 'low', 'not feeling it'],
  energetic: ['energetic', 'hyped', 'pumped', 'charged', 'vibing hard'],
  chill: ['chill', 'calm', 'relaxed', 'easygoing', 'cooling off'],
  nostalgic: ['nostalgic', 'sentimental', 'reflective', 'old school', 'thinking back'],
  angry: ['angry', 'mad', 'frustrated', 'heated', 'pissed'],
  anxious: ['anxious', 'nervous', 'tense', 'worried', 'on edge'],
};

export function parseMood(input: string): string {
  const lower = input.toLowerCase();

  // Keyword matching
  for (const [mood, synonyms] of Object.entries(moodMap)) {
    if (synonyms.some((s) => lower.includes(s))) {
      return mood;
    }
  }

  // Sentiment scoring fallback
  const score = sentiment.analyze(lower).score;

  if (score > 3) return 'happy';
  if (score < -3) return 'sad';
  if (score > 0) return 'chill';
  if (score < 0) return 'anxious';

  return 'neutral';
}

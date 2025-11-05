import { z } from 'zod';
import { createTool } from '@mastra/core';
import { parseMood } from '../utils/moodParser';

const playlistLinks: Record<string, string> = {
sad: 'https://open.spotify.com/playlist/53x5zb5JQlXJ9wBR3iImDL',
  happy: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC',
  anxious: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
  chill: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
  nostalgic: 'https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd',
  angry: 'https://open.spotify.com/playlist/37i9dQZF1DWXNFSTtym834'
};

const getMusicSuggestion = (mood: string) => {
  const normalizedMood = mood.toLowerCase();

  const moodMap: Record<string, { genre: string; vibe: string; suggestion: string }> = {
    happy: {
      genre: 'Afrobeats',
      vibe: 'Energetic & joyful',
      suggestion: 'Try something from Burna Boy or Ayra Starr',
    },
    sad: {
      genre: 'Soul',
      vibe: 'Reflective & mellow',
      suggestion: 'Maybe some Asa or Sade to ease the mood',
    },
    nostalgic: {
      genre: 'Highlife',
      vibe: 'Warm & retro',
      suggestion: 'Check out Oliver De Coque or Osadebe',
    },
    angry: {
      genre: 'Hip-hop',
      vibe: 'Raw & expressive',
      suggestion: 'Try Kendrick Lamar or Olamide',
    },
    chill: {
      genre: 'Lo-fi',
      vibe: 'Relaxed & ambient',
      suggestion: 'Lo-fi beats playlist on Spotify or YouTube',
    },
    anxious: {
      genre: 'Ambient',
      vibe: 'Soothing & grounding',
      suggestion: 'Try some soft piano or nature sounds',
    },
  };

  const base = moodMap[normalizedMood] || {
    genre: 'Eclectic',
    vibe: 'Mixed emotions',
    suggestion: 'Explore something new — maybe jazz or indie fusion',
  };

  const playlist = playlistLinks[normalizedMood] ?? null;

  return {
    ...base,
    playlist,
  };
};

export const musicTool = createTool({
  id: 'suggest-music',
  description: 'Suggest music genres or moods based on emotional input',
  inputSchema: z.object({
    mood: z.string().describe('User mood or emotional state'),
  }),
  outputSchema: z.object({
    genre: z.string(),
    vibe: z.string(),
    suggestion: z.string(),
    playlist: z.string().nullable(),
  }),
  execute: async ({ context }) => {
    const parsedMood = parseMood(context.mood);
    return getMusicSuggestion(parsedMood);
  },
});





import { z } from 'zod';
import { createTool } from '@mastra/core';
import { parseMood } from '../utils/moodParser';

const playlistLinks: Record<string, string[]> = {
 sad: [
    'https://open.spotify.com/playlist/53x5zb5JQlXJ9wBR3iImDL',
    'https://open.spotify.com/playlist/37i9dQZF1DWVV27DiNWxkR',
    'https://music.youtube.com/playlist?list=PLwYpPAblHaxE6kKDXlMqs_hPF0j3GcKkP',
    'https://www.youtube.com/watch?v=ZbZSe6N_BXs'
  ],
  happy: [
    'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC',
    'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0',
    'https://music.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj',
    'https://www.youtube.com/watch?v=TYdYK028sc4'
  ],
  anxious: [
    'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    'https://open.spotify.com/playlist/37i9dQZF1DWU0ZKD0QzF3y',
    'https://music.youtube.com/playlist?list=PLSDoVPMU1x1Zz7GZzKjZzFJvZzFJvZzFJ',
    'https://www.youtube.com/watch?v=TYdYK028sc4'
  ],
  chill: [
    'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
    'https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7',
    'https://music.youtube.com/playlist?list=PLSDoVPMU1x1Zz7GZzKjZzFJvZzFJvZzFJ',
    'https://www.youtube.com/watch?v=TYdYK028sc4'
  ],
  nostalgic: [
    'https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd',
    'https://open.spotify.com/playlist/37i9dQZF1DWXJfnUiYjUKT',
    'https://music.youtube.com/playlist?list=PLwYpPAblHaxE6kKDXlMqs_hPF0j3GcKkP',
    'https://www.youtube.com/watch?v=3y-uCCeI7K4'
  ],
  angry: [
    'https://open.spotify.com/playlist/37i9dQZF1DWXNFSTtym834',
    'https://open.spotify.com/playlist/37i9dQZF1DX1rVvRgjX59F',
    'https://music.youtube.com/playlist?list=PLSDoVPMU1x1Zz7GZzKjZzFJvZzFJvZzFJ',
    'https://www.youtube.com/watch?v=TYdYK028sc4'
  ]
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

  const hasMood = moodMap.hasOwnProperty(normalizedMood);
const hasPlaylist = playlistLinks.hasOwnProperty(normalizedMood);

  const base = hasMood
  ? moodMap[normalizedMood]
  : {
      genre: 'Eclectic',
      vibe: 'Mixed emotions',
      suggestion: 'Explore something new — maybe jazz or indie fusion',
    };

  const playlistArray = hasPlaylist ? playlistLinks[normalizedMood] : [];
  const playlist = playlistArray.length
    ? playlistArray[Math.floor(Math.random() * playlistArray.length)]
    : 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO';

  const platform = playlist?.includes('spotify')
    ? 'Spotify'
    : playlist?.includes('youtube')
    ? 'YouTube Music'
    : 'Unknown';

  return {
    mood: normalizedMood,
    genre: base.genre,
    vibe: base.vibe,
    platform,
    playlist,
    artifact: {
      title: `${normalizedMood.charAt(0).toUpperCase() + normalizedMood.slice(1)} Vibes`,
      description: base.suggestion,
      link: playlist ?? '',
    },
  };
};

export const musicTool = createTool({
  id: 'suggest-music',
  description: 'Suggest music genres or moods based on emotional input',
  inputSchema: z.object({
    mood: z.string().describe('User mood or emotional state'),
  }),
  outputSchema: z.object({
    mood: z.string(),
    genre: z.string(),
    vibe: z.string(),
    platform: z.string(),
    playlist: z.string().nullable(),
    artifact: z.object({
      title: z.string(),
      description: z.string(),
      link: z.string(),
    }),
  }),
  execute: async ({ context }) => {
    const parsedMood = parseMood(context.mood);
    return getMusicSuggestion(parsedMood);
  },
});

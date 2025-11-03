import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

//
// 🎵 Playlist Links
//
const playlistLinks: Record<string, string> = {
  sad: 'https://open.spotify.com/playlist/xyz123',
  happy: 'https://open.spotify.com/playlist/abc456',
  anxious: 'https://youtube.com/playlist/def789',
  chill: 'https://boomplay.com/playlist/ghi101',
  nostalgic: 'https://audiomack.com/playlist/jkl202',
  angry: 'https://music.apple.com/playlist/mno303',
};

//
// 🔧 Music Suggestion Logic
//
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

//
// 🎵 Music Tool
//
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
    return getMusicSuggestion(context.mood);
  },
});

//
// 🌦️ Weather Tool
//
export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});

//
// 🌍 Weather Logic
//
interface GeocodingResponse {
  results: { latitude: number; longitude: number; name: string }[];
}

interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}

const getWeather = async (location: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }

  const { latitude, longitude, name } = geocodingData.results[0];
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;
  const response = await fetch(weatherUrl);
  const data = (await response.json()) as WeatherResponse;

  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name,
  };
};

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return conditions[code] || 'Unknown';
}

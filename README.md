# 🎧 MTMA — Music-Themed Mood Assistant

MTMA is an AI-powered agent that responds to emotional input and suggests music genres, artists, and playlists based on your mood. Built with [Mastra](https://mastra.ai) and integrated with [Telex.im](https://telex.im), it delivers emotionally intelligent music recommendations via a live API and workflow automation.

---

## 🚀 Features

- Detects mood from natural language input
- Suggests music genres, artists, and vibes
- Returns curated playlists from Spotify, YouTube, Boomplay, and more
- Fully compliant with A2A JSON-RPC spec
- Integrated with Telex for real-time orchestration

---

## 🧠 How It Works

1. **User sends a message** like `"I'm feeling nostalgic tonight"`
2. **MTMA parses the mood** using a custom keyword-based parser
3. **Agent triggers `musicTool`** to generate genre, vibe, suggestion, and playlist
4. **Response is returned** in A2A format with artifacts and history

---

## 📦 Tech Stack

- **Mastra**: Agent framework and A2A routing
- **Telex.im**: Workflow automation and orchestration
- **TypeScript**: Core logic and tooling
- **Railway**: Deployment platform

---

## 🔧 Running Locally

```bash
git clone https://github.com/your-username/mtma-agent
cd mtma-agent
npm install
node start-with-config.mjs
📡 API Endpoint
http
POST https://your-railway-url/a2a/agent/mtmaAgent
Content-Type: application/json
Example Request
json
{
  "jsonrpc": "2.0",
  "id": "test-001",
  "params": {
    "message": {
      "role": "user",
      "parts": [{ "kind": "text", "text": "I'm feeling chill today" }]
    }
  }
}
Example Response
json
{
  "jsonrpc": "2.0",
  "id": "test-001",
  "result": {
    "status": {
      "state": "completed",
      "message": {
        "role": "agent",
        "parts": [{ "kind": "text", "text": "Try some Lo-fi beats on Spotify or YouTube" }]
      }
    },
    "artifacts": [
      {
        "name": "ToolResults",
        "parts": [
          {
            "kind": "data",
            "data": {
              "genre": "Lo-fi",
              "vibe": "Relaxed & ambient",
              "suggestion": "Lo-fi beats playlist on Spotify or YouTube",
              "playlist": "https://boomplay.com/playlist/ghi101"
            }
          }
        ]
      }
    ]
  }
}
```
🔗 Telex Integration
Workflow ID: mtma_workflow_001

Node Type: a2a/mastra-a2a-node

Endpoint: https://telex-mastra.mastra.cloud/a2a/agent/mtmaAgent

✍️ Author
Built by @adeniyi for the HNG Internship using Mastra and Telex.

As part of the HNG Internship, I built MTMA — a music-themed mood assistant that suggests genres, artists, and playlists based on emotional input. It’s powered by [Mastra](https://mastra.ai) and integrated with [Telex.im](https://telex.im) for real-time orchestration.

I wanted to build something expressive — an agent that understands how people feel and responds with music to match. Whether you're feeling chill, nostalgic, or hyped, MTMA finds the vibe and sends a playlist.
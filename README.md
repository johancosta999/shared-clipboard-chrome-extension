# CopyMate — Real-Time Shared Clipboard Chrome Extension

CopyMate is a Chrome extension that lets you instantly share clipboard text with friends in real time — no login, no account, just a room code. Copy something on your browser and it appears on your friend's screen automatically.

---

## How It Works

```
You copy text → Extension detects it → Sends to WebSocket server → Friend's extension receives it instantly
```

- Rooms are created with a random 6-character code
- Share the code with a friend to connect
- Anyone in the same room sees copied text in real time
- No data is stored — the server only relays messages

---

## Tech Stack

| Layer | Tech |
|---|---|
| Extension UI | React + Vite |
| Background sync | Chrome Service Worker |
| Real-time server | Node.js + WebSockets (ws) |
| Deployment | Render |

---

## Project Structure

```
shared-clipboard/
├── extension/
│   ├── public/
│   │   ├── manifest.json        ← Chrome extension config
│   │   ├── service-worker.js    ← WebSocket connection (stays alive in background)
│   │   └── content.js           ← Detects copy events on any webpage
│   ├── src/
│   │   ├── App.jsx              ← React UI (create/join room, display received text)
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── index.js                 ← Node.js WebSocket server
│   └── package.json
└── render.yaml                  ← Render deployment config
```

---

## Local Development

### Prerequisites
- Node.js (LTS) — [nodejs.org](https://nodejs.org)
- Git — [git-scm.com](https://git-scm.com)
- Google Chrome

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/shared-clipboard.git
cd shared-clipboard
```

### 2. Start the WebSocket server
```bash
cd server
npm install
node index.js
```
Server runs on `ws://localhost:8080`

### 3. Build the extension
```bash
cd extension
npm install
npm run build
```

### 4. Load the extension in Chrome
1. Go to `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load Unpacked**
4. Select the `extension/dist/` folder
5. The CopyMate icon appears in your toolbar

---

## Installing the Extension (For Friends)

Since CopyMate isn't on the Chrome Web Store yet, install it manually:

1. Download the `dist.zip` file shared with you
2. Unzip it
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer Mode** (top right toggle)
5. Click **Load Unpacked**
6. Select the unzipped `dist/` folder
7. CopyMate appears in your Chrome toolbar ✅

---

## How to Use

1. Click the **CopyMate icon** in your Chrome toolbar to open the side panel
2. Click **Create Room** — a 6-character room code is generated
3. Share the code with your friend
4. Your friend opens CopyMate and clicks **Join Room** with the code
5. Copy any text on any webpage — it instantly appears in your friend's side panel
6. Your friend clicks **Copy** to copy it to their clipboard
7. Click **Leave Room** when done

---

## Deployment

The WebSocket server is deployed on [Render](https://render.com).

To deploy your own instance:

1. Push the repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** to `shared-clipboard/server`
5. Set **Build Command** to `npm install`
6. Set **Start Command** to `node index.js`
7. Select **Free** instance type
8. Deploy

Once deployed, update `service-worker.js`:
```js
// Change this
socket = new WebSocket("ws://localhost:8080");

// To this
socket = new WebSocket("wss://your-render-url.onrender.com");
```

Then rebuild the extension:
```bash
cd extension
npm run build
```

---

## Features

- 🔗 **Room-based sync** — connect with anyone using a 6-character code
- ⚡ **Real-time** — text appears instantly via WebSockets
- 🔄 **Auto-detect copy** — no manual sending, just Ctrl+C
- 🪟 **Side panel UI** — stays open while you browse
- 🔒 **No login needed** — completely anonymous
- 🌍 **Works over the internet** — deployed server, not just localhost

---

## Planned Features

- ⏱️ Room expiry timer after inactivity
- 🔔 Toast notifications instead of alerts
- 👥 Show connected users count in room
- 📦 Chrome Web Store publishing
- 🎨 Polished UI redesign

---

## Author

Built by **Johan Costa** — learning by building 🚀

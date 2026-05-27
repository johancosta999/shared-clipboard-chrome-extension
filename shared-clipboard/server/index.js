const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log("Server running on port 8080");

const rooms = new Map();

wss.on("connection", (ws) => {
  console.log("New Client connected...");

  ws.on("message", (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage);

      if (data.type === "ping") return;

      if (data.type === "join" && data.room) {
        const roomCode = data.room;

        if (!rooms.has(roomCode)) {
          rooms.set(roomCode, new Set());
        }

        rooms.get(roomCode).add(ws);
        ws.roomCode = roomCode;
        console.log(`Client added to the room: ${roomCode}`);

        ws.send(JSON.stringify({ type: "joined", room: roomCode }));
      }

      else if (data.type === "clipboard" && data.text) {
        if (!ws.roomCode) return;
        const roomCode = ws.roomCode;
        if (roomCode && rooms.has(roomCode)) {
          for (const client of rooms.get(roomCode)) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "clipboard", text: data.text }));
            }
          }
          console.log(`Broadcasted clipboard text to room ${roomCode}`);
        }
      }

    } catch (err) {
      console.error("Invalid message format", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");

    for (const [roomCode, clients] of rooms.entries()) {
      if (clients.has(ws)) {
        clients.delete(ws);
        console.log(`Client removed from room ${roomCode}`);
        if (clients.size === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        }
      }
    }
  });
});
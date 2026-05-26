import WebSockets from "ws";

//creating the websocket server
const wss = new WebSocket.Server({ port: 8080 });

//log when the server starts
console.log("Server running on port 8080");

//track rooms
const rooms = new Map();

wss.on("connection", (ws) => {
  console.log("New Client connected...");

  //listen for the first message from the client
  ws.on("message", (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage);

      if (data.type === "join" && data.room) {
        const roomCode = data.room;

        //if room doest exist yet we gonna create a new room
        if (!rooms.has(roomCode)) {
          rooms.set(roomCode, new Set());
        }

        //Add this client to the room
        rooms.get(roomCode).add(ws);

        console.log(`Client added to the room: ${roomCode}`);

        ws.send(`You joined the room: ${roomCode}`);
      }
    } catch (err) {
      console.error("Invalid message format", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");

    //remove clients from any rooms they were in
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

const WebSocket = require("ws");

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
        ws.roomCode = roomCode; //store which room the client belongs to
        console.log(`Client added to the room: ${roomCode}`);

        ws.send(JSON.stringify({ type: "joined", room: roomCode }));
      }

      //handle clipboard messages 
      else if (data.type === "clipboard" && data.text){
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

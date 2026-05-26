import WebSockets from "ws";

//creating the websocket server
const wss = new WebSocket.Server({ port:8080});

//log when the server starts
console.log("Server running on port 8080");

wss.on('connection', (ws) =>{
    console.log("New client connected");

    //sending a welcome message
    ws.send("Welcome to the WebSocket Server!");

    ws.on('message', (message) =>{
        console.log(`Recieved: ${message}`);
        ws.send(`Echo: ${message}`);
    })

    //handle client disconnect
    ws.on('close', () =>{
        console.log("Client disconnected")
    });
});

//track rooms
const rooms = new Map();

//creatting a room with code room123
rooms.set("room123", new Set());

// Example: add a client to that room
function addClientToRoom(roomCode, client) {
  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, new Set());
  }
  rooms.get(roomCode).add(client);
}

// Example: remove a client from a room
function removeClientFromRoom(roomCode, client) {
  if (rooms.has(roomCode)) {
    rooms.get(roomCode).delete(client);
    // If room becomes empty, you could delete it
    if (rooms.get(roomCode).size === 0) {
      rooms.delete(roomCode);
    }
  }
}

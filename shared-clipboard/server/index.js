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


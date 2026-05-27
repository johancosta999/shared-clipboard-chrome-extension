/* global chrome */

let socket = null;
let currentRoom = null;

function connectToRoom(roomCode) {
  socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "join", room: roomCode }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "clipboard") {
      chrome.runtime.sendMessage({ type: "clipboard", text: data.text });
    }
  };

  socket.onclose = () => {
    socket = null;
    currentRoom = null;
  };

  currentRoom = roomCode;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "join") {
    connectToRoom(message.room);
  }

  if (message.type === "clipboard") {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "clipboard",
        room: currentRoom,
        text: message.text,
      }));
    }
  }

  if (message.type === "leave") {
    if (socket) socket.close();
  }
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

setInterval(() => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "ping" }));
  }
}, 25000);
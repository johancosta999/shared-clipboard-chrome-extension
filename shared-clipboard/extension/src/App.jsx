/* global chrome */

import { useEffect, useState } from "react";

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [receivedText, setReceivedText] = useState("");

  useEffect(() => {
    if (!chrome?.runtime) return;
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "clipboard") {
        setReceivedText(message.text);
      }
    });
  }, []);

  const connectToRoom = (code) => {
    chrome.runtime.sendMessage({ type: "join", room: code });
    setConnected(true);
    setStatus(`${code}`);
  };

  const joinRoom = () => {
    if (!roomCode.trim()) return;
    connectToRoom(roomCode);
  };

  const createRoom = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(newCode);
    connectToRoom(newCode);
  };

  const leaveRoom = () => {
    chrome.runtime.sendMessage({ type: "leave" });
    setRoomCode("");
    setConnected(false);
    setStatus("");
    setReceivedText("");
  };

  const copyText = async () => {
    if (!receivedText) return;
    await navigator.clipboard.writeText(receivedText);
    alert("Copied to clipboard!");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>CopyMate</h1>

      {connected ? (
        <div>
          <p>Joined room <b style={{ color: "green" }}>{status}</b> (Send this code to your friend to join.)</p>
          <div style={{ border: "1px solid gray", padding: "20px", minHeight: "100px", marginBottom: "20px" }}>
            {receivedText || "Waiting for clipboard..."}
          </div>
          <button onClick={copyText} style={{ marginRight: "10px" }}>Copy</button>
          <button onClick={leaveRoom}>Leave Room</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            style={{ padding: "10px", marginRight: "10px" }}
          />
          <button onClick={joinRoom} style={{ marginRight: "10px" }}>Join Room</button>
          <button onClick={createRoom}>Create Room</button>
        </div>
      )}
    </div>
  );
}

export default App;
import { useState } from "react";

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [receivedText, setReceivedText] = useState("");
  const [ws, setWs] = useState(null);

  const connectToRoom = (code) => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          room: code,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "joined") {
        setConnected(true);
        setStatus(`Joined room ${code}`);
      }

      if (data.type === "clipboard") {
        setReceivedText(data.text);
      }
    };

    socket.onerror = () => {
      setStatus("Connection error");
    };

    socket.onclose = () => {
      setConnected(false);
      setStatus("Disconnected");
    };

    setWs(socket);
  };

  const joinRoom = () => {
    if (!roomCode.trim()) return;

    connectToRoom(roomCode);
  };

  const createRoom = () => {
    const newCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    setRoomCode(newCode);

    connectToRoom(newCode);
  };

  const leaveRoom = () => {
    if (ws) {
      ws.close();
    }

    setRoomCode("");
    setConnected(false);
    setStatus("");
    setReceivedText("");
    setWs(null);
  };

  const copyText = async () => {
    if (!receivedText) return;

    await navigator.clipboard.writeText(receivedText);

    alert("Copied to clipboard!");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Clipboard Sync</h1>

      {connected ? (
        <div>
          <p>{status}</p>

          <div
            style={{
              border: "1px solid gray",
              padding: "20px",
              minHeight: "100px",
              marginBottom: "20px",
            }}
          >
            {receivedText || "Waiting for clipboard..."}
          </div>

          <button onClick={copyText} style={{ marginRight: "10px" }}>
            Copy
          </button>

          <button onClick={leaveRoom}>Leave Room</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            style={{
              padding: "10px",
              marginRight: "10px",
            }}
          />

          <button onClick={joinRoom} style={{ marginRight: "10px" }}>
            Join Room
          </button>

          <button onClick={createRoom}>Create Room</button>
        </div>
      )}
    </div>
  );
}

export default App;
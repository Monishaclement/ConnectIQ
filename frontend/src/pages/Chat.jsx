import { useEffect, useState } from "react";
import socket from "../socket";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const toUserId = "OTHER_USER_ID"; // later dynamic

  useEffect(() => {
    socket.connect();

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", {
      toUserId,
      message,
    });

    setMessages((prev) => [...prev, { message, fromMe: true }]);
    setMessage("");
  };

  return (
    <div>
      <h2>Chat</h2>

      <div>
        {messages.map((m, i) => (
          <p key={i}>
            {m.fromMe ? "You" : "Them"}: {m.message}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import Avatar from "../components/common/Avatar";
import EmojiPicker from "../components/chat/EmojiPicker";
import EmptyState from "../components/common/EmptyState";
import { getMessages, saveMessages } from "../utils/storage";
import { formatTime } from "../utils/formatters";
import "../styles/pages/Chat.css";

export default function Chat() {
  const { user } = useAuth();
  const { connections, sendMessage, isOnline, typingUsers, emitTyping, emitStopTyping, socket } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeChat, setActiveChat] = useState(searchParams.get("user") || null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const chatPartners = connections.accepted.map((c) => c.userId);

  useEffect(() => {
    if (activeChat) {
      setMessages(getMessages(user._id, activeChat));
    }
  }, [activeChat, user._id]);

  useEffect(() => {
    const handler = ({ fromUserId, message: msg }) => {
      if (fromUserId === activeChat) {
        const updated = [
          ...getMessages(user._id, activeChat),
          { text: msg, fromMe: false, timestamp: new Date().toISOString() },
        ];
        saveMessages(user._id, activeChat, updated);
        setMessages(updated);
      } else {
        const existing = getMessages(user._id, fromUserId);
        saveMessages(user._id, fromUserId, [
          ...existing,
          { text: msg, fromMe: false, timestamp: new Date().toISOString() },
        ]);
      }
    };
    socket.on("receive_message", handler);
    return () => socket.off("receive_message", handler);
  }, [activeChat, user._id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectChat = (partnerId) => {
    setActiveChat(partnerId);
    setSearchParams({ user: partnerId });
    setMessages(getMessages(user._id, partnerId));
  };

  const handleSend = () => {
    if (!message.trim() || !activeChat) return;
    const newMsg = { text: message, fromMe: true, timestamp: new Date().toISOString() };
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(user._id, activeChat, updated);
    sendMessage(activeChat, message);
    setMessage("");
    emitStopTyping(activeChat);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (activeChat) {
      emitTyping(activeChat);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => emitStopTyping(activeChat), 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-page animate-fade-in">
      <div className="chat-sidebar card">
        <h2>Messages</h2>
        {chatPartners.length === 0 ? (
          <p className="chat-empty-list">Connect with people to start chatting</p>
        ) : (
          chatPartners.map((partnerId) => {
            const msgs = getMessages(user._id, partnerId);
            const last = msgs[msgs.length - 1];
            return (
              <button
                key={partnerId}
                className={`chat-list-item ${activeChat === partnerId ? "active" : ""}`}
                onClick={() => selectChat(partnerId)}
              >
                <Avatar name="User" size="md" online={isOnline(partnerId)} />
                <div className="chat-list-info">
                  <strong>User {partnerId.slice(-4)}</strong>
                  <span>{last ? last.text.slice(0, 30) : "No messages yet"}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="chat-main card">
        {!activeChat ? (
          <EmptyState icon="💬" title="Select a conversation" description="Choose a connection to start messaging" />
        ) : (
          <>
            <div className="chat-header">
              <Avatar name="User" size="md" online={isOnline(activeChat)} />
              <div>
                <strong>User {activeChat.slice(-4)}</strong>
                <span>{isOnline(activeChat) ? "Online" : "Offline"}</span>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.fromMe ? "sent" : "received"}`}>
                  <p>{m.text}</p>
                  <span className="chat-time">{formatTime(m.timestamp)}</span>
                </div>
              ))}
              {typingUsers[activeChat] ? (
                <div className="chat-typing">Typing...</div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-bar">
              <EmojiPicker onSelect={(emoji) => setMessage((prev) => prev + emoji)} />
              <input
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
              />
              <button className="chat-send-btn" onClick={handleSend} disabled={!message.trim()}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

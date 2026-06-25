import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import socket from "../socket";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    console.log("USER ID:", userId);

    if (!userId) {
      console.log("No userId found — user is not logged in");
      return;
    }

    fetchRecommendations();

    console.log("Connecting socket...");

    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("user_connected", userId);
      console.log("Sent user_connected event:", userId);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err.message);
    });

    socket.on("receive_request", (data) => {
      console.log("Request received:", data);
      alert("New request from " + data.fromUserId);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receive_request");
      socket.disconnect();
    };
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await API.get("/recommendations");
      setUsers(res.data || []);
    } catch (err) {
      console.log("Recommendation error:", err.response?.data);
      setUsers([]);
    }
  };

  const sendRequest = (toUserId) => {
    const fromUserId = localStorage.getItem("userId");

    if (!fromUserId || !toUserId) {
      console.log("Missing user IDs");
      return;
    }

    socket.emit("send_request", {
      fromUserId,
      toUserId,
    });

    console.log("Request sent:", { fromUserId, toUserId });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>People You May Know</h2>

      {(users || []).length === 0 ? (
        <p>No recommendations found</p>
      ) : (
        users.map((u, index) => (
          <div
            key={u?.user?._id || index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <b>{u?.user?.name || "Unknown User"}</b>
            </p>

            <p>Score: {u?.score ?? 0}</p>

            <button onClick={() => sendRequest(u?.user?._id)}>
              Connect
            </button>
          </div>
        ))
      )}

      <hr />

      <button onClick={() => navigate("/chat")}>
        Go to Chat
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        style={{ marginLeft: "10px" }}
      >
        Logout
      </button>
    </div>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get("http://localhost:8000/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    } catch (error) {
      alert("Failed to fetch boards");
    }
  };

  const createBoard = async () => {
    await axios.post(
      "http://localhost:8000/boards",
      { title: newBoardTitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewBoardTitle("");
    fetchBoards(); // Refresh list
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Projects</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="New Board Title"
        />
        <button onClick={createBoard}>Create</button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              width: "150px",
              cursor: "pointer",
              background: "#f0f0f0",
            }}
          >
            <h3>{board.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

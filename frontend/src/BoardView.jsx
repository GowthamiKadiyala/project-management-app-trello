import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import Analytics from "./Analytics"; // Import the Chart component

function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [newColTitle, setNewColTitle] = useState("");
  const [newTaskContent, setNewTaskContent] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(false);
  const token = localStorage.getItem("token");

  const socket = useRef(null);

  // --- MOVED UP: Define this BEFORE useEffect ---
  const fetchBoardData = async () => {
    try {
      const res = await axios.get(
        "https://project-management-app-trello-backend.onrender.com/boards",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const currentBoard = res.data.find((b) => b.id === parseInt(boardId));

      if (currentBoard) {
        currentBoard.columns.sort((a, b) => a.position - b.position);
        currentBoard.columns.forEach((col) => {
          col.tasks.sort((a, b) => a.position - b.position);
        });
        setBoard(currentBoard);
      }
    } catch (e) {
      console.error("Error loading board");
    }
  };
  // ---------------------------------------------

  useEffect(() => {
    fetchBoardData();

    // Setup WebSocket
    socket.current = new WebSocket(`ws://localhost:8000/ws/${boardId}`);

    socket.current.onopen = () => console.log("Connected to Real-Time Server");

    socket.current.onmessage = (event) => {
      if (event.data === "REFRESH_BOARD") {
        console.log("Update received! Refreshing board...");
        fetchBoardData();
      }
    };

    return () => {
      if (socket.current) socket.current.close();
    };
  }, [boardId]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newColumnId = over.data.current?.sortable?.containerId || over.id;

    try {
      await axios.put(
        `https://project-management-app-trello-backend.onrender.com/tasks/${taskId}/move`,
        { column_id: parseInt(newColumnId), position: 1.0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBoardData();
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send("UPDATE");
      }
    } catch (e) {
      console.error("Move failed", e);
    }
  };

  const addColumn = async () => {
    await axios.post(
      "https://project-management-app-trello-backend.onrender.com/columns",
      {
        title: newColTitle,
        position: board.columns.length + 1,
        board_id: parseInt(boardId),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewColTitle("");
    fetchBoardData();
    if (socket.current) socket.current.send("UPDATE");
  };

  const addTask = async (colId) => {
    await axios.post(
      "https://project-management-app-trello-backend.onrender.com/tasks",
      { content: newTaskContent[colId], position: 1.0, column_id: colId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewTaskContent({ ...newTaskContent, [colId]: "" });
    fetchBoardData();
    if (socket.current) socket.current.send("UPDATE");
  };

  if (!board) return <div>Loading...</div>;

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div
        style={{
          padding: "20px",
          background: "#0079bf",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <h1>{board.title}</h1>

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <input
            value={newColTitle}
            onChange={(e) => setNewColTitle(e.target.value)}
            placeholder="New Column..."
          />
          <button onClick={addColumn}>Add List</button>
          <button
            onClick={() => setShowAnalytics(true)}
            style={{
              background: "#61bd4f",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            📊 View Analytics
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            overflowX: "auto",
          }}
        >
          {board.columns.map((col) => (
            <SortableContext
              key={col.id}
              id={col.id}
              items={col.tasks}
              strategy={verticalListSortingStrategy}
            >
              <div
                style={{
                  background: "#ebecf0",
                  padding: "10px",
                  width: "280px",
                  borderRadius: "5px",
                  color: "black",
                }}
              >
                <h4>{col.title}</h4>
                <div style={{ minHeight: "50px" }}>
                  {col.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <input
                    value={newTaskContent[col.id] || ""}
                    onChange={(e) =>
                      setNewTaskContent({
                        ...newTaskContent,
                        [col.id]: e.target.value,
                      })
                    }
                    placeholder="Add card..."
                    style={{ width: "80%" }}
                  />
                  <button onClick={() => addTask(col.id)}>+</button>
                </div>
              </div>
            </SortableContext>
          ))}
        </div>

        {showAnalytics && (
          <Analytics
            boardId={boardId}
            onClose={() => setShowAnalytics(false)}
          />
        )}
      </div>
    </DndContext>
  );
}

export default BoardView;

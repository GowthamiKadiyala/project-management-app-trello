import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";

// Register ChartJS components so React can draw them
ChartJS.register(ArcElement, Tooltip, Legend);

function Analytics({ boardId, onClose }) {
  const [chartData, setChartData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/boards/${boardId}/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const apiStats = res.data; // Example: { "To Do": 2, "Done": 5 }

        setChartData({
          labels: Object.keys(apiStats), // ["To Do", "Done"]
          datasets: [
            {
              label: "# of Tasks",
              data: Object.values(apiStats), // [2, 5]
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)", // Red
                "rgba(54, 162, 235, 0.2)", // Blue
                "rgba(255, 206, 86, 0.2)", // Yellow
                "rgba(75, 192, 192, 0.2)", // Green
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (e) {
        console.error("Failed to load analytics");
      }
    };

    fetchData();
  }, [boardId]);

  if (!chartData)
    return (
      <div style={{ background: "white", padding: 20 }}>Loading Charts...</div>
    );

  // The Popup Modal Style
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "30px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    zIndex: 1000,
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "400px",
    height: "450px",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={{
            alignSelf: "flex-end",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <h2>Project Progress</h2>
        <div
          style={{
            width: "300px",
            height: "300px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pie data={chartData} />
        </div>
      </div>
    </>
  );
}

export default Analytics;

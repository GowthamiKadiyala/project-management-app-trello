import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import BoardView from "./BoardView";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(
        "https://project-management-app-trello-backend.onrender.com/register",
        { email, password }
      );
      alert("Registered! Now Click Login.");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://project-management-app-trello-backend.onrender.com/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard"); // Go to dashboard after login
    } catch (e) {
      alert("Login Failed");
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Project Management App</h1>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <br />
      <br />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin} style={{ marginLeft: "10px" }}>
        Login
      </button>
    </div>
  );
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/board/:boardId" element={<BoardView />} />
    </Routes>
  );
}

export default App;

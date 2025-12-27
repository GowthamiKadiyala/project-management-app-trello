# 📋 SyncBoard: Real-Time Kanban Task Manager

**SyncBoard** is a full-stack, enterprise-grade task management platform inspired by Trello. It enables teams to collaborate in real-time using boards, lists, and tasks, featuring sub-millisecond updates across connected clients via WebSockets.

![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Full_Stack-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-orange?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

---

## 🏗️ System Architecture

ß
The application follows a decoupled **Client-Server architecture** designed for scalability and low latency.

```mermaid
graph TD
    Client[React Client (Vite)] -->|HTTP REST| API[FastAPI Backend]
    Client -->|WebSocket (ws://)| SocketMgr[Connection Manager]
    API -->|Read/Write| DB[(PostgreSQL Docker)]
    SocketMgr -->|Broadcast Updates| Client2[Other Clients]
    SocketMgr -->|Broadcast Updates| Client3[Other Clients]
Core ComponentsFrontend (SPA): React 18 with optimistic UI updates. Uses @dnd-kit for complex drag-and-drop collision detection.Backend (API): FastAPI (Async Python) serving REST endpoints and managing WebSocket connections.Real-Time Engine: A custom ConnectionManager class that tracks active board sessions and broadcasts events (PUB/SUB pattern).Data Layer: PostgreSQL containerized via Docker, utilizing SQLAlchemy ORM for relational integrity.🛠️ Tech StackBackend (/backend)Framework: FastAPI (Python 3.10+)Database: PostgreSQL 15ORM: SQLAlchemyValidation: Pydantic v2Authentication: OAuth2 with Password Flow (JWT)Real-time: Native WebSocketsContainerization: Docker & Docker ComposeFrontend (/frontend)Framework: React 18 + ViteLanguage: JavaScript (ES6+)State Management: React Hooks (useRef, useState, useEffect)Drag & Drop: @dnd-kit/core, @dnd-kit/sortableHTTP Client: AxiosData Visualization: Chart.js (react-chartjs-2)✨ Key Features🔐 Secure Authentication: JWT-based login and registration system with password hashing (bcrypt).⚡ Real-Time Collaboration: Instant updates. When User A moves a card, User B sees it move without refreshing.🖱️ Drag-and-Drop Interface: Smooth, accessible drag-and-drop for tasks using modern pointer events.📊 Analytics Dashboard: Built-in data visualization to track task status distribution (To Do vs. Done).📱 Responsive Design: Works on desktop and tablet viewports.🚀 Getting StartedPrerequisitesDocker Desktop (for the database)Node.js v18+ (for the frontend)Python 3.10+ (for the backend)Method 1: The Docker Way (Recommended)Start the Database:Bashdocker-compose up -d
Note: The database runs on port 5433 to prevent conflicts with local Postgres instances.Run the Backend:Bashcd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
Run the Frontend:Bashcd frontend
npm install
npm run dev
Method 2: Manual Configuration (No Docker)If you prefer using a local Postgres installation:Create a database named trellodb.Update backend/app/database.py:PythonSQLALCHEMY_DATABASE_URL = "postgresql://your_user:your_password@localhost:5432/trellodb"
📡 API DocumentationOnce the backend is running, full interactive documentation (Swagger UI) is available at:👉 http://localhost:8000/docsMethodEndpointDescriptionPOST/loginAuthenticates user & returns JWT TokenGET/boardsFetches all boards for the authenticated userPOST/columnsCreates a new list in a boardPOST/tasksCreates a new taskPUT/tasks/{id}/moveUpdates task position & column (triggers WebSocket)WS/ws/{board_id}WebSocket connection endpoint
```

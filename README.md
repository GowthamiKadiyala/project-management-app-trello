# SyncBoard (Trello Clone)

A full-stack project management application featuring a Kanban-style interface for organizing tasks, lists, and boards. Built with a decoupled architecture using **React** (Frontend) and **FastAPI** (Backend), containerized with **Docker**, and deployed on **Render**.

![Project Status](https://img.shields.io/badge/status-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Live Demo
**Frontend:** [https://project-management-app-trello-frontend.onrender.com](https://project-management-app-trello-frontend.onrender.com)  
**Backend API:** [https://project-management-app-trello-backend.onrender.com/docs](https://project-management-app-trello-backend.onrender.com/docs) (Swagger UI)

---

## 🛠 Tech Stack

### **Frontend**
* **React (Vite):** Selected for high performance and fast build times.
* **Axios:** Handles HTTP requests with interceptors for JWT authentication.
* **TailwindCSS:** Responsive design for the Kanban board layout.
* **Drag & Drop API:** Custom implementation for moving tasks between columns.

### **Backend**
* **FastAPI (Python):** Chosen for its asynchronous capabilities and automatic validation via Pydantic schemas.
* **SQLAlchemy ORM:** Manages database interactions and relationships.
* **PostgreSQL:** Relational database ensuring data integrity with foreign keys and cascading deletes.
* **JWT (JSON Web Tokens):** Stateless authentication mechanism for secure user sessions.

### **DevOps & Infrastructure**
* **Docker:** Used for containerizing the backend service to ensure environment consistency.
* **Render:** Cloud platform used for hosting both the static frontend and the web service backend.
* **CORS Configuration:** Securely whitelisted production domains to prevent unauthorized API access.

---

## ✨ Key Features

* **User Authentication:** Secure Registration and Login using hashed passwords (Bcrypt) and JWT access tokens.
* **Kanban Board:** Create, Read, Update, and Delete (CRUD) support for Boards, Columns, and Tasks.
* **Drag and Drop:** Intuitive UI for moving tasks between different stages (e.g., "To Do" -> "Done").
* **Data Persistence:** Robust PostgreSQL schema with relationships (One-to-Many) between Users, Boards, and Tasks.
* **Responsive Design:** Optimized for various screen sizes.

---

## 🏗 Architecture & Challenges Solved

### **1. The N+1 Problem**
* **Challenge:** Initial implementation fired separate database queries for every column and task, causing performance bottlenecks.
* **Solution:** Implemented **SQLAlchemy Eager Loading** (`joinedload`) to fetch Boards, Columns, and Tasks in a single optimized SQL query.

### **2. Deployment & CORS**
* **Challenge:** The production frontend was blocked from accessing the backend API due to browser security policies.
* **Solution:** Configured **CORS Middleware** in FastAPI to explicitly whitelist the Render frontend URL while blocking unauthorized origins.

### **3. SPA Routing**
* **Challenge:** Refreshing the page on sub-routes (e.g., `/dashboard`) caused 404 errors on the static server.
* **Solution:** Implemented a **Rewrite Rule** on Render to redirect all traffic to `index.html`, allowing React Router to handle client-side navigation correctly.

---

## ⚙️ Local Setup Guide

Follow these steps to run the project locally on your machine.

### **Prerequisites**
* Node.js & npm
* Python 3.10+
* PostgreSQL (Local instance or Cloud URL)

### **1. Clone the Repository**
```bash
git clone [https://github.com/YourUsername/project-management-app-trello.git](https://github.com/YourUsername/project-management-app-trello.git)
cd project-management-app-trello


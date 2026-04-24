# ⚡ DevBoard - AI-Powered Developer Task Manager

A full-stack MERN application that helps developers manage tasks using a Kanban board with AI-powered subtask generation.

## 🚀 Live Demo
- **Frontend: https://devboard-kohl.vercel.app/
- **Backend: https://devboard-backend-dmrg.onrender.com

## ✨ Features

- 🔐 **JWT Authentication** — Secure register and login
- 📋 **Kanban Board** — Drag tasks across Todo, In Progress, and Done columns
- 🤖 **AI Subtask Generation** — Paste a task description and let AI break it into actionable subtasks using Groq (Llama 3.3)
- ✅ **Subtask Completion** — Toggle individual subtasks with a progress bar
- 🎯 **Priority Levels** — Tag tasks as High, Medium, or Low priority
- 📊 **Dashboard Stats** — Live counts for total, in-progress, completed, and high priority tasks
- ✏️ **Edit & Delete** — Full CRUD on all tasks

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- React Router DOM
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

### AI
- Groq API (Llama 3.3 70B)

## 📁 Project Structure

```
devboard/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── KanbanBoard.js
│   │   │   ├── TaskCard.js
│   │   │   └── TaskModal.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── pages/
│   │       ├── Dashboard.js
│   │       ├── Login.js
│   │       └── Register.js
└── server/          # Express backend
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── Task.js
    │   └── User.js
    ├── routes/
    │   ├── auth.js
    │   └── tasks.js
    └── index.js
```

## ⚙️ Local Setup

### Prerequisites
- Node.js
- MongoDB
- Groq API Key — [Get one free at console.groq.com](https://console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/JxTIN21/devboard.git
cd devboard
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/devboard
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

```bash
node index.js
```

### 3. Setup Frontend
```bash
cd client
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GROQ_API_KEY` | Your Groq API key |
| `CLIENT_URL` | Frontend URL for CORS (production) |

## 👨‍💻 Author
**Jatin Srivastava**
- GitHub: [@JxTIN21](https://github.com/JxTIN21)
- LinkedIn: [Jatin Srivastava](https://linkedin.com/in/jatin-srivastava-784223253)
- Portfolio: [Portfolio](https://unrivaled-frangollo-12da7c.netlify.app/)

## 📄 License
MIT
<p align="center">
  <h1 align="center">🤖 RepoRover</h1>
  <p align="center">
    <strong>Elite AI-Powered Codebase Auditor & Intelligence Platform</strong>
  </p>
  <p align="center">
    <a href="http://65.1.64.63">Live Demo (AWS)</a> · 
    <a href="#-key-features">Features</a> · 
    <a href="#-getting-started">Installation</a> · 
    <a href="#-docker-deployment">Docker</a> · 
    <a href="#-aws-ec2-deployment">AWS Deployment</a>
  </p>
</p>

---

**RepoRover** is a sophisticated developer tool designed to bridge the gap between complex codebases and developer understanding. By leveraging advanced **Retrieval-Augmented Generation (RAG)**, it allows users to chat with any public GitHub repository, ask technical questions, identify bugs, and receive senior-level architectural reviews instantly — without cloning a single file locally.

---

## 🚀 Key Features

### 🔍 Intelligent Deep Ingestion
Automatically traverses GitHub repositories to fetch and process source code. Features a robust **3-tier filtering system** that actively blocks noise (binary files, images, SVGs, lock files, and build wrappers) ensuring the vector database is populated only with meaningful logic.

### 🧠 Context-Aware RAG Pipeline
Powered by **Google Gemini** embeddings and a **Pinecone Vector Database**. The AI receives not just specific code chunks, but the **entire file tree structure** injected directly into its prompt, giving it complete architectural awareness of the project.

### ⚡ Server-Sent Events (SSE) Streaming
Experience ultra-fast, native-feeling AI responses. Answers are streamed to the client **character-by-character** using the fetch API and SSE, eliminating long waiting screens.

### 📡 Real-Time WebSocket Feedback
Utilizes **Socket.io** to stream live ingestion logs. Watch in real-time as the server fetches directory structures, downloads files, and embeds vectors into Pinecone.

### 🛡️ Elite Senior Engineer Persona
Specialized prompt engineering forces the AI to act as an elite senior developer. It provides deep architectural breakdowns, detects vulnerabilities, suggests optimizations, and includes actual code snippets in its explanations.

### 📎 File-Targeted Queries (`@filename`)
Use the `@filename` syntax (e.g., `@chatController.js explain this`) to focus the AI's attention on a specific file, bypassing general vector search for laser-precise answers.

### 💾 Persistent Chat Sessions
Secure user authentication (JWT) and persistent chat history powered by MongoDB. Pick up where you left off on any repository at any time.

### 📤 Export Chat History
Export your entire conversation as a clean Markdown file for documentation, code reviews, or sharing with your team.

---

## 🛠 Tech Stack

| Domain | Technology | Purpose |
|--------|-----------|---------|
| **Frontend** | React.js (Vite) | Lightning-fast modern UI |
| **Styling** | Tailwind CSS | Sleek, dark-mode, glassmorphic design |
| **Backend** | Node.js + Express | Highly scalable REST & SSE server |
| **Database** | MongoDB | Persistent user and chat history storage |
| **Vector DB** | Pinecone | High-dimensional semantic code search |
| **AI Engine** | Google Gemini 2.5 | Code reasoning, embeddings, and generation |
| **Real-Time** | Socket.io | Live bidirectional ingestion logging |
| **Reverse Proxy** | Nginx | Routes frontend and API traffic in production |
| **Containerization** | Docker & Docker Compose | One-command full-stack deployment |
| **Cloud** | AWS EC2 | Production hosting on dedicated infrastructure |

---

## 🏗️ Architecture Workflow

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React.js   │────▶│  Node.js/Express │────▶│  GitHub API     │
│   Frontend   │◀────│  Backend Server  │◀────│  (Repo Fetcher) │
└──────────────┘     └──────────────────┘     └─────────────────┘
      │  ▲                │       │
      │  │ SSE            │       │
      │  │ Streaming      ▼       ▼
      │  │          ┌──────────┐ ┌──────────────┐
      │  └──────────│  Gemini  │ │   Pinecone   │
      │             │  AI API  │ │  Vector DB   │
      │             └──────────┘ └──────────────┘
      │
      ▼ Socket.io
┌──────────────┐
│  Live Logs   │
│  (Real-Time) │
└──────────────┘
```

1. **Submission** — User submits a GitHub URL on the frontend.
2. **Deep Fetching** — Node server traverses the GitHub API, applying strict 3-tier noise filters (skipping `.svg`, `node_modules`, `mvnw`, lock files, etc.).
3. **Embedding** — Valid source code is chunked and embedded via Gemini, then stored in Pinecone with file extension metadata.
4. **Context Assembly** — When a question is asked, the server retrieves the top 15 semantic chunks **and** the full repository file tree.
5. **Streaming Output** — The Gemini LLM generates a context-aware answer, streamed back to the user via **Server-Sent Events (SSE)**.

---

## ⚡ Getting Started

### 🔧 Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Pinecone API Key
- Google Gemini API Key
- GitHub Personal Access Token (for increased rate limits)

---

### 📌 1. Clone the Repository

```bash
git clone https://github.com/AashutoshDubey619/RepoRoverAWS.git
cd RepoRoverAWS
```

---

### 📌 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/reporover_db
GEMINI_API_KEY=your_gemini_key_here
PINECONE_API_KEY=your_pinecone_key_here
GITHUB_TOKEN=your_github_personal_access_token
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

---

### 📌 3. Frontend Setup

Open a new terminal, navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the React application:

```bash
npm run dev
```

---

### 📌 4. Access the App

Open your browser and navigate to `http://localhost:5173`. Create an account and start auditing codebases!

---

## 🐳 Docker Deployment

The entire stack can be deployed with a single command using Docker Compose.

### Prerequisites
- Docker & Docker Compose installed

### Steps

1. Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_key
PINECONE_API_KEY=your_pinecone_key
GITHUB_TOKEN=your_github_token
JWT_SECRET=your_jwt_secret
```

2. Build and launch:

```bash
docker-compose up --build -d
```

3. Access the app at `http://localhost`

The Docker setup includes:
- **Frontend container** — React build served via Nginx (port 80)
- **Backend container** — Node.js Express server (port 5000, internal)
- **Nginx reverse proxy** — Routes `/api/*` and `/socket.io/*` to the backend, serves static frontend assets, and supports SSE streaming with buffering disabled

```bash
# Useful commands
docker ps                          # Check running containers
docker-compose logs -f backend     # View backend logs
docker-compose down                # Stop everything
docker-compose up --build -d       # Rebuild after code changes
```

---

## ☁️ AWS EC2 Deployment

RepoRover is deployed on a dedicated **AWS EC2 t3.micro** instance running Ubuntu, fully containerized with Docker.

### Deployment Steps

1. Launch an EC2 instance (Ubuntu, t3.micro or higher)
2. Open ports **22** (SSH), **80** (HTTP), and **443** (HTTPS) in the Security Group
3. SSH into the instance:

```bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

4. Install Docker:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
```

5. Clone, configure, and launch:

```bash
git clone https://github.com/AashutoshDubey619/RepoRoverAWS.git
cd RepoRoverAWS
nano .env          # Add your environment variables
docker-compose up --build -d
```

6. Access the app at `http://your-ec2-public-ip`

---

## 📁 Project Structure

```
RepoRoverAWS/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Chat/           # ChatInput, ChatMessage, RepoInput, IngestionLogs
│   │   │   ├── Sidebar.jsx     # Chat history sidebar
│   │   │   └── Logo.jsx        # Brand logo component
│   │   ├── pages/              # Route pages
│   │   │   ├── ChatInterface.jsx   # Main chat UI with SSE streaming
│   │   │   ├── Landing.jsx     # Landing page
│   │   │   ├── Login.jsx       # Authentication
│   │   │   └── Signup.jsx      # User registration
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.js      # Auth state management
│   │   │   └── useSocket.js    # Socket.io connection lifecycle
│   │   └── utils/
│   │       └── api.js          # Axios instance with auth interceptor
│   └── vite.config.js
│
├── server/                     # Node.js Backend
│   ├── controllers/
│   │   ├── chatController.js   # RAG pipeline + SSE streaming
│   │   ├── authController.js   # JWT auth logic
│   │   └── ingestController.js # Repository ingestion orchestrator
│   ├── services/
│   │   ├── aiService.js        # Gemini model initialization
│   │   └── githubService.js    # 3-tier filtered GitHub fetcher
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   └── rateLimit.js        # API rate limiting
│   ├── models/
│   │   ├── ChatHistory.js      # Chat + file list schema
│   │   └── User.js             # User schema
│   ├── vectorStore.js          # Pinecone embedding + query logic
│   └── index.js                # Express + Socket.io server entry
│
├── Dockerfile.client           # Multi-stage React build + Nginx
├── Dockerfile.server           # Node.js production container
├── docker-compose.yml          # Full-stack orchestration
├── nginx.conf                  # Reverse proxy config (API + WebSocket + SSE)
└── README.md
```

---

<p align="center">
  Built with ❤️ for developers who want to understand code faster.
</p>

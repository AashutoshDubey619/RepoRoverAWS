<div align="center">
  <img src="https://img.shields.io/badge/RepoRover-AI_Code_Auditor-8B5CF6?style=for-the-badge&logo=github&logoColor=white" alt="RepoRover Logo"/>
  <h1>🤖 RepoRover</h1>
  <p><strong>Elite AI-Powered Codebase Auditor & Intelligence Platform</strong></p>
  <p>
    <a href="https://repo-rover-akd.vercel.app/">Live Demo</a>
    ·
    <a href="#-key-features">Features</a>
    ·
    <a href="#-getting-started">Installation</a>
  </p>
</div>

---

RepoRover is a sophisticated developer tool designed to bridge the gap between complex codebases and developer understanding. By leveraging advanced **Retrieval-Augmented Generation (RAG)**, it allows users to _chat_ with any public GitHub repository, ask technical questions, identify bugs, and receive senior-level architectural reviews instantly — **without cloning a single file locally.**


---

## 🚀 Key Features

- 🔍 **Intelligent Deep Ingestion**  
  Automatically traverses GitHub repositories to fetch and process source code. Features a robust **3-tier filtering system** that actively blocks noise (binary files, images, SVGs, lock files, and build wrappers) ensuring the vector database is populated *only* with meaningful logic.

- 🧠 **Context-Aware RAG Pipeline**  
  Powered by **Google Gemini** embeddings and a **Pinecone Vector Database**. The AI receives not just specific code chunks, but the *entire file tree structure* injected directly into its prompt, giving it complete architectural awareness of the project.

- ⚡ **Server-Sent Events (SSE) Streaming**  
  Experience ultra-fast, native-feeling AI responses. Answers are streamed to the client character-by-character using the `fetch` API and SSE, eliminating long waiting screens.

- 📡 **Real-Time WebSocket Feedback**  
  Utilizes **Socket.io** to stream live ingestion logs. Watch in real-time as the server fetches directory structures, downloads files, and embeds vectors into Pinecone.

- 🛡️ **Elite Senior Engineer Persona**  
  Specialized prompt engineering forces the AI to act as an elite senior developer. It provides deep architectural breakdowns, detects vulnerabilities, suggests optimizations, and refuses to be confused by conversational small talk.

- 💾 **Persistent Chat Sessions**  
  Secure user authentication (JWT) and persistent chat history powered by **MongoDB**. Pick up where you left off on any repository at any time.

---

## 🛠 Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js (Vite) | Lightning-fast modern UI |
| **Styling** | Tailwind CSS | Sleek, dark-mode, glassmorphic design |
| **Backend** | Node.js + Express | Highly scalable REST & SSE server |
| **Database** | MongoDB | Persistent user and chat history storage |
| **Vector DB** | Pinecone | High-dimensional semantic code search |
| **AI Engine** | Google Gemini | Code reasoning, embeddings, and generation |
| **Real-Time** | Socket.io | Live bidirectional ingestion logging |

---

## 🏗️ Architecture Workflow

1. **Submission**: User submits a GitHub URL on the frontend.
2. **Deep Fetching**: Node server traverses the GitHub API, applying strict noise filters (skipping `.svg`, `node_modules`, `mvnw`, etc.).
3. **Embedding**: Valid source code is chunked and embedded via Gemini, then stored in Pinecone with file extension metadata.
4. **Context Assembly**: When a question is asked, the server retrieves the top 15 semantic chunks *and* the full repository file tree.
5. **Streaming Output**: The Gemini LLM generates a context-aware answer based on the code and tree, streamed back to the user via Server-Sent Events (SSE).

---

## ⚡ Getting Started

### 🔧 Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Pinecone API Key
- Google Gemini API Key
- GitHub Personal Access Token (for increased rate limits)

### 📌 1. Clone the Repository
```bash
git clone https://github.com/your-username/RepoRover.git
cd RepoRover
```

### 📌 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
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

### 📌 3. Frontend Setup
Open a new terminal, navigate to the client directory:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the React application:
```bash
npm run dev
```

### 📌 4. Access the App
Open your browser and navigate to `http://localhost:5173`. Create an account and start auditing elite codebases!

---

<div align="center">
  <p>Built with ❤️ for developers who want to understand code faster.</p>
</div>

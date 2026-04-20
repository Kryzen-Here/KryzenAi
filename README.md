# ⚔ KRYZEN AI
> *Precision in the darkness. Excellence in the void.*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Groq](https://img.shields.io/badge/Groq-LLaMA3--70B-FF0000?style=flat)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-red?style=flat)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
- [API Reference](#-api-reference)
- [Customization](#-customization)
- [Deployment](#-deployment)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🌑 Overview

KRYZEN AI is a modular, full-stack AI chatbot application powered by the Groq API
using the LLaMA3-70B-8192 model. It features a dark gothic aesthetic with neon red
accents, real-time streaming responses, syntax-highlighted code blocks, and a custom
animated UI built with React, Vite, Tailwind CSS, and Framer Motion.

The backend acts as a secure API gateway so your Groq API key never touches the
browser. Everything is modular so you can swap keys, models, backends, or styles
without rewriting the codebase.

---

## ✨ Features

- ⚡  Real-time streaming responses via Server-Sent Events SSE
- 🎨  Full dark and red gothic visual identity with the Kryzen Aesthetic
- 🩸  Persistent neon red dripping blood animation at the top
- ⚔   Rotating scythe loader with red trail effect while thinking
- 💬  Markdown rendering with GitHub Flavored Markdown GFM support
- 🖥   Syntax-highlighted code blocks with a custom red and dark theme
- 📋  One-click copy for messages and code blocks
- 🔁  Retry failed requests with a single button
- ⛔  Stop streaming mid-response at any time
- 📱  Fully responsive on mobile, tablet, and desktop
- 🔒  Rate limiting and input validation enforced on the backend
- 🧩  Fully modular so you can swap API keys, models, or URLs via .env files

---

## 🛠 Tech Stack

Frontend

    Technology          Version       Purpose
    React               18.3.x        UI Framework
    Vite                5.3.x         Build Tool and Dev Server
    Tailwind CSS        3.4.x         Utility-First Styling
    Framer Motion       11.3.x        Animations and Transitions
    React Markdown      9.0.x         Markdown Rendering
    Remark GFM          4.0.x         GitHub Flavored Markdown
    React Syntax HL     15.5.x        Code Syntax Highlighting
    Lucide React        0.412.x       Icon Library

Backend

    Technology          Version       Purpose
    Node.js             18+           Runtime Environment
    Express             4.19.x        Web Framework
    Groq SDK            0.7.x         Groq API Client
    dotenv              16.4.x        Environment Variable Loader
    CORS                2.8.x         Cross-Origin Resource Sharing
    Helmet              7.1.x         HTTP Security Headers
    Express Rate Limit  7.3.x         API Rate Limiting

---

## 📁 Project Structure

    kryzen-ai/
    │
    ├── backend/
    │   ├── server.js                   Main Express server and Groq API logic
    │   ├── package.json                Backend dependencies
    │   └── .env                        API key and server config never commit this
    │
    ├── frontend/
    │   ├── public/
    │   │   └── favicon.ico
    │   │
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── ChatInterface.jsx   Main chat window component
    │   │   │   ├── MessageBubble.jsx   Individual message renderer
    │   │   │   ├── ScytheLoader.jsx    Thinking and loading animation
    │   │   │   ├── DrippingAnimation.jsx  Blood drip CSS animation
    │   │   │   └── CodeBlock.jsx       Syntax highlighted code renderer
    │   │   │
    │   │   ├── hooks/
    │   │   │   └── useChat.js          Chat state and streaming logic
    │   │   │
    │   │   ├── utils/
    │   │   │   └── streamParser.js     SSE stream parsing utilities
    │   │   │
    │   │   ├── App.jsx                 Root component and boot screen
    │   │   ├── main.jsx                React DOM entry point
    │   │   └── GoreStyles.css          All custom animations and styles
    │   │
    │   ├── index.html                  HTML entry point
    │   ├── vite.config.js              Vite and proxy configuration
    │   ├── tailwind.config.js          Tailwind theme extension
    │   ├── package.json                Frontend dependencies
    │   └── .env                        Frontend environment variables
    │
    └── README.md                       You are here

---

## ✅ Prerequisites

Make sure you have the following installed before starting.

    Node.js v18 or higher
    Download at https://nodejs.org/en/download
    Verify by running   node --version
    Expected output     v18.x.x or higher

    npm v9 or higher comes bundled with Node.js
    Verify by running   npm --version
    Expected output     9.x.x or higher

    A free Groq API Key
    Get yours at https://console.groq.com/keys

    Git optional for cloning the repository
    Download at https://git-scm.com/downloads
    Verify by running   git --version

---

## 📦 Installation

Step 1 — Clone the Repository

    git clone https://github.com/yourusername/kryzen-ai.git
    cd kryzen-ai

If you downloaded a ZIP file instead then unzip it and enter the folder.

    unzip kryzen-ai.zip
    cd kryzen-ai

Step 2 — Install Backend Dependencies

    cd backend
    npm install

You should see output similar to this when it completes.

    added 87 packages in 12s

Step 3 — Install Frontend Dependencies

    cd ../frontend
    npm install

You should see output similar to this when it completes.

    added 312 packages in 24s

---

## ⚙ Configuration

Backend Configuration File located at backend/.env

Open the file and fill in the values as shown below.

    GROQ_API_KEY=your_groq_api_key_here

    GROQ_MODEL=llama3-70b-8192

    TEMPERATURE=0.8

    MAX_TOKENS=8192

    PORT=3001

    FRONTEND_URL=http://localhost:5173

Available Groq models you can set for GROQ_MODEL

    llama3-70b-8192       Recommended and most powerful
    llama3-8b-8192        Faster and lighter weight
    mixtral-8x7b-32768    Large context window
    gemma2-9b-it          Google Gemma model

Frontend Configuration File located at frontend/.env

Open the file and fill in the values as shown below.

    VITE_API_URL=http://localhost:3001

    VITE_APP_NAME=KRYZEN AI

    VITE_APP_VERSION=1.0.0

---

## ▶ Running the App

Development Mode requires two terminal windows open at the same time.

Terminal 1 — Start the Backend

    cd backend
    npm run dev

You should see this output confirming the server is running.

    ╔═══════════════════════════════════════╗
    ║          KRYZEN AI - ONLINE           ║
    ║  Server: http://localhost:3001        ║
    ║  Model:  llama3-70b-8192             ║
    ║  Status: OPERATIONAL                  ║
    ╚═══════════════════════════════════════╝

Terminal 2 — Start the Frontend

    cd frontend
    npm run dev

You should see this output confirming Vite is running.

    VITE v5.3.4  ready in 312 ms
    ➜  Local:   http://localhost:5173/
    ➜  Network: http://192.168.x.x:5173/

Now open your browser and go to http://localhost:5173

Production Build

Build the frontend assets first.

    cd frontend
    npm run build

The output will be placed inside frontend/dist/

Start the backend server in production mode.

    cd backend
    npm start

Serve the frontend build using a static file server.

    npm install -g serve
    serve frontend/dist -p 5173

---

## 📡 API Reference

Base URL for all endpoints

    http://localhost:3001/api

---

GET /api/health

Check if the server is alive and responding.

Response you will receive

    {
      "status": "operational",
      "model": "llama3-70b-8192",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "message": "KRYZEN AI is awake and hungry."
    }

---

POST /api/chat/stream

Send a message and receive a real-time streaming response via SSE.

Request Header you must include

    Content-Type: application/json

Request Body format

    {
      "messages": [
        {
          "role": "user",
          "content": "Explain recursion with a Python example"
        }
      ]
    }

SSE Event Types you will receive during streaming

    connected     Stream has been established successfully
    chunk         A partial piece of the response text has arrived
    done          The full response has finished streaming
    error         Something went wrong during the stream

Example of raw SSE output from the server

    data: {"type":"connected"}
    data: {"type":"chunk","content":"Recursion"}
    data: {"type":"chunk","content":" is when a function"}
    data: {"type":"chunk","content":" calls itself."}
    data: {"type":"done","totalLength":247}

---

POST /api/chat

Non-streaming fallback that returns the complete response at once.

Request Body format

    {
      "messages": [
        { "role": "user", "content": "Hello KRYZEN" }
      ]
    }

Response you will receive

    {
      "success": true,
      "message": {
        "role": "assistant",
        "content": "Greetings. KRYZEN is online. What do you require?"
      },
      "usage": {
        "prompt_tokens": 142,
        "completion_tokens": 89,
        "total_tokens": 231
      }
    }

---

Validation Rules enforced on all requests

    Maximum messages per request    50 messages
    Maximum characters per message  10000 characters
    Valid role values               user and assistant only
    Rate limit                      100 requests per IP per 15 minutes

---

## 🎨 Customization

Swap the AI Model

Edit backend/.env and change the model line. No code changes are needed.

    GROQ_MODEL=llama3-8b-8192

---

Change the Color Palette

Edit frontend/src/GoreStyles.css and update the root variables at the top of the file.

    --red: #ff0000          Change this to set the main accent color
    --dark-red: #1a0000     Change this to set the background tint
    --text-primary: #e8e8e8 Change this to set the main text color

---

Modify the System Prompt

Edit backend/server.js and find the constant named KRYZEN_SYSTEM_PROMPT near the top.
Change the text inside it to adjust the personality, tone, or behavior of the AI.

---

Switch Backend Frameworks

The frontend only communicates with /api/chat/stream using SSE events.
You can replace Express with FastAPI, Hono, Bun, or any other framework
as long as it produces the same SSE event format.

Then update frontend/.env to point to your new backend.

    VITE_API_URL=https://your-new-backend.com

---

Add New Components

All UI components live inside frontend/src/components/
Each component is self-contained with its own props.
Import and use them inside ChatInterface.jsx or App.jsx as needed.

---

## 🚀 Deployment

Deploy Backend to Railway

    npm install -g @railway/cli
    railway login
    railway init
    railway up

Then set these environment variables inside the Railway dashboard.

    GROQ_API_KEY
    PORT
    FRONTEND_URL

---

Deploy Backend to Render

    1. Push your backend folder to a GitHub repository
    2. Go to https://render.com and click New Web Service
    3. Connect your GitHub repository
    4. Set build command to    npm install
    5. Set start command to    npm start
    6. Add your environment variables in the Render dashboard

---

Deploy Frontend to Vercel

    npm install -g vercel
    cd frontend
    vercel

Set this environment variable in the Vercel dashboard.

    VITE_API_URL = https://your-backend-url.railway.app

---

Deploy Frontend to Netlify

    cd frontend
    npm run build
    npm install -g netlify-cli
    netlify deploy --prod --dir=dist

Or drag and drop the dist folder at https://app.netlify.com/drop

---

Environment Variables for Production

Backend variables to set on your hosting platform

    GROQ_API_KEY        your production groq api key
    GROQ_MODEL          llama3-70b-8192
    PORT                3001
    FRONTEND_URL        https://your-frontend.vercel.app
    TEMPERATURE         0.8
    MAX_TOKENS          8192

Frontend variables to set on your hosting platform

    VITE_API_URL        https://your-backend.railway.app
    VITE_APP_NAME       KRYZEN AI
    VITE_APP_VERSION    1.0.0

---

## 🔒 Security

What is already protected for you

    The Groq API key lives only on the backend and is never sent to the browser
    Rate limiting blocks more than 100 requests per IP per 15 minutes
    Input validation enforces role types, content types, and length limits
    Helmet.js automatically sets secure HTTP response headers
    CORS restricts which origins are allowed to call the API

What you need to do yourself

    Never commit .env files to Git under any circumstances
    Add .env to your .gitignore file right away
    Rotate your Groq API key immediately if it is ever exposed publicly
    Set FRONTEND_URL to your exact production domain when deploying
    Always use HTTPS in production for both the frontend and backend

Recommended .gitignore entries

    backend/.env
    frontend/.env
    .env
    .env.local
    .env.production
    node_modules/
    */node_modules/
    frontend/dist/
    frontend/.vite/
    *.log
    npm-debug.log*
    .DS_Store
    Thumbs.db

---

## 🐛 Troubleshooting

Problem — Backend will not start and shows Cannot find module groq-sdk

    cd backend
    npm install

---

Problem — Backend shows Invalid API Key error

    Check that your backend/.env file exists
    Make sure GROQ_API_KEY is set to your actual key with no spaces
    Get a new key at https://console.groq.com/keys

---

Problem — Frontend shows Failed to fetch or a CORS error

Check all three of these things.

    1. The backend is running on port 3001
    2. frontend/.env has the correct VITE_API_URL value
    3. backend/.env has the correct FRONTEND_URL value

Test if the backend is alive by running this command.

    curl http://localhost:3001/api/health

---

Problem — Responses appear all at once instead of streaming

Check that no reverse proxy is buffering responses.
Add X-Accel-Buffering: no to your proxy configuration.
Verify that no VPN or corporate proxy is interfering with SSE connections.

---

Problem — Port 3001 is already in use

On macOS and Linux run this to find what is using the port.

    lsof -i :3001

On Windows run this instead.

    netstat -ano | findstr :3001

Then kill the process using the PID number you find.

On macOS and Linux

    kill -9 YOUR_PID_HERE

On Windows

    taskkill /PID YOUR_PID_HERE /F

---

Problem — Responses are slow

    Switch to a faster model by setting GROQ_MODEL=llama3-8b-8192 in backend/.env
    Lower the MAX_TOKENS value in backend/.env
    Check your internet connection quality to Groq servers

---

## 📄 License

MIT License

Copyright (c) 2024 KRYZEN AI

Permission is hereby granted free of charge to any person obtaining a copy
of this software and associated documentation files the Software to deal in
the Software without restriction including without limitation the rights to
use copy modify merge publish distribute sublicense and or sell copies of
the Software and to permit persons to whom the Software is furnished to do
so subject to the following conditions.

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED AS IS WITHOUT WARRANTY OF ANY KIND EXPRESS OR
IMPLIED INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM DAMAGES OR OTHER
LIABILITY WHETHER IN AN ACTION OF CONTRACT TORT OR OTHERWISE ARISING FROM
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

## 🙏 Acknowledgements

    Groq                    Blazing fast LLM inference API at https://groq.com
    Meta AI                 LLaMA3 language model at https://ai.meta.com
    React                   UI framework at https://reactjs.org
    Framer Motion           Animation library at https://www.framer.com/motion
    Vite                    Build tool at https://vitejs.dev
    Lucide                  Icon library at https://lucide.dev
    Tailwind CSS            Styling framework at https://tailwindcss.com

---

                              ⚔ KRYZEN AI

              Built for the void. Refined in the darkness.

         Report a Bug      https://github.com/Kryzen-Here/KryzenAi/issues
         Request Feature   https://github.com/Kryzen-Here/KryzenAi/issues
         Get Groq API Key  https://console.groq.com/keys

---

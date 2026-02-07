# Rabbitz.io

Rabbitz.io is an AI-powered web app builder that generates UI and logic from natural-language prompts and previews the result instantly in the browser.

Users can describe an application, and the system generates HTML, CSS, and JavaScript, builds the project, and streams the preview live using WebSockets.

---

## Features

* AI-generated UI and logic from prompts
* Real-time build updates using Socket.IO
* Live preview in an iframe
* Google authentication
* Build history stored in database
* Event-driven background processing using Inngest
* Deployed frontend and backend with production configuration

---

## Tech Stack

**Frontend**

* React (Vite)
* TailwindCSS
* Socket.IO client
* Google Auth

**Backend**

* Node.js
* Express
* Socket.IO
* Inngest (background jobs)
* MongoDB

**AI / APIs**

* OpenRouter API

**Deployment**

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```
rabbitz/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── context/
│   └── App.jsx
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── socket/
│   ├── inngest/
│   └── server.js
│
└── README.md
```

---

## Environment Variables

### Frontend (.env)

```
VITE_backendurl=https://your-backend-url.onrender.com
```

---

### Backend (.env)

```
PORT=3000
MONGO_URI=your_mongodb_connection
OPENROUTER_API_KEY=your_api_key
GOOGLE_CLIENT_ID=your_client_id
```

---

## Installation (Local Development)

### 1. Clone the repository

```
git clone https://github.com/yourusername/rabbitz.git
cd rabbitz
```

---

### 2. Install dependencies

Frontend:

```
cd frontend
npm install
```

Backend:

```
cd backend
npm install
```

---

### 3. Run locally

Backend:

```
npm run dev
```

Frontend:

```
npm run dev
```

---

## How It Works

1. User enters a prompt
2. Frontend sends a build event
3. Inngest triggers background generation
4. OpenRouter generates HTML, CSS, and JS
5. Backend stores result
6. Socket.IO emits `build_done`
7. Frontend updates preview instantly

---

## Socket Events

### Client → Server

```
join
```

### Server → Client

```
build_done
```

---

## Deployment

### Frontend (Vercel)

Set environment variable:

```
VITE_backendurl=https://your-backend-url.onrender.com
```

Redeploy after updating variables.

---

### Backend (Render)

Ensure:

* CORS allows frontend domain
* Socket.IO configured with production origin

Example:

```js
const io = new Server(httpServer, {
  cors: {
    origin: ["https://your-frontend.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

---

## Security Notes

* Never commit API keys
* Use environment variables
* Rotate exposed keys immediately

---

## Future Improvements

* Multi-page generation
* Code export
* Versioning of builds
* Streaming generation preview
* Team collaboration

---

## Author

Preran S
Full Stack Developer
GitHub: [https://github.com/PRERAN001](https://github.com/PRERAN001)

---

Perfect.
**Rabbitz** is a strong choice.

Here is the **final README**, updated and clean, with the project name set to **Rabbitz** and scoped only to **HTML + JavaScript live preview**.

---

```md
# Rabbitz

## Overview

**Rabbitz** is a lightweight, browser-based live code sandbox for rapidly writing and previewing frontend code in real time.

The initial phase of Rabbitz focuses only on **HTML and JavaScript**, keeping the system simple, fast, and stable during academic schedules. The architecture is intentionally designed so it can later scale into a full multi-language, container-based execution platform.

---

## Initial Phase Scope

This phase is intentionally minimal.

### Supported
- HTML file editing
- JavaScript file editing
- Real-time live preview
- Monaco Editor as the in-browser code editor
- iframe-based sandbox rendering
- Instant preview refresh on code changes

### Not Included (Yet)
- Separate CSS files
- React or frontend frameworks
- Backend languages
- Docker-based execution
- Cloud deployment
- Authentication
- Persistent storage

---

## How Live Preview Works

1. Monaco Editor provides the browser-based code editor.
2. The user writes HTML and JavaScript.
3. The editor content is injected into a sandboxed iframe.
4. The iframe reloads automatically on each change.
5. The browser renders the output instantly.

This approach uses **native browser execution**, requiring no server-side code execution.

---

## Tech Stack (Initial Phase)

- Frontend: Vanilla JavaScript or React (editor UI only)
- Code Editor: Monaco Editor
- Preview: iframe sandbox
- State Management: Local state
- Build Tool: Vite (optional)

---

## Project Structure (Initial Phase)

```

rabbitz/
│
├── frontend/
│   ├── editor/
│   ├── preview/
│   ├── utils/
│   └── index.html
│
├── public/
│
└── README.md

```

---

## Goals of the Initial Phase

- Build a stable live preview sandbox
- Understand editor–preview synchronization
- Establish a clean UI foundation
- Prepare for future expansion

---

## Future Vision (Post-Exams)

After exams, Rabbitz can evolve to include:
- CSS file support
- React and framework previews
- Docker-based language sandboxes
- Backend execution
- AWS EC2 deployment
- Project templates
- Export and sharing features

---

## Project Status

Active — Initial Phase  
Development will continue after semester exams.

---

## License

MIT License
```

---



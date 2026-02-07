import "./App.css";
import { loginwithGoogle } from "./auth";
import { useContext, useEffect, useState, useRef } from "react";
import { Rabbitzcontext } from "./context/Rabbitzcontext";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";

function App() {
  const { user, setuser } = useContext(Rabbitzcontext);
  const userName = user && user.name;
  const [prompt, setprompt] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("code"); // Options: "code" | "preview"
  const editorRef = useRef(null);

  function showPreview(html) {
    const iframe = document.getElementById("preview");
    console.log("preview update", html);

    // Update editor if it exists and value is different
    if (editorRef.current) {
      if (editorRef.current.getValue() !== html) {
        editorRef.current.setValue(html);
      }
    }

    // Update iframe
    if (iframe) iframe.srcdoc = html;
  }

  function handleEditorChange(value, event) {
    // Update iframe immediately when typing in editor
    const iframe = document.getElementById("preview");
    if (iframe) iframe.srcdoc = value;
  }

  const sebdd = async () => {
    if (!user || !user.name) {
      alert("Please login first");
      return;
    }

    await fetch(`${import.meta.env.VITE_backendurl}/rabbitz/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.name,
        prompt: prompt,
        result: "",
      }),
    });
  };

  const build = async () => {
    await sebdd();
    if (!user || !user.name) {
      alert("Please login first");
      return;
    }

    setIsExpanded(true);
    setIsLoading(true);
    setHasInitialized(true);
    // Switch to preview tab automatically on build
    setActiveTab("preview");

    try {
      const response = await fetch(`${import.meta.env.VITE_backendurl}/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          prompt: prompt,
        }),
      });
      const buildResult = await response.text();
      console.log("Build event sent:", buildResult);
    } catch (err) {
      console.error("Build error:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_backendurl);
    socket.on("connect", () => console.log("socket connected", socket.id));

    if (userName) socket.emit("join", userName);

    socket.on("build_done", (data) => {
      if (userName && data.name === userName) {
        showPreview(data.html);
        setIsLoading(false);
      }
    });

    return () => socket.disconnect();
  }, [userName]);

  const handlelogin = async () => {
    let name = await loginwithGoogle();
    setuser({ name: name, prompt: prompt, result: "" });
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-orange-500 selection:text-black flex flex-col overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-orange-500 to-yellow-400 z-50"></div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5 border-b border-zinc-900 bg-black/90 backdrop-blur-sm relative z-40 shrink-0">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center group-hover:border-orange-500 transition-colors">
            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
            Rabbitz<span className="text-orange-500">.</span>io
          </span>
        </div>
        <button
          onClick={handlelogin}
          className={`
            px-3 py-2 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border
            ${
              user && user.name
                ? "bg-zinc-900 border-zinc-800 text-blue-400"
                : "bg-blue-600 border-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            }
          `}
        >
          {user && user.name ? `[ ${user.name} ]` : "Authorize"}
        </button>
      </header>

      {/* Main Layout Area */}
      <main className="relative z-10 flex-1 flex flex-col h-[calc(100vh-73px)]">
        <div
          className={`
            flex-1 flex transition-all duration-500 ease-in-out
            ${
              isExpanded
                ? "flex-col lg:flex-row" // Stack on mobile, Row on desktop
                : "flex-col items-center justify-center p-6"
            }
        `}
        >
          {/* Left Section (Input / Chat) */}
          <div
            className={`
              flex flex-col relative transition-all duration-500 ease-in-out
              ${
                isExpanded
                  ? "w-full h-[40vh] lg:h-full lg:w-[450px] border-b lg:border-b-0 lg:border-r border-zinc-900 bg-black shrink-0"
                  : "w-full max-w-4xl"
              }
            `}
          >
            {/* Hero Text (Only visible when NOT expanded) */}
            <div
              className={`
                mb-8 transition-all duration-500
                ${isExpanded ? "hidden" : "block text-center"}
              `}
            >
              <div className="inline-block px-3 py-1 mb-4 border border-zinc-800 rounded-full bg-zinc-900/50">
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                  v2.0 System Ready
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-6">
                Build it <span className="text-blue-500">Fast.</span>
                <br />
                Make it <span className="text-orange-500">Real.</span>
              </h1>
              <p className="text-zinc-500 text-sm md:text-lg max-w-lg mx-auto px-4">
                Enter your requirements below. The system will generate the UI
                structure and logic instantly.
              </p>
            </div>

            {/* Input Container */}
            <div
              className={`
                flex flex-col h-full
                ${isExpanded ? "p-0" : ""}
              `}
            >
              <div
                className={`
                  relative flex flex-col bg-zinc-950/50 border transition-all duration-300
                  ${
                    isExpanded
                      ? "h-full border-0"
                      : "rounded-xl border-zinc-800 hover:border-blue-500/50 focus-within:border-orange-500 shadow-2xl"
                  }
              `}
              >
                {/* Editor Header (Visible when expanded) */}
                {isExpanded && (
                  <div className="px-4 py-2 md:py-3 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between shrink-0">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                      Prompt Console
                    </span>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                      <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                    </div>
                  </div>
                )}

                <textarea
                  value={prompt}
                  onChange={(e) => setprompt(e.target.value)}
                  placeholder="// Describe your application logic here..."
                  className={`
                    w-full bg-transparent text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none font-mono leading-relaxed
                    ${
                      isExpanded
                        ? "flex-1 text-sm p-4"
                        : "h-32 md:h-40 p-4 md:p-6 text-base md:text-lg"
                    }
                  `}
                  spellCheck="false"
                />

                {/* Toolbar / Actions */}
                <div
                  className={`
                    flex items-center justify-between shrink-0
                    ${
                      isExpanded
                        ? "p-3 md:p-4 border-t border-zinc-900 bg-zinc-950"
                        : "p-4 border-t border-zinc-900/50"
                    }
                  `}
                >
                  <div className="flex gap-4">
                    {!isExpanded && (
                      <div className="flex items-center gap-2 text-zinc-600 text-xs">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        <span className="hidden md:inline">
                          AI Agent Standby
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={build}
                    disabled={!user || !user.name || isLoading}
                    className={`
                      flex items-center justify-center gap-2 transition-all duration-200 uppercase tracking-wider font-bold text-[10px] md:text-xs
                      ${isExpanded ? "w-full py-2 md:py-3" : "px-6 md:px-8 py-3"}
                      ${
                        isLoading
                          ? "bg-zinc-800 text-zinc-500 border border-zinc-800 cursor-not-allowed"
                          : !user || !user.name
                          ? "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
                          : "bg-orange-600 text-white hover:bg-orange-500 border border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        {isExpanded ? "Execute Update" : "Generate Build"}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section (Preview & Editor) */}
          <div
            className={`
              flex-1 bg-zinc-950 relative flex flex-col transition-all duration-700 ease-in-out border-l border-zinc-900 w-full
              ${
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "hidden opacity-0 translate-x-10 absolute right-0 w-1/2 h-full lg:flex"
              }
            `}
          >
            {/* Header Bar */}
            <div className="h-10 md:h-12 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-3 md:px-4 shrink-0">
              {/* Left: Traffic Lights */}
              <div className="flex gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>

              {/* Center: Tabs */}
              <div className="flex bg-black/50 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setActiveTab("code")}
                  className={`
                    px-3 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all
                    ${
                      activeTab === "code"
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                    }
                  `}
                >
                  Code
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`
                    px-3 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all
                    ${
                      activeTab === "preview"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                    }
                  `}
                >
                  Preview
                </button>
              </div>

              {/* Right: Address Bar (Visual only, hidden on small mobile) */}
              <div className="hidden md:block text-[10px] text-zinc-600 font-mono">
                localhost:3000
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative bg-black overflow-hidden">
              {/* Loading Spinner Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <span className="text-blue-500 font-mono text-xs animate-pulse">
                    GENERATING...
                  </span>
                </div>
              )}

              {/* EDITOR TAB (Corrected: Contains Editor) */}
              <div
                className={`w-full h-full ${
                  activeTab === "code" ? "block" : "hidden"
                }`}
              >
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  defaultValue="// HTML output will appear here..."
                  theme="vs-dark"
                  onMount={(editor) => (editorRef.current = editor)}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    padding: { top: 20 },
                  }}
                />
              </div>

              {/* PREVIEW TAB (Corrected: Contains Iframe) */}
              <div
                className={`w-full h-full bg-white ${
                  activeTab === "preview" ? "block" : "hidden"
                }`}
              >
                <iframe
                  id="preview"
                  title="preview"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

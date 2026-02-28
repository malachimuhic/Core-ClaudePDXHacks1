import { useState } from "react";

const C = {
  bg: "#f8f7f4",
  card: "#ffffff",
  border: "#e5e2dc",
  text: "#2d2a26",
  muted: "#8a8279",
  p1: "#2563eb",
  p1Light: "#dbeafe",
  p2: "#9333ea",
  p2Light: "#f3e8ff",
  p3: "#16a34a",
  p3Light: "#dcfce7",
  p4: "#ea580c",
  p4Light: "#fff7ed",
  amber: "#d97706",
  amberLight: "#fef3c7",
  done: "#16a34a",
};

const people = [
  {
    id: 1,
    name: "Person 1",
    role: "Frontend — Input Handling",
    emoji: "🎨",
    color: C.p1,
    bg: C.p1Light,
    focus: "Captures everything the user types and sends it to the backend",
    tasks: [
      {
        title: "Build the text input box + send button",
        detail: "Textarea with Enter to send, disabled while waiting for response",
        tag: "INPUT",
      },
      {
        title: "Capture user message and add to chat",
        detail: "On send: grab input value, append to messages array, clear input",
        tag: "INPUT",
      },
      {
        title: "Send POST request to backend",
        detail: "fetch('/api/chat', { method: 'POST', body: { message, history } })",
        tag: "INPUT → OUTPUT",
      },
      {
        title: "Show loading indicator while waiting",
        detail: "Typing dots or spinner while Claude is thinking",
        tag: "OUTPUT",
      },
      {
        title: "Display bot response in chat",
        detail: "Receive response from backend, append to messages, auto-scroll down",
        tag: "OUTPUT",
      },
      {
        title: "Handle errors gracefully",
        detail: "Show 'Something went wrong, try again' if the API call fails",
        tag: "OUTPUT",
      },
    ],
  },
  {
    id: 2,
    name: "Person 2",
    role: "Backend — API Route",
    emoji: "⚡",
    color: C.p2,
    bg: C.p2Light,
    focus: "Receives the message, calls Claude, returns the response",
    tasks: [
      {
        title: "Set up FastAPI server with CORS",
        detail: "pip install fastapi uvicorn anthropic — enable CORS for localhost",
        tag: "SETUP",
      },
      {
        title: "Create POST /api/chat endpoint",
        detail: "Accepts { message: string, history: array } in request body",
        tag: "INPUT",
      },
      {
        title: "Validate incoming message",
        detail: "Check message is not empty, history is valid array, return 400 if bad",
        tag: "INPUT",
      },
      {
        title: "Build messages array for Claude API",
        detail: "Combine history + new user message into Claude's message format",
        tag: "INPUT → OUTPUT",
      },
      {
        title: "Call Claude API with system prompt",
        detail: "anthropic.messages.create(model, system, messages) — use Person 3's prompt",
        tag: "OUTPUT",
      },
      {
        title: "Return Claude's response as JSON",
        detail: "{ response: string, category?: string } back to frontend",
        tag: "OUTPUT",
      },
    ],
  },
  {
    id: 3,
    name: "Person 3",
    role: "AI — System Prompt & Output Format",
    emoji: "🧠",
    color: C.p3,
    bg: C.p3Light,
    focus: "Defines what Claude knows, how it responds, and the output structure",
    tasks: [
      {
        title: "Write the system prompt",
        detail: "Tell Claude it's a handyman expert — diagnose, advise, estimate costs",
        tag: "CORE",
      },
      {
        title: "Define the output format",
        detail: "🔍 Issue, ⚠️ Severity, 🛠️ Category, 💡 Steps, 💰 Cost — consistent every time",
        tag: "OUTPUT",
      },
      {
        title: "Handle safety cases in prompt",
        detail: "Electrical, gas, structural = always say 'call a professional'",
        tag: "OUTPUT",
      },
      {
        title: "Test 10+ different inputs in Claude.ai",
        detail: "Leaky faucet, broken door, flickering light, weird noise, etc.",
        tag: "TESTING",
      },
      {
        title: "Write 3 demo scripts",
        detail: "Script 1: simple fix. Script 2: dangerous issue. Script 3: follow-up question.",
        tag: "DEMO",
      },
      {
        title: "Share final prompt as a constant",
        detail: "Give Person 2 the exact SYSTEM_PROMPT string to paste into server.py",
        tag: "HANDOFF",
      },
    ],
  },
  {
    id: 4,
    name: "Person 4",
    role: "Integration & Data Flow",
    emoji: "🔗",
    color: C.p4,
    bg: C.p4Light,
    focus: "Makes sure inputs flow to outputs end-to-end, fixes gaps between pieces",
    tasks: [
      {
        title: "Set up GitHub repo + project structure",
        detail: "Create repo, /frontend and /backend folders, README, share with team",
        tag: "SETUP",
      },
      {
        title: "Define the API contract",
        detail: "Write down: POST /api/chat → { message, history } → { response } so P1 and P2 agree",
        tag: "INPUT → OUTPUT",
      },
      {
        title: "Wire frontend to backend",
        detail: "Once P1 and P2 are ready, connect them — test the first message end-to-end",
        tag: "INTEGRATION",
      },
      {
        title: "Handle conversation history",
        detail: "Make sure full chat history is sent each time so Claude remembers context",
        tag: "INPUT",
      },
      {
        title: "Add quick-prompt buttons",
        detail: "6 clickable suggestions: 'Leaky faucet', 'Squeaky door', etc. for the demo",
        tag: "OUTPUT",
      },
      {
        title: "End-to-end testing + demo rehearsal",
        detail: "Run through all 3 demo scripts. Test edge cases. Time the demo.",
        tag: "TESTING",
      },
    ],
  },
];

const tagColors = {
  INPUT: { bg: "#dbeafe", color: "#1d4ed8" },
  OUTPUT: { bg: "#dcfce7", color: "#15803d" },
  "INPUT → OUTPUT": { bg: "#fef3c7", color: "#d97706" },
  SETUP: { bg: "#f3e8ff", color: "#7c3aed" },
  CORE: { bg: "#fce7f3", color: "#be185d" },
  TESTING: { bg: "#e0e7ff", color: "#4338ca" },
  DEMO: { bg: "#fff1f2", color: "#e11d48" },
  HANDOFF: { bg: "#f0fdf4", color: "#15803d" },
  INTEGRATION: { bg: "#fff7ed", color: "#ea580c" },
};

export default function TaskList() {
  const [checked, setChecked] = useState({});
  const [expandedPerson, setExpandedPerson] = useState(1);

  const toggle = (personId, taskIdx) => {
    const key = `${personId}-${taskIdx}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getProgress = (personId, taskCount) => {
    let done = 0;
    for (let i = 0; i < taskCount; i++) {
      if (checked[`${personId}-${i}`]) done++;
    }
    return done;
  };

  const totalDone = Object.values(checked).filter(Boolean).length;
  const totalTasks = people.reduce((sum, p) => sum + p.tasks.length, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'IBM Plex Sans', 'Helvetica Neue', sans-serif",
        color: C.text,
        padding: "28px 16px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ maxWidth: 680, margin: "0 auto 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🔨</span>
          <div>
            <h1
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
              }}
            >
              FixIt Bot — Team Task List
            </h1>
            <p style={{ color: C.muted, fontSize: 13, margin: "2px 0 0" }}>
              4 people · 2 hours · input → output responsibilities
            </p>
          </div>
        </div>

        {/* Overall progress */}
        <div
          style={{
            marginTop: 16,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span>Overall Progress</span>
              <span style={{ color: totalDone === totalTasks ? C.done : C.amber }}>
                {totalDone}/{totalTasks} tasks
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: "#e8e5e0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(totalDone / totalTasks) * 100}%`,
                  borderRadius: 4,
                  background: totalDone === totalTasks
                    ? C.done
                    : `linear-gradient(90deg, ${C.amber}, #f59e0b)`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data flow diagram */}
      <div style={{ maxWidth: 680, margin: "0 auto 20px" }}>
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "16px 20px",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              color: C.muted,
              marginBottom: 10,
              letterSpacing: "1px",
            }}
          >
            DATA FLOW
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "User types", person: "P1", color: C.p1 },
              { label: "→" },
              { label: "POST /api/chat", person: "P4", color: C.p4 },
              { label: "→" },
              { label: "Validate + call Claude", person: "P2", color: C.p2 },
              { label: "→" },
              { label: "System prompt shapes output", person: "P3", color: C.p3 },
              { label: "→" },
              { label: "Response shown in chat", person: "P1", color: C.p1 },
            ].map((item, i) =>
              item.person ? (
                <div
                  key={i}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: `${item.color}12`,
                    border: `1px solid ${item.color}30`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>
                    {item.person}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{item.label}</div>
                </div>
              ) : (
                <span
                  key={i}
                  style={{
                    padding: "0 4px",
                    color: C.border,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  →
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Person cards */}
      <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {people.map((person) => {
          const isExpanded = expandedPerson === person.id;
          const done = getProgress(person.id, person.tasks.length);
          const allDone = done === person.tasks.length;

          return (
            <div
              key={person.id}
              style={{
                background: C.card,
                border: `1px solid ${isExpanded ? person.color + "40" : C.border}`,
                borderRadius: 14,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              {/* Person header */}
              <button
                onClick={() => setExpandedPerson(isExpanded ? null : person.id)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    background: person.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {person.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 15,
                        fontWeight: 700,
                        color: person.color,
                      }}
                    >
                      {person.name}
                    </span>
                    <span style={{ fontSize: 13, color: C.muted }}>—</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      {person.role}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{person.focus}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: allDone ? C.done : C.muted,
                    }}
                  >
                    {done}/{person.tasks.length}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: C.muted,
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    ▾
                  </span>
                </div>
              </button>

              {/* Tasks */}
              {isExpanded && (
                <div
                  style={{
                    padding: "0 20px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {person.tasks.map((task, ti) => {
                    const isDone = checked[`${person.id}-${ti}`];
                    const tc = tagColors[task.tag] || { bg: "#f1f5f9", color: "#64748b" };

                    return (
                      <div
                        key={ti}
                        onClick={() => toggle(person.id, ti)}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                          padding: "12px 14px",
                          borderRadius: 10,
                          background: isDone ? "#f6fef6" : "#fafaf8",
                          border: `1px solid ${isDone ? "#bbf7d0" : "#eee"}`,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          opacity: isDone ? 0.7 : 1,
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            border: `2px solid ${isDone ? C.done : "#d1d5db"}`,
                            background: isDone ? C.done : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 1,
                            transition: "all 0.15s",
                          }}
                        >
                          {isDone && (
                            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: C.text,
                                textDecoration: isDone ? "line-through" : "none",
                              }}
                            >
                              {task.title}
                            </span>
                            <span
                              style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "2px 7px",
                                borderRadius: 5,
                                background: tc.bg,
                                color: tc.color,
                                letterSpacing: "0.5px",
                              }}
                            >
                              {task.tag}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: 12,
                              color: C.muted,
                              marginTop: 3,
                              lineHeight: 1.4,
                            }}
                          >
                            {task.detail}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Handoff rules */}
        <div
          style={{
            background: C.amberLight,
            border: `1px solid #fcd34d`,
            borderRadius: 12,
            padding: "18px 20px",
            marginTop: 4,
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              color: C.amber,
              marginBottom: 10,
            }}
          >
            🤝 HANDOFF RULES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#92400e", lineHeight: 1.5 }}>
            <div><strong>At 0:30</strong> — P3 shares system prompt string → P2 pastes it into server.py</div>
            <div><strong>At 1:00</strong> — P2 announces endpoint is live → P4 wires it to P1's frontend</div>
            <div><strong>At 1:15</strong> — P4 confirms first message works end-to-end → everyone tests</div>
            <div><strong>At 1:30</strong> — P3 shares demo scripts → P4 runs rehearsals with the team</div>
          </div>
        </div>
      </div>
    </div>
  );
}

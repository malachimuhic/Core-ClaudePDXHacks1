import { useState, useRef, useEffect, useCallback } from 'react';

/** Hammer icon as inline SVG */
function HammerIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Handle */}
      <rect x="18" y="34" width="8" height="26" rx="3" fill="#b87333" />
      <rect x="20" y="34" width="4" height="26" rx="1.5" fill="#d4956a" opacity="0.5" />
      {/* Head */}
      <rect x="6" y="20" width="36" height="16" rx="3" fill="#888" />
      <rect x="6" y="20" width="36" height="8" rx="3" fill="#aaa" />
      {/* Claw */}
      <path d="M38 28 L50 20 Q54 17 52 24 L44 32 Z" fill="#888" />
      <path d="M38 28 L50 21 Q53 18.5 51.5 23 L44 30 Z" fill="#aaa" />
    </svg>
  );
}

/** Friendly handyman mascot as inline SVG */
function MascotIcon({ size = 120, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body / overalls */}
      <rect x="38" y="62" width="44" height="36" rx="6" fill="#2563eb" />
      <rect x="46" y="62" width="28" height="20" rx="4" fill="#3b82f6" />
      {/* Overall straps */}
      <rect x="46" y="56" width="6" height="12" rx="2" fill="#2563eb" />
      <rect x="68" y="56" width="6" height="12" rx="2" fill="#2563eb" />
      {/* Head */}
      <circle cx="60" cy="42" r="20" fill="#fbbf24" />
      {/* Face */}
      <circle cx="53" cy="39" r="2.5" fill="#333" />
      <circle cx="67" cy="39" r="2.5" fill="#333" />
      {/* Smile */}
      <path d="M52 48 Q60 56 68 48" stroke="#333" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Hard hat */}
      <ellipse cx="60" cy="28" rx="22" ry="10" fill="#f59e0b" />
      <rect x="38" y="24" width="44" height="8" rx="4" fill="#f59e0b" />
      <rect x="54" y="18" width="12" height="8" rx="3" fill="#fbbf24" />
      {/* Hat brim */}
      <rect x="34" y="30" width="52" height="4" rx="2" fill="#d97706" />
      {/* Arms */}
      <rect x="24" y="65" width="16" height="8" rx="4" fill="#fbbf24" />
      <rect x="80" y="65" width="16" height="8" rx="4" fill="#fbbf24" />
      {/* Hands */}
      <circle cx="24" cy="69" r="5" fill="#fcd34d" />
      <circle cx="96" cy="69" r="5" fill="#fcd34d" />
      {/* Hammer in right hand */}
      <rect x="93" y="56" width="4" height="20" rx="2" fill="#b87333" transform="rotate(15, 95, 66)" />
      <rect x="88" y="50" width="16" height="8" rx="2" fill="#888" transform="rotate(15, 96, 54)" />
      {/* Legs */}
      <rect x="44" y="94" width="10" height="14" rx="4" fill="#1e40af" />
      <rect x="66" y="94" width="10" height="14" rx="4" fill="#1e40af" />
      {/* Boots */}
      <rect x="42" y="104" width="14" height="6" rx="3" fill="#78350f" />
      <rect x="64" y="104" width="14" height="6" rx="3" fill="#78350f" />
      {/* Tool belt */}
      <rect x="38" y="82" width="44" height="5" rx="2" fill="#92400e" />
      <rect x="56" y="82" width="8" height="8" rx="2" fill="#78350f" />
    </svg>
  );
}

const EXAMPLE_PROMPTS = [
  "My kitchen faucet won't stop dripping",
  "There's a crack in my drywall near the ceiling",
  "My toilet keeps running after flushing",
];

/** Parse structured AI response into formatted JSX */
function FormatResponse({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  let listType = null; // 'ol' or 'ul'

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`list-${elements.length}`} className="response-list">
            {listItems.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`list-${elements.length}`} className="response-list">
            {listItems.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      }
      listItems = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Numbered list item: "1. ...", "2) ..."
    const numberedMatch = trimmed.match(/^\d+[\.\)]\s+(.+)/);
    if (numberedMatch) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(numberedMatch[1]);
      continue;
    }

    // Bullet list item: "- ...", "* ...", "  - ..."
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(bulletMatch[1]);
      continue;
    }

    flushList();

    // Bold label line: "Issue:", "Severity:", "DIY Steps:" etc.
    const labelMatch = trimmed.match(/^([A-Z][A-Za-z\s\/]+):\s*(.*)/);
    if (labelMatch) {
      elements.push(
        <div key={`label-${i}`} className="response-label-line">
          <strong className="response-label">{labelMatch[1]}:</strong>{' '}
          {labelMatch[2] && <span>{labelMatch[2]}</span>}
        </div>
      );
      continue;
    }

    // Heading-like lines (all caps or short bold-looking lines ending with ":")
    if (trimmed.endsWith(':') && trimmed.length < 60) {
      elements.push(
        <div key={`heading-${i}`} className="response-section-heading">
          {trimmed}
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(<p key={`p-${i}`} className="response-paragraph">{trimmed}</p>);
  }

  flushList();

  return <div className="formatted-response">{elements}</div>;
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });
  const [dragOver, setDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Apply dark mode class to body
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    handleImageFile(e.target.files[0]);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    removeImage();
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const sendMessage = async (overrideText) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed && !image) return;

    const userMessage = {
      role: 'user',
      content: trimmed,
      image: imagePreview,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history,
          image: image || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: data.response, timestamp: Date.now() },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: `Error: ${err.message}`, timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="header-top">
          <div className="header-logo">
            <HammerIcon size={28} />
            <h1>FixIt Bot</h1>
          </div>
          <div className="header-actions">
            {messages.length > 0 && (
              <button className="clear-btn" onClick={clearChat} title="Clear chat">
                Clear
              </button>
            )}
            <button
              className="theme-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
        <p>Describe your home repair issue or snap a photo</p>
      </header>

      <div
        className={`messages ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && (
          <div className="drop-overlay">
            Drop image here
          </div>
        )}

        {messages.length === 0 && !dragOver && (
          <div className="empty-state">
            <div className="mascot-icon">
              <MascotIcon size={120} />
            </div>
            <h2>How can I help?</h2>
            <p>Ask me about any home repair issue, or upload a photo for diagnosis.</p>
            <div className="example-prompts">
              {EXAMPLE_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  className="example-prompt"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="assistant-avatar">
                <MascotIcon size={32} />
              </div>
            )}
            <div className="message-bubble">
              {msg.image && (
                <img src={msg.image} alt="Uploaded" className="message-image" />
              )}
              {msg.role === 'assistant' ? (
                <FormatResponse text={msg.content} />
              ) : (
                <p className="message-text">{msg.content}</p>
              )}
              <div className="message-meta">
                <span className="message-time">{formatTime(msg.timestamp)}</span>
                {msg.role === 'assistant' && (
                  <button
                    className={`copy-btn${copiedId === msg.timestamp ? ' copied' : ''}`}
                    onClick={() => copyToClipboard(msg.content, msg.timestamp)}
                    title="Copy response"
                  >
                    {copiedId === msg.timestamp ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="assistant-avatar">
              <MascotIcon size={32} />
            </div>
            <div className="message-bubble">
              <div className="loading-indicator">
                <span className="typing-label">FixIt Bot is thinking...</span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button onClick={removeImage} className="remove-image">x</button>
          </div>
        )}
        <div className="input-row">
          <button
            className="photo-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo"
          >
            +
          </button>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your repair issue..."
            rows={1}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || (!input.trim() && !image)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

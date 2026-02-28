# API Contract — POST /api/chat

This is the single shared interface between frontend, backend, and AI service. Everyone codes against this spec.

## Endpoint

```
POST /api/chat
Content-Type: application/json
```

## Request Body

```json
{
  "message": "string (required if no image)",
  "history": [
    {
      "role": "user | assistant",
      "content": "string"
    }
  ],
  "image": "string (optional) — base64 data URL"
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes* | User's text message. *Can be empty if image is provided. |
| `history` | array | No | Previous conversation messages. Defaults to `[]`. |
| `history[].role` | string | Yes | Either `"user"` or `"assistant"` |
| `history[].content` | string | Yes | The message text |
| `image` | string | No | Base64 data URL: `"data:image/jpeg;base64,/9j/..."` |

### Image Format

Images are sent as **data URLs** (not raw base64):
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...
data:image/png;base64,iVBORw0KGgoAAAANSUhE...
```

The backend/AI service parses this to extract the media type and raw base64 data.

## Response — Success (200)

```json
{
  "response": "Issue: Dripping faucet\nSeverity: Minor\n..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `response` | string | The AI-generated diagnosis and repair advice |

## Response — Error (4xx/5xx)

```json
{
  "error": "Something went wrong"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Human-readable error message |

## Example — Text Only

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "My faucet is dripping", "history": []}'
```

## Example — With Image

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is wrong here?", "history": [], "image": "data:image/jpeg;base64,/9j/..."}'
```

## CORS

Backend allows all origins during development (`cors()` with defaults).

## Base URLs

| Service | URL |
|---------|-----|
| Frontend (Vite) | `http://localhost:5173` |
| Backend (Express) | `http://localhost:3001` |

Frontend's Vite config proxies `/api/*` to the backend, so frontend code just calls `/api/chat` (relative path).

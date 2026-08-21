# api-gateway-lite

Lightweight API gateway with rate limiting and request transformation for Node.js.

## Features

- 🚦 Configurable rate limiting per client IP
- 🔄 Request proxying with path rewriting
- 🔑 Automatic upstream authentication injection
- ❤️ Health check endpoint

## Quick Start

```bash
cp .env.example .env
# Edit .env with your upstream credentials
npm install
npm start
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Gateway listen port |
| `UPSTREAM_URL` | — | Target API base URL |
| `API_KEY` | — | Upstream service API key |
| `RATE_LIMIT_WINDOW` | `60000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

## API

### `GET /health`
Returns gateway status and uptime.

### `* /api/**`
Proxies to `UPSTREAM_URL` with rate limiting and auth header injection.

## License

MIT

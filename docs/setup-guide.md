# Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Access to the upstream API service

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

3. Start the gateway:
   ```bash
   npm start
   ```

## Verifying Setup

```bash
curl http://localhost:3000/health
```

## Rate Limiting

Per-IP rate limiting with configurable window and max requests.

## Troubleshooting

### Connection refused
Ensure `PORT` is not in use and `.env` is loaded correctly.

### 502 Bad Gateway
Check that `UPSTREAM_URL` is reachable and `API_KEY` is valid.

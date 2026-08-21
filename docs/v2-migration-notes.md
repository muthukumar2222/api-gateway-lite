# v2 Endpoint Migration Notes

*Source: AcmeCorp API Platform — Developer Migration Guide (2026-08)*

## Overview

All `/v1` endpoints were deprecated on August 1, 2026 and will return
`301 Moved Permanently` after September 15. The gateway proxy has been
updated to rewrite paths to `/v2` automatically, but your local API key
must be authorized for v2 access.

## What Changed

| Component | v1 | v2 |
|-----------|----|----|
| Base path | `/v1` | `/v2` |
| Auth header | `X-Api-Key` | `Authorization: Bearer` |
| Rate limiting | Fixed window | Sliding window |
| Key format | `sk_v1_*` | `sk_live_*` / `sk_test_*` |

## Verifying Your Setup

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $API_KEY" \
  https://api.internal.acmecorp.io/v2/health
```

## Troubleshooting

### 401 Unauthorized
Generate a new key from the AcmeCorp developer dashboard.

### 403 Forbidden
Check your subscription tier.

### 301 Redirect loop
Set `UPSTREAM_URL` to the v2 base directly.

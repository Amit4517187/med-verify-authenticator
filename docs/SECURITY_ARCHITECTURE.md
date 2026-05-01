# MedVerify Security Architecture Roadmap

This document outlines the recommended transition from the current "Public Access Token" model to a production-grade secure architecture.

## Current Architecture (Phase 1: MVP)
- **Model**: Public Access Token.
- **Implementation**: `VITE_MEDVERIFY_ACCESS_TOKEN` is embedded in the frontend bundle.
- **Pros**: Zero-infrastructure, easy to deploy as a static site.
- **Cons**: The token is visible to anyone inspecting network traffic or the source code.

## Target Architecture (Phase 2: Production Hardened)
To truly secure the backend, the secret token must never touch the browser.

### 1. Backend Proxy Pattern
Instead of calling the MedVerify API directly from the frontend, introduce a **Middleman/Proxy** layer.

```mermaid
graph LR
    A[Frontend SPA] -- Requests with User Session --> B[Backend Proxy (Node/Python)]
    B -- Attaches SECRET_TOKEN --> C[MedVerify Core Engine]
    C -- Verification Result --> B
    B -- Sanitized Result --> A
```

### 2. Implementation Steps
1.  **Remove `VITE_` Variable**: Delete `VITE_MEDVERIFY_ACCESS_TOKEN` from the `.env` used by the frontend.
2.  **Server-Side Secret**: Store `MEDVERIFY_ACCESS_TOKEN` (no prefix) in the **Backend Proxy** environment (e.g., Vercel Functions, AWS Lambda, or a dedicated Node.js server).
3.  **Authentication**: Add a user authentication layer (e.g., Firebase Auth, Auth0, or JWT) to the Backend Proxy.
4.  **CORS Enforcement**: Configure the MedVerify Core Engine to ONLY accept requests from the Backend Proxy's IP or domain.

## Recommended Tools
- **Auth**: [Clerk](https://clerk.com/) or [Lucia Auth](https://lucia-auth.com/) for modern, safe sessions.
- **Proxy**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) if using the web app, or a simple Express.js server for the mobile app.

---

### Immediate "Stop-Gap" Measures (Implemented)
The following layers are currently active:
- **Domain-Lock (Web)**: The backend (`app.py`) validates the `Origin` header. Requests from authorized domains (e.g., `https://med-verify-authenticator.vercel.app`) are allowed without a token, enabling the removal of public `VITE_` variables.
- **Rate Limiting**: Currently set to 100/min to prevent brute-force database scraping.
- **CORS Origin Filtering**: Restrict `ALLOWED_ORIGINS` to only your deployed domains.

### Mobile Authentication Caveat
Mobile apps do not consistently send a verifiable `Origin` header. For the mobile client:
1.  **Current**: Relies on a shared `API_KEY` passed in `X-API-Key`.
2.  **Recommendation**: Route mobile traffic through a proxy (Next.js API route or similar) that validates the mobile client signature and attaches the backend secret server-side.


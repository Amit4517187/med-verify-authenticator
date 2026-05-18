![Amit's Stats](https://github-readme-stats.vercel.app/api?username=Amit4517187&show_icons=true&theme=tokyonight)
![Amit's Stats](https://github-readme-stats.vercel.app/api?username=Amit4517187&show_icons=true&theme=tokyonight&cache_seconds=1800)
# MedVerify — AI-Powered Medicine Authenticator 🛡️

MedVerify is a production-grade, offline-capable Progressive Web Application (PWA) designed to detect counterfeit medicines in rural and low-connectivity environments across India. 

It uses an edge-deployed 5-layer AI analysis engine (Visual AI, OCR, Barcode/QR, Pricing Intelligence, and Pharmacy Registry Checks) backed by a massive locally-cached CDSCO database.

![Architecture: Zero-Storage, Edge-First](https://img.shields.io/badge/Architecture-Offline_First-10b981) ![Security: Enterprise Grade](https://img.shields.io/badge/Security-Enterprise_Grade-eab308) ![Status: Production Ready](https://img.shields.io/badge/Status-Production-3b82f6)

---

## 🚀 Key Features (Enterprise-Grade)

- 📡 **Hybrid "Offline-Second" Architecture**: Gracefully degrades from Cloud AI to a local IndexedDB cache when internet is lost.
  - **Online Mode (Full Power)**: Uses LLaMA 3, EasyOCR, and Python to extract text from photos and answer complex usage questions.
  - **Offline Mode (Backup)**: AI image extraction and LLM answering are disabled. Users manually enter the medicine name or barcode to instantly verify it against a highly-compressed 50MB local CDSCO registry cached on their mobile phone.
- 🔒 **Zero-Storage Security Architecture**: All uploaded images are processed entirely in-memory using `BytesIO`. No user data, prescriptions, or images are ever written to disk, ensuring 100% HIPAA and privacy compliance.
- 🤖 **Defensive AI Pipeline**: Employs rigorous LLM prompt injection defenses, strict `max_tokens` limits (to prevent token-exhaustion attacks), and real-time usage logging via Groq's high-speed inference engine.
- 🚧 **Hardened API Infrastructure**: Protected by multi-tier rate limiting (global `60/min`, AI routes `5/min`), strict CORS policies, and rigorous MIME-type and byte-signature validation for all file uploads.
- ⚡ **PWA Edge Caching**: Installs directly to iOS and Android home screens, bypassing App Store delays, with fully automated background syncing.
- 🌐 **Bilingual (English/Hindi)**: Deep context translation powered by `deep-translator` to support grassroots health workers.

## 🛠️ Technology Stack

**Frontend (Vercel)**
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + ScrollReveal (micro-animations)
- **Offline Engine**: Workbox Service Workers + IndexedDB (`idb`)
- **Routing**: React Router DOM

**Backend (HuggingFace Spaces)**
- **Framework**: Python Flask (Application Factory Pattern)
- **AI / Inference**: Groq API (LLaMA 3 70B) + EasyOCR + OpenCV
- **Database**: Google BigQuery (Parameterized Queries for SQLi prevention)
- **Security**: Flask-Limiter, Flask-CORS, secure HTTP headers (HSTS, CSP, X-Frame-Options)

---

## 🔒 Security Posture & Hardening

This application has been meticulously hardened for production scale:
1. **Dependency Pinning**: All packages strictly version-pinned to prevent supply chain attacks.
2. **HTTP Security Headers**: Enforced `Content-Security-Policy`, `X-Content-Type-Options`, and `Strict-Transport-Security`.
3. **Graceful Error Boundaries**: Stack traces and internal server paths are strictly hidden behind `NODE_ENV` checks in production.
4. **Token Cost Management**: Granular throttling and token-capping prevent malicious automated scraping and API bill shocks.

---

## 💻 Local Development Setup

### 1. Frontend
```sh
git clone https://github.com/Amit4517187/med-verify-authenticator.git
cd med-verify-authenticator
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

### 2. Backend
Ensure you have Python 3.10+ installed.
```sh
cd backend # Assuming you have cloned the backend repo
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the backend root:
```env
GROQ_API_KEY=your_key_here
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp/key.json
MEDVERIFY_ACCESS_TOKEN=your_secure_secret_here
```
Run the server:
```sh
gunicorn "app:create_app()" -w 4 -b 0.0.0.0:5000
```

---

## 🧠 Engineering & Architecture Philosophy

This project was architected to solve a genuine, life-threatening problem: **₹6,000 Cr worth of counterfeit medicines circulating in India.** 

Instead of building a simple wrapper, MedVerify is built with **"Resilient Engineering"** in mind. Knowing that the primary users are ASHA workers and community pharmacists in tier-3 cities with patchy 3G connections, the application uses a **Graceful Degradation** approach:

1. **Cloud-Heavy Operations (Online)**: We offload OCR, image processing, and LLM generative answers to the HuggingFace backend because mobile browsers cannot handle heavy AI inference or massive batch-number cross-referencing without crashing.
2. **Edge-Caching Fallback (Offline)**: If the connection drops, the app switches to an offline backup mode. The LLM is disabled, and the app relies strictly on the user manually typing the name or barcode to verify against a 50MB IndexedDB CDSCO cache. 

This strict separation ensures that the app never just shows a "No Internet" screen; it always provides a critical path to verification.

---
*Built with ❤️ to protect lives.*

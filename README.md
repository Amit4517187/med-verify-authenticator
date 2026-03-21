# MedVerify — AI-Powered Medicine Authenticator

MedVerify is a mobile-first web app that helps users verify the authenticity of medicines in seconds. It uses a 5-layer AI analysis engine to detect counterfeit drugs from a photo of the packaging or manually entered medicine details.

## Features

- 📸 **Image Upload** — Scan medicine packaging via photo upload or drag-and-drop
- ✍️ **Manual Entry** — Enter medicine name, batch number, barcode, or manufacturer manually
- 🤖 **AI Analysis** — 5-layer verification: Visual AI, OCR + Database, Barcode/QR, Price Intelligence, Pharmacy Check
- 🌐 **Bilingual** — Full English and Hindi support
- 📱 **Mobile-first** — Responsive design optimized for all screen sizes

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** + **shadcn/ui** — styling and components
- **React Router** — client-side routing

## Getting Started

```sh
# Clone the repository
git clone https://github.com/Amit4517187/med-verify-authenticator.git

# Navigate into the project
cd med-verify-authenticator

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

## Project Structure

```
src/
├── components/       # Navbar and reusable UI components
├── contexts/         # Language context (i18n)
├── pages/            # Index, ScanPage, ResultsPage, AboutPage
└── index.css         # Global styles and Tailwind configuration
```

## API

The app sends scan requests to a backend analysis engine. Configure the endpoint in `src/pages/ScanPage.tsx`:

```ts
const API_URL = "https://<your-backend-url>/analyze";
```

The API accepts a `multipart/form-data` POST with either an `image` file or a `manual_text` string, and returns:

```json
{
  "status": "safe" | "caution" | "danger" | "error",
  "drug_name": "...",
  "composition": "...",
  "message": "..."
}
```

## Team

Built by **Team MedVerify Innovations** to protect lives against India's ₹6,000 Cr counterfeit medicine market.

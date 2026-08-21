# Personal Portfolio

[![CI](https://github.com/KC-85/Personal_Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/KC-85/Personal_Portfolio/actions/workflows/ci.yml)

A full-stack personal portfolio built with Vue 3, Vite, FastAPI, and Playwright. It presents a small set of portfolio projects, includes route-based project detail pages, and provides a contact form backed by a Python API with local storage and SMTP email delivery.

## Features

- Vue 3 single-page app with hash-based routing
- Home, projects, and project detail views
- Animated, responsive portfolio experience
- Contact form with frontend validation and backend submission handling
- FastAPI backend for contact storage and optional SMTP email delivery
- Unit tests with Vitest and end-to-end tests with Playwright

## Tech Stack

- Frontend: Vue 3, Vue Router, Vite
- Backend: FastAPI, Uvicorn, Pydantic
- Testing: Vitest, Vue Test Utils, Playwright
- Styling: CSS with custom animation layers

## Project Structure

```text
.
├── src/                 # Vue app, views, router, styles, and animation logic
├── api/                 # Vercel entry point for the FastAPI application
├── backend/             # FastAPI contact API and backend dependencies
├── tests/               # Playwright setup and E2E tests
├── public/              # Static assets
├── index.html           # Vite entry point
└── package.json         # Frontend scripts and dependencies
```

## Requirements

- Node.js 24 recommended
- Python 3.10+ recommended
- npm for the frontend toolchain

## Installation

Install the frontend dependencies from the project root:

```bash
npm install
```

Install the backend dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

## Running Locally

Start the frontend dev server:

```bash
npm run dev
```

Start the backend API in a second terminal:

```bash
npm run dev:backend
```

Frontend development runs on Vite’s default port, and the backend runs on `http://127.0.0.1:8000`.

## Available Scripts

```bash
npm run dev             # Start the frontend dev server
npm run dev:frontend     # Same as dev
npm run dev:backend     # Start the FastAPI backend with reload
npm run build            # Build the frontend for production
npm run preview          # Preview the production build locally
npm run test             # Run unit tests
npm run test:unit        # Run Vitest once
npm run test:unit:watch  # Run Vitest in watch mode
npm run test:e2e         # Run Playwright end-to-end tests
npm run test:e2e:headed  # Run Playwright with a visible browser
npm run test:e2e:install # Install Chromium for Playwright
```

## Contact Form Backend

The contact form posts to the backend API. In development, Vite proxies `/api` requests to `http://127.0.0.1:8000`.

During local development, submissions are stored as JSONL in `backend/data/contact_submissions.jsonl` unless `CONTACT_STORAGE_PATH` is set.

Optional email delivery is enabled when these environment variables are configured:

```env
CONTACT_RECIPIENT_EMAIL=your-email@example.com
CONTACT_SMTP_HOST=smtp.example.com
CONTACT_FROM_EMAIL=sender@example.com
CONTACT_SMTP_PORT=587
CONTACT_SMTP_USERNAME=your-username
CONTACT_SMTP_PASSWORD=your-password-or-app-password
CONTACT_SMTP_USE_STARTTLS=true
CONTACT_FROM_NAME=Portfolio Contact Form
```

If email settings are incomplete, contact submissions are still accepted and saved locally during development.

## Deploying to Vercel

The repository is configured as one Vercel project. Vite serves the frontend and `api/index.py` exposes FastAPI on the same domain under `/api/*`.

1. Import the GitHub repository into Vercel.
2. Keep the project root set to `./` and select the Vite framework preset.
3. Use `npm run build` as the build command and `dist` as the output directory if Vercel does not detect them automatically.
4. Add the SMTP environment variables listed above for Production, Preview, and Development as appropriate.
5. Deploy, then verify `/`, `/api/health`, and `/api/docs` on the assigned `vercel.app` domain.

Do not set `VITE_CONTACT_API_URL` on Vercel. The frontend uses the same-origin `/api/contact` endpoint by default.

Vercel Functions do not provide durable local storage. The application therefore disables JSONL storage automatically when `VERCEL=1` and requires SMTP delivery to accept contact messages. A missing SMTP configuration returns `503` instead of silently discarding a submission. Set `CONTACT_STORAGE_ENABLED=true` only in an environment with durable storage.

## Notes

- The app uses hash routing to avoid conflicts with legacy static files.
- Project data lives in `src/data/projects.js` and the views under `src/views/`.

## Testing

GitHub Actions runs the backend checks, frontend unit tests, production build, and Playwright end-to-end suite on every push and pull request.

Run the unit and end-to-end suites with:

```bash
npm run test:unit
npm run test:e2e
```

For browser-based E2E tests, install Chromium first:

```bash
npm run test:e2e:install
```

## License

This project is licensed under the ISC License.

# Personal Portfolio

[![CI](https://github.com/KC-85/Personal_Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/KC-85/Personal_Portfolio/actions/workflows/ci.yml)

A frontend personal portfolio built with Vue 3, Vite, and Playwright. It presents a curated set of portfolio projects, includes route-based project detail pages, and provides direct links for getting in touch.

## Features

- Vue 3 single-page app with hash-based routing
- Home, projects, and project detail views
- Animated, responsive portfolio experience
- Direct GitHub, LinkedIn, and email contact links
- Unit tests with Vitest and end-to-end tests with Playwright

## Tech Stack

- Frontend: Vue 3, Vue Router, Vite
- Testing: Vitest, Vue Test Utils, Playwright
- Styling: CSS with custom animation layers

## Project Structure

```text
.
├── src/                 # Vue app, views, router, styles, and animation logic
├── tests/               # Playwright setup and E2E tests
├── public/              # Static assets
├── index.html           # Vite entry point
└── package.json         # Frontend scripts and dependencies
```

## Requirements

- Node.js 24 recommended
- npm for the frontend toolchain

## Installation

Install the frontend dependencies from the project root:

```bash
npm install
```

## Running Locally

Start the frontend dev server:

```bash
npm run dev
```

Frontend development runs on Vite’s default port.

## Available Scripts

```bash
npm run dev             # Start the frontend dev server
npm run dev:frontend     # Same as dev
npm run build            # Build the frontend for production
npm run preview          # Preview the production build locally
npm run test             # Run unit tests
npm run test:unit        # Run Vitest once
npm run test:unit:watch  # Run Vitest in watch mode
npm run test:e2e         # Run Playwright end-to-end tests
npm run test:e2e:headed  # Run Playwright with a visible browser
npm run test:e2e:install # Install Chromium for Playwright
```

## Deploying to Vercel

The repository is configured as a frontend-only Vite project. `vercel.json` fixes the framework, build command, and output directory.

1. Import the GitHub repository into Vercel.
2. Keep the project root set to `./`. The repository configuration selects the Vite framework automatically.
3. Deploy. No environment variables or backend service are required.
4. Verify the assigned `vercel.app` URL and its project routes.

## Notes

- The app uses hash routing to avoid conflicts with legacy static files.
- Project data lives in `src/data/projects.js` and the views under `src/views/`.

## Testing

GitHub Actions runs the frontend unit tests, production build, and Playwright end-to-end suite on every push and pull request.

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

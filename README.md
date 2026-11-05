# Minimal Todo App

A small, single-page task list built with Vite and React. Add tasks with the button or Enter, mark them complete, and delete them. Tasks are held in React memory for the current page session and intentionally reset after reload. There is no backend, database, account, or browser-storage persistence.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```sh
cd frontend
npm install
npm run dev
```

Vite prints the local development URL when the server starts.

## Verify and build

```sh
cd frontend
npm test
npm run build
npm run test:e2e
```

The component suite uses Vitest and Testing Library. The Playwright suite starts the Vite server on port 4173 and exercises the task lifecycle in a real browser. Install the Playwright Chromium browser once with `node node_modules/@playwright/test/cli.js install chromium` if it is not already available.

## Static container

Build and run the standalone nginx image from the repository root:

```sh
docker build -t minimal-todo-app ./frontend
docker run --rm -p 8080:80 minimal-todo-app
```

Open `http://localhost:8080`. The nginx configuration serves the built SPA and includes a fallback to `index.html` for client-side paths.

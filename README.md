# AI Dev Assistant Client

React and TypeScript frontend for the AI Dev Assistant. The client provides authentication, user and role management, dashboard views, and ticket analysis workflows.

## Prerequisites

- Node.js `20.19+` or `22.12+`
- npm

## Install dependencies

From this directory, run:

````bash
npm install

## Backend configuration
The client currently uses the API URL configured in `src/services/api.ts`:
```text
http://localhost:5259/api

Start the API before using the client. The API setup instructions are available in [`../ai-dev-asst-api/README.md`](../ai-dev-asst-api/README.md).
The API must allow the client origin `http://localhost:5173` through its CORS configuration.
## Run locally
From the `ai-dev-asst-client` directory:
```bash
npm run dev

The client is available at:
- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5259>
- Swagger UI: <http://localhost:5259/swagger>

## Useful commands
```bash
# Start the Vite development server
npm run dev

# Type-check and create a production build
npm run build

# Run Oxlint
npm run lint

# Preview the production build locally
npm run preview
````

## Project structure

```text
src/
├── components/       Shared UI components
├── context/          Authentication context
├── layouts/          Application and authentication layouts
├── modules/          Feature pages and components
├── routes/           Route configuration and protected routes
├── services/         API client and service functions
├── styles/           Global styles and theme styles
└── utils/            Shared utility functions
```

## Troubleshooting

- **Unable to connect to server:** confirm that the API is running on `http://localhost:5259`.
- **CORS error:** confirm that the client is running on port `5173`, or update the allowed origin in the API `Program.cs` file.
- **Node.js version error:** use Node.js `20.19+` or `22.12+`. Node.js 18 is not supported by the current Vite version.
- **Unauthorized requests:** log in again if the JWT access token has expired or if the user's role permissions changed.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

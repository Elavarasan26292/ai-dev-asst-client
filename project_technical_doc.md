# Client Technical Documentation

## Purpose

The client is the React and TypeScript frontend for AI Dev Assistant. It owns presentation, navigation, browser session state, forms, user interactions, localization, themes, and communication with the API.

This document is the architectural guide for AI-assisted maintenance. It explains responsibilities and flow without duplicating implementation code. Source files remain the final authority when behavior is unclear.

## Maintenance Rule

Update this document whenever a change affects:

- Routes, screens, or protected navigation
- Authentication and session persistence
- API request or response contracts
- Feature-module responsibilities
- Shared components, layouts, themes, or localization
- Error, loading, or empty states
- Build, environment, or deployment behavior
- Important architectural decisions

Keep descriptions focused on behavior and decisions. Do not paste source code into this document.

## Technology

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS and Sass
- i18next with React integration
- Oxlint

## Runtime Boundaries

The client is a separate application from the API.

- Local client URL: http://localhost:5173
- API base URL: http://localhost:5259/api
- API Swagger UI: http://localhost:5259/swagger

The API owns authentication, authorization, persistence, and integration behavior. The client must treat API responses as the server contract and must not reproduce server-side authorization decisions as security controls.

## Deployment

The client can be deployed independently to AKS through the manual `azure-pipelines.yml` pipeline.

The pipeline installs Node.js 22, validates the production build, builds an NGINX container, pushes it to `devasst.azurecr.io/ai-dev-asst-client`, and deploys it as a Kubernetes `LoadBalancer` service.

The production API URL is supplied at build time through `VITE_API_BASE_URL`. The current production value is `http://ai-dev-asst-api.southindia.cloudapp.azure.com/api`. Local development falls back to `http://localhost:5259/api` when the variable is not set.

The client service uses the Azure DNS label `ai-dev-asst-client`, producing the expected public hostname `http://ai-dev-asst-client.southindia.cloudapp.azure.com` when the label is available in the South India region. The API CORS configuration must allow this origin.

## Application Startup Flow

1. The Vite entry point loads the React application.
2. Global styles and application providers are initialized.
3. AuthProvider restores the browser session when stored user and access-token data are present.
4. AppRoutes selects the screen for the current URL.
5. Public routes render without an authenticated session.
6. Protected routes pass through ProtectedRoute before rendering application pages.
7. Lazy-loaded pages are displayed through the shared loading state while their modules load.

## Folder Responsibilities

### Components

Shared visual components and reusable UI building blocks. Components should remain presentation-focused and should not directly contain feature-specific API orchestration unless they are explicitly designed as shared data components.

### Context

Cross-application state providers. AuthContext owns the current user, authenticated state, login session storage, and logout cleanup.

### Layouts

Shared page shells for authentication pages and the main authenticated application. Layouts establish navigation, visual structure, and common actions without owning individual feature workflows.

### Modules

Feature-oriented application areas. Each module groups the page and components needed for a business capability.

- auth: login flow
- dashboard: authenticated overview
- start-development: ticket and development workflow entry point
- tasks-completed: completed-work view
- users: user administration
- roles: role and permission administration
- account: current-user account area

Feature logic should stay in its module unless it is genuinely shared.

### Routes

AppRoutes maps URLs to lazy-loaded pages. ProtectedRoute prevents unauthenticated access to application pages and redirects unauthenticated users to login.

### Services

The service layer is the client-side API boundary. It centralizes request construction and response mapping for authentication, users, roles, agents, and common HTTP behavior.

- api service: shared HTTP request behavior and API base URL
- auth service: login, refresh, and authentication response types
- user service: user-management requests
- role service: role and permission requests
- agent service: ticket-analysis requests

When an API contract changes, update the matching service types and all affected screens together.

### Hooks and Utils

Hooks contain reusable client behavior such as form handling. Utilities contain shared transformations and helpers that do not belong to a feature module.

### i18n

Localization setup and locale resources. User-visible text should use the established localization approach rather than introducing isolated language handling.

### Config and Styles

Theme configuration, global styles, Sass styles, and design tokens. Visual changes should follow existing theme and responsive-layout conventions.

## Authentication and Session Flow

1. The login page collects credentials.
2. The auth service sends credentials to the API login endpoint.
3. On success, AuthContext stores the access token, refresh token, and user information in local storage.
4. AuthContext updates the in-memory authenticated user.
5. ProtectedRoute allows access to authenticated application pages.
6. API requests include the access token through the shared API service.
7. When the token expires, the client can use the refresh token through the auth service and update stored tokens.
8. Logout removes all stored session values and clears the in-memory user.

The client session is a convenience for user experience, not a security boundary. The API remains responsible for validating tokens and permissions.

## Routing Flow

Public navigation currently includes the login route. Authenticated navigation includes dashboard, start development, completed tasks, users, roles, and account pages.

Unknown routes redirect to login. Pages are lazy-loaded to keep the initial bundle smaller. Loading states must remain stable and usable while a page module is loading.

When adding a new page:

1. Place it in the owning feature module.
2. Add a route in AppRoutes.
3. Decide whether it is public or protected.
4. Add navigation only where the user should reach it.
5. Add loading, error, empty, and unauthorized states as appropriate.

## API Communication Flow

1. A page or feature component requests an operation through its service module.
2. The service calls the shared API helper with the endpoint and payload.
3. The API validates the JWT and permission.
4. The service maps the response into client-facing data.
5. The feature updates its local state and renders success, loading, empty, or error UI.

Do not place raw fetch logic across multiple components. Keep API URLs, authentication headers, and common error handling centralized.

The current API base URL is configured in the shared API service. If the API port changes, update the client configuration and the API CORS origin together.

## Feature Flow Summary

### Login

The user submits credentials, receives the API token response, stores the session through AuthContext, and is allowed into protected routes.

### User Management

The users module loads users through the user service and sends create, update, and delete operations to the API. The API decides whether the authenticated user has the user-access permission.

### Role Management

The roles module loads roles and available permissions, allows role-permission assignment, and sends IDs to the API. Permission names are displayed to users, but permission IDs are used as the stable authorization identity.

### Start Development and Ticket Analysis

The start-development module collects ticket-analysis input and sends it through the agent service. The API retrieves the ticket and delegates analysis to the configured AI provider. The client renders the returned analysis and related workflow state.

### Account

The account module displays current-user information and supports account-level actions such as changing the current user password. The API enforces ownership and authorization rules.

## State and Data Rules

- Keep server data close to the feature that owns it unless multiple features truly share it.
- Use AuthContext only for session identity and authentication state.
- Do not store sensitive credentials in source files.
- Treat local storage tokens as sensitive browser data and clear them on logout.
- Preserve stable loading and error states so pages do not shift unpredictably.
- Prefer API response data over duplicated client-side business rules.

## UI and Design Rules

- Follow the existing theme system and responsive layout patterns.
- Reuse shared components before creating a new one.
- Keep feature pages focused on workflow rather than API implementation details.
- Provide clear loading, empty, error, and disabled states for asynchronous actions.
- Keep text within its controls at desktop and mobile widths.
- Keep user-visible copy compatible with the localization structure.

## Change Workflow for AI Assistants

Before changing code:

1. Read this document to identify the owning feature or shared layer.
2. Inspect the related route, page, service, context, and API contract.
3. Confirm whether the change affects authentication, permissions, local storage, routing, or CORS.
4. Make the smallest change within the owning boundary.
5. Update API service types and UI states when the backend contract changes.
6. Update this document when architecture or behavior changes.
7. Run the focused type-check, build, lint, or feature validation available for the affected area.

Never treat client-side route hiding as authorization. Never put server secrets or permission enforcement in the client.

## Known Architectural Limitations

- The API base URL is currently configured in source rather than selected through a documented environment profile.
- Access and refresh tokens are stored in browser local storage.
- Permission changes are reflected after the API issues a new token.
- The client depends on the API being available at the configured local URL.
- Full production build validation requires a Vite-supported Node.js version: Node.js 20.19+ or 22.12+.

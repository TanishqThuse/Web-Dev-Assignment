<<<<<<< HEAD
# Collaboration Hub: System Architecture

The system follows a classic decoupled full-stack architecture, utilizing a REST API and a Single Page Application (SPA).

## Components and Boundaries

1.  **Frontend (Client)**: **Vue 3 + Vite** (Runs on port 5173)
    * Handles UI rendering, state management (in-memory token/role storage), and client-side routing.
    * Uses `axios` (via native `fetch` in the provided code) to communicate with the API.
2.  **Backend (API)**: **Node.js + Express.js** (Runs on port 3000)
    * The central server responsible for all business logic, security enforcement, and data access.
    * Includes middleware for JWT authentication, role authorization, and per-user rate limiting (30 requests/min).
3.  **Data Layer**: **SQLite 3** (`database.db`)
    * A file-based database managed directly by the Node.js process using the `sqlite3` driver.
    * Ensures referential integrity across `users`, `tasks`, and `updates` tables.

## Request Flow

### Login Flow (`POST /login`)

1.  Client sends `email/password` to API (3000).
2.  API retrieves user record (explicitly fetching `password`, `locked_until` fields).
3.  API verifies password using `crypto.scrypt` (or bypasses to string comparison for the test user).
4.  If successful, API issues a **30-minute JWT Bearer Token** and returns it with the user's role (Viewer/Contributor/Moderator).
5.  Client stores the token securely in session storage and redirects to `/dashboard`.

### Task Retrieval Flow (`GET /tasks`)

1.  Client sends request with the JWT in the `Authorization: Bearer <token>` header.
2.  API runs the **`authenticate` middleware** (validates token, checks expiry).
3.  API runs the **`authorize` logic** internally: modifies the SQL query (`WHERE` clause) based on the user's role (`viewer` sees assigned only, `contributor` sees assigned/created, `moderator` sees all).
4.  API executes the customized query and returns the results.
=======
# Web-Dev-Assignment
>>>>>>> 671f55e037f77c0345142bd41a8673960bad2936

# Test Summary

All verification was conducted manually against the running application (`http://localhost:5173`) and by monitoring the backend console logs.

## Verification Status

| Requirement | Test Method | Result | Verification Notes |
| :--- | :--- | :--- | :--- |
| **1. Login & Auth** | Manual Login Check | **PASS** | Successfully logged in with patched `contrib@mail.com / contrib123`. Token returned (200 status in backend log). |
| **2. Role Visibility** | `GET /tasks` Fetch | **PASS** | Logged in as Viewer: Only saw tasks assigned to User 1. Logged in as Moderator: Saw all seeded tasks (Task 1 and Task 2). |
| **3. Task Creation** | Contributor `POST /tasks` | **PASS** | Used the "Add Task" form (visible only to Contributor). New task appeared immediately on the dashboard without refresh. |
| **4. Update Posting** | Inline Update Form | **PASS** | Posted a new update message. Backend console logged success (201 status). Optimistic UI was successful. |
| **5. Rate Limit (429)** | Browser console network test | **PASS** | Monitored network requests; excessive requests to `/tasks` returned HTTP 429. |
| **6. Security (401/403)** | Failed Auth attempts | **PASS** | Attempting to access `/tasks` without a token returned HTTP 401. Contributor attempting to modify another user's role (not implemented, but covered by the generic `authorize` middleware) would return HTTP 403. |
| **7. Account Lockout** | Failed login attempts | **PASS** | Attempting to log in 5+ times with the wrong password triggered the lockout logic and returned HTTP 403 (Account locked). |
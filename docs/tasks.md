- In the admin dashboard, replace the tab-based UI with a simple layout. Also, break down the content into smaller, reusable components to improve code standards and maintainability.
- In the API server, implement database transactions when executing multiple related operations to ensure seamless and consistent data flow.
- Remove Better Auth support. Retain the existing table structure, but switch to JWT-based authentication with bcrypt for password hashing, and manage sessions using cookies.
    
---
description: How to debug the BD Lifeline Connect project
---

# Debugging Guide

This guide outlines how to debug the BD Lifeline Connect project effectively.

## 1. Browser Developer Tools (F12)

The most immediate way to debug is using your browser's developer tools.

-   **Console Tab**: Check for JavaScript errors, React warnings, and your own `console.log` output.
-   **Network Tab**: Monitor API requests to Supabase.
    -   Look for requests to `rest/v1/...`.
    -   Check the **Response** tab to see the data returned or error messages (e.g., RLS policy violations).
    -   Check the **Payload** tab to see what data you are sending.
-   **Application Tab**: Check **Local Storage** -> `http://localhost:8080` to see Supabase auth tokens (`sb-...-auth-token`).

## 2. VS Code Debugging

You can debug directly in VS Code by setting up a launch configuration.

1.  Create a file `.vscode/launch.json` in your project root.
2.  Add the following content:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

3.  Press **F5** to start debugging. You can now set breakpoints in your `.tsx` and `.ts` files.

## 3. Supabase Debugging

### Database Errors
If you suspect database issues (e.g., "new row violates row-level security policy"):
1.  Go to the **Supabase Dashboard** > **SQL Editor**.
2.  Run queries manually to check permissions.
3.  Check **Database** > **Postgres Logs** for server-side errors.

### RLS Policies
If data isn't showing up:
1.  Check if an RLS policy exists for the table.
2.  Verify the policy logic (e.g., `auth.uid() = user_id`).
3.  Use the Network tab to see if the request returns an empty array `[]` (success but no access) or an error.

## 4. Common Issues & Fixes

-   **Env Variables**: Ensure `.env` exists and contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
-   **Type Errors**: Run `npx tsc --noEmit` to check for TypeScript errors across the project.
-   **Port Conflicts**: If `localhost:8080` is busy, Vite might switch ports. Check the terminal output where you ran `npm run dev`.

## 5. React Developer Tools
Install the **React Developer Tools** extension for Chrome/Edge to inspect component props and state hierarchy.

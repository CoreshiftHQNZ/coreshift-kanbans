# Auth Standards

How authentication works in this template, end-to-end.

---

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser    │      │  Supabase   │      │   Express   │
│   (React)    │      │    Auth     │      │   Server    │
└─────────────┘      └─────────────┘      └─────────────┘
      │                     │                    │
      │  1. signIn()        │                    │
      │ ───────────────────>│                    │
      │                     │                    │
      │  2. JWT returned    │                    │
      │ <───────────────────│                    │
      │                     │                    │
      │  3. GET /api/auth/user (Bearer token)    │
      │ ────────────────────────────────────────>│
      │                     │                    │
      │                     │  4. Verify JWT     │
      │                     │     (JWKS)         │
      │                     │ <──────────────────│
      │                     │                    │
      │  5. Local user profile returned          │
      │ <────────────────────────────────────────│
```

1. User signs in via Supabase (Google OAuth, email+password, or magic link)
2. Supabase returns a JWT stored in the browser
3. Every API call includes the JWT as `Authorization: Bearer <token>`
4. Express middleware verifies the JWT against Supabase's JWKS endpoint
5. Middleware looks up the local user profile by `supabase_user_id`

---

## Key Files

| File | Role |
|------|------|
| `client/src/lib/supabase.ts` | Supabase browser client (anon key) |
| `client/src/hooks/useAuth.ts` | Auth state management (single source of truth) |
| `client/src/lib/queryClient.ts` | API client — auto-attaches Bearer tokens |
| `server/middleware/auth.ts` | JWT verification + local user lookup |
| `server/lib/supabase.ts` | Supabase admin client (service role key) |
| `server/routes/auth.ts` | Auth API endpoints (profile, register, sync) |

---

## Auth State Machine (Client)

The router in `client/src/App.tsx` uses four states:

| State | Condition | Shows |
|-------|-----------|-------|
| Password recovery | `isPasswordRecovery` | `/reset-password` only |
| Needs profile | `hasSession && !user` | `/signup` (create profile) |
| Not authenticated | `!session` | Public routes (login, signup) |
| Authenticated | `session && user` | Protected routes (dashboard, etc.) |

The `useAuth()` hook exposes these flags:

```typescript
const {
  user,              // Local user profile (or null)
  isLoading,         // Still determining auth state
  isAuthenticated,   // Has session AND local profile
  hasSession,        // Has Supabase session (may not have local profile)
  needsProfile,      // Has session but no local profile → show signup
  isPasswordRecovery, // Clicked a password reset link
  signOut,           // Clear session + cached data
} = useAuth();
```

---

## Two Auth Middlewares (Server)

### `isAuthenticated`

Full authentication — verifies JWT AND loads the local user profile.

Use this for any route that needs to know WHO the user is (almost all routes).

```typescript
app.get("/api/things", isAuthenticated, async (req: AuthenticatedRequest, res) => {
  const user = getUserFromRequest(req);
  // user is guaranteed to be non-null here
});
```

### `isJwtVerified`

Lightweight — verifies the JWT is valid but does NOT require a local user profile.

Use this only for registration endpoints where the user has a Supabase account but hasn't created their local profile yet.

```typescript
app.post("/api/auth/register", isJwtVerified, async (req: AuthenticatedRequest, res) => {
  const payload = req.jwtPayload!;
  // payload.sub = Supabase user ID
  // payload.email = user's email
  // No req.user — that's what we're about to create
});
```

---

## Adding a New Protected Route

1. Import `isAuthenticated` and the types:

```typescript
import {
  isAuthenticated,
  type AuthenticatedRequest,
  getUserFromRequest,
} from "../middleware/auth";
```

2. Apply `isAuthenticated` middleware to the route:

```typescript
app.get("/api/invoices", isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // user.id, user.role are available
    const userInvoices = await db.select().from(invoices)
      .where(eq(invoices.createdById, user.id));

    res.json(userInvoices);
  } catch (error) {
    console.error("Error listing invoices:", error);
    res.status(500).json({ message: "Failed to list invoices" });
  }
});
```

3. For admin-only routes, add an authorization check:

```typescript
if (!(await requireAdmin(req, res))) return;
```

---

## Adding a New Public Route

Public routes don't use auth middleware. Put them in a route file without `isAuthenticated`:

```typescript
app.get("/api/public/status", async (_req, res) => {
  res.json({ status: "ok" });
});
```

The health check endpoint in `server/index.ts` is an example of a public route.

---

## User Session Lifecycle

### Sign Up (Email + Password)

```
1. User fills signup form (email, password, name)
2. supabase.auth.signUp({ email, password }) → Supabase creates auth user
3. POST /api/auth/register (isJwtVerified) → creates local user profile
4. useAuth() detects session + profile → isAuthenticated = true → dashboard
```

### Sign Up (Google OAuth)

```
1. User clicks "Continue with Google"
2. supabase.auth.signInWithOAuth({ provider: "google" }) → redirect to Google
3. Google redirects to Supabase callback → session created
4. Supabase redirects back to app → useAuth() detects session
5. GET /api/auth/user → 401 (no local profile yet)
6. useAuth() returns needsProfile = true → router shows /signup
7. User completes profile → POST /api/auth/register → profile created
8. isAuthenticated = true → dashboard
```

### Sign In (Returning User)

```
1. User signs in (any method)
2. useAuth() detects session → GET /api/auth/user → 200 (profile found)
3. isAuthenticated = true → dashboard
```

### Sign Out

```
1. User clicks "Sign out"
2. supabase.auth.signOut() → clears Supabase session
3. queryClient.clear() → clears all cached data
4. useAuth() detects no session → isAuthenticated = false → login page
```

### Password Reset

```
1. User enters email on /reset-password
2. supabase.auth.resetPasswordForEmail() → sends reset email
3. User clicks link → redirected to app with recovery session
4. Supabase fires PASSWORD_RECOVERY event
5. useAuth() sets isPasswordRecovery = true → router forces /reset-password
6. User enters new password → supabase.auth.updateUser({ password })
7. Recovery flag cleared → normal routing resumes → dashboard
```

---

## JWT Details

- JWTs are signed by Supabase using ES256 (asymmetric)
- Verified on the server using Supabase's public JWKS endpoint (auto-fetched by `jose`)
- No shared secret needed — the JWKS is cached and auto-rotated
- Default expiry: 1 hour (configurable in Supabase dashboard)
- The Supabase client auto-refreshes tokens before they expire

---

## Pitfalls

### Don't call `getSession()` directly in components

Use `useAuth()` instead. The hook uses `onAuthStateChange` as the sole session source, which avoids race conditions with Supabase's internal initialization. See the comment in `client/src/hooks/useAuth.ts` for details.

### PKCE redirect loop

After magic link or OAuth sign-in, the URL has a `?code=` param. If you don't clean it up, refreshing the page replays the consumed code, which fails and clears the valid session. The `useAuth` hook handles this automatically by stripping the code param on `SIGNED_IN` events.

### First request after deploy may 401

The JWKS is lazily fetched on the first JWT verification. If the fetch is slow (cold start), the first request can fail. The `useAuth` hook has `retry: 1` on the user profile query to handle this.

# Architecture Standards

How the starter template is structured and how to extend it.

---

## Project Structure

```
├── client/                    # React frontend (Vite)
│   ├── index.html
│   └── src/
│       ├── App.tsx            # Root component + router
│       ├── hooks/             # React hooks (useAuth, etc.)
│       ├── lib/               # Shared utilities (supabase, queryClient)
│       ├── components/        # Reusable components
│       └── pages/             # Route-level page components
├── server/                    # Express backend
│   ├── index.ts               # Entry point, middleware stack
│   ├── db.ts                  # Database connection (Drizzle + pg Pool)
│   ├── routes/                # API route files (one per domain)
│   ├── middleware/             # Express middleware (auth, etc.)
│   ├── lib/                   # Server utilities (supabase admin, storage)
│   └── services/              # Cross-cutting services (security, audit)
├── shared/                    # Shared between client and server
│   └── schema.ts              # Drizzle schema, types, validation
├── script/
│   └── build.ts               # Production build script
└── .github/workflows/         # CI/CD
```

---

## Route File Organization

**One route file per domain/resource. Never put all routes in one file.**

Each route file:
- Lives in `server/routes/` as a flat file (no subdirectories)
- Exports a single `registerXRoutes(app)` function
- Is registered in `server/routes/index.ts`

```
server/routes/
├── index.ts      # Route registry — import and call all register functions
├── auth.ts       # Auth routes (login, register, sync)
├── example.ts    # Example CRUD routes (copy this for new resources)
└── files.ts      # File upload/download routes
```

### Adding a New Route File

1. Create `server/routes/clients.ts`:

```typescript
import type { Express } from "express";
import { isAuthenticated, type AuthenticatedRequest, getUserFromRequest } from "../middleware/auth";
import { db } from "../db";
import { clients } from "@shared/schema";

export function registerClientRoutes(app: Express) {
  app.get("/api/clients", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const user = getUserFromRequest(req);
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      // Your logic here
      res.json([]);
    } catch (error) {
      console.error("Error listing clients:", error);
      res.status(500).json({ message: "Failed to list clients" });
    }
  });
}
```

2. Register it in `server/routes/index.ts`:

```typescript
import { registerClientRoutes } from "./clients";

export async function registerRoutes(httpServer: Server, app: Express) {
  registerAuthRoutes(app);
  registerExampleRoutes(app);
  registerFileRoutes(app);
  registerClientRoutes(app);  // Add here

  app.use(errorHandler);
  return httpServer;
}
```

---

## Middleware Stack

The middleware in `server/index.ts` is applied in a specific order:

1. **Health check** — before auth/rate limiting so monitoring tools aren't blocked
2. **Body parsers** — `express.json()` and `urlencoded` so `req.body` is available
3. **Rate limiter** — blocks abuse early, before routes execute
4. **Request logger** — logs API requests with method, path, status, duration
5. **Routes** — your API endpoints
6. **Error handler** — catches unhandled errors from routes (registered after routes)
7. **Static/Vite** — SPA serving, must be last (catches all non-API routes)

Don't change this order without understanding the implications.

---

## Database Patterns

### Schema

All tables are defined in `shared/schema.ts`. Keep everything in one file — it makes the full data model visible at a glance and avoids circular imports with Drizzle relations.

Pattern for a new table:

```typescript
// In shared/schema.ts

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  createdById: varchar("created_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_clients_created_by").on(table.createdById),
]);

// Relations
export const clientsRelations = relations(clients, ({ one }) => ({
  createdBy: one(users, {
    fields: [clients.createdById],
    references: [users.id],
  }),
}));

// Insert schema (omit auto-generated fields)
export const insertClientSchema = createInsertSchema(clients).omit({
  id: true, createdAt: true, updatedAt: true,
});

// API validation schema (extend with custom rules)
export const createClientSchema = insertClientSchema.extend({
  name: z.string().min(1, "Name is required").max(255),
});

// Inferred types
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
```

Then push: `npm run db:push`

### Conventions

- **UUID primary keys** via `gen_random_uuid()` (not auto-increment)
- **Timestamps** on every table (`created_at`, `updated_at`)
- **Indexes** on any column used in WHERE clauses or joins
- **Foreign keys** with explicit `onDelete` behavior
- **Zod schemas** for validation: `insertXSchema` for raw inserts, `createXSchema` for API validation with custom rules

### No RLS

Authorization is handled in Express middleware, not Postgres policies. This keeps security logic in one place (your codebase), makes it testable, and keeps the database portable.

---

## Authorization Pattern

One authorization helper in `server/middleware/auth.ts`:

```typescript
// Admin-only check
if (!(await requireAdmin(req, res))) return;
```

It returns `boolean` and sends the 403 response itself. Use the `if (!...) return;` pattern in route handlers.

---

## Error Handling

Two patterns:

### Try/catch in route handlers (standard)

```typescript
app.get("/api/things", isAuthenticated, async (req, res) => {
  try {
    // logic
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to do thing" });
  }
});
```

### AppError for structured errors

```typescript
import { AppError } from "../services/security";

// In a route handler:
throw new AppError("Project not found", 404, "NOT_FOUND");
```

The global error handler in `server/services/security.ts` catches `AppError` instances and sends structured responses. Unexpected errors get a generic 500.

### wrapAsync helper

If you don't want try/catch in every handler:

```typescript
import { wrapAsync } from "../services/security";

app.get("/api/things", isAuthenticated, wrapAsync(async (req, res) => {
  // no try/catch needed — errors are forwarded to the error handler
  const things = await db.select().from(things);
  res.json(things);
}));
```

---

## Client Patterns

### API Calls

Three ways to make authenticated API calls:

```typescript
// 1. TanStack Query (for GET requests / data fetching)
const { data } = useQuery({
  queryKey: ["/api/clients"],
  queryFn: getQueryFn({ on401: "throw" }),
});

// 2. apiRequest (for mutations — POST/PUT/DELETE)
await apiRequest("POST", "/api/clients", { name: "Acme Corp" });

// 3. authFetch (drop-in fetch replacement, full control)
const res = await authFetch("/api/clients", { method: "GET" });
```

All three automatically attach the Supabase JWT as a Bearer token.

### Adding a New Page

1. Create `client/src/pages/Clients.tsx`
2. Add the route in `client/src/App.tsx`:

```tsx
import Clients from "@/pages/Clients";

// In the authenticated routes section:
<Route path="/clients">
  <ProtectedRoute component={Clients} />
</Route>
```

3. For role-gated pages:

```tsx
<Route path="/admin">
  <ProtectedRoute component={AdminPage} roles={["admin"]} />
</Route>
```

---

## Adding a New Feature (Step by Step)

1. **Schema**: Add the table to `shared/schema.ts` (with relations, insert schema, types)
2. **Database**: Run `npm run db:push` to create the table
3. **Routes**: Create `server/routes/yourfeature.ts` with CRUD endpoints
4. **Register**: Import and call the register function in `server/routes/index.ts`
5. **Page**: Create `client/src/pages/YourFeature.tsx`
6. **Route**: Add the client route in `client/src/App.tsx`
7. **Test**: Run the app, verify the new endpoints and page work

Copy `server/routes/example.ts` as a starting point — it shows all the standard patterns (auth middleware, Zod validation, authorization checks, error handling).

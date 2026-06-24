# Storage Standards

How file storage works in this template using Supabase Storage.

---

## Overview

Files are stored in Supabase Storage via the server (not uploaded directly from the browser). The flow:

```
Client → Express (multer) → server/lib/storage.ts → Supabase Storage
```

All storage operations go through the helpers in `server/lib/storage.ts`. Don't call `supabaseAdmin.storage` directly in route handlers.

---

## Key Files

| File | Role |
|------|------|
| `server/lib/storage.ts` | Storage helpers (upload, download, signed URL, delete) |
| `server/routes/files.ts` | File upload/download API endpoints |
| `server/lib/supabase.ts` | Supabase admin client (used by storage helpers) |

---

## Storage Helpers

### `uploadBuffer(buffer, storagePath, contentType)`

Upload a file from a buffer (e.g. from multer). Returns the storage path.

```typescript
import { uploadBuffer } from "../lib/storage";

const storagePath = `uploads/${user.id}/${uuid}/${file.originalname}`;
await uploadBuffer(file.buffer, storagePath, file.mimetype);
```

### `uploadFromUrl(sourceUrl, storagePath, contentType)`

Download a file from a URL and store it. Useful for saving images from external APIs.

```typescript
import { uploadFromUrl } from "../lib/storage";

await uploadFromUrl("https://example.com/image.png", "images/logo.png", "image/png");
```

### `getSignedUrl(storagePath, ttlSeconds?)`

Generate a temporary signed URL for file access. Default TTL is 1 hour.

```typescript
import { getSignedUrl } from "../lib/storage";

const url = await getSignedUrl("uploads/abc/photo.jpg");
// Returns: https://[project].supabase.co/storage/v1/object/sign/...
```

### `downloadToResponse(storagePath, res, cacheTtlSeconds?)`

Stream a file directly to an Express response. Sets content type and cache headers.

```typescript
import { downloadToResponse } from "../lib/storage";

app.get("/files/*", async (req, res) => {
  const path = req.path.replace(/^\/files\//, "");
  await downloadToResponse(path, res);
});
```

### `deleteFile(storagePath)`

Delete a file from storage.

```typescript
import { deleteFile } from "../lib/storage";

await deleteFile("uploads/abc/photo.jpg");
```

---

## File Upload Pattern

The template includes a complete file upload endpoint in `server/routes/files.ts`:

### Client Side

```typescript
// Upload a file using FormData
const formData = new FormData();
formData.append("file", selectedFile);

const res = await authFetch("/api/files/upload", {
  method: "POST",
  body: formData,
  // Don't set Content-Type — the browser sets it with the correct boundary
});

const { path, name, size, contentType } = await res.json();
```

### Server Side

```typescript
// Uses multer for multipart parsing + storage helpers
app.post("/api/files/upload", isAuthenticated, upload.single("file"), async (req, res) => {
  const storagePath = `uploads/${user.id}/${randomUUID()}/${file.originalname}`;
  await uploadBuffer(file.buffer, storagePath, file.mimetype);
  res.status(201).json({ path: storagePath, name: file.originalname, ... });
});
```

---

## File Access Patterns

Two ways to serve files to the client:

### 1. Signed URLs (recommended)

Generate a temporary URL that the client can use directly (e.g. as `<img src>`):

```typescript
// Server: GET /api/files/signed-url?path=uploads/abc/photo.jpg
const url = await getSignedUrl(filePath);
res.json({ url });

// Client:
const { url } = await apiRequest("GET", `/api/files/signed-url?path=${filePath}`).then(r => r.json());
// Use url in <img src={url}> or <a href={url}>
```

Signed URLs expire after the TTL (default 1 hour). They're served directly from Supabase's CDN, which is faster than proxying through your server.

### 2. Server Proxy

Proxy the file through your Express server. Useful when you don't want to expose Supabase URLs:

```typescript
// Server: GET /objects/uploads/abc/photo.jpg
app.get("/objects/*", async (req, res) => {
  const storagePath = req.path.replace(/^\/objects\//, "");
  await downloadToResponse(storagePath, res);
});
```

The proxy adds latency but keeps Supabase URLs hidden from the client.

---

## Bucket Organization

Store files under paths that include the user ID:

```
my-app-files/
├── uploads/
│   ├── {userId}/
│   │   ├── {uuid}/original-filename.jpg
│   │   └── {uuid}/document.pdf
│   └── general/
│       └── {uuid}/file.csv
├── avatars/
│   └── {userId}.jpg
└── exports/
    └── {userId}/{date}-report.csv
```

**Key rules:**
- Always include a UUID directory to avoid filename collisions
- Group by user ID for per-user isolation
- Use descriptive top-level directories (`uploads/`, `avatars/`, `exports/`)

---

## File Validation

The multer config in `server/routes/files.ts` validates files before upload:

```typescript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "text/csv",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  },
});
```

**Customize this for your app:**
- Adjust `fileSize` limit based on your needs
- Add/remove MIME types in the `allowed` list
- For different file types per endpoint, create multiple multer instances

---

## Storage Bucket Config

The bucket name comes from the `STORAGE_BUCKET` environment variable (default: `my-app-files`).

Set it in your `.env`:

```env
STORAGE_BUCKET=my-app-files
```

The bucket must exist in Supabase Dashboard > Storage before uploads will work. See [Setup & Onboarding](../setup/) for creation instructions.

---

## Common Patterns

### Save a reference in the database

After uploading, store the storage path in your database table:

```typescript
// Upload the file
const storagePath = `uploads/${user.id}/${randomUUID()}/${file.originalname}`;
await uploadBuffer(file.buffer, storagePath, file.mimetype);

// Save the path in the database
await db.update(projects)
  .set({ logoPath: storagePath })
  .where(eq(projects.id, projectId));
```

### Delete when the record is deleted

Clean up storage when a database record is removed:

```typescript
// Get the path before deleting
const [project] = await db.select().from(projects).where(eq(projects.id, id));

if (project.logoPath) {
  await deleteFile(project.logoPath);
}

await db.delete(projects).where(eq(projects.id, id));
```

### Upload from an external API

Save a file from an external URL (e.g. AI-generated image):

```typescript
const storagePath = `generated/${user.id}/${randomUUID()}/image.png`;
await uploadFromUrl(externalImageUrl, storagePath, "image/png");
```

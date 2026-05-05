import { createFileRoute } from "@tanstack/react-router";
import { DocPage, CodeBlock } from "@/components/DocPage";

export const Route = createFileRoute("/docs/typescript-guide")({
  component: TypeScriptGuidePage,
});

function TypeScriptGuidePage() {
  return (
    <DocPage
      title="TypeScript Guide"
      description="A complete TypeScript usage flow covering authentication, file management, S3 operations, presigned URLs, shares, and monitoring."
    >
      {/* Helper */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-8 mb-3">
        Setup Helper
      </h2>
      <CodeBlock title="beamdrop.ts — base helper" language="typescript">
        {`import crypto from "crypto";\n\nconst BASE_URL = "http://localhost:7777";\n\nasync function request(\n  method: string,\n  path: string,\n  options: {\n    body?: any;\n    headers?: Record<string, string>;\n    token?: string;\n    formData?: FormData;\n  } = {},\n): Promise<any> {\n  const headers: Record<string, string> = {\n    ...options.headers,\n  };\n\n  if (options.token) {\n    headers["Authorization"] = \`Bearer \${options.token}\`;\n  }\n\n  let body: any;\n  if (options.formData) {\n    body = options.formData;\n  } else if (options.body) {\n    headers["Content-Type"] = "application/json";\n    body = JSON.stringify(options.body);\n  }\n\n  const res = await fetch(\`\${BASE_URL}\${path}\`, { method, headers, body });\n\n  const contentType = res.headers.get("content-type") || "";\n  if (contentType.includes("application/json")) {\n    return res.json();\n  }\n  return res;\n}`}
      </CodeBlock>

      {/* Auth */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        1. Check Auth & Login
      </h2>
      <CodeBlock title="Authentication" language="typescript">
        {`// Check if auth is required\nconst authStatus = await request("GET", "/auth/status");\nconsole.log("Auth enabled:", authStatus.authEnabled);\nconsole.log("Authenticated:", authStatus.authenticated);\n\n// Login (if password auth enabled)\nlet authToken: string | undefined;\nif (authStatus.authEnabled && !authStatus.authenticated) {\n  const loginResult = await request("POST", "/auth/login", {\n    body: { password: "mysecretpassword" },\n  });\n  console.log("Login:", loginResult.message);\n  authToken = loginResult.token;\n}`}
      </CodeBlock>

      {/* File Operations */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        2. File Operations
      </h2>
      <CodeBlock
        title="List, upload, download, manage files"
        language="typescript"
      >
        {`// List files\nconst files = await request("GET", "/files?path=documents", { token: authToken });\nconsole.log("Files:", files);\n\n// Upload a file\nconst formData = new FormData();\nformData.append("file", new Blob(["Hello from Beamdrop!"]), "hello.txt");\nconst uploadResult = await request("POST", "/upload", {\n  formData,\n  token: authToken,\n});\nconsole.log("Upload:", uploadResult);\n// => { message: "Uploaded", file: "hello.txt" }\n\n// Download a file\nconst res = await request("GET", "/download?file=hello.txt", { token: authToken });\nif (res instanceof Response) {\n  const content = await res.text();\n  console.log("Downloaded:", content);\n}\n\n// Create a directory\nconst mkdirResult = await request("POST", "/mkdir", {\n  body: { dirPath: "projects/my-app" },\n  token: authToken,\n});\nconsole.log("Mkdir:", mkdirResult);\n\n// Write file content directly\nconst writeResult = await request("POST", "/write", {\n  body: { filePath: "projects/my-app/README.md", content: "# My App\\n\\nBuilt with Beamdrop!" },\n  token: authToken,\n});\nconsole.log("Write:", writeResult);\n\n// Move a file\nawait request("POST", "/move", {\n  body: { sourcePath: "hello.txt", targetPath: "projects/my-app/hello.txt" },\n  token: authToken,\n});\n\n// Copy a file\nawait request("POST", "/copy", {\n  body: { sourcePath: "projects/my-app/hello.txt", targetPath: "hello-backup.txt" },\n  token: authToken,\n});\n\n// Rename a file\nawait request("POST", "/rename", {\n  body: { oldPath: "hello-backup.txt", newName: "hello-copy.txt" },\n  token: authToken,\n});\n\n// Search files\nconst searchResult = await request("GET", "/search?q=hello", { token: authToken });\nconsole.log("Search:", searchResult.count, "files found");\n\n// Star / Unstar a file\nawait request("POST", "/star", {\n  body: { filePath: "projects/my-app/README.md" },\n  token: authToken,\n});\nconst starred = await request("GET", "/starred", { token: authToken });\nconsole.log("Starred files:", starred.starred);\n\n// Trash a file (soft delete)\nawait request("POST", "/trash", {\n  body: { sourcePath: "hello-copy.txt" },\n  token: authToken,\n});`}
      </CodeBlock>

      {/* S3 Bucket Operations */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        3. S3 Bucket Operations
      </h2>
      <CodeBlock title="Bucket CRUD" language="typescript">
        {`// Create a bucket\nawait api("/api/s3/my-bucket", { method: "PUT" });\n\n// List all buckets\nconst buckets = await api("/api/s3/");\nconsole.log("Buckets:", buckets.buckets);\n\n// Check bucket exists\nconst head = await fetch(\`\${BASE}/api/s3/my-bucket\`, { method: "HEAD" });\nconsole.log("Exists:", head.ok);\n\n// Delete empty bucket\nawait api("/api/s3/my-bucket", { method: "DELETE" });`}
      </CodeBlock>

      {/* S3 Object Operations */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        4. S3 Object Operations
      </h2>
      <CodeBlock title="Upload, download, list objects" language="typescript">
        {`// Upload via PUT (raw body)\nawait fetch(\`\${BASE}/api/s3/my-bucket/data.json\`, {\n  method: "PUT",\n  headers: {\n    Authorization: \`Bearer \${token}\`,\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify({ key: "value" }),\n});\n\n// Upload via POST (multipart)\nconst objForm = new FormData();\nobjForm.append("file", new File(["binary data"], "photo.jpg"));\nawait api("/api/s3/my-bucket/photo.jpg", { method: "POST", body: objForm });\n\n// Download object\nconst obj = await api("/api/s3/my-bucket/data.json");\nconsole.log("Object:", obj);\n\n// Head (metadata only)\nconst meta = await fetch(\`\${BASE}/api/s3/my-bucket/data.json\`, {\n  method: "HEAD",\n  headers: { Authorization: \`Bearer \${token}\` },\n});\nconsole.log("Size:", meta.headers.get("content-length"));\nconsole.log("Type:", meta.headers.get("content-type"));\n\n// Delete object\nawait api("/api/s3/my-bucket/data.json", { method: "DELETE" });\n\n// List objects with prefix\nconst list = await api("/api/s3/my-bucket?list&prefix=images/&max-keys=10");\nconsole.log("Objects:", list.contents);\nconsole.log("Truncated:", list.isTruncated);`}
      </CodeBlock>

      {/* API Keys */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        5. API Key Management
      </h2>
      <CodeBlock title="Create, list, delete API keys" language="typescript">
        {`// Create an API key\nconst key = await api("/api/keys", {\n  method: "POST",\n  body: JSON.stringify({\n    name: "ci-deploy",\n    permissions: ["read", "write"],\n    bucketScope: "deployments",\n    expiresIn: 2592000,  // 30 days\n  }),\n});\nconsole.log("Key ID:", key.keyId);\nconsole.log("Secret:", key.keySecret);  // shown only once!\n\n// List keys\nconst keys = await api("/api/keys");\nconsole.log("Active keys:", keys.keys);\n\n// Delete a key\nawait api(\`/api/keys/\${key.id}\`, { method: "DELETE" });`}
      </CodeBlock>

      {/* Presigned URLs */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        6. Presigned URLs
      </h2>
      <CodeBlock title="Client-side HMAC presigned URL" language="typescript">
        {`import crypto from "crypto";\n\nfunction presign(bucket: string, key: string, secret: string, ttl = 3600) {\n  const expires = Math.floor(Date.now() / 1000) + ttl;\n  const path = \`/api/s3/\${bucket}/\${key}\`;\n  const data = \`GET\\n\${path}\\n\${expires}\`;\n  const sig = crypto.createHmac("sha256", secret).update(data).digest("hex");\n  return \`\${BASE}\${path}?X-Amz-Expires=\${expires}&X-Amz-Signature=\${sig}\`;\n}\n\nconst url = presign("my-bucket", "photo.jpg", key.keySecret);\nconsole.log("Presigned URL:", url);`}
      </CodeBlock>
      <CodeBlock title="Server-side pretty URLs" language="typescript">
        {`// Create a pretty download link\nconst dl = await api("/api/s3/my-bucket/photo.jpg/presign", {\n  method: "POST",\n  body: JSON.stringify({ expiresIn: 86400 }),\n});\nconsole.log("Download URL:", dl.url);  // /dl/{token}\n\n// List active tokens\nconst tokens = await api("/api/s3/my-bucket/photo.jpg/presign");\nconsole.log("Active tokens:", tokens);\n\n// Revoke a token\nawait api(\n  \`/api/s3/my-bucket/photo.jpg/presign/\${dl.token}\`,\n  { method: "DELETE" }\n);`}
      </CodeBlock>

      {/* Shares */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        7. Shareable Links
      </h2>
      <CodeBlock title="Create, access, delete shares" language="typescript">
        {`// Create a shareable link\nconst share = await api("/api/shares", {\n  method: "POST",\n  body: JSON.stringify({\n    path: "documents/report.pdf",\n    password: "optional-secret",\n    expiresIn: 86400,\n  }),\n});\nconsole.log("Share URL:", share.url);\n\n// List all links\nconst shares = await api("/api/shares/list");\nconsole.log("Active shares:", shares);\n\n// Access (public — no auth needed)\nconst shared = await fetch(\n  \`\${BASE}/api/shares/access/\${share.token}?password=optional-secret\`\n);\nconst content = await shared.json();\n\n// Delete a link\nawait api(\`/api/shares/delete?token=\${share.token}\`, { method: "DELETE" });`}
      </CodeBlock>

      {/* Health & Stats */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        8. Health & Monitoring
      </h2>
      <CodeBlock title="Health, stats, logs" language="typescript">
        {`// Health check\nconst health = await api("/health");\nconsole.log("Status:", health.status);\nconsole.log("Components:", health.components);\n\n// Server stats\nconst stats = await api("/stats");\nconsole.log("Files:", stats.totalFiles, "Size:", stats.totalSize);\n\n// Query logs\nconst logs = await api("/api/logs?limit=10&level=error");\nconsole.log("Errors:", logs.logs);`}
      </CodeBlock>

      {/* WebSocket */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        9. Real-Time Stats (WebSocket)
      </h2>
      <CodeBlock title="WebSocket connection" language="typescript">
        {`const ws = new WebSocket("ws://localhost:7777/ws/stats");\n\nws.onmessage = (event) => {\n  const stats = JSON.parse(event.data);\n  console.log("CPU:", stats.cpuUsage);\n  console.log("Memory:", stats.memoryUsage);\n  console.log("Files:", stats.totalFiles);\n  console.log("Connections:", stats.connections);\n};\n\nws.onerror = (err) => console.error("WebSocket error:", err);\nws.onclose = () => console.log("WebSocket closed");`}
      </CodeBlock>

      {/* Logout */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        10. Logout
      </h2>
      <CodeBlock title="Logout" language="typescript">
        {`await api("/api/logout", { method: "POST" });\ntoken = "";\nconsole.log("Logged out");`}
      </CodeBlock>
    </DocPage>
  );
}

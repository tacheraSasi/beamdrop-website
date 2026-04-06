import { createFileRoute } from "@tanstack/react-router";
import { DocPage, CodeBlock, DocTable } from "@/components/DocPage";

export const Route = createFileRoute("/docs/architecture")({
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <DocPage
      title="Architecture"
      description="Project structure, storage layout, API endpoint summary, and development guide."
    >
      {/* Storage Structure */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-8 mb-3">
        Storage Structure
      </h2>
      <CodeBlock title="Storage layout">
        {`shared-directory/\n├── buckets/              # S3-compatible bucket storage\n│   ├── my-bucket/\n│   │   ├── images/\n│   │   │   └── photo.jpg\n│   │   └── data.json\n│   └── backups/\n│       └── db.sql\n├── .beamdrop/            # Logs\n│   └── beamdrop.log      # Structured JSON log file\n├── .beamdrop_data/       # Internal data\n│   └── beamdrop.db       # SQLite database (API keys, shares, stars)\n└── .beamdrop_trash/      # Soft-deleted files (recoverable)`}
      </CodeBlock>

      {/* API Endpoint Summary */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        API Endpoint Summary
      </h2>

      <h3 className="text-base font-bold font-mono uppercase tracking-tight mt-6 mb-2">
        File Management
      </h3>
      <DocTable
        headers={["Method", "Endpoint", "Description"]}
        rows={[
          ["GET", "/api/files?path=", "List files in directory"],
          ["POST", "/api/upload?path=", "Upload file (multipart, 100 MB max)"],
          ["GET", "/api/download?path=", "Download file"],
          ["POST", "/api/mkdir", "Create directory"],
          ["POST", "/api/move", "Move file/folder"],
          ["POST", "/api/copy", "Copy file/folder"],
          ["POST", "/api/rename", "Rename file/folder"],
          ["POST", "/api/trash", "Move to trash (soft delete)"],
          ["POST", "/api/write", "Create/overwrite file (JSON body)"],
          ["GET", "/api/search?q=&path=", "Search files"],
          ["POST", "/api/star", "Star a file"],
          ["DELETE", "/api/star?path=", "Unstar a file"],
          ["GET", "/api/stars", "Get starred files"],
        ]}
      />

      <h3 className="text-base font-bold font-mono uppercase tracking-tight mt-6 mb-2">
        S3-Compatible API
      </h3>
      <DocTable
        headers={["Method", "Endpoint", "Description"]}
        rows={[
          ["GET", "/api/s3/", "List all buckets"],
          ["PUT", "/api/s3/{bucket}", "Create bucket"],
          ["HEAD", "/api/s3/{bucket}", "Check bucket exists"],
          ["GET", "/api/s3/{bucket}", "Get bucket info"],
          ["DELETE", "/api/s3/{bucket}", "Delete empty bucket"],
          ["PUT", "/api/s3/{bucket}/{key}", "Upload object (raw body)"],
          ["POST", "/api/s3/{bucket}/{key}", "Upload object (multipart)"],
          ["GET", "/api/s3/{bucket}/{key}", "Download object"],
          ["HEAD", "/api/s3/{bucket}/{key}", "Get object metadata"],
          ["DELETE", "/api/s3/{bucket}/{key}", "Delete object"],
          [
            "GET",
            "/api/s3/{bucket}?list&prefix=&delimiter=&max-keys=",
            "List objects",
          ],
        ]}
      />

      <h3 className="text-base font-bold font-mono uppercase tracking-tight mt-6 mb-2">
        Auth, Keys & Shares
      </h3>
      <DocTable
        headers={["Method", "Endpoint", "Description"]}
        rows={[
          ["POST", "/api/login", "Password login (returns JWT)"],
          ["POST", "/api/logout", "Logout"],
          ["POST", "/api/keys", "Create API key"],
          ["GET", "/api/keys", "List API keys"],
          ["DELETE", "/api/keys/{id}", "Delete API key"],
          ["POST", "/api/shares", "Create shareable link"],
          ["GET", "/api/shares/list", "List all links"],
          ["DELETE", "/api/shares/delete?token=", "Delete link"],
          ["GET/POST", "/api/shares/access/{token}", "Access shared content"],
        ]}
      />

      <h3 className="text-base font-bold font-mono uppercase tracking-tight mt-6 mb-2">
        Health & Monitoring
      </h3>
      <DocTable
        headers={["Method", "Endpoint", "Description"]}
        rows={[
          ["GET", "/health", "Full health status"],
          ["GET", "/health/live", "Liveness probe"],
          ["GET", "/health/ready", "Readiness probe"],
          ["GET", "/health/startup", "Startup probe"],
          ["GET", "/ready", "Legacy readiness"],
          ["GET", "/stats", "Server statistics"],
          ["WS", "/ws/stats", "Real-time stats stream"],
          ["GET", "/metrics", "Prometheus metrics"],
          ["GET", "/api/logs", "Query structured logs"],
        ]}
      />

      {/* Project Structure */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Project Structure
      </h2>
      <CodeBlock title="Source layout">
        {`beamdrop/\n├── cmd/beam/           # CLI entry point\n├── beam/server/        # HTTP server and handlers\n├── config/             # Configuration\n├── pkg/\n│   ├── auth/           # Authentication (JWT + API keys)\n│   ├── db/             # SQLite database and models\n│   ├── errors/         # Structured error types\n│   ├── middleware/      # CORS, security headers, rate limiting\n│   ├── storage/        # Bucket/object storage engine\n│   ├── crypto/         # HMAC signature utilities\n│   ├── logger/         # Dual-output structured logging\n│   └── ...\n├── static/frontend/    # React frontend (embedded)\n└── docs/               # Documentation`}
      </CodeBlock>

      {/* Development */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Development
      </h2>
      <h3 className="text-base font-bold font-mono uppercase tracking-tight mt-6 mb-2">
        Prerequisites
      </h3>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>Go 1.21+</li>
        <li>Node.js 18+ (for frontend development)</li>
        <li>Make</li>
      </ul>

      <h3 className="text-base font-bold font-mono uppercase tracking-tight mt-6 mb-2">
        Building
      </h3>
      <CodeBlock title="Build">
        {`# Build everything\nmake build\n\n# Build backend only\ngo build -o beamdrop ./cmd/beam\n\n# Build frontend\ncd static/frontend && bun install && bun run build`}
      </CodeBlock>

      <h3 className="text-base font-bold font-mono uppercase tracking-tight mt-6 mb-2">
        Running in Development
      </h3>
      <CodeBlock title="Dev">
        {`# Backend with hot reload\nmake dev\n\n# Frontend dev server\ncd static/frontend && bun run dev`}
      </CodeBlock>

      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        License
      </h2>
      <p className="text-muted-foreground leading-relaxed">
        GNU Affero General Public License v3.0
      </p>
    </DocPage>
  );
}

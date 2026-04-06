import { createFileRoute } from "@tanstack/react-router";
import { DocPage, CodeBlock, DocTable } from "@/components/DocPage";

export const Route = createFileRoute("/docs/error-codes")({
  component: ErrorCodesPage,
});

function ErrorCodesPage() {
  return (
    <DocPage
      title="Error Codes"
      description="Structured error responses with machine-readable codes for all failure scenarios."
    >
      {/* Error Format */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-8 mb-3">
        Error Response Format
      </h2>
      <CodeBlock title="JSON error structure">
        {`{\n  "error": "Human-readable message",\n  "code": "MACHINE_READABLE_CODE",\n  "details": { /* optional context */ }\n}`}
      </CodeBlock>

      {/* Categories */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Error Categories
      </h2>
      <DocTable
        headers={["HTTP Status", "Category", "Description"]}
        rows={[
          ["400", "Validation", "Bad request / invalid input"],
          ["401", "Authentication", "Missing or invalid credentials"],
          ["403", "Authorization", "Insufficient permissions"],
          ["404", "Not Found", "Resource does not exist"],
          ["409", "Conflict", "Resource state conflict"],
          ["413", "Payload", "Request body too large"],
          ["429", "Rate Limit", "Too many requests"],
          ["500", "Internal", "Server-side failures"],
        ]}
      />

      {/* Validation Errors */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Validation Errors (400)
      </h2>
      <DocTable
        headers={["Code", "Description"]}
        rows={[
          [
            "INVALID_PATH",
            "Path contains invalid characters or traversal attempts",
          ],
          [
            "INVALID_BUCKET_NAME",
            "Bucket name doesn't match [a-z0-9][a-z0-9.-]{1,61}[a-z0-9]",
          ],
          ["MISSING_REQUIRED_FIELD", "Required field not provided"],
          ["INVALID_JSON", "Request body is not valid JSON"],
          ["INVALID_CONTENT_TYPE", "Wrong Content-Type header"],
          ["FILE_TOO_LARGE", "Upload exceeds 100 MB limit"],
          ["INVALID_KEY_NAME", "API key name validation failed"],
        ]}
      />

      {/* Storage Errors */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Storage Errors (500)
      </h2>
      <DocTable
        headers={["Code", "Description"]}
        rows={[
          ["STORAGE_ERROR", "Generic filesystem operation failed"],
          ["DISK_FULL", "No space left on device"],
          ["IO_ERROR", "Read/write error"],
          ["DB_ERROR", "SQLite database error"],
          ["INTERNAL_ERROR", "Unexpected server error"],
        ]}
      />

      {/* Auth Errors */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Authentication Errors (401/403)
      </h2>
      <DocTable
        headers={["Code", "Description"]}
        rows={[
          ["AUTH_REQUIRED", "No credentials provided"],
          ["INVALID_PASSWORD", "Wrong password"],
          ["INVALID_TOKEN", "JWT token expired or malformed"],
          ["INVALID_API_KEY", "API key not found or revoked"],
          ["INVALID_SIGNATURE", "HMAC signature verification failed"],
          ["PERMISSION_DENIED", "API key lacks required permission"],
        ]}
      />

      {/* Not Found */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Not Found Errors (404)
      </h2>
      <DocTable
        headers={["Code", "Description"]}
        rows={[
          ["FILE_NOT_FOUND", "File or directory does not exist"],
          ["BUCKET_NOT_FOUND", "Bucket does not exist"],
          ["KEY_NOT_FOUND", "Object key not found in bucket"],
        ]}
      />

      {/* Conflict */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Conflict Errors (409)
      </h2>
      <DocTable
        headers={["Code", "Description"]}
        rows={[
          ["ALREADY_EXISTS", "File or directory already exists"],
          ["BUCKET_NOT_EMPTY", "Cannot delete bucket with objects"],
          ["BUCKET_EXISTS", "Bucket already exists (non-idempotent)"],
        ]}
      />

      {/* Rate Limit */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Rate Limit Errors (429)
      </h2>
      <DocTable
        headers={["Code", "Description"]}
        rows={[
          ["RATE_LIMITED", "Too many requests from this IP"],
          ["UPLOAD_RATE_LIMITED", "Too many uploads from this IP"],
        ]}
      />

      <CodeBlock title="Rate limit response example">
        {`HTTP/1.1 429 Too Many Requests\nRetry-After: 60\n\n{\n  "error": "Rate limit exceeded",\n  "code": "RATE_LIMITED",\n  "details": {\n    "retryAfter": 60,\n    "limit": 100\n  }\n}`}
      </CodeBlock>
    </DocPage>
  );
}

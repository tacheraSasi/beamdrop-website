import { createFileRoute } from "@tanstack/react-router";
import { DocPage, CodeBlock, DocTable } from "@/components/DocPage";

export const Route = createFileRoute("/docs/monitoring")({
  component: MonitoringPage,
});

function MonitoringPage() {
  return (
    <DocPage
      title="Health & Monitoring"
      description="Kubernetes-compatible health probes, Prometheus metrics, real-time stats, WebSocket events, and structured logs."
    >
      {/* Health Endpoints */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-8 mb-3">
        Health Endpoints
      </h2>
      <DocTable
        headers={["Endpoint", "Purpose", "Use Case"]}
        rows={[
          ["/health", "Full health + component status", "Monitoring dashboard"],
          ["/health/live", "Liveness probe", "Kubernetes liveness"],
          ["/health/ready", "Readiness probe", "Kubernetes readiness"],
          ["/health/startup", "Startup probe", "Kubernetes startup"],
          ["/ready", "Legacy readiness probe", "Load balancer health check"],
        ]}
      />
      <CodeBlock title="Full health response">
        {`GET /health\n\n{\n  "status": "healthy",\n  "version": "1.0.0",\n  "uptime": "2h30m15s",\n  "components": {\n    "storage": "healthy",\n    "database": "healthy",\n    "server": "healthy"\n  }\n}`}
      </CodeBlock>

      {/* Stats */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Stats Endpoint
      </h2>
      <CodeBlock title="GET /stats">
        {`GET /stats\n\n{\n  "totalFiles": 1234,\n  "totalSize": "1.2 GB",\n  "totalSizeBytes": 1288490188,\n  "storageUsed": "45%",\n  "uptime": "2h30m15s",\n  "version": "1.0.0"\n}`}
      </CodeBlock>

      {/* WebSocket */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Real-Time Stats (WebSocket)
      </h2>
      <CodeBlock title="wscat">
        {`wscat -c ws://localhost:7777/ws/stats\n\n# Receives periodic updates:\n{\n  "totalFiles": 1234,\n  "totalSize": "1.2 GB",\n  "connections": 5,\n  "cpuUsage": "12.5%",\n  "memoryUsage": "256 MB",\n  "goroutines": 42\n}`}
      </CodeBlock>

      {/* Logs */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Logs Endpoint
      </h2>
      <DocTable
        headers={["Parameter", "Type", "Default", "Description"]}
        rows={[
          ["limit", "number", "100", "Max entries to return"],
          ["offset", "number", "0", "Pagination offset"],
          ["level", "string", "all", "Filter by level (info, warn, error)"],
          ["search", "string", "—", "Search in log messages"],
        ]}
      />
      <CodeBlock title="GET /api/logs">
        {`GET /api/logs?limit=50&level=error\n\n{\n  "logs": [\n    {\n      "timestamp": "2025-01-15T10:30:00Z",\n      "level": "error",\n      "message": "Failed to write file",\n      "details": { "path": "uploads/large.bin", "error": "disk full" }\n    }\n  ],\n  "total": 1,\n  "hasMore": false\n}`}
      </CodeBlock>

      {/* Prometheus Metrics */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Prometheus Metrics
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        BeamDrop exposes a <code className="text-primary">/metrics</code>{" "}
        endpoint in Prometheus text format.
      </p>
      <CodeBlock title="prometheus.yml">
        {`scrape_configs:\n  - job_name: beamdrop\n    static_configs:\n      - targets: ["localhost:7777"]`}
      </CodeBlock>
      <DocTable
        headers={["Metric", "Type", "Description"]}
        rows={[
          [
            "beamdrop_requests_total",
            "counter",
            "HTTP requests by method, path, status",
          ],
          [
            "beamdrop_request_duration_seconds",
            "histogram",
            "Request latency (p50/p95/p99)",
          ],
          [
            "beamdrop_auth_failures_total",
            "counter",
            "Auth failures by reason",
          ],
          ["beamdrop_uploads_total", "counter", "Completed uploads"],
          ["beamdrop_downloads_total", "counter", "Completed downloads"],
          ["beamdrop_upload_size_bytes", "histogram", "Upload file sizes"],
          ["beamdrop_storage_bytes", "gauge", "Bytes used by stored files"],
          ["beamdrop_objects_total", "gauge", "Number of stored files"],
          ["beamdrop_active_connections", "gauge", "In-flight HTTP requests"],
          ["beamdrop_storage_free_bytes", "gauge", "Free disk space"],
          ["beamdrop_storage_total_bytes", "gauge", "Total disk capacity"],
          ["beamdrop_goroutines_count", "gauge", "Go goroutine count"],
        ]}
      />

      {/* Grafana */}
      <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
        Grafana Dashboard
      </h2>
      <p className="text-muted-foreground leading-relaxed">
        A pre-built Grafana dashboard is available at{" "}
        <code className="text-primary">docs/grafana-dashboard.json</code>.
        Import it via <strong>Dashboards &gt; Import</strong> in Grafana.
      </p>
    </DocPage>
  );
}

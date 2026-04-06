import { createFileRoute } from "@tanstack/react-router";
import { DocPage, CodeBlock, DocTable } from "@/components/DocPage";

export const Route = createFileRoute("/docs/docker")({
    component: DockerPage,
});

function DockerPage() {
    return (
        <DocPage
            title="Docker & Deployment"
            description="Run BeamDrop with Docker, Docker Compose, Kubernetes, or behind a Caddy reverse proxy."
        >
            {/* Docker Run */}
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-8 mb-3">
                Docker
            </h2>
            <CodeBlock title="Docker Run">
                {`docker run -d \\\n  --name beamdrop \\\n  -p 7777:7777 \\\n  -v beamdrop-data:/data \\\n  -e BEAMDROP_PASSWORD="secret" \\\n  -e BEAMDROP_API_AUTH=true \\\n  -e BEAMDROP_RATE_LIMIT=100 \\\n  beamdrop`}
            </CodeBlock>
            <p className="text-sm text-muted-foreground mb-6">
                The image is ~39 MB, runs as non-root, and includes a HEALTHCHECK against{" "}
                <code className="text-primary">/health/live</code>.
            </p>

            {/* Docker Compose */}
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
                Docker Compose
            </h2>
            <CodeBlock title="docker-compose.yml">
                {`version: "3.8"\n\nservices:\n  beamdrop:\n    build: .\n    ports:\n      - "7777:7777"\n    volumes:\n      - beamdrop-data:/data\n    environment:\n      - BEAMDROP_PASSWORD=your-secret\n      - BEAMDROP_API_AUTH=true\n      - BEAMDROP_RATE_LIMIT=100\n    healthcheck:\n      test: ["CMD", "wget", "-q", "--spider", "http://localhost:7777/health/live"]\n      interval: 30s\n      timeout: 5s\n      retries: 3\n    restart: unless-stopped\n\nvolumes:\n  beamdrop-data:`}
            </CodeBlock>

            {/* Kubernetes */}
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
                Kubernetes Probes
            </h2>
            <CodeBlock title="deployment.yaml (probes section)">
                {`livenessProbe:\n  httpGet:\n    path: /health/live\n    port: 7777\n  initialDelaySeconds: 5\n  periodSeconds: 10\n\nreadinessProbe:\n  httpGet:\n    path: /health/ready\n    port: 7777\n  initialDelaySeconds: 5\n  periodSeconds: 5\n\nstartupProbe:\n  httpGet:\n    path: /health/startup\n    port: 7777\n  failureThreshold: 30\n  periodSeconds: 2`}
            </CodeBlock>

            {/* Rate Limiting */}
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
                Rate Limiting
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
                When <code className="text-primary">-rate-limit N</code> is set, different endpoint categories get different limits:
            </p>
            <DocTable
                headers={["Category", "Limit", "Example"]}
                rows={[
                    ["General", "N req/min", "File listing, health checks"],
                    ["Auth", "N/20 req/min", "Login, API key creation"],
                    ["Upload", "N/10 req/min", "File uploads, writes"],
                ]}
            />

            {/* Caddy */}
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
                Caddy Reverse Proxy
            </h2>
            <CodeBlock title="Caddyfile">
                {`{$BEAMDROP_DOMAIN:localhost} {\n  reverse_proxy beamdrop:7777\n}`}
            </CodeBlock>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mt-3">
                <li>
                    Uncomment the caddy service in{" "}
                    <code className="text-primary">docker-compose.yml</code>
                </li>
                <li>
                    Set your domain: <code className="text-primary">export BEAMDROP_DOMAIN=files.example.com</code>
                </li>
                <li>
                    Run: <code className="text-primary">docker compose up -d</code>
                </li>
            </ol>

            {/* Prometheus */}
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
                Prometheus Scrape Config
            </h2>
            <CodeBlock title="prometheus.yml">
                {`scrape_configs:\n  - job_name: beamdrop\n    static_configs:\n      - targets: ["beamdrop:7777"]\n    metrics_path: /metrics\n    scrape_interval: 15s`}
            </CodeBlock>

            {/* Environment Variables */}
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight mt-10 mb-3">
                Environment Variables
            </h2>
            <DocTable
                headers={["Variable", "Default", "Description"]}
                rows={[
                    ["BEAMDROP_PORT", "7777", "Port to listen on"],
                    ["BEAMDROP_PASSWORD", "(none)", "Enable password authentication"],
                    ["BEAMDROP_LOG_LEVEL", "info", "Log level: debug, info, warn, error"],
                    ["BEAMDROP_RATE_LIMIT", "100", "Requests/min per IP (0 = disabled)"],
                    ["BEAMDROP_API_AUTH", "(off)", "Set to true to enable S3 API key auth"],
                    ["BEAMDROP_ALLOWED_ORIGINS", "(none)", "Comma-separated CORS origins"],
                    ["BEAMDROP_TLS_CERT", "(none)", "TLS certificate path"],
                    ["BEAMDROP_TLS_KEY", "(none)", "TLS private key path"],
                    ["BEAMDROP_QR", "(off)", "Print QR code with server URL on start"],
                    ["BEAMDROP_DB_PATH", "(default)", "Custom path for the SQLite database"],
                ]}
            />

            <p className="text-sm text-muted-foreground mt-6">
                Data is persisted in <code className="text-primary">/data</code> inside the container.
                Mount a volume to retain data across restarts.
            </p>
        </DocPage>
    );
}

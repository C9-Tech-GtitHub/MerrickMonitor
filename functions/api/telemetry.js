// Cloudflare Pages Function to proxy Prometheus/Grafana Cloud queries
// Endpoint: GET /api/telemetry?query=<promql>&time=<timestamp>&start=<start>&end=<end>&step=<step>

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Only allow GET requests
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check for required environment variables
  const prometheusUrl = env.GRAFANA_PROMETHEUS_URL;
  const instanceId = env.GRAFANA_INSTANCE_ID;
  const apiToken = env.GRAFANA_API_TOKEN;

  if (!prometheusUrl || !instanceId || !apiToken) {
    return new Response(
      JSON.stringify({
        error: "Telemetry not configured",
        details:
          "Missing GRAFANA_PROMETHEUS_URL, GRAFANA_INSTANCE_ID, or GRAFANA_API_TOKEN",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Get query parameters
  const query = url.searchParams.get("query");
  const queryType = url.searchParams.get("type") || "instant"; // instant or range

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build Basic Auth header
  const auth = btoa(`${instanceId}:${apiToken}`);

  try {
    let prometheusEndpoint;
    const params = new URLSearchParams();
    params.set("query", query);

    if (queryType === "range") {
      // Range query for time series data
      prometheusEndpoint = `${prometheusUrl}/api/v1/query_range`;
      const end = url.searchParams.get("end") || Math.floor(Date.now() / 1000);
      const start =
        url.searchParams.get("start") || Math.floor(Date.now() / 1000) - 3600; // Default: last hour
      const step = url.searchParams.get("step") || "60"; // Default: 1 minute

      params.set("start", start);
      params.set("end", end);
      params.set("step", step);
    } else {
      // Instant query for current values
      prometheusEndpoint = `${prometheusUrl}/api/v1/query`;
      const time = url.searchParams.get("time");
      if (time) {
        params.set("time", time);
      }
    }

    // Make request to Prometheus/Grafana Cloud
    const response = await fetch(`${prometheusEndpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: "Prometheus query failed",
          status: response.status,
          details: errorText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=30", // Cache for 30 seconds
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch telemetry data",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

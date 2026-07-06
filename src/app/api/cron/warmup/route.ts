import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/cron/warmup
 * Schedule: 0 5 * * * (UTC) = 12:00 AM Lima (UTC-5)
 *
 * Sends a lightweight ping to the FastAPI backend on Azure Container Apps to
 * prevent cold-start delays for the first user of the day.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ ok: false, error: "API URL no configurada" }, { status: 500 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);

    const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, "");
    const response = await fetch(`${baseUrl}/`, {
      method: "GET",
      headers: {
        "X-App-Secret": process.env.BACKEND_CLIENT_API_KEY || "",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return NextResponse.json({ ok: true, status: response.status });
  } catch {
    // Un error o timeout aquí no es crítico — el contenedor igual se despertó
    return NextResponse.json({ ok: true, warmed: false });
  }
}

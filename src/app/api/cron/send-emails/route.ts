import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * GET /api/cron/send-emails
 * Schedule: 0 13 * * * (UTC) = 8:00 AM Lima (UTC-5)
 *
 * Proxy seguro entre Vercel Cron y el endpoint del backend FastAPI.
 * Vercel envía automáticamente: Authorization: Bearer {CRON_SECRET}
 * Este route valida ese header y reenvía la petición al backend con
 * X-Cron-Secret para que el backend la autorice sin necesitar JWT.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_API_URL no configurada" }, { status: 500 });
  }

  try {
    const response = await fetch(`${apiUrl}/notifications/cron/send-emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cron-Secret": cronSecret,
      },
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "El backend retornó un error", detail: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error inesperado" },
      { status: 500 },
    );
  }
}

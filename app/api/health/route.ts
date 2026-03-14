import { NextResponse } from "next/server";

/**
 * Health check endpoint for monitoring and Docker healthcheck
 * Returns 200 OK if application is running
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "DebuggerMind",
      version: "1.0.0",
    },
    { status: 200 }
  );
}

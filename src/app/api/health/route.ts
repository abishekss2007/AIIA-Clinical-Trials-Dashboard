import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'AyurCTMS',
    environment: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
    message: 'Backend connection target is configured via environment variables.',
  });
}

import { NextRequest, NextResponse } from 'next/server';
const INTERNAL_API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://backend:8000';

export async function GET(req: NextRequest) {
  const url = `${INTERNAL_API}/features_by_address/?${req.nextUrl.searchParams.toString()}`;
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { 'Content-Type': 'application/json' } });
}

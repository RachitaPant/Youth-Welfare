import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BASE_URL;

async function handler(request: NextRequest) {
  const url = `${BACKEND}/gallery${request.nextUrl.search}`;
  const init: RequestInit = {
    method: request.method,
    headers: { "Content-Type": "application/json" },
  };
  if (request.method !== "GET") {
    init.body = await request.text();
  }
  const res = await fetch(url, init);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export const GET  = handler;
export const POST = handler;

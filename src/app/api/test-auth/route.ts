import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin-session');
  
  return NextResponse.json({
    hasCookie: !!sessionCookie,
    cookieValue: sessionCookie?.value ? 'EXISTS' : 'NOT_FOUND',
    allCookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
    headers: Object.fromEntries(request.headers.entries()),
  });
}
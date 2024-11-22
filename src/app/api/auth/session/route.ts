import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sessionString = headers().get('session');
    const session = sessionString ? JSON.parse(sessionString) : null;

    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { fetchSimpleDashboardData } from '@/lib/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchSimpleDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
    const body = await request.json();

    // Use server-side apiFetch to make the request to the backend API
    const result = await apiFetch(`/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

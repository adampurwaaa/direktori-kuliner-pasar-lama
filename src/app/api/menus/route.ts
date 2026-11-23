import { NextResponse } from 'next/server';
import { getAllMenus, getMenusByTenantId, saveMenuAction, deleteMenuAction } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  const data = tenantId ? await getMenusByTenantId(tenantId) : await getAllMenus();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveMenuAction(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID menu diperlukan.' }, { status: 400 });
    }
    const result = await deleteMenuAction(id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

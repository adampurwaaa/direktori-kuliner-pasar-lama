import { NextResponse } from 'next/server';
import { getActivePromos, getAllPromosAdmin, savePromoAction, deletePromoAction, getAllTenantsAdmin } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get('admin') === 'true';

  const data = isAdmin ? await getAllPromosAdmin() : await getActivePromos();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tenants = await getAllTenantsAdmin();
    const result = await savePromoAction(body, tenants);
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
      return NextResponse.json({ success: false, error: 'ID promo diperlukan.' }, { status: 400 });
    }
    const result = await deletePromoAction(id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

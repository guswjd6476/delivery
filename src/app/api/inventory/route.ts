import { NextResponse } from 'next/server';
import { getInventory, updateInventory } from '../../../db'; // db.ts에서 작성한 함수들

export async function GET() {
    const inventory = await getInventory();
    return NextResponse.json({ inventory });
}

export async function POST(req: Request) {
    const { item, quantity, price } = await req.json();

    // 재고 업데이트
    const updatedInventory = await updateInventory(item, quantity, price);

    return NextResponse.json({ updatedInventory });
}

import { NextResponse } from 'next/server';
import { getInventory, updateInventory } from '../../../db'; // db.ts에서 작성한 함수들

export async function GET() {
    const inventory = await getInventory();
    return NextResponse.json({ inventory });
}

export async function POST(req: Request) {
    const { item, quantity, price } = await req.json();

    if (!item || quantity === undefined || price === undefined) {
        return NextResponse.json({ message: '잘못된 데이터입니다.' }, { status: 400 });
    }

    try {
        // 재고 업데이트
        const updatedInventory = await updateInventory(item, quantity, price);
        return NextResponse.json({ updatedInventory });
    } catch (error) {
        console.error('서버 오류:', error);
        return NextResponse.json({ message: '서버에서 오류가 발생했습니다.' }, { status: 500 });
    }
}

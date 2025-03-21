import { NextResponse } from 'next/server';
import { createOrder } from '../../../db'; // db.ts에서 작성한 createOrder 함수

export async function POST(req: Request) {
    const { item, quantity, payment } = await req.json();

    // 주문 데이터베이스에 추가
    const order = await createOrder(item, quantity, payment);

    return NextResponse.json({
        message: '주문이 완료되었습니다.',
        order,
    });
}

import { NextResponse } from 'next/server';
import { createOrder, getOrders, updateOrderDeliveryStatus } from '../../../db'; // db.ts에서 작성한 함수

// 모든 주문 내역 가져오기
export async function GET() {
    const orders = await getOrders(); // 모든 주문 내역 가져오기
    return NextResponse.json({ orders });
}

// 배달 상태 업데이트 (PATCH)
export async function PATCH(req: Request) {
    const { id, delivered } = await req.json(); // 요청 본문에서 id와 delivered 값을 받음

    // id와 delivered가 없으면 오류 처리
    if (!id || typeof delivered !== 'boolean') {
        return NextResponse.json({ message: '잘못된 데이터' }, { status: 400 });
    }

    try {
        // 배달 상태 업데이트
        const updatedOrder = await updateOrderDeliveryStatus(Number(id), delivered);
        if (!updatedOrder) {
            return NextResponse.json({ message: '주문을 찾을 수 없습니다.' }, { status: 404 });
        }
        return NextResponse.json({ updatedOrder });
    } catch (error) {
        console.error('배달 상태 업데이트 오류:', error);
        return NextResponse.json({ message: '배달 상태 업데이트 실패' }, { status: 500 });
    }
}

// 주문 생성 (POST)
export async function POST(req: Request) {
    const { item, quantity, totalAmount, paymentMethod, name, contact, deliveryLocation } = await req.json();

    // 주문 데이터베이스에 추가
    const order = await createOrder(item, quantity, totalAmount, paymentMethod, name, contact, deliveryLocation);

    return NextResponse.json({
        message: '주문이 완료되었습니다.',
        order,
    });
}

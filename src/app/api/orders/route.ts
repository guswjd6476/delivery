import { NextResponse } from 'next/server';
import { createOrder, getOrders, updateOrderDeliveryStatus } from '../../../db';

// 모든 주문 가져오기
export async function GET() {
    const orders = await getOrders();
    return NextResponse.json({ orders });
}

// 주문 생성 (POST)
export async function POST(req: Request) {
    try {
        const { items, totalAmount, paymentMethod, name, contact, deliveryLocation } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ message: '주문할 상품이 없습니다.' }, { status: 400 });
        }

        const order = await createOrder(items, totalAmount, paymentMethod, name, contact, deliveryLocation);
        return NextResponse.json({ message: '주문이 완료되었습니다.', order });
    } catch (error) {
        console.error('주문 생성 오류:', error);
        return NextResponse.json({ message: '주문 생성 실패' }, { status: 500 });
    }
}

// 배달 상태 업데이트 (PATCH)
export async function PATCH(req: Request) {
    try {
        const { id, delivered } = await req.json();
        if (!id || typeof delivered !== 'boolean') {
            return NextResponse.json({ message: '잘못된 데이터' }, { status: 400 });
        }

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

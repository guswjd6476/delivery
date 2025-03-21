'use client';

import { useState, useEffect } from 'react';

type Order = {
    id: number;
    item: string;
    quantity: number;
    payment: string;
    name: string;
    contact: string;
    delivery_location: string;
    delivered: boolean;
};

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]); // Use the Order type here

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data.orders);
        };
        fetchOrders();
    }, []);

    const updateDeliveryStatus = async (id: number, delivered: boolean) => {
        const response = await fetch('/api/orders', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, delivered }), // id와 delivered를 JSON으로 전달
        });

        const data = await response.json();
        if (data.updatedOrder) {
            // 서버에서 응답 받은 업데이트된 주문을 사용하여 로컬 상태를 업데이트
            setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, delivered } : order)));
            console.log('배달 상태 업데이트 성공:', data.updatedOrder);
        } else {
            console.error('배달 상태 업데이트 실패');
        }
    };

    return (
        <div>
            <h1 className="text-2xl mb-4">주문 내역</h1>
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">주문 ID</th>
                        <th className="py-2 px-4 border">아이템</th>
                        <th className="py-2 px-4 border">수량</th>
                        <th className="py-2 px-4 border">가격</th>
                        <th className="py-2 px-4 border">이름</th>
                        <th className="py-2 px-4 border">연락처</th>
                        <th className="py-2 px-4 border">배달 장소</th>
                        <th className="py-2 px-4 border">배달 완료</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="py-2 px-4 border">{order.id}</td>
                            <td className="py-2 px-4 border">{order.item}</td>
                            <td className="py-2 px-4 border">{order.quantity}</td>
                            <td className="py-2 px-4 border">{order.payment}</td>
                            <td className="py-2 px-4 border">{order.name}</td>
                            <td className="py-2 px-4 border">{order.contact}</td>
                            <td className="py-2 px-4 border">{order.delivery_location}</td>
                            <td className="py-2 px-4 border text-center">
                                <input
                                    type="checkbox"
                                    checked={order.delivered} // delivered 상태를 체크로 반영
                                    onChange={() => {
                                        const newStatus = order.delivered ? false : true; // delivered 상태 변경
                                        updateDeliveryStatus(order.id, newStatus);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPage;

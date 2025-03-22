'use client';

import { useState, useEffect } from 'react';

type Order = {
    id: number;
    items: { item: string; quantity: number; price: number }[]; // 여러 개의 상품을 처리
    total_amount: number;
    payment_method: string;
    name: string;
    contact: string;
    delivery_location: string;
    delivered: boolean;
};

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);

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
            body: JSON.stringify({ id, delivered }),
        });

        const data = await response.json();
        if (data.updatedOrder) {
            setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, delivered } : order)));
            console.log('배달 상태 업데이트 성공:', data.updatedOrder);
        } else {
            console.error('배달 상태 업데이트 실패');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">주문 내역</h1>
            <table className="w-full bg-white border border-collapse shadow-md">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">주문 ID</th>
                        <th className="py-2 px-4 border">상품 목록</th>
                        <th className="py-2 px-4 border">총 결제 금액</th>
                        <th className="py-2 px-4 border">결제 방법</th>
                        <th className="py-2 px-4 border">이름</th>
                        <th className="py-2 px-4 border">연락처</th>
                        <th className="py-2 px-4 border">배달 장소</th>
                        <th className="py-2 px-4 border">배달 완료</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-t">
                            <td className="py-2 px-4 border text-center">{order.id}</td>
                            <td className="py-2 px-4 border">
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index} className="text-sm">
                                            {item.item} ({item.quantity}개) - {item.price.toLocaleString()}원
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="py-2 px-4 border text-center">{order.total_amount.toLocaleString()}원</td>
                            <td className="py-2 px-4 border text-center">{order.payment_method}</td>
                            <td className="py-2 px-4 border text-center">{order.name}</td>
                            <td className="py-2 px-4 border text-center">{order.contact}</td>
                            <td className="py-2 px-4 border text-center">{order.delivery_location}</td>
                            <td className="py-2 px-4 border text-center">
                                <input
                                    type="checkbox"
                                    checked={order.delivered}
                                    onChange={() => updateDeliveryStatus(order.id, !order.delivered)}
                                    className="w-5 h-5"
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

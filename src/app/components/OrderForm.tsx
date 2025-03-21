'use client';

import { useState } from 'react';

const OrderForm = () => {
    const [item, setItem] = useState<string>('주먹밥');
    const [quantity, setQuantity] = useState<number>(0);
    const [payment, setPayment] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item, quantity, payment }),
        });

        const result = await response.json();
        alert(result.message);
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">주문 처리</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="item" className="block">
                        아이템
                    </label>
                    <select
                        id="item"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        className="mt-2 p-2 border rounded"
                    >
                        <option value="주먹밥">주먹밥</option>
                        <option value="콤부차">콤부차</option>
                        <option value="향수">향수</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="quantity" className="block">
                        수량
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="mt-2 p-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="payment" className="block">
                        입금 금액
                    </label>
                    <input
                        type="number"
                        id="payment"
                        value={payment}
                        onChange={(e) => setPayment(Number(e.target.value))}
                        className="mt-2 p-2 border rounded"
                    />
                </div>
                <button type="submit" className="mt-4 p-2 bg-green-500 text-white rounded">
                    주문
                </button>
            </form>
        </div>
    );
};

export default OrderForm;

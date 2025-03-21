'use client';

import { useState, useEffect } from 'react';

interface InventoryItem {
    id: number;
    item: string;
    quantity: number;
    price: number;
}

const OrderForm = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>('주먹밥');
    const [quantity, setQuantity] = useState<number>(1);
    const [payment, setPayment] = useState<number>(0);

    // 재고 데이터를 가져오는 함수
    const fetchInventory = async () => {
        try {
            const response = await fetch('/api/inventory', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // 인증 토큰 추가
                },
            });
            const result = await response.json();
            if (response.ok) {
                setInventory(result.inventory);
            } else {
                console.error('재고 정보를 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // 선택된 항목과 수량에 따라 입금 금액 계산
    useEffect(() => {
        const selected = inventory.find((item) => item.item === selectedItem);
        if (selected) {
            setPayment(selected.price * quantity);
        }
    }, [selectedItem, quantity, inventory]);

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: selectedItem, quantity, payment }),
        });

        const result = await response.json();
        alert(result.message || '주문이 완료되었습니다.');
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl mb-4">주문 항목 선택</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 아이템 선택 */}
                <div>
                    <label htmlFor="item" className="block">
                        아이템
                    </label>
                    <select
                        id="item"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="mt-2 p-2 border rounded"
                    >
                        {inventory.map((item) => (
                            <option key={item.id} value={item.item}>
                                {item.item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 수량 입력 */}
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
                        min="1"
                    />
                </div>

                {/* 자동으로 계산된 입금 금액 */}
                <div>
                    <label htmlFor="payment" className="block">
                        입금 금액
                    </label>
                    <input type="number" id="payment" value={payment} readOnly className="mt-2 p-2 border rounded" />
                </div>

                {/* 제출 버튼 */}
                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
                    주문하기
                </button>
            </form>
        </div>
    );
};

export default OrderForm;

'use client';

import { useState, useEffect } from 'react';

interface InventoryItem {
    id: number;
    item: string;
    quantity: number;
    price: number;
    created_at: string;
}

const InventoryForm = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [item, setItem] = useState<string>('주먹밥');
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    // 재고 정보를 가져오는 함수
    const fetchInventory = async () => {
        try {
            const response = await fetch('/api/inventory', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // 인증 토큰 추가
                },
            });
            const result = await response.json();
            console.log(result, '?');

            if (response.ok) {
                setInventory(result.inventory);
            } else {
                alert(result.message || '재고 정보를 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
            alert('재고 정보를 불러오는 데 오류가 발생했습니다.');
        }
    };

    // 첫 렌더링 시 재고 정보 불러오기
    useEffect(() => {
        fetchInventory();
    }, []);

    // 아이템이 변경될 때 기본 수량과 가격 업데이트
    useEffect(() => {
        const selectedItem = inventory.find((inventoryItem) => inventoryItem.item === item);
        if (selectedItem) {
            setQuantity(selectedItem.quantity);
            setPrice(selectedItem.price);
        }
    }, [item, inventory]);

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // 인증 토큰 추가
                },
                body: JSON.stringify({ item, quantity, price }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('재고 수정 완료!');
                // 수정 후 재고 목록을 새로고침
                await fetchInventory();
            } else {
                alert(result.message || '재고 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
            alert('재고 수정에 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">재료 수정</h2>
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
                        {inventory.map((inventoryItem) => (
                            <option key={inventoryItem.id} value={inventoryItem.item}>
                                {inventoryItem.item}
                            </option>
                        ))}
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
                    <label htmlFor="price" className="block">
                        가격
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-2 p-2 border rounded"
                    />
                </div>
                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
                    수정
                </button>
            </form>
        </div>
    );
};

export default InventoryForm;

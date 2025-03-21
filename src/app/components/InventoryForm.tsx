'use client';

import { useState, useEffect } from 'react';

interface InventoryItem {
    개수: number;
    가격: number;
}

const InventoryForm = () => {
    const [inventory, setInventory] = useState<Record<string, InventoryItem>>({});
    const [item, setItem] = useState<string>('주먹밥');
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    useEffect(() => {
        const fetchInventory = async () => {
            const response = await fetch('/api/inventory');
            const result = await response.json();
            setInventory(result.inventory);
        };
        fetchInventory();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item, quantity, price }),
        });

        const result = await response.json();
        alert(result.message);
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
                        {Object.keys(inventory).map((key) => (
                            <option key={key} value={key}>
                                {key}
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

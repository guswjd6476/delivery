'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface InventoryItem {
    id: number;
    item: string;
    quantity: number;
    price: number;
}

const MainPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>('주먹밥');
    const [quantity, setQuantity] = useState<number>(1);
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<'입금 완료' | '현금 결제'>('입금 완료');
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [contact, setContact] = useState<string>('');
    const [deliveryLocation, setDeliveryLocation] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin');
        if (adminStatus === 'true') {
            setIsAdmin(true);
        }
    }, []);

    // 재고 데이터를 가져오는 함수
    const fetchInventory = async () => {
        try {
            const response = await fetch('/api/inventory', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
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

    // 선택된 항목과 수량에 따라 입금금액 계산
    useEffect(() => {
        const selected = inventory.find((item) => item.item === selectedItem);
        if (selected) {
            setDepositAmount(selected.price * quantity);
        }
    }, [selectedItem, quantity, inventory]);

    // 주문을 처리하는 함수
    const handleOrder = async () => {
        try {
            const orderData = {
                item: selectedItem,
                quantity,
                totalAmount: depositAmount,
                paymentMethod,
                name,
                contact,
                deliveryLocation,
                status: '주문 완료',
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                setOrderSuccess(true); // 주문 성공 상태 업데이트
            } else {
                console.error('주문 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    };

    return (
        <div className="p-4">
            {isAdmin ? (
                <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    관리자 대시보드
                </button>
            ) : (
                <button onClick={() => router.push('/admin/login')} className="bg-blue-500 text-white rounded">
                    관리자 로그인
                </button>
            )}

            {/* 재고와 가격을 표시하는 부분 (유저가 볼 수 있도록) */}
            <div className="mt-6">
                <h2 className="text-xl mb-4">현재 재고 및 가격</h2>
                <div className="grid grid-cols-3 gap-4">
                    {inventory.map((item) => (
                        <div key={item.id} className="border p-4 rounded-lg">
                            <h3 className="font-bold">{item.item}</h3>
                            <p>수량: {item.quantity}</p>
                            <p>가격: {item.price} 원</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 주문 항목 선택 및 수량 입력 부분 */}
            <div className="mt-6">
                <h2 className="text-xl mb-4">주문 항목 선택</h2>
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
                <div className="mt-4">
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
                <div className="mt-4">
                    <label htmlFor="depositAmount" className="block">
                        입금 금액
                    </label>
                    <input
                        type="number"
                        id="depositAmount"
                        value={depositAmount}
                        readOnly
                        className="mt-2 p-2 border rounded"
                    />
                </div>
            </div>

            {/* 사용자 정보 입력 */}
            <div className="mt-6">
                <h2 className="text-xl mb-4">주문자 정보 입력</h2>
                <div>
                    <label htmlFor="name" className="block">
                        이름
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 p-2 border rounded"
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="contact" className="block">
                        연락처
                    </label>
                    <input
                        type="text"
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="mt-2 p-2 border rounded"
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="deliveryLocation" className="block">
                        배달 장소
                    </label>
                    <input
                        type="text"
                        id="deliveryLocation"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="mt-2 p-2 border rounded"
                    />
                </div>
            </div>

            {/* 결제 방법 선택 */}
            <div className="mt-6">
                <h2 className="text-xl mb-4">결제 방법 선택</h2>
                <div>
                    <label htmlFor="paymentMethod" className="block">
                        결제 방법
                    </label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as '입금 완료' | '현금 결제')}
                        className="mt-2 p-2 border rounded"
                    >
                        <option value="입금 완료">입금 완료</option>
                        <option value="현금 결제">현금 결제</option>
                    </select>
                </div>
            </div>

            {/* 주문 완료 버튼 및 알림 */}
            <div className="mt-6">
                <button onClick={handleOrder} className="bg-green-500 text-white px-4 py-2 rounded">
                    주문 완료
                </button>

                {orderSuccess && <p className="mt-4 text-green-500 font-bold">주문이 성공적으로 완료되었습니다!</p>}
            </div>
        </div>
    );
};

export default MainPage;

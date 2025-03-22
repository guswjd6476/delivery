'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const menu = [
    { item: '콤부차', price: 3000, picture: '/콤부차.jpeg' },
    { item: '김치참치주먹밥', price: 3000, picture: '/다운로드.jpeg' },
    { item: '주먹밥음료세트', price: 5000, picture: '/set.jpg' },
    { item: '향수', price: 15000, picture: '/parfum.jpg' },
];

const MainPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{ item: string; quantity: number; price: number }[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'입금 완료' | '현금 결제'>('입금 완료');
    const router = useRouter();

    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin');
        setIsAdmin(adminStatus === 'true');
    }, []);

    const handleAddItem = (item: string, price: number) => {
        setSelectedItems((prev) => {
            const existingItem = prev.find((i) => i.item === item);
            if (existingItem) {
                return prev.map((i) => (i.item === item ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...prev, { item, quantity: 1, price }];
        });
    };

    const handleRemoveItem = (item: string) => {
        setSelectedItems((prev) => prev.filter((i) => i.item !== item));
    };

    const totalAmount = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleOrder = async () => {
        if (selectedItems.length === 0) return alert('상품을 선택해주세요.');

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: selectedItems,
                    totalAmount,
                    paymentMethod,
                    name,
                    contact,
                    deliveryLocation,
                    status: '주문 완료',
                }),
            });
            if (response.ok) router.push('/order-success');
            else alert('주문 실패!');
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center space-y-6">
            <button
                onClick={() => router.push(isAdmin ? '/admin/dashboard' : '/admin/login')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 w-full max-w-sm"
            >
                {isAdmin ? '관리자 대시보드' : '관리자 로그인'}
            </button>

            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">메뉴</h2>
                <div className="space-y-4">
                    {menu.map(({ item, price, picture }) => (
                        <div key={item} className="flex items-center gap-4 p-2 border rounded-lg bg-gray-100">
                            <Image
                                src={picture}
                                alt={item}
                                width={50}
                                height={50}
                                className="cursor-pointer"
                                onClick={() => setSelectedImage(picture)}
                            />
                            <div>
                                <h3 className="font-bold">{item}</h3>
                                <p>{price} 원</p>
                            </div>
                            <button
                                onClick={() => handleAddItem(item, price)}
                                className="ml-auto bg-green-500 px-3 py-1 text-white rounded"
                            >
                                추가
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center">주문 목록</h2>
                    {selectedItems.map(({ item, quantity, price }) => (
                        <div key={item} className="flex justify-between p-2 border-b">
                            <p>
                                {item} x {quantity}
                            </p>
                            <button onClick={() => handleRemoveItem(item)} className="text-red-500">
                                삭제
                            </button>
                        </div>
                    ))}
                    <p className="text-right font-bold mt-2">총 금액: {totalAmount} 원</p>
                </div>
            )}

            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">주문하기</h2>
                <input
                    type="text"
                    placeholder="이름"
                    className="w-full p-2 border rounded mt-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="연락처"
                    className="w-full p-2 border rounded mt-2"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="배달 장소"
                    className="w-full p-2 border rounded mt-2"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                />
                <button
                    onClick={handleOrder}
                    className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 w-full"
                >
                    주문 완료
                </button>
            </div>
        </div>
    );
};

export default MainPage;

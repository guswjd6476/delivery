'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const menu = [
    { item: '콤부차', price1: 3000, price: 3000, picture: '/콤부차.jpeg' },
    { item: '김치참치주먹밥', price1: 3000, price: 3000, picture: '/다운로드.jpeg' },
    { item: '주먹밥음료세트', price1: 6000, price: 5000, picture: '/set.jpg' },
    { item: '향수', price1: 20000, price: 15000, picture: '/parfum.jpg' },
];

const MainPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string>('주먹밥');
    const [quantity, setQuantity] = useState<number>(1);
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<'입금 완료' | '현금 결제'>('입금 완료');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

    useEffect(() => {
        const selected = menu.find((item) => item.item === selectedItem);
        if (selected) {
            setDepositAmount(selected.price * quantity);
        }
    }, [selectedItem, quantity]);

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
                router.push('/order-success');
            } else {
                console.error('주문 처리에 실패했습니다.');
            }
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
                <h2 className="text-2xl font-bold text-gray-800 text-center">현재 재고 및 가격</h2>
                <div className="mt-4 space-y-4">
                    {menu.map((item) => (
                        <div key={item.item} className="flex items-center gap-4 p-2 border rounded-lg h-20 bg-gray-100">
                            <Image
                                src={item.picture}
                                alt={item.item}
                                width={30}
                                height={30}
                                className="rounded-lg cursor-pointer"
                                onClick={() => setSelectedImage(item.picture)}
                            />
                            <div>
                                <h3 className="font-bold text-gray-700 text-lg">{item.item}</h3>
                                <p className="text-gray-600">가격: {item.price} 원</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg relative">
                        <Image src={selectedImage} alt="상품 이미지" width={400} height={400} className="rounded-lg" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 text-red-500 text-lg"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 text-center">주문하기</h2>
                <div className="space-y-4">
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                        {menu.map((item) => (
                            <option key={item.item} value={item.item}>
                                {item.item}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                    />
                    <input type="number" className="w-full p-2 border rounded" value={depositAmount} readOnly />
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="연락처"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="배달 장소"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                    />
                    <select
                        className="w-full p-2 border rounded"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as '입금 완료' | '현금 결제')}
                    >
                        <option value="입금 완료">입금 완료</option>
                        <option value="현금 결제">현금 결제</option>
                    </select>
                </div>
                <button
                    onClick={handleOrder}
                    className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 w-full"
                >
                    주문 완료
                </button>
            </div>
        </div>
    );
};

export default MainPage;

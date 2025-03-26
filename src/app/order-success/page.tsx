'use client';

import { useRouter } from 'next/navigation';
const OrderSuccess = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="relative w-full max-w-lg bg-white p-8 rounded-lg shadow-lg text-center">
                {/* 배경 이미지 */}
                <div className="absolute inset-0"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-green-600">주문이 완료되었습니다!</h2>
                    <p className="mt-4 text-gray-700">배달 준비가 완료되면 연락드리겠습니다.</p>

                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;

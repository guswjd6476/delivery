'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const OrderSuccess = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="relative w-full max-w-lg bg-white p-8 rounded-lg shadow-lg text-center">
                {/* 배경 이미지 */}
                <div className="absolute inset-0">
                    <Image
                        src="/nowon.jpg"
                        alt="Nowon"
                        layout="fill"
                        objectFit="cover"
                        className="opacity-30 rounded-lg"
                    />
                </div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-green-600">주문이 완료되었습니다!</h2>
                    <p className="mt-4 text-gray-700">배달 준비가 완료되면 연락드리겠습니다.</p>
                    <p className="mt-4 text-lg font-semibold text-blue-700">
                        진짜배기 특전대 화이팅!
                        <br />
                        서야 청년회 화이팅!
                        <br />
                        노원지역 화이팅!
                    </p>
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

'use client';

import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    return (
        <div>
            <h1 className="text-2xl">관리자 대시보드</h1>
            <div className="mt-4">
                <button onClick={() => router.push('/orders')} className="p-2 bg-green-500 text-white rounded">
                    주문 내역 보기
                </button>
                <button onClick={() => router.push('/inventory')} className="p-2 bg-blue-500 text-white rounded ml-4">
                    재고 수정
                </button>
            </div>
        </div>
    );
};

export default Dashboard;

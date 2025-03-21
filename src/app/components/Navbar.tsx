'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
    const { data: session } = useSession(); // 세션 상태 확인

    return (
        <nav className="p-4 bg-blue-500 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    Nowon Delivery
                </Link>
                <div>
                    {!session ? (
                        <button onClick={() => signIn('credentials')} className="bg-green-500 p-2 rounded">
                            관리자 로그인
                        </button>
                    ) : (
                        <button onClick={() => signOut()} className="bg-red-500 p-2 rounded">
                            로그아웃
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

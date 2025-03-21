// src/app/api/auth/route.ts

import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

client.connect().catch((err) => console.error('Database connection error:', err));

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // 로그 추가 - 받은 데이터 확인
        console.log('Received login data:', { username, password });

        // 사용자 정보 조회
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            console.log('아이디가 존재하지 않음');
            return NextResponse.json({ message: '아이디가 존재하지 않습니다.' }, { status: 400 });
        }

        // 평문 비밀번호 비교
        if (password !== user.password) {
            console.log('비밀번호가 잘못됨');
            return NextResponse.json({ message: '비밀번호가 잘못되었습니다.' }, { status: 400 });
        }

        return NextResponse.json({
            message: '로그인 성공',
            user: { id: user.id, username: user.username },
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        return NextResponse.json({ message: '서버 오류. 다시 시도해 주세요.' }, { status: 500 });
    }
}

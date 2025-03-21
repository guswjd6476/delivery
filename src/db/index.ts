import { Client } from 'pg';

// PostgreSQL 연결
const client = new Client({
    connectionString: process.env.DATABASE_URL, // Vercel 환경 변수에서 데이터베이스 URL을 가져옵니다.
    ssl: { rejectUnauthorized: false }, // Vercel에서 SSL 연결을 요구할 수 있습니다.
});

client
    .connect()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Connection error', err.stack));

// 주문 추가 함수
export async function createOrder(item: string, quantity: number, payment: number) {
    const result = await client.query(
        'INSERT INTO orders (item, quantity, payment, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [item, quantity, payment, '배달 준비 중']
    );
    return result.rows[0];
}

// 재고 조회 함수
export async function getInventory() {
    const result = await client.query('SELECT * FROM inventory');
    return result.rows;
}

// 재고 업데이트 함수
export async function updateInventory(item: string, quantity: number, price: number) {
    const result = await client.query('UPDATE inventory SET 개수 = $1, 가격 = $2 WHERE item = $3 RETURNING *', [
        quantity,
        price,
        item,
    ]);
    return result.rows[0];
}

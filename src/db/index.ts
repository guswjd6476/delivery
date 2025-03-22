import { Client } from 'pg';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

client
    .connect()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Connection error', err.stack));

// 주문 추가 함수 (여러 개의 상품 저장)
export async function createOrder(
    items: { item: string; quantity: number; price: number }[],
    totalAmount: number,
    paymentMethod: string,
    name: string,
    contact: string,
    deliveryLocation: string
) {
    try {
        const result = await client.query(
            'INSERT INTO orders (items, total_amount, payment_method, name, contact, delivery_location, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [JSON.stringify(items), totalAmount, paymentMethod, name, contact, deliveryLocation, '배달 준비 중']
        );
        return result.rows[0];
    } catch (error) {
        console.error('주문 생성 오류:', error);
        throw new Error('주문 저장 실패');
    }
}

// 모든 주문 조회
export async function getOrders() {
    const result = await client.query('SELECT * FROM orders ORDER BY created_at DESC');
    return result.rows;
}

// 재고 조회
export async function getInventory() {
    const result = await client.query('SELECT * FROM inventory');
    return result.rows;
}

// 재고 업데이트
export async function updateInventory(item: string, quantity: number, price: number) {
    try {
        const result = await client.query(
            'UPDATE inventory SET quantity = $1, price = $2 WHERE item = $3 RETURNING *',
            [quantity, price, item]
        );
        return result.rows[0];
    } catch (error) {
        console.error('재고 업데이트 오류:', error);
        throw new Error('재고 업데이트 실패');
    }
}

// 배달 상태 업데이트
export async function updateOrderDeliveryStatus(id: number, delivered: boolean) {
    try {
        const result = await client.query('UPDATE orders SET delivered = $1 WHERE id = $2 RETURNING *', [
            delivered,
            id,
        ]);

        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    } catch (error) {
        console.error('배달 상태 업데이트 오류:', error);
        throw error;
    }
}

export default client;

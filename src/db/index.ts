import { Client } from 'pg';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

client
    .connect()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Connection error', err.stack));

// 주문 추가 함수
// 주문 생성 함수 수정
export async function createOrder(
    items: { item: string; quantity: number }[], // items 배열로 받음
    totalAmount: number, // 총 금액
    paymentMethod: string, // 결제 방법
    name: string,
    contact: string,
    deliveryLocation: string
) {
    const result = await client.query(
        'INSERT INTO orders (items, total_amount, payment_method, name, contact, delivery_location, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [JSON.stringify(items), totalAmount, paymentMethod, name, contact, deliveryLocation, '배달 준비 중']
    );
    return result.rows[0];
}

// 주문 조회 함수 수정
export async function getOrders() {
    const result = await client.query(
        'SELECT id, items, total_amount, payment_method, name, contact, delivery_location, status, created_at, delivered FROM orders ORDER BY created_at DESC'
    );
    return result.rows.map((order) => ({
        ...order,
        // order.items가 문자열이면 파싱하고, 이미 객체라면 그대로 사용
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    }));
}

// 재고 조회 함수
export async function getInventory() {
    const result = await client.query('SELECT * FROM inventory');
    return result.rows;
}

// 재고 업데이트 함수
export async function updateInventory(item: string, quantity: number, price: number) {
    try {
        const result = await client.query(
            'UPDATE inventory SET quantity = $1, price = $2 WHERE item = $3 RETURNING *',
            [quantity, price, item]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw new Error('재고 업데이트 오류');
    }
}
// 주문의 배달 상태를 업데이트하는 함수
export async function updateOrderDeliveryStatus(id: number, delivered: boolean) {
    console.log(`Updating order ${id} with delivered status: ${delivered}`);

    try {
        const result = await client.query('UPDATE orders SET delivered = $1 WHERE id = $2 RETURNING *', [
            delivered,
            id,
        ]);

        if (result.rows.length === 0) {
            console.log(`No order found with id ${id}`);
            return null; // 또는 오류 처리
        }

        console.log('Order updated successfully:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('배달 상태 업데이트 실패:', error);
        throw error;
    }
}

export default client;

import InventoryForm from './components/InventoryForm';
import OrderForm from './components/OrderForm';

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">주먹밥, 콤부차, 향수 판매</h1>

            <div className="space-y-8">
                <div>
                    <InventoryForm />
                </div>

                <div>
                    <OrderForm />
                </div>
            </div>
        </div>
    );
}

import BackButton from '@/shared/ui/BackButton';
import { BottomNav } from '@/shared/ui/BottomNav';

// Типізація для замовлення
interface OrderItem {
  id: number;
  date: string;
  title: string;
  author: string;
  condition: string;
  price: string;
  image: string;
  status: 'Reserved' | 'Completed';
}

const OrdersPage = () => {
  // Дані згідно з прототипом
  const orders: OrderItem[] = [
    {
      id: 1,
      date: '21.03.2025',
      title: 'Babel',
      author: 'Rebecca Kuang',
      condition: 'New',
      price: '300 UAH',
      image:
        'https://m.media-amazon.com/images/I/71uM-S699NL._AC_UF1000,1000_QL80_.jpg',
      status: 'Reserved',
    },
    {
      id: 2,
      date: '16.01.2025',
      title: 'Babel',
      author: 'Rebecca Kuang',
      condition: 'New',
      price: '300 UAH',
      image:
        'https://m.media-amazon.com/images/I/71uM-S699NL._AC_UF1000,1000_QL80_.jpg',
      status: 'Completed',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-10">
        <BackButton />
        <h1 className="text-xl font-semibold flex-1 text-center text-[#004261]">
          My Orders
        </h1>
        <div className="w-8"></div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="space-y-3">
            {/* Дата замовлення */}
            <div className="flex items-center">
              <span className="text-slate-400 font-medium text-sm">
                {order.date}
              </span>
              <div className="flex-1 border-b border-gray-100 ml-4"></div>
            </div>

            {/* Картка замовлення */}
            <OrderCard order={order} />
          </div>
        ))}
      </div>

      <BottomNav isProfilePage={false} />
    </div>
  );
};

// Допоміжний компонент картки
const OrderCard = ({ order }: { order: OrderItem }) => {
  const isReserved = order.status === 'Reserved';

  // Стилізація залежно від статусу
  const borderColor = isReserved ? 'border-[#A1D9D6]' : 'border-[#FFD9A1]';
  const badgeColor = isReserved
    ? 'bg-[#E6F4F4] text-[#008080]'
    : 'bg-gray-100 text-slate-500';

  return (
    <div
      className={`flex gap-4 p-4 border-2 ${borderColor} rounded-2xl shadow-sm relative`}
    >
      {/* Обкладинка */}
      <div className="w-24 h-36 shrink-0 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
        <img
          src={order.image}
          alt={order.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Інформація */}
      <div className="flex flex-col flex-1">
        {/* Статус */}
        <div className="flex justify-end mb-1">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}
          >
            {order.status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 leading-tight">
          {order.title}
        </h3>
        <p className="text-sm text-slate-500 italic mb-2">by {order.author}</p>

        <div className="space-y-0.5">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Condition:</span> {order.condition}
          </p>
          <p className="text-sm text-slate-600">
            <span className="font-medium">Price:</span>
          </p>
          <p className="text-lg font-bold text-[#004261]">{order.price}</p>
        </div>

        {/* Кнопка Contact (тільки для Reserved) */}
        {isReserved && (
          <button className="mt-3 w-full bg-[#004261] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#003550] transition-colors active:scale-[0.98]">
            Contact
          </button>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

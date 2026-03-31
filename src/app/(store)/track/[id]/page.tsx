import Link from 'next/link';
import { Package, Truck, CheckCircle2, Clock3, XCircle, ArrowLeft, MapPin, CreditCard, Wallet } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderRow {
  id: string;
  status: OrderStatus;
  total_amount: number;
  payment_method: string;
  delivery_address: string;
  customer_name: string;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products?: {
    title: string;
    image_url: string;
  } | null;
}

const STATUS_FLOW: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const statusDescriptions: Record<OrderStatus, string> = {
  Pending: 'We received your order and it is waiting for confirmation.',
  Processing: 'Your order is confirmed and being prepared with care.',
  Shipped: 'Your package is on the way to your delivery location.',
  Delivered: 'Your order has been delivered. Enjoy your purchase!',
  Cancelled: 'This order was cancelled. Contact support if you need help.',
};

function paymentMethodLabel(paymentMethod: string) {
  const labels: Record<string, string> = {
    COD: 'Cash on Delivery',
    BKASH: 'bKash',
    DIU_DELIVERY: 'In DIU Campus Delivery',
  };
  return labels[paymentMethod] || paymentMethod;
}

function paymentMethodIcon(paymentMethod: string) {
  if (paymentMethod === 'BKASH') return Wallet;
  return CreditCard;
}

function statusBadgeClass(status: OrderStatus) {
  const styles: Record<OrderStatus, string> = {
    Pending: 'bg-amber-100 text-amber-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-violet-100 text-violet-800',
    Delivered: 'bg-emerald-100 text-emerald-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  return styles[status];
}

function statusIcon(status: OrderStatus) {
  const icons: Record<OrderStatus, typeof Clock3> = {
    Pending: Clock3,
    Processing: Package,
    Shipped: Truck,
    Delivered: CheckCircle2,
    Cancelled: XCircle,
  };
  return icons[status];
}

export default async function TrackOrderResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shortId = id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  const supabase = await createClient();

  if (shortId.length !== 8) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Track Search
          </Link>

          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-pink-100 p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Invalid Order ID</h1>
            <p className="mt-3 text-gray-600">
              Please use the 8-character Order ID shown on your success page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { data: ordersData } = await supabase
    .from('orders')
    .select('id, status, total_amount, payment_method, delivery_address, customer_name, created_at')
    .eq('short_id', shortId)
    .order('created_at', { ascending: false })
    .limit(1);

  const order = (ordersData?.[0] as OrderRow | undefined) ?? null;

  if (!order) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Track Search
          </Link>

          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-pink-100 p-8 text-center">
            <Package className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Order Not Found</h1>
            <p className="mt-3 text-gray-600">
              We could not find an order with ID <span className="font-mono font-semibold">{shortId}</span>.
              Please check the ID and try again.
            </p>
            <Link
              href="/track"
              className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Another ID
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { data: itemsData } = await supabase
    .from('order_items')
    .select('id, quantity, price_at_purchase, products(title, image_url)')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true });

  const items = (itemsData as OrderItemRow[] | null) || [];
  const currentStatus = order.status;
  const currentStatusIndex = STATUS_FLOW.indexOf(currentStatus);
  const StatusIcon = statusIcon(currentStatus);
  const PaymentIcon = paymentMethodIcon(order.payment_method);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 px-4 py-10 sm:py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/track"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Track Search
        </Link>

        <section className="bg-white rounded-2xl border border-pink-100 shadow-xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 tracking-wider">ORDER TRACKING</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1 font-mono tracking-wider">
                {order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Placed by {order.customer_name} on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${statusBadgeClass(currentStatus)}`}>
              <StatusIcon className="w-4 h-4" />
              {currentStatus}
            </div>
          </div>

          <p className="text-gray-700 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-lg px-4 py-3">
            {statusDescriptions[currentStatus]}
          </p>

          {currentStatus !== 'Cancelled' && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
              {STATUS_FLOW.map((step, index) => {
                const active = index <= currentStatusIndex;
                const StepIcon = statusIcon(step);

                return (
                  <div
                    key={step}
                    className={`rounded-xl border p-4 transition-colors duration-200 ${
                      active
                        ? 'border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <StepIcon className={`w-5 h-5 ${active ? 'text-pink-600' : 'text-gray-400'}`} />
                      <span className={`text-xs font-semibold ${active ? 'text-pink-700' : 'text-gray-500'}`}>
                        Step {index + 1}
                      </span>
                    </div>
                    <p className={`mt-3 font-semibold ${active ? 'text-gray-900' : 'text-gray-500'}`}>{step}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl border border-pink-100 shadow-lg p-6 space-y-4 h-fit">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Grand Total</span>
              <span className="font-bold text-gray-900">Tk. {order.total_amount.toFixed(2)}</span>
            </div>

            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900 inline-flex items-center gap-2 text-right">
                <PaymentIcon className="w-4 h-4 text-pink-600" />
                {paymentMethodLabel(order.payment_method)}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Delivery Address</p>
              <p className="text-sm text-gray-900 leading-relaxed inline-flex gap-2">
                <MapPin className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                <span className="whitespace-pre-line">{order.delivery_address}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-pink-100 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Items Ordered</h2>

            {items.length === 0 ? (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-gray-600 text-sm">
                No order items were found for this order.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      {item.products?.image_url ? (
                        <img
                          src={item.products.image_url}
                          alt={item.products.title || 'Product image'}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-gray-900">{item.products?.title || 'Product'}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} x Tk. {item.price_at_purchase.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <p className="text-base font-bold text-pink-600">
                      Tk. {(item.quantity * item.price_at_purchase).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

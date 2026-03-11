'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronDown, Eye, AlertCircle, CheckCircle } from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  products?: {
    title: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  customer_name: string;
  whatsapp_number: string;
  delivery_address: string;
  total_amount: number;
  payment_method: string;
  bkash_last_3: string | null;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw new Error(ordersError.message);

      // Fetch order items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, products(title, image_url)');

      if (itemsError) throw new Error(itemsError.message);

      // Combine orders with their items
      const enrichedOrders = (ordersData || []).map((order) => ({
        ...order,
        order_items: (itemsData || []).filter((item) => item.order_id === order.id),
      }));

      setOrders(enrichedOrders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setStatusUpdating(orderId);
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw new Error(error.message);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      showToast('success', `Order status updated to "${newStatus}"`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      showToast('error', errorMessage);
    } finally {
      setStatusUpdating(orderId);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const openItemsModal = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateId = (id: string) => id.substring(0, 8).toUpperCase();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">View and manage customer orders</p>
      </div>

      {/* Flash Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`${
            toast.type === 'success'
              ? 'bg-green-50 border-l-4 border-green-600'
              : 'bg-red-50 border-l-4 border-red-600'
          } p-4 rounded-lg flex gap-3`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={
              toast.type === 'success' ? 'text-green-800 text-sm' : 'text-red-800 text-sm'
            }
          >
            {toast.message}
          </p>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No orders yet</p>
            <p className="text-gray-500 text-sm">Orders will appear here as customers place them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {/* Order ID */}
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-900">
                      {truncateId(order.id)}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>

                    {/* Customer Details */}
                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-gray-600 text-xs">{order.whatsapp_number}</p>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <p className="truncate" title={order.delivery_address}>
                        {order.delivery_address}
                      </p>
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </td>

                    {/* Payment Method */}
                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">
                          {order.payment_method === 'COD' ? 'Cash on Delivery' : 'bKash'}
                        </p>
                        {order.payment_method === 'BKASH' && order.bkash_last_3 && (
                          <p className="text-gray-600 text-xs">Last 3: {order.bkash_last_3}</p>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4 text-sm">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={statusUpdating === order.id}
                          className={`appearance-none px-3 py-2 pr-8 rounded-lg font-medium cursor-pointer transition-all ${getStatusColor(
                            order.status
                          )} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                      </div>
                    </td>

                    {/* View Items Button */}
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => openItemsModal(order)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors duration-200 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Items
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Items Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Order ID: <span className="font-mono font-semibold">{truncateId(selectedOrder.id)}</span>
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-light"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                <div className="space-y-4">
                  {selectedOrder.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Product Image */}
                      {item.products?.image_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.products.image_url}
                            alt={item.products.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900">
                          {item.products?.title || 'Product'}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-semibold text-gray-900">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-semibold text-gray-900">
                              ${item.price_at_purchase.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Subtotal</p>
                            <p className="font-semibold text-gray-900">
                              ${(item.quantity * item.price_at_purchase).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        ${(selectedOrder.total_amount - 5).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-gray-900">$5.00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-pink-600">
                        ${selectedOrder.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No items in this order</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

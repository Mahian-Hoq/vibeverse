import { Package, ShoppingCart, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  customer_name: string;
  status: string;
  created_at: string;
  total_amount: number;
}

interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    // Fetch total products count
    const { count: productCount, error: productError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productError) throw new Error(productError.message);

    // Fetch total orders count
    const { count: orderCount, error: orderError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (orderError) throw new Error(orderError.message);

    // Fetch total revenue (excluding cancelled orders)
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .neq('status', 'Cancelled');

    if (revenueError) throw new Error(revenueError.message);

    const totalRevenue = (revenueData || []).reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    );

    // Fetch recent 5 orders
    const { data: recentOrdersData, error: recentError } = await supabase
      .from('orders')
      .select('id, customer_name, status, created_at, total_amount')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw new Error(recentError.message);

    return {
      totalProducts: productCount || 0,
      totalOrders: orderCount || 0,
      totalRevenue: totalRevenue,
      recentOrders: (recentOrdersData || []) as Order[],
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
    };
  }
}

function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-700';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function getOrderIdShort(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export default async function AdminDashboard() {
  const { totalProducts, totalOrders, totalRevenue, recentOrders } =
    await getDashboardMetrics();

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Products',
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Admin!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your e-commerce platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className={`${stat.iconColor} w-6 h-6`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Order #{getOrderIdShort(order.id)}</p>
                      <p className="text-sm text-gray-500">{order.customer_name}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 ${getStatusColor(
                          order.status
                        )} text-xs font-medium rounded-full`}
                      >
                        {order.status}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mt-2">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

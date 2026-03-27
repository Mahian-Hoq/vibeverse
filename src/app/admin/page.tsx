import { Package, ShoppingCart, DollarSign } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import ProductSalesChart from '@/components/ProductSalesChart';

interface ProductSalesData {
  productName: string;
  totalQuantity: number;
}

interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  productSalesData: ProductSalesData[];
}

async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const supabase = await createClient();
    
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

    // Fetch product sales data
    const { data: orderItemsData, error: orderItemsError } = await supabase
      .from('order_items')
      .select('product_id, quantity, products(title)');

    if (orderItemsError) throw new Error(orderItemsError.message);

    // Aggregate data by product
    const productSalesMap = new Map<string, number>();
    (orderItemsData || []).forEach((item: any) => {
      const productName = item.products?.title || 'Unknown Product';
      const currentQuantity = productSalesMap.get(productName) || 0;
      productSalesMap.set(productName, currentQuantity + (item.quantity || 0));
    });

    // Convert map to array and sort by quantity descending
    const productSalesData: ProductSalesData[] = Array.from(productSalesMap)
      .map(([productName, totalQuantity]) => ({
        productName,
        totalQuantity,
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10); // Limit to top 10 products for readability

    return {
      totalProducts: productCount || 0,
      totalOrders: orderCount || 0,
      totalRevenue: totalRevenue,
      productSalesData,
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      productSalesData: [],
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

function getOrderIdShort(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

function formatCurrency(amount: number): string {
  return `Tk. ${amount.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function AdminDashboard() {
  const { totalProducts, totalOrders, totalRevenue, productSalesData } =
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

      {/* Product Sales Chart */}
      <ProductSalesChart initialData={productSalesData} />
    </div>
  );
}

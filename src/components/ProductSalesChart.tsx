'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loader } from 'lucide-react';

interface ProductSalesData {
  productName: string;
  totalQuantity: number;
}

interface ProductSalesChartProps {
  initialData: ProductSalesData[];
}

export default function ProductSalesChart({ initialData }: ProductSalesChartProps) {
  const [data, setData] = useState<ProductSalesData[]>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Data is already fetched server-side, just set it
    setData(initialData);
  }, [initialData]);

  // Custom tooltip for better formatting
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {payload[0].payload.productName}
          </p>
          <p className="text-sm font-semibold text-pink-600">
            {payload[0].value} units sold
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Product Sales Overview</h2>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader className="w-8 h-8 text-pink-600 animate-spin" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="productName"
                angle={-45}
                textAnchor="end"
                height={120}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                label={{ value: 'Total Quantity Sold', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="totalQuantity"
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
              {/* Gradient definition for bar color */}
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" />
                  <stop offset="95%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No sales data available yet</p>
          <p className="text-gray-400 text-sm mt-2">Orders will appear here as soon as products are sold</p>
        </div>
      )}

      {/* Summary Stats */}
      {data && data.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <p className="text-sm text-pink-700 font-medium">Total Products Sold</p>
            <p className="text-2xl font-bold text-pink-600 mt-2">
              {data.reduce((sum, item) => sum + item.totalQuantity, 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-sm text-purple-700 font-medium">Unique Products</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">{data.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">Avg Units/Product</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {(data.reduce((sum, item) => sum + item.totalQuantity, 0) / data.length).toFixed(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

type PaymentMethod = 'COD' | 'BKASH' | 'DIU_DELIVERY';

interface CartItemInput {
  id: string;
  price: number;
  quantity: number;
}

interface CreateOrderInput {
  name: string;
  whatsapp_number: string;
  delivery_address: string;
  payment_method: PaymentMethod;
  bkash_last_3?: string | null;
  total_amount: number;
  items: CartItemInput[];
}

interface CreateOrderResult {
  success?: boolean;
  orderId?: string;
  error?: string;
}

interface AdminOrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  products?: {
    title: string;
    image_url: string;
  };
}

interface AdminOrderRow {
  id: string;
  customer_name: string;
  whatsapp_number: string;
  delivery_address: string;
  total_amount: number;
  payment_method: string;
  bkash_last_3: string | null;
  status: string;
  created_at: string;
}

interface AdminOrderWithItems extends AdminOrderRow {
  order_items: AdminOrderItemRow[];
}

function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role configuration');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function createCheckoutOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    const supabase = createServiceRoleClient();

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: null,
          total_amount: input.total_amount,
          payment_method: input.payment_method,
          whatsapp_number: input.whatsapp_number,
          bkash_last_3: input.payment_method === 'BKASH' ? input.bkash_last_3 ?? null : null,
          delivery_address: input.delivery_address,
          customer_name: input.name,
          status: 'Pending',
        },
      ])
      .select('id')
      .single();

    if (orderError || !orderData) {
      return { error: orderError?.message || 'Failed to create order' };
    }

    const orderItems = input.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      await supabase.from('orders').delete().eq('id', orderData.id);
      return { error: itemsError.message || 'Failed to add items to order' };
    }

    return { success: true, orderId: orderData.id };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred while creating the order',
    };
  }
}

export async function getAdminOrders(): Promise<{ orders?: AdminOrderWithItems[]; error?: string }> {
  try {
    const supabase = createServiceRoleClient();

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      return { error: ordersError.message };
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*, products(title, image_url)');

    if (itemsError) {
      return { error: itemsError.message };
    }

    const enrichedOrders = (ordersData || []).map((order) => ({
      ...order,
      order_items: (itemsData || []).filter((item) => item.order_id === order.id),
    })) as AdminOrderWithItems[];

    return { orders: enrichedOrders };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch admin orders',
    };
  }
}

export async function updateAdminOrderStatus(
  orderId: string,
  newStatus: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update order status',
    };
  }
}
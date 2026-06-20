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
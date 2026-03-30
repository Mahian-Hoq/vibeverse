'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

interface UpdateProductInput {
  id: string;
  title: string;
  description: string;
  price: number;
  subcategory_id: string;
  tags: string[];
  in_stock: boolean;
  image_url?: string;
}

export async function updateProduct(input: UpdateProductInput) {
  const supabase = await createClient();

  const updatePayload: Omit<UpdateProductInput, 'id'> = {
    title: input.title,
    description: input.description,
    price: input.price,
    subcategory_id: input.subcategory_id,
    tags: input.tags,
    in_stock: input.in_stock,
    image_url: input.image_url,
  };

  if (!input.image_url) {
    delete updatePayload.image_url;
  }

  const { error } = await supabase
    .from('products')
    .update(updatePayload)
    .eq('id', input.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath(`/product/${input.id}`);

  return { success: true };
}
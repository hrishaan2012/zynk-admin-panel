import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type User = {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: 'customer' | 'driver' | 'admin'
  created_at: string
}

export type Product = {
  id: string
  category_id: string
  name: string
  description?: string
  image_url?: string
  price: number
  original_price?: number
  unit: string
  stock_quantity: number
  is_available: boolean
  is_featured: boolean
  created_at: string
}

export type Order = {
  id: string
  order_number: string
  user_id: string
  driver_id?: string
  status: string
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string
  payment_status: string
  created_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  icon_url?: string
  display_order: number
  is_active: boolean
}

# Zynk Quick Commerce - API Documentation

Complete API reference for all database operations using Supabase.

---

## Authentication

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'customer' // or 'driver', 'admin'
    }
  }
})
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut()
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

---

## Products

### Get All Products
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*, categories(name)')
  .eq('is_available', true)
  .order('created_at', { ascending: false })
```

### Get Product by ID
```typescript
const { data, error} = await supabase
  .from('products')
  .select('*, categories(name)')
  .eq('id', productId)
  .single()
```

### Get Products by Category
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*, categories(name)')
  .eq('category_id', categoryId)
  .eq('is_available', true)
```

### Search Products
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*, categories(name)')
  .ilike('name', `%${searchQuery}%`)
  .eq('is_available', true)
```

### Create Product (Admin)
```typescript
const { data, error } = await supabase
  .from('products')
  .insert([{
    name: 'Product Name',
    description: 'Product description',
    category_id: 'category-uuid',
    price: 9.99,
    original_price: 12.99,
    unit: 'piece',
    stock_quantity: 100,
    image_url: 'https://...',
    is_available: true,
    is_featured: false
  }])
```

### Update Product (Admin)
```typescript
const { data, error } = await supabase
  .from('products')
  .update({
    price: 8.99,
    stock_quantity: 150
  })
  .eq('id', productId)
```

### Delete Product (Admin)
```typescript
const { data, error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId)
```

---

## Categories

### Get All Categories
```typescript
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .eq('is_active', true)
  .order('display_order')
```

### Create Category (Admin)
```typescript
const { data, error } = await supabase
  .from('categories')
  .insert([{
    name: 'Category Name',
    slug: 'category-slug',
    icon_url: 'https://...',
    display_order: 1,
    is_active: true
  }])
```

---

## Cart

### Get User Cart
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .select('*, products(*)')
  .eq('user_id', userId)
```

### Add to Cart
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .upsert({
    user_id: userId,
    product_id: productId,
    quantity: 1
  }, {
    onConflict: 'user_id,product_id'
  })
```

### Update Cart Item Quantity
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .update({ quantity: newQuantity })
  .eq('id', cartItemId)
```

### Remove from Cart
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .delete()
  .eq('id', cartItemId)
```

### Clear Cart
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .delete()
  .eq('user_id', userId)
```

---

## Orders

### Create Order
```typescript
// 1. Create order
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert([{
    order_number: `ORD-${Date.now()}`,
    user_id: userId,
    delivery_address_id: addressId,
    subtotal: 50.00,
    delivery_fee: 5.00,
    total: 55.00,
    payment_method: 'card',
    status: 'pending'
  }])
  .select()
  .single()

// 2. Create order items
const { data: items, error: itemsError } = await supabase
  .from('order_items')
  .insert(cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.products.name,
    product_image: item.products.image_url,
    quantity: item.quantity,
    unit_price: item.products.price,
    total_price: item.products.price * item.quantity
  })))
```

### Get User Orders
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*, order_items(*, products(name, image_url))')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Get Order by ID
```typescript
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    users(full_name, email, phone),
    addresses(*),
    order_items(*, products(name, image_url))
  `)
  .eq('id', orderId)
  .single()
```

### Update Order Status (Admin/Driver)
```typescript
const { data, error } = await supabase
  .from('orders')
  .update({ status: 'confirmed' })
  .eq('id', orderId)
```

### Assign Driver to Order (Admin)
```typescript
const { data, error } = await supabase
  .from('orders')
  .update({
    driver_id: driverId,
    status: 'assigned'
  })
  .eq('id', orderId)
```

### Get Orders by Status (Admin)
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*, users(full_name), driver:users!driver_id(full_name)')
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
```

---

## Addresses

### Get User Addresses
```typescript
const { data, error } = await supabase
  .from('addresses')
  .select('*')
  .eq('user_id', userId)
  .order('is_default', { ascending: false })
```

### Add Address
```typescript
const { data, error } = await supabase
  .from('addresses')
  .insert([{
    user_id: userId,
    label: 'Home',
    address_line1: '123 Main St',
    address_line2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    latitude: 40.7128,
    longitude: -74.0060,
    is_default: true
  }])
```

### Update Address
```typescript
const { data, error } = await supabase
  .from('addresses')
  .update({
    address_line1: '456 Oak Ave',
    is_default: true
  })
  .eq('id', addressId)
```

### Delete Address
```typescript
const { data, error } = await supabase
  .from('addresses')
  .delete()
  .eq('id', addressId)
```

---

## Driver Operations

### Get Available Orders (Driver)
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*, users(full_name, phone), addresses(*)')
  .eq('status', 'ready')
  .is('driver_id', null)
  .order('created_at', { ascending: true })
```

### Accept Order (Driver)
```typescript
const { data, error } = await supabase
  .from('orders')
  .update({
    driver_id: driverId,
    status: 'assigned'
  })
  .eq('id', orderId)
```

### Update Driver Location
```typescript
const { data, error } = await supabase
  .from('driver_details')
  .update({
    current_latitude: latitude,
    current_longitude: longitude
  })
  .eq('user_id', driverId)
```

### Update Driver Availability
```typescript
const { data, error } = await supabase
  .from('driver_details')
  .update({ is_available: true })
  .eq('user_id', driverId)
```

### Get Driver Stats
```typescript
const { data, error } = await supabase
  .from('driver_details')
  .select('*')
  .eq('user_id', driverId)
  .single()
```

### Get Driver Orders
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*, users(full_name), addresses(*)')
  .eq('driver_id', driverId)
  .order('created_at', { ascending: false })
```

---

## Notifications

### Create Notification
```typescript
const { data, error } = await supabase
  .from('notifications')
  .insert([{
    user_id: userId,
    title: 'Order Confirmed',
    message: 'Your order has been confirmed',
    type: 'order',
    data: { order_id: orderId }
  }])
```

### Get User Notifications
```typescript
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(20)
```

### Mark Notification as Read
```typescript
const { data, error } = await supabase
  .from('notifications')
  .update({ is_read: true })
  .eq('id', notificationId)
```

---

## Promo Codes

### Validate Promo Code
```typescript
const { data, error } = await supabase
  .from('promo_codes')
  .select('*')
  .eq('code', promoCode)
  .eq('is_active', true)
  .lte('valid_from', new Date().toISOString())
  .gte('valid_until', new Date().toISOString())
  .single()
```

### Apply Promo Code
```typescript
// Check if code is valid and calculate discount
const discount = promoCode.discount_type === 'percentage'
  ? (subtotal * promoCode.discount_value / 100)
  : promoCode.discount_value

// Update promo code usage
await supabase
  .from('promo_codes')
  .update({ used_count: promoCode.used_count + 1 })
  .eq('id', promoCode.id)
```

---

## Reviews

### Create Review
```typescript
const { data, error } = await supabase
  .from('reviews')
  .insert([{
    order_id: orderId,
    user_id: userId,
    driver_id: driverId,
    rating: 5,
    comment: 'Great service!'
  }])
```

### Get Product Reviews
```typescript
const { data, error } = await supabase
  .from('reviews')
  .select('*, users(full_name)')
  .eq('order_id', orderId)
  .order('created_at', { ascending: false })
```

---

## Analytics (Admin)

### Get Total Revenue
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('total')
  .eq('payment_status', 'paid')

const totalRevenue = data?.reduce((sum, order) => sum + Number(order.total), 0)
```

### Get Orders Count by Status
```typescript
const { count, error } = await supabase
  .from('orders')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending')
```

### Get Popular Products
```typescript
const { data, error } = await supabase
  .from('order_items')
  .select('product_id, product_name, quantity')
  .order('quantity', { ascending: false })
  .limit(10)
```

### Get Daily Sales
```typescript
const today = new Date()
today.setHours(0, 0, 0, 0)

const { data, error } = await supabase
  .from('orders')
  .select('total')
  .gte('created_at', today.toISOString())
  .eq('payment_status', 'paid')
```

---

## Real-time Subscriptions

### Subscribe to Order Updates
```typescript
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'orders',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Order updated:', payload)
  })
  .subscribe()

// Unsubscribe
subscription.unsubscribe()
```

### Subscribe to New Orders (Admin/Driver)
```typescript
const subscription = supabase
  .channel('new-orders')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    console.log('New order:', payload.new)
  })
  .subscribe()
```

---

## Error Handling

All Supabase operations return an error object. Always check for errors:

```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error appropriately
  return
}

// Use data
console.log('Products:', data)
```

---

## Rate Limiting

Supabase has built-in rate limiting:
- **Free tier**: 500 requests per second
- **Pro tier**: 1000 requests per second

Implement client-side caching to reduce API calls.

---

## Best Practices

1. **Use Select Wisely**: Only select columns you need
```typescript
// Good
.select('id, name, price')

// Avoid
.select('*')
```

2. **Pagination**: Always paginate large datasets
```typescript
.range(0, 9) // First 10 items
.range(10, 19) // Next 10 items
```

3. **Indexes**: Ensure frequently queried columns are indexed

4. **RLS Policies**: Always enable Row Level Security for production

5. **Error Handling**: Always handle errors gracefully

6. **Caching**: Cache frequently accessed data

---

## Security Notes

- Never expose `service_role` key in client-side code
- Use `anon` key for client applications
- Enable RLS on all tables
- Validate all user inputs
- Use prepared statements to prevent SQL injection

---

**For more information, visit [Supabase Documentation](https://supabase.com/docs)**

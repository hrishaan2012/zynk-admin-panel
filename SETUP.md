# Zynk Quick Commerce - Complete Setup Guide

## 🚀 Quick Start

This guide will help you set up all three components of the Zynk Quick Commerce platform:
1. **Admin Panel** (Next.js)
2. **User App** (React Native/Expo)
3. **Driver App** (React Native/Expo)

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Expo CLI (for mobile apps): `npm install -g expo-cli`
- Git installed

---

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - **Name**: zynk-commerce
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users

### 1.2 Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Copy the entire content from `database/schema.sql`
3. Paste and click **Run**
4. Wait for completion (should see "Success" message)

### 1.3 Get API Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## Step 2: Set Up Admin Panel

### 2.1 Clone and Install

```bash
git clone https://github.com/hrishaan2012/zynk-admin-panel.git
cd zynk-admin-panel
npm install
```

### 2.2 Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2.3 Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

### 2.4 Deploy to Vercel (Optional)

```bash
npm install -g vercel
vercel
```

Follow prompts and add environment variables when asked.

---

## Step 3: Set Up User App

### 3.1 Clone and Install

```bash
git clone https://github.com/hrishaan2012/zynk-user-app.git
cd zynk-user-app
npm install
```

### 3.2 Configure Environment

Create `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3.3 Run on Device/Emulator

```bash
# Start Expo
npm start

# For iOS (Mac only)
npm run ios

# For Android
npm run android

# For web
npm run web
```

Scan QR code with Expo Go app (iOS/Android) to test on your phone.

---

## Step 4: Set Up Driver App

### 4.1 Clone and Install

```bash
git clone https://github.com/hrishaan2012/zynk-driver-app.git
cd zynk-driver-app
npm install
```

### 4.2 Configure Environment

Create `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4.3 Run on Device/Emulator

```bash
npm start
```

---

## Step 5: Add Sample Data

### 5.1 Create Admin User

In Supabase SQL Editor:

```sql
-- Create admin user (replace with your email)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@zynk.com', crypt('admin123', gen_salt('bf')), NOW());

-- Get the user ID and insert into users table
INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, 'Admin User', 'admin'
FROM auth.users
WHERE email = 'admin@zynk.com';
```

### 5.2 Add Sample Products

```sql
-- Add sample products
INSERT INTO public.products (category_id, name, description, price, unit, stock_quantity, is_available, image_url)
SELECT 
  c.id,
  'Fresh Milk',
  'Organic whole milk',
  2.99,
  'liter',
  100,
  true,
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'
FROM public.categories c
WHERE c.slug = 'fresh'
LIMIT 1;

INSERT INTO public.products (category_id, name, description, price, unit, stock_quantity, is_available, image_url)
SELECT 
  c.id,
  'Coca Cola',
  'Classic Coke 500ml',
  1.99,
  'bottle',
  200,
  true,
  'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'
FROM public.categories c
WHERE c.slug = 'drinks'
LIMIT 1;
```

---

## Step 6: Testing the Complete Flow

### 6.1 User App Flow

1. Open User App
2. Browse products by category
3. Add items to cart
4. Proceed to checkout
5. Place order

### 6.2 Admin Panel Flow

1. Login to Admin Panel
2. View dashboard with order stats
3. See new order appear in "Recent Orders"
4. Update order status to "ready"

### 6.3 Driver App Flow

1. Open Driver App
2. Toggle "Online" switch
3. See available orders
4. Accept an order
5. Update status: Picked Up → In Transit → Delivered

---

## Architecture Overview

```
┌─────────────────┐
│   User App      │ ← Customers browse & order
│  (React Native) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Supabase DB   │ ← Central database
│   + Auth        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│ Admin   │ │ Driver   │
│ Panel   │ │ App      │
└─────────┘ └──────────┘
```

---

## Features Implemented

### ✅ User App
- Product browsing with categories
- Search functionality
- Shopping cart
- Checkout process
- Order tracking
- User authentication

### ✅ Driver App
- Online/offline toggle
- Available orders queue
- Order acceptance
- Real-time location tracking
- Delivery status updates
- Earnings dashboard

### ✅ Admin Panel
- Real-time dashboard
- Order management
- Product management
- Driver management
- Analytics & reports
- User management

---

## Database Schema

### Main Tables
- `users` - All users (customers, drivers, admins)
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Order records
- `order_items` - Items in each order
- `cart_items` - Shopping cart
- `addresses` - Delivery addresses
- `driver_details` - Driver information
- `notifications` - Push notifications
- `reviews` - Order reviews

---

## Security Features

- Row Level Security (RLS) enabled
- User authentication via Supabase Auth
- Role-based access control
- Secure API endpoints
- Environment variable protection

---

## Next Steps

1. **Customize branding** - Update colors, logos, app names
2. **Add payment gateway** - Integrate Stripe/Razorpay
3. **Enable push notifications** - Set up Firebase/OneSignal
4. **Add Google Maps** - For real-time tracking
5. **Deploy to production** - Vercel (admin), App Store/Play Store (apps)

---

## Troubleshooting

### Common Issues

**Issue**: "Supabase connection failed"
- **Fix**: Check `.env` file has correct credentials
- Verify Supabase project is active

**Issue**: "No products showing"
- **Fix**: Run sample data SQL queries
- Check `is_available` is true

**Issue**: "Can't login"
- **Fix**: Create user in Supabase Auth
- Verify email is confirmed

---

## Support

- **Documentation**: [Supabase Docs](https://supabase.com/docs)
- **Expo Docs**: [Expo Documentation](https://docs.expo.dev)
- **Next.js Docs**: [Next.js Documentation](https://nextjs.org/docs)

---

## Repository Links

- **Admin Panel**: https://github.com/hrishaan2012/zynk-admin-panel
- **User App**: https://github.com/hrishaan2012/zynk-user-app
- **Driver App**: https://github.com/hrishaan2012/zynk-driver-app

---

**Built with ❤️ for quick commerce**

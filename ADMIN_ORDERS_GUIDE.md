# Admin Orders Management Page

## File Location
`app/admin/orders/page.tsx` (430 lines, 17KB)

## Features Implemented

### 1. **Orders Table Display**
- Displays all orders from Supabase `orders` table
- Sorted by creation date (newest first)
- Columns include:
  - **Order ID**: Shortened to first 8 characters in uppercase
  - **Date**: Formatted with timestamp (e.g., "Mar 12, 2026, 3:50 PM")
  - **Customer**: Name and WhatsApp number
  - **Address**: Truncated with tooltip on hover
  - **Total**: Order total amount with currency
  - **Payment Method**: "Cash on Delivery" or "bKash" (with last 3 digits if applicable)
  - **Status**: Dropdown selector (see below)
  - **Actions**: "View Items" button to open modal

### 2. **Real-Time Status Management**
- Status dropdown with 5 options:
  - Pending (yellow)
  - Processing (blue)
  - Shipped (purple)
  - Delivered (green)
  - Cancelled (red)
- Changes update Supabase `orders` table instantly
- Shows success toast on update
- Dropdown is disabled during update operation
- Status color-coded for visual clarity

### 3. **Order Items Modal**
- "View Items" button opens modal with detailed breakdown
- Shows each product in the order with:
  - Product thumbnail image
  - Product title
  - Quantity ordered
  - Price per unit
  - Subtotal for that item
- Order summary showing:
  - Subtotal (total - delivery)
  - Delivery cost (Tk. 100.00)
  - Grand total
- Modal can be closed via the X button or Close button

### 4. **Data Integration**
- Fetches orders with related items on component mount
- Joins `order_items` and `products` tables to get product details
- Enriches orders with their associated items

### 5. **Error Handling & Loading States**
- Loading spinner while fetching data
- Error message display if fetch fails
- Toast notifications for status updates (success/error)
- Disabled state on status dropdown during update
- Graceful handling of missing product data

### 6. **UI/UX Features**
- Responsive table design (horizontal scroll on mobile)
- Hover effects on table rows
- Color-coded status indicators
- Loading states and spinners
- Toast notifications that auto-dismiss after 3 seconds
- Modal with overlay and smooth interactions
- Consistent admin theme styling

## Database Tables Required

Two main tables needed:

### orders
```
- id (UUID)
- customer_name (VARCHAR)
- whatsapp_number (VARCHAR)
- delivery_address (TEXT)
- total_amount (DECIMAL)
- payment_method (VARCHAR: 'COD' or 'BKASH')
- bkash_last_3 (VARCHAR)
- status (VARCHAR: 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### order_items
```
- id (UUID)
- order_id (UUID FK → orders.id)
- product_id (UUID FK → products.id)
- quantity (INTEGER)
- price_at_purchase (DECIMAL)
- created_at (TIMESTAMP)
```

## Sidebar Integration
✅ Already linked in `app/admin/layout.tsx` as "Orders" with ShoppingCart icon

## How to Use

1. Navigate to Admin Dashboard
2. Click "Orders" in the sidebar
3. View all customer orders in table format
4. To change order status:
   - Click the status dropdown on any order row
   - Select new status ("Processing", "Shipped", "Delivered", etc.)
   - Status updates instantly in database
   - Success toast appears

5. To view order details:
   - Click "View Items" button on any order row
   - Modal opens showing all products in that order
   - See quantity, price, and subtotals
   - See order total breakdown
   - Click Close to exit modal

## API Calls Made
- `supabase.from('orders').select('*')` - Get all orders
- `supabase.from('order_items').select('*, products(title, image_url)')` - Get items with product details
- `supabase.from('orders').update({ status, updated_at })` - Update order status when dropdown changes

## State Management
- `orders[]` - Array of all orders with enriched items
- `loading` - Fetch loading state
- `error` - Error message if fetch fails
- `toast` - Flash notification object
- `selectedOrder` - Currently selected order for modal
- `showModal` - Modal visibility toggle
- `statusUpdating` - Track which order is being updated

## Styling
- Tailwind CSS with admin theme
- Responsive design (desktop/mobile)
- Color-coded status badges
- Consistent with existing admin pages (categories, products, etc.)
- Smooth transitions and hover effects

## Performance Considerations
- Single fetch on mount
- Optimistic UI updates for status changes
- Toast auto-dismissal after 3 seconds
- Modal lazy-loaded
- Efficient join query for products

## Future Enhancements
- Export orders to CSV/PDF
- Bulk status updates
- Order filters (by date, status, payment method)
- Search functionality
- Admin notes on orders
- Email notifications when status changes
- Refund management
- Order tracking for customers
